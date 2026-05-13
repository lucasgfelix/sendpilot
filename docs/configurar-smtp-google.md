# 🔑 Como Configurar a Senha de App do Google (SMTP)

> Este guia é necessário pois o Google **não permite** o uso da senha normal da conta para envio de e-mails via aplicativos externos. É preciso gerar uma **Senha de App** específica.

---

## Pré-requisitos

- Ter acesso à conta Google associada ao e-mail remetente (ex: `informatica.adm@externato.com.br`)
- A conta precisa ter a **Verificação em Duas Etapas** ativada

---

## Passo a Passo

### 1. Acesse a página de segurança da conta Google

Abra o navegador e acesse:
```
https://myaccount.google.com/security
```
Faça login com o e-mail da escola se solicitado.

---

### 2. Ative a Verificação em Duas Etapas (se ainda não estiver ativa)

- Localize a seção **"Como você faz login no Google"**
- Clique em **"Verificação em duas etapas"**
- Siga as instruções na tela para ativar

> ⚠️ Sem essa etapa, a opção de Senha de App não aparece.

---

### 3. Gere a Senha de App

- Na barra de pesquisa da página de segurança, digite: `Senhas de app`
- Clique no resultado **"Senhas de app"**
- No campo **"Nome"**, escreva `SendPilot`
- Clique em **"Criar"**

---

### 4. Copie a senha gerada

O Google vai exibir uma senha de **16 caracteres** no formato:
```
xxxx xxxx xxxx xxxx
```

> 📋 Copie essa senha. Ela só aparece **uma vez** — se fechar sem copiar, precisará gerar outra.

---

### 5. Cole a senha no arquivo de configuração

Abra o arquivo:
```
c:\xampp\htdocs\sendpilot\api\config.php
```

Localize a linha:
```php
define('SMTP_PASS', '...');
```

E substitua pelo valor copiado **(sem espaços)**:
```php
define('SMTP_PASS', 'xxxxxxxxxxxxxx');
```

---

### 6. Teste o envio

Acesse no navegador:
```
http://localhost/sendpilot/api/teste_smtp.php
```

Se aparecer o badge verde **"E-mail enviado com sucesso!"**, está tudo configurado corretamente.

> 🗑️ Após confirmar que está funcionando, **delete o arquivo `teste_smtp.php`** pois ele expõe informações sensíveis.

---

## Reconfigurando no futuro

Se a senha parar de funcionar (ex: a conta foi reconfigurada ou a senha foi revogada):

1. Acesse novamente `https://myaccount.google.com/security`
2. Vá em **"Senhas de app"**
3. Revogue a senha antiga do `SendPilot`
4. Gere uma nova e atualize o `config.php`

---

## Informações da Configuração Atual

| Campo        | Valor                              |
|--------------|------------------------------------|
| Provedor     | Google Workspace                   |
| SMTP Host    | `smtp.gmail.com`                   |
| Porta        | `587`                              |
| Segurança    | `TLS`                              |
| Remetente    | `informatica.adm@externato.com.br` |
| Nome exibido | `Secretaria — Externato`           |
