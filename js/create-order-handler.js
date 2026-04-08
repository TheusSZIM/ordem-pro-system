// ============================================
// PATCH: CORRIGIR DUPLICATE SUBMISSION
// Aplicar em create-order-handler.js
// ============================================

// LOCALIZAR a função handleCreateOrder e SUBSTITUIR por esta versão:

let isSubmitting = false; // Flag global para prevenir submits duplicados

async function handleCreateOrder(event) {
    event.preventDefault();
    
    // ✅ PROTEÇÃO ANTI-DUPLICATE
    if (isSubmitting) {
        console.log('⚠️ Já está criando ordem, aguarde...');
        return;
    }
    
    console.log('📝 Iniciando criação de ordem...');
    
    // Validar campos
    const product = document.getElementById('ordem-produto')?.value?.trim();
    const quantity = document.getElementById('ordem-quantidade')?.value;
    const priority = document.getElementById('ordem-prioridade')?.value;
    const linha = document.getElementById('ordem-linha')?.value;
    const estacao = document.getElementById('ordem-estacao')?.value;
    
    if (!product) {
        showToast('⚠️ Informe o produto!', 'warning');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showToast('⚠️ Informe a quantidade!', 'warning');
        return;
    }
    
    try {
        // ✅ MARCAR COMO SUBMETENDO
        isSubmitting = true;
        
        // ✅ DESABILITAR BOTÃO
        const submitBtn = document.querySelector('#modal-create-order button[type="submit"]');
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
        
        // Gerar ID único
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000);
        const orderId = `${timestamp}${randomSuffix}`;
        
        console.log('📦 Ordem a ser criada:', {
            id: orderId,
            product,
            quantity: parseInt(quantity),
            priority,
            linha,
            estacao
        });
        
        // Criar ordem no Supabase
        const { data: novaOrdem, error } = await supabaseClient
            .from('orders')
            .insert([{
                id: orderId,
                product: product,
                quantity: parseInt(quantity),
                priority: priority || 'medium',
                status: 'pending',
                linha: linha || 'A',
                estacao: estacao || '1',
                numero_volumes: 1,
                created_at: new Date().toISOString()
            }])
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
        
        // ✅ RECARREGAR DADOS (após um pequeno delay)
        setTimeout(async () => {
            await loadOrders();
            
            // Atualizar interfaces
            if (typeof renderRecentOrders === 'function') renderRecentOrders();
            if (typeof renderOrdensTable === 'function') renderOrdensTable();
            if (typeof renderKanban === 'function') renderKanban();
            if (typeof updateCharts === 'function') updateCharts();
            if (typeof renderDashboardStats === 'function') renderDashboardStats();
            
            // ✅ RESETAR FLAG
            isSubmitting = false;
            
            console.log('✅ Interfaces atualizadas!');
        }, 300);
        
    } catch (error) {
        console.error('❌ Erro inesperado:', error);
        
        // ✅ REABILITAR BOTÃO
        const submitBtn = document.querySelector('#modal-create-order button[type="submit"]');
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

// ============================================
// INSTRUÇÕES DE APLICAÇÃO
// ============================================

/*
1. Abrir arquivo: js/create-order-handler.js
2. Localizar a função: async function handleCreateOrder(event)
3. SUBSTITUIR toda a função pela versão acima
4. Salvar arquivo
5. Commit e push:
   git add js/create-order-handler.js
   git commit -m "fix: prevenir duplicate submission ao criar ordem"
   git push

MELHORIAS APLICADAS:
✅ Flag global isSubmitting previne múltiplos submits
✅ Botão desabilitado durante criação
✅ Spinner visual indica processamento
✅ Modal fecha imediatamente após sucesso
✅ Delay de 300ms antes de recarregar dados
✅ Botão reabilitado em caso de erro
✅ Flag resetada após conclusão
*/
