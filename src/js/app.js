// ===================================
// ORDEM PRO SYSTEM - MAIN APP
// ===================================

const App = {
    currentPage: 'dashboard',

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Initializing Ordem Pro System...');
        
        // Initialize theme
        ThemeManager.init();
        
        // Render main layout
        this.renderLayout();
        
        // Initialize managers
        await OrdersManager.init();
        ChartsManager.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show initial page
        this.showPage('dashboard');
        
        console.log('✅ Ordem Pro System initialized successfully!');
    },

    /**
     * Render main application layout
     */
    renderLayout() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <!-- Sidebar -->
            <aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40">
                <div class="p-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <span class="material-symbols-rounded text-white text-2xl">inventory_2</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold text-slate-900 dark:text-white">Ordem Pro</h1>
                            <p class="text-xs text-slate-500">Sistema de Ordens</p>
                        </div>
                    </div>
                </div>

                <nav class="px-3 space-y-1">
                    <a href="#" data-page="dashboard" class="nav-item active-nav flex items-center gap-3 px-4 py-3 rounded-xl transition-all">
                        <span class="material-symbols-rounded">dashboard</span>
                        <span class="font-semibold">Dashboard</span>
                    </a>
                    <a href="#" data-page="orders" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span class="material-symbols-rounded">list_alt</span>
                        <span class="font-semibold">Ordens</span>
                    </a>
                    <a href="#" data-page="analytics" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span class="material-symbols-rounded">analytics</span>
                        <span class="font-semibold">Análises</span>
                    </a>
                    <a href="#" data-page="settings" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span class="material-symbols-rounded">settings</span>
                        <span class="font-semibold">Configurações</span>
                    </a>
                </nav>
            </aside>

            <!-- Main Content -->
            <div class="ml-64">
                <!-- Header -->
                <header class="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                    <div class="flex items-center justify-between px-6 py-4">
                        <div class="flex items-center gap-4">
                            <h2 id="page-title" class="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <button id="theme-toggle" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <span class="material-symbols-rounded">dark_mode</span>
                            </button>
                            <button onclick="ModalsManager.showNewOrderModal()" 
                                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                                <span class="material-symbols-rounded">add</span>
                                Nova Ordem
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Page Content -->
                <main id="page-content" class="p-6">
                    <!-- Content will be injected here -->
                </main>
            </div>
        `;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ModalsManager.close();
            }
        });
    },

    /**
     * Show page
     */
    showPage(page) {
        this.currentPage = page;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active-nav');
            if (item.dataset.page === page) {
                item.classList.add('active-nav');
            }
        });

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            orders: 'Ordens',
            analytics: 'Análises',
            settings: 'Configurações'
        };
        document.getElementById('page-title').textContent = titles[page] || 'Dashboard';

        // Render page content
        const content = document.getElementById('page-content');
        
        switch (page) {
            case 'dashboard':
                this.renderDashboard(content);
                break;
            case 'orders':
                this.renderOrders(content);
                break;
            case 'analytics':
                this.renderAnalytics(content);
                break;
            case 'settings':
                this.renderSettings(content);
                break;
        }
    },

    /**
     * Render Dashboard page
     */
    renderDashboard(container) {
        const stats = OrdersManager.getStats();
        
        container.innerHTML = `
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="card hover-lift">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Total de Ordens</p>
                            <p class="text-3xl font-bold text-slate-900 dark:text-white">${stats.total}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-600 dark:text-blue-500 text-2xl">inventory_2</span>
                        </div>
                    </div>
                </div>

                <div class="card hover-lift">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendentes</p>
                            <p class="text-3xl font-bold text-amber-600">${stats.pending}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span class="material-symbols-rounded text-amber-600 dark:text-amber-500 text-2xl">schedule</span>
                        </div>
                    </div>
                </div>

                <div class="card hover-lift">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Em Andamento</p>
                            <p class="text-3xl font-bold text-blue-600">${stats.progress}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-600 dark:text-blue-500 text-2xl">sync</span>
                        </div>
                    </div>
                </div>

                <div class="card hover-lift">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Concluídas</p>
                            <p class="text-3xl font-bold text-green-600">${stats.completed}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span class="material-symbols-rounded text-green-600 dark:text-green-500 text-2xl">check_circle</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="card">
                    <h3 class="text-lg font-bold mb-4">Distribuição de Status</h3>
                    <div class="h-64">
                        <canvas id="status-chart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h3 class="text-lg font-bold mb-4">Tendência Semanal</h3>
                    <div class="h-64">
                        <canvas id="trend-chart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="card">
                <h3 class="text-lg font-bold mb-4">Ordens Recentes</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b dark:border-slate-700">
                                <th class="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Produto</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Data</th>
                            </tr>
                        </thead>
                        <tbody id="recent-orders-table">
                            <!-- Will be populated by OrdersManager -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Re-initialize charts
        setTimeout(() => {
            ChartsManager.init();
            this.renderRecentOrders();
        }, 100);
    },

    /**
     * Render Orders page
     */
    renderOrders(container) {
        container.innerHTML = `
            <!-- Filters and Actions -->
            <div class="card mb-6">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                        <button data-filter="all" class="px-4 py-2 rounded-lg bg-primary-100 text-primary-700 font-semibold">
                            Todas
                        </button>
                        <button data-filter="pending" class="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Pendentes
                        </button>
                        <button data-filter="progress" class="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Em Andamento
                        </button>
                        <button data-filter="completed" class="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Concluídas
                        </button>
                    </div>

                    <select id="sort-select" class="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <option value="newest">Mais Recentes</option>
                        <option value="oldest">Mais Antigas</option>
                        <option value="priority">Prioridade</option>
                    </select>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="card">
                <div class="overflow-x-auto">
                    <table class="w-full table-hover">
                        <thead>
                            <tr class="border-b dark:border-slate-700">
                                <th class="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Cliente / Produto</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold">Data</th>
                                <th class="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="orders-table-body">
                            <!-- Will be populated by OrdersManager -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            OrdersManager.render();
            OrdersManager.setupEventListeners();
        }, 100);
    },

    /**
     * Render Analytics page
     */
    renderAnalytics(container) {
        container.innerHTML = `
            <div class="card">
                <h3 class="text-lg font-bold mb-4">Performance por Dia</h3>
                <div class="h-96">
                    <canvas id="performance-chart"></canvas>
                </div>
            </div>
        `;

        setTimeout(() => {
            ChartsManager.initPerformanceChart();
        }, 100);
    },

    /**
     * Render Settings page
     */
    renderSettings(container) {
        container.innerHTML = `
            <div class="card max-w-2xl">
                <h3 class="text-lg font-bold mb-4">Configurações do Sistema</h3>
                
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold mb-2">Tema</h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            Atual: <span id="current-theme">${ThemeManager.getCurrentTheme()}</span>
                        </p>
                    </div>

                    <div>
                        <h4 class="font-semibold mb-2">Exportar Dados</h4>
                        <button onclick="App.exportData()" 
                                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all">
                            Download JSON
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render recent orders table
     */
    renderRecentOrders() {
        const tbody = document.getElementById('recent-orders-table');
        if (!tbody) return;

        const recentOrders = OrdersManager.orders.slice(0, 5);
        
        if (recentOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-slate-500">
                        Nenhuma ordem encontrada
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = recentOrders.map(order => `
            <tr class="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                onclick="ModalsManager.showOrderDetailsModal('${order.id}')">
                <td class="px-4 py-3 font-mono text-sm font-semibold text-primary-600 dark:text-primary-400">
                    ${order.id}
                </td>
                <td class="px-4 py-3">${order.client || '-'}</td>
                <td class="px-4 py-3">${order.product || '-'}</td>
                <td class="px-4 py-3">
                    <span class="status-badge ${helpers.getStatusColor(order.status)}">
                        ${helpers.getStatusLabel(order.status)}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    ${helpers.formatDate(order.created_at)}
                </td>
            </tr>
        `).join('');
    },

    /**
     * Export data
     */
    exportData() {
        const data = StorageManager.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ordem_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Dados exportados com sucesso!', 'success');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export to global scope
window.App = App;

console.log('✅ Main App loaded');
