/* ============================================
   CONTROLE DE ORDENS PRO - ESTATÍSTICAS DO DASHBOARD
   Círculos de progresso perfeitamente centralizados
   ============================================ */

// Renderizar estatísticas do dashboard
function renderDashboardStats() {
    console.log('📊 Renderizando estatísticas...');
    
    if (typeof ordensDetalhadas === 'undefined' || !Array.isArray(ordensDetalhadas)) {
        console.warn('⚠️ ordensDetalhadas não disponível');
        return;
    }
    
    // Calcular estatísticas
    const hoje = new Date().toISOString().split('T')[0];
    
    const stats = {
        aSeparar: ordensDetalhadas.filter(o => o.status === 'pending').length,
        emSeparacao: ordensDetalhadas.filter(o => o.status === 'progress').length,
        concluidasHoje: ordensDetalhadas.filter(o => {
            if (o.status !== 'completed') return false;
            if (!o.fimSeparacao) return false;
            const dataFim = new Date(o.fimSeparacao).toISOString().split('T')[0];
            return dataFim === hoje;
        }).length,
        total: ordensDetalhadas.length
    };
    
    console.log('📈 Estatísticas calculadas:', stats);
    
    // Atualizar círculos de progresso nos cards do dashboard
    updateDashboardCircle('a-separar-circle', stats.aSeparar, stats.total, 'amber');
    updateDashboardCircle('em-separacao-circle', stats.emSeparacao, stats.total, 'blue');
    updateDashboardCircle('concluidas-circle', stats.concluidasHoje, stats.total, 'emerald');
}

// Atualizar círculo de progresso do dashboard
function updateDashboardCircle(containerId, valor, total, color) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    
    // Configurações do círculo
    const size = 56;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (porcentagem / 100) * circumference;
    const dashoffset = circumference - progress;
    
    // Cores por tipo
    const colors = {
        amber: '#f59e0b',
        blue: '#3b82f6',
        emerald: '#10b981',
        primary: '#6366f1'
    };
    
    const strokeColor = colors[color] || colors.primary;
    
    container.innerHTML = `
        <div class="progress-circle-wrapper">
            <svg class="progress-circle-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <!-- Círculo de fundo -->
                <circle
                    class="progress-circle-bg"
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.2)"
                    stroke-width="${strokeWidth}"
                />
                
                <!-- Círculo de progresso - começa à esquerda (rotate -90) -->
                <circle
                    class="progress-circle-fill"
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="${strokeColor}"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${dashoffset}"
                    stroke-linecap="round"
                    transform="rotate(-90 ${size / 2} ${size / 2})"
                    style="transition: stroke-dashoffset 0.8s ease-out;"
                />
            </svg>
            <div class="progress-circle-text">${porcentagem}%</div>
        </div>
    `;
}

// Inicializar dashboard
function initDashboard() {
    console.log('🚀 Inicializando dashboard...');
    renderDashboardStats();
}

// Exportar funções
window.renderDashboardStats = renderDashboardStats;
window.initDashboard = initDashboard;
window.updateDashboardCircle = updateDashboardCircle;

console.log('✅ dashboard-stats.js carregado');
