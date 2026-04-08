// ============================================
// MODAL DE DETALHES - VERSÃO SIMPLIFICADA
// ============================================

// Abrir Modal de Detalhes
window.showOrdemDetail = function(orderId) {
    console.log('🔵 showOrdemDetail chamado para ordem:', orderId);
    
    const ordem = state.orders?.find(o => o.id === orderId);
    
    if (!ordem) {
        alert('Ordem não encontrada!');
        return;
    }
    
    const status = statusMap[ordem.status] || statusMap.pending;
    
    // Criar modal com funções inline
    const modalHTML = `
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="ordem-detail-modal">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl">
                
                <!-- Header -->
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400">Ordem #${ordem.id}</p>
                    </div>
                    <button onclick="document.getElementById('ordem-detail-modal').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                
                <!-- Body -->
                <div class="p-6 space-y-4">
                    
                    <!-- Status -->
                    <div>
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${status.bg} ${status.text}">
                            ${status.label}
                        </span>
                    </div>
                    
                    <!-- Info Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p class="text-xs text-slate-500 uppercase">Produto</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.product || '-'}</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p class="text-xs text-slate-500 uppercase">Quantidade</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.quantity || 0} un</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p class="text-xs text-slate-500 uppercase">Data</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${formatDate(ordem.data_prevista)}</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                            <p class="text-xs text-slate-500 uppercase">Célula</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.station || '-'}</p>
                        </div>
                    </div>
                    
                    ${ordem.notes ? `
                        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                            <p class="text-xs text-amber-700 uppercase">Observações</p>
                            <p class="text-sm text-amber-800 dark:text-amber-300">${ordem.notes}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Seleção de Operador (PENDING) -->
                    ${ordem.status === 'pending' ? `
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <label class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 block">
                                Selecione o Operador
                            </label>
                            <select id="operador-iniciar-${ordem.id}" 
        class="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
    <option value="">Carregando operadores...</option>
</select>
                        </div>
                    ` : ''}
                    
                </div>
                
                <!-- Footer -->
                <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                    <button onclick="document.getElementById('ordem-detail-modal').remove()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        Fechar
                    </button>
                    
                    <div id="action-buttons-${ordem.id}"></div>
                </div>
                
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar botões baseado no status
    const btnContainer = document.getElementById(`action-buttons-${ordem.id}`);
    
    if (ordem.status === 'pending') {
        btnContainer.innerHTML = `
            <button onclick="window.iniciarOrdem('${ordem.id}')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2">
                <span class="material-symbols-rounded">play_arrow</span>
                Iniciar Separação
            </button>
        `;
        
        // Carregar operadores
        carregarOperadores(ordem.id);
    }
    
    if (ordem.status === 'progress' || ordem.status === 'in_progress') {
        btnContainer.innerHTML = `
            <button onclick="window.concluirOrdem('${ordem.id}')" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2">
                <span class="material-symbols-rounded">check_circle</span>
                Concluir Separação
            </button>
        `;
    }
    
    if (ordem.status === 'completed') {
        btnContainer.innerHTML = `
            <button onclick="window.entregarOrdem('${ordem.id}')" class="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold flex items-center gap-2">
                <span class="material-symbols-rounded">local_shipping</span>
                Registrar Entrega
            </button>
        `;
    }
    
    console.log('✅ Modal aberto com sucesso');
};

// Carregar Operadores
async function carregarOperadores(ordemId) {
    const dropdown = document.getElementById(`operador-iniciar-${ordemId}`);
    if (!dropdown) return;
    
    try {
        const operators = await fetchOperators();
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        operators.forEach(op => {
            dropdown.innerHTML += `<option value="${op.id}">${op.name}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar operadores:', error);
        dropdown.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// INICIAR ORDEM
window.iniciarOrdem = async function(orderId) {
    console.log('🚀 Iniciar ordem:', orderId);
    
    const dropdown = document.getElementById(`operador-iniciar-${orderId}`);
    const operadorId = dropdown?.value;
    
    if (!operadorId) {
        alert('Selecione um operador!');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({
                status: 'progress',
                operator_id: operadorId,
                inicio_separacao: new Date().toISOString()
            })
            .eq('id', orderId);
        
        if (error) throw error;
        
        document.getElementById('ordem-detail-modal').remove();
        await loadOrders();
        
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateCharts === 'function') updateCharts();
        
        showToast('✅ Separação iniciada!', 'success');
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao iniciar separação!');
    }
};

// CONCLUIR ORDEM
window.concluirOrdem = function(orderId) {
    console.log('✅ Concluir ordem:', orderId);
    
    // Fechar modal de detalhes
    const modal = document.getElementById('ordem-detail-modal');
    if (modal) modal.remove();
    
    // Abrir modal de finalização
    setTimeout(() => {
        if (typeof abrirFinalizacaoModal === 'function') {
            abrirFinalizacaoModal(orderId);
        } else {
            alert('Modal de finalização não carregado! Verifique se finalizacao-modal.js está incluído.');
        }
    }, 300);
};

// ENTREGAR ORDEM
window.entregarOrdem = async function(orderId) {
    console.log('🚚 Entregar ordem:', orderId);
    
    if (!confirm('Confirma o registro de entrega?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({
                status: 'delivered',
                data_entrega: new Date().toISOString()
            })
            .eq('id', orderId);
        
        if (error) throw error;
        
        document.getElementById('ordem-detail-modal').remove();
        await loadOrders();
        
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateCharts === 'function') updateCharts();
        
        showToast('✅ Entrega registrada!', 'success');
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar entrega!');
    }
};

console.log('✅ ordem-detail-modal.js carregado');
console.log('✅ Funções disponíveis:', {
    showOrdemDetail: typeof window.showOrdemDetail,
    iniciarOrdem: typeof window.iniciarOrdem,
    concluirOrdem: typeof window.concluirOrdem,
    entregarOrdem: typeof window.entregarOrdem
});
