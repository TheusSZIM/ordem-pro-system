// Página: Estoque (COMPLETA)
async function renderStockPage() {
    return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Controle de Estoque</h2>
                    <p class="text-slate-400 mt-1">Gerencie produtos e inventário</p>
                </div>
                <button onclick="addProduct()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                    <span class="material-symbols-rounded">add</span>
                    Adicionar Produto
                </button>
            </div>

            <!-- Cards de Resumo -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-400">inventory</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Total Produtos</p>
                            <p class="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-emerald-400">check_circle</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Em Estoque</p>
                            <p class="text-2xl font-bold text-emerald-400">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-amber-400">warning</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Estoque Baixo</p>
                            <p class="text-2xl font-bold text-amber-400">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-red-400">cancel</span>
                        </div>
                        <div>
                            <p class="text-sm text-slate-400">Sem Estoque</p>
                            <p class="text-2xl font-bold text-red-400">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtros -->
            <div class="bg-slate-800 rounded-2xl p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Buscar produto..." 
                           class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                    <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                        <option>Todas as categorias</option>
                        <option>Eletrônicos</option>
                        <option>Alimentos</option>
                        <option>Bebidas</option>
                    </select>
                    <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                        <option>Todos os status</option>
                        <option>Em estoque</option>
                        <option>Estoque baixo</option>
                        <option>Sem estoque</option>
                    </select>
                </div>
            </div>

            <!-- Tabela de Produtos -->
            <div class="bg-slate-800 rounded-2xl overflow-hidden">
                <table class="w-full">
                    <thead class="bg-slate-900">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">SKU</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Produto</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Categoria</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Quantidade</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Mínimo</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                            <th class="px-6 py-4 text-right text-xs font-semibold uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                                <span class="material-symbols-rounded text-6xl mb-4 block">inventory_2</span>
                                Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function addProduct() {
    showToast('Adicionar produto - Em desenvolvimento', 'info');
}
