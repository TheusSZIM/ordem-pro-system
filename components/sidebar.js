// Componente: Sidebar
function renderSidebar(currentPage = 'dashboard') {
    return `
        <aside class="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-40 overflow-y-auto">
            <!-- Logo -->
            <div class="p-6 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <span class="material-symbols-rounded text-white text-2xl">inventory_2</span>
                    </div>
                    <div>
                        <h1 class="text-lg font-bold">Controle Pro</h1>
                        <p class="text-xs text-slate-400">ENTERPRISE + ZLP</p>
                    </div>
                </div>
            </div>

            <!-- Menu PRINCIPAL -->
            <nav class="px-3 py-4">
                <div class="mb-6">
                    <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Principal</p>
                    
                    <a href="#" onclick="navigateTo('dashboard')" class="nav-item ${currentPage === 'dashboard' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all">
                        <span class="material-symbols-rounded">dashboard</span>
                        <span class="font-semibold">Dashboard</span>
                        <span class="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Novo</span>
                    </a>

                    <a href="#" onclick="navigateTo('kanban')" class="nav-item ${currentPage === 'kanban' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">view_kanban</span>
                        <span class="font-semibold">Quadro Kanban</span>
                    </a>

                    <a href="#" onclick="navigateTo('orders')" class="nav-item ${currentPage === 'orders' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">list_alt</span>
                        <span class="font-semibold">Lista de Ordens</span>
                    </a>
                </div>

                <!-- Menu GESTÃO -->
                <div class="mb-6">
                    <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gestão</p>
                    
                    <a href="#" onclick="navigateTo('team')" class="nav-item ${currentPage === 'team' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">group</span>
                        <span class="font-semibold">Equipe</span>
                    </a>

                    <a href="#" onclick="navigateTo('stock')" class="nav-item ${currentPage === 'stock' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">inventory</span>
                        <span class="font-semibold">Estoque</span>
                    </a>

                    <a href="#" onclick="navigateTo('delivery')" class="nav-item ${currentPage === 'delivery' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">local_shipping</span>
                        <span class="font-semibold">Entrega de Ordem</span>
                    </a>

                    <a href="#" onclick="navigateTo('reports')" class="nav-item ${currentPage === 'reports' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">analytics</span>
                        <span class="font-semibold">Relatórios</span>
                    </a>

                    <a href="#" onclick="navigateTo('settings')" class="nav-item ${currentPage === 'settings' ? 'active-nav' : ''} flex items-center gap-3 px-4 py-3 rounded-xl mb-1 hover:bg-slate-800 transition-all">
                        <span class="material-symbols-rounded">settings</span>
                        <span class="font-semibold">Configurações</span>
                    </a>
                </div>

                <!-- Versão Pro Card -->
                <div class="mx-3 mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-white">workspace_premium</span>
                        </div>
                        <div>
                            <p class="font-bold text-white">Versão Pro</p>
                            <p class="text-xs text-blue-100">Acesse recursos avançados</p>
                        </div>
                    </div>
                    <button class="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold text-white transition-all">
                        Ver planos
                    </button>
                </div>
            </nav>
        </aside>
    `;
}
