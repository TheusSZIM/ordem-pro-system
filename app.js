// App Controller - FIEL ao original
const app = {
    currentPage: 'dashboard',
    theme: 'dark',
    
    async init() {
        // Carregar componentes
        await this.loadSidebar();
        await this.loadHeader();
        
        // Inicializar Supabase
        if (typeof initSupabase === 'function') {
            await initSupabase();
        }
        
        // Aplicar tema
        document.documentElement.classList.add('dark');
        
        // Renderizar dashboard
        await this.renderPage('dashboard');
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('global-search')?.focus();
            }
        });
    },
    
    async loadSidebar() {
        const container = document.getElementById('sidebar');
        if (container && typeof renderSidebar === 'function') {
            container.innerHTML = renderSidebar();
        }
    },
    
    async loadHeader() {
        const container = document.getElementById('header');
        if (container && typeof renderHeader === 'function') {
            container.innerHTML = renderHeader();
        }
    },
    
    async renderPage(pageName) {
        this.currentPage = pageName;
        const container = document.getElementById('page-content');
        if (!container) return;
        
        let html = '';
        
        try {
            switch(pageName) {
                case 'dashboard':
                    html = await renderDashboardPage();
                    break;
                case 'kanban':
                    html = await renderKanbanPage();
                    break;
                case 'orders':
                    html = await renderOrdersPage();
                    break;
                case 'team':
                    html = await renderTeamPage();
                    break;
                case 'stock':
                    html = await renderStockPage();
                    break;
                case 'delivery':
                    html = await renderDeliveryPage();
                    break;
                case 'reports':
                    html = await renderReportsPage();
                    break;
                case 'settings':
                    html = renderSettingsPage();
                    break;
                default:
                    html = '<div class="p-6"><h2>Página não encontrada</h2></div>';
            }
            
            container.innerHTML = html;
            
            // Atualizar navegação ativa
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active-nav', 'bg-slate-700');
                if (nav.getAttribute('data-page') === pageName) {
                    nav.classList.add('active-nav', 'bg-slate-700');
                }
            });
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Erro ao renderizar página:', error);
            container.innerHTML = `
                <div class="p-6">
                    <div class="bg-red-500/10 border border-red-500 rounded-lg p-4">
                        <p class="text-red-500">Erro ao carregar página: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Funções globais
function showPage(pageName) {
    app.renderPage(pageName);
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    app.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in-right`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
