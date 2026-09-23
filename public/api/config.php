<?php
// ============================================================
//  CONFIGURAÇÃO DO BANCO DE DADOS — SMARTCELL
//  Edite APENAS as 4 linhas abaixo com os dados do seu banco
//  MySQL da Hostinger (hPanel → Bancos de Dados → MySQL).
// ============================================================
define('DB_HOST', 'localhost');                 // geralmente "localhost"
define('DB_NAME', 'u000000000_smartcell');      // nome do banco de dados
define('DB_USER', 'u000000000_smartcell');      // usuário do banco
define('DB_PASS', 'TROQUE_ESTA_SENHA');         // senha do banco

// Credenciais do painel administrativo
define('ADMIN_USER', 'smartcell');
define('ADMIN_PASS', 'smart123');

// Tamanho máximo de upload de imagem (0 = sem limite; o limite real
// fica a cargo das configurações do PHP no servidor)
define('MAX_UPLOAD_BYTES', 0);

header('Content-Type: application/json; charset=utf-8');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        init_schema($pdo);
    }
    return $pdo;
}

function init_schema(PDO $pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        n INT AUTO_INCREMENT UNIQUE,
        id VARCHAR(80) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        category VARCHAR(120) NOT NULL,
        description TEXT,
        image TEXT,
        compatibility TEXT,
        promo TINYINT(1) NOT NULL DEFAULT 0,
        discount INT NOT NULL DEFAULT 0,
        promo_tag VARCHAR(80) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_tokens (
        token VARCHAR(64) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

function json_out($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_auth(): void {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? ($headers['Authorization'] ?? $headers['authorization'] ?? '');
    if (!preg_match('/Bearer\s+([a-f0-9]+)/i', $auth, $m)) {
        json_out(['error' => 'Não autorizado'], 401);
    }
    $stmt = db()->prepare("SELECT token FROM admin_tokens WHERE token = ?");
    $stmt->execute([$m[1]]);
    if (!$stmt->fetch()) {
        json_out(['error' => 'Sessão expirada, faça login novamente'], 401);
    }
}

function row_to_product(array $r): array {
    $p = [
        'id'          => $r['id'],
        'name'        => $r['name'],
        'price'       => (float) $r['price'],
        'category'    => $r['category'],
        'description' => $r['description'] ?? '',
        'image'       => $r['image'] ?? '',
        'promo'       => (bool) $r['promo'],
        'discount'    => (int) $r['discount'],
        'promoTag'    => $r['promo_tag'] ?? '',
    ];
    if (!empty($r['compatibility'])) {
        $compat = json_decode($r['compatibility'], true);
        if (is_array($compat)) $p['compatibility'] = $compat;
    }
    return $p;
}

function upsert_product(PDO $pdo, array $b): void {
    if (empty($b['id']) || empty($b['name'])) {
        json_out(['error' => 'Produto inválido: id e nome são obrigatórios'], 400);
    }
    $stmt = $pdo->prepare("INSERT INTO products
        (id, name, price, category, description, image, compatibility, promo, discount, promo_tag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name=VALUES(name), price=VALUES(price), category=VALUES(category),
        description=VALUES(description), image=VALUES(image),
        compatibility=VALUES(compatibility), promo=VALUES(promo),
        discount=VALUES(discount), promo_tag=VALUES(promo_tag)");
    $stmt->execute([
        $b['id'],
        $b['name'],
        (float) ($b['price'] ?? 0),
        $b['category'] ?? '',
        $b['description'] ?? '',
        $b['image'] ?? '',
        !empty($b['compatibility']) ? json_encode($b['compatibility']) : null,
        !empty($b['promo']) ? 1 : 0,
        (int) ($b['discount'] ?? 0),
        $b['promoTag'] ?? '',
    ]);
}
