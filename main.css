// Página: Equipe (COMPLETA)
async function renderTeamPage() {
    const operators = await operatorsModule.fetchAll();
    const stats = operatorsModule.getStats();
    
    return `
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Equipe</h2>
                    <p class="text-slate-400 mt-1">${stats.active} operadores ativos de ${stats.total} total</p>
                </div>
                <button onclick="openAddOperatorModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                    <span class="material-symbols-rounded">person_add</span>
                    Adicionar Operador
                </button>
            </div>

            <!-- Cards de Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-400">group</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Total de Operadores</p>
                            <p class="text-2xl font-bold">${stats.total}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-emerald-400">check_circle</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Ativos</p>
                            <p class="text-2xl font-bold text-emerald-400">${stats.active}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-amber-400">inventory</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Total de Ordens</p>
                            <p class="text-2xl font-bold">${stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabela de Operadores -->
            <div class="bg-slate-800 rounded-2xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-900">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Nome</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Email</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Ordens</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Criado em</th>
                                <th class="px-6 py-4 text-right text-xs font-semibold uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${operators.map(op => renderOperatorRow(op)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Adicionar/Editar Operador -->
        <div id="operator-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center">
            <div class="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold" id="modal-title">Adicionar Operador</h3>
                    <button onclick="closeOperatorModal()" class="text-slate-400 hover:text-white">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="operator-form" onsubmit="saveOperator(event)" class="space-y-4">
                    <input type="hidden" id="operator-id">
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Nome</label>
                        <input type="text" id="operator-name" required 
                               class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" id="operator-email" 
                               class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Status</label>
                        <select id="operator-active" 
                                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                        </select>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="closeOperatorModal()" 
                                class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function renderOperatorRow(operator) {
    return `
        <tr class="border-b border-slate-700 hover:bg-slate-700/50">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-semibold">
                        ${operator.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="font-semibold">${operator.name}</div>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-400">${operator.email || '-'}</td>
            <td class="px-6 py-4">
                <span class="font-semibold">${operator.total_orders || 0}</span>
            </td>
            <td class="px-6 py-4">
                ${operator.active 
                    ? '<span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Ativo</span>'
                    : '<span class="px-3 py-1 bg-slate-600 text-slate-400 rounded-full text-xs font-semibold">Inativo</span>'
                }
            </td>
            <td class="px-6 py-4 text-slate-400 text-sm">
                ${formatDate(operator.created_at)}
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button onclick='editOperator(${JSON.stringify(operator)})' 
                            class="p-2 hover:bg-slate-600 rounded-lg" title="Editar">
                        <span class="material-symbols-rounded text-sm">edit</span>
                    </button>
                    <button onclick="toggleOperatorStatus('${operator.id}', ${!operator.active})" 
                            class="p-2 hover:bg-slate-600 rounded-lg" title="${operator.active ? 'Desativar' : 'Ativar'}">
                        <span class="material-symbols-rounded text-sm">${operator.active ? 'block' : 'check'}</span>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Funções do Modal
function openAddOperatorModal() {
    document.getElementById('modal-title').textContent = 'Adicionar Operador';
    document.getElementById('operator-form').reset();
    document.getElementById('operator-id').value = '';
    document.getElementById('operator-modal').classList.remove('hidden');
}

function editOperator(operator) {
    document.getElementById('modal-title').textContent = 'Editar Operador';
    document.getElementById('operator-id').value = operator.id;
    document.getElementById('operator-name').value = operator.name;
    document.getElementById('operator-email').value = operator.email || '';
    document.getElementById('operator-active').value = operator.active.toString();
    document.getElementById('operator-modal').classList.remove('hidden');
}

function closeOperatorModal() {
    document.getElementById('operator-modal').classList.add('hidden');
}

async function saveOperator(event) {
    event.preventDefault();
    
    const id = document.getElementById('operator-id').value;
    const data = {
        name: document.getElementById('operator-name').value,
        email: document.getElementById('operator-email').value || null,
        active: document.getElementById('operator-active').value === 'true'
    };
    
    try {
        let result;
        if (id) {
            result = await operatorsModule.update(id, data);
        } else {
            result = await operatorsModule.create(data);
        }
        
        if (result.success) {
            closeOperatorModal();
            await app.renderPage('team');
        }
    } catch (error) {
        console.error('Erro ao salvar operador:', error);
        showToast('Erro ao salvar operador', 'error');
    }
}

async function toggleOperatorStatus(id, newStatus) {
    const result = await operatorsModule.update(id, { active: newStatus });
    if (result.success) {
        await app.renderPage('team');
    }
}
