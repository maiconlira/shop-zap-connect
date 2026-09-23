<?php
require __DIR__ . '/config.php';

require_auth();

if (empty($_FILES['file'])) {
    json_out(['error' => 'Nenhum arquivo enviado'], 400);
}

$f = $_FILES['file'];

if ($f['error'] !== UPLOAD_ERR_OK) {
    json_out(['error' => 'Falha no upload (código ' . $f['error'] . ')'], 400);
}

if (MAX_UPLOAD_BYTES > 0 && $f['size'] > MAX_UPLOAD_BYTES) {
    json_out(['error' => 'Imagem excede o limite permitido'], 400);
}

// Valida que é uma imagem de verdade
$info = @getimagesize($f['tmp_name']);
if ($info === false) {
    json_out(['error' => 'O arquivo não é uma imagem válida'], 400);
}

$ext = image_type_to_extension($info[2], false) ?: 'jpg';

$dir = __DIR__ . '/../uploads/';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$name = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

if (!move_uploaded_file($f['tmp_name'], $dir . $name)) {
    json_out(['error' => 'Não foi possível salvar o arquivo no servidor'], 500);
}

// Monta a URL pública respeitando instalação em subpasta
$base = dirname($_SERVER['SCRIPT_NAME']); // ex: /api
$root = rtrim(dirname($base), '/');
json_out(['url' => $root . '/uploads/' . $name]);
