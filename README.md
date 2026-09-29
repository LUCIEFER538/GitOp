# 🚀 GitOp - Enterprise Git Platform

GitOp is a scalable, production-grade Git platform built with **Rust** backend, **React** frontend, **PostgreSQL** database, and integrated with **Gitea** for repository management.

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend API**: Rust + Axum (async, type-safe, secure)
- **Database**: PostgreSQL 16 (persistent user & auth)
- **Git Engine**: Gitea 1.22 (repos, SSH, webhooks)
- **Auth**: Argon2 password hashing + JWT tokens (24-hour expiry)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend)
- Rust 1.75+ (optional, for local backend development)

### Development Setup

```bash
# Clone and setup
git clone https://github.com/LUCIEFER538/GitOp.git
cd GitOp
cp .env.example .env

# Start services (PostgreSQL + Gitea)
docker compose up -d

# Wait for services to be ready (check Docker logs)
docker compose logs -f

# Install frontend dependencies
npm install

# Start frontend dev server (runs on http://localhost:5173)
npm run dev

# In another terminal, run Rust API (runs on http://localhost:8080)
cd backend
cargo run
```

### Access Points
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8080
- **Gitea**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## 📝 API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
{"email":"user@example.com","password":"secure123","name":"John"}

# Login
POST /api/auth/login
{"email":"user@example.com","password":"secure123"}

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Gitea Integration
```bash
# Get repository info (proxy to Gitea)
GET /api/gitea/repos/:owner/:repo
```

### Health Check
```bash
GET /api/health
```

## 🔐 Security

✅ **Argon2 Password Hashing**: Industry-standard, resistant to GPU attacks  
✅ **JWT Authentication**: Signed 24-hour tokens  
✅ **CORS Protection**: Configured for production  
✅ **SQL Injection Protection**: sqlx compile-time checked queries  
✅ **No Plain Passwords**: Never stored or transmitted  
✅ **Secure Headers**: Applied by reverse proxy

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🐳 Production Deployment

### Docker Build
```bash
docker build -t gitop:latest .
docker run -p 8080:8080 --env-file .env gitop:latest
```

### Environment Variables
```env
DATABASE_URL=postgres://user:pass@host:5432/gitop
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=8080
GITEA_URL=http://gitea:3000
GITEA_TOKEN=optional-admin-token
```

### Recommended Setup
1. PostgreSQL on managed service (AWS RDS, Google Cloud SQL)
2. Gitea in container or dedicated VM
3. API behind reverse proxy (nginx/Caddy) with TLS
4. Frontend deployed to CDN (Vercel, Netlify, Cloudflare)

## 📊 Features

- ✅ User registration & login with persistent database
- ✅ Real password hashing (Argon2)
- ✅ JWT-based session management
- ✅ Gitea repository proxy (read all repos)
- ✅ Type-safe Rust backend
- ✅ CORS-enabled API
- ✅ Docker Compose for local dev

## 🚧 Future Enhancements

- [ ] OAuth2 integration (GitHub, GitLab, Google)
- [ ] 2FA/TOTP support
- [ ] Repository create/delete endpoints
- [ ] Pull request management
- [ ] Issue tracking
- [ ] Webhook management
- [ ] Team collaboration
- [ ] Advanced permissions model

## 🤝 Contributing

Fork the repo, create a feature branch, and submit a PR.

## 📄 License

MIT License - See LICENSE file

## 🔗 Links

- [Gitea Documentation](https://docs.gitea.io)
- [Axum Web Framework](https://github.com/tokio-rs/axum)
- [SQLx Database Toolkit](https://github.com/launchbadge/sqlx)
