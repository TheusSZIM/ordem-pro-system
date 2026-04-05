/* ============================================
   CONTROLE DE ORDENS PRO - GRÁFICOS
   ============================================ */

let performanceChart, distributionChart;

// Inicializar Gráficos
function initCharts() {
    // Performance Chart
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
                    fill: true
                }, {
                    label: 'Pendentes',
                    data: [8, 12, 10, 15, 12, 8, 5],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
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
    }
    
    // Distribution Chart
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        updateCharts();
    }
}

// Atualizar Gráficos
function updateCharts() {
    const distCtx = document.getElementById('distributionChart');
    if (distCtx && typeof ordensDetalhadas !== 'undefined') {
        const counts = {
            pending: ordensDetalhadas.filter(o => o.status === 'pending').length,
            progress: ordensDetalhadas.filter(o => o.status === 'progress').length,
            completed: ordensDetalhadas.filter(o => o.status === 'completed').length,
            delivered: ordensDetalhadas.filter(o => o.status === 'delivered').length
        };
        
        if (distributionChart) {
            distributionChart.data.datasets[0].data = [counts.pending, counts.progress, counts.completed, counts.delivered];
            distributionChart.update();
        } else {
            distributionChart = new Chart(distCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pendente', 'Em Separação', 'Concluídas', 'Entregues'],
                    datasets: [{
                        data: [counts.pending, counts.progress, counts.completed, counts.delivered],
                        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15,
                                color: '#64748b',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCharts, updateCharts, performanceChart, distributionChart };
}
