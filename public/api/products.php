<?php
require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET é público — a loja precisa listar os produtos
if ($method === 'GET') {
    $rows = db()->query("SELECT * FROM products ORDER BY n ASC")->fetchAll(PDO::FETCH_ASSOC);
    json_out(array_map('row_to_product', $rows));
}

// Escrita exige login
require_auth();

if ($method === 'POST') {
    $b = body();
    $pdo = db();

    // Aceita um produto único OU { products: [...] } (importação em lote)
    if (isset($b['products']) && is_array($b['products'])) {
        $pdo->beginTransaction();
        try {
            foreach ($b['products'] as $p) {
                if (is_array($p)) upsert_product($pdo, $p);
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_out(['error' => 'Falha ao importar produtos'], 500);
        }
        json_out(['ok' => true, 'count' => count($b['products'])]);
    }

    upsert_product($pdo, $b);
    json_out(['ok' => true]);
}

if ($method === 'DELETE') {
    $pdo = db();
    if (isset($_GET['all'])) {
        $pdo->exec("DELETE FROM products");
        json_out(['ok' => true]);
    }
    $id = $_GET['id'] ?? '';
    if ($id === '') json_out(['error' => 'Informe o id'], 400);
    $pdo->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    json_out(['ok' => true]);
}

json_out(['error' => 'Método não suportado'], 405);
