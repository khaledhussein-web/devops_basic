#!/usr/bin/env bash
set -euo pipefail

echo "== Clean start =="
docker compose down -v || true

echo "== Start stack =="
docker compose up -d --build

echo "== Wait for MySQL (max 60s) =="
for i in {1..60}; do
  if docker exec ci-cd-mysql-1 mysqladmin ping -h 127.0.0.1 -uroot -proot --silent >/dev/null 2>&1; then
    echo "MySQL is ready"
    break
  fi
  sleep 1
  if [ "$i" -eq 60 ]; then
    echo "MySQL not ready in time"
    docker compose logs mysql || true
    docker compose down -v || true
    exit 1
  fi
done

echo "== Run tests =="
docker compose run --rm tester

echo "== Cleanup =="
docker compose down -v
