// ============================================
// CREATE ORDER HANDLER - VERSÃO COMPLETA CORRIGIDA
// Sistema Ordem Pro
// ============================================

// Flag global para prevenir submits duplicados
let isSubmitting = false;

// Abrir Modal de Criação de Ordem
window.openCreateOrderModal = function() {
    console.log('📝 Abrindo modal de criação de ordem...');
    
    const modalHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="modal-create-order">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-10">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Nova Ordem de Separação</h2>
                        <button onclick="closeCreateOrderModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <span class="material-symbols-rounded text-3xl">close</span>
                        </button>
                    </div>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                    <form id="create-order-form" class="space-y-6" onsubmit="handleCreateOrder(event)">
                        
                        <!-- Data -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Data</label>
                            <input type="date" 
                                   id="ordem-data"
                                   value="${new Date().toISOString().split('T')[0]}"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                                   required>
                        </div>
                        
                        <!-- Operador -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Operador Responsável</label>
                            <select id="ordem-operador"
                                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        
                        <!-- Produto -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Produto *</label>
                            <input type="text" 
                                   id="ordem-produto"
                                   placeholder="Ex: Sensor de Temperatura XYZ"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder:text-slate-400"
                                   required>
                        </div>
                        
                        <!-- Quantidade -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantidade *</label>
                            <input type="number" 
                                   id="ordem-quantidade"
                                   min="1"
                                   placeholder="Ex: 100"
                                   class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder:text-slate-400"
                                   required>
                        </div>
                        
                        <!-- Linha/Estação -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Célula/Estação</label>
                                <input type="text" 
                                       id="ordem-celula"
                                       placeholder="Ex: Linha A - Estação 3"
                                       class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder:text-slate-400">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prioridade</label>
                                <select id="ordem-prioridade"
                                        class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white">
                                    <option value="low">Baixa</option>
                                    <option value="medium" selected>Média</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Tipo de Embalagem -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Embalagem</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="tipo-embalagem" value="montadora" checked class="w-4 h-4 text-primary-600">
                                    <div>
                                        <p class="font-semibold text-slate-900 dark:text-white">Montadora</p>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">Envio direto à linha</p>
                                    </div>
                                </label>
                                <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="tipo-embalagem" value="reposicao" class="w-4 h-4 text-primary-600">
                                    <div>
                                        <p class="font-semibold text-slate-900 dark:text-white">Reposição</p>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">Reposição de estoque</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Observações -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Observações</label>
                            <textarea id="ordem-observacoes" 
                                      rows="3"
                                      placeholder="Informações adicionais sobre a ordem..."
                                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white placeholder:text-slate-400 resize-none"></textarea>
                        </div>
                        
                        <!-- Checkbox Prioridade Alta -->
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="ordem-prioridade-alta" class="w-4 h-4 text-primary-600 border-slate-300 rounded">
                            <label for="ordem-prioridade-alta" class="text-sm text-slate-700 dark:text-slate-300">
                                Marcar como prioridade alta
                            </label>
                        </div>
                        
                        <!-- Botões -->
                        <div class="flex items-center justify-end gap-3 pt-4">
                            <button type="button" 
                                    onclick="closeCreateOrderModal()"
                                    class="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" 
                                    id="btn-create-order"
                                    class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all">
                                <span class="material-symbols-rounded">add</span>
                                Criar Ordem
                            </button>
                        </div>
                        
                    </form>
                </div>
                
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Carregar operadores
    if (typeof window.populateOperators === 'function') {
        window.populateOperators('ordem-operador');
    }
    
    // Focar no primeiro campo
    setTimeout(() => {
        document.getElementById('ordem-produto')?.focus();
    }, 100);
};

// Fechar Modal
window.closeCreateOrderModal = function() {
    const modal = document.getElementById('modal-create-order');
    if (modal) {
        modal.remove();
        // Resetar flag ao fechar
        isSubmitting = false;
    }
};

// Criar Ordem - VERSÃO CORRIGIDA COM PROTEÇÃO ANTI-DUPLICATE
async function handleCreateOrder(event) {
    event.preventDefault();
    
    // ✅ PROTEÇÃO ANTI-DUPLICATE: Verificar se já está submetendo
    if (isSubmitting) {
        console.log('⚠️ Já está criando ordem, aguarde...');
        return;
    }
    
    console.log('📝 Iniciando criação de ordem...');
    
    // Coletar dados do formulário
    const produto = document.getElementById('ordem-produto')?.value?.trim();
    const quantidade = document.getElementById('ordem-quantidade')?.value;
    const operador = document.getElementById('ordem-operador')?.value;
    const celula = document.getElementById('ordem-celula')?.value?.trim();
    const prioridade = document.getElementById('ordem-prioridade')?.value;
    const observacoes = document.getElementById('ordem-observacoes')?.value?.trim();
    const prioridadeAlta = document.getElementById('ordem-prioridade-alta')?.checked;
    const tipoEmbalagem = document.querySelector('input[name="tipo-embalagem"]:checked')?.value;
    
    // Validações
    if (!produto) {
        showToast('⚠️ Informe o produto!', 'warning');
        return;
    }
    
    if (!quantidade || quantidade <= 0) {
        showToast('⚠️ Informe uma quantidade válida!', 'warning');
        return;
    }
    
    try {
        // ✅ MARCAR COMO SUBMETENDO
        isSubmitting = true;
        
        // ✅ DESABILITAR BOTÃO E MOSTRAR SPINNER
        const submitBtn = document.getElementById('btn-create-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Criando...</span>
            `;
        }
        
        // Gerar ID único baseado em timestamp + random
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        const orderId = `${timestamp}${randomSuffix}`;
        
        // Extrair linha e estação da célula (se fornecido)
        let linha = 'A';
        let estacao = '1';
        
        if (celula) {
            const celulaMatch = celula.match(/linha\s*([A-Z])/i);
            const estacaoMatch = celula.match(/estação\s*(\d+)/i);
            
            if (celulaMatch) linha = celulaMatch[1].toUpperCase();
            if (estacaoMatch) estacao = estacaoMatch[1];
        }
        
        // Preparar dados da ordem
        const ordemData = {
            id: orderId,
            product: produto,
            quantity: parseInt(quantidade),
            operador_responsavel: operador || null,
            linha: linha,
            estacao: estacao,
            priority: prioridadeAlta ? 'high' : (prioridade || 'medium'),
            status: 'pending',
            tipo_embalagem: tipoEmbalagem || 'montadora',
            observacoes: observacoes || null,
            numero_volumes: 1,
            created_at: new Date().toISOString()
        };
        
        console.log('📦 Ordem a ser criada:', ordemData);
        
        // Validar se supabaseClient existe
        if (!window.supabaseClient) {
            throw new Error('Supabase não está conectado');
        }
        
        // Criar ordem no Supabase
        const { data: novaOrdem, error } = await window.supabaseClient
            .from('orders')
            .insert([ordemData])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Erro ao criar ordem:', error);
            
            // ✅ REABILITAR BOTÃO EM CASO DE ERRO
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span class="material-symbols-rounded">add</span>
                    Criar Ordem
                `;
            }
            
            isSubmitting = false;
            showToast('❌ Erro ao criar ordem: ' + error.message, 'error');
            return;
        }
        
        console.log('✅ Ordem criada no Supabase:', novaOrdem);
        
        // ✅ FECHAR MODAL IMEDIATAMENTE
        const modal = document.getElementById('modal-create-order');
        if (modal) {
            modal.remove();
        }
        
        // ✅ MOSTRAR SUCESSO
        showToast(`✅ Ordem ${orderId} criada com sucesso!`, 'success');
        
        // ✅ RECARREGAR DADOS (com delay de 300ms para evitar race condition)
        setTimeout(async () => {
            // Recarregar ordens
            if (typeof window.loadOrders === 'function') {
                await window.loadOrders();
            }
            
            // Atualizar interfaces
            if (typeof window.renderRecentOrders === 'function') window.renderRecentOrders();
            if (typeof window.renderOrdensTable === 'function') window.renderOrdensTable();
            if (typeof window.renderKanban === 'function') window.renderKanban();
            if (typeof window.updateCharts === 'function') window.updateCharts();
            if (typeof window.renderDashboardStats === 'function') window.renderDashboardStats();
            
            // ✅ RESETAR FLAG
            isSubmitting = false;
            
            console.log('✅ Interfaces atualizadas!');
        }, 300);
        
    } catch (error) {
        console.error('❌ Erro inesperado ao criar ordem:', error);
        
        // ✅ REABILITAR BOTÃO
        const submitBtn = document.getElementById('btn-create-order');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span class="material-symbols-rounded">add</span>
                Criar Ordem
            `;
        }
        
        isSubmitting = false;
        showToast('❌ Erro inesperado: ' + error.message, 'error');
    }
}

// Exportar funções
window.openCreateOrderModal = openCreateOrderModal;
window.closeCreateOrderModal = closeCreateOrderModal;
window.handleCreateOrder = handleCreateOrder;

console.log('✅ create-order-handler.js carregado (versão corrigida)!');
