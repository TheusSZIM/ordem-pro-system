// ============================================
// RENDERIZAR ESTATÍSTICAS - VERSÃO SIMPLIFICADA
// CÍRCULOS PERFEITAMENTE ALINHADOS
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

// Atualizar Círculo de Progresso - MÉTODO SIMPLIFICADO
function updateProgressCircle(id, valor, total) {
    const circle = document.getElementById(id);
    if (!circle) {
        console.warn('⚠️ Círculo não encontrado:', id);
        return;
    }
    
    const porcentagem = total > 0 ? Math.round((valor / total) * 100) : 0;
    
    // Parâmetros do círculo
    const size = 80;
    const center = size / 2;
    const strokeWidth = 8;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    
    // Calcular offset
    const offset = circumference - (porcentagem / 100) * circumference;
    
    circle.innerHTML = `
        <div class="relative" style="width: 80px; height: 80px;">
            <svg width="80" height="80" style="transform: rotate(-90deg);">
                
                <!-- Círculo de fundo (cinza completo) -->
                <circle
                    cx="${center}"
                    cy="${center}"
                    r="${radius}"
                    fill="none"
                    stroke="#334155"
                    stroke-opacity="0.2"
                    stroke-width="${strokeWidth}"
                />
                
                <!-- Círculo de progresso (colorido) -->
                <circle
                    cx="${center}"
                    cy="${center}"
                    r="${radius}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${circumference} ${circumference}"
                    stroke-dashoffset="${offset}"
                    stroke-linecap="round"
                    style="transition: stroke-dashoffset 0.5s ease;"
                />
            </svg>
            
            <!-- Porcentagem -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px; font-weight: bold;">${porcentagem}%</span>
            </div>
        </div>
    `;
    
    console.log(`✅ Círculo ${id} atualizado: ${porcentagem}%`);
}

// Atualizar ao carregar dados
function initDashboard() {
    console.log('🚀 Inicializando dashboard...');
    renderDashboardStats();
}

// Exportar funções
window.renderDashboardStats = renderDashboardStats;
window.initDashboard = initDashboard;

console.log('✅ dashboard-stats.js carregado (versão simplificada)');
