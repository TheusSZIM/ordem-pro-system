// ============================================
// RENDERIZAR ESTATÍSTICAS DO DASHBOARD
// CÍRCULOS COMEÇANDO À ESQUERDA (9h)
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

// Atualizar Círculo de Progresso - ALINHADO CORRETAMENTE
function updateProgressCircle(id, valor, total) {
    const circle = document.getElementById(id);
    if (!circle) return;
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    
    // Configuração do círculo
    const size = 80;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (porcentagem / 100) * circumference;
    const dashoffset = circumference - progress;
    
    circle.innerHTML = `
        <div class="relative w-20 h-20">
            <!-- SVG ROTACIONADO - AMBOS OS CÍRCULOS DENTRO -->
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="transform rotate-180">
                
                <!-- Círculo de fundo (cinza) - MESMO CENTRO -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.2)"
                    stroke-width="${strokeWidth}"
                />
                
                <!-- Círculo de progresso (colorido) - MESMO CENTRO -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${dashoffset}"
                    stroke-linecap="round"
                    class="text-primary-500 transition-all duration-700 ease-out"
                />
            </svg>
            
            <!-- Texto centralizado - SEM ROTAÇÃO -->
            <div class="absolute inset-0 flex items-center justify-center transform -rotate-180">
                <span class="text-sm font-bold text-slate-900 dark:text-white">${porcentagem}%</span>
            </div>
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

console.log('✅ dashboard-stats.js carregado - Círculos começam à ESQUERDA (9h)');
