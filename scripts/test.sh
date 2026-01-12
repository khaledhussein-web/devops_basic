echo "== Wait for MySQL (max 120s) =="
MYSQL_CONTAINER="$(docker-compose ps -q mysql)"

for i in {1..120}; do
  if docker exec "$MYSQL_CONTAINER" mysqladmin ping --silent >/dev/null 2>&1; then
    echo "MySQL is ready"
    break
  fi

  sleep 1
  if [ "$i" -eq 120 ]; then
    echo "MySQL not ready in time"
    docker-compose logs mysql || true
    docker-compose down -v || true
    exit 1
  fi
done
