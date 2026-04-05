// Aplicação Principal (SEM LOGIN OBRIGATÓRIO)
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando app...');
        
        // PULAR AUTENTICAÇÃO POR ENQUANTO
        // const isAuthenticated = await auth.checkAuth();
        // if (!isAuthenticated) {
        //     this.renderPage('login');
        //     return;
        // }

        // Renderizar app principal DIRETO
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
            console.error('❌ Container page-content não encontrado');
            return;
        }

        // Renderizar página selecionada
        let pageHtml = '';
        
        try {
            switch (pageName) {
                case 'dashboard':
                    pageHtml = await renderDashboardPage();
                    break;
                case 'orders':
                    pageHtml = renderOrdersPage();
                    break;
                case 'kanban':
                    pageHtml = renderKanbanPage();
                    break;
                case 'team':
                    pageHtml = renderTeamPage();
                    break;
                case 'stock':
                    pageHtml = renderStockPage();
                    break;
                case 'delivery':
                    pageHtml = renderDeliveryPage();
                    break;
                case 'reports':
                    pageHtml = renderReportsPage();
                    break;
                case 'settings':
                    pageHtml = renderSettingsPage();
                    break;
                default:
                    pageHtml = await renderDashboardPage();
            }
            
            content.innerHTML = pageHtml;
            
            // Inicializar página específica
            if (pageName === 'dashboard' && typeof initDashboard === 'function') {
                setTimeout(initDashboard, 100);
            }
            
            console.log('✅ Página renderizada:', pageName);
        } catch (error) {
            console.error('❌ Erro ao renderizar página:', error);
            content.innerHTML = `
                <div class="p-6">
                    <div class="bg-red-500/20 border border-red-500 rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-2">Erro ao carregar página</h3>
                        <p class="text-red-200">${error.message}</p>
                    </div>
                </div>
            `;
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
            try {
                const orders = await ordersModule.fetchAll();
                const stats = ordersModule.getStats();
                statsModule.updateStatsCards(stats);
                console.log('🔄 Dados atualizados');
            } catch (error) {
                console.warn('⚠️ Erro ao atualizar dados:', error);
            }
        }
    }
}

// Função global de navegação
async function navigateTo(page) {
    if (event) event.preventDefault();
    console.log('📍 Navegando para:', page);
    await app.renderPage(page);
}

// Função para criar ordem
function createOrder() {
    showToast('Funcionalidade em desenvolvimento', 'info');
}

// Inicializar app quando DOM estiver pronto
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM carregado, inicializando app...');
    app = new App();
});
