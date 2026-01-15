<?php
require 'config.php';

$stmt = $pdo->query("SELECT message FROM messages LIMIT 1");
$row = $stmt->fetch(PDO::FETCH_ASSOC);

echo $row['message'];