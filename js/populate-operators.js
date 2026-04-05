// ============================================
// POPULAR DROPDOWN DE OPERADORES - VERSÃO MELHORADA
// Arquivo: js/populate-operators.js
// ============================================

let operadoresCache = null; // Cache dos operadores

async function populateOperatorsDropdown() {
    try {
        // 1. Verificar se fetchOperators existe
        if (typeof fetchOperators !== 'function') {
            console.warn('⚠️ fetchOperators ainda não carregado');
            return false;
        }
        
        // 2. Encontrar dropdown
        const dropdown = document.getElementById('ordem-operador');
        
        if (!dropdown) {
            console.warn('⚠️ Dropdown não encontrado (modal fechado)');
            return false;
        }
        
        // 3. Buscar operadores (usa cache se disponível)
        if (!operadoresCache) {
            const operators = await fetchOperators();
            
            if (!operators || operators.length === 0) {
                console.warn('⚠️ Nenhum operador encontrado no Supabase');
                return false;
            }
            
            operadoresCache = operators; // Salvar no cache
        }
        
        // 4. Verificar se já foi populado
        const currentOptions = Array.from(dropdown.options).map(o => o.value);
        const hasOperators = currentOptions.some(val => val && val !== '');
        
        if (hasOperators) {
            console.log('✅ Dropdown já populado, pulando...');
            return true;
        }
        
        // 5. Limpar e popular dropdown
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        
        operadoresCache.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id;
            option.textContent = operator.name;
            dropdown.appendChild(option);
        });
        
        console.log(`✅ Dropdown populado com ${operadoresCache.length} operadores:`, operadoresCache.map(o => o.name));
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao popular dropdown:', error);
        return false;
    }
}

// ============================================
// POPULAR QUANDO O MODAL ABRIR
// ============================================

// Observar mudanças no DOM para detectar quando o modal abre
const modalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // Verificar se o modal foi adicionado/modificado
        if (mutation.addedNodes.length > 0 || mutation.type === 'attributes') {
            const modal = document.getElementById('modal-container');
            const dropdown = document.getElementById('ordem-operador');
            
            // Se modal está visível E dropdown existe
            if (modal && !modal.classList.contains('hidden') && dropdown) {
                console.log('🔔 Modal aberto detectado! Populando dropdown...');
                setTimeout(populateOperatorsDropdown, 100);
            }
        }
    });
});

// ============================================
// POPULAR QUANDO showModal() FOR CHAMADO
// ============================================

// Interceptar a função showModal original
window.addEventListener('DOMContentLoaded', () => {
    // Aguardar 2 segundos para garantir que tudo carregou
    setTimeout(() => {
        // Salvar a função original
        const originalShowModal = window.showModal;
        
        // Sobrescrever com nossa versão
        window.showModal = function(type, data) {
            // Chamar a função original
            const result = originalShowModal.call(this, type, data);
            
            // Se for modal de nova ordem, popular após abrir
            if (type === 'new-order') {
                console.log('🔔 Modal "new-order" detectado! Populando dropdown...');
                setTimeout(populateOperatorsDropdown, 200);
            }
            
            return result;
        };
        
        console.log('✅ showModal() interceptado com sucesso!');
        
    }, 2000);
    
    // Também tentar popular após 5 segundos (backup)
    setTimeout(populateOperatorsDropdown, 5000);
});

// Começar a observar o DOM
setTimeout(() => {
    modalObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
    });
    console.log('✅ MutationObserver ativado!');
}, 1000);

// ============================================
// EXPORTAR FUNÇÃO GLOBALMENTE
// ============================================

window.populateOperatorsDropdown = populateOperatorsDropdown;

console.log('✅ populate-operators.js MELHORADO carregado!');
