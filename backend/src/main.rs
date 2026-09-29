use axum::{
    extract::{Path, State},
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sqlx::{
    postgres::PgPoolOptions, FromRow, PgPool,
};
use tower_http::cors::CorsLayer;
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    db: PgPool,
    jwt_secret: String,
    gitea_url: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Claims {
    sub: Uuid,
    email: String,
    exp: i64,
}

#[derive(Deserialize)]
struct RegisterRequest {
    email: String,
    password: String,
    name: Option<String>,
}

#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize, FromRow, Clone)]
struct User {
    id: Uuid,
    email: String,
    name: String,
    created_at: chrono::DateTime<Utc>,
}

#[derive(FromRow)]
struct UserWithPassword {
    id: Uuid,
    email: String,
    password_hash: String,
    name: String,
    created_at: chrono::DateTime<Utc>,
}

#[derive(Serialize)]
struct AuthResponse {
    user: User,
    token: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

fn error_response(
    status: StatusCode,
    message: impl Into<String>,
) -> (StatusCode, Json<ErrorResponse>) {
    (status, Json(ErrorResponse { error: message.into() }))
}

fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    use argon2::{password_hash::SaltString, Argon2, PasswordHasher};
    use rand_core::OsRng;

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
}

fn verify_password(password: &str, hash: &str) -> bool {
    use argon2::{Argon2, PasswordHash, PasswordVerifier};

    if let Ok(parsed_hash) = PasswordHash::new(hash) {
        Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok()
    } else {
        false
    }
}

fn create_token(state: &AppState, user: &User) -> Result<String, jsonwebtoken::errors::Error> {
    let exp = (Utc::now() + Duration::hours(24)).timestamp();
    let claims = Claims {
        sub: user.id,
        email: user.email.clone(),
        exp,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
    )
}

fn extract_token(headers: &HeaderMap) -> Option<String> {
    headers
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(String::from)
}

async fn verify_token(
    state: &AppState,
    token: &str,
) -> Result<Claims, jsonwebtoken::errors::Error> {
    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(state.jwt_secret.as_bytes()),
        &Validation::default(),
    )?;
    Ok(data.claims)
}

// ============ HANDLERS ============

async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
    let email = payload.email.trim().to_lowercase();
    let password = payload.password.trim();
    let name = payload.name.unwrap_or_else(|| "Developer".to_string());

    if !email.contains('@') || password.len() < 8 {
        return error_response(
            StatusCode::BAD_REQUEST,
            "Valid email and password (min 8 chars) required",
        )
        .into_response();
    }

    let password_hash = match hash_password(password) {
        Ok(h) => h,
        Err(_) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Password hashing failed",
            )
            .into_response()
        }
    };

    let user = sqlx::query_as::<_, User>(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) \
         RETURNING id, email, name, created_at",
    )
    .bind(&email)
    .bind(&password_hash)
    .bind(&name)
    .fetch_one(&state.db)
    .await;

    match user {
        Ok(u) => match create_token(&state, &u) {
            Ok(token) => (
                StatusCode::CREATED,
                Json(AuthResponse { user: u, token }),
            )
            .into_response(),
            Err(_) => error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Token creation failed",
            )
            .into_response(),
        },
        Err(sqlx::Error::Database(e)) if e.constraint().is_some() => error_response(
            StatusCode::CONFLICT,
            "Email already registered",
        )
        .into_response(),
        Err(_) => error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Account creation failed",
        )
        .into_response(),
    }
}

async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    let email = payload.email.trim().to_lowercase();

    let user = sqlx::query_as::<_, UserWithPassword>(
        "SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1",
    )
    .bind(&email)
    .fetch_optional(&state.db)
    .await;

    match user {
        Ok(Some(u)) => {
            if !verify_password(&payload.password, &u.password_hash) {
                return error_response(StatusCode::UNAUTHORIZED, "Invalid credentials")
                    .into_response();
            }

            let user = User {
                id: u.id,
                email: u.email,
                name: u.name,
                created_at: u.created_at,
            };

            match create_token(&state, &user) {
                Ok(token) => (
                    StatusCode::OK,
                    Json(AuthResponse { user, token }),
                )
                .into_response(),
                Err(_) => error_response(
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Token creation failed",
                )
                .into_response(),
            }
        }
        _ => error_response(StatusCode::UNAUTHORIZED, "Invalid credentials").into_response(),
    }
}

async fn get_current_user(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let Some(token) = extract_token(&headers) else {
        return error_response(StatusCode::UNAUTHORIZED, "Token required").into_response();
    };

    let Ok(claims) = verify_token(&state, &token).await else {
        return error_response(StatusCode::UNAUTHORIZED, "Invalid token").into_response();
    };

    match sqlx::query_as::<_, User>("SELECT id, email, name, created_at FROM users WHERE id = $1")
        .bind(claims.sub)
        .fetch_optional(&state.db)
        .await
    {
        Ok(Some(user)) => Json(user).into_response(),
        _ => error_response(StatusCode::UNAUTHORIZED, "User not found").into_response(),
    }
}

async fn health() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "gitop-api",
        "version": "1.0.0",
        "runtime": "rust"
    }))
}

async fn gitea_repo_proxy(
    State(state): State<AppState>,
    Path((owner, repo)): Path<(String, String)>,
) -> impl IntoResponse {
    let url = format!(
        "{}/api/v1/repos/{}/{}",
        state.gitea_url.trim_end_matches('/'),
        owner,
        repo
    );

    match reqwest::get(&url).await {
        Ok(response) => {
            let status = StatusCode::from_u16(response.status().as_u16())
                .unwrap_or(StatusCode::BAD_GATEWAY);
            match response.json::<serde_json::Value>().await {
                Ok(json) => (status, Json(json)).into_response(),
                Err(_) => error_response(StatusCode::BAD_GATEWAY, "Invalid Gitea response")
                    .into_response(),
            }
        }
        Err(_) => error_response(StatusCode::SERVICE_UNAVAILABLE, "Gitea unavailable")
            .into_response(),
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL")?;
    let jwt_secret = std::env::var("JWT_SECRET")?;
    let gitea_url = std::env::var("GITEA_URL").unwrap_or_else(|_| "http://localhost:3000".into());
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await?;

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;

    let state = AppState {
        db: pool,
        jwt_secret,
        gitea_url,
    };

    let app = Router::new()
        .route("/api/health", get(health))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/me", get(get_current_user))
        .route("/api/gitea/repos/:owner/:repo", get(gitea_repo_proxy))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await?;
    tracing::info!("✨ GitOp API running on http://0.0.0.0:{}", port);

    axum::serve(listener, app).await?;
    Ok(())
}
