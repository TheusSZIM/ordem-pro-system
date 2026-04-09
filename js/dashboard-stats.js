// ============================================
// DASHBOARD-STATS.JS - VERSÃO FINAL CORRIGIDA
// Substituir arquivo completo
// ============================================

function renderDashboardStats() {
    console.log('📊 Renderizando estatísticas do dashboard...');
    
    // Validar state
    if (!window.state || !window.state.orders) {
        console.log('⚠️ State não está pronto');
        return;
    }
    
    const orders = window.state.orders;
    
    if (orders.length === 0) {
        console.log('⚠️ Sem ordens');
        updateStatCard('stat-a-separar', 0);
        updateStatCard('stat-em-separacao', 0);
        updateStatCard('stat-concluidas-hoje', 0);
        updateStatCard('stat-total', 0);
        return;
    }
    
    // CALCULAR ESTATÍSTICAS
    const aSeparar = orders.filter(o => o.status === 'pending').length;
    const emSeparacao = orders.filter(o => o.status === 'in_progress').length;
    const total = orders.length;
    
    // Concluídas HOJE
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const concluidasHoje = orders.filter(o => {
        if (o.status !== 'completed') return false;
        if (!o.fim_separacao) return false;
        const dataFim = new Date(o.fim_separacao);
        return dataFim >= hoje && dataFim < amanha;
    }).length;
    
    console.log('📈 Estatísticas:', { aSeparar, emSeparacao, concluidasHoje, total });
    
    // ATUALIZAR CARDS
    updateStatCard('stat-a-separar', aSeparar);
    updateStatCard('stat-em-separacao', emSeparacao);
    updateStatCard('stat-concluidas-hoje', concluidasHoje);
    updateStatCard('stat-total', total);
    
    // ATUALIZAR CÍRCULOS
    updateProgressCircle('progress-a-separar', aSeparar, total);
    updateProgressCircle('progress-em-separacao', emSeparacao, total);
    updateProgressCircle('progress-concluidas', concluidasHoje, total);
    
    console.log('✅ Dashboard atualizado!');
}

function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`❌ Elemento não encontrado: ${elementId}`);
        return;
    }
    
    console.log(`🔄 ${elementId}: ${element.textContent} → ${value}`);
    element.textContent = value;
    
    // Verificar
    if (element.textContent === String(value)) {
        console.log(`✅ ${elementId} = ${value}`);
    } else {
        console.error(`❌ ${elementId} falhou!`);
    }
}

function updateProgressCircle(elementId, current, total) {
    const circle = document.getElementById(elementId);
    
    if (!circle) {
        console.error(`❌ Círculo não encontrado: ${elementId}`);
        return;
    }
    
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const degrees = (percentage / 100) * 360;
    
    // Atualizar círculo com CSS conic-gradient
    circle.style.background = `conic-gradient(
        from 180deg,
        var(--circle-color, #8b5cf6) ${degrees}deg,
        var(--circle-bg, #e2e8f0) ${degrees}deg
    )`;
    
    console.log(`🔵 ${elementId}: ${Math.round(percentage)}% (${degrees}°) - ${current}/${total}`);
}

// Exportar funções
window.renderDashboardStats = renderDashboardStats;
window.updateStatCard = updateStatCard;
window.updateProgressCircle = updateProgressCircle;

console.log('✅ dashboard-stats.js carregado (versão corrigida)!');
