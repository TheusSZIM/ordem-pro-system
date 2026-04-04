# 🚀 Ordem Pro System

Sistema profissional de controle e gerenciamento de ordens de separação com integração completa para Supabase, Google Sheets, GitHub e Vercel.

## 📋 Características

- ✨ Interface moderna e responsiva com Tailwind CSS
- 🌓 Modo dark/light automático
- 📊 Dashboard interativo com gráficos em tempo real
- 🏷️ Geração de etiquetas ZPL para impressoras térmicas
- 💾 Integração com Supabase (backend)
- 📈 Google Sheets para relatórios
- 🔄 Deploy automático via Vercel
- 📱 Totalmente responsivo para mobile

## 🛠️ Tecnologias

- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6+)
- **Charts**: Chart.js
- **Backend**: Supabase
- **Deploy**: Vercel
- **Controle de Versão**: Git/GitHub
- **Impressão**: JsBarcode (ZPL)

## 📦 Estrutura do Projeto

```
ordem-pro-system/
├── index.html                 # Página principal
├── src/
│   ├── css/
│   │   └── styles.css        # Estilos customizados
│   ├── js/
│   │   ├── app.js            # Aplicação principal
│   │   ├── orders.js         # Gerenciamento de ordens
│   │   ├── charts.js         # Gráficos e analytics
│   │   ├── modals.js         # Modais e dialogs
│   │   ├── print.js          # Impressão de etiquetas
│   │   ├── theme.js          # Gerenciamento de tema
│   │   └── notifications.js  # Sistema de notificações
│   ├── utils/
│   │   ├── helpers.js        # Funções auxiliares
│   │   └── storage.js        # Gerenciamento de storage
│   └── config/
│       ├── supabase.js       # Configuração Supabase
│       └── tailwind-config.js # Configuração Tailwind
├── public/                    # Assets públicos
├── docs/                      # Documentação
├── vercel.json               # Configuração Vercel
└── README.md                 # Este arquivo
```

## 🚀 Como Começar

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/ordem-pro-system.git
cd ordem-pro-system
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `docs/database-schema.sql`
3. Copie suas credenciais e cole em `src/config/supabase.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://seu-projeto.supabase.co',
    anonKey: 'sua-chave-anonima'
};
```

### 3. Deploy na Vercel

#### Opção A: Via GitHub (Recomendado)

1. Faça push para o GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Acesse [Vercel](https://vercel.com)
3. Import o repositório
4. Deploy automático!

#### Opção B: Via CLI

```bash
npm install -g vercel
vercel
```

### 4. Configurar Google Sheets (Opcional)

Para exportar dados para Google Sheets, configure a API do Google:

1. Ative a Google Sheets API
2. Configure OAuth credentials
3. Adicione as credenciais ao projeto

## 📊 Database Schema

O sistema usa as seguintes tabelas no Supabase:

- `orders` - Ordens de separação
- `users` - Usuários do sistema
- `operators` - Operadores/separadores
- `settings` - Configurações do sistema

Veja o schema completo em `docs/database-schema.sql`

## 🎨 Personalização

### Cores e Tema

Edite `src/config/tailwind-config.js` para customizar as cores:

```javascript
colors: {
    primary: {
        500: '#6366f1', // Sua cor principal
        // ...
    }
}
```

### Estilos Customizados

Adicione seus estilos em `src/css/styles.css`

## 📱 Funcionalidades

### Dashboard
- Visão geral de estatísticas
- Gráficos interativos
- Ordens recentes

### Gerenciamento de Ordens
- Criar novas ordens
- Editar ordens existentes
- Filtrar e ordenar
- Status tracking

### Impressão
- Etiquetas ZPL
- Documentos PDF
- Preview antes de imprimir

### Analytics
- Gráficos de performance
- Relatórios customizados
- Exportação de dados

## 🔧 Comandos Úteis

```bash
# Abrir projeto localmente (com servidor)
python -m http.server 8000
# ou
npx serve

# Deploy para Vercel
vercel --prod

# Exportar dados
# Use a interface em Configurações > Exportar Dados
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@ordemPro.com ou abra uma issue no GitHub.

## 🎯 Roadmap

- [ ] Integração com WhatsApp para notificações
- [ ] App mobile nativo (React Native)
- [ ] Sistema de relatórios avançados
- [ ] Integração com ERP
- [ ] API REST pública
- [ ] WebSockets para atualizações em tempo real

## ✨ Agradecimentos

- Tailwind CSS pela framework incrível
- Chart.js pelos gráficos
- Supabase pelo backend fantástico
- Vercel pelo deploy sem complicações
