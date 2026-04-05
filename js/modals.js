/* ============================================
   CONTROLE DE ORDENS PRO - MODAIS E NAVEGAÇÃO
   ============================================ */

// Navegação entre Páginas
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    const target = document.getElementById(pageName);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        state.currentPage = pageName;
        
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active-nav', 'text-primary-600', 'bg-slate-50', 'dark:bg-slate-800');
            if (nav.dataset.page === pageName) {
                nav.classList.add('active-nav');
            }
        });
        
        if (pageName === 'kanban' && typeof initKanban === 'function') initKanban();
        if (pageName === 'ordens' && typeof renderOrdensTable === 'function') renderOrdensTable();
        if (pageName === 'dashboard' && typeof animateCounters === 'function') animateCounters();
        if (pageName === 'entrega' && typeof renderOrdensEntrega === 'function') renderOrdensEntrega();
    }
    
    if (window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('-translate-x-full');
    }
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
}

// Mostrar Modal
function showModal(type, data = null) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    if (!overlay || !container || !content) return;
    
    let html = '';
    
    if (type === 'new-order') {
        html = `
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Nova Ordem de Separação</h3>
                <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
            <div class="p-6 overflow-y-auto">
                <form id="new-order-form" class="space-y-5" onsubmit="handleNewOrder(event)">
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Número da Ordem *</label>
                        <input type="text" 
                               id="ordem-numero"
                               placeholder="Ex: ORD-2024-001" 
                               class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                               required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Produto *</label>
                        <input type="text" 
                               id="ordem-produto"
                               placeholder="Digite o nome do produto..." 
                               class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                               required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Quantidade *</label>
                            <input type="number" 
                                   id="ordem-quantidade"
                                   min="1"
                                   placeholder="0" 
                                   class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Volumes (Etiquetas) *</label>
                            <input type="number" 
                                   id="ordem-volumes"
                                   min="1"
                                   value="1"
                                   placeholder="1" 
                                   class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                                   required>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Data Prevista *</label>
                            <input type="date" 
                                   id="ordem-data-prevista"
                                   class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cliente *</label>
                            <input type="text" 
                                   id="ordem-cliente"
                                   placeholder="Nome do cliente..." 
                                   class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                                   required>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Destino *</label>
                        <input type="text" 
                               id="ordem-destino"
                               placeholder="Cidade - UF" 
                               class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
                               required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Operador Responsável</label>
                        <select id="ordem-operador" class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all">
                            <option value="">Selecione um operador...</option>
                            <option value="Marcos Vieira">Marcos Vieira</option>
                            <option value="Ana Silva">Ana Silva</option>
                            <option value="João Pereira">João Pereira</option>
                            <option value="Carlos Mendes">Carlos Mendes</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Célula/Estação</label>
                        <input type="text" 
                               id="ordem-celula"
                               placeholder="Ex: Linha A - Estação 3" 
                               class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Embalagem</label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20">
                                <input type="radio" name="tipo-embalagem" value="Montadora" class="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500" checked>
                                <div>
                                    <p class="text-sm font-medium text-slate-900 dark:text-white">Montadora</p>
                                    <p class="text-xs text-slate-500">Envio direto à linha</p>
                                </div>
                            </label>
                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20">
                                <input type="radio" name="tipo-embalagem" value="Reposição" class="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500">
                                <div>
                                    <p class="text-sm font-medium text-slate-900 dark:text-white">Reposição</p>
                                    <p class="text-xs text-slate-500">Reposição de estoque</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div id="reposicao-fields" class="hidden space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Reposição</label>
                        <select id="ordem-reposicao-tipo" class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white">
                            <option value="Caixa 34 - 486 Peças">Caixa 34 - 486 Peças</option>
                            <option value="Caixa 34 - 144 Peças">Caixa 34 - 144 Peças</option>
                            <option value="Embalamento">Embalamento</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Observações</label>
                        <textarea id="ordem-observacoes" 
                                  rows="3"
                                  placeholder="Informações adicionais sobre a ordem..." 
                                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all resize-none"></textarea>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="ordem-prioridade" class="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500">
                        <label for="ordem-prioridade" class="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span class="material-symbols-rounded text-amber-500 text-sm">flag</span>
                            Marcar como prioridade alta
                        </label>
                    </div>
                </form>
            </div>
            <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    Cancelar
                </button>
                <button onclick="document.getElementById('new-order-form').dispatchEvent(new Event('submit'))" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary-500/30 transition-all duration-300 flex items-center gap-2">
                    <span class="material-symbols-rounded text-sm">save</span>
                    Criar Ordem
                </button>
            </div>
        `;
    }
    
    content.innerHTML = html;
    
    // Show modal
    overlay.classList.remove('hidden');
    container.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    // Add listeners for radio buttons to show/hide reposicao fields
    setTimeout(() => {
        const radioButtons = document.querySelectorAll('input[name="tipo-embalagem"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const reposicaoFields = document.getElementById('reposicao-fields');
                if (reposicaoFields) {
                    if (e.target.value === 'Reposição') {
                        reposicaoFields.classList.remove('hidden');
                    } else {
                        reposicaoFields.classList.add('hidden');
                    }
                }
            });
        });
    }, 100);
}

// Fechar Modal
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    if (!overlay || !content) return;
    
    overlay.classList.add('opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        if (container) container.classList.add('hidden');
    }, 300);
}

// Mostrar Detalhes da Ordem
function showOrdemDetail(id) {
    if (typeof ordensDetalhadas === 'undefined') return;
    
    const ordem = ordensDetalhadas.find(o => o.id === id);
    if (!ordem) return;
    
    const modal = document.getElementById('ordem-detail-modal');
    const content = document.getElementById('ordem-detail-content');
    if (!modal || !content) return;
    
    const status = statusMap[ordem.status];
    const timeline = generateTimeline(ordem);
    
    content.innerHTML = `
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                    <span class="material-symbols-rounded">receipt_long</span>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">${ordem.id}</h3>
                    <p class="text-sm text-slate-500">${ordem.product}</p>
                </div>
            </div>
            <button onclick="closeOrdemDetail()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <span class="material-symbols-rounded">close</span>
            </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[70vh]">
            <div class="flex items-center gap-2 mb-6">
                <span class="px-3 py-1.5 rounded-full text-sm font-bold ${status.bg} ${status.text}">
                    ${status.label}
                </span>
                ${ordem.prioridade ? '<span class="px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center gap-1"><span class="material-symbols-rounded text-sm">flag</span> Prioridade Alta</span>' : ''}
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Quantidade</p>
                    <p class="text-lg font-bold text-slate-900 dark:text-white">${ordem.qty} unidades</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Data Prevista</p>
                    <p class="text-lg font-bold text-slate-900 dark:text-white">${formatDate(ordem.dataPrevista)}</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Célula</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.celula}</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Tipo</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.tipoEmbalagem} ${ordem.reposicaoTipo ? '- ' + ordem.reposicaoTipo : ''}</p>
                </div>
                ${ordem.cliente ? `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Cliente</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.cliente}</p>
                </div>
                ` : ''}
                ${ordem.destino ? `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Destino</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.destino}</p>
                </div>
                ` : ''}
                ${ordem.volumes ? `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Volumes</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.volumes} volumes</p>
                </div>
                ` : ''}
            </div>
            
            <h4 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span class="material-symbols-rounded text-primary-500">timeline</span>
                Linha do Tempo
            </h4>
            ${timeline}
            
            ${ordem.observacoes ? `
                <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p class="text-sm font-medium text-amber-900 dark:text-amber-400 mb-1 flex items-center gap-2">
                        <span class="material-symbols-rounded text-sm">info</span>
                        Observações
                    </p>
                    <p class="text-sm text-amber-800 dark:text-amber-300">${ordem.observacoes}</p>
                </div>
            ` : ''}
        </div>
        
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-2 text-sm text-slate-500">
                <span class="material-symbols-rounded text-sm">schedule</span>
                Tempo total: ${ordem.tempoTotal || 'Em andamento'}
            </div>
            <div class="flex gap-2">
                ${ordem.status === 'pending' ? `
                    <button onclick="iniciarSeparacao('${ordem.id}'); closeOrdemDetail();" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <span class="material-symbols-rounded text-sm">play_arrow</span>
                        Iniciar Separação
                    </button>
                ` : ''}
                ${ordem.status === 'progress' ? `
                    <button onclick="abrirFinalizacaoModal('${ordem.id}'); closeOrdemDetail();" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <span class="material-symbols-rounded text-sm">check_circle</span>
                        Concluir e Imprimir
                    </button>
                ` : ''}
                ${ordem.status === 'completed' ? `
                    <button onclick="prepararEntrega('${ordem.id}'); closeOrdemDetail();" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <span class="material-symbols-rounded text-sm">local_shipping</span>
                        Registrar Saída
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Fechar Detalhes da Ordem
function closeOrdemDetail() {
    const modal = document.getElementById('ordem-detail-modal');
    const content = document.getElementById('ordem-detail-content');
    
    if (!content || !modal) return;
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Toggle Notifications
function toggleNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (panel) panel.classList.toggle('hidden');
    
    // Close user menu if open
    const userMenu = document.getElementById('user-menu');
    if (userMenu) userMenu.classList.add('hidden');
}

// Toggle User Menu
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.toggle('hidden');
    
    // Close notifications if open
    const notificationsPanel = document.getElementById('notifications-panel');
    if (notificationsPanel) notificationsPanel.classList.add('hidden');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
        const notificationsPanel = document.getElementById('notifications-panel');
        const userMenu = document.getElementById('user-menu');
        if (notificationsPanel) notificationsPanel.classList.add('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) globalSearch.focus();
    }
    if (e.key === 'Escape') {
        closeModal();
        closeOrdemDetail();
        if (typeof closeFinalizacaoModal === 'function') closeFinalizacaoModal();
    }
});

// Global Search
function handleGlobalSearch(e) {
    if (e.key === 'Enter') {
        const term = e.target.value;
        if (term) {
            showPage('ordens');
            const searchOrdens = document.getElementById('search-ordens');
            if (searchOrdens) searchOrdens.value = term;
            state.ordensSearchTerm = term;
            renderOrdensTable();
        }
    }
}

// Refresh Dashboard
function refreshDashboard() {
    const btn = document.getElementById('refresh-btn');
    if (btn) btn.classList.add('animate-spin');
    setTimeout(() => {
        if (btn) btn.classList.remove('animate-spin');
        renderRecentOrders();
        updateCharts();
        showToast('Dashboard atualizado!', 'success');
    }, 1000);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showPage, toggleSidebar, showModal, closeModal, showOrdemDetail, closeOrdemDetail, toggleNotifications, toggleUserMenu, handleGlobalSearch, refreshDashboard };
}
