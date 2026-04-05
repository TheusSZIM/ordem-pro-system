// Página: Quadro Kanban (COMPLETO)
async function renderKanbanPage() {
    const orders = await ordersModule.fetchAll();
    
    // Organizar por status
    const pending = orders.filter(o => o.status === 'pending');
    const progress = orders.filter(o => o.status === 'progress');
    const completed = orders.filter(o => o.status === 'completed');
    
    return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Quadro Kanban</h2>
                    <p class="text-slate-400 mt-1">Arraste os cards para alterar o status</p>
                </div>
                <button onclick="createOrder()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                    <span class="material-symbols-rounded">add</span>
                    Nova Ordem
                </button>
            </div>

            <!-- Kanban Board -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Coluna: Pendente -->
                <div class="bg-slate-800 rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                            <h3 class="font-bold">Pendente</h3>
                            <span class="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">${pending.length}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3 min-h-[400px]" id="kanban-pending" ondrop="dropCard(event, 'pending')" ondragover="allowDrop(event)">
                        ${pending.map(order => renderKanbanCard(order)).join('')}
                    </div>
                </div>

                <!-- Coluna: Em Andamento -->
                <div class="bg-slate-800 rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                            <h3 class="font-bold">Em Andamento</h3>
                            <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">${progress.length}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3 min-h-[400px]" id="kanban-progress" ondrop="dropCard(event, 'progress')" ondragover="allowDrop(event)">
                        ${progress.map(order => renderKanbanCard(order)).join('')}
                    </div>
                </div>

                <!-- Coluna: Concluída -->
                <div class="bg-slate-800 rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <h3 class="font-bold">Concluída</h3>
                            <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">${completed.length}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3 min-h-[400px]" id="kanban-completed" ondrop="dropCard(event, 'completed')" ondragover="allowDrop(event)">
                        ${completed.map(order => renderKanbanCard(order)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderKanbanCard(order) {
    return `
        <div class="bg-slate-700 rounded-lg p-4 cursor-move hover:bg-slate-600 transition-all" 
             draggable="true" 
             ondragstart="dragCard(event, '${order.id}')"
             id="card-${order.id}">
            <div class="flex items-start justify-between mb-2">
                <span class="font-mono text-xs text-blue-400">${order.id}</span>
                <span class="px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}">
                    ${getStatusLabel(order.status)}
                </span>
            </div>
            
            <h4 class="font-semibold mb-2">${order.client || 'Cliente'}</h4>
            <p class="text-sm text-slate-400 mb-3">${order.product || 'Produto'}</p>
            
            <div class="flex items-center justify-between text-xs text-slate-400">
                <span>${formatDate(order.created_at)}</span>
                <button onclick="viewOrderDetails('${order.id}')" class="text-blue-400 hover:text-blue-300">
                    <span class="material-symbols-rounded text-sm">visibility</span>
                </button>
            </div>
        </div>
    `;
}

// Drag and Drop Functions
let draggedOrderId = null;

function dragCard(event, orderId) {
    draggedOrderId = orderId;
    event.dataTransfer.effectAllowed = 'move';
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

async function dropCard(event, newStatus) {
    event.preventDefault();
    
    if (!draggedOrderId) return;
    
    try {
        // Atualizar status no banco
        const result = await ordersModule.update(draggedOrderId, { status: newStatus });
        
        if (result.success) {
            showToast('Status atualizado!', 'success');
            // Recarregar página
            await app.renderPage('kanban');
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        showToast('Erro ao atualizar status', 'error');
    }
    
    draggedOrderId = null;
}

function viewOrderDetails(orderId) {
    showToast('Detalhes da ordem: ' + orderId, 'info');
    // Implementar modal de detalhes
}
