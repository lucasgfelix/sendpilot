<?php
/**
 * SendPilot — send.php
 * Endpoint de envio de e-mail.
 *
 * Recebe via POST (JSON):
 *   - email   : endereço do destinatário
 *   - name    : nome do destinatário
 *   - subject : assunto do e-mail
 *   - body    : corpo da mensagem (texto puro, com \n para quebras)
 *
 * Retorna JSON:
 *   - { success: true }
 *   - { success: false, error: "mensagem de erro" }
 *
 * Dependências: PHPMailer (em vendor/PHPMailer/)
 */

// ── Cabeçalhos HTTP ──────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ── Dependências ─────────────────────────────────────────────
require_once 'config.php';
require 'vendor/PHPMailer/src/Exception.php';
require 'vendor/PHPMailer/src/PHPMailer.php';
require 'vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ── Leitura e validação da requisição ────────────────────────
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Nenhum dado recebido.']);
    exit;
}

$toEmail = trim($data['email']   ?? '');
$toName  = trim($data['name']    ?? '');
$subject = trim($data['subject'] ?? '');
$body    = trim($data['body']    ?? '');

// Garante que os campos obrigatórios foram enviados
if (empty($toEmail) || empty($subject) || empty($body)) {
    echo json_encode(['success' => false, 'error' => 'Campos obrigatórios ausentes (email, subject, body).']);
    exit;
}

// ── Configuração e envio via PHPMailer ───────────────────────
$mail = new PHPMailer(true); // true = habilita exceções

try {
    // Configuração do servidor SMTP (credenciais via config.php)
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE; // 'tls' (porta 587) ou 'ssl' (porta 465)
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // Remetente e destinatário
    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->addAddress($toEmail, $toName);

    // Tipo de conteúdo: HTML com fallback em texto puro
    $mail->isHTML(true);
    $mail->Subject = $subject;

    // Converte quebras de linha em <br> para exibição correta no cliente de e-mail
    $htmlBody = nl2br(htmlspecialchars($body, ENT_QUOTES, 'UTF-8'));

    // ── Template HTML do E-mail ──────────────────────────────
    // Layout baseado em <table> para máxima compatibilidade
    // com clientes de e-mail (Gmail, Outlook, Apple Mail, etc.)
    $mail->Body = "
<!DOCTYPE html>
<html lang='pt-BR'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>{$subject}</title>
</head>
<body style='margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;'>

  <!-- Wrapper externo -->
  <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#f4f6f9;padding:40px 20px;'>
    <tr>
      <td align='center'>

        <!-- Card branco (600px de largura máxima) -->
        <table width='600' cellpadding='0' cellspacing='0' border='0'
          style='max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>

          <!-- Cabeçalho com gradiente azul e logotipo da escola -->
          <tr>
            <td style='background:linear-gradient(135deg,#1a56b0 0%,#2563eb 100%);padding:36px 40px;text-align:center;'>
              <table width='100%' cellpadding='0' cellspacing='0' border='0'>
                <tr>
                  <td align='center' style='padding-bottom:14px;'>
                    <div style='display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:54px;height:54px;line-height:54px;text-align:center;'>
                      <span style='font-size:24px;'>✉️</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align='center'>
                    <h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;'>
                      Externato Santo Antonio
                    </h1>
                    <p style='margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;'>
                      Comunicado Oficial
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Saudação personalizada com o nome do responsável -->
          <tr>
            <td style='padding:36px 40px 0;'>
              <p style='margin:0;font-size:16px;color:#1e293b;font-weight:600;'>
                Prezado(a) responsável, <span style='color:#2563eb;'>{$toName}</span>,
              </p>
            </td>
          </tr>

          <!-- Corpo da mensagem (texto enviado pela atendente) -->
          <tr>
            <td style='padding:20px 40px 32px;'>
              <div style='font-size:15px;color:#475569;line-height:1.75;'>
                {$htmlBody}
              </div>
            </td>
          </tr>

          <!-- Linha divisória -->
          <tr>
            <td style='padding:0 40px;'>
              <hr style='border:none;border-top:1px solid #e2e8f0;margin:0;'>
            </td>
          </tr>

          <!-- Assinatura com nome da equipe e selo ESA -->
          <tr>
            <td style='padding:24px 40px;'>
              <table width='100%' cellpadding='0' cellspacing='0' border='0'>
                <tr>
                  <td style='vertical-align:middle;'>
                    <p style='margin:0;font-size:14px;font-weight:700;color:#1e293b;'>Equipe Externato Santo Antonio</p>
                    <p style='margin:2px 0 0;font-size:13px;color:#94a3b8;'>Atendimento</p>
                  </td>
                  <td align='right' style='vertical-align:middle;'>
                    <div style='background:#1a56b0;border-radius:8px;padding:8px 16px;display:inline-block;'>
                      <span style='color:#ffffff;font-size:13px;font-weight:700;'>ESA</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Rodapé com aviso de não-responder -->
          <tr>
            <td style='background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;border-radius:0 0 12px 12px;text-align:center;'>
              <p style='margin:0;font-size:12px;color:#94a3b8;line-height:1.6;'>
                Este é um comunicado oficial enviado pelo Externato Santo Antonio.<br>
                Por favor, não responda diretamente a este e-mail.
              </p>
            </td>
          </tr>

        </table><!-- /Card -->

        <!-- Copyright externo ao card -->
        <p style='margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;'>
          © " . date('Y') . " Externato Santo Antonio · Todos os direitos reservados
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
";

    // Texto puro como fallback para clientes que não suportam HTML
    $mail->AltBody = strip_tags(str_replace('<br>', "\n", $body));

    $mail->send();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // Retorna a mensagem de erro detalhada do PHPMailer para facilitar debug
    echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
}
