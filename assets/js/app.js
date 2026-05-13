/**
 * SendPilot — app.js
 * Lógica principal da interface: upload de planilha, renderização
 * da tabela de destinatários, pré-visualização de e-mail e disparo em lote.
 *
 * Dependências externas (carregadas via CDN no HTML):
 *  - SheetJS  (XLSX)      : leitura de arquivos .xlsx/.xls no navegador
 *  - SweetAlert2 (Swal)   : notificações e modais de confirmação
 */

// =============================================================
//  PRÉ-VISUALIZAÇÃO DE E-MAIL
//  Funções globais chamadas diretamente pelos botões de aba no HTML
// =============================================================

/**
 * Alterna entre os painéis "Escrever" e "Pré-visualizar".
 * Quando muda para preview, constrói o HTML do e-mail e injeta
 * no <iframe> via srcdoc (não faz requisição ao servidor).
 *
 * @param {'write'|'preview'} tab - Aba a ser exibida
 */
function switchTab(tab) {
    const panelWrite   = document.getElementById('panel-write');
    const panelPreview = document.getElementById('panel-preview');
    const tabWrite     = document.getElementById('tab-write');
    const tabPreview   = document.getElementById('tab-preview');
    const frame        = document.getElementById('email-preview-frame');
    const subject      = document.getElementById('email-subject').value;
    const body         = document.getElementById('email-body').value;

    if (tab === 'preview') {
        // Impede preview sem conteúdo
        if (!body.trim()) {
            Swal.fire({
                icon: 'info',
                title: 'Escreva a mensagem primeiro',
                toast: true, position: 'top-end',
                showConfirmButton: false, timer: 2500
            });
            return;
        }

        // Usa o primeiro contato da lista como exemplo; senão usa placeholder
        const contacts = window._contacts || [];
        const example  = contacts.length
            ? contacts[0]
            : { nome: 'Maria da Silva', email: 'exemplo@email.com' };

        document.getElementById('preview-recipient').textContent = example.nome;

        // Substitui {nome} e quebras de linha antes de montar o HTML
        const htmlBody = body
            .replace(/\n/g, '<br>')
            .replace(/\{nome\}/g, example.nome);

        frame.srcdoc = buildPreviewHtml(example.nome, subject, htmlBody);

        // Troca visibilidade dos painéis e estado das abas
        panelWrite.classList.add('hidden');
        panelPreview.classList.remove('hidden');
        tabWrite.classList.remove('compose__tab--active');
        tabPreview.classList.add('compose__tab--active');

    } else {
        // Volta para o painel de escrita
        panelPreview.classList.add('hidden');
        panelWrite.classList.remove('hidden');
        tabPreview.classList.remove('compose__tab--active');
        tabWrite.classList.add('compose__tab--active');
    }
}

/**
 * Constrói o HTML completo do e-mail para ser exibido no iframe de preview.
 * Este template é um espelho fiel do template enviado pelo backend (send.php).
 * Usa layout baseado em <table> para compatibilidade com clientes de e-mail.
 *
 * @param {string} name     - Nome do destinatário
 * @param {string} subject  - Assunto do e-mail
 * @param {string} htmlBody - Corpo já processado (com <br> e {nome} substituídos)
 * @returns {string} HTML completo do e-mail
 */
function buildPreviewHtml(name, subject, htmlBody) {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || '(sem assunto)'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

  <!-- Wrapper externo com fundo cinza -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">

      <!-- Card branco centralizado (600px) -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <!-- Cabeçalho com gradiente azul -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a56b0 0%,#2563eb 100%);padding:36px 40px;text-align:center;">
            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:54px;height:54px;line-height:54px;text-align:center;margin:0 auto 14px;">
              <span style="font-size:24px;">✉️</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Externato Santo Antonio</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Comunicado Oficial</p>
          </td>
        </tr>

        <!-- Saudação personalizada com o nome do responsável -->
        <tr>
          <td style="padding:36px 40px 0;">
            <p style="margin:0;font-size:16px;color:#1e293b;font-weight:600;">
              Prezado(a) responsável, <span style="color:#2563eb;">${name}</span>,
            </p>
          </td>
        </tr>

        <!-- Corpo da mensagem -->
        <tr>
          <td style="padding:20px 40px 32px;">
            <div style="font-size:15px;color:#475569;line-height:1.75;">
              ${htmlBody || '<em style="color:#94a3b8">Corpo do e-mail aparecerá aqui...</em>'}
            </div>
          </td>
        </tr>

        <!-- Linha divisória -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>

        <!-- Assinatura com nome da equipe e selo ESA -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#1e293b;">Equipe Externato Santo Antonio</p>
                  <p style="margin:2px 0 0;font-size:13px;color:#94a3b8;">Atendimento</p>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <div style="background:#1a56b0;border-radius:8px;padding:8px 16px;display:inline-block;">
                    <span style="color:#ffffff;font-size:13px;font-weight:700;">ESA</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Rodapé com aviso de não-responder -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              Este é um comunicado oficial enviado pelo Externato Santo Antonio.<br>
              Por favor, não responda diretamente a este e-mail.
            </p>
          </td>
        </tr>

      </table>

      <!-- Copyright externo ao card -->
      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;">
        © ${year} Externato Santo Antonio · Todos os direitos reservados
      </p>

    </td></tr>
  </table>
</body>
</html>`;
}


// =============================================================
//  APLICAÇÃO PRINCIPAL
// =============================================================
document.addEventListener('DOMContentLoaded', () => {

    // ── Referências aos elementos do DOM ─────────────────────
    const dropZone        = document.getElementById('drop-zone');
    const fileInput       = document.getElementById('file-input');
    const fileInfo        = document.getElementById('file-info');
    const fileNameDisplay = document.getElementById('file-name');
    const removeFileBtn   = document.getElementById('remove-file');
    const contactsBody    = document.getElementById('contacts-body');
    const totalDisplay    = document.getElementById('total-contacts');
    const badgeTotal      = document.getElementById('badge-total');
    const countSuccess    = document.getElementById('count-success');
    const countError      = document.getElementById('count-error');
    const btnSend         = document.getElementById('btn-send');
    const sendHint        = document.getElementById('send-hint');
    const emailSubject    = document.getElementById('email-subject');
    const emailBody       = document.getElementById('email-body');
    const progressWrap    = document.getElementById('progress-container');
    const progressText    = document.getElementById('progress-text');
    const progressPercent = document.getElementById('progress-percent');
    const progressFill    = document.getElementById('progress-fill');

    // ── Estado da aplicação ──────────────────────────────────
    let contacts  = []; // Array de objetos { id, nome, email, status }
    let isSending = false; // Trava para evitar duplo envio

    // ── Verificação de Configuração Inicial ──────────────────
    async function checkSetup() {
        try {
            const res = await fetch('api/check_setup.php');
            const data = await res.json();
            
            if (!data.configured) {
                document.getElementById('setup-screen').classList.remove('hidden');
                // Preenche os campos se já houver algo parcial
                if (data.email) document.getElementById('setup-email').value = data.email;
                if (data.name) document.getElementById('setup-name').value = data.name;
            }
        } catch (err) {
            console.error('[SendPilot] Falha ao verificar configuração:', err);
        }
    }

    document.getElementById('btn-save-config').addEventListener('click', async () => {
        const email = document.getElementById('setup-email').value.trim();
        const pass  = document.getElementById('setup-pass').value.trim().replace(/\s/g, ''); // Remove espaços da senha de app
        const name  = document.getElementById('setup-name').value.trim();

        if (!email || !pass || !name) {
            toast('error', 'Preencha todos os campos para continuar.');
            return;
        }

        const btn = document.getElementById('btn-save-config');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...';

        try {
            const res = await fetch('api/save_config.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pass, name })
            });
            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Configurado com sucesso!',
                    text: 'Agora você já pode começar a enviar seus e-mails.',
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    document.getElementById('setup-screen').classList.add('hidden');
                    // Recarrega a página para garantir que as novas constantes do PHP sejam lidas
                    window.location.reload();
                });
            } else {
                toast('error', data.error || 'Erro ao salvar configuração.');
                btn.disabled = false;
                btn.innerHTML = 'Salvar e Continuar <i class="fa-solid fa-arrow-right"></i>';
            }
        } catch (err) {
            toast('error', 'Falha na conexão com o servidor.');
            btn.disabled = false;
            btn.innerHTML = 'Salvar e Continuar <i class="fa-solid fa-arrow-right"></i>';
        }
    });

    checkSetup();

    // Expõe a lista de contatos para a função de preview (escopo global)
    Object.defineProperty(window, '_contacts', { get: () => contacts });


    // ==========================================================
    //  UPLOAD DE PLANILHA
    // ==========================================================

    // Abre o seletor de arquivo ao clicar na zona de upload
    dropZone.addEventListener('click', () => fileInput.click());

    // Feedback visual durante o drag
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    // Processa o arquivo ao soltar na zona de drop
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    // Processa o arquivo selecionado pelo input nativo
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // Remove o arquivo carregado e reseta o estado
    removeFileBtn.addEventListener('click', () => {
        contacts        = [];
        fileInput.value = '';
        renderTable();
        updateStats();
        dropZone.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        validate();
    });

    /**
     * Valida e processa o arquivo selecionado.
     * Aceita apenas .xlsx e .xls; lê via FileReader como ArrayBuffer
     * e passa para o SheetJS fazer o parsing.
     *
     * @param {File} file - Arquivo selecionado pelo usuário
     */
    function handleFile(file) {
        const isValid = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (!isValid) {
            toast('error', 'Formato inválido. Envie apenas arquivos .xlsx ou .xls');
            return;
        }

        // Exibe o nome do arquivo e troca a UI para o estado "arquivo carregado"
        fileNameDisplay.textContent = file.name;
        dropZone.classList.add('hidden');
        fileInfo.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const wb   = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const ws   = wb.Sheets[wb.SheetNames[0]]; // Lê sempre a primeira aba
                const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
                processContacts(rows);
            } catch {
                toast('error', 'Não foi possível ler a planilha. Verifique o arquivo.');
                removeFileBtn.click();
            }
        };
        reader.readAsArrayBuffer(file);
    }

    /**
     * Processa as linhas da planilha e monta a lista de contatos válidos.
     * A detecção das colunas "Nome" e "E-mail" é feita de forma inteligente,
     * aceitando variações como "responsável", "aluno", "mail", "contato", etc.
     *
     * @param {Object[]} rows - Linhas do JSON gerado pelo SheetJS
     */
    function processContacts(rows) {
        contacts = [];

        rows.forEach((row, i) => {
            let nome = '', email = '';

            // Identifica dinamicamente qual coluna contém nome e e-mail
            for (const key in row) {
                const k = key.toLowerCase().trim();
                if (!nome  && (k.includes('nome') || k.includes('responsável') || k.includes('aluno')))
                    nome  = String(row[key]).trim();
                if (!email && (k.includes('mail') || k.includes('e-mail') || k.includes('contato')))
                    email = String(row[key]).trim();
            }

            // Adiciona apenas contatos com e-mail válido
            if (email && isValidEmail(email)) {
                contacts.push({ id: i, nome: nome || 'Responsável', email, status: 'pending' });
            }
        });

        if (!contacts.length) {
            toast('warning', 'Nenhum e-mail válido encontrado. Verifique as colunas da planilha.');
            removeFileBtn.click();
            return;
        }

        renderTable();
        updateStats();
        validate();
        toast('success', `${contacts.length} contatos carregados com sucesso.`);
    }

    /**
     * Valida um endereço de e-mail com regex simples.
     * @param {string} e - E-mail a validar
     * @returns {boolean}
     */
    function isValidEmail(e) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }


    // ==========================================================
    //  TABELA DE DESTINATÁRIOS
    // ==========================================================

    /**
     * Renderiza (ou limpa) a tabela de contatos com base no array atual.
     * Cada linha recebe um id único para atualização de status posterior.
     */
    function renderTable() {
        const n = contacts.length;

        // Atualiza o badge de contagem no cabeçalho da tabela
        badgeTotal.textContent = n === 0 ? '0 contatos' : `${n} contato${n > 1 ? 's' : ''}`;

        if (!n) {
            contactsBody.innerHTML = `
                <tr><td colspan="3" class="table-empty">
                    <i class="fa-regular fa-folder-open"></i>
                    <span>Nenhuma planilha carregada</span>
                </td></tr>`;
            return;
        }

        contactsBody.innerHTML = contacts.map(c => `
            <tr id="row-${c.id}">
                <td>${escHtml(c.nome)}</td>
                <td>${escHtml(c.email)}</td>
                <td class="status-cell">${pillHtml(c.status)}</td>
            </tr>`).join('');
    }

    /**
     * Atualiza o status de um contato específico na lista e no DOM,
     * sem re-renderizar toda a tabela (performance).
     *
     * @param {number} id     - ID do contato (índice original da planilha)
     * @param {string} status - Novo status: 'pending' | 'sending' | 'success' | 'error'
     */
    function updateRowStatus(id, status) {
        const contact = contacts.find(x => x.id === id);
        if (!contact) return;

        contact.status = status;

        const cell = document.querySelector(`#row-${id} .status-cell`);
        if (cell) cell.innerHTML = pillHtml(status);
    }

    /**
     * Recalcula e exibe os contadores de Total, Enviados e Erros.
     */
    function updateStats() {
        totalDisplay.textContent = contacts.length;
        countSuccess.textContent = contacts.filter(c => c.status === 'success').length;
        countError.textContent   = contacts.filter(c => c.status === 'error').length;
    }

    /**
     * Retorna o HTML de um badge (pill) colorido para cada status.
     * @param {string} status
     * @returns {string} HTML do pill
     */
    function pillHtml(status) {
        const map = {
            pending: `<span class="pill pill--pending">Pendente</span>`,
            sending: `<span class="pill pill--sending"><i class="fa-solid fa-circle-notch fa-spin"></i> Enviando</span>`,
            success: `<span class="pill pill--success">Enviado</span>`,
            error:   `<span class="pill pill--error">Erro</span>`,
        };
        return map[status] || '';
    }

    /**
     * Escapa caracteres HTML para evitar XSS ao inserir dados da planilha no DOM.
     * @param {string} s - String a escapar
     * @returns {string}
     */
    function escHtml(s) {
        return s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }


    // ==========================================================
    //  VALIDAÇÃO DO FORMULÁRIO
    // ==========================================================

    /**
     * Habilita ou desabilita o botão de envio com base nas condições:
     * - Planilha carregada com ao menos 1 contato
     * - Assunto preenchido
     * - Corpo da mensagem preenchido
     * - Não está em processo de envio
     */
    function validate() {
        const ready = contacts.length > 0
            && emailSubject.value.trim() !== ''
            && emailBody.value.trim() !== ''
            && !isSending;

        btnSend.disabled     = !ready;
        sendHint.textContent = ready
            ? `Pronto! ${contacts.length} e-mails serão enviados.`
            : 'Carregue uma planilha e preencha a mensagem para continuar.';
    }

    // Revalida ao digitar no assunto ou no corpo
    emailSubject.addEventListener('input', validate);
    emailBody.addEventListener('input', validate);


    // ==========================================================
    //  ENVIO EM LOTE
    // ==========================================================

    btnSend.addEventListener('click', async () => {
        if (isSending) return;

        // Confirmação antes de disparar
        const { isConfirmed } = await Swal.fire({
            title: 'Confirmar envio?',
            html: `Serão enviados <strong>${contacts.length} e-mails</strong>. Deseja continuar?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor:  '#ef4444',
            confirmButtonText:  'Sim, enviar',
            cancelButtonText:   'Cancelar',
        });

        if (!isConfirmed) return;

        // Bloqueia novos envios e exibe barra de progresso
        isSending = true;
        validate();
        progressWrap.classList.remove('hidden');
        btnSend.classList.add('hidden');

        const subject      = emailSubject.value;
        const bodyTemplate = emailBody.value;

        // Filtra contatos que ainda não foram enviados com sucesso (permite reenvio de erros)
        const toSend = contacts.filter(c => c.status !== 'success');
        let done = 0;

        for (const contact of toSend) {
            // Marca o contato como "enviando" na tabela
            updateRowStatus(contact.id, 'sending');

            // Substitui {nome} pelo nome real do responsável
            const personalizedBody = bodyTemplate.replace(/\{nome\}/g, contact.nome);

            try {
                const res = await fetch('api/send.php', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({
                        name:    contact.nome,
                        email:   contact.email,
                        subject,
                        body:    personalizedBody
                    })
                });

                const json = await res.json();
                updateRowStatus(contact.id, json.success ? 'success' : 'error');

                if (!json.success) {
                    console.error(`[SendPilot] Falha em ${contact.email}:`, json.error);
                }
            } catch (err) {
                // Erro de rede ou timeout
                updateRowStatus(contact.id, 'error');
                console.error('[SendPilot] Requisição falhou:', err);
            }

            // Atualiza barra de progresso
            done++;
            const pct = Math.round((done / toSend.length) * 100);
            progressText.textContent    = `Enviando ${done} de ${toSend.length}`;
            progressPercent.textContent = `${pct}%`;
            progressFill.style.width    = `${pct}%`;

            updateStats();

            // Pequena pausa entre envios para não sobrecarregar o servidor SMTP
            await new Promise(r => setTimeout(r, 500));
        }

        isSending = false;

        // Exibe resumo final
        const ok  = contacts.filter(c => c.status === 'success').length;
        const err = contacts.filter(c => c.status === 'error').length;

        Swal.fire({
            title: 'Envio concluído!',
            html:  `<span style="color:#34d399">✓ ${ok} enviados</span>${err ? ` &nbsp;·&nbsp; <span style="color:#f87171">✗ ${err} com erro</span>` : ''}`,
            icon:  err ? 'warning' : 'success',
            confirmButtonColor: '#3b82f6'
        });

        // Restaura UI após um breve delay
        setTimeout(() => {
            progressWrap.classList.add('hidden');
            btnSend.classList.remove('hidden');
            validate();
        }, 1500);
    });


    // ==========================================================
    //  HELPER — NOTIFICAÇÕES TOAST
    // ==========================================================

    /**
     * Exibe uma notificação toast no canto superior direito.
     * @param {'success'|'error'|'warning'|'info'} icon - Tipo de notificação
     * @param {string} msg - Mensagem a exibir
     */
    function toast(icon, msg) {
        Swal.fire({
            icon,
            title: msg,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true
        });
    }

}); // fim DOMContentLoaded
