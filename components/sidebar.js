function renderSidebar() {
    return `
        <aside id="sidebar" class="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 transition-transform -translate-x-full lg:translate-x-0">
            <div class="h-full flex flex-col py-6">
                
                <!-- Principal Section -->
                <div class="px-4 mb-6">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Principal</p>
                    <nav class="space-y-1">
                        <a onclick="showPage('dashboard')" data-page="dashboard" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">dashboard</span>
                            <span class="font-medium">Dashboard</span>
                            <span class="ml-auto px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">NOVO</span>
                        </a>
                        <a onclick="showPage('kanban')" data-page="kanban" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">view_kanban</span>
                            <span class="font-medium">Quadro Kanban</span>
                        </a>
                        <a onclick="showPage('orders')" data-page="orders" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">list_alt</span>
                            <span class="font-medium">Lista de Ordens</span>
                        </a>
                    </nav>
                </div>

                <!-- Gestão Section -->
                <div class="px-4 mb-6">
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Gestão</p>
                    <nav class="space-y-1">
                        <a onclick="showPage('team')" data-page="team" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">group</span>
                            <span class="font-medium">Equipe</span>
                        </a>
                        <a onclick="showPage('stock')" data-page="stock" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">inventory</span>
                            <span class="font-medium">Estoque</span>
                        </a>
                        <a onclick="showPage('delivery')" data-page="delivery" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">local_shipping</span>
                            <span class="font-medium">Entrega de Ordem</span>
                        </a>
                        <a onclick="showPage('reports')" data-page="reports" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">assessment</span>
                            <span class="font-medium">Relatórios</span>
                        </a>
                        <a onclick="showPage('settings')" data-page="settings" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-all">
                            <span class="material-symbols-rounded text-xl">settings</span>
                            <span class="font-medium">Configurações</span>
                        </a>
                    </nav>
                </div>

                <!-- Versão Pro Card -->
                <div class="mt-auto px-4">
                    <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="material-symbols-rounded text-yellow-400">stars</span>
                            <span class="font-bold text-white">Versão Pro</span>
                        </div>
                        <p class="text-xs text-white/80 mb-3">Acesse recursos avançados</p>
                        <button class="w-full px-3 py-2 bg-white text-primary-700 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all">
                            Ver planos
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    `;
}
