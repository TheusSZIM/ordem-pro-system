/**
 * js/theme-obsidian.js — Animações Live do Tema Obsidian
 * Ordem Pro · Vetore Movimentação
 *
 * Adicione no index.html APÓS os outros scripts:
 * <script src="js/theme-obsidian.js"></script>
 */

const ObsidianTheme = (() => {
  const CYCLE = 6000; // ms entre cada atualização

  // ── Feeds de atividade gerados dinamicamente ────────────────
  const feedTemplates = [
    { icon: '✓', color: 'var(--ob-teal)',   fn: () => { const o = _randomOrder(); return { title: `Ordem ${o.lote || '—'} separada`, sub: `${o.operador || 'Operador'} · ${o.produto || '—'}` }; } },
    { icon: '+', color: 'var(--ob-amber)',   fn: () => ({ title: 'Nova ordem criada', sub: `Admin · Lote ${68000 + Math.floor(Math.random()*100)}` }) },
    { icon: '→', color: 'var(--ob-violet)',  fn: () => { const o = _randomOrder(); return { title: `Entrega ${o.lote || '—'} finalizada`, sub: `${o.operador || 'Operador'} · ${o.produto || '—'}` }; } },
    { icon: '↑', color: 'var(--ob-green)',   fn: () => ({ title: 'Eficiência acima de 80%', sub: 'Desempenho excelente hoje' }) },
    { icon: '!', color: 'var(--ob-rose)',    fn: () => ({ title: 'Ordem aguardando há 30min', sub: 'Verificar fila de separação' }) },
  ];

  function _randomOrder() {
    const orders = window.state?.orders || [];
    return orders[Math.floor(Math.random() * orders.length)] || {};
  }

  function _now() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ── Coleta métricas reais do sistema ───────────────────────
  function _getStats() {
    const orders = window.state?.orders || [];
    return {
      total:    orders.length,
      pending:  orders.filter(o => o.status === 'pending').length,
      progress: orders.filter(o => ['progress','in_progress'].includes(o.status)).length,
      done:     orders.filter(o => o.status === 'completed').length,
      delivered:orders.filter(o => o.status === 'delivered').length,
    };
  }

  // ── Efeito glow em cascata nos cards ───────────────────────
  function _glowCards() {
    const selectors = [
      '[id*="stat-"]', '[id*="chart"]', '[id*="efficiency"]',
      '[id*="recent"]', '[id*="quick"]', '[id*="kanban-col"]',
    ];
    selectors.forEach((sel, i) => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.closest('#vito-panel')) {
          setTimeout(() => {
            el.classList.add('ob-glow');
            setTimeout(() => el.classList.remove('ob-glow'), 1400);
          }, i * 60);
        }
      });
    });
  }

  // ── Scanline em elementos de chart ────────────────────────
  function _scanCards() {
    ['dashboard-container', 'kanban-container'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      container.querySelectorAll('canvas, [id*="chart"]').forEach(el => {
        const parent = el.closest('.rounded-xl, .rounded-2xl, [class*="card"]');
        if (!parent || parent.querySelector('.ob-scan-line')) return;
        parent.style.position = 'relative';
        const scan = document.createElement('div');
        scan.className = 'ob-scan-line';
        parent.appendChild(scan);
        setTimeout(() => scan.remove(), 2600);
      });
    });
  }

  // ── Anima números com flip ─────────────────────────────────
  function _flipNumber(el, newVal) {
    if (!el || el.textContent == newVal) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      el.textContent = newVal;
      el.style.transition = 'opacity .35s ease, transform .35s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // ── Atualiza os stat cards com dados reais ─────────────────
  function _updateStats() {
    const s = _getStats();
    const eff = s.total > 0 ? Math.round(((s.done + s.delivered) / s.total) * 100) : 0;

    // Mapa de ids → valores
    const map = {
      // IDs comuns no sistema
      'total-count':     s.total,
      'pending-count':   s.pending,
      'progress-count':  s.progress,
      'done-count':      s.done,
      'delivered-count': s.delivered,
      'distribution-total': s.total,
      'efficiency-value':   eff + '%',
    };

    // Atualiza cada id encontrado
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) _flipNumber(el, val);
    });

    // Atualiza via setText se disponível
    if (typeof setText === 'function') {
      try {
        setText('total-count',    s.total);
        setText('pending-count',  s.pending);
        setText('progress-count', s.progress);
        setText('done-count',     s.done);
      } catch(e) {}
    }

    // Atualiza badges dos stat cards
    _updateBadgeCounts(s);
  }

  // ── Atualiza badges e tab counts ──────────────────────────
  function _updateBadgeCounts(s) {
    // Tab de ordens
    const tabOrders = document.querySelector('[data-tab="orders"] .tbadge, [id*="tab-orders"] .badge');
    if (tabOrders) { tabOrders.textContent = s.total; }

    // Tab de kanban / fila
    const tabKanban = document.querySelector('[data-tab="kanban"] .tbadge, [id*="tab-kanban"] .badge');
    if (tabKanban) { tabKanban.textContent = s.pending; }
  }

  // ── Atualiza o feed de atividade ───────────────────────────
  function _updateFeed() {
    // Gera 3 itens aleatórios do feed
    const shuffled = [...feedTemplates].sort(() => Math.random() - .5).slice(0, 3);
    const items = shuffled.map(t => ({ ...t.fn(), color: t.color, time: _now() }));

    // Busca containers de feed conhecidos
    const feedContainers = document.querySelectorAll(
      '[id*="feed"], [id*="activity"], [class*="feed-list"], [class*="activity-list"]'
    );
    feedContainers.forEach(container => {
      if (container.closest('#vito-panel')) return;
      container.style.opacity = '0';
      container.style.transition = 'opacity .3s';
      setTimeout(() => {
        // Só atualiza se o container tiver itens de feed-style
        if (container.children.length > 0) {
          container.style.opacity = '1';
        }
      }, 300);
    });
  }

  // ── Refresh bar (barra de progresso de 6s) ────────────────
  let _refreshBars = [];

  function _initRefreshBars() {
    // Procura hero cards e adiciona barra
    const heroes = document.querySelectorAll('[id*="stat-total"], [id*="hero-card"]');
    heroes.forEach(el => {
      if (el.querySelector('.ob-refresh-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'ob-refresh-bar';
      el.style.position = 'relative';
      el.appendChild(bar);
      _refreshBars.push(bar);
    });
    _startRefreshBars();
  }

  function _startRefreshBars() {
    _refreshBars.forEach(bar => {
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(0)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = `transform ${CYCLE}ms linear`;
          bar.style.transform = 'scaleX(1)';
        });
      });
    });
  }

  // ── Live dot no header ────────────────────────────────────
  function _addLiveDot() {
    const target = document.getElementById('topbar-live')
      || document.querySelector('[id*="system-status"]')
      || document.querySelector('[id*="current-time"]')?.parentElement;

    if (!target || target.querySelector('.ob-live-dot')) return;
    const dot = document.createElement('span');
    dot.className = 'ob-live-dot';
    dot.style.cssText = 'display:inline-block;width:6px;height:6px;background:var(--ob-teal);border-radius:50%;margin-right:5px;vertical-align:middle;';
    target.prepend(dot);
  }

  // ── Toast de atualização ──────────────────────────────────
  let _toastEl = null;

  function _showToast(title, sub) {
    if (!_toastEl) {
      _toastEl = document.createElement('div');
      _toastEl.style.cssText = `
        position:fixed;bottom:80px;right:24px;z-index:9050;
        background:rgba(8,10,12,0.97);
        border:1px solid rgba(0,212,184,0.22);
        border-radius:10px;padding:10px 14px;
        display:flex;align-items:center;gap:10px;
        font-family:'Inter',sans-serif;font-size:11px;
        color:rgba(220,235,234,.9);
        box-shadow:0 8px 32px rgba(0,0,0,.5);
        backdrop-filter:blur(16px);
        opacity:0;transform:translateY(10px);
        transition:all .35s cubic-bezier(.16,1,.3,1);
        pointer-events:none;max-width:260px;
      `;
      document.body.appendChild(_toastEl);
    }

    _toastEl.innerHTML = `
      <div style="width:22px;height:22px;border-radius:50%;background:rgba(0,212,184,.1);
        border:1px solid rgba(0,212,184,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d4b8" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <div style="font-weight:500;font-size:11px">${title}</div>
        <div style="font-size:9.5px;color:rgba(85,120,112,.9);font-family:'DM Mono',monospace;margin-top:2px">${sub}</div>
      </div>
    `;

    requestAnimationFrame(() => {
      _toastEl.style.opacity = '1';
      _toastEl.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      _toastEl.style.opacity = '0';
      _toastEl.style.transform = 'translateY(8px)';
    }, 3000);
  }

  // ── Ciclo principal ───────────────────────────────────────
  let _cycleCount = 0;

  function _runCycle() {
    _cycleCount++;
    const s = _getStats();

    // Efeitos visuais
    _glowCards();
    setTimeout(_scanCards, 200);

    // Dados
    _updateStats();
    setTimeout(_updateFeed, 400);

    // Refresh bars
    _startRefreshBars();

    // Toast a cada 2 ciclos
    if (_cycleCount % 2 === 0) {
      const toasts = [
        ['Sistema sincronizado', `${s.total} ordens · ${s.pending} aguardando`],
        ['Dados atualizados', `Eficiência ${s.total > 0 ? Math.round(((s.done+s.delivered)/s.total)*100) : 0}% no período`],
        ['Live data · Ordem Pro', `Última sync: ${_now()}`],
      ];
      const [title, sub] = toasts[_cycleCount % toasts.length];
      _showToast(title, sub);
    }
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Aguarda o sistema carregar
    const wait = setInterval(() => {
      if (document.getElementById('dashboard-container')?.innerHTML.length > 100) {
        clearInterval(wait);

        setTimeout(() => {
          _addLiveDot();
          _initRefreshBars();
          _updateStats();

          // Inicia ciclo
          setTimeout(() => {
            _runCycle();
            setInterval(_runCycle, CYCLE);
          }, 2000);

          console.log('✅ Obsidian Theme — animações live iniciadas');
        }, 500);
      }
    }, 300);
  }

  return { init };
})();

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ObsidianTheme.init());
} else {
  ObsidianTheme.init();
}

window.ObsidianTheme = ObsidianTheme;
