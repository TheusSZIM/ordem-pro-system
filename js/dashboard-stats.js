// ============================================
// DASHBOARD-STATS.JS - VERSÃO DEFINITIVA
// Círculos 100% funcionais com conic-gradient
// ============================================

function renderDashboardStats() {
    console.log('📊 Renderizando estatísticas do dashboard...');
    
    if (!state || !state.orders || !Array.isArray(state.orders)) {
        console.warn('⚠️ state.orders não disponível');
        // Zerar tudo
        updateStatCard('stat-a-separar', 0);
        updateStatCard('stat-em-separacao', 0);
        updateStatCard('stat-concluidas-hoje', 0);
        updateStatCard('stat-total', 0);
        updateProgressCircle('progress-a-separar', 0, 0, '#f59e0b');
        updateProgressCircle('progress-em-separacao', 0, 0, '#3b82f6');
        updateProgressCircle('progress-concluidas', 0, 0, '#10b981');
        return;
    }
    
    // Calcular estatísticas
    const hoje = new Date().toISOString().split('T')[0];
    
    const stats = {
        aSeparar: state.orders.filter(o => o.status === 'pending').length,
        emSeparacao: state.orders.filter(o => o.status === 'progress' || o.status === 'in_progress').length,
        concluidasHoje: state.orders.filter(o => {
            if (o.status !== 'completed') return false;
            if (!o.fim_separacao) return false;
            const dataFim = new Date(o.fim_separacao).toISOString().split('T')[0];
            return dataFim === hoje;
        }).length,
        total: state.orders.length
    };
    
    console.log('📈 Estatísticas calculadas:', stats);
    
    // Atualizar números nos cards
    updateStatCard('stat-a-separar', stats.aSeparar);
    updateStatCard('stat-em-separacao', stats.emSeparacao);
    updateStatCard('stat-concluidas-hoje', stats.concluidasHoje);
    updateStatCard('stat-total', stats.total);
    
    // Atualizar círculos de progresso com cores específicas
    updateProgressCircle('progress-a-separar', stats.aSeparar, stats.total, '#f59e0b'); // Laranja
    updateProgressCircle('progress-em-separacao', stats.emSeparacao, stats.total, '#3b82f6'); // Azul  
    updateProgressCircle('progress-concluidas', stats.concluidasHoje, stats.total, '#10b981'); // Verde
    
    console.log('✅ Dashboard renderizado com sucesso!');
}

// Atualizar Card de Estatística
function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`✅ Card ${id} atualizado: ${value}`);
    } else {
        console.warn(`⚠️ Card ${id} não encontrado`);
    }
}

// Atualizar Círculo de Progresso
// ✅ VERSÃO QUE FUNCIONA: Apenas atualiza o estilo, não o HTML
function updateProgressCircle(id, valor, total, cor) {
    const circle = document.getElementById(id);
    if (!circle) {
        console.warn(`⚠️ Círculo ${id} não encontrado`);
        return;
    }
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    const graus = porcentagem * 3.6; // Converter porcentagem para graus
    
    // ✅ ATUALIZAR APENAS O ESTILO CSS (não innerHTML)
    circle.style.background = `conic-gradient(
        from 180deg,
        ${cor} 0deg ${graus}deg,
        rgba(148, 163, 184, 0.2) ${graus}deg 360deg
    )`;
    
    // ✅ ATUALIZAR TEXTO DA PORCENTAGEM (procurar de várias formas)
    const percentText = 
        circle.querySelector('.percent-text') || 
        circle.querySelector('[data-percent]') ||
        circle.querySelector('span') ||
        circle;
    
    if (percentText && percentText !== circle) {
        percentText.textContent = `${porcentagem}%`;
    }
    
    console.log(`✅ Círculo ${id}: ${porcentagem}% (${graus}°) - ${valor}/${total}`);
}

// Exportar funções para window
window.renderDashboardStats = renderDashboardStats;
window.updateStatCard = updateStatCard;
window.updateProgressCircle = updateProgressCircle;

console.log('✅ dashboard-stats.js carregado (versão definitiva)!');
