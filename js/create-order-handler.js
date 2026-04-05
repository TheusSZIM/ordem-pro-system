// ============================================
// FUNÇÃO PARA CRIAR ORDEM - Supabase Integration
// ============================================

async function handleCreateOrder(event) {
    event.preventDefault();
    
    console.log('🔄 Criando nova ordem...');
    
    try {
        // Capturar dados do formulário
        const formData = {
            // Campo ID da ordem (auto-gerado ou do input)
            id: document.getElementById('ordem-numero')?.value || generateOrderId(),
            
            // Cliente/Destino
            client: document.getElementById('ordem-destino')?.value || 
                   document.querySelector('input[placeholder*="Destino"]')?.value,
            
            // Produto
            product: document.getElementById('ordem-produto')?.value ||
                    document.querySelector('input[placeholder*="produto"]')?.value,
            
            // Quantidade (se existir)
            quantity: parseInt(document.getElementById('ordem-quantidade')?.value) || 1,
            
            // Operador responsável
            operator: document.getElementById('ordem-operador')?.value ||
                     document.querySelector('select[name="operador"]')?.value,
            
            // Célula/Estação
            station: document.getElementById('ordem-celula')?.value ||
                    document.querySelector('input[placeholder*="Célula"]')?.value ||
                    document.querySelector('input[placeholder*="Estação"]')?.value,
            
            // Tipo de embalagem (se selecionado)
            packaging_type: getPackagingType(),
            
            // Observações
            notes: document.getElementById('ordem-observacoes')?.value ||
                  document.querySelector('textarea')?.value,
            
            // Prioridade (se checkbox marcado)
            priority: document.getElementById('ordem-prioridade')?.checked ? 'high' : 'medium',
            
            // Status inicial
            status: 'pending',
            
            // Data de criação
            created_at: new Date().toISOString()
        };
        
        console.log('📋 Dados do formulário:', formData);
        
        // Validar campos obrigatórios
        if (!formData.client) {
            showToast('❌ Campo "Destino" é obrigatório!', 'error');
            return;
        }
        
        // Criar ordem no Supabase
        const result = await createOrder(formData);
        
        if (result.success) {
            console.log('✅ Ordem criada:', result.data);
            
            // Fechar modal
            closeModal();
            
            // Recarregar lista de ordens
            if (typeof loadOrders === 'function') {
                await loadOrders();
            }
            
            // Atualizar dashboard/kanban
            if (typeof renderRecentOrders === 'function') {
                renderRecentOrders();
            }
            
            if (typeof renderKanban === 'function') {
                renderKanban();
            }
            
            // Limpar formulário
            document.getElementById('ordem-form')?.reset();
            
            showToast('✅ Ordem criada com sucesso!', 'success');
            
        } else {
            console.error('❌ Erro ao criar ordem:', result.error);
            showToast('❌ Erro ao criar ordem: ' + result.error.message, 'error');
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar formulário:', error);
        showToast('❌ Erro ao criar ordem: ' + error.message, 'error');
    }
}

// Função auxiliar para capturar tipo de embalagem
function getPackagingType() {
    const montadora = document.querySelector('input[value="montadora"]');
    const reposicao = document.querySelector('input[value="reposicao"]');
    
    if (montadora?.checked) return 'montadora';
    if (reposicao?.checked) return 'reposicao';
    
    return 'montadora'; // padrão
}

// Função auxiliar para gerar ID de ordem
function generateOrderId() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}-${random}`;
}

// Função para fechar modal
function closeModal() {
    const modal = document.getElementById('modal-nova-ordem') || 
                  document.querySelector('.modal') ||
                  document.querySelector('[class*="modal"]');
    
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

// ============================================
// VINCULAR AO FORMULÁRIO
// ============================================

// Adicionar evento ao formulário quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando handler de criar ordem...');
    
    // Encontrar o formulário
    const form = document.getElementById('ordem-form') || 
                 document.querySelector('form[id*="ordem"]') ||
                 document.querySelector('.modal form');
    
    if (form) {
        console.log('📝 Formulário de ordem encontrado!');
        
        // Adicionar evento de submit
        form.addEventListener('submit', handleCreateOrder);
        
        console.log('✅ Evento de submit adicionado ao formulário');
    } else {
        console.warn('⚠️ Formulário de ordem não encontrado - aguardando componentes...');
        
        // Tentar novamente após os componentes carregarem
        setTimeout(() => {
            const formRetry = document.getElementById('ordem-form') || 
                             document.querySelector('form[id*="ordem"]') ||
                             document.querySelector('.modal form');
            
            if (formRetry) {
                console.log('📝 Formulário encontrado na segunda tentativa!');
                formRetry.addEventListener('submit', handleCreateOrder);
                console.log('✅ Evento adicionado!');
            }
        }, 2000);
    }
    
    // Também vincular ao botão diretamente (backup)
    const btnCriar = document.getElementById('btn-criar-ordem');
    
    if (btnCriar) {
        console.log('🔘 Botão criar ordem encontrado!');
        btnCriar.onclick = function(e) {
            e.preventDefault();
            handleCreateOrder(e);
        };
    }
});

// ============================================
// EXPORTAR FUNÇÃO GLOBALMENTE
// ============================================

window.handleCreateOrder = handleCreateOrder;
window.closeModal = closeModal;
window.generateOrderId = generateOrderId;
window.getPackagingType = getPackagingType;

console.log('✅ create-order-handler.js carregado!');
