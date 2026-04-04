// Aplicação Principal
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        // Verificar autenticação
        const isAuthenticated = await auth.checkAuth();
        
        if (!isAuthenticated) {
            this.renderPage('login');
            return;
        }

        // Renderizar app principal
        await this.renderApp();
        
        // Auto-refresh a cada 30 segundos
        setInterval(() => this.refreshData(), 30000);
    }

    async renderApp() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            ${renderSidebar(this.currentPage)}
            <div class="ml-64">
                ${renderHeader(this.getPageTitle(this.currentPage), this.currentPage === 'dashboard')}
                <main id="page-content" class="fade-in"></main>
            </div>
            <div id="toast-container" class="fixed top-4 right-4 z-[9999] space-y-2"></div>
        `;
        
        await this.renderPage(this.currentPage);
    }

    async renderPage(pageName) {
        this.currentPage = pageName;
        const content = document.getElementById('page-content');
        
        if (!content) {
            // Se não existir container, renderizar página de login
            const app = document.getElementById('app');
            app.innerHTML = await renderLoginPage();
            return;
        }

        // Renderizar página selecionada
        let pageHtml = '';
        
        switch (pageName) {
            case 'dashboard':
                pageHtml = await renderDashboardPage();
                break;
            case 'orders':
                pageHtml = await renderOrdersPage();
                break;
            case 'kanban':
                pageHtml = await renderKanbanPage();
                break;
            case 'team':
                pageHtml = await renderTeamPage();
                break;
            case 'stock':
                pageHtml = await renderStockPage();
                break;
            case 'delivery':
                pageHtml = await renderDeliveryPage();
                break;
            case 'reports':
                pageHtml = await renderReportsPage();
                break;
            case 'settings':
                pageHtml = await renderSettingsPage();
                break;
            default:
                pageHtml = await renderDashboardPage();
        }
        
        content.innerHTML = pageHtml;
        
        // Inicializar página específica
        if (pageName === 'dashboard' && typeof initDashboard === 'function') {
            setTimeout(initDashboard, 100);
        }
    }

    getPageTitle(pageName) {
        const titles = {
            dashboard: 'Dashboard',
            orders: 'Lista de Ordens',
            kanban: 'Quadro Kanban',
            team: 'Equipe',
            stock: 'Estoque',
            delivery: 'Entrega de Ordem',
            reports: 'Relatórios',
            settings: 'Configurações'
        };
        return titles[pageName] || 'Dashboard';
    }

    async refreshData() {
        if (this.currentPage === 'dashboard') {
            const orders = await ordersModule.fetchAll();
            const stats = ordersModule.getStats();
            statsModule.updateStatsCards(stats);
        }
    }
}

// Função global de navegação
async function navigateTo(page) {
    event.preventDefault();
    await app.renderPage(page);
    
    // Atualizar sidebar
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
    await app.renderApp();
}

// Função para criar ordem
function createOrder() {
    showToast('Funcionalidade em desenvolvimento', 'info');
}

// Inicializar app quando DOM estiver pronto
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
