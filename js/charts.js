// ============================================
// CHARTS.JS — Dashboard Gráficos
// Linha Amarela: ordens registradas por dia
// Linha Azul:    ordens concluídas por dia
// Atualização dinâmica a cada 15s
// ============================================

let weekChart   = null;
let pieChart    = null;
let cmdChart    = null;
let chartMode   = 'semana'; // 'semana' | 'mes'
let chartTimer  = null;

// ── Gera dados dos últimos N dias agrupando por data ─────────

function getChartData(days) {
    const orders = window.state?.orders || [];
    const labels  = [];
    const criadas  = [];
    const concluidas = [];

    const today = new Date();
    today.setHours(23,59,59,999);

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().slice(0,10);

        labels.push(
            days <= 7
                ? d.toLocaleDateString('pt-BR', { weekday:'short' }).replace('.','')
                : d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' })
        );

        criadas.push(orders.filter(o => {
            const dt = o.created_at || o.data_prevista || '';
            return dt.slice(0,10) === dStr;
        }).length);

        concluidas.push(orders.filter(o => {
            if (!['completed','delivered'].includes(o.status)) return false;
            const dt = o.fim_separacao || o.data_entrega || o.updated_at || '';
            return dt.slice(0,10) === dStr;
        }).length);
    }

    return { labels, criadas, concluidas };
}

// ── Inicializa / atualiza todos os gráficos ──────────────────

function initCharts() {
    buildWeekChart();
    buildPieChart();
    buildCommandChart();
    startChartTimer();
}

function buildWeekChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const cfg = {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Ordens Registradas',
                    data: criadas,
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234,179,8,.08)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#eab308',
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    tension: 0.45,
                    fill: true,
                },
                {
                    label: 'Ordens Concluídas',
                    data: concluidas,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,.08)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
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
                legend: {
                    display: true, position: 'top', align: 'end',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 12, family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
                        usePointStyle: true, pointStyleWidth: 10, boxHeight: 6, padding: 20,
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
                    callbacks: {
                        title: items => items[0].label,
                        label: item => ` ${item.dataset.label}: ${item.parsed.y} ordens`,
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(148,163,184,.07)', drawBorder: false },
                    ticks: { color: '#64748b', font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148,163,184,.07)', drawBorder: false },
                    ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null },
                }
            }
        }
    };

    if (weekChart) {
        weekChart.data.labels           = labels;
        weekChart.data.datasets[0].data = criadas;
        weekChart.data.datasets[1].data = concluidas;
        weekChart.update('active');
    } else {
        weekChart = new Chart(ctx, cfg);
    }
}

// ── Gráfico de pizza (distribuição) ──────────────────────────

function buildPieChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const orders = window.state?.orders || [];
    const pending   = orders.filter(o=>o.status==='pending').length;
    const progress  = orders.filter(o=>['progress','in_progress'].includes(o.status)).length;
    const completed = orders.filter(o=>o.status==='completed').length;
    const delivered = orders.filter(o=>o.status==='delivered').length;
    const total = pending + progress + completed + delivered || 1;

    const cfg = {
        type: 'doughnut',
        data: {
            labels: ['A Separar', 'Em Separação', 'Concluídas', 'Entregues'],
            datasets: [{
                data: [pending, progress, completed, delivered],
                backgroundColor: [
                    'rgba(99,102,241,.8)',
                    'rgba(59,130,246,.8)',
                    'rgba(16,185,129,.8)',
                    'rgba(234,179,8,.8)',
                ],
                borderColor: '#0f172a',
                borderWidth: 3,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 11, family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
                        usePointStyle: true, padding: 16,
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
                    callbacks: {
                        label: item => ` ${item.label}: ${item.parsed} (${Math.round(item.parsed/total*100)}%)`,
                    }
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw(chart) {
                const { width, height, ctx: c } = chart;
                c.save();
                const cx = width / 2, cy = height / 2 - 10;
                c.font = `bold 28px 'Plus Jakarta Sans', sans-serif`;
                c.fillStyle = '#f1f5f9';
                c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(total, cx, cy);
                c.font = `12px 'Plus Jakarta Sans', sans-serif`;
                c.fillStyle = '#64748b';
                c.fillText('Total', cx, cy + 22);
                c.restore();
            }
        }]
    };

    if (pieChart) {
        pieChart.data.datasets[0].data = [pending, progress, completed, delivered];
        pieChart.update('active');
    } else {
        pieChart = new Chart(ctx, cfg);
    }
}

// ── Command Center chart (performanceChart4) ──────────────────

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
                    backgroundColor: '#111827', borderColor: 'rgba(255,255,255,.08)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
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
                    ticks: { color: '#475569', font: { size: 10 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null },
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

// ── Auto-refresh a cada 15s ───────────────────────────────────

function startChartTimer() {
    if (chartTimer) clearInterval(chartTimer);
    chartTimer = setInterval(() => {
        if (typeof loadOrders === 'function') {
            loadOrders().then(() => {
                buildWeekChart();
                buildPieChart();
                buildCommandChart();
                const dot = document.getElementById('chart-live-dot');
                if (dot) {
                    dot.style.transform = 'scale(2)'; dot.style.opacity = '1';
                    setTimeout(() => { dot.style.transform = 'scale(1)'; dot.style.opacity = '.7'; }, 400);
                }
            });
        } else {
            buildWeekChart();
            buildPieChart();
            buildCommandChart();
        }
    }, 15000);
}

// ── Toggle Semana / Mês ───────────────────────────────────────

function toggleChartMode(mode) {
    chartMode = mode;
    document.querySelectorAll('.chart-mode-btn').forEach(b =>
        b.classList.toggle('active-chart-btn', b.dataset.mode === mode));
    buildWeekChart();
    buildCommandChart();
}

// Chamado por onclick nos botões 7d/Semana/Mês
function switchChartMode(mode, btn) {
    chartMode = mode === 'week' ? 'semana' : 'mes';
    // Atualiza apenas os botões do mesmo container
    const container = btn?.closest('.flex');
    if (container) {
        container.querySelectorAll('.chart-mode-btn').forEach(b => b.classList.remove('active-chart-btn'));
        btn.classList.add('active-chart-btn');
    }
    buildWeekChart();
    buildCommandChart();
}

// ── Chamado quando dados são atualizados externamente ─────────

function updateCharts() {
    buildWeekChart();
    buildPieChart();
    buildCommandChart();
}

window.initCharts      = initCharts;
window.updateCharts    = updateCharts;
window.toggleChartMode = toggleChartMode;
window.switchChartMode = switchChartMode;
window.buildWeekChart  = buildWeekChart;
window.buildPieChart   = buildPieChart;
window.buildCommandChart = buildCommandChart;

console.log('✅ charts.js carregado — 4 layouts + atualização a cada 15s');
