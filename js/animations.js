// ============================================================
// ANIMATIONS.JS — Ordem Pro · Sistema de animações completo
// ============================================================
(function () {
'use strict';

// ══════════════════════════════════════════════════════════════
// CSS — keyframes + classes utilitárias
// ══════════════════════════════════════════════════════════════
const CSS = `
@keyframes vt-fade-up    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
@keyframes vt-fade-in    { from{opacity:0} to{opacity:1} }
@keyframes vt-scale-in   { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
@keyframes vt-slide-r    { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:none} }
@keyframes vt-slide-l    { from{opacity:0;transform:translateX(14px)}  to{opacity:1;transform:none} }

@keyframes vt-float      { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-5px)} }
@keyframes vt-float-r    { 0%,100%{transform:translateY(0) rotate(0)}  50%{transform:translateY(-3px) rotate(1deg)} }
@keyframes vt-bob        { 0%,100%{transform:translateY(0) scale(1)}  50%{transform:translateY(-2px) scale(1.01)} }

@keyframes vt-pulse-ring {
  0%   { box-shadow:0 0 0 0 rgba(99,102,241,.4); }
  70%  { box-shadow:0 0 0 10px rgba(99,102,241,0); }
  100% { box-shadow:0 0 0 0  rgba(99,102,241,0); }
}
@keyframes vt-pulse-dot {
  0%,100%{ opacity:1; transform:scale(1); }
  50%    { opacity:.7; transform:scale(1.2); }
}
@keyframes vt-glow {
  0%,100%{ filter:brightness(1) drop-shadow(0 0 0px transparent); }
  50%    { filter:brightness(1.08) drop-shadow(0 0 6px rgba(99,102,241,.45)); }
}
@keyframes vt-glow-orange {
  0%,100%{ filter:brightness(1); }
  50%    { filter:brightness(1.1) drop-shadow(0 0 8px rgba(255,107,0,.5)); }
}
@keyframes vt-shimmer {
  0%  { background-position:-250% center; }
  100%{ background-position:250% center; }
}
@keyframes vt-border-flow {
  0%  { background-position:0% 50%; }
  50% { background-position:100% 50%; }
  100%{ background-position:0% 50%; }
}
@keyframes vt-ripple {
  0%  { transform:translate(-50%,-50%) scale(0); opacity:.5; }
  100%{ transform:translate(-50%,-50%) scale(3);  opacity:0; }
}
@keyframes vt-pop {
  0%  { transform:scale(1); }
  35% { transform:scale(1.1); }
  60% { transform:scale(.96); }
  100%{ transform:scale(1); }
}
@keyframes vt-spin-once {
  from{ transform:rotate(0deg); }
  to  { transform:rotate(360deg); }
}
@keyframes vt-shake {
  0%,100%{ transform:translateX(0); }
  20%    { transform:translateX(-3px); }
  40%    { transform:translateX(3px); }
  60%    { transform:translateX(-2px); }
  80%    { transform:translateX(2px); }
}
@keyframes vt-counter {
  from{ opacity:0; transform:translateY(6px) scale(.9); }
  to  { opacity:1; transform:none; }
}
@keyframes vt-chart-wave {
  0%  { transform:scaleY(1) scaleX(1); opacity:1; }
  25% { transform:scaleY(.97) scaleX(1.005); opacity:.95; }
  50% { transform:scaleY(.985) scaleX(.998); opacity:.97; }
  75% { transform:scaleY(.994) scaleX(1.002); opacity:.98; }
  100%{ transform:scaleY(1) scaleX(1); opacity:1; }
}
@keyframes vt-chart-flash {
  0%  { filter:brightness(1) saturate(1); }
  30% { filter:brightness(1.12) saturate(1.15); }
  60% { filter:brightness(1.06) saturate(1.08); }
  100%{ filter:brightness(1) saturate(1); }
}
@keyframes vt-bar-grow    { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes vt-num-pop     { 0%{transform:scale(1)} 40%{transform:scale(1.09)} 100%{transform:scale(1)} }

/* Utility classes */
.vt-enter   { animation:vt-fade-up  .55s cubic-bezier(.16,1,.3,1) both; }
.vt-scale   { animation:vt-scale-in .45s cubic-bezier(.16,1,.3,1) both; }
.vt-left    { animation:vt-slide-r  .45s cubic-bezier(.16,1,.3,1) both; }
.vt-right   { animation:vt-slide-l  .45s cubic-bezier(.16,1,.3,1) both; }

/* Stagger */
${[...Array(10)].map((_,i)=>`
.vt-d${i+1}{ animation-delay:${(i+1)*60}ms; }`).join('')}

/* Card tilt desativado */

/* Botão primário */
.vt-btn-primary {
  position:relative; overflow:hidden;
  transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease !important;
}
.vt-btn-primary:hover {
  transform: translateY(-2px) scale(1.03) !important;
}
.vt-btn-primary:active {
  transform: scale(.96) !important;
  transition-duration:.08s !important;
}
.vt-btn-primary::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
  background-size:250% 100%;
  animation:vt-shimmer 2.8s linear infinite;
  pointer-events:none;
}

/* Botão secundário */
.vt-btn-sec {
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), background .18s ease, border-color .18s ease !important;
}
.vt-btn-sec:hover  { transform:translateY(-1px) scale(1.02) !important; }
.vt-btn-sec:active { transform:scale(.96) !important; transition-duration:.08s !important; }

/* Ripple */
.vt-ripple-spot {
  position:absolute; border-radius:50%;
  width:80px; height:80px;
  background:rgba(255,255,255,.22);
  pointer-events:none;
  animation:vt-ripple .6s ease-out forwards;
}

/* Status dot */
.vt-live-dot { animation:vt-pulse-dot 1.8s ease-in-out infinite; }

/* Nav icons */
.vt-nav-icon {
  transition:transform .3s cubic-bezier(.34,1.56,.64,1) !important;
  display:inline-block;
}
.nav-item:hover .vt-nav-icon,
.nav-item.active-nav .vt-nav-icon { transform:scale(1.22) !important; }

/* Chart wrappers durante ciclo */
.vt-chart-cycle { animation:vt-chart-wave 1.2s cubic-bezier(.4,0,.2,1); }
.vt-chart-flash { animation:vt-chart-flash .8s ease-out; }

/* Número atualizado */
.vt-num-anim { animation:vt-num-pop .4s cubic-bezier(.34,1.56,.64,1); }
.vt-counter-anim { animation:vt-counter .35s cubic-bezier(.16,1,.3,1) both; }

/* Badge glow */
.vt-badge-glow { animation:vt-pulse-ring 2.5s ease-in-out infinite; }

/* Progress bar */
.vt-bar { transform-origin:left; animation:vt-bar-grow .9s cubic-bezier(.16,1,.3,1) both; }

/* Float decorativo */
.vt-float      { animation:vt-float   4s ease-in-out infinite; }
.vt-float-r    { animation:vt-float-r 5s ease-in-out infinite; }
.vt-bob        { animation:vt-bob     6s ease-in-out infinite; }
.vt-glow       { animation:vt-glow 4s ease-in-out infinite; }
.vt-glow-ora   { animation:vt-glow-orange 3.5s ease-in-out infinite; }

/* Kanban cell hover — sutil */
.vaga.ocupada {
  transition: box-shadow .2s ease, filter .2s ease !important;
}
.vaga.ocupada:hover {
  filter:brightness(1.08) !important;
}

/* Tab de layout ativa */
.layout-btn { transition:all .2s cubic-bezier(.16,1,.3,1) !important; }
.layout-btn:hover { transform:translateY(-1px) !important; }
.layout-btn.active-layout, .layout-btn.active-chart-btn {
  animation:vt-pop .35s cubic-bezier(.34,1.56,.64,1);
}
`;

// ══════════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════════
function injectCSS() {
  if (document.getElementById('vt-anim')) return;
  const s = document.createElement('style');
  s.id = 'vt-anim';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function once(el, key, fn) {
  if (!el || el[key]) return;
  el[key] = true;
  fn(el);
}

// 1. Card Tilt removido a pedido do usuário

// ══════════════════════════════════════════════════════════════
// 2. RIPPLE — onda ao clicar em qualquer botão
// ══════════════════════════════════════════════════════════════
function setupRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .kf-btn, .nav-item, .layout-btn, .vaga.ocupada');
    if (!btn) return;
    const r   = btn.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'vt-ripple-spot';
    dot.style.left = (e.clientX - r.left) + 'px';
    dot.style.top  = (e.clientY - r.top)  + 'px';
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  }, { passive: true });
}

// ══════════════════════════════════════════════════════════════
// 3. BOTÕES — bounce, shimmer, ripple
// ══════════════════════════════════════════════════════════════
function setupButtons() {
  function scan() {
    // Primários
    document.querySelectorAll(
      '#nova-ordem-btn, button.bg-primary-600, [id*="nova-ordem"], ' +
      '#kanban-action-btn, button[class*="bg-primary-7"], button[class*="bg-primary-6"]'
    ).forEach(btn => once(btn, '_vtBtnP', el => el.classList.add('vt-btn-primary')));

    // Secundários
    document.querySelectorAll(
      '.kf-btn, .layout-btn, #kanban-qtd-btn, #kanban-mult-btn, ' +
      '#kanban-consumo-btn, #kanban-cfg-btn, button[class*="border"]'
    ).forEach(btn => once(btn, '_vtBtnS', el => el.classList.add('vt-btn-sec')));

    // Ícones dos botões giram um vez no hover
    document.querySelectorAll('button').forEach(btn => {
      once(btn, '_vtIconHov', el => {
        const ico = el.querySelector('.material-symbols-rounded');
        if (!ico) return;
        el.addEventListener('mouseenter', () => {
          ico.style.transition   = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
          ico.style.transform    = 'scale(1.25) rotate(-6deg)';
        });
        el.addEventListener('mouseleave', () => {
          ico.style.transform    = 'scale(1) rotate(0deg)';
        });
        el.addEventListener('click', () => {
          ico.style.transition   = 'transform .12s ease';
          ico.style.transform    = 'scale(.85) rotate(15deg)';
          setTimeout(() => {
            ico.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
            ico.style.transform  = 'scale(1) rotate(0)';
          }, 130);
        });
      });
    });
  }

  scan();
  setInterval(scan, 3500);
}

// 4. Card Entrance e Page Observer removidos a pedido do usuário

// ══════════════════════════════════════════════════════════════
// 5. GRÁFICOS — ciclo dinâmico a cada 6 segundos
// ══════════════════════════════════════════════════════════════
let _chartTimer = null;

function runChartCycle() {
  if (typeof Chart === 'undefined') return;

  // 5a. Micro-movimento nos canvas
  document.querySelectorAll('canvas').forEach(canvas => {
    const wrap = canvas.closest('div');
    if (!wrap) return;

    // Wave — escala suave
    canvas.classList.remove('vt-chart-cycle');
    void canvas.offsetWidth;
    canvas.classList.add('vt-chart-cycle');
    setTimeout(() => canvas.classList.remove('vt-chart-cycle'), 1300);

    // Flash de brilho no wrapper
    wrap.classList.remove('vt-chart-flash');
    void wrap.offsetWidth;
    wrap.classList.add('vt-chart-flash');
    setTimeout(() => wrap.classList.remove('vt-chart-flash'), 900);
  });

  // 5b. Update suave dos datasets — leve oscilação visual
  Object.values(Chart.instances || {}).forEach(chart => {
    if (!chart?.data?.datasets?.length) return;

    chart.data.datasets.forEach(ds => {
      if (!Array.isArray(ds.data)) return;
      if (!ds._vtOriginal) ds._vtOriginal = [...ds.data];

      // Aplica ruído leve (±0.5%) nos pontos
      ds.data = ds._vtOriginal.map(v => {
        if (typeof v !== 'number') return v;
        const jitter = v * (Math.random() * .01 - .005);
        return +(v + jitter).toFixed(1);
      });
    });

    chart.update({ duration: 900, easing: 'easeInOutCubic', lazy: true });

    // Após 1.2s, volta ao original para não distorcer dados reais
    setTimeout(() => {
      chart.data.datasets.forEach(ds => {
        if (ds._vtOriginal) ds.data = [...ds._vtOriginal];
      });
      chart.update({ duration: 600, easing: 'easeInOutSine', lazy: true });
    }, 1200);
  });
}

function startChartCycle() {
  if (_chartTimer) clearInterval(_chartTimer);
  _chartTimer = setInterval(runChartCycle, 6000);
  // Primeiro ciclo em 2s
  setTimeout(runChartCycle, 2000);
}

// ══════════════════════════════════════════════════════════════
// 6. NÚMEROS — pop ao atualizar valor
// ══════════════════════════════════════════════════════════════
function setupNumberAnimations() {
  function watchEl(el) {
    once(el, '_vtNum', target => {
      new MutationObserver(() => {
        target.classList.remove('vt-num-anim');
        void target.offsetWidth;
        target.classList.add('vt-num-anim');
        setTimeout(() => target.classList.remove('vt-num-anim'), 450);
      }).observe(target, { childList: true, characterData: true, subtree: true });
    });
  }

  function scan() {
    document.querySelectorAll(
      '.metric-card h3, #ks-ok, #ks-low, #ks-dup, #ks-empty, #ks-total, ' +
      '[class*="stat-number"], .cmd-number, #cmd-efic'
    ).forEach(watchEl);
  }
  scan(); setTimeout(scan, 1500);
}

// ══════════════════════════════════════════════════════════════
// 7. NAV SIDEBAR — ícones animados
// ══════════════════════════════════════════════════════════════
function setupNavAnimations() {
  function scan() {
    document.querySelectorAll('.nav-item, [class*="nav-item"]').forEach(item => {
      once(item, '_vtNav', el => {
        const ico = el.querySelector('.material-symbols-rounded');
        if (!ico) return;
        ico.classList.add('vt-nav-icon');

        el.addEventListener('click', () => {
          ico.style.animation = 'none';
          void ico.offsetWidth;
          ico.style.animation = 'vt-spin-once .4s cubic-bezier(.34,1.56,.64,1)';
          setTimeout(() => { ico.style.animation = ''; }, 450);
        });
      });
    });
  }
  scan(); setTimeout(scan, 1500);
}

// ══════════════════════════════════════════════════════════════
// 8. LAYOUT BUTTONS — flash ao selecionar
// ══════════════════════════════════════════════════════════════
function setupLayoutButtons() {
  function scan() {
    document.querySelectorAll('.layout-btn, .active-chart-btn, [onclick*="setDashLayout"]').forEach(btn => {
      once(btn, '_vtLay', el => {
        el.addEventListener('click', () => {
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = 'vt-pop .35s cubic-bezier(.34,1.56,.64,1)';
          setTimeout(() => { el.style.animation = ''; }, 380);


        });
      });
    });
  }
  scan(); setTimeout(scan, 1200);
}

// ══════════════════════════════════════════════════════════════
// 9. STATUS DOT — pulso nos indicadores de status
// ══════════════════════════════════════════════════════════════
function setupStatusDots() {
  function scan() {
    document.querySelectorAll(
      '.animate-pulse, .status-dot, [id*="status-dot"], ' +
      '.bg-emerald-500.rounded-full:not(.vt-live-dot)'
    ).forEach(el => {
      once(el, '_vtDot', e => e.classList.add('vt-live-dot'));
    });
  }
  scan(); setTimeout(scan, 1000);
}

// ══════════════════════════════════════════════════════════════
// 10. PROGRESS BARS — cresce ao aparecer
// ══════════════════════════════════════════════════════════════
function setupProgressBars() {
  function scan() {
    document.querySelectorAll(
      '[class*="h-1.5"], [class*="h-2 "], [class*="h-px"], ' +
      '.progress-fill, [class*="progress"]'
    ).forEach(bar => {
      once(bar, '_vtBar', el => {
        if (el.offsetHeight > 10) return;
        el.classList.add('vt-bar');
      });
    });
  }
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

// 11. Hover magnético removido a pedido do usuário

// ══════════════════════════════════════════════════════════════
// 12. NOTIFICAÇÃO BADGE — shake quando há novos itens
// ══════════════════════════════════════════════════════════════
function setupBadgeAnimations() {
  let lastBadge = {};
  setInterval(() => {
    document.querySelectorAll('[id*="badge"], [id*="notification"], [class*="badge"]').forEach(badge => {
      const txt = badge.textContent.trim();
      const key = badge.id || badge.className;
      if (txt && txt !== '0' && txt !== lastBadge[key]) {
        lastBadge[key] = txt;
        badge.style.animation = 'none';
        void badge.offsetWidth;
        badge.style.animation = 'vt-shake .4s ease, vt-pop .35s ease';
        setTimeout(() => { badge.style.animation = ''; }, 450);
      }
    });
  }, 3000);
}

// ══════════════════════════════════════════════════════════════
// 13. VITO FAB — float decorativo
// ══════════════════════════════════════════════════════════════
function setupVitoFloat() {
  function tag() {
    const vito = document.getElementById('vito-fab');
    if (!vito || vito._vtFloat) return;
    vito._vtFloat = true;
    vito.classList.add('vt-float-r');
  }
  tag(); setTimeout(tag, 2500);
}

// ══════════════════════════════════════════════════════════════
// 14. CHART TABS (Semana / Mês) — transição dos dados
// ══════════════════════════════════════════════════════════════
function setupChartTabAnimations() {
  function scan() {
    document.querySelectorAll('.active-chart-btn, [onclick*="setChartMode"], [onclick*="buildWeek"]').forEach(btn => {
      once(btn, '_vtChartTab', el => {
        el.addEventListener('click', () => {
          // Flash rápido nos charts após mudança de modo
          setTimeout(() => {
            document.querySelectorAll('canvas').forEach(c => {
              c.classList.remove('vt-chart-flash');
              void c.offsetWidth;
              c.classList.add('vt-chart-flash');
              setTimeout(() => c.classList.remove('vt-chart-flash'), 900);
            });
          }, 100);
        });
      });
    });
  }
  scan(); setTimeout(scan, 1500);
}

// ══════════════════════════════════════════════════════════════
// 15. KANBAN CELLS — brilho ao hover
// ══════════════════════════════════════════════════════════════
function setupKanbanCellGlow() {
  function scan() {
    document.querySelectorAll('.vaga.ocupada').forEach(cell => {
      once(cell, '_vtCell', el => {
        el.addEventListener('mouseenter', () => {
          el.style.filter = 'brightness(1.1) saturate(1.15)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.filter = '';
        });
      });
    });
  }

  scan();
  new MutationObserver(scan).observe(
    document.getElementById('kanban-container') || document.body,
    { childList: true, subtree: true }
  );
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
function init() {
  injectCSS();

  // Imediatos
  setupRipple();
  setupStatusDots();

  // Após DOM estável
  setTimeout(() => {
    setupButtons();
    setupNavAnimations();
    setupLayoutButtons();
    setupChartTabAnimations();
    setupNumberAnimations();
    setupProgressBars();
    setupBadgeAnimations();
    setupVitoFloat();
    setupKanbanCellGlow();
    startChartCycle();
  }, 500);

  // Re-scan periódico
  setInterval(() => {
    setupButtons();
    setupNavAnimations();
    setupKanbanCellGlow();
  }, 5000);

  console.log('✅ animations.js — 15 módulos ativos');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.VTAnimations = { animateCardEntrance, runChartCycle, startChartCycle };

})();
