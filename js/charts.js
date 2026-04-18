// ============================================
// CHARTS.JS — Dashboard Gráficos
// 4 layouts com gráficos dedicados
// Atualização dinâmica a cada 15s
// ============================================

let weekChart      = null;  // layout classic
let pieChart       = null;  // layout classic - donut
let analyticsChart = null;  // layout analytics
let compactChart   = null;  // layout compact
let cmdChart       = null;  // layout command
let chartMode      = 'semana'; // 'semana' | 'mes'
let chartTimer     = null;

// ── Gera dados dos últimos N dias ────────────────────────────

function getChartData(days) {
    const orders = window.state?.orders || [];
    const labels     = [];
    const criadas    = [];
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

// ── Inicializa todos os gráficos ─────────────────────────────

function initCharts() {
    buildWeekChart();
    buildPieChart();
    buildAnalyticsChart();
    buildCompactChart();
    buildCommandChart();
    startChartTimer();
}

// ── LAYOUT 1 — Clássico: linha ───────────────────────────────

function buildWeekChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const datasets = [
        {
            label: 'Ordens Registradas', data: criadas,
            borderColor: '#eab308', backgroundColor: 'rgba(234,179,8,.08)',
            borderWidth: 2.5, pointBackgroundColor: '#eab308',
            pointBorderColor: '#0f172a', pointBorderWidth: 2,
            pointRadius: 5, pointHoverRadius: 8, tension: 0.45, fill: true,
        },
        {
            label: 'Ordens Concluídas', data: concluidas,
            borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)',
            borderWidth: 2.5, pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#0f172a', pointBorderWidth: 2,
            pointRadius: 5, pointHoverRadius: 8, tension: 0.45, fill: true,
        }
    ];

    if (weekChart) {
        weekChart.data.labels           = labels;
        weekChart.data.datasets[0].data = criadas;
        weekChart.data.datasets[1].data = concluidas;
        weekChart.update('active');
        return;
    }

    weekChart = new Chart(ctx, {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true, position: 'top', align: 'end',
                    labels: { color: '#94a3b8', font: { size: 12, family: "'Plus Jakarta Sans', sans-serif", weight: '600' }, usePointStyle: true, pointStyleWidth: 10, boxHeight: 6, padding: 20 }
                },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
                    callbacks: { title: i => i[0].label, label: i => ` ${i.dataset.label}: ${i.parsed.y} ordens` }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(148,163,184,.07)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 11 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,.07)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null } }
            }
        }
    });
}

// ── LAYOUT 1 — Clássico: donut ───────────────────────────────

function buildPieChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const orders    = window.state?.orders || [];
    const pending   = orders.filter(o=>o.status==='pending').length;
    const progress  = orders.filter(o=>['progress','in_progress'].includes(o.status)).length;
    const completed = orders.filter(o=>o.status==='completed').length;
    const delivered = orders.filter(o=>o.status==='delivered').length;
    const total     = pending + progress + completed + delivered || 1;

    if (pieChart) {
        pieChart.data.datasets[0].data = [pending, progress, completed, delivered];
        pieChart.update('active');
        return;
    }

    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['A Separar','Em Separação','Concluídas','Entregues'],
            datasets: [{
                data: [pending, progress, completed, delivered],
                backgroundColor: ['rgba(99,102,241,.8)','rgba(59,130,246,.8)','rgba(16,185,129,.8)','rgba(234,179,8,.8)'],
                borderColor: '#0f172a', borderWidth: 3, hoverOffset: 8,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11, family: "'Plus Jakarta Sans', sans-serif", weight: '600' }, usePointStyle: true, padding: 16 } },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
                    callbacks: { label: i => ` ${i.label}: ${i.parsed} (${Math.round(i.parsed/total*100)}%)` }
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
                c.fillStyle = '#f1f5f9'; c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(total, cx, cy);
                c.font = `12px 'Plus Jakarta Sans', sans-serif`; c.fillStyle = '#64748b';
                c.fillText('Total', cx, cy + 22);
                c.restore();
            }
        }]
    });
}

// ── LAYOUT 2 — Analytics: linha + área ───────────────────────

function buildAnalyticsChart() {
    const ctx = document.getElementById('performanceChart2');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const datasets = [
        {
            label: 'Registradas', data: criadas,
            borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.1)',
            borderWidth: 2.5, pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#0f172a', pointBorderWidth: 2,
            pointRadius: 4, pointHoverRadius: 7, tension: 0.45, fill: true,
        },
        {
            label: 'Concluídas', data: concluidas,
            borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)',
            borderWidth: 2.5, pointBackgroundColor: '#10b981',
            pointBorderColor: '#0f172a', pointBorderWidth: 2,
            pointRadius: 4, pointHoverRadius: 7, tension: 0.45, fill: true,
        }
    ];

    if (analyticsChart) {
        analyticsChart.data.labels           = labels;
        analyticsChart.data.datasets[0].data = criadas;
        analyticsChart.data.datasets[1].data = concluidas;
        analyticsChart.update('active');
        return;
    }

    analyticsChart = new Chart(ctx, {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true, position: 'top', align: 'end',
                    labels: { color: '#94a3b8', font: { size: 11, family: "'Plus Jakarta Sans', sans-serif", weight: '600' }, usePointStyle: true, pointStyleWidth: 8, boxHeight: 5, padding: 16 }
                },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 10, cornerRadius: 8,
                    callbacks: { label: i => ` ${i.dataset.label}: ${i.parsed.y}` }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(148,163,184,.06)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,.06)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null } }
            }
        }
    });
}

// ── LAYOUT 3 — Compacto: barras ──────────────────────────────

function buildCompactChart() {
    const ctx = document.getElementById('performanceChart3');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const datasets = [
        {
            label: 'Registradas', data: criadas,
            backgroundColor: 'rgba(99,102,241,.7)', borderColor: '#6366f1',
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false,
        },
        {
            label: 'Concluídas', data: concluidas,
            backgroundColor: 'rgba(16,185,129,.7)', borderColor: '#10b981',
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false,
        }
    ];

    if (compactChart) {
        compactChart.data.labels           = labels;
        compactChart.data.datasets[0].data = criadas;
        compactChart.data.datasets[1].data = concluidas;
        compactChart.update('active');
        return;
    }

    compactChart = new Chart(ctx, {
        type: 'bar', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 700, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true, position: 'top', align: 'end',
                    labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true, pointStyleWidth: 8, boxHeight: 4, padding: 12 }
                },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: 'rgba(148,163,184,.2)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 8, cornerRadius: 8,
                    callbacks: { label: i => ` ${i.dataset.label}: ${i.parsed.y}` }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,.07)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 9 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null } }
            }
        }
    });
}

// ── LAYOUT 4 — Command: linha dark ───────────────────────────

function buildCommandChart() {
    const ctx = document.getElementById('performanceChart4');
    if (!ctx) return;

    const days = chartMode === 'semana' ? 7 : 30;
    const { labels, criadas, concluidas } = getChartData(days);

    const datasets = [
        {
            label: 'Registradas', data: criadas,
            borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.07)',
            borderWidth: 2.5, pointBackgroundColor: '#6366f1',
            pointBorderColor: '#0d1526', pointBorderWidth: 2,
            pointRadius: 4, pointHoverRadius: 7, tension: 0.45, fill: true,
        },
        {
            label: 'Concluídas', data: concluidas,
            borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.07)',
            borderWidth: 2.5, pointBackgroundColor: '#10b981',
            pointBorderColor: '#0d1526', pointBorderWidth: 2,
            pointRadius: 4, pointHoverRadius: 7, tension: 0.45, fill: true,
        }
    ];

    if (cmdChart) {
        cmdChart.data.labels           = labels;
        cmdChart.data.datasets[0].data = criadas;
        cmdChart.data.datasets[1].data = concluidas;
        cmdChart.update('active');
        return;
    }

    cmdChart = new Chart(ctx, {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827', borderColor: 'rgba(255,255,255,.08)', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10,
                    callbacks: { label: i => ` ${i.dataset.label}: ${i.parsed.y} ordens` }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,.04)', drawBorder: false }, ticks: { color: '#475569', font: { size: 10 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.04)', drawBorder: false }, ticks: { color: '#475569', font: { size: 10 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : null } }
            }
        }
    });
}

// ── Auto-refresh a cada 15s ───────────────────────────────────

function startChartTimer() {
    if (chartTimer) clearInterval(chartTimer);
    chartTimer = setInterval(() => {
        const rebuild = () => {
            buildWeekChart();
            buildAnalyticsChart();
            buildCompactChart();
            buildCommandChart();
            buildPieChart();
            const dot = document.getElementById('chart-live-dot');
            if (dot) {
                dot.style.transform = 'scale(2)'; dot.style.opacity = '1';
                setTimeout(() => { dot.style.transform = 'scale(1)'; dot.style.opacity = '.7'; }, 400);
            }
        };
        if (typeof loadOrders === 'function') loadOrders().then(rebuild);
        else rebuild();
    }, 15000);
}

// ── Toggle 7d / 30d ──────────────────────────────────────────

function switchChartMode(mode, btn) {
    chartMode = mode === 'week' ? 'semana' : 'mes';
    const container = btn?.closest('.flex');
    if (container) {
        container.querySelectorAll('.chart-mode-btn').forEach(b => b.classList.remove('active-chart-btn'));
        btn.classList.add('active-chart-btn');
    }
    buildWeekChart();
    buildAnalyticsChart();
    buildCompactChart();
    buildCommandChart();
}

function toggleChartMode(mode) {
    chartMode = mode;
    document.querySelectorAll('.chart-mode-btn').forEach(b =>
        b.classList.toggle('active-chart-btn', b.dataset.mode === mode));
    buildWeekChart(); buildAnalyticsChart(); buildCompactChart(); buildCommandChart();
}

function updateCharts() {
    buildWeekChart(); buildPieChart();
    buildAnalyticsChart(); buildCompactChart(); buildCommandChart();
}

window.initCharts        = initCharts;
window.updateCharts      = updateCharts;
window.toggleChartMode   = toggleChartMode;
window.switchChartMode   = switchChartMode;
window.buildWeekChart    = buildWeekChart;
window.buildPieChart     = buildPieChart;
window.buildAnalyticsChart = buildAnalyticsChart;
window.buildCompactChart = buildCompactChart;
window.buildCommandChart = buildCommandChart;

console.log('✅ charts.js — 4 layouts carregados (classic, analytics, compact, command)');
