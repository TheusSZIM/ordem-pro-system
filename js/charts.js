// ── Command Center chart (performanceChart4) ──────────────────

let cmdChart = null;

function buildCommandChart() {
    const ctx = document.getElementById('performanceChart4');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const cfg = {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Registradas',
                    data: criadas,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,.07)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#0d1526',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    tension: 0.45,
                    fill: true,
                },
                {
                    label: 'Concluídas',
                    data: concluidas,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,.07)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#0d1526',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    tension: 0.45,
                    fill: true,
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255,255,255,.08)',
                    borderWidth: 1,
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        label: item => ` ${item.dataset.label}: ${item.parsed.y} ordens`,
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,.04)', drawBorder: false },
                    ticks: { color: '#475569', font: { size: 10 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,.04)', drawBorder: false },
                    ticks: {
                        color: '#475569',
                        font: { size: 10 },
                        stepSize: 1,
                        callback: v => Number.isInteger(v) ? v : null,
                    },
                }
            }
        }
    };

    if (cmdChart) {
        cmdChart.data.labels           = labels;
        cmdChart.data.datasets[0].data = criadas;
        cmdChart.data.datasets[1].data = concluidas;
        cmdChart.update('active');
    } else {
        cmdChart = new Chart(ctx, cfg);
    }
}

// Sobrescreve initCharts para incluir o command chart
const _initChartsOriginal = window.initCharts;
window.initCharts = function() {
    _initChartsOriginal && _initChartsOriginal();
    buildCommandChart();
};

window.buildCommandChart = buildCommandChart;
