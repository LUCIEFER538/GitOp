# Build stage
FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src
COPY backend/migrations ./migrations
RUN apk add --no-cache postgresql-client
RUN cargo build --release

# Runtime stage
FROM alpine:3.18
RUN apk add --no-cache ca-certificates postgresql-client
COPY --from=builder /app/target/release/gitop-api /usr/local/bin/
EXPOSE 8080
CMD ["gitop-api"]
