// Página: Lista de Ordens (COMPLETA)
async function renderOrdersPage() {
    const orders = await ordersModule.fetchAll();
    
    return `
        <div class="p-6">
            <!-- Header com filtros -->
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-bold">Lista de Ordens</h2>
                        <p class="text-slate-400 mt-1">${orders.length} ordens no total</p>
                    </div>
                    <button onclick="createOrder()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                        <span class="material-symbols-rounded">add</span>
                        Nova Ordem
                    </button>
                </div>

                <!-- Filtros -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="relative">
                        <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input type="text" 
                               id="search-orders" 
                               placeholder="Buscar por ID, cliente..." 
                               class="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                               oninput="filterOrders()">
                    </div>

                    <select id="filter-status" 
                            class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                            onchange="filterOrders()">
                        <option value="">Todos os status</option>
                        <option value="pending">Pendente</option>
                        <option value="progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="cancelled">Cancelada</option>
                    </select>

                    <select id="filter-date" 
                            class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                            onchange="filterOrders()">
                        <option value="">Todas as datas</option>
                        <option value="today">Hoje</option>
                        <option value="week">Última semana</option>
                        <option value="month">Último mês</option>
                    </select>

                    <button onclick="exportOrders()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                        <span class="material-symbols-rounded">download</span>
                        Exportar
                    </button>
                </div>
            </div>

            <!-- Tabela -->
            <div class="bg-slate-800 rounded-2xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-900">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    <input type="checkbox" id="select-all" onchange="selectAllOrders(this.checked)" class="rounded">
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onclick="sortOrders('id')">
                                    ID <span class="material-symbols-rounded text-sm">swap_vert</span>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onclick="sortOrders('client')">
                                    Cliente <span class="material-symbols-rounded text-sm">swap_vert</span>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Produto</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onclick="sortOrders('status')">
                                    Status <span class="material-symbols-rounded text-sm">swap_vert</span>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer" onclick="sortOrders('created_at')">
                                    Data <span class="material-symbols-rounded text-sm">swap_vert</span>
                                </th>
                                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="orders-table-body">
                            ${renderOrdersTableRows(orders)}
                        </tbody>
                    </table>
                </div>

                <!-- Paginação -->
                <div class="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div class="text-sm text-slate-400">
                        Mostrando <span id="showing-count">${orders.length}</span> de <span id="total-count">${orders.length}</span> ordens
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-50" disabled>
                            <span class="material-symbols-rounded text-sm">chevron_left</span>
                        </button>
                        <button class="px-3 py-1 bg-blue-600 rounded font-semibold">1</button>
                        <button class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-50" disabled>
                            <span class="material-symbols-rounded text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderOrdersTableRows(orders) {
    if (orders.length === 0) {
        return `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                    <span class="material-symbols-rounded text-6xl mb-4 block">inbox</span>
                    Nenhuma ordem encontrada
                </td>
            </tr>
        `;
    }

    return orders.map(order => `
        <tr class="border-b border-slate-700 hover:bg-slate-700/50 transition-all order-row" data-order-id="${order.id}">
            <td class="px-6 py-4">
                <input type="checkbox" class="order-checkbox rounded" value="${order.id}">
            </td>
            <td class="px-6 py-4">
                <span class="font-mono text-sm text-blue-400">${order.id}</span>
            </td>
            <td class="px-6 py-4">
                <div class="font-semibold">${order.client || '-'}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-slate-300">${truncateText(order.product || '-', 50)}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}">
                    ${getStatusLabel(order.status)}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-slate-400">${formatDate(order.created_at)}</div>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="viewOrderDetails('${order.id}')" class="p-2 hover:bg-slate-600 rounded-lg" title="Ver detalhes">
                        <span class="material-symbols-rounded text-sm">visibility</span>
                    </button>
                    <button onclick="editOrder('${order.id}')" class="p-2 hover:bg-slate-600 rounded-lg" title="Editar">
                        <span class="material-symbols-rounded text-sm">edit</span>
                    </button>
                    <button onclick="deleteOrder('${order.id}')" class="p-2 hover:bg-red-600 rounded-lg text-red-400" title="Deletar">
                        <span class="material-symbols-rounded text-sm">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Funções de filtro e ordenação
async function filterOrders() {
    const searchTerm = document.getElementById('search-orders').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;
    
    const orders = await ordersModule.fetchAll();
    
    let filtered = orders.filter(order => {
        // Filtro de busca
        const matchesSearch = !searchTerm || 
            order.id.toLowerCase().includes(searchTerm) ||
            (order.client && order.client.toLowerCase().includes(searchTerm)) ||
            (order.product && order.product.toLowerCase().includes(searchTerm));
        
        // Filtro de status
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        // Filtro de data
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.created_at);
            const now = new Date();
            
            if (dateFilter === 'today') {
                matchesDate = orderDate.toDateString() === now.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = orderDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = orderDate >= monthAgo;
            }
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = renderOrdersTableRows(filtered);
    
    document.getElementById('showing-count').textContent = filtered.length;
}

function sortOrders(field) {
    showToast('Ordenando por ' + field, 'info');
    // Implementar ordenação
}

function selectAllOrders(checked) {
    document.querySelectorAll('.order-checkbox').forEach(cb => cb.checked = checked);
}

function editOrder(orderId) {
    showToast('Editando ordem: ' + orderId, 'info');
}

async function deleteOrder(orderId) {
    if (confirm('Tem certeza que deseja deletar esta ordem?')) {
        const result = await ordersModule.delete(orderId);
        if (result.success) {
            await app.renderPage('orders');
        }
    }
}

function exportOrders() {
    showToast('Exportando ordens...', 'info');
    // Implementar exportação CSV/Excel
}
