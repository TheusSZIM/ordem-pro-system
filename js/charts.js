/* ============================================
   CONTROLE DE ORDENS PRO - GRÁFICOS
   ============================================ */

let performanceChart, distributionChart;

// Inicializar Gráficos
function initCharts() {
    console.log('🎨 Inicializando gráficos...');
    
    // Performance Chart (Desempenho da Semana)
    const perfCtx = document.getElementById('performanceChart');
    if (perfCtx) {
        performanceChart = new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Concluídas',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'Pendentes',
                    data: [8, 12, 10, 15, 12, 8, 5],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: '#64748b'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                }
            }
        });
        console.log('✅ Performance chart criado');
    }
    
    // Distribution Chart (Gráfico de Rosca)
    updateDistributionChart();
}

// Atualizar Gráfico de Distribuição
function updateDistributionChart() {
    const distCtx = document.getElementById('distributionChart');
    
    if (!distCtx) {
        console.warn('⚠️ Canvas distributionChart não encontrado');
        return;
    }
    
    // Verificar se state.orders existe
    if (typeof state === 'undefined' || !state.orders) {
        console.warn('⚠️ state.orders não disponível, tentando novamente em 2s...');
        setTimeout(updateDistributionChart, 2000);
        return;
    }
    
    // Contar ordens por status
    const counts = {
        pending: state.orders.filter(o => o.status === 'pending').length,
        progress: state.orders.filter(o => o.status === 'progress' || o.status === 'in_progress').length,
        completed: state.orders.filter(o => o.status === 'completed').length,
        delivered: state.orders.filter(o => o.status === 'delivered').length
    };
    
    const total = counts.pending + counts.progress + counts.completed + counts.delivered;
    
    console.log('📊 Distribuição:', counts, 'Total:', total);
    
    // Atualizar número no centro
    const centerNumber = document.querySelector('#distributionChart + div span.text-2xl');
    if (centerNumber) {
        centerNumber.textContent = total;
    }
    
    // Criar ou atualizar gráfico
    if (distributionChart) {
        // Atualizar dados existentes
        distributionChart.data.datasets[0].data = [
            counts.pending, 
            counts.progress, 
            counts.completed, 
            counts.delivered
        ];
        distributionChart.update();
        console.log('✅ Gráfico de distribuição atualizado');
    } else {
        // Criar novo gráfico
        distributionChart = new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: ['A Separar', 'Em Separação', 'Concluídas', 'Entregues'],
                datasets: [{
                    data: [counts.pending, counts.progress, counts.completed, counts.delivered],
                    backgroundColor: [
                        '#f59e0b', // Amarelo - Pendente
                        '#3b82f6', // Azul - Em separação
                        '#10b981', // Verde - Concluídas
                        '#8b5cf6'  // Roxo - Entregues
                    ],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Tamanho do buraco no meio (70% = rosca grossa)
                plugins: {
                    legend: {
                        display: false // Esconder legenda (já temos o número no centro)
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
        console.log('✅ Gráfico de distribuição criado');
    }
}

// Atualizar todos os gráficos
function updateCharts() {
    updateDistributionChart();
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCharts, updateCharts, updateDistributionChart, performanceChart, distributionChart };
}

console.log('✅ charts.js carregado!');
