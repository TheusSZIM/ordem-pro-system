/* ============================================
   CONTROLE DE ORDENS PRO - APLICAÇÃO PRINCIPAL
   ============================================ */

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
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
   // Atualizar estatísticas do dashboard
async function updateDashboard() {
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

// Chamar ao iniciar
updateDashboard();

// Atualizar a cada 30 segundos
setInterval(updateDashboard, 30000);
});
