// ============================================
// MODAL DE DETALHES DA ORDEM
// ============================================

window.showOrdemDetail = function(orderId) {
    console.log('🔵 showOrdemDetail:', orderId);
    
    const ordem = state.orders?.find(o => o.id === orderId);
    if (!ordem) { alert('Ordem não encontrada!'); return; }
    
    const status = statusMap[ordem.status] || statusMap.pending;
    
    const modalHTML = `
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="ordem-detail-modal">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl">
                
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400">Ordem #${ordem.id}</p>
                    </div>
                    <button onclick="document.getElementById('ordem-detail-modal').remove()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                
                <div class="p-6 space-y-4">
                    <div>
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${status.bg} ${status.text}">
                            ${status.label}
                        </span>
                    </div>
                    
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
                    
                    ${ordem.status === 'pending' ? `
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <label class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 block">
                                Selecione o Operador
                            </label>
                            <select id="operador-iniciar-${ordem.id}"
                                class="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500">
                                <option value="">Carregando operadores...</option>
                            </select>
                        </div>
                    ` : ''}
                </div>
                
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
    
    const btnContainer = document.getElementById(`action-buttons-${ordem.id}`);
    
    if (ordem.status === 'pending') {
        btnContainer.innerHTML = `
            <button onclick="window.iniciarOrdem('${ordem.id}')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2">
                <span class="material-symbols-rounded">play_arrow</span>
                Iniciar Separação
            </button>
        `;
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
            <button onclick="window.irParaEntrega('${ordem.id}')" class="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold flex items-center gap-2">
                <span class="material-symbols-rounded">local_shipping</span>
                Registrar Entrega
            </button>
        `;
    }
    
    console.log('✅ Modal aberto');
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
        dropdown.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// INICIAR ORDEM
window.iniciarOrdem = async function(orderId) {
    const dropdown = document.getElementById(`operador-iniciar-${orderId}`);
    const operadorId = dropdown?.value;
    
    if (!operadorId) { alert('Selecione um operador!'); return; }
    
    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ status: 'progress', operator_id: operadorId, inicio_separacao: new Date().toISOString() })
            .eq('id', orderId);
        
        if (error) throw error;
        
        document.getElementById('ordem-detail-modal')?.remove();
        await loadOrders();
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable  === 'function') renderOrdensTable();
        if (typeof updateCharts       === 'function') updateCharts();
        showToast('✅ Separação iniciada!', 'success');
    } catch (error) {
        alert('Erro ao iniciar separação: ' + error.message);
    }
};

// CONCLUIR ORDEM → abre modal de finalização
window.concluirOrdem = function(orderId) {
    document.getElementById('ordem-detail-modal')?.remove();
    setTimeout(() => {
        if (typeof abrirFinalizacaoModal === 'function') {
            abrirFinalizacaoModal(orderId);
        }
    }, 300);
};

// ─── ENTREGAR ORDEM ───────────────────────────────────────────
// Redireciona para a aba "Entrega de Ordem" e pré-preenche o ID
window.irParaEntrega = function(orderId) {
    // Fecha o modal de detalhes
    document.getElementById('ordem-detail-modal')?.remove();

    // Navega para a aba de entrega
    if (typeof showPage === 'function') showPage('entrega');

    // Aguarda a aba renderizar e preenche o campo automaticamente
    setTimeout(() => {
        const campoOrdem = document.getElementById('entrega-ordem');
        const campoData  = document.getElementById('entrega-data');

        if (campoOrdem) {
            campoOrdem.value = orderId;
            // Destaca o campo brevemente para o usuário perceber
            campoOrdem.classList.add('ring-2', 'ring-violet-500');
            setTimeout(() => campoOrdem.classList.remove('ring-2', 'ring-violet-500'), 2000);
        }

        if (campoData) {
            // Pré-preenche com a data de hoje
            campoData.value = new Date().toISOString().split('T')[0];
        }

        // Foca no próximo campo obrigatório (responsável)
        document.getElementById('entrega-responsavel')?.focus();

        showToast('Preencha os dados de entrega e confirme', 'info');
    }, 200);
};

// ─── MANTER COMPATIBILIDADE ───────────────────────────────────
// Caso algum lugar ainda chame entregarOrdem, redireciona
window.entregarOrdem = window.irParaEntrega;

console.log('✅ ordem-detail-modal.js carregado');
