# Diário de Bordo - SendPilot 🤖

Este arquivo serve como um registro vivo para documentar a evolução, decisões arquiteturais e o progresso do projeto **SendPilot**, construído em parceria com a IA.

---

### 📝 Fase 1: Planejamento e Estruturação Inicial (Maio/2026)

**Objetivo da Fase:** Estabelecer as bases do projeto, entender as necessidades do usuário e configurar o ambiente.

**Atividades Concluídas:**
- [x] Definição do escopo: Aplicação para envios de e-mails em lote para a escola.
- [x] Criação da estrutura local na pasta `c:\xampp\htdocs\sendpilot`.
- [x] Inicialização do repositório Git local e conexão com o repositório remoto (`lucasgfelix/sendpilot`).
- [x] Elaboração do Plano de Implementação (Arquitetura PHP + JS Moderno).
- [x] Organização do `README.md` com a visão de produto e escopo.
- [x] Construção da Interface Gráfica (HTML/CSS) com Bento Box e Glassmorphism.
- [x] Implementação do parser de Excel no JavaScript (SheetJS).
- [x] Configuração do backend PHP + PHPMailer.
- [x] Sistema de Pré-visualização de E-mail (Live Preview).
- [x] Diagnóstico e correção de conexão SMTP (Google Workspace).

**Decisões Arquiteturais Definidas:**
1. **Stack Tecnológica:** PHP puro + Vanilla JS/CSS para máxima performance e customização visual "Premium".
2. **Estratégia de Envio:** PHPMailer via SMTP Autenticado (Segurança e Anti-Spam).
3. **Formato de Dados:** Excel (.xlsx/.xls) como fonte primária via SheetJS.
4. **Design System:** Dark Navy Theme, Glassmorphism, e animações fluidas para evitar fadiga visual.

---

### 🚀 Próximas Etapas: Fase 2 (Refinamento e Expansão)

**Sugestões para implementação futura:**

1. **Gestão de Dados:**
   - [ ] Implementar Histórico de Envios (Log local).
   - [ ] Exportação de relatórios pós-envio (CSV/Excel).

2. **Produtividade:**
   - [ ] Sistema de Templates (Salvar mensagens recorrentes).
   - [ ] Suporte a Anexos (PDFs de circulares/boletins).

3. **Segurança:**
   - [ ] Tela de Autenticação (Login) para proteger o acesso local/remoto.
