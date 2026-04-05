// ============================================
// RENDERIZAR ESTATÍSTICAS DO DASHBOARD
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
    updateProgressCircle('progress-a-separar', stats.aSeparar, stats.total);
    updateProgressCircle('progress-em-separacao', stats.emSeparacao, stats.total);
    updateProgressCircle('progress-concluidas', stats.concluidasHoje, stats.total);
}

// Atualizar Card de Estatística
function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Atualizar Círculo de Progresso
function updateProgressCircle(id, valor, total) {
    const circle = document.getElementById(id);
    if (!circle) return;
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    
    // SVG do círculo de progresso (CORRIGIDO)
    const radius = 36; // raio do círculo
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (porcentagem / 100) * circumference;
    
    circle.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80" class="transform -rotate-90">
            <!-- Círculo de fundo -->
            <circle
                cx="40"
                cy="40"
                r="${radius}"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-slate-700/30"
            />
            <!-- Círculo de progresso -->
            <circle
                cx="40"
                cy="40"
                r="${radius}"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                class="text-primary-500 transition-all duration-500"
                stroke-linecap="round"
            />
        </svg>
        <!-- Texto de porcentagem -->
        <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-bold text-slate-900 dark:text-white">${porcentagem}%</span>
        </div>
    `;
}

// Atualizar ao carregar dados
function initDashboard() {
    console.log('🚀 Inicializando dashboard...');
    renderDashboardStats();
}

// Exportar funções
window.renderDashboardStats = renderDashboardStats;
window.initDashboard = initDashboard;

console.log('✅ dashboard-stats.js carregado');
