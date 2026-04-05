// Componente: Header (SEM AUTENTICAÇÃO)
function renderHeader(title = 'Dashboard', showNewButton = true) {
    return `
        <header class="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
            <div class="flex items-center justify-between px-6 py-4">
                <h2 class="text-2xl font-bold">${title}</h2>
                
                <div class="flex items-center gap-4">
                    ${showNewButton ? `
                        <button onclick="createOrder()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-all">
                            <span class="material-symbols-rounded">add</span>
                            Nova Ordem
                        </button>
                    ` : ''}
                    
                    <!-- User Menu -->
                    <div class="relative group">
                        <button class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all">
                            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <span class="material-symbols-rounded text-sm">person</span>
                            </div>
                            <span class="text-sm font-medium hidden md:block">Usuário</span>
                        </button>
                        
                        <!-- Dropdown -->
                        <div class="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <div class="p-2">
                                <button onclick="showToast('Sistema sem login ativo', 'info')" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-all text-left">
                                    <span class="material-symbols-rounded text-sm">logout</span>
                                    <span class="text-sm">Sair</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
}
