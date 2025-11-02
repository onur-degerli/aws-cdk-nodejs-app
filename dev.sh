#!/bin/bash
set -e

echo "🚀 Starting development environment..."

echo "🧹 Cleaning up old containers..."
docker compose down -v

echo "🏗️ Building images..."
docker compose build

echo "🐘 Starting PostgreSQL..."
docker compose up -d db

echo "⏳ Waiting for database to become healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' local-postgres)" == "healthy" ]; do
  sleep 2
done

echo "🧱 Running Prisma migrations..."
docker compose run --rm app npx prisma migrate deploy

echo "⚙️ Generating Prisma client..."
docker compose run --rm app npx prisma generate

echo "🌍 Starting full stack (app + db)..."
docker compose up

echo "✅ App is running! Visit http://localhost:3000"
