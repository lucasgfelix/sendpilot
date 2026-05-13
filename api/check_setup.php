<?php
header('Content-Type: application/json');

/**
 * SendPilot — check_setup.php
 * Verifica se as credenciais SMTP já foram configuradas.
 */

require_once 'config.php';

// Consideramos que o setup é necessário se o SMTP_USER ou SMTP_PASS estiverem vazios
// ou se forem placeholders genéricos.
$isConfigured = !empty(SMTP_USER) && !empty(SMTP_PASS) && SMTP_PASS !== 'COLE_AQUI_A_SENHA_DO_EMAIL';

echo json_encode([
    'configured' => $isConfigured,
    'email' => SMTP_USER,
    'name' => SENDER_NAME
]);
