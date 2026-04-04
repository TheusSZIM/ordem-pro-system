# 🚀 Ordem Pro - Estrutura Modular

Sistema de controle de ordens com **arquitetura modular profissional**.

## 📁 Estrutura do Projeto

```
ordem-pro-modular/
├── index.html              # Ponto de entrada principal
├── pages/                  # Páginas do sistema (1 arquivo por aba)
│   ├── dashboard.js       # Página principal com gráficos
│   ├── orders.js          # Lista de ordens
│   ├── kanban.js          # Quadro Kanban
│   ├── team.js            # Gerenciamento de equipe
│   ├── stock.js           # Controle de estoque
│   ├── delivery.js        # Entregas
│   ├── reports.js         # Relatórios
│   ├── settings.js        # Configurações
│   └── login.js           # Página de login
├── components/             # Componentes reutilizáveis
│   ├── sidebar.js         # Menu lateral
│   └── header.js          # Cabeçalho
├── js/
│   ├── auth/              # Sistema de autenticação
│   │   └── auth.js       # Login/logout/registro
│   ├── modules/           # Módulos de funcionalidades
│   │   ├── orders.js     # CRUD de ordens
│   │   ├── stats.js      # Estatísticas e gráficos
│   │   └── operators.js  # Gerenciamento de operadores
│   ├── config/            # Configurações
│   │   ├── supabase.config.js  # Conexão Supabase
│   │   └── tailwind.config.js  # Tema Tailwind
│   ├── utils/             # Funções auxiliares
│   │   └── helpers.js    # Formatação, validação, etc.
│   └── app.js             # Controlador principal
├── css/
│   └── main.css           # Estilos customizados
└── assets/                # Imagens, fontes, etc.
```

## ⚙️ Como Configurar

### 1. Configurar Supabase

Edite `js/config/supabase.config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'SUA_URL_AQUI',
    anonKey: 'SUA_CHAVE_AQUI'
};
```

### 2. Fazer Upload no GitHub

```bash
# Criar repositório
git init
git add .
git commit -m "feat: Estrutura modular profissional"
git branch -M main
git remote add origin SEU_REPOSITORIO
git push -u origin main
```

### 3. Deploy na Vercel

1. Conecte o repositório na Vercel
2. Deploy automático!

## 🎯 Vantagens da Estrutura Modular

### ✅ Fácil Manutenção
- Cada aba em arquivo separado
- Modificar uma página não afeta outras
- Código organizado e legível

### ✅ Desenvolvimento em Equipe
- Múltiplos desenvolvedores podem trabalhar simultaneamente
- Menos conflitos de merge
- Responsabilidades claras

### ✅ Escalabilidade
- Adicionar novas páginas = criar novo arquivo
- Reutilizar componentes facilmente
- Módulos independentes

### ✅ Sistema de Login Integrado
- Autenticação via Supabase
- Proteção de rotas
- Gerenciamento de sessão

## 📝 Como Adicionar Nova Página

1. Criar arquivo em `/pages/novapage.js`:

```javascript
function renderNovapagePage() {
    return `
        <div class="p-6">
            <h1>Nova Página</h1>
        </div>
    `;
}
```

2. Adicionar no `index.html`:

```html
<script src="/pages/novapage.js"></script>
```

3. Adicionar rota no `js/app.js`:

```javascript
case 'novapage':
    pageHtml = await renderNovapagePage();
    break;
```

4. Adicionar item no menu (`components/sidebar.js`)

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, JavaScript ES6+
- **Estilização**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Gráficos**: Chart.js
- **Deploy**: Vercel

## 📊 Dados Pré-Configurados

### Operadores (6):
- Ana Costa
- Carlos Mendes
- Juliana Lima
- Marcos Vieira
- Patricia Alves
- Rafael Souza

### Tabelas do Banco:
- `orders` - Ordens de produção
- `operators` - Operadores/colaboradores
- `users` - Usuários do sistema
- `settings` - Configurações
- `audit_logs` - Logs de auditoria

## 🚀 Próximos Passos

1. Implementar páginas restantes (Kanban, Team, etc.)
2. Adicionar validações de formulário
3. Criar dashboards com gráficos avançados
4. Implementar notificações em tempo real
5. Adicionar export de relatórios (PDF/Excel)

## 📞 Suporte

Em caso de dúvidas, consulte a documentação do Supabase:
https://supabase.com/docs

---

**Desenvolvido com ❤️ por Ordem Pro Team**
