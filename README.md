# Controle de Ordens Pro

Sistema Enterprise de Controle de Ordens de Separação com suporte a Etiquetas ZLP.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Descrição

O **Controle de Ordens Pro** é um sistema completo para gerenciamento de ordens de separação em ambientes industriais. O sistema oferece:

- Dashboard em tempo real
- Quadro Kanban interativo com drag-and-drop
- Gestão completa de ordens (criação, separação, finalização, entrega)
- Impressão de etiquetas ZLP e identificações A4
- Controle de equipe e produtividade
- Gestão de estoque
- Tema claro/escuro

## 🚀 Funcionalidades

### Principais Recursos

- ✅ **Dashboard** - Visão geral em tempo real com gráficos e estatísticas
- ✅ **Quadro Kanban** - Arraste e solte ordens entre colunas
- ✅ **Lista de Ordens** - Visualização detalhada com filtros e busca
- ✅ **Gestão de Equipe** - Acompanhamento de operadores e eficiência
- ✅ **Controle de Estoque** - Gestão de produtos e reposições
- ✅ **Entrega de Ordens** - Registro de saída de ordens concluídas
- ✅ **Etiquetas ZLP** - Geração e impressão de etiquetas com código de barras
- ✅ **Identificação A4** - Documentos de identificação de volumes
- ✅ **Tema Dark/Light** - Interface adaptável

## 📁 Estrutura do Projeto

```
ordem-pro-system/
├── components/          # Componentes reutilizáveis
│   ├── header.html     # Cabeçalho da aplicação
│   ├── sidebar.html    # Menu lateral
│   └── modals.html     # Modais do sistema
├── css/                # Estilos
│   └── style.css       # Estilos principais
├── js/                 # JavaScript
│   ├── app.js          # Aplicação principal
│   ├── data.js         # Dados e estado
│   ├── utils.js        # Utilitários
│   ├── charts.js       # Gráficos
│   ├── orders.js       # Gerenciamento de ordens
│   ├── kanban.js       # Quadro Kanban
│   ├── labels.js       # Etiquetas ZLP
│   └── modals.js       # Modais e navegação
├── pages/              # Páginas
│   ├── dashboard.html  # Dashboard
│   ├── kanban.html     # Kanban
│   ├── ordens.html     # Lista de ordens
│   ├── equipe.html     # Gestão de equipe
│   ├── estoque.html    # Controle de estoque
│   └── entrega.html    # Entrega de ordens
├── assets/             # Recursos
│   └── images/         # Imagens
├── index.html          # Página principal
└── README.md           # Documentação
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript (Vanilla)** - Lógica da aplicação
- **Chart.js** - Gráficos e visualizações
- **JsBarcode** - Geração de códigos de barras
- **Google Fonts** - Tipografia
- **Material Icons** - Ícones

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/ordem-pro-system.git
```

2. Navegue até o diretório:
```bash
cd ordem-pro-system
```

3. Abra o arquivo `index.html` em um navegador web moderno.

Ou utilize um servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

## 🎯 Como Usar

### Dashboard
- Visualize estatísticas em tempo real
- Acompanhe ordens pendentes, em separação, concluídas e entregues
- Veja gráficos de desempenho
- Acesse ordens recentes

### Criar Nova Ordem
1. Clique no botão "Nova Ordem"
2. Preencha os campos obrigatórios
3. Selecione o tipo de embalagem
4. Clique em "Criar Ordem"

### Gerenciar Ordens no Kanban
- Arraste ordens entre as colunas
- Clique em uma ordem para ver detalhes
- Use o botão de ações para iniciar/concluir separação

### Finalizar Separação
1. Mova a ordem para "Concluídas" ou clique no botão de check
2. Responda as perguntas de finalização
3. Clique em "Concluir e Imprimir Etiquetas"
4. As etiquetas ZLP e identificações A4 serão geradas

### Registrar Entrega
1. Acesse a página "Entrega de Ordem"
2. Preencha os dados da saída
3. Confirme a entrega

## 🖨️ Etiquetas ZLP

O sistema gera automaticamente:
- **Etiquetas ZLP** (100mm x 150mm) - Para volumes
- **Identificação A4** (210mm x 297mm) - Para documentação

As etiquetas incluem:
- Código de barras da ordem
- Informações do produto
- Cliente e destino
- Número do volume
- Alertas (itens faltantes, embalagem separada)

## 🎨 Personalização

### Temas
- Clique no ícone de sol/lua no header para alternar entre tema claro e escuro
- A preferência é salva no localStorage

### Cores
As cores principais podem ser personalizadas no arquivo `css/style.css`:

```css
:root {
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  /* ... */
}
```

## 🔧 Configuração

### Dados Iniciais
Os dados das ordens estão no arquivo `js/data.js`. Você pode:
- Modificar as ordens de exemplo
- Adicionar novos campos
- Ajustar o mapeamento de status

### Gráficos
Configure os gráficos no arquivo `js/charts.js`:
- Cores dos datasets
- Tipos de gráficos
- Opções de exibição

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px+)

## 🔒 Segurança

Este é um sistema frontend-only. Para uso em produção, considere:
- Implementar autenticação
- Adicionar backend com API REST
- Validar dados no servidor
- Proteger contra XSS e CSRF

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Marcos Vieira** - *Desenvolvimento inicial* - [GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [JsBarcode](https://github.com/lindell/JsBarcode)
- [Google Fonts](https://fonts.google.com/)
- [Material Icons](https://fonts.google.com/icons)

---

<p align="center">
  Feito com ❤️ para otimizar processos industriais
</p>
