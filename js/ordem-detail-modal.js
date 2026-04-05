// ============================================
// MODAL DE DETALHES DA ORDEM + INICIAR SEPARAÇÃO
// ============================================

// Mostrar Detalhes da Ordem
function showOrdemDetail(orderId) {
    console.log('📋 Abrindo detalhes da ordem:', orderId);
    
    // Encontrar a ordem
    const ordem = state.orders?.find(o => o.id === orderId);
    
    if (!ordem) {
        console.error('❌ Ordem não encontrada:', orderId);
        showToast('Ordem não encontrada!', 'error');
        return;
    }
    
    // Criar HTML do modal
    const status = statusMap[ordem.status] || statusMap.pending;
    
    const modalHTML = `
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="ordem-detail-modal" onclick="if(event.target === this) closeOrdemDetail()">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                
                <!-- Header -->
                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-0.5">#{ordem.id}</p>
                    </div>
                    <button onclick="closeOrdemDetail()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span class="material-symbols-rounded text-slate-500">close</span>
                    </button>
                </div>
                
                <!-- Body -->
                <div class="p-6 overflow-y-auto flex-1 space-y-6">
                    
                    <!-- Status Badge -->
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${status.bg} ${status.text}">
                            <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                            ${status.label}
                        </span>
                        ${ordem.priority === 'high' ? `
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                <span class="material-symbols-rounded text-sm">flag</span>
                                Prioridade Alta
                            </span>
                        ` : ''}
                    </div>
                    
                    <!-- Informações Principais -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Produto</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.product || '-'}</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Quantidade</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.quantity || 0} unidades</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Data Prevista</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${formatDate(ordem.data_prevista)}</p>
                        </div>
                        
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Célula/Estação</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">${ordem.station || '-'}</p>
                        </div>
                    </div>
                    
                    <!-- Tipo de Embalagem -->
                    ${ordem.packaging_type ? `
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Tipo de Embalagem</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-white capitalize">${ordem.packaging_type}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Observações -->
                    ${ordem.notes ? `
                        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                            <p class="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <span class="material-symbols-rounded text-sm">info</span>
                                Observações
                            </p>
                            <p class="text-sm text-amber-800 dark:text-amber-300">${ordem.notes}</p>
                        </div>
                    ` : ''}
                    
                    <!-- Operador Responsável (se status = pending) -->
                    ${ordem.status === 'pending' ? `
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <label class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                                <span class="material-symbols-rounded text-lg">person</span>
                                Selecione o Operador para Iniciar
                            </label>
                            <select id="operador-iniciar" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all">
                                <option value="">Selecione um operador...</option>
                                <!-- Será populado dinamicamente -->
                            </select>
                        </div>
                    ` : ''}
                    
                    <!-- Timeline (se já iniciou) -->
                    ${ordem.inicio_separacao || ordem.fim_separacao ? `
                        <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <span class="material-symbols-rounded">timeline</span>
                                Linha do Tempo
                            </h4>
                            <div class="space-y-2">
                                ${ordem.inicio_separacao ? `
                                    <div class="flex items-center gap-3 text-sm">
                                        <span class="material-symbols-rounded text-blue-500">play_circle</span>
                                        <span class="text-slate-600 dark:text-slate-400">Iniciado em:</span>
                                        <span class="font-semibold text-slate-900 dark:text-white">${formatDateTime(ordem.inicio_separacao)}</span>
                                    </div>
                                ` : ''}
                                ${ordem.fim_separacao ? `
                                    <div class="flex items-center gap-3 text-sm">
                                        <span class="material-symbols-rounded text-emerald-500">check_circle</span>
                                        <span class="text-slate-600 dark:text-slate-400">Concluído em:</span>
                                        <span class="font-semibold text-slate-900 dark:text-white">${formatDateTime(ordem.fim_separacao)}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                </div>
                
                <!-- Footer com Ações -->
                <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <button onclick="closeOrdemDetail()" class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Fechar
                    </button>
                    
                    <div class="flex gap-2">
                        ${ordem.status === 'pending' ? `
                            <button onclick="iniciarSeparacaoComOperador('${ordem.id}')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg">
                                <span class="material-symbols-rounded">play_arrow</span>
                                Iniciar Separação
                            </button>
                        ` : ''}
                        
                        ${ordem.status === 'progress' || ordem.status === 'in_progress' ? `
                            <button onclick="concluirSeparacao('${ordem.id}')" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg">
                                <span class="material-symbols-rounded">check_circle</span>
                                Concluir Separação
                            </button>
                        ` : ''}
                        
                        ${ordem.status === 'completed' ? `
                            <button onclick="registrarEntrega('${ordem.id}')" class="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg">
                                <span class="material-symbols-rounded">local_shipping</span>
                                Registrar Entrega
                            </button>
                        ` : ''}
                    </div>
                </div>
                
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    const existingModal = document.getElementById('ordem-detail-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Popular dropdown de operadores (se status = pending)
    if (ordem.status === 'pending') {
        setTimeout(() => {
            populateOperadorIniciar();
        }, 100);
    }
    
    console.log('✅ Modal de detalhes aberto');
}

// Popular Dropdown de Operador (para iniciar)
async function populateOperadorIniciar() {
    const dropdown = document.getElementById('operador-iniciar');
    
    if (!dropdown) return;
    
    try {
        const operators = await fetchOperators();
        
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        
        operators.forEach(op => {
            const option = document.createElement('option');
            option.value = op.id;
            option.textContent = op.name;
            dropdown.appendChild(option);
        });
        
        console.log('✅ Dropdown de operador populado');
    } catch (error) {
        console.error('❌ Erro ao popular operadores:', error);
    }
}

// Iniciar Separação com Operador Selecionado
async function iniciarSeparacaoComOperador(orderId) {
    console.log('🚀 Iniciando separação da ordem:', orderId);
    
    const operadorId = document.getElementById('operador-iniciar')?.value;
    
    if (!operadorId) {
        showToast('❌ Selecione um operador!', 'error');
        return;
    }
    
    try {
        // Atualizar no Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .update({
                status: 'progress',
                operator_id: operadorId,
                inicio_separacao: new Date().toISOString()
            })
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) {
            console.error('❌ Erro ao iniciar separação:', error);
            showToast('❌ Erro ao iniciar separação!', 'error');
            return;
        }
        
        console.log('✅ Separação iniciada:', data);
        
        // Fechar modal
        closeOrdemDetail();
        
        // Recarregar dados
        await loadOrders();
        
        // Atualizar interface
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateCharts === 'function') updateCharts();
        
        showToast('✅ Separação iniciada com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        showToast('❌ Erro ao iniciar separação!', 'error');
    }
}

// Fechar Modal de Detalhes
function closeOrdemDetail() {
    const modal = document.getElementById('ordem-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// Formatar Data e Hora
function formatDateTime(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return '-';
    }
}

// Exportar funções globalmente
window.showOrdemDetail = showOrdemDetail;
window.closeOrdemDetail = closeOrdemDetail;
window.iniciarSeparacaoComOperador = iniciarSeparacaoComOperador;
window.populateOperadorIniciar = populateOperadorIniciar;

console.log('✅ ordem-detail-modal.js carregado!');
