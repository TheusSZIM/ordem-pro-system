/* ============================================
   CONTROLE DE ORDENS PRO - KANBAN BOARD
   ============================================ */

// Inicializar Kanban
function initKanban() {
    const board = document.getElementById('kanban-board');
    if (!board || typeof ordensDetalhadas === 'undefined') return;
    
    const columns = [
        { id: 'pending', title: 'Pendente Separação', color: 'amber', icon: 'schedule' },
        { id: 'progress', title: 'Em Separação', color: 'blue', icon: 'sync' },
        { id: 'completed', title: 'Concluídas', color: 'emerald', icon: 'check_circle' },
        { id: 'delivered', title: 'Entregues', color: 'violet', icon: 'local_shipping' }
    ];
    
    board.innerHTML = columns.map(col => {
        const colOrdens = ordensDetalhadas.filter(o => o.status === col.id);
        
        return `
            <div class="kanban-column w-80 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 transition-all duration-300" 
                 data-status="${col.id}"
                 ondrop="drop(event)" 
                 ondragover="allowDrop(event)"
                 ondragenter="dragEnter(event)"
                 ondragleave="dragLeave(event)">
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-${col.color}-100 dark:bg-${col.color}-900/30 text-${col.color}-600 flex items-center justify-center">
                            <span class="material-symbols-rounded text-sm">${col.icon}</span>
                        </div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-sm">${col.title}</h3>
                    </div>
                    <span class="px-2 py-1 bg-white dark:bg-slate-700 text-xs font-bold rounded-lg text-slate-600 dark:text-slate-300">${colOrdens.length}</span>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
                    ${colOrdens.map(ordem => `
                        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-move hover:shadow-md transition-all duration-200 group"
                             draggable="true"
                             ondragstart="drag(event)"
                             data-id="${ordem.id}">
                            
                            ${ordem.prioridade ? '<div class="flex items-center gap-1 mb-2 text-amber-600 text-xs font-medium"><span class="material-symbols-rounded text-sm">flag</span> Prioridade</div>' : ''}
                            
                            <h4 class="font-semibold text-slate-900 dark:text-white text-sm mb-1">${ordem.id}</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">${ordem.product}</p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-1 text-xs text-slate-400">
                                    <span class="material-symbols-rounded text-sm">inventory_2</span>
                                    ${ordem.qty}
                                </div>
                                <button onclick="showOrdemDetail('${ordem.id}')" class="opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 hover:text-primary-700">
                                    <span class="material-symbols-rounded text-sm">visibility</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <button onclick="showModal('new-order')" class="mt-4 w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-rounded text-sm">add</span>
                    Nova Ordem
                </button>
            </div>
        `;
    }).join('');
}

// Drag and Drop Functions
function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
}

function dragLeave(ev) {
    ev.currentTarget.classList.remove('drag-over');
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    
    const id = ev.dataTransfer.getData("text");
    const newStatus = ev.currentTarget.dataset.status;
    
    const ordem = ordensDetalhadas.find(o => o.id === id);
    if (ordem && ordem.status !== newStatus) {
        // Se estiver movendo para completed, abrir modal de finalização
        if (newStatus === 'completed' && ordem.status === 'progress') {
            abrirFinalizacaoModal(id);
            document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
            return;
        }
        
        // Update status based on column
        ordem.status = newStatus;
        
        // Update timestamps based on status change
        if (newStatus === 'progress' && !ordem.inicioSeparacao) {
            ordem.inicioSeparacao = new Date().toLocaleString('pt-BR');
            ordem.separador = 'Marcos Vieira';
        }
        if (newStatus === 'completed' && !ordem.fimSeparacao) {
            ordem.fimSeparacao = new Date().toLocaleString('pt-BR');
            const inicio = new Date(ordem.inicioSeparacao);
            const fim = new Date();
            const diff = Math.abs(fim - inicio);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            ordem.tempoTotal = `${hours}h ${minutes}min`;
        }
        
        showToast(`Ordem movida para ${statusMap[newStatus].label}`, 'success');
        initKanban();
        renderRecentOrders();
        updateCharts();
    }
    
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initKanban, allowDrop, dragEnter, dragLeave, drag, drop };
}
