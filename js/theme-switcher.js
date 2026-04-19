/**
 * js/theme-switcher.js — Seletor de Temas do Ordem Pro
 * Gerencia Obsidian · Phantom · Ember + animações live
 *
 * Adicione no index.html como ÚLTIMO script:
 * <script src="js/theme-switcher.js"></script>
 */

const ThemeSwitcher = (() => {

  // ── Catálogo de temas ──────────────────────────────────────
  const THEMES = {
    obsidian: {
      name:    'Obsidian',
      sub:     'Dark Teal',
      css:     'css/theme-obsidian.css',
      js:      'js/theme-obsidian.js',
      accent:  '#00d4b8',
      accent2: '#00a896',
      preview: 'linear-gradient(135deg,#06080a 50%,#00a896 150%)',
      icon:    '◈',
    },
    phantom: {
      name:    'Phantom',
      sub:     'Purple · Pink',
      css:     'css/theme-phantom.css',
      js:      'js/theme-phantom.js',
      accent:  '#a855f7',
      accent2: '#ec4899',
      preview: 'linear-gradient(135deg,#070410 40%,#a855f7 120%,#ec4899 200%)',
      icon:    '◉',
    },
    ember: {
      name:    'Ember',
      sub:     'Dark Orange',
      css:     'css/theme-ember.css',
      js:      null,
      accent:  '#f97316',
      accent2: '#ea580c',
      preview: 'linear-gradient(135deg,#060604 50%,#ea580c 160%)',
      icon:    '◆',
    },
    classic: {
      name:    'Classic',
      sub:     'Indigo · Original',
      css:     null,
      js:      null,
      accent:  '#6366f1',
      accent2: '#4f46e5',
      preview: 'linear-gradient(135deg,#0f172a 50%,#4f46e5 150%)',
      icon:    '◇',
    },
  };

  const STORAGE_KEY = 'ordem_pro_theme';
  let   _current    = 'obsidian';
  let   _jsLoaded   = {};
  let   _panelOpen  = false;

  // ── CSS dinâmico ───────────────────────────────────────────
  function _loadCSS(href) {
    // Remove temas anteriores
    document.querySelectorAll('link[data-theme]').forEach(l => l.remove());
    if (!href) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = href;
    link.setAttribute('data-theme', 'true');
    document.head.appendChild(link);
  }

  function _loadJS(src) {
    if (!src || _jsLoaded[src]) return;
    const s = document.createElement('script');
    s.src = src; s.defer = true;
    document.head.appendChild(s);
    _jsLoaded[src] = true;
  }

  // ── Aplica tema ────────────────────────────────────────────
  function apply(themeId, save = true) {
    const theme = THEMES[themeId];
    if (!theme) return;

    _current = themeId;
    _loadCSS(theme.css);
    if (theme.js) _loadJS(theme.js);
    if (save) {
      try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        const uid = s?.user?.id || 'guest';
        localStorage.setItem(STORAGE_KEY + '_' + uid, themeId);
      } catch(e) { localStorage.setItem(STORAGE_KEY, themeId); }
    }

    // Atualiza painel se aberto
    _updatePanel();

    // Dispara evento
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
    console.log('🎨 Tema aplicado:', theme.name);
  }

  // ── Carrega tema salvo ────────────────────────────────────
  function loadSaved() {
    try {
      const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
      const uid = s?.user?.id || 'guest';
      const saved = localStorage.getItem(STORAGE_KEY + '_' + uid)
                 || localStorage.getItem(STORAGE_KEY)
                 || 'obsidian';
      apply(saved, false);
    } catch(e) { apply('obsidian', false); }
  }

  // ── CSS do painel ─────────────────────────────────────────
  const PANEL_CSS = `
#ts-fab{
  position:fixed;bottom:24px;left:24px;z-index:9200;
  width:40px;height:40px;border-radius:12px;
  background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.1);
  backdrop-filter:blur(12px);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;box-shadow:0 4px 16px rgba(0,0,0,.4);
}
#ts-fab:hover{border-color:rgba(255,255,255,.25);transform:scale(1.05)}
#ts-fab svg{width:18px;height:18px;stroke:rgba(255,255,255,.7);stroke-width:1.8;fill:none;transition:stroke .2s}
#ts-fab:hover svg{stroke:rgba(255,255,255,.95)}

#ts-panel{
  position:fixed;bottom:74px;left:24px;z-index:9199;
  width:220px;background:rgba(8,6,18,.97);
  border:1px solid rgba(168,85,247,.2);border-radius:14px;
  padding:14px;overflow:hidden;
  backdrop-filter:blur(20px);
  box-shadow:0 16px 48px rgba(0,0,0,.6);
  transition:opacity .25s,transform .25s;
}
#ts-panel.ts-hidden{opacity:0;transform:translateY(8px);pointer-events:none}

#ts-panel-title{
  font-family:'JetBrains Mono','DM Mono',monospace;
  font-size:8.5px;color:rgba(255,255,255,.3);
  letter-spacing:.14em;text-transform:uppercase;
  font-weight:600;margin-bottom:12px;
  display:flex;align-items:center;justify-content:space-between;
}
#ts-close{cursor:pointer;opacity:.5;transition:opacity .15s;font-size:14px;line-height:1}
#ts-close:hover{opacity:1}

.ts-item{
  display:flex;align-items:center;gap:10px;
  padding:9px 10px;border-radius:9px;cursor:pointer;
  border:1px solid transparent;transition:all .2s;margin-bottom:5px;
}
.ts-item:last-child{margin-bottom:0}
.ts-item:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
.ts-item.active{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)}

.ts-swatch{
  width:34px;height:34px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;position:relative;overflow:hidden;
  border:1px solid rgba(255,255,255,.1);
}
.ts-swatch-active{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);
}
.ts-swatch-active svg{width:13px;height:13px;stroke:#fff;stroke-width:2.5;fill:none}

.ts-info{}
.ts-name{font-size:11.5px;font-weight:600;color:rgba(255,255,255,.9);font-family:'Sora','DM Sans',sans-serif;letter-spacing:-.01em}
.ts-sub{font-family:'JetBrains Mono','DM Mono',monospace;font-size:8px;color:rgba(255,255,255,.3);letter-spacing:.05em;margin-top:1px}

.ts-divider{height:1px;background:rgba(255,255,255,.06);margin:8px 0}
.ts-footer{font-family:'JetBrains Mono','DM Mono',monospace;font-size:8px;color:rgba(255,255,255,.2);text-align:center;letter-spacing:.06em;margin-top:8px}
`;

  // ── Cria painel ────────────────────────────────────────────
  function _createPanel() {
    if (document.getElementById('ts-panel')) return;

    const style = document.createElement('style');
    style.textContent = PANEL_CSS;
    document.head.appendChild(style);

    // FAB
    const fab = document.createElement('button');
    fab.id = 'ts-fab'; fab.title = 'Trocar tema';
    fab.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`;
    fab.onclick = () => togglePanel();
    document.body.appendChild(fab);

    // Painel
    const panel = document.createElement('div');
    panel.id = 'ts-panel';
    panel.classList.add('ts-hidden');
    panel.innerHTML = `
      <div id="ts-panel-title">
        APARÊNCIA
        <span id="ts-close" onclick="ThemeSwitcher.togglePanel()">✕</span>
      </div>
      <div id="ts-items"></div>
      <div class="ts-divider"></div>
      <div class="ts-footer">ORDEM PRO · VETORE</div>
    `;
    document.body.appendChild(panel);
    _updatePanel();
  }

  function _updatePanel() {
    const container = document.getElementById('ts-items');
    if (!container) return;

    container.innerHTML = Object.entries(THEMES).map(([id, t]) => `
      <div class="ts-item ${id === _current ? 'active' : ''}"
           onclick="ThemeSwitcher.apply('${id}')"
           style="${id === _current ? `border-color:${t.accent}33` : ''}">
        <div class="ts-swatch" style="background:${t.preview}">
          ${id === _current
            ? `<div class="ts-swatch-active"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>`
            : ''}
        </div>
        <div class="ts-info">
          <div class="ts-name" style="${id === _current ? `color:${t.accent}` : ''}">${t.name}</div>
          <div class="ts-sub">${t.sub}</div>
        </div>
      </div>
    `).join('');
  }

  // ── Toggle painel ─────────────────────────────────────────
  function togglePanel() {
    const panel = document.getElementById('ts-panel');
    if (!panel) return;
    _panelOpen = !_panelOpen;
    panel.classList.toggle('ts-hidden', !_panelOpen);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    const wait = setInterval(() => {
      if (document.body) {
        clearInterval(wait);
        loadSaved();
        setTimeout(_createPanel, 800);
        console.log('🎨 ThemeSwitcher iniciado');
      }
    }, 100);
  }

  return { init, apply, togglePanel, THEMES };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeSwitcher.init());
} else {
  ThemeSwitcher.init();
}
window.ThemeSwitcher = ThemeSwitcher;
