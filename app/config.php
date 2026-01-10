<?php
$host = "mysql";     
$db   = "testdb";
$user = "testuser";
$pass = "testpass";
try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user,
        $pass
    );
} catch (PDOException $e) {
    echo "Database connection failed";
    exit;
}
