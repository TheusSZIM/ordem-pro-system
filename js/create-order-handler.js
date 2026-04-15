// ============================================
// CREATE ORDER HANDLER — com created_by
// ============================================

let isSubmitting = false;

window.openCreateOrderModal = function() {
    const modalHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="modal-create-order">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-10">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Nova Ordem de Separação</h2>
                        <button onclick="closeCreateOrderModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <span class="material-symbols-rounded text-3xl">close</span>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <form id="create-order-form" class="space-y-6" onsubmit="handleCreateOrder(event)">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data</label>
                            <input type="date" id="ordem-data"
                                   value="${new Date().toISOString().split('T')[0]}"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Operador Responsável</label>
                            <select id="ordem-operador"
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Produto *</label>
                            <input type="text" id="ordem-produto" placeholder="Ex: Sensor de Temperatura XYZ"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white placeholder:text-slate-400"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantidade *</label>
                            <input type="number" id="ordem-quantidade" min="1" placeholder="Ex: 100"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white placeholder:text-slate-400"
                                   required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Célula/Estação</label>
                                <input type="text" id="ordem-celula" placeholder="Ex: Linha A - Estação 3"
                                       class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white placeholder:text-slate-400">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
                                <select id="ordem-prioridade"
                                        class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white">
                                    <option value="low">Baixa</option>
                                    <option value="medium" selected>Média</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Embalagem</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="tipo-embalagem" value="montadora" checked class="w-4 h-4 text-primary-600">
                                    <div>
                                        <p class="font-semibold text-slate-900 dark:text-white">Montadora</p>
                                        <p class="text-xs text-slate-500">Envio direto à linha</p>
                                    </div>
                                </label>
                                <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="tipo-embalagem" value="reposicao" class="w-4 h-4 text-primary-600">
                                    <div>
                                        <p class="font-semibold text-slate-900 dark:text-white">Reposição</p>
                                        <p class="text-xs text-slate-500">Reposição de estoque</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Observações</label>
                            <textarea id="ordem-observacoes" rows="3"
                                      placeholder="Informações adicionais sobre a ordem..."
                                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:text-white placeholder:text-slate-400 resize-none"></textarea>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="ordem-prioridade-alta" class="w-4 h-4 text-primary-600 border-slate-300 rounded">
                            <label for="ordem-prioridade-alta" class="text-sm text-slate-700 dark:text-slate-300">Marcar como prioridade alta</label>
                        </div>
                        <div class="flex items-center justify-end gap-3 pt-4">
                            <button type="button" onclick="closeCreateOrderModal()"
                                    class="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" id="btn-create-order"
                                    class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all">
                                <span class="material-symbols-rounded">add</span>
                                Criar Ordem
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    if (typeof window.populateOperators === 'function') window.populateOperators('ordem-operador');
    setTimeout(() => document.getElementById('ordem-produto')?.focus(), 100);
};

window.closeCreateOrderModal = function() {
    document.getElementById('modal-create-order')?.remove();
    isSubmitting = false;
};

// ── Cria ordem ────────────────────────────────────────────────

async function handleCreateOrder(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const produto       = document.getElementById('ordem-produto')?.value?.trim();
    const quantidade    = document.getElementById('ordem-quantidade')?.value;
    const operador      = document.getElementById('ordem-operador')?.value;
    const celula        = document.getElementById('ordem-celula')?.value?.trim();
    const prioridade    = document.getElementById('ordem-prioridade')?.value;
    const observacoes   = document.getElementById('ordem-observacoes')?.value?.trim();
    const prioridadeAlta = document.getElementById('ordem-prioridade-alta')?.checked;
    const tipoEmbalagem = document.querySelector('input[name="tipo-embalagem"]:checked')?.value;

    if (!produto)            { showToast('Informe o produto!', 'warning'); return; }
    if (!quantidade || quantidade <= 0) { showToast('Informe uma quantidade válida!', 'warning'); return; }

    // ── Quem está criando ──────────────────────────────────────
    let createdBy   = 'Sistema';
    let createdById = null;
    try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        createdBy   = s?.user?.nome || s?.user?.email || 'Sistema';
        createdById = s?.user?.id   || null;
    } catch(_) {}

    try {
        isSubmitting = true;
        const submitBtn = document.getElementById('btn-create-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="material-symbols-rounded animate-spin">progress_activity</span><span>Criando...</span>`;
        }

        // Extrai linha/estação da célula
        let linha = 'A', estacao = '1';
        if (celula) {
            const lm = celula.match(/linha\s*([A-Z])/i);
            const em = celula.match(/esta[çc][aã]o\s*(\d+)/i);
            if (lm) linha   = lm[1].toUpperCase();
            if (em) estacao = em[1];
        }

        const timestamp    = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        const orderId      = `${timestamp}${randomSuffix}`;

        const ordemData = {
            id:                   orderId,
            product:              produto,
            quantity:             parseInt(quantidade),
            operador_responsavel: operador || null,
            station:              celula   || null,
            linha,
            estacao,
            priority:             prioridadeAlta ? 'high' : (prioridade || 'medium'),
            status:               'pending',
            tipo_embalagem:       tipoEmbalagem || 'montadora',
            packaging_type:       tipoEmbalagem || 'montadora',
            observacoes:          observacoes   || null,
            numero_volumes:       1,
            created_at:           new Date().toISOString(),
            // ── Quem criou ──────────────────────────────────────
            lote:                 lote,
            created_by:           createdBy,
            created_by_id:        createdById,
        };

        if (!window.supabaseClient) throw new Error('Supabase não conectado');

        const { data: novaOrdem, error } = await window.supabaseClient
            .from('orders')
            .insert([ordemData])
            .select()
            .single();

        if (error) throw error;

        document.getElementById('modal-create-order')?.remove();
        showToast(`✅ Ordem ${orderId} criada por ${createdBy}!`, 'success');

        setTimeout(async () => {
            if (typeof window.loadOrders         === 'function') await window.loadOrders();
            if (typeof window.renderRecentOrders === 'function') window.renderRecentOrders();
            if (typeof window.renderOrdensTable  === 'function') window.renderOrdensTable();
            if (typeof window.updateCharts       === 'function') window.updateCharts();
            if (typeof window.renderDashboardStats === 'function') window.renderDashboardStats();
            isSubmitting = false;
        }, 300);

    } catch(error) {
        console.error('Erro ao criar ordem:', error);
        const submitBtn = document.getElementById('btn-create-order');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span class="material-symbols-rounded">add</span>Criar Ordem`;
        }
        isSubmitting = false;
        showToast('Erro: ' + error.message, 'error');
    }
}

window.openCreateOrderModal  = openCreateOrderModal;
window.closeCreateOrderModal = closeCreateOrderModal;
window.handleCreateOrder     = handleCreateOrder;
window.handleNewOrder        = handleCreateOrder; // alias

console.log('✅ create-order-handler.js carregado (versão final com alias)!');
