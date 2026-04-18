// ============================================
// DASHBOARD STATS — skeleton → reveal com animação
// ============================================

function renderDashboardStats() {
    if (!window.state || !window.state.orders) return;

    const orders = window.state.orders;
    const total  = orders.length;

    const aSeparar    = orders.filter(o => o.status === 'pending').length;
    const emSeparacao = orders.filter(o =>
        o.status === 'in_progress' || o.status === 'progress').length;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const concluidasHoje = orders.filter(o => {
        if (o.status !== 'completed') return false;
        const d = new Date(o.fim_separacao || o.updated_at || o.created_at);
        return d >= hoje;
    }).length;

    // Substitui skeletons pelos números reais (com pop animation)
    revealNumber('stat-a-separar-wrap',       aSeparar,       'text-slate-900 dark:text-white');
    revealNumber('stat-em-separacao-wrap',    emSeparacao,    'text-slate-900 dark:text-white');
    revealNumber('stat-concluidas-hoje-wrap', concluidasHoje, 'text-slate-900 dark:text-white');
    revealNumber('stat-total-wrap',           total,          'text-white');

    // IDs legacy ainda usados por outros scripts
    setText('stat-a-separar',       aSeparar);
    setText('stat-em-separacao',    emSeparacao);
    setText('stat-concluidas-hoje', concluidasHoje);
    setText('stat-total',           total);
    // distribution-total removido — o plugin centerText do Chart.js
    // já renderiza o total diretamente no canvas do donut

    // Círculos de progresso
    drawCircle('progress-a-separar',    aSeparar,       total, '#f59e0b');
    drawCircle('progress-em-separacao', emSeparacao,    total, '#3b82f6');
    drawCircle('progress-concluidas',   concluidasHoje, total, '#10b981');
}

// ─── helpers ────────────────────────────────────────────────────────────────

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/** Substitui o skeleton de número por um <h3> real com animação pop */
function revealNumber(wrapId, value, colorClass) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    if (wrap.querySelector('h3')) {
        // já revelado — só atualiza o texto
        wrap.querySelector('h3').textContent = value;
        return;
    }
    wrap.innerHTML = `<h3 class="text-3xl font-bold mt-1 num-pop ${colorClass}">${value}</h3>`;
}

/**
 * Substitui skeleton circular pelo arco SVG.
 * rotate(-90 cx cy) = arco começa no TOPO (12h), sentido horário.
 */
function drawCircle(id, value, total, color) {
    const container = document.getElementById(id);
    if (!container) return;

    const pct    = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
    const R      = 28;
    const CX     = 36;
    const CY     = 36;
    const SW     = 5;
    const CIRC   = 2 * Math.PI * R;
    const offset = CIRC * (1 - pct / 100);

    let arc = container.querySelector('.prog-arc');
    let txt = container.querySelector('.prog-txt');

    if (!arc) {
        // Remove classe skeleton e constrói SVG
        container.className = '';
        container.style.cssText = '';
        container.innerHTML = `
          <div style="position:relative;width:72px;height:72px;
                      display:flex;align-items:center;justify-content:center;
                      animation:card-in .5s cubic-bezier(.16,1,.3,1) both;">
            <svg width="72" height="72" viewBox="0 0 72 72"
                 style="position:absolute;inset:0;overflow:visible;">
              <circle cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="rgba(148,163,184,0.2)"
                stroke-width="${SW}" stroke-linecap="round"/>
              <circle class="prog-arc"
                cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="${color}"
                stroke-width="${SW}" stroke-linecap="round"
                stroke-dasharray="${CIRC}"
                stroke-dashoffset="${CIRC}"
                transform="rotate(-90 ${CX} ${CY})"
                style="transition:stroke-dashoffset .8s cubic-bezier(.4,0,.2,1);"/>
            </svg>
            <span class="prog-txt"
              style="position:relative;z-index:1;
                     font-size:11px;font-weight:700;
                     color:${color};letter-spacing:-.3px;
                     opacity:0;transition:opacity .4s .6s;">
              ${pct}%
            </span>
          </div>`;

        // Dispara animação do arco após 1 frame
        requestAnimationFrame(() => {
            const a = container.querySelector('.prog-arc');
            const t = container.querySelector('.prog-txt');
            if (a) a.setAttribute('stroke-dashoffset', offset);
            if (t) t.style.opacity = '1';
        });
    } else {
        arc.setAttribute('stroke-dasharray',  CIRC);
        arc.setAttribute('stroke-dashoffset', offset);
        arc.style.stroke = color;
        txt.textContent  = `${pct}%`;
        txt.style.color  = color;
    }
}

// ─── inicialização ───────────────────────────────────────────────────────────

window.renderDashboardStats = renderDashboardStats;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderDashboardStats, 1200);
    setInterval(renderDashboardStats, 30000);
});

console.log('✅ dashboard-stats.js — skeleton + reveal animado!');
