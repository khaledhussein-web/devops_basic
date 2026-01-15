#!/bin/bash
set -e

echo "== Start stack =="
docker compose -f docker-compose.ci.yml up -d --build mysql php

echo "== Run tests =="
docker compose -f docker-compose.ci.yml run --rm tester

echo "== Done =="
docker compose -f docker-compose.ci.yml down -v
