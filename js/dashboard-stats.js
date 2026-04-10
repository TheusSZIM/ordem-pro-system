// ============================================
// DASHBOARD STATS - VERSÃO FINAL
// Círculos SVG alinhados + sem flash inicial
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

    // Números nos cards e no centro do gráfico rosca
    setText('stat-a-separar',       aSeparar);
    setText('stat-em-separacao',    emSeparacao);
    setText('stat-concluidas-hoje', concluidasHoje);
    setText('stat-total',           total);
    setText('distribution-total',   total);

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

/**
 * Desenha (ou atualiza) um círculo de progresso SVG.
 * rotate(-90 cx cy) garante que o arco começa no TOPO (12h), sentido horário.
 * O container começa com visibility:hidden no HTML; tornamos visível aqui.
 */
function drawCircle(id, value, total, color) {
    const container = document.getElementById(id);
    if (!container) return;

    const pct    = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
    const R      = 28;
    const CX     = 36;
    const CY     = 36;
    const SW     = 5;
    const CIRC   = 2 * Math.PI * R;          // ≈ 175.9
    const offset = CIRC * (1 - pct / 100);   // dashoffset

    let arc = container.querySelector('.prog-arc');
    let txt = container.querySelector('.prog-txt');

    if (!arc) {
        // Cria estrutura uma única vez
        container.innerHTML = `
          <div style="position:relative;width:72px;height:72px;
                      display:flex;align-items:center;justify-content:center;">
            <svg width="72" height="72" viewBox="0 0 72 72"
                 style="position:absolute;inset:0;overflow:visible;">
              <!-- trilha cinza -->
              <circle cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="rgba(148,163,184,0.2)"
                stroke-width="${SW}" stroke-linecap="round"/>
              <!-- arco — rotate(-90 cx cy) = começa no topo -->
              <circle class="prog-arc"
                cx="${CX}" cy="${CY}" r="${R}"
                fill="none" stroke="${color}"
                stroke-width="${SW}" stroke-linecap="round"
                stroke-dasharray="${CIRC}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 ${CX} ${CY})"
                style="transition:stroke-dashoffset .6s ease;"/>
            </svg>
            <span class="prog-txt"
              style="position:relative;z-index:1;
                     font-size:11px;font-weight:700;
                     color:${color};letter-spacing:-.3px;">
              ${pct}%
            </span>
          </div>`;
        // Revela o container (estava hidden para evitar flash)
        container.style.visibility = 'visible';
    } else {
        // Só atualiza valores, sem recriar o DOM
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
    // Renderiza após os dados do Supabase chegarem (~1.2 s)
    setTimeout(renderDashboardStats, 1200);
    // Atualiza a cada 30 s
    setInterval(renderDashboardStats, 30000);
});

console.log('✅ dashboard-stats.js — SVG alinhado + sem flash!');
