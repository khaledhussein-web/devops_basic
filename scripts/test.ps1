docker-compose down -v
docker-compose up -d --build

# Wait for MySQL to be ready (max 60 seconds)
$max = 60
for ($i = 1; $i -le $max; $i++) {
     docker exec ci-cd-mysql-1 mysqladmin ping -h 127.0.0.1 -uroot -proot --silent 2>$null
    if ($LASTEXITCODE -eq 0) { 
        Write-Host "✅ MySQL is ready"
    break
  }
  Start-Sleep -Seconds 1
  if ($i -eq $max) {
    Write-Host "❌ MySQL not ready in time"
    docker-compose logs mysql
    docker-compose down -v
    exit 1
  }
}

# Run tests
docker-compose run --rm tester
$exitCode = $LASTEXITCODE

docker-compose down -v
exit $exitCode
