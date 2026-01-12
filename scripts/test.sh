#!/bin/bash
set -e

echo "== Start stack =="
docker compose up -d --build

echo "== Run tests =="
docker compose run --rm tester

echo "== Done =="
docker compose down -v