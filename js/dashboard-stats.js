// ============================================
// DASHBOARD STATS - CÍRCULOS CORRIGIDOS
// Usa SVG com transform-origin correto
// ============================================

function renderDashboardStats() {
    if (!window.state || !window.state.orders) return;

    const orders = window.state.orders;
    const total = orders.length;

    const aSeparar      = orders.filter(o => o.status === 'pending').length;
    const emSeparacao   = orders.filter(o => o.status === 'in_progress' || o.status === 'progress').length;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const concluidasHoje = orders.filter(o => {
        if (o.status !== 'completed') return false;
        const d = new Date(o.fim_separacao || o.updated_at || o.created_at);
        return d >= hoje;
    }).length;

    // Atualizar números
    setText('stat-a-separar',      aSeparar);
    setText('stat-em-separacao',   emSeparacao);
    setText('stat-concluidas-hoje',concluidasHoje);
    setText('stat-total',          total);

    // Atualizar círculos
    drawCircle('progress-a-separar',      aSeparar,       total, '#f59e0b');
    drawCircle('progress-em-separacao',   emSeparacao,    total, '#3b82f6');
    drawCircle('progress-concluidas',     concluidasHoje, total, '#10b981');
}

// ─── helpers ───────────────────────────────────────────────────────────────

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/**
 * Desenha (ou atualiza) um círculo de progresso SVG dentro do container #id.
 * O arco começa sempre no TOPO (12h) e vai no sentido horário.
 */
function drawCircle(id, value, total, color) {
    const container = document.getElementById(id);
    if (!container) return;

    const pct    = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
    const R      = 28;                          // raio do arco
    const CX     = 36;                          // centro X do SVG
    const CY     = 36;                          // centro Y do SVG
    const SW     = 5;                           // stroke-width
    const CIRC   = 2 * Math.PI * R;            // 175.9…
    const offset = CIRC - (pct / 100) * CIRC;  // dashoffset

    // Se o SVG já existe, apenas atualiza
    let svg  = container.querySelector('svg.prog-svg');
    let arc  = container.querySelector('.prog-arc');
    let txt  = container.querySelector('.prog-txt');

    if (!svg) {
        container.innerHTML = `
          <div style="position:relative;width:72px;height:72px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg class="prog-svg" width="72" height="72" viewBox="0 0 72 72"
                 style="position:absolute;inset:0;overflow:visible;">
              <!-- trilha cinza -->
              <circle cx="${CX}" cy="${CY}" r="${R}"
                      fill="none" stroke="rgba(148,163,184,0.2)"
                      stroke-width="${SW}" stroke-linecap="round"/>
              <!-- arco colorido — rotate(-90) faz começar no topo -->
              <circle class="prog-arc"
                      cx="${CX}" cy="${CY}" r="${R}"
                      fill="none" stroke="${color}"
                      stroke-width="${SW}" stroke-linecap="round"
                      stroke-dasharray="${CIRC}"
                      stroke-dashoffset="${offset}"
                      transform="rotate(-90 ${CX} ${CY})"
                      style="transition:stroke-dashoffset .6s ease;"/>
            </svg>
            <!-- percentual centralizado sobre o SVG -->
            <span class="prog-txt"
                  style="position:relative;z-index:1;font-size:11px;font-weight:700;color:${color};letter-spacing:-.3px;">
              ${pct}%
            </span>
          </div>`;
    } else {
        // Atualização sem recriar o DOM
        arc.style.stroke              = color;
        arc.setAttribute('stroke-dasharray',  CIRC);
        arc.setAttribute('stroke-dashoffset', offset);
        txt.textContent               = `${pct}%`;
        txt.style.color               = color;
    }
}

// ─── inicialização ─────────────────────────────────────────────────────────

// Expõe globalmente
window.renderDashboardStats = renderDashboardStats;

// Chama quando os dados chegarem
document.addEventListener('DOMContentLoaded', () => {
    // Tenta após 1 s (aguarda loadOrders)
    setTimeout(renderDashboardStats, 1000);
    // e repete a cada 30 s
    setInterval(renderDashboardStats, 30000);
});

console.log('✅ dashboard-stats.js carregado (círculos SVG corrigidos)!');
