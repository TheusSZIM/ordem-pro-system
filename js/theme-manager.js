/**
 * js/theme-manager.js — Sistema de Temas do Ordem Pro
 * Vetore Movimentação · 4 temas · Persiste por usuário
 *
 * INSTALAR: adicionar como ÚLTIMO script no index.html
 * <script src="js/theme-manager.js"></script>
 *
 * Temas disponíveis:
 *  "original"  — Indigo Dark (padrão do sistema)
 *  "premium"   — Dark Premium Orange (Manus)
 *  "neon"      — Dark Neon Gradient (Claude3)
 *  "light"     — Light Colorful (Claude)
 */

const ThemeManager = (() => {

  const KEY = 'vt_theme';

  // ──────────────────────────────────────────────────────────
  // CATÁLOGO DE TEMAS
  // ──────────────────────────────────────────────────────────
  const THEMES = {

    // ── 1. ORIGINAL — mantém o sistema como está ──────────
    original: {
      label:   'Original',
      sub:     'Indigo Dark',
      icon:    '◈',
      preview: ['#0f172a', '#6366f1'],
      fonts:   [],
      css: `
        /* Tema Original — sem alterações */
      `,
    },

    // ── 2. PREMIUM — Light Orange ──────────────────────────────
    premium: {
      label:   'Premium',
      sub:     'Dark Orange',
      icon:    '◆',
      preview: ['#1a1a1a', '#ff6b00'],
      fonts:   ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'],
      css: `
        /* ── Fonte Inter ── */
        body, button, input, select, textarea, td, th, label, p, a,
        span:not(.material-symbols-rounded):not([class*="material"]) {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .material-symbols-rounded,[class*="material-symbols"],[class*="material-icons"] {
          font-family:'Material Symbols Rounded'!important;
        }

        /* ── Acento laranja sobre o light mode do Tailwind ── */
        :root {
          --pm-accent:  #ff6b00;
          --pm-accent2: #ff8c00;
          --pm-dim:     rgba(255,107,0,0.1);
        }

        /* Logo */
        [id*="logo-icon"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          box-shadow: 0 4px 12px rgba(255,107,0,0.3) !important;
        }

        /* Sidebar — nav ativo */
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: rgba(255,107,0,0.1) !important;
          color: #ff6b00 !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          background: #ff6b00 !important; box-shadow: none !important;
        }
        #sidebar a:hover, .nav-item:hover { color: #ff6b00 !important; }

        /* Avatar */
        #user-avatar { background: linear-gradient(135deg,#ff6b00,#ff8c00) !important; box-shadow: 0 4px 12px rgba(255,107,0,0.3) !important; }
        #user-role { color: #ff6b00 !important; background:none !important; -webkit-text-fill-color:#ff6b00 !important; }

        /* Título */
        .text-gradient, #dashboard-title span, .page-title span, h1 span {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Nova Ordem */
        #nova-ordem-btn, button.bg-primary-600, button[class*="bg-primary-6"],
        button[class*="bg-primary-7"], [id*="nova-ordem"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important; box-shadow: 0 6px 20px rgba(255,107,0,0.35) !important;
        }
        #nova-ordem-btn span, button.bg-primary-600 span { color:#fff !important; -webkit-text-fill-color:#fff !important; }

        /* Botões de modo */
        .active-chart-btn { background: #ff6b00 !important; border-color: #ff6b00 !important; }
        .layout-btn.active-layout { background: rgba(255,107,0,0.1) !important; border-color: rgba(255,107,0,0.35) !important; color: #ff6b00 !important; }

        /* Texto acento */
        [class*="text-primary-6"], [class*="text-indigo-6"], [class*="text-indigo-4"] { color: #ff6b00 !important; }
        input:focus, select:focus { border-color: #ff6b00 !important; box-shadow: 0 0 0 3px rgba(255,107,0,0.12) !important; }
        input[type="checkbox"], input[type="radio"] { accent-color: #ff6b00 !important; }

        /* Card total */
        .metric-card[style*="4f46e5"], .metric-card[style*="6366f1"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important; box-shadow: 0 8px 28px rgba(255,107,0,0.3) !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.3); border-radius:3px; }
      `,
      onApply() {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('tm-nondark');
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#64748b';
          Chart.defaults.borderColor = 'rgba(148,163,184,0.2)';
          Chart.defaults.font.family = "'Inter', sans-serif";
        }
        _restoreChartColors();
      },
    },

    // ── 3. NEON — Light Purple/Pink ─────────────────────────────
    neon: {
      label:   'Neon',
      sub:     'Dark Gradient',
      icon:    '◉',
      preview: ['#0a0a12', '#7b2ff7', '#ff6b35'],
      fonts:   ['https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'],
      css: `
        /* ── Fontes Neon ── */
        body, button, input, select, textarea, td, th, label, p, a,
        span:not(.material-symbols-rounded):not([class*="material"]) {
          font-family: 'Space Grotesk', system-ui, sans-serif !important;
        }
        h1, h2, h3, .page-title, [id*="dashboard-title"] {
          font-family: 'Syne', sans-serif !important;
        }
        .material-symbols-rounded,[class*="material-symbols"] { font-family:'Material Symbols Rounded'!important; }

        :root {
          --ne-v1: #7b2ff7;
          --ne-v2: #ff6b35;
          --ne-grad: linear-gradient(135deg,#7b2ff7,#ff6b35);
        }

        /* Logo */
        [id*="logo-icon"] {
          background: var(--ne-grad) !important;
          box-shadow: 0 4px 16px rgba(123,47,247,0.4) !important;
        }

        /* Sidebar ativo */
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: rgba(123,47,247,0.1) !important; color: var(--ne-v1) !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          background: var(--ne-grad) !important; box-shadow: none !important;
        }
        #sidebar a:hover, .nav-item:hover { color: var(--ne-v1) !important; }

        /* Avatar */
        #user-avatar { background: var(--ne-grad) !important; box-shadow: 0 4px 12px rgba(123,47,247,0.3) !important; }
        #user-role {
          background: var(--ne-grad) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Título */
        .text-gradient, #dashboard-title span, .page-title span, h1 span {
          background: var(--ne-grad) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }
        h1[class*="text-2xl"], h1[class*="text-3xl"] { font-family: 'Syne', sans-serif !important; }

        /* Nova Ordem */
        #nova-ordem-btn, button.bg-primary-600, button[class*="bg-primary-6"],
        button[class*="bg-primary-7"], [id*="nova-ordem"] {
          background: var(--ne-grad) !important;
          border: none !important; box-shadow: 0 6px 20px rgba(123,47,247,0.35) !important;
        }
        #nova-ordem-btn span, button.bg-primary-600 span { color:#fff!important; -webkit-text-fill-color:#fff!important; }

        /* Botões */
        .active-chart-btn { background: var(--ne-v1) !important; border-color: var(--ne-v1) !important; }
        .layout-btn.active-layout { background: rgba(123,47,247,0.1) !important; border-color: rgba(123,47,247,0.3) !important; color: var(--ne-v1) !important; }

        /* Textos acento */
        [class*="text-primary-6"], [class*="text-indigo-6"], [class*="text-indigo-4"] { color: var(--ne-v1) !important; }
        input:focus, select:focus { border-color: var(--ne-v1) !important; box-shadow: 0 0 0 3px rgba(123,47,247,0.12) !important; }
        input[type="checkbox"], input[type="radio"] { accent-color: var(--ne-v1) !important; }

        /* Card total */
        .metric-card[style*="4f46e5"], .metric-card[style*="6366f1"] {
          background: var(--ne-grad) !important;
          border: none !important; box-shadow: 0 8px 28px rgba(123,47,247,0.3) !important;
        }

        /* Lote na tabela */
        td:first-child {
          background: var(--ne-grad) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar-thumb { background: rgba(123,47,247,0.3); border-radius:3px; }
      `,
      onApply() {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('tm-nondark');
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#64748b';
          Chart.defaults.borderColor = 'rgba(148,163,184,0.2)';
          Chart.defaults.font.family = "'Space Grotesk', sans-serif";
        }
        _restoreChartColors();
      },
    },

    // ── 4. LIGHT — Claude Light ────────────────────────────────
    light: {
      label:   'Light',
      sub:     'Colorful Clear',
      icon:    '◇',
      preview: ['#f0f2f8', '#ff6b9d', '#c44dff'],
      fonts:   ['https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap'],
      css: `
        /* ── DM Sans ── */
        body, button, input, select, textarea, td, th, label, p, a,
        span:not(.material-symbols-rounded):not([class*="material"]) {
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }
        .material-symbols-rounded,[class*="material-symbols"],[class*="material-icons"] {
          font-family:'Material Symbols Rounded'!important;
          font-weight:normal!important;font-style:normal!important;
        }

        /* ── CSS Vars do claude.html ── */
        :root {
          --clbg:#f0f2f8; --clsurf:#ffffff; --clsurf2:#f7f8fc;
          --clbdr:rgba(200,210,230,0.5); --cltext:#1a1f36; --clmut:#8a93b2;
          --clgrad:linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%);
          --clsh:0 2px 12px rgba(100,120,180,0.07);
          --clsh2:0 6px 28px rgba(100,120,180,0.11);
        }

        /* ── Base light — substitui o cinza Tailwind por nosso #f0f2f8 ── */
        body, .bg-slate-50, .bg-gray-50 { background-color: var(--clbg) !important; }
        body::before, body::after, .bg-grid { display:none!important; }

        /* ── Sidebar 72px ── */
        #sidebar, #sidebar-container>*, aside {
          width:72px!important; min-width:72px!important; max-width:72px!important;
          background:var(--clsurf)!important;
          border-right:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important;
          backdrop-filter:none!important;
        }
        #main-content { margin-left:72px!important; }
        #main-content.sb-mini { margin-left:72px!important; }
        #sb-tab,[id*="sb-tab"] { display:none!important; }

        /* Oculta textos da sidebar */
        #sidebar .logo-text, #sidebar [class*="logo-sub"],
        #sidebar [class*="text-xs"]:not(.material-symbols-rounded),
        #sidebar [class*="nav-section"], #sidebar p,
        #sidebar [class*="text-sm"]:not(.material-symbols-rounded) { display:none!important; }

        /* Nav items */
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background:linear-gradient(135deg,rgba(255,107,157,.12),rgba(160,77,255,.12))!important;
          color:#c44dff!important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          background:var(--clgrad)!important; box-shadow:none!important;
        }
        #sidebar a:hover, .nav-item:hover { color:#c44dff!important; }
        [id*="logo-icon"] { background:var(--clgrad)!important; box-shadow:0 6px 16px rgba(255,107,157,.35)!important; }

        /* ── Header ── */
        header, #topbar, #header-container>* {
          background:var(--clsurf)!important;
          border-bottom:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important; backdrop-filter:none!important;
        }
        #global-search, #search-input {
          background:var(--clsurf2)!important; border:1px solid var(--clbdr)!important;
          color:var(--cltext)!important; border-radius:12px!important;
        }
        #global-search::placeholder { color:var(--clmut)!important; }
        #global-search:focus { border-color:#c44dff!important; box-shadow:0 0 0 3px rgba(196,77,255,.1)!important; }
        #user-avatar { background:var(--clgrad)!important; border:none!important; box-shadow:0 4px 12px rgba(255,107,157,.3)!important; }
        #user-role { color:var(--clmut)!important; background:none!important; -webkit-text-fill-color:var(--clmut)!important; }

        /* ── Título ── */
        .text-gradient, #dashboard-title span, .page-title span, h1 span {
          background:var(--clgrad)!important;
          -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important;
        }

        /* ── Nova Ordem ── */
        #nova-ordem-btn, button.bg-primary-600, button[class*="bg-primary-6"],
        button[class*="bg-primary-7"], [id*="nova-ordem"] {
          background:var(--clgrad)!important; border:none!important;
          box-shadow:0 6px 20px rgba(255,107,157,.35)!important; border-radius:14px!important;
        }
        #nova-ordem-btn span, button.bg-primary-600 span { color:#fff!important; -webkit-text-fill-color:#fff!important; }

        /* Botões */
        .active-chart-btn { background:var(--clgrad)!important; border-color:transparent!important; color:#fff!important; }
        .layout-btn.active-layout { background:rgba(196,77,255,.1)!important; border-color:rgba(196,77,255,.35)!important; color:#c44dff!important; }
        [class*="text-primary-6"] { color:#c44dff!important; }
        input:focus,select:focus { border-color:#c44dff!important; box-shadow:0 0 0 3px rgba(196,77,255,.1)!important; }

        /* ── Metric cards ── */
        .metric-card { background:var(--clsurf)!important; border:1px solid var(--clbdr)!important; box-shadow:var(--clsh)!important; border-radius:20px!important; }
        .metric-card:hover { transform:translateY(-2px) scale(1.01)!important; box-shadow:var(--clsh2)!important; }
        #stat-a-separar-wrap h3, #stat-em-separacao-wrap h3, #stat-concluidas-hoje-wrap h3 {
          color:var(--cltext)!important; -webkit-text-fill-color:var(--cltext)!important;
          background:none!important; font-size:2rem!important; font-weight:800!important;
        }
        #stat-total-wrap h3 { color:#fff!important; -webkit-text-fill-color:#fff!important; background:none!important; font-size:2rem!important; font-weight:800!important; }
        .metric-card[style*="4f46e5"],.metric-card[style*="6366f1"] {
          background:var(--clgrad)!important; border:none!important; box-shadow:0 8px 28px rgba(255,107,157,.3)!important;
        }
        .metric-card[style*="4f46e5"] * { color:rgba(255,255,255,.9)!important; -webkit-text-fill-color:rgba(255,255,255,.9)!important; }
        .metric-card[style*="4f46e5"] .rounded-2xl { background:rgba(255,255,255,.2)!important; }

        /* ── Cards brancos ── */
        .bg-white, .bg-white.rounded-2xl, .bg-white.rounded-xl { background-color:var(--clsurf)!important; }
        .rounded-2xl, .rounded-xl { border-color:var(--clbdr)!important; }

        /* ── Tabela ── */
        td:first-child { background:var(--clgrad)!important; -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important; font-weight:700!important; }

        /* ── Cmd cards (layout command) ── */
        #layout-command .cmd-card { background:var(--clsurf)!important; border:1px solid var(--clbdr)!important; box-shadow:var(--clsh)!important; }
        #layout-command .cmd-card::before { display:none!important; }
        #layout-command .cmd-total-card { background:var(--clgrad)!important; border:none!important; box-shadow:0 8px 28px rgba(255,107,157,.3)!important; }
        #layout-command .cmd-total-card * { color:rgba(255,255,255,.9)!important; }
        #layout-command .cmd-number { color:#fff!important; }
        #layout-command .cmd-trend { background:rgba(255,255,255,.2)!important; color:#fff!important; }

        /* ── Dots legenda ── */
        .bg-amber-400.rounded-full, span.bg-amber-400 { background-color:#ff6b9d!important; }
        .bg-blue-500.rounded-full, span.bg-blue-500 { background-color:#a29bfe!important; }

        /* ── Scrollbar ── */
        *{scrollbar-color:#dde3f0 transparent;}
        ::-webkit-scrollbar-thumb{background:#dde3f0;border-radius:3px;}
      `,
      onApply() {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('tm-nondark');

        // Chart.js defaults light
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#8a93b2';
          Chart.defaults.borderColor = 'rgba(200,210,230,0.3)';
          Chart.defaults.font.family = "'DM Sans', sans-serif";
        }

        // Patch cores dos charts — rosa/roxo
        const PINK='#ff6b9d', PINK_A='rgba(255,107,157,0.15)';
        const PURP='#a29bfe', PURP_A='rgba(162,155,254,0.14)';
        let _t=0;
        function patch() {
          if (typeof Chart==='undefined') return;
          let ok=false;
          ['performanceChart','performanceChart2','performanceChart3'].forEach(id=>{
            const ch=typeof Chart.getChart==='function'
              ?Chart.getChart(id)
              :Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
            if(!ch||!ch.data||!ch.data.datasets||!ch.data.datasets.length)return;
            const ds=ch.data.datasets;
            if(ds[0]){ds[0].borderColor=PINK;ds[0].backgroundColor=PINK_A;ds[0].pointBackgroundColor=PINK;ds[0].pointBorderColor='#fff';ds[0].pointBorderWidth=2;}
            if(ds[1]){ds[1].borderColor=PURP;ds[1].backgroundColor=PURP_A;ds[1].pointBackgroundColor=PURP;ds[1].pointBorderColor='#fff';ds[1].pointBorderWidth=2;}
            try{
              ['x','y'].forEach(ax=>{if(ch.options.scales&&ch.options.scales[ax]){ch.options.scales[ax].grid.color='rgba(200,210,230,0.2)';ch.options.scales[ax].ticks.color='#8a93b2';}});
              if(ch.options.plugins){if(ch.options.plugins.legend?.labels)ch.options.plugins.legend.labels.color='#8a93b2';if(ch.options.plugins.tooltip){ch.options.plugins.tooltip.backgroundColor='rgba(255,255,255,.96)';ch.options.plugins.tooltip.titleColor='#1a1f36';ch.options.plugins.tooltip.bodyColor='#8a93b2';ch.options.plugins.tooltip.borderColor='rgba(200,210,230,.6)';ch.options.plugins.tooltip.borderWidth=1;}}
            }catch(e){}
            ch.update('none');ok=true;
          });
          document.querySelectorAll('.bg-amber-400.rounded-full,span.bg-amber-400').forEach(el=>el.style.setProperty('background-color',PINK,'important'));
          document.querySelectorAll('.bg-blue-500.rounded-full,span.bg-blue-500').forEach(el=>el.style.setProperty('background-color',PURP,'important'));
          if(!ok&&_t++<15)setTimeout(patch,350);
        }
        if(window.buildWeekChart&&!window._tm_origBWC){window._tm_origBWC=window.buildWeekChart;window.buildWeekChart=function(){window._tm_origBWC();_t=0;setTimeout(patch,100);};}
        if(window.updateCharts&&!window._tm_origUC){window._tm_origUC=window.updateCharts;window.updateCharts=function(){window._tm_origUC();_t=0;setTimeout(patch,120);};}
        [200,600,1400,3000].forEach(d=>setTimeout(patch,d));
        if(window._tm_obs)window._tm_obs.disconnect();
        window._tm_obs=new MutationObserver(()=>{_t=0;setTimeout(patch,150);});
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});

        // Sidebar fix
        function fixSidebar(){
          const sb=document.getElementById('sidebar');
          const main=document.getElementById('main-content');
          if(sb){sb.style.setProperty('width','72px','important');sb.style.setProperty('min-width','72px','important');sb.style.setProperty('max-width','72px','important');}
          if(main)main.style.setProperty('margin-left','72px','important');
        }
        fixSidebar();setTimeout(fixSidebar,500);
      },
    },
  };

  // ──────────────────────────────────────────────────────────
  // CORE  };

  // ──────────────────────────────────────────────────────────
  // CORE  };

  // ──────────────────────────────────────────────────────────
  // CORE  };

  // ──────────────────────────────────────────────────────────
  // CORE  };

  // ──────────────────────────────────────────────────────────
  // CORE  };

  // ──────────────────────────────────────────────────────────
  // CORE
  // ──────────────────────────────────────────────────────────
  let _current  = 'original';
  let _styleEl  = null;
  let _panelOpen = false;

  function _uid() {
    try {
      const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
      return s?.user?.id || 'guest';
    } catch { return 'guest'; }
  }

  function _loadFonts(urls) {
    urls.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = url;
        document.head.appendChild(l);
      }
    });
  }

  function apply(id, save = true) {
    const t = THEMES[id];
    if (!t) return;
    _current = id;

    // Carrega fontes
    if (t.fonts?.length) _loadFonts(t.fonts);

    // Injeta CSS
    if (!_styleEl) {
      _styleEl = document.createElement('style');
      _styleEl.id = 'tm-active';
      document.head.appendChild(_styleEl);
    }
    _styleEl.textContent = t.css;

    // Executa JS do tema (ex: patcher de gráficos)
    if (t.onApply) {
      try { t.onApply(); } catch(e) { console.warn('[ThemeManager] onApply:', e); }
    } else {
      // Restaura Chart.js para defaults do tema original ao sair
      _restoreCharts();
    }

    // Salva por usuário
    if (save) localStorage.setItem(KEY + '_' + _uid(), id);

    _updatePanel();
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: id } }));
    console.log('🎨 Tema:', t.label);
  }

  // Restaura ao sair de temas não-dark (Premium/Neon/Light)
  function _restoreCharts() {
    try {
      // Re-ativa dark mode do Tailwind
      document.documentElement.classList.add('dark');
      document.body.classList.remove('tm-nondark','tm-light');

      // Desconecta observer
      if (window._tm_obs) { window._tm_obs.disconnect(); window._tm_obs = null; }

      // Restaura funções de chart interceptadas
      if (window._tm_origBWC) { window.buildWeekChart = window._tm_origBWC; window._tm_origBWC = null; }
      if (window._tm_origBAC) { window.buildAnalyticsChart = window._tm_origBAC; window._tm_origBAC = null; }
      if (window._tm_origUC)  { window.updateCharts = window._tm_origUC; window._tm_origUC = null; }

      if (typeof Chart !== 'undefined') {
        // Restaura defaults escuros
        Chart.defaults.color       = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(148,163,184,0.12)';
        Chart.defaults.font.family = '"Plus Jakarta Sans", system-ui, sans-serif';
        // Rebuilda charts com cores originais
        if (typeof buildWeekChart === 'function') buildWeekChart();
        if (typeof buildPieChart  === 'function') buildPieChart();
      }

      // Restaura dots de legenda HTML
      document.querySelectorAll('.bg-amber-400').forEach(el => { el.style.backgroundColor = ''; });
      document.querySelectorAll('.bg-blue-500').forEach(el  => { el.style.backgroundColor = ''; });

      // Restaura sidebar
      const sb   = document.getElementById('sidebar');
      const main = document.getElementById('main-content');
      if (sb)   { sb.style.removeProperty('width'); sb.style.removeProperty('min-width'); sb.style.removeProperty('max-width'); }
      if (main) { main.style.removeProperty('margin-left'); }
    } catch(e) {}
  }

  // Restaura cores padrão dos charts (sem mudar dark mode)
  function _restoreChartColors() {
    if (typeof Chart === 'undefined') return;
    if (typeof buildWeekChart === 'function') setTimeout(buildWeekChart, 100);
    if (typeof buildPieChart  === 'function') setTimeout(buildPieChart, 120);
  }

  // Aplica paleta de cores em todos os charts ativos
  function _patchCharts(palette) {
    if (typeof Chart === 'undefined') {
      // Chart.js ainda não carregou, tenta depois
      setTimeout(() => _patchCharts(palette), 500);
      return;
    }
    try {
      const instances = Object.values(Chart.instances || {});
      instances.forEach(chart => {
        // Guarda original na primeira vez
        if (!chart._tm_original) {
          chart._tm_original = chart.data.datasets.map(ds => ({
            borderColor:          ds.borderColor,
            backgroundColor:      ds.backgroundColor,
            pointBackgroundColor: ds.pointBackgroundColor,
          }));
        }
        chart.data.datasets.forEach((ds, i) => {
          const p = palette[i % palette.length];
          if (!p) return;
          ds.borderColor     = p.line;
          ds.backgroundColor = p.area;
          if (p.point) ds.pointBackgroundColor = p.point;
        });
        // Se for line chart, suaviza área
        if (chart.config.type === 'line') {
          chart.data.datasets.forEach(ds => { ds.fill = true; });
        }
        chart.update('none');
      });
    } catch(e) { console.warn('[ThemeManager] patchCharts:', e); }
  }

  // Intercepta criação futura de charts
  function _interceptChartCreation(palette) {
    if (typeof Chart === 'undefined') return;
    if (Chart._tm_patched) return;
    Chart._tm_patched = true;
    const OrigChart = Chart;
    // Armazena paleta globalmente para uso no afterInit
    Chart._tm_palette = palette;
    // Plugin global que aplica cores após init
    Chart.register({
      id: 'tm-color-plugin',
      afterInit(chart) {
        const pal = Chart._tm_palette;
        if (!pal) return;
        chart._tm_original = chart.data.datasets.map(ds => ({
          borderColor:          ds.borderColor,
          backgroundColor:      ds.backgroundColor,
          pointBackgroundColor: ds.pointBackgroundColor,
        }));
        chart.data.datasets.forEach((ds, i) => {
          const p = pal[i % pal.length];
          if (!p) return;
          ds.borderColor     = p.line;
          ds.backgroundColor = p.area;
          if (p.point) ds.pointBackgroundColor = p.point;
          if (chart.config.type === 'line') ds.fill = true;
        });
      }
    });
  }

  function loadSaved() {
    const saved = localStorage.getItem(KEY + '_' + _uid()) || 'original';
    apply(saved, false);
  }

  // ──────────────────────────────────────────────────────────
  // PAINEL DE SELEÇÃO
  // ──────────────────────────────────────────────────────────
  function _createPanel() {
    if (document.getElementById('tm-root')) return;

    const style = document.createElement('style');
    style.textContent = `
      #tm-fab{
        position:fixed;top:12px;right:340px;z-index:9300;
        height:36px;padding:0 14px;border-radius:10px;border:none;cursor:pointer;
        background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.12);
        box-shadow:0 2px 12px rgba(0,0,0,0.2);
        display:flex;align-items:center;gap:7px;
        transition:all .2s;
        font-family:system-ui,sans-serif;font-size:11px;font-weight:600;
        color:rgba(255,255,255,0.7);letter-spacing:.02em;
        white-space:nowrap;
      }
      #tm-fab:hover{background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.95);box-shadow:0 4px 18px rgba(0,0,0,0.3)}
      #tm-fab svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.8;fill:none;flex-shrink:0}
      #tm-fab-swatch{width:14px;height:14px;border-radius:4px;flex-shrink:0;border:1px solid rgba(255,255,255,0.2)}

      /* Versão light do FAB */
      body.tm-light #tm-fab{
        background:rgba(255,255,255,0.9);
        border:1px solid rgba(200,210,230,0.6);
        color:#1a1f36;
        box-shadow:0 2px 12px rgba(100,120,180,0.12);
      }
      body.tm-light #tm-fab:hover{
        background:#ffffff;
        box-shadow:0 4px 18px rgba(100,120,180,0.18);
      }

      #tm-panel{
        position:fixed;top:56px;right:340px;z-index:9299;
        width:230px;background:rgba(12,10,24,0.98);
        border:1px solid rgba(255,255,255,0.1);border-radius:16px;
        padding:16px;backdrop-filter:blur(24px);
        box-shadow:0 20px 60px rgba(0,0,0,0.6);
        transition:opacity .25s,transform .25s;
      }
      #tm-panel.tm-hide{opacity:0;transform:translateY(-6px);pointer-events:none}

      #tm-header{
        display:flex;align-items:center;justify-content:space-between;
        margin-bottom:14px;
      }
      #tm-title{
        font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
        color:rgba(255,255,255,0.3);font-family:system-ui,sans-serif;
      }
      #tm-x{cursor:pointer;color:rgba(255,255,255,0.25);font-size:16px;line-height:1;
        transition:color .15s;background:none;border:none;padding:0;}
      #tm-x:hover{color:rgba(255,255,255,0.6)}

      .tm-row{
        display:flex;align-items:center;gap:11px;padding:9px 10px;
        border-radius:10px;cursor:pointer;border:1px solid transparent;
        transition:all .2s;margin-bottom:5px;
      }
      .tm-row:last-child{margin-bottom:0}
      .tm-row:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.08)}
      .tm-row.tm-on{background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.14)}

      .tm-swatch{
        width:36px;height:36px;border-radius:9px;flex-shrink:0;
        display:flex;align-items:center;justify-content:center;
        border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden;
      }
      .tm-check{
        position:absolute;inset:0;background:rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      }
      .tm-check svg{width:14px;height:14px;stroke:#fff;stroke-width:2.5;fill:none}

      .tm-name{font-size:12px;font-weight:600;color:rgba(255,255,255,0.88);font-family:system-ui,sans-serif;letter-spacing:-.01em}
      .tm-sub {font-size:10px;color:rgba(255,255,255,0.28);font-family:system-ui,sans-serif;margin-top:1px}

      #tm-footer{
        margin-top:12px;padding-top:10px;
        border-top:1px solid rgba(255,255,255,0.07);
        font-size:8.5px;color:rgba(255,255,255,0.18);
        text-align:center;font-family:system-ui,sans-serif;letter-spacing:.08em;
      }
    `;
    document.head.appendChild(style);

    // FAB
    const fab = document.createElement('button');
    fab.id = 'tm-fab'; fab.title = 'Trocar tema';
    fab.innerHTML = `
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
      <div id="tm-fab-swatch"></div>
      <span id="tm-fab-label">Tema</span>
    `;
    fab.onclick = () => togglePanel();

    // Painel
    const panel = document.createElement('div');
    panel.id = 'tm-panel'; panel.classList.add('tm-hide');
    panel.innerHTML = `
      <div id="tm-header">
        <span id="tm-title">APARÊNCIA</span>
        <button id="tm-x" onclick="ThemeManager.togglePanel()">✕</button>
      </div>
      <div id="tm-list"></div>
      <div id="tm-footer">ORDEM PRO · VETORE</div>
    `;

    const root = document.createElement('div');
    root.id = 'tm-root';
    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);
    _updatePanel();
  }

  function _updatePanel() {
    const list = document.getElementById('tm-list');
    if (!list) return;

    list.innerHTML = Object.entries(THEMES).map(([id, t]) => {
      const colors = t.preview;
      const grad = colors.length === 3
        ? `linear-gradient(135deg,${colors[0]} 30%,${colors[1]} 70%,${colors[2]} 120%)`
        : `linear-gradient(135deg,${colors[0]} 40%,${colors[1]} 130%)`;
      const active = id === _current;
      return `
        <div class="tm-row ${active ? 'tm-on' : ''}"
             onclick="ThemeManager.apply('${id}')"
             style="${active ? `border-color:rgba(255,255,255,0.2)` : ''}">
          <div class="tm-swatch" style="background:${grad}">
            ${active ? `<div class="tm-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>` : ''}
          </div>
          <div>
            <div class="tm-name" style="${active ? 'color:#fff' : ''}">${t.label}</div>
            <div class="tm-sub">${t.sub}</div>
          </div>
        </div>`;
    }).join('');

    // Atualiza swatch e label do FAB
    const t = THEMES[_current];
    if (t) {
      const swatch = document.getElementById('tm-fab-swatch');
      const label  = document.getElementById('tm-fab-label');
      const colors = t.preview;
      const grad   = colors.length === 3
        ? `linear-gradient(135deg,${colors[0]} 30%,${colors[1]} 70%,${colors[2]} 120%)`
        : `linear-gradient(135deg,${colors[0]} 40%,${colors[1]} 130%)`;
      if (swatch) swatch.style.background = grad;
      if (label)  label.textContent = t.label;
    }

    // Adiciona classe ao body para estilizar FAB no tema light
    document.body.classList.toggle('tm-light', _current === 'light');
  }

  function togglePanel() {
    _panelOpen = !_panelOpen;
    document.getElementById('tm-panel')?.classList.toggle('tm-hide', !_panelOpen);
  }

  // ──────────────────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────────────────
  function init() {
    const wait = setInterval(() => {
      if (document.body) {
        clearInterval(wait);
        loadSaved();
        setTimeout(_createPanel, 1000);
        console.log('✅ ThemeManager iniciado · 4 temas disponíveis');
      }
    }, 100);
  }

  return { init, apply, togglePanel, THEMES };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
window.ThemeManager = ThemeManager;
