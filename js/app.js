/* ============================================
   CONTROLE DE ORDENS PRO - APLICAÇÃO PRINCIPAL
   ============================================ */

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando aplicação...');
    
    // Inicializar tema
    initTheme();
    
    // Renderizar ordens recentes
    if (typeof renderRecentOrders === 'function') {
        renderRecentOrders();
    }
    
    // Inicializar gráficos
    if (typeof initCharts === 'function') {
        initCharts();
    }
    
    // Animar contadores
    if (typeof animateCounters === 'function') {
        animateCounters();
    }
    
    // Atualizar hora
    if (typeof updateTime === 'function') {
        setInterval(updateTime, 1000);
        updateTime();
    }
    
    // Check URL params for initial page
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page && document.getElementById(page)) {
        showPage(page);
    }
});

// Prevenir form submission on enter for some inputs
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'search') {
        // allow normal behavior
    }
});

// ============================================
// ATUALIZAR DASHBOARD
// ============================================

// Função para atualizar tudo
async function updateDashboard() {
    console.log('🔄 Atualizando dashboard...');
    
    // Carregar dados
    await loadOrders();
    
    // Renderizar estatísticas
    if (typeof renderDashboardStats === 'function') {
        renderDashboardStats();
    }
    
    // Outras atualizações
    if (typeof renderRecentOrders === 'function') renderRecentOrders();
    if (typeof renderOrdensTable === 'function') renderOrdensTable();
    if (typeof renderKanban === 'function') renderKanban();
    if (typeof updateCharts === 'function') updateCharts();
}

// Exportar para ser chamado depois do carregamento dos componentes
window.updateDashboard = updateDashboard;

console.log('✅ app.js carregado');
