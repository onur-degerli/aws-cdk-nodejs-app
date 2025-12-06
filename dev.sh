#!/bin/bash
set -e

echo "🚀 Starting development environment..."

echo "🧹 Cleaning up old containers..."
docker compose down -v

echo "🏗️ Building images..."
docker compose build

echo "🐘 Starting PostgreSQL..."
docker compose up -d app-db

echo "⏳ Waiting for database to become healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' app-db)" == "healthy" ]; do
  sleep 2
done

echo "🧱 Running Prisma migrations..."
docker compose run --rm main-app pnpm --filter @app/orm exec prisma migrate deploy --schema prisma/schema.prisma

echo "⚙️ Generating Prisma client..."
docker compose run --rm main-app pnpm --filter @app/orm exec prisma generate --schema prisma/schema.prisma

echo "🌍 Starting full stack (app + db)..."
docker compose up

echo "✅ App is running! Visit http://localhost:3000"
