// ============================================
// POPULAR DROPDOWN DE OPERADORES AUTOMATICAMENTE
// Arquivo: js/populate-operators.js
// ============================================

async function populateOperatorsDropdown() {
    console.log('🔄 Populando dropdown de operadores...');
    
    try {
        // Buscar operadores do Supabase
        const operators = await fetchOperators();
        
        if (!operators || operators.length === 0) {
            console.warn('⚠️ Nenhum operador encontrado');
            return;
        }
        
        // Encontrar dropdown
        const dropdown = document.getElementById('ordem-operador');
        
        if (!dropdown) {
            console.warn('⚠️ Dropdown não encontrado ainda...');
            return;
        }
        
        // Limpar e popular
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id;
            option.textContent = operator.name;
            dropdown.appendChild(option);
        });
        
        console.log(`✅ Dropdown populado com ${operators.length} operadores!`);
        
    } catch (error) {
        console.error('❌ Erro ao popular dropdown:', error);
    }
}

// ============================================
// CHAMAR QUANDO OS COMPONENTES CARREGAREM
// ============================================

// Tentar popular após 2 segundos
setTimeout(populateOperatorsDropdown, 2000);

// Tentar novamente após 5 segundos (caso o modal carregue depois)
setTimeout(populateOperatorsDropdown, 5000);

// Observar quando o modal abrir
const modalObserver = new MutationObserver(() => {
    const modal = document.getElementById('modal-nova-ordem');
    if (modal && !modal.classList.contains('hidden')) {
        populateOperatorsDropdown();
    }
});

// Começar a observar mudanças no body
setTimeout(() => {
    modalObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
    });
}, 1000);

// Exportar globalmente
window.populateOperatorsDropdown = populateOperatorsDropdown;

console.log('✅ Script de popular operadores carregado!');
