<?php
require __DIR__ . '/config.php';

$b = body();

if (($b['user'] ?? '') === ADMIN_USER && ($b['pass'] ?? '') === ADMIN_PASS) {
    $token = bin2hex(random_bytes(24));
    db()->prepare("INSERT INTO admin_tokens (token) VALUES (?)")->execute([$token]);
    json_out(['token' => $token]);
}

json_out(['error' => 'Usuário ou senha incorretos'], 401);
