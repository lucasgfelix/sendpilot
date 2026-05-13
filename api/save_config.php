<?php
header('Content-Type: application/json');

/**
 * SendPilot — save_config.php
 * Endpoint para salvar as configurações de e-mail enviadas pela tela de setup.
 */

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.']);
    exit;
}

$email = trim($data['email'] ?? '');
$pass  = trim($data['pass'] ?? '');
$name  = trim($data['name'] ?? 'Externato Santo Antonio');

if (empty($email) || empty($pass)) {
    echo json_encode(['success' => false, 'error' => 'E-mail e Senha são obrigatórios.']);
    exit;
}

// Escapa aspas para evitar quebra do arquivo PHP
$emailEsc = str_replace("'", "\'", $email);
$passEsc  = str_replace("'", "\'", $pass);
$nameEsc  = str_replace("'", "\'", $name);

// Template do arquivo config.php
$configContent = "<?php
// ================================================================
//  CONFIGURAÇÕES SMTP — SendPilot (Gerado via Setup)
// ================================================================

// Configurações padrão para Google Workspace / Gmail
define('SMTP_HOST',   'smtp.gmail.com');
define('SMTP_PORT',   587);
define('SMTP_SECURE', 'tls');

// Credenciais da conta de e-mail
define('SMTP_USER',   '{$emailEsc}');
define('SMTP_PASS',   '{$passEsc}');

// Como aparecerá para quem receber o e-mail
define('SENDER_EMAIL', '{$emailEsc}');
define('SENDER_NAME',  '{$nameEsc}');
";

try {
    $filePath = __DIR__ . '/config.php';
    if (file_put_contents($filePath, $configContent)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Não foi possível escrever no arquivo config.php. Verifique as permissões de pasta.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
