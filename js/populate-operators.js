// ============================================
// POPULAR DROPDOWN DE OPERADORES AUTOMATICAMENTE
// Arquivo: js/populate-operators.js
// ============================================

async function populateOperatorsDropdown() {
    try {
        // Verificar se a função fetchOperators existe
        if (typeof fetchOperators !== 'function') {
            console.warn('⚠️ fetchOperators ainda não carregado');
            return;
        }
        
        // Buscar operadores do Supabase
        const operators = await fetchOperators();
        
        if (!operators || operators.length === 0) {
            console.warn('⚠️ Nenhum operador encontrado no Supabase');
            return;
        }
        
        // Encontrar o dropdown
        const dropdown = document.getElementById('ordem-operador');
        
        if (!dropdown) {
            // Modal ainda não foi carregado
            return;
        }
        
        // Limpar e popular dropdown
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id;
            option.textContent = operator.name;
            dropdown.appendChild(option);
        });
        
        console.log(`✅ Dropdown populado com ${operators.length} operadores`);
        
    } catch (error) {
        console.error('❌ Erro ao popular dropdown de operadores:', error);
    }
}

// ============================================
// EXECUTAR QUANDO A PÁGINA CARREGAR
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Primeira tentativa após 2 segundos
    setTimeout(populateOperatorsDropdown, 2000);
    
    // Segunda tentativa após 5 segundos (backup)
    setTimeout(populateOperatorsDropdown, 5000);
});

// ============================================
// OBSERVAR QUANDO O MODAL ABRIR
// ============================================

// Criar observer para detectar quando o modal é aberto
const modalObserver = new MutationObserver(() => {
    const modal = document.getElementById('modal-nova-ordem');
    if (modal && !modal.classList.contains('hidden') && modal.style.display !== 'none') {
        // Modal foi aberto, popular dropdown
        setTimeout(populateOperatorsDropdown, 100);
    }
});

// Começar a observar após 1 segundo
setTimeout(() => {
    modalObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
}, 1000);

// ============================================
// EXPORTAR FUNÇÃO GLOBALMENTE
// ============================================

window.populateOperatorsDropdown = populateOperatorsDropdown;

console.log('✅ populate-operators.js carregado!');
