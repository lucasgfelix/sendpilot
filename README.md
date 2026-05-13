# SendPilot 🚀

**SendPilot** é uma aplicação web moderna e eficiente desenvolvida para automatizar o envio de e-mails em lote. Projetada com foco na simplicidade e na experiência do usuário, a ferramenta permite que instituições (como o **Externato Santo Antonio**) enviem comunicados aos pais de alunos de forma rápida, visual e segura.

## 🎯 Visão do Projeto
O objetivo principal do SendPilot é fornecer uma interface intuitiva onde qualquer funcionário, sem necessidade de conhecimento técnico avançado, possa:
- Importar uma lista de contatos via Excel.
- Escrever comunicados com personalização automática (ex: `{nome}`).
- Pré-visualizar o e-mail real antes de enviar.
- Acompanhar o progresso de envio em tempo real com estatísticas detalhadas.

## ✨ Funcionalidades Atuais (v1.0)
- [x] **Importação via Excel:** Leitura inteligente de colunas (Nome/E-mail) usando SheetJS.
- [x] **Interface Premium (Dark Navy):** Design moderno com Glassmorphism, blobs animados e layout Sidebar/Main.
- [x] **Live Preview:** Aba de pré-visualização que mostra o e-mail exatamente como o pai irá receber.
- [x] **Personalização Dinâmica:** Suporte à tag `{nome}` para e-mails personalizados.
- [x] **Envios SMTP Profissionais:** Integração com PHPMailer e suporte a Senhas de App (Google Workspace).
- [x] **Monitoramento em Tempo Real:** Barra de progresso, contador de sucessos/erros e log de status individual.

## 🗺️ Roadmap de Melhorias (Futuro)
- [ ] **Histórico de Envios:** Registro local de todos os lotes enviados para auditoria.
- [ ] **Templates de Mensagem:** Salvar modelos de textos frequentes (Reuniões, Feriados).
- [ ] **Suporte a Anexos:** Possibilidade de anexar arquivos PDF (boletins, circulares).
- [ ] **Sistema de Login:** Proteção de acesso à ferramenta.
- [ ] **Relatórios:** Exportação de relatório CSV com o status final de cada envio.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3 (Vanilla Glassmorphism), JavaScript (Vanilla ES6+).
- **Backend:** PHP 8.x.
- **Bibliotecas:** 
  - [PHPMailer](https://github.com/PHPMailer/PHPMailer) (Disparos SMTP).
  - [SheetJS](https://sheetjs.com/) (Parsing de Excel).
  - [SweetAlert2](https://sweetalert2.github.io/) (Modais e Notificações).

## 🚀 Como Executar Localmente
1. Certifique-se de ter o XAMPP instalado.
2. Clone este repositório na pasta `C:\xampp\htdocs\sendpilot`.
3. Configure o arquivo `api/config.php` (use o guia em `docs/configurar-smtp-google.md`).
4. Inicie o servidor Apache no painel de controle do XAMPP.
5. Acesse `http://localhost/sendpilot` no seu navegador.
