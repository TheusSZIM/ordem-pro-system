function renderHeader() {
    return `
        <header class="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button onclick="document.getElementById('sidebar').classList.toggle('-translate-x-full')" class="lg:hidden p-2 rounded-lg hover:bg-slate-800">
                    <span class="material-symbols-rounded">menu</span>
                </button>
                <div>
                    <h1 class="text-lg font-bold">Controle Pro</h1>
                    <p class="text-xs text-slate-400">ENTERPRISE + ZLP</p>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <button onclick="showPage('dashboard')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                    <span class="material-symbols-rounded">add</span>
                    Nova Ordem
                </button>
                <button onclick="toggleTheme()" class="p-2 rounded-lg hover:bg-slate-800">
                    <span class="material-symbols-rounded">dark_mode</span>
                </button>
                <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold cursor-pointer">
                    <span>U</span>
                </div>
            </div>
        </header>
    `;
}
