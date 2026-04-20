// ============================================================
// ANIMATIONS.JS — Animações minimalistas para o Ordem Pro
// Cards, gráficos, botões, contadores, micro-interações
// ============================================================

(function() {
'use strict';

// ── CSS BASE ─────────────────────────────────────────────────

const CSS = `
/* ═══════════════════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════════════════ */

@keyframes vt-fade-up {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes vt-fade-in {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes vt-scale-in {
  from { opacity:0; transform:scale(0.94); }
  to   { opacity:1; transform:scale(1); }
}
@keyframes vt-slide-right {
  from { opacity:0; transform:translateX(-12px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes vt-slide-left {
  from { opacity:0; transform:translateX(12px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes vt-number-pop {
  0%   { transform:scale(1); }
  40%  { transform:scale(1.08); }
  100% { transform:scale(1); }
}
@keyframes vt-shimmer {
  0%   { background-position:-200% center; }
  100% { background-position:200% center; }
}
@keyframes vt-pulse-dot {
  0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 0 0 currentColor; }
  50%     { opacity:.8; transform:scale(1.15); box-shadow:0 0 0 5px transparent; }
}
@keyframes vt-spin-slow {
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
}
@keyframes vt-float {
  0%,100% { transform:translateY(0px); }
  50%     { transform:translateY(-4px); }
}
@keyframes vt-bar-grow {
  from { transform:scaleX(0); }
  to   { transform:scaleX(1); }
}
@keyframes vt-chart-breathe {
  0%,100% { transform:scaleY(1);    opacity:1; }
  50%     { transform:scaleY(0.97); opacity:.93; }
}
@keyframes vt-glow-pulse {
  0%,100% { filter:brightness(1) drop-shadow(0 0 0 transparent); }
  50%     { filter:brightness(1.06) drop-shadow(0 0 8px currentColor); }
}
@keyframes vt-border-spin {
  from { --vt-border-angle:0deg; }
  to   { --vt-border-angle:360deg; }
}
@keyframes vt-ripple {
  0%   { transform:scale(0);   opacity:.5; }
  100% { transform:scale(2.5); opacity:0; }
}
@keyframes vt-counter-up {
  0%   { clip-path:inset(100% 0 0 0); transform:translateY(8px); }
  100% { clip-path:inset(0% 0 0 0);   transform:translateY(0); }
}

/* ═══════════════════════════════════════════════════════════
   UTILITY — Entrada de elementos
═══════════════════════════════════════════════════════════ */

.vt-enter        { animation: vt-fade-up   .5s cubic-bezier(.16,1,.3,1) both; }
.vt-enter-scale  { animation: vt-scale-in  .4s cubic-bezier(.16,1,.3,1) both; }
.vt-enter-left   { animation: vt-slide-right .4s cubic-bezier(.16,1,.3,1) both; }
.vt-enter-right  { animation: vt-slide-left  .4s cubic-bezier(.16,1,.3,1) both; }

/* Stagger delays */
.vt-d1  { animation-delay:.05s; }
.vt-d2  { animation-delay:.10s; }
.vt-d3  { animation-delay:.16s; }
.vt-d4  { animation-delay:.22s; }
.vt-d5  { animation-delay:.28s; }
.vt-d6  { animation-delay:.34s; }
.vt-d7  { animation-delay:.40s; }
.vt-d8  { animation-delay:.46s; }

/* ═══════════════════════════════════════════════════════════
   CARDS — metric cards
═══════════════════════════════════════════════════════════ */

.metric-card, .vt-card {
  transition:
    transform .25s cubic-bezier(.34,1.56,.64,1),
    box-shadow .25s ease,
    border-color .2s ease !important;
}
.metric-card:hover, .vt-card:hover {
  transform: translateY(-3px) scale(1.01) !important;
}

/* Número animado ao atualizar */
.vt-number-anim {
  animation: vt-number-pop .4s cubic-bezier(.34,1.56,.64,1);
}

/* ═══════════════════════════════════════════════════════════
   BOTÕES — micro-interações
═══════════════════════════════════════════════════════════ */

/* Ripple ao clicar */
.vt-btn-ripple {
  position: relative;
  overflow: hidden;
}
.vt-btn-ripple::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  width: 100px; height: 100px;
  top: var(--vt-ry, 50%); left: var(--vt-rx, 50%);
  transform: translate(-50%,-50%) scale(0);
  background: rgba(255,255,255,.18);
  pointer-events: none;
}
.vt-btn-ripple.vt-rippling::after {
  animation: vt-ripple .55s ease-out;
}

/* Bounce ao hover em botões de ação */
.vt-btn-bounce {
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s ease !important;
}
.vt-btn-bounce:hover {
  transform: translateY(-2px) scale(1.03) !important;
}
.vt-btn-bounce:active {
  transform: scale(.97) !important;
  transition-duration: .08s !important;
}

/* Ícones giram no hover */
.vt-icon-spin:hover .material-symbols-rounded {
  animation: vt-spin-slow .6s linear;
}

/* Float contínuo nos ícones decorativos */
.vt-float {
  animation: vt-float 3s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════════
   BARRAS DE PROGRESSO
═══════════════════════════════════════════════════════════ */

.vt-progress-bar {
  transform-origin: left center;
  animation: vt-bar-grow .8s cubic-bezier(.16,1,.3,1) both;
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE — dot pulsante
═══════════════════════════════════════════════════════════ */

.vt-status-dot {
  animation: vt-pulse-dot 2s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════════
   GRÁFICOS — respira a cada ciclo
═══════════════════════════════════════════════════════════ */

.vt-chart-active {
  animation: vt-chart-breathe 6s ease-in-out infinite;
  transform-origin: center bottom;
}
.vt-chart-glow canvas {
  animation: vt-glow-pulse 6s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════════
   SHIMMER — esqueleto / loading
═══════════════════════════════════════════════════════════ */

.vt-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.06) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: vt-shimmer 1.5s linear infinite;
}

/* ═══════════════════════════════════════════════════════════
   LAYOUT TABS — transição suave entre layouts
═══════════════════════════════════════════════════════════ */

.vt-layout-transition {
  animation: vt-fade-up .35s cubic-bezier(.16,1,.3,1) both;
}

/* ═══════════════════════════════════════════════════════════
   KANBAN — cards de posição
═══════════════════════════════════════════════════════════ */

.vaga.ocupada {
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease !important;
}
`;

// ── INJETA CSS ────────────────────────────────────────────────

function injectCSS() {
  if (document.getElementById('vt-animations-css')) return;
  const style = document.createElement('style');
  style.id = 'vt-animations-css';
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ── RIPPLE NOS BOTÕES ─────────────────────────────────────────

function setupRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .vt-btn-ripple, [onclick]');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--vt-rx', (e.clientX - rect.left) + 'px');
    btn.style.setProperty('--vt-ry', (e.clientY - rect.top) + 'px');
    btn.classList.add('vt-btn-ripple');
    btn.classList.remove('vt-rippling');
    void btn.offsetWidth;
    btn.classList.add('vt-rippling');
    setTimeout(() => btn.classList.remove('vt-rippling'), 600);
  }, { passive: true });
}

// ── BOUNCE EM BOTÕES PRIMÁRIOS ────────────────────────────────

function setupButtonBounce() {
  function tag(el) {
    if (!el || el._vtBounce) return;
    el._vtBounce = true;
    el.classList.add('vt-btn-bounce');
  }
  function scan() {
    document.querySelectorAll(
      '#nova-ordem-btn, button.bg-primary-600, [id*="nova-ordem"], ' +
      '.kf-btn, .active-chart-btn, .layout-btn, ' +
      '#kanban-action-btn, #kanban-qtd-btn, #kanban-mult-btn, ' +
      '#kanban-consumo-btn, #kanban-cfg-btn, ' +
      'button[class*="bg-primary"], button[class*="bg-emerald"]'
    ).forEach(tag);
  }
  scan();
  setTimeout(scan, 1500);
  const obs = new MutationObserver(scan);
  obs.observe(document.body, { childList: true, subtree: true });
}

// ── ANIMAÇÃO DE ENTRADA NOS CARDS ────────────────────────────

function animateCards(container) {
  const cards = (container || document).querySelectorAll(
    '.metric-card, .bg-white.rounded-2xl, .bg-white.rounded-xl, ' +
    '.dark\\:bg-slate-900.rounded-2xl, [class*="cmd-card"], ' +
    '.rounded-2xl.border, .rounded-xl.border'
  );
  cards.forEach((card, i) => {
    if (card._vtAnimated) return;
    card._vtAnimated = true;
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'none';
    const delay = Math.min(i * 55, 350);
    setTimeout(() => {
      card.style.transition = `opacity .45s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .45s cubic-bezier(.16,1,.3,1) ${delay}ms`;
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 30);
  });
}

// ── ANIMAÇÃO DOS NÚMEROS (ao atualizar) ───────────────────────

function animateNumbers() {
  const targets = document.querySelectorAll(
    '.metric-card h3, .metric-card [class*="text-4xl"], .metric-card [class*="text-3xl"], ' +
    '.metric-card [class*="text-2xl"], #ks-ok, #ks-low, #ks-dup, #ks-empty, #ks-total'
  );
  targets.forEach(el => {
    if (el._vtNumObs) return;
    el._vtNumObs = true;
    const observer = new MutationObserver(() => {
      el.classList.remove('vt-number-anim');
      void el.offsetWidth;
      el.classList.add('vt-number-anim');
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
  });
}

// ── MICRO-ANIMAÇÃO DOS GRÁFICOS A CADA 6s ────────────────────

let _chartCycle = null;

function startChartCycle() {
  if (_chartCycle) clearInterval(_chartCycle);

  _chartCycle = setInterval(() => {
    if (typeof Chart === 'undefined') return;

    Object.values(Chart.instances || {}).forEach(chart => {
      if (!chart.canvas) return;

      // 1. Micro-update dos dados (leve flutuação visual ±0.1%)
      const was = chart.canvas.style.transition;
      chart.canvas.style.transition = 'transform .4s ease, opacity .4s ease';

      // 2. Respiro suave — escala Y levemente
      chart.canvas.style.transform = 'scaleY(0.975)';
      chart.canvas.style.opacity   = '0.88';

      setTimeout(() => {
        chart.canvas.style.transform = 'scaleY(1)';
        chart.canvas.style.opacity   = '1';
      }, 400);
    });

    // 3. Efeito nos wrappers dos gráficos
    document.querySelectorAll('canvas').forEach(canvas => {
      const wrap = canvas.parentElement;
      if (!wrap) return;
      wrap.style.transition = 'filter .4s ease';
      wrap.style.filter = 'brightness(1.04)';
      setTimeout(() => { wrap.style.filter = 'brightness(1)'; }, 500);
    });

  }, 6000);
}

// ── ANIMAÇÃO NAS ABAS DE LAYOUT ───────────────────────────────

function setupLayoutTabAnimations() {
  function addClassToLayoutContent() {
    const dashContainer = document.getElementById('dashboard-container');
    if (!dashContainer) return;

    // Observa cliques nos botões de layout
    document.querySelectorAll('.layout-btn, [onclick*="setDashLayout"], [onclick*="layout"]')
      .forEach(btn => {
        if (btn._vtLayoutAnim) return;
        btn._vtLayoutAnim = true;
        btn.addEventListener('click', () => {
          // Remove _vtAnimated de todos os cards para re-animar
          setTimeout(() => {
            document.querySelectorAll('[data-layout-active] .metric-card, ' +
              '#dashboard-container .bg-white, #layout-command .cmd-card').forEach(el => {
              el._vtAnimated = false;
            });
            animateCards(document.getElementById('dashboard-container'));
          }, 50);
        });
      });
  }

  addClassToLayoutContent();
  setTimeout(addClassToLayoutContent, 1500);
}

// ── STATUS DOT PULSANTE ───────────────────────────────────────

function setupStatusDot() {
  function tag() {
    document.querySelectorAll('#sistema-status, [id*="status-dot"], .status-dot, .animate-pulse, ' +
      '[class*="bg-emerald"][class*="rounded-full"]:not([class*="border"])').forEach(el => {
      if (el._vtDot) return;
      el._vtDot = true;
      el.classList.add('vt-status-dot');
    });
  }
  tag(); setTimeout(tag, 1200);
}

// ── OBSERVA NAVEGAÇÃO DE PÁGINAS ──────────────────────────────

function setupPageObserver() {
  // Observa quando containers de página ficam visíveis
  const containers = [
    'dashboard-container', 'kanban-container', 'ordens-container',
    'entrega-container', 'equipe-container', 'estoque-container', 'configuracoes-container'
  ];

  containers.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const isVisible = !el.classList.contains('hidden');
          if (isVisible) {
            el._vtAnimated = false;
            el.querySelectorAll('[data-vt-animated]').forEach(c => { c._vtAnimated = false; });
            setTimeout(() => animateCards(el), 60);
          }
        }
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
  });
}

// ── HOVER AVANÇADO NOS ÍCONES DA SIDEBAR ─────────────────────

function setupSidebarIconAnimations() {
  function tag() {
    document.querySelectorAll('.nav-item, [class*="nav-item"]').forEach(item => {
      if (item._vtNav) return;
      item._vtNav = true;
      const icon = item.querySelector('.material-symbols-rounded');
      if (!icon) return;
      item.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
        icon.style.transform  = 'scale(1.2) rotate(-4deg)';
      });
      item.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      });
      item.addEventListener('click', () => {
        icon.style.transition = 'transform .15s ease';
        icon.style.transform  = 'scale(0.88)';
        setTimeout(() => {
          icon.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
          icon.style.transform  = 'scale(1)';
        }, 150);
      });
    });
  }
  tag(); setTimeout(tag, 1500);
}

// ── BOTÕES DE LAYOUT — efeito de seleção ────────────────────

function setupLayoutButtonEffects() {
  function tag() {
    document.querySelectorAll('.layout-btn').forEach(btn => {
      if (btn._vtLay) return;
      btn._vtLay = true;
      btn.addEventListener('click', function() {
        // Pulsa o ícone do botão clicado
        const icon = this.querySelector('.material-symbols-rounded');
        if (!icon) return;
        icon.style.transition = 'transform .2s cubic-bezier(.34,1.56,.64,1)';
        icon.style.transform = 'scale(1.35)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
      });
    });
  }
  tag(); setTimeout(tag, 1200);
}

// ── NOVA ORDEM — botão especial ───────────────────────────────

function setupNovaOrdemButton() {
  function tag() {
    const btn = document.getElementById('nova-ordem-btn') ||
                document.querySelector('[id*="nova-ordem"]');
    if (!btn || btn._vtNova) return;
    btn._vtNova = true;

    // Shimmer contínuo suave
    btn.style.backgroundSize = '200% 100%';
    btn.style.animation      = 'vt-shimmer 3s linear infinite';

    btn.addEventListener('mouseenter', () => {
      btn.style.animationDuration = '1.2s';
      btn.style.transform         = 'translateY(-2px) scale(1.03)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.animationDuration = '3s';
      btn.style.transform         = '';
    });
  }
  tag(); setTimeout(tag, 800);
}

// ── PROGRESS BARS ─────────────────────────────────────────────

function animateProgressBars(container) {
  (container || document).querySelectorAll('[class*="bg-primary"], [class*="bg-indigo"], [class*="bg-emerald"], [class*="bg-amber"]')
    .forEach(bar => {
      if (!bar.parentElement || bar._vtBar) return;
      const p = bar.parentElement;
      // Só anima se parecer uma barra de progresso (height pequena, parent mais largo)
      if (p.offsetHeight > 16 || bar.offsetWidth < 8) return;
      bar._vtBar = true;
      bar.classList.add('vt-progress-bar');
    });
}

// ── INIT PRINCIPAL ────────────────────────────────────────────

function init() {
  injectCSS();
  setupRipple();
  setupButtonBounce();
  setupStatusDot();

  // Primeiro render
  setTimeout(() => {
    animateCards();
    animateNumbers();
    animateProgressBars();
    setupSidebarIconAnimations();
    setupLayoutButtonEffects();
    setupNovaOrdemButton();
    setupLayoutTabAnimations();
    setupPageObserver();
    startChartCycle();
  }, 400);

  // Re-scan periódico para elementos carregados dinamicamente
  setInterval(() => {
    setupButtonBounce();
    setupSidebarIconAnimations();
    setupLayoutButtonEffects();
    animateNumbers();
  }, 4000);

  // Escuta evento de troca de página do sistema
  document.addEventListener('pageChanged', () => {
    setTimeout(() => {
      animateCards();
      animateProgressBars();
    }, 80);
  });

  console.log('✅ animations.js — micro-interações ativas');
}

// ── START ─────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expõe para uso externo
window.VTAnimations = { animateCards, animateNumbers, startChartCycle };

})();
