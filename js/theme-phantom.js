/**
 * js/theme-phantom.js — Animações Live do Tema Phantom
 * Ordem Pro · Vetore Movimentação
 */

const PhantomTheme = (() => {
  const CYCLE = 6000;
  let _toastEl = null;
  let _cycleCount = 0;
  let _refreshBars = [];

  function _getStats() {
    const o = window.state?.orders || [];
    return {
      total: o.length, pending: o.filter(x => x.status === 'pending').length,
      progress: o.filter(x => ['progress','in_progress'].includes(x.status)).length,
      done: o.filter(x => x.status === 'completed').length,
      delivered: o.filter(x => x.status === 'delivered').length,
    };
  }

  function _flipNumber(el, val) {
    if (!el || el.textContent == val) return;
    el.style.opacity = '0'; el.style.transform = 'translateY(-6px)'; el.style.transition = 'none';
    requestAnimationFrame(() => {
      el.textContent = val;
      el.style.transition = 'opacity .35s ease, transform .35s ease';
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    });
  }

  function _glowCards() {
    document.querySelectorAll('.rounded-xl, .rounded-2xl, [class*="card"]').forEach((el, i) => {
      if (el.closest('#vito-panel') || el.closest('#ts-panel')) return;
      setTimeout(() => {
        el.classList.add('ph-glow');
        setTimeout(() => el.classList.remove('ph-glow'), 1400);
      }, i * 50);
    });
  }

  function _scanCards() {
    document.querySelectorAll('canvas, [id*="chart"]').forEach(el => {
      const parent = el.closest('.rounded-xl, .rounded-2xl, [class*="card"]');
      if (!parent || parent.querySelector('.ph-scan-line')) return;
      parent.style.position = 'relative';
      const scan = document.createElement('div');
      scan.className = 'ph-scan-line'; parent.appendChild(scan);
      setTimeout(() => scan.remove(), 2600);
    });
  }

  function _updateStats() {
    const s = _getStats();
    const map = { 'total-count': s.total, 'pending-count': s.pending, 'progress-count': s.progress, 'done-count': s.done, 'delivered-count': s.delivered };
    Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) _flipNumber(el, val); });
    if (typeof setText === 'function') { try { setText('total-count', s.total); setText('pending-count', s.pending); } catch(e){} }
  }

  function _showToast(title, sub) {
    if (!_toastEl) {
      _toastEl = document.createElement('div');
      _toastEl.style.cssText = `position:fixed;bottom:80px;right:24px;z-index:9050;background:rgba(9,5,22,.97);border:1px solid rgba(168,85,247,.25);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;font-family:'Sora',sans-serif;font-size:11px;color:#ede9ff;box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(16px);opacity:0;transform:translateY(10px);transition:all .35s cubic-bezier(.16,1,.3,1);pointer-events:none;max-width:260px;`;
      document.body.appendChild(_toastEl);
    }
    _toastEl.innerHTML = `
      <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(236,72,153,.15));border:1px solid rgba(168,85,247,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div><div style="font-weight:600;font-size:11px">${title}</div><div style="font-size:9px;color:#6b5a8a;font-family:'JetBrains Mono',monospace;margin-top:2px">${sub}</div></div>`;
    requestAnimationFrame(() => { _toastEl.style.opacity = '1'; _toastEl.style.transform = 'translateY(0)'; });
    setTimeout(() => { _toastEl.style.opacity = '0'; _toastEl.style.transform = 'translateY(8px)'; }, 3000);
  }

  function _startRefreshBars() {
    _refreshBars.forEach(bar => {
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)';
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `transform ${CYCLE}ms linear`; bar.style.transform = 'scaleX(1)'; }));
    });
  }

  function _initRefreshBars() {
    document.querySelectorAll('[id*="stat-total"], [id*="hero-card"]').forEach(el => {
      if (el.querySelector('.ph-refresh-bar')) return;
      const bar = document.createElement('div'); bar.className = 'ph-refresh-bar';
      el.style.position = 'relative'; el.appendChild(bar); _refreshBars.push(bar);
    });
    _startRefreshBars();
  }

  function _runCycle() {
    _cycleCount++;
    const s = _getStats();
    _glowCards();
    setTimeout(_scanCards, 200);
    _updateStats();
    _startRefreshBars();
    if (_cycleCount % 2 === 0) {
      const eff = s.total > 0 ? Math.round(((s.done + s.delivered) / s.total) * 100) : 0;
      const msgs = [
        ['Sistema sincronizado', `${s.total} ordens · ${s.pending} na fila`],
        [`Eficiência ${eff}%`, 'Dados atualizados agora'],
        ['Live · Ordem Pro', `Sync: ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`],
      ];
      const [t, sub] = msgs[_cycleCount % msgs.length];
      _showToast(t, sub);
    }
  }

  function init() {
    const wait = setInterval(() => {
      if (document.getElementById('dashboard-container')?.innerHTML.length > 100) {
        clearInterval(wait);
        setTimeout(() => {
          _initRefreshBars();
          _updateStats();
          setTimeout(() => { _runCycle(); setInterval(_runCycle, CYCLE); }, 2000);
          console.log('✅ Phantom Theme — animações live iniciadas');
        }, 600);
      }
    }, 300);
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PhantomTheme.init());
} else {
  PhantomTheme.init();
}
window.PhantomTheme = PhantomTheme;
