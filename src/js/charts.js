// ===================================
// ORDEM PRO SYSTEM - CHARTS MANAGER
// ===================================

const ChartsManager = {
    charts: {},

    /**
     * Initialize all charts
     */
    init() {
        this.initStatusChart();
        this.initTrendChart();
        this.initPerformanceChart();
    },

    /**
     * Initialize status distribution chart
     */
    initStatusChart() {
        const canvas = document.getElementById('status-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const stats = OrdersManager.getStats();

        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada'],
                datasets: [{
                    data: [stats.pending, stats.progress, stats.completed, stats.cancelled],
                    backgroundColor: [
                        '#fbbf24',
                        '#3b82f6',
                        '#10b981',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                family: 'Plus Jakarta Sans',
                                size: 12
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    },

    /**
     * Initialize trend chart
     */
    initTrendChart() {
        const canvas = document.getElementById('trend-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Generate sample data for last 7 days
        const labels = [];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 20) + 10);
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ordens',
                    data: data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans'
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Initialize performance chart
     */
    initPerformanceChart() {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Tempo Médio (min)',
                    data: [45, 38, 52, 41, 48, 35, 28],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Plus Jakarta Sans'
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Update all charts
     */
    updateAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.update();
        });
    },

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
};

// Export to global scope
window.ChartsManager = ChartsManager;

console.log('✅ Charts Manager loaded');
