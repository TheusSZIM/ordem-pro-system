// ============================================
// FUNÇÃO PARA CRIAR ORDEM - Supabase Integration
// ============================================

async function handleCreateOrder(event) {
    if (event) event.preventDefault();
    
    console.log('🔄 Criando nova ordem...');
    
    try {
        // Capturar dados do formulário
        const orderNumber = document.getElementById('ordem-numero')?.value?.trim();
        const product = document.getElementById('ordem-produto')?.value?.trim();
        const quantity = parseInt(document.getElementById('ordem-quantidade')?.value) || 1;
        const dataPrevista = document.getElementById('ordem-data-prevista')?.value;
        const operatorId = document.getElementById('ordem-operador')?.value;
        const station = document.getElementById('ordem-celula')?.value?.trim();
        const packagingType = getPackagingType();
        const notes = document.getElementById('ordem-observacoes')?.value?.trim();
        const priority = document.getElementById('ordem-prioridade')?.checked ? 'high' : 'medium';
        
        console.log('📋 Dados capturados:', {
            orderNumber,
            product,
            quantity,
            dataPrevista,
            operatorId,
            station,
            packagingType,
            notes,
            priority
        });
        
        // Validar campos obrigatórios
        if (!orderNumber) {
            showToast('❌ Número da Ordem é obrigatório!', 'error');
            return;
        }
        
        if (!product) {
            showToast('❌ Produto é obrigatório!', 'error');
            return;
        }
        
        if (!quantity || quantity < 1) {
            showToast('❌ Quantidade deve ser maior que 0!', 'error');
            return;
        }
        
        if (!dataPrevista) {
            showToast('❌ Data Prevista é obrigatória!', 'error');
            return;
        }
        
        // Montar objeto da ordem
        const orderData = {
            id: orderNumber,
            product: product,
            quantity: quantity,
            status: 'pending',
            priority: priority,
            notes: notes || null,
            operator_id: operatorId || null,
            station: station || null,
            packaging_type: packagingType,
            data_prevista: dataPrevista,
            created_at: new Date().toISOString()
        };
        
        console.log('📦 Ordem a ser criada:', orderData);
        
        // Criar ordem no Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([orderData])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Erro do Supabase:', error);
            
            // Mensagens de erro mais amigáveis
            let errorMessage = 'Erro ao criar ordem';
            
            if (error.code === '23505') {
                errorMessage = 'Já existe uma ordem com este número!';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showToast('❌ ' + errorMessage, 'error');
            return;
        }
        
        console.log('✅ Ordem criada no Supabase:', data);
        
        // Fechar modal
        if (typeof closeModal === 'function') {
            closeModal();
        }
        
        // Recarregar dados
        console.log('🔄 Recarregando dados...');
        
        if (typeof loadOrders === 'function') {
            await loadOrders();
            console.log('✅ Ordens recarregadas');
        }
        
        // Atualizar interface
        if (typeof renderRecentOrders === 'function') {
            renderRecentOrders();
        }
        
        if (typeof renderKanban === 'function') {
            renderKanban();
        }
        
        if (typeof updateCharts === 'function') {
            updateCharts();
        }
        
        if (typeof animateCounters === 'function') {
            animateCounters();
        }
        
        // Limpar formulário
        const form = document.getElementById('new-order-form');
        if (form) {
            form.reset();
        }
        
        // Mostrar sucesso
        showToast('✅ Ordem criada com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao processar formulário:', error);
        showToast('❌ Erro: ' + error.message, 'error');
    }
}

// ============================================
// FUNÇÃO AUXILIAR - TIPO DE EMBALAGEM
// ============================================

function getPackagingType() {
    // Procurar pelos radio buttons de embalagem
    const montadora = document.querySelector('input[value="montadora"]:checked');
    const reposicao = document.querySelector('input[value="reposicao"]:checked');
    
    if (montadora) return 'montadora';
    if (reposicao) return 'reposicao';
    
    // Padrão
    return 'montadora';
}

// ============================================
// FUNÇÃO AUXILIAR - GERAR ID DE ORDEM
// ============================================

function generateOrderId() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}-${random}`;
}

// ============================================
// FUNÇÃO AUXILIAR - MOSTRAR TOAST
// ============================================

function showToast(message, type = 'info') {
    console.log(`🔔 Toast: ${message} (${type})`);
    
    // Se a função showToast global existir, usar ela
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
    
    // Caso contrário, criar um toast simples
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
        type === 'success' ? 'bg-emerald-600' :
        type === 'error' ? 'bg-red-600' :
        'bg-blue-600'
    }`;
    toast.textContent = message;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// VINCULAR AO FORMULÁRIO
// ============================================

// Aguardar modal ser criado e adicionar evento
function setupOrderFormHandler() {
    // Tentar encontrar o formulário
    const form = document.getElementById('new-order-form');
    
    if (form && !form.hasAttribute('data-handler-attached')) {
        console.log('📝 Formulário de ordem encontrado! Adicionando handler...');
        
        // Marcar como já configurado
        form.setAttribute('data-handler-attached', 'true');
        
        // Adicionar evento de submit
        form.addEventListener('submit', handleCreateOrder);
        
        console.log('✅ Handler adicionado ao formulário');
        return true;
    }
    
    return false;
}

// Tentar configurar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando handler de criar ordem...');
    
    // Tentar imediatamente
    if (setupOrderFormHandler()) {
        return;
    }
    
    // Tentar após 2 segundos (quando componentes carregarem)
    setTimeout(() => {
        if (setupOrderFormHandler()) {
            return;
        }
        
        // Tentar após 5 segundos (backup)
        setTimeout(() => {
            setupOrderFormHandler();
        }, 3000);
    }, 2000);
});

// Observar quando o modal for adicionado ao DOM
const observer = new MutationObserver(() => {
    setupOrderFormHandler();
});

// Começar a observar após 1 segundo
setTimeout(() => {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}, 1000);

// ============================================
// EXPORTAR FUNÇÕES GLOBALMENTE
// ============================================

window.handleCreateOrder = handleCreateOrder;
window.generateOrderId = generateOrderId;
window.getPackagingType = getPackagingType;
window.showToast = window.showToast || showToast;

// Também vincular ao handleNewOrder (nome alternativo usado no modal)
window.handleNewOrder = handleCreateOrder;

console.log('✅ create-order-handler.js carregado!');
