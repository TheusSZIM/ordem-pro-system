# 📘 Guia de Instalação e Configuração

## Passo 1: Preparar o Projeto no GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `ordem-pro-system`
4. Deixe como **Public** ou **Private**
5. **NÃO** marque "Add README" (já temos um)
6. Clique em "Create repository"

### 1.2 Fazer Upload do Projeto

Opção A - Via GitHub Web (Mais Fácil):
1. Na página do repositório, clique em "uploading an existing file"
2. Arraste todos os arquivos e pastas do projeto
3. Commit message: "Initial commit"
4. Clique em "Commit changes"

Opção B - Via Git CLI:
```bash
cd /caminho/para/ordem-pro-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ordem-pro-system.git
git push -u origin main
```

## Passo 2: Configurar Supabase

### 2.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - Name: `ordem-pro`
   - Database Password: (crie uma senha forte)
   - Region: escolha a mais próxima (South America - São Paulo)
5. Clique em "Create new project"
6. Aguarde 1-2 minutos até ficar pronto

### 2.2 Configurar Database

1. No menu lateral, clique em "SQL Editor"
2. Clique em "+ New query"
3. Copie todo o conteúdo de `docs/database-schema.sql`
4. Cole no editor
5. Clique em "Run" (ou pressione Ctrl+Enter)
6. Aguarde a mensagem de sucesso

### 2.3 Obter Credenciais

1. No menu lateral, clique em "Settings"
2. Clique em "API"
3. Você verá:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (chave longa)
4. **COPIE ESTAS INFORMAÇÕES!**

### 2.4 Configurar no Projeto

1. Abra o arquivo `src/config/supabase.js`
2. Substitua:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxx.supabase.co',  // Cole sua Project URL aqui
    anonKey: 'eyJhbGc...',               // Cole sua anon public key aqui
};
```

3. Salve o arquivo
4. **IMPORTANTE**: Faça commit e push desta alteração:

```bash
git add src/config/supabase.js
git commit -m "Configure Supabase credentials"
git push
```

## Passo 3: Deploy na Vercel

### 3.1 Conectar GitHub com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub (recomendado)
3. Clique em "Add New..." → "Project"
4. Encontre seu repositório `ordem-pro-system`
5. Clique em "Import"

### 3.2 Configurar Deploy

1. **Framework Preset**: Selecione "Other"
2. **Root Directory**: Deixe como `./` (padrão)
3. **Build Command**: Deixe em branco
4. **Output Directory**: Deixe em branco
5. Clique em "Deploy"

### 3.3 Aguardar Deploy

- Aguarde 1-2 minutos
- Você verá a mensagem "Congratulations!"
- Sua URL será algo como: `https://ordem-pro-system.vercel.app`

### 3.4 Acessar Sistema

1. Clique no link da sua aplicação
2. Você verá o sistema funcionando!
3. Teste criando uma nova ordem

## Passo 4: Configurar Google Sheets (Opcional)

### 4.1 Criar Planilha

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha
3. Nome: "Ordens Pro - Dados"

### 4.2 Configurar API

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou use existente
3. Ative a "Google Sheets API"
4. Crie credenciais OAuth 2.0
5. Baixe o arquivo JSON de credenciais

### 4.3 Integrar com Sistema

(Esta parte requer código adicional - solicite se necessário)

## Passo 5: Configuração Final

### 5.1 Testar Funcionalidades

✅ Criar nova ordem
✅ Visualizar dashboard
✅ Editar ordem
✅ Gerar etiqueta
✅ Alterar tema dark/light
✅ Filtrar ordens
✅ Exportar dados

### 5.2 Configurar Domínio Customizado (Opcional)

1. No Vercel, vá em "Settings"
2. Clique em "Domains"
3. Adicione seu domínio
4. Siga as instruções do Vercel

### 5.3 Configurar Variáveis de Ambiente

Para produção, é recomendado usar variáveis de ambiente:

1. No Vercel, vá em "Settings" → "Environment Variables"
2. Adicione:
   - `VITE_SUPABASE_URL`: sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY`: sua chave anônima
3. Redeploy o projeto

## Solução de Problemas

### Erro ao conectar com Supabase
- Verifique se as credenciais estão corretas
- Confirme que o schema SQL foi executado
- Verifique as políticas RLS no Supabase

### Deploy falhou na Vercel
- Verifique se todos os arquivos foram commitados
- Confirme que o vercel.json está correto
- Veja os logs de build no Vercel

### Dados não aparecem
- Abra o console do navegador (F12)
- Verifique erros no console
- Confirme conexão com Supabase

### Etiquetas não imprimem
- Verifique se a impressora ZPL está configurada
- Teste baixando o arquivo ZPL primeiro
- Consulte a documentação da sua impressora

## Próximos Passos

1. **Personalizar**:
   - Altere cores em `src/config/tailwind-config.js`
   - Adicione seu logo
   - Customize campos das ordens

2. **Segurança**:
   - Configure autenticação de usuários
   - Ajuste políticas RLS no Supabase
   - Adicione validações

3. **Features Avançadas**:
   - Notificações por email
   - Integração com WhatsApp
   - Relatórios PDF
   - Dashboard de analytics

## Suporte

Problemas? Entre em contato ou abra uma issue no GitHub!

---

**Criado com ❤️ para Movimentação Vetore**
