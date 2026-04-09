// ============================================
// DASHBOARD-STATS.JS - VERSÃO SEM INNERHTML
// Atualiza apenas o estilo, não recria o DOM
// ============================================

function renderDashboardStats() {
    console.log('📊 Renderizando estatísticas do dashboard...');
    
    if (!state || !state.orders || !Array.isArray(state.orders)) {
        console.warn('⚠️ state.orders não disponível');
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
    
    // Atualizar números
    updateStatCard('stat-a-separar', stats.aSeparar);
    updateStatCard('stat-em-separacao', stats.emSeparacao);
    updateStatCard('stat-concluidas-hoje', stats.concluidasHoje);
    updateStatCard('stat-total', stats.total);
    
    // Atualizar círculos
    updateProgressCircle('progress-a-separar', stats.aSeparar, stats.total, '#f59e0b');
    updateProgressCircle('progress-em-separacao', stats.emSeparacao, stats.total, '#3b82f6');
    updateProgressCircle('progress-concluidas', stats.concluidasHoje, stats.total, '#10b981');
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        console.log(`✅ Card ${id} atualizado: ${value}`);
    } else {
        console.warn(`⚠️ Card ${id} não encontrado`);
    }
}

// ✅ VERSÃO CORRIGIDA: NÃO USA innerHTML
function updateProgressCircle(id, valor, total, cor) {
    const circle = document.getElementById(id);
    if (!circle) {
        console.warn(`⚠️ Círculo ${id} não encontrado`);
        return;
    }
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    const graus = porcentagem * 3.6;
    
    console.log(`🔵 Atualizando ${id}: ${porcentagem}% (${graus}°) - ${valor}/${total}`);
    
    // ✅ PROCURAR ELEMENTO DO CÍRCULO (criado na primeira vez ou já existe)
    let circuloDiv = circle.querySelector('.progress-circle-bg');
    let textoSpan = circle.querySelector('.progress-circle-text');
    
    // Se não existir, criar estrutura UMA VEZ
    if (!circuloDiv) {
        console.log(`🔧 Criando estrutura do círculo ${id}...`);
        circle.innerHTML = `
            <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                <div class="progress-circle-bg" style="
                    position: absolute;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                "></div>
                <span class="progress-circle-text" style="
                    position: relative;
                    z-index: 10;
                    font-size: 12px;
                    font-weight: bold;
                "></span>
            </div>
        `;
        
        circuloDiv = circle.querySelector('.progress-circle-bg');
        textoSpan = circle.querySelector('.progress-circle-text');
    }
    
    // ✅ ATUALIZAR APENAS O ESTILO (não innerHTML)
    if (circuloDiv) {
        circuloDiv.style.background = `conic-gradient(
            from 180deg,
            ${cor} 0deg ${graus}deg,
            rgba(148, 163, 184, 0.2) ${graus}deg 360deg
        )`;
        
        // Adicionar mask para fazer círculo vazado
        circuloDiv.style.mask = `radial-gradient(circle, transparent 0%, transparent 60%, black 60%, black 100%)`;
        circuloDiv.style.webkitMask = `radial-gradient(circle, transparent 0%, transparent 60%, black 60%, black 100%)`;
    }
    
    // ✅ ATUALIZAR APENAS O TEXTO (não innerHTML)
    if (textoSpan) {
        textoSpan.textContent = `${porcentagem}%`;
        textoSpan.style.color = cor;
    }
    
    console.log(`✅ Círculo ${id}: ${porcentagem}% atualizado!`);
}

window.renderDashboardStats = renderDashboardStats;
window.updateStatCard = updateStatCard;
window.updateProgressCircle = updateProgressCircle;

console.log('✅ dashboard-stats.js carregado (versão otimizada sem innerHTML)!');
