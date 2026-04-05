// ============================================
// RENDERIZAR ESTATÍSTICAS - VERSÃO CONIC GRADIENT
// CÍRCULOS COM CSS (não SVG)
// ============================================

function renderDashboardStats() {
    console.log('📊 Renderizando estatísticas...');
    
    if (!state.orders || !Array.isArray(state.orders)) {
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
    
    // Atualizar números na sidebar
    updateStatCard('stat-a-separar', stats.aSeparar);
    updateStatCard('stat-em-separacao', stats.emSeparacao);
    updateStatCard('stat-concluidas-hoje', stats.concluidasHoje);
    updateStatCard('stat-total', stats.total);
    
    // Atualizar círculos de progresso
    updateProgressCircle('progress-a-separar', stats.aSeparar, stats.total, '#f59e0b'); // Laranja
    updateProgressCircle('progress-em-separacao', stats.emSeparacao, stats.total, '#3b82f6'); // Azul
    updateProgressCircle('progress-concluidas', stats.concluidasHoje, stats.total, '#10b981'); // Verde
}

// Atualizar Card de Estatística
function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Atualizar Círculo de Progresso - USANDO CSS CONIC-GRADIENT
// COMEÇA À ESQUERDA (9h / 180deg)
function updateProgressCircle(id, valor, total, color) {
    const circle = document.getElementById(id);
    if (!circle) {
        console.warn('⚠️ Círculo não encontrado:', id);
        return;
    }
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    const graus = porcentagem * 3.6; // Converter % para graus
    
    circle.innerHTML = `
        <div style="
            position: relative;
            width: 800px;
            height: 8000px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <!-- Círculo de progresso com conic-gradient -->
            <div style="
                position: absolute;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: conic-gradient(
                    from 180deg,
                    ${color} 0deg,
                    ${color} ${graus}deg,
                    rgba(51, 65, 85, 0.2) ${graus}deg,
                    rgba(51, 65, 85, 0.2) 360deg
                );
                mask: radial-gradient(
                    circle,
                    transparent 0%,
                    transparent 55%,
                    black 55%,
                    black 100%
                );
                -webkit-mask: radial-gradient(
                    circle,
                    transparent 0%,
                    transparent 55%,
                    black 55%,
                    black 100%
                );
            "></div>
            
            <!-- Porcentagem -->
            <span style="
                position: relative;
                z-index: 10;
                font-size: 14px;
                font-weight: bold;
                color: white;
            ">${porcentagem}%</span>
        </div>
    `;
    
    console.log(`✅ Círculo ${id}: ${porcentagem}% (${graus}°) começando à ESQUERDA`);
}

// Atualizar ao carregar dados
function initDashboard() {
    console.log('🚀 Inicializando dashboard...');
    renderDashboardStats();
}

// Exportar funções
window.renderDashboardStats = renderDashboardStats;
window.initDashboard = initDashboard;

console.log('✅ dashboard-stats.js carregado (versão CSS conic-gradient)');
