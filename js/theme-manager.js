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

    // ── 2. PREMIUM — Dark Premium Orange (Manus) ───────────────
    premium: {
      label:   'Premium',
      sub:     'Dark Orange',
      icon:    '◆',
      preview: ['#1a1a1a', '#ff6b00'],
      fonts:   ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'],
      css: `
        /* ── Inter ── */
        body, button, input, select, textarea, td, th, label, p, a,
        span:not(.material-symbols-rounded):not([class*="material"]) {
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        .material-symbols-rounded,[class*="material-symbols"],[class*="material-icons"] {
          font-family:'Material Symbols Rounded'!important;
          font-weight:normal!important; font-style:normal!important;
        }

        /* ── Variáveis Manus ── */
        :root {
          --pm-bg:    #0f0f0f;
          --pm-bg1:   #1a1a1a;
          --pm-bg2:   #252525;
          --pm-bg3:   #2a2a2a;
          --pm-bdr:   #3a3a3a;
          --pm-acc:   #ff6b00;
          --pm-acc2:  #ff8c00;
          --pm-dim:   rgba(255,107,0,0.12);
          --pm-t1:    #ffffff;
          --pm-t2:    #cccccc;
          --pm-t3:    #888888;
          --pm-t4:    #666666;
        }

        /* ── Base ── */
        html, body { background: linear-gradient(135deg,#0f0f0f 0%,#1a1a1a 100%) !important; color: var(--pm-t1) !important; }
        body::before, body::after, .bg-grid { display:none!important; }

        /* ═══ SIDEBAR PREMIUM — escopo body.tm-premium ═══════════════
           Usa body.tm-premium para NÃO afetar Original e Neon
        ═══════════════════════════════════════════════════════════ */

        /* Background — supera html.dark #sidebar do sidebar.html */
        body.tm-premium #sidebar,
        body.tm-premium #sidebar.sb-mini {
          background: linear-gradient(180deg,#1a1a1a 0%,#151515 100%) !important;
          background-color: #1a1a1a !important;
          border-right: 1px solid #3a3a3a !important;
          box-shadow: 8px 0 16px rgba(0,0,0,0.5) !important;
          backdrop-filter: none !important;
        }

        /* Sb-tab pill */
        body.tm-premium #sb-pill {
          background: #252525 !important;
          border-color: rgba(255,107,0,0.3) !important;
          box-shadow: 4px 0 14px rgba(0,0,0,0.5) !important;
        }
        body.tm-premium #sb-tab:hover #sb-pill {
          background: rgba(255,107,0,0.15) !important;
          border-color: rgba(255,107,0,0.6) !important;
        }
        body.tm-premium #sb-pill .material-symbols-rounded { color: #ff6b00 !important; }

        /* Nav items — laranja Manus, só no Premium */
        body.tm-premium .nav-item { color: #888888 !important; }
        body.tm-premium .nav-item:hover {
          background: rgba(255,107,0,0.1) !important;
          color: #ff6b00 !important;
        }
        body.tm-premium .nav-item.active-nav {
          background: linear-gradient(135deg,rgba(255,107,0,0.2),rgba(255,107,0,0.05)) !important;
          color: #ff6b00 !important;
        }
        body.tm-premium .nav-item.active-nav::before {
          background: #ff6b00 !important;
          box-shadow: none !important;
        }
        body.tm-premium .nav-item:hover .material-symbols-rounded { color: #ff6b00 !important; }

        /* Labels de seção */
        body.tm-premium .sb-label { color: #666666 !important; }

        /* Badge "Novo" */
        body.tm-premium .nav-badge {
          background: rgba(255,107,0,0.15) !important;
          color: #ff6b00 !important;
        }

        /* Main content margin — controlado via JS no fixSidebar/observer */

        /* Logo */
        #sidebar header, #sidebar [class*="sidebar-header"], #sidebar > div:first-child {
          padding: 1.5rem !important;
          border-bottom: 1px solid var(--pm-bdr) !important;
        }
        [id*="logo-icon"] {
          width: 40px !important; height: 40px !important; border-radius: 10px !important;
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          box-shadow: 0 4px 12px rgba(255,107,0,0.3) !important;
          font-weight: 700 !important; color: #fff !important; font-size: 14px !important;
          display:flex!important; align-items:center!important; justify-content:center!important;
          flex-shrink:0!important;
        }
        #logo-name {
          font-weight: 700 !important; font-size: 14px !important;
          color: var(--pm-t1) !important; line-height: 1.2 !important;
          font-family: 'Inter', sans-serif !important;
        }
        #logo-sub { font-size: 10px !important; color: var(--pm-t3) !important; font-weight: 500 !important; }

        /* Section labels — mostra os títulos de grupo */
        #sidebar [class*="nav-section"], #sidebar [class*="text-xs"][class*="uppercase"],
        #sidebar [class*="tracking-wider"], #sidebar .nav-section-title {
          display: block !important;
          font-size: 10px !important; font-weight: 700 !important;
          letter-spacing: 0.1em !important; text-transform: uppercase !important;
          color: var(--pm-t4) !important; padding: 0.75rem 1rem !important;
          text-shadow: 0 0 4px rgba(255,107,0,0.15) !important;
        }

        /* Nav items — com texto */
        #sidebar a, #sidebar button, .nav-item, [class*="nav-item"], aside a, aside button {
          display: flex !important; align-items: center !important; gap: 12px !important;
          padding: 12px 1rem !important; margin: 4px 12px !important;
          border-radius: 10px !important;
          color: var(--pm-t3) !important;
          font-size: 14px !important; font-weight: 500 !important;
          background: transparent !important; background-image: none !important;
          border: none !important; box-shadow: none !important;
          transition: all 0.3s ease !important; position: relative !important;
          overflow: hidden !important; width: auto !important; height: auto !important;
          min-width: unset !important; flex-direction: row !important;
          text-decoration: none !important;
        }
        #sidebar a:hover, .nav-item:hover {
          background: rgba(255,107,0,0.1) !important; color: var(--pm-acc) !important;
          transform: translateX(4px) !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: linear-gradient(135deg,rgba(255,107,0,0.2),rgba(255,107,0,0.05)) !important;
          color: var(--pm-acc) !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          content: '' !important; position: absolute !important;
          left: 0 !important; top: 0 !important; width: 3px !important; height: 100% !important;
          background: var(--pm-acc) !important; border-radius: 0 !important; box-shadow: none !important;
          display: block !important;
        }
        /* Mostrar texto dos nav items (que estava escondido) */
        #sidebar a span:not(.material-symbols-rounded),
        #sidebar button span:not(.material-symbols-rounded),
        .nav-item span:not(.material-symbols-rounded),
        .nav-item p, .nav-item div {
          display: inline !important; visibility: visible !important;
          font-size: 14px !important; line-height: normal !important;
          max-height: unset !important; overflow: visible !important;
          color: inherit !important;
        }
        /* Ícone no nav */
        #sidebar .material-symbols-rounded { font-size: 20px !important; flex-shrink: 0 !important; }

        /* User profile na sidebar */
        #sidebar-footer, [id*="sidebar-footer"], .sidebar-footer {
          border-top: 1px solid var(--pm-bdr) !important; padding: 1rem !important;
        }
        .user-profile, [class*="user-profile"] {
          background: rgba(255,107,0,0.05) !important; border-radius: 10px !important;
          border: 1px solid rgba(255,107,0,0.1) !important; padding: 12px !important;
        }
        #user-avatar {
          width: 40px !important; height: 40px !important; border-radius: 8px !important;
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important; box-shadow: none !important;
          font-size: 12px !important; font-weight: 700 !important;
        }
        #user-name { color: var(--pm-t1) !important; font-weight: 600 !important; font-size: 12px !important; }
        #user-role { color: var(--pm-t3) !important; background: none !important; -webkit-text-fill-color: var(--pm-t3) !important; font-size: 10px !important; }

        /* ── HEADER / TOPBAR ── */
        header, #topbar, #header-container>* {
          background: linear-gradient(90deg,#1a1a1a 0%,#1f1f1f 100%) !important;
          border-bottom: 1px solid var(--pm-bdr) !important;
          backdrop-filter: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        #global-search, #search-input {
          background: var(--pm-bg2) !important; border: 1px solid var(--pm-bdr) !important;
          color: var(--pm-t1) !important;
        }
        #global-search::placeholder { color: var(--pm-t4) !important; }
        #global-search:focus { border-color: var(--pm-acc) !important; box-shadow: 0 0 0 3px rgba(255,107,0,.15) !important; }
        header button, header .ib { background: var(--pm-bg2) !important; border: 1px solid var(--pm-bdr) !important; color: var(--pm-t3) !important; }
        header button:hover { background: var(--pm-bg3) !important; color: var(--pm-acc) !important; }
        [id*="notification-badge"] { background: var(--pm-acc) !important; }

        /* ── Título ── */
        .text-gradient, #dashboard-title span, .page-title span, h1 span {
          color: var(--pm-acc) !important;
          -webkit-text-fill-color: var(--pm-acc) !important;
          background: none !important; -webkit-background-clip: unset !important;
          text-shadow: 0 0 8px rgba(255,107,0,0.35) !important;
        }
        #dashboard-title, .page-title, h1[class*="text-2xl"], h1[class*="text-3xl"] { color: var(--pm-t1) !important; }

        /* ── NOVA ORDEM ── */
        #nova-ordem-btn, button.bg-primary-600, button[class*="bg-primary-6"],
        button[class*="bg-primary-7"], [id*="nova-ordem"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important; color: #fff !important; font-weight: 600 !important;
          font-size: 13px !important; text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          box-shadow: 0 8px 16px rgba(255,107,0,0.3) !important;
          border-radius: 10px !important;
        }
        #nova-ordem-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 12px 24px rgba(255,107,0,0.4) !important; }
        #nova-ordem-btn span, button.bg-primary-600 span { color:#fff!important; -webkit-text-fill-color:#fff!important; text-transform:uppercase; }

        /* Botões de modo/layout */
        .active-chart-btn { background: var(--pm-acc) !important; border-color: var(--pm-acc) !important; color:#fff!important; }
        .chart-mode-btn { color: var(--pm-t3) !important; border-color: var(--pm-bdr) !important; background: transparent !important; }
        .layout-btn { color: var(--pm-t3) !important; border-color: var(--pm-bdr) !important; background: transparent !important; }
        .layout-btn.active-layout { background: rgba(255,107,0,0.15) !important; border-color: rgba(255,107,0,0.35) !important; color: var(--pm-acc) !important; }

        /* ── METRIC CARDS — estilo neumórfico ── */
        .metric-card {
          background: linear-gradient(145deg,#2a2a2a,#1f1f1f) !important;
          border: 1px solid var(--pm-bdr) !important;
          border-radius: 16px !important;
          box-shadow:
            -8px -8px 16px rgba(255,255,255,0.04),
            8px 8px 16px rgba(0,0,0,0.5),
            inset -1px -1px 2px rgba(255,255,255,0.03),
            inset 1px 1px 2px rgba(0,0,0,0.3) !important;
        }
        .metric-card:hover {
          transform: translateY(-4px) !important;
          box-shadow:
            -12px -12px 24px rgba(255,255,255,0.06),
            12px 12px 24px rgba(0,0,0,0.6),
            inset -1px -1px 2px rgba(255,255,255,0.03),
            inset 1px 1px 2px rgba(0,0,0,0.3) !important;
        }

        /* Números dos cards — laranja grande */
        #stat-a-separar-wrap h3, #stat-em-separacao-wrap h3,
        #stat-concluidas-hoje-wrap h3 {
          color: var(--pm-acc) !important; -webkit-text-fill-color: var(--pm-acc) !important;
          background: none !important; font-size: 2.5rem !important; font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          text-shadow: 0 0 8px rgba(255,107,0,0.4) !important;
        }
        #stat-total-wrap h3 {
          color: #fff !important; -webkit-text-fill-color: #fff !important;
          background: none !important; font-size: 2.5rem !important; font-weight: 700 !important;
        }

        /* Labels dos cards */
        .metric-card p.text-xs, .metric-card [class*="text-xs"],
        .metric-card [class*="uppercase"] { color: var(--pm-t3) !important; font-size: 11px !important; font-weight: 600 !important; letter-spacing: 0.1em !important; }
        .metric-card .text-slate-400, .metric-card .text-slate-500 { color: var(--pm-t3) !important; }

        /* Card Total — laranja sólido */
        .metric-card[style*="4f46e5"], .metric-card[style*="6366f1"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important;
          box-shadow: 0 8px 24px rgba(255,107,0,0.4) !important;
        }
        .metric-card[style*="4f46e5"] * { color:#fff!important; -webkit-text-fill-color:#fff!important; text-shadow:none!important; }
        .metric-card[style*="4f46e5"] .rounded-2xl { background:rgba(255,255,255,.15)!important; }

        /* Ícones dos cards — caixa laranja */
        .metric-card [class*="rounded-xl"][class*="flex"],
        .metric-card [class*="icon-box"],
        #progress-a-separar, #progress-em-separacao, #progress-concluidas {
          /* mantém os círculos de progresso do sistema */
        }

        /* ── CARDS GENÉRICOS ── */
        .bg-white.rounded-2xl, .bg-white.rounded-xl,
        .dark\:bg-slate-900.rounded-2xl, .dark\:bg-slate-900.rounded-xl,
        [class*="dark:bg-slate-9"] {
          background: linear-gradient(145deg,#2a2a2a,#1f1f1f) !important;
          border: 1px solid var(--pm-bdr) !important;
          box-shadow: -8px -8px 16px rgba(255,255,255,0.04), 8px 8px 16px rgba(0,0,0,0.5) !important;
        }
        .bg-white.rounded-2xl *, .dark\:bg-slate-900.rounded-2xl * { color: var(--pm-t1) !important; }

        /* ── TABELAS ── */
        thead tr { border-bottom: 2px solid var(--pm-bdr) !important; background: transparent !important; }
        tbody tr { border-bottom: 1px solid #2a2a2a !important; transition: background-color 0.2s !important; }
        tbody tr:hover td { background: rgba(255,107,0,0.05) !important; }
        th { color: var(--pm-t3) !important; font-size: 11px !important; font-weight: 600 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; background:transparent!important; }
        td { color: var(--pm-t2) !important; background: transparent !important; }
        td:first-child {
          color: var(--pm-acc) !important; -webkit-text-fill-color: var(--pm-acc) !important;
          background: none !important; font-weight: 700 !important; font-family: monospace !important;
        }

        /* ── BADGES ── */
        [class*="fila"],[class*="pending"] { background:rgba(255,107,0,0.15)!important; color:var(--pm-acc)!important; border:1px solid rgba(255,107,0,0.3)!important; }
        [class*="ativo"],[class*="progress"] { background:rgba(59,130,246,0.15)!important; color:#3b82f6!important; border:1px solid rgba(59,130,246,0.3)!important; }
        [class*="pronto"],[class*="completed"] { background:rgba(34,197,94,0.15)!important; color:#22c55e!important; border:1px solid rgba(34,197,94,0.3)!important; }
        [class*="entregue"],[class*="delivered"] { background:rgba(139,92,246,0.15)!important; color:#8b5cf6!important; border:1px solid rgba(139,92,246,0.3)!important; }

        /* ── INPUTS ── */
        input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),select,textarea {
          background: var(--pm-bg2) !important; border: 1px solid var(--pm-bdr) !important;
          color: var(--pm-t1) !important;
        }
        input:focus,select:focus { border-color:var(--pm-acc)!important; box-shadow:0 0 0 3px rgba(255,107,0,.12)!important; }
        input::placeholder { color:var(--pm-t4)!important; }
        option { background:var(--pm-bg2)!important; color:var(--pm-t1)!important; }

        /* ── TEXTOS SLATE → PREMIUM ── */
        [class*="text-slate-9"],[class*="text-slate-8"],[class*="dark:text-white"] { color:var(--pm-t1)!important; }
        [class*="text-slate-4"],[class*="text-slate-5"],[class*="text-slate-6"] { color:var(--pm-t3)!important; }
        [class*="text-indigo"],[class*="text-primary"] { color:var(--pm-acc)!important; }
        [class*="bg-indigo-5"],[class*="bg-indigo-6"],[class*="bg-primary-6"],[class*="bg-primary-7"] {
          background:linear-gradient(135deg,#ff6b00,#ff8c00)!important;
        }
        [class*="bg-slate-9"],[class*="bg-slate-8"],[class*="dark:bg-slate"] { background-color: var(--pm-bg2) !important; }
        [class*="border-slate"] { border-color: var(--pm-bdr) !important; }

        /* ── MODAIS ── */
        .modal-overlay,[id*="modal-overlay"] { background:rgba(0,0,0,0.7)!important; backdrop-filter:blur(4px)!important; }
        [id*="-modal"]>div>div { background:var(--pm-bg2)!important; border:1px solid var(--pm-bdr)!important; }
        [class*="modal-header"] { background:var(--pm-bg3)!important; border-bottom:1px solid var(--pm-bdr)!important; }

        /* ── VITO ── */
        #vito-panel { background:var(--pm-bg2)!important; border:1px solid var(--pm-bdr)!important; }
        #vito-head { background:linear-gradient(135deg,rgba(255,107,0,0.08),transparent)!important; border-bottom-color:var(--pm-bdr)!important; }
        #vito-head-name { color:var(--pm-t1)!important; }
        #vito-head-sub { color:var(--pm-acc)!important; -webkit-text-fill-color:var(--pm-acc)!important; background:none!important; }
        #vito-head-dot { background:#22c55e!important; }
        .vbub.bot { background:rgba(255,107,0,0.06)!important; border-color:rgba(255,107,0,0.15)!important; color:var(--pm-t2)!important; }
        .vbub.usr { background:linear-gradient(135deg,#ff6b00,#ff8c00)!important; color:#fff!important; }
        .vdot { background:var(--pm-acc)!important; }
        #vito-inp { background:var(--pm-bg3)!important; border-color:var(--pm-bdr)!important; color:var(--pm-t1)!important; }
        #vito-send { background:linear-gradient(135deg,#ff6b00,#ff8c00)!important; }
        #vito-fab { filter:drop-shadow(0 4px 14px rgba(255,107,0,0.4))!important; }
        #vito-hints,#vito-foot { border-top-color:var(--pm-bdr)!important; }

        /* ── Cmd cards ── */
        #layout-command .cmd-card { background:linear-gradient(145deg,#2a2a2a,#1f1f1f)!important; border-color:var(--pm-bdr)!important; box-shadow:-4px -4px 8px rgba(255,255,255,.03),4px 4px 8px rgba(0,0,0,.4)!important; }
        #layout-command .cmd-card::before { display:none!important; }
        #layout-command .cmd-total-card { background:linear-gradient(135deg,#ff6b00,#ff8c00)!important; border:none!important; box-shadow:0 8px 24px rgba(255,107,0,.4)!important; }
        #layout-command .cmd-total-card * { color:#fff!important; }
        #layout-command .cmd-number { color:#fff!important; }
        #layout-command .cmd-trend { background:rgba(255,255,255,.15)!important; color:#fff!important; }
        #layout-command [style*="color:#6366f1"] { color:var(--pm-acc)!important; }
        #layout-command [style*="background:rgba(99,102,241"] { background:rgba(255,107,0,.08)!important; border-color:rgba(255,107,0,.2)!important; color:var(--pm-acc)!important; }
        #layout-command .cmd-badge-active { background:rgba(59,130,246,.12)!important; color:#3b82f6!important; border-color:rgba(59,130,246,.25)!important; }
        #layout-command .cmd-badge-queue  { background:rgba(255,107,0,.12)!important; color:var(--pm-acc)!important; border-color:rgba(255,107,0,.25)!important; }
        #layout-command .cmd-order-lote { color:var(--pm-acc)!important; font-weight:700!important; }
        #layout-command .cmd-order-product { color:var(--pm-t3)!important; }
        #layout-command .cmd-section-label { color:var(--pm-t3)!important; }
        #layout-command [style*="color:#e2e8f0"],[style*="color:#f1f5f9"] { color:var(--pm-t1)!important; }
        #layout-command [style*="color:#64748b"],[style*="color:#475569"] { color:var(--pm-t3)!important; }

        /* ── Tab toggle da sidebar — mostra no Premium ── */
        #sb-tab, [id*="sb-tab"] {
          display: flex !important;
          background: #252525 !important;
          border: 1px solid #3a3a3a !important;
          border-left: none !important;
          color: #ff6b00 !important;
        }
        #sb-tab:hover { background: #2a2a2a !important; }

        /* Sidebar em modo mini (recolhida) — mantém bg escuro */
        #sidebar.sb-mini, [id="sidebar"].sb-mini,
        aside.sb-mini {
          background: linear-gradient(180deg,#1a1a1a 0%,#151515 100%) !important;
          background-color: #1a1a1a !important;
          border-right: 1px solid #3a3a3a !important;
        }

        /* ── Layout switcher — contraste alto ── */
        .layout-btn {
          color: #888888 !important;
          border-color: var(--pm-bdr) !important;
          background: var(--pm-bg2) !important;
        }
        .layout-btn:hover {
          border-color: var(--pm-acc) !important;
          color: var(--pm-acc) !important;
          background: rgba(255,107,0,0.1) !important;
        }
        .layout-btn.active-layout {
          background: rgba(255,107,0,0.2) !important;
          border-color: var(--pm-acc) !important;
          color: var(--pm-acc) !important;
        }

        /* ── Botão Refresh ── */
        #refresh-btn {
          background: var(--pm-bg2) !important;
          border: 1px solid var(--pm-bdr) !important;
          color: #888888 !important;
        }
        #refresh-btn:hover { color: var(--pm-acc) !important; border-color: var(--pm-acc) !important; }

        /* ── Seções e textos do nav — forçar visível ── */
        /* (anula qualquer display:none de outros temas) */
        #sidebar [class*="text-xs"],
        #sidebar [class*="tracking-wider"],
        #sidebar [class*="uppercase"],
        #sidebar [class*="nav-section"],
        #sidebar p,
        #sidebar [class*="text-sm"] {
          display: block !important;
          visibility: visible !important;
          max-height: unset !important;
          overflow: visible !important;
          line-height: normal !important;
        }
        /* Texto dos nav items */
        #sidebar a > span:not(.material-symbols-rounded),
        #sidebar button > span:not(.material-symbols-rounded),
        .nav-item > span:not(.material-symbols-rounded),
        .nav-item > p, .nav-item > div {
          display: inline !important;
          visibility: visible !important;
          font-size: 14px !important;
          line-height: normal !important;
          max-height: unset !important;
          color: inherit !important;
        }

        /* ── Section labels contraste ── */
        #sidebar [class*="text-xs"][class*="uppercase"],
        #sidebar [class*="tracking-wider"],
        #sidebar .nav-section-title,
        #sidebar [class*="nav-section"] > span,
        #sidebar [class*="nav-section"] > p {
          color: #666666 !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          padding: 0.75rem 1rem 0.5rem !important;
        }

        /* ── Nome do usuário e role na sidebar ── */
        #user-name { color: #ffffff !important; font-weight: 600 !important; font-size: 12px !important; }
        #user-role { color: #888888 !important; font-size: 10px !important; background:none!important; -webkit-text-fill-color:#888888!important; }

        /* ══ EQUIPE — Premium: nomes e avatares ═══════════════════ */

        /* Avatares — letra branca */
        body.tm-premium #equipe [class*="w-10"],
        body.tm-premium #equipe [class*="w-9"],
        body.tm-premium #equipe [class*="w-8"] {
          color: #fff !important; -webkit-text-fill-color: #fff !important;
          font-weight: 700 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.4) !important;
        }

        /* Nomes — branco, NÃO laranja */
        body.tm-premium #equipe td:first-child,
        body.tm-premium #equipe [class*="font-semibold"],
        body.tm-premium #equipe [class*="font-medium"] {
          color: #ffffff !important; -webkit-text-fill-color: #ffffff !important;
          background: none !important; -webkit-background-clip: unset !important;
          font-weight: 600 !important; font-family: 'Inter',sans-serif !important;
        }

        /* E-mails — cinza muted, sem negrito */
        body.tm-premium #equipe [class*="text-xs"],
        body.tm-premium #equipe span[class*="text-xs"] {
          color: #888888 !important; -webkit-text-fill-color: #888888 !important;
          background: none !important; -webkit-background-clip: unset !important;
          font-weight: 400 !important;
        }

        /* Linhas */
        body.tm-premium #equipe tr { border-color: #2a2a2a !important; }
        body.tm-premium #equipe tr:hover td { background: rgba(255,107,0,.04) !important; }
        body.tm-premium #equipe td { color: #cccccc !important; }

        /* Último acesso */
        body.tm-premium #equipe [class*="tabular-nums"] {
          color: #888888 !important; font-size: 12px !important;
        }

        /* Scrollbar */
        *{scrollbar-color:rgba(255,107,0,.25) transparent;}
        ::-webkit-scrollbar{width:8px;height:8px;}
        ::-webkit-scrollbar-thumb{background:var(--pm-bdr);border-radius:4px;}
        ::-webkit-scrollbar-thumb:hover{background:#4a4a4a;}
      `,
      onApply() {
        // Premium MANTÉM dark mode — só muda acentos para laranja
        document.documentElement.classList.add('dark');
        document.body.classList.remove('tm-nondark');
        // Classe de escopo — isola CSS do Premium
        document.body.classList.add('tm-premium');

        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#888888';
          Chart.defaults.borderColor = 'rgba(58,58,58,0.8)';
          Chart.defaults.font.family = "'Inter', sans-serif";
        }

        // Sidebar: exibe textos e labels de seção
        function fixSidebar() {
          const sb = document.getElementById('sidebar');
          if (!sb) return;

          // Detecta estado atual ANTES de qualquer alteração
          const isMini = sb.classList.contains('sb-mini');

          // Background — sempre Manus (não afeta largura)
          sb.style.setProperty('background','linear-gradient(180deg,#1a1a1a 0%,#151515 100%)','important');
          sb.style.setProperty('background-color','#1a1a1a','important');
          sb.style.setProperty('border-right','1px solid #3a3a3a','important');

          // Largura — respeita o estado mini/expandido do initSidebar
          if (isMini) {
            // Mini: deixa o sidebar.html CSS controlar (76px)
            sb.style.removeProperty('width');
            sb.style.removeProperty('min-width');
            sb.style.removeProperty('max-width');
          } else {
            // Expandido: força 280px Manus
            sb.style.setProperty('width','280px','important');
            sb.style.setProperty('min-width','280px','important');
            sb.style.removeProperty('max-width');
          }

          // Main content margin — sincronizado com o estado
          const main = document.getElementById('main-content');
          if (main) {
            main.style.setProperty('margin-left', isMini ? '76px' : '280px', 'important');
          }

          // Mostra tab toggle
          const tab = document.getElementById('sb-tab');
          if (tab) tab.style.removeProperty('display');
        }
        fixSidebar(); [300,800,1500].forEach(d=>setTimeout(fixSidebar,d));

        // Observer: re-aplica bg e margin quando sidebar muda de classe
        if (window._pm_sbObs) window._pm_sbObs.disconnect();
        window._pm_sbObs = new MutationObserver(() => {
          // Aguarda o initSidebar terminar de aplicar sb-mini no main-content
          requestAnimationFrame(fixSidebar);
        });
        const sbEl = document.getElementById('sidebar');
        if (sbEl) window._pm_sbObs.observe(sbEl, { attributes: true, attributeFilter: ['class'] });

        // Patch charts — laranja com área preenchida
        const ORA='#ff6b00', ORA_A='rgba(255,107,0,0.15)';
        const ORA2='#ff8c00', ORA2_A='rgba(255,140,0,0.08)';
        let _t=0;
        function patch() {
          if(typeof Chart==='undefined') return;
          const getChart=id=>typeof Chart.getChart==='function'?Chart.getChart(id):Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
          let ok=false;
          ['performanceChart','performanceChart2','performanceChart3','performanceChart4'].forEach(id=>{
            const ch=getChart(id);
            if(!ch||!ch.data||!ch.data.datasets||!ch.data.datasets.length)return;
            const ds=ch.data.datasets;
            if(ds[0]){ds[0].borderColor=ORA;ds[0].backgroundColor=ORA_A;ds[0].pointBackgroundColor=ORA;ds[0].pointBorderColor='#1a1a1a';ds[0].pointBorderWidth=2;}
            if(ds[1]){ds[1].borderColor=ORA2;ds[1].backgroundColor=ORA2_A;ds[1].pointBackgroundColor=ORA2;ds[1].pointBorderColor='#1a1a1a';ds[1].pointBorderWidth=2;}
            try{
              ['x','y'].forEach(ax=>{if(ch.options.scales&&ch.options.scales[ax]){ch.options.scales[ax].grid.color='rgba(58,58,58,0.6)';ch.options.scales[ax].ticks.color='#888888';}});
              if(ch.options.plugins){
                if(ch.options.plugins.legend?.labels)ch.options.plugins.legend.labels.color='#888888';
                if(ch.options.plugins.tooltip){ch.options.plugins.tooltip.backgroundColor='#252525';ch.options.plugins.tooltip.titleColor='#ffffff';ch.options.plugins.tooltip.bodyColor='#888888';ch.options.plugins.tooltip.borderColor='#3a3a3a';ch.options.plugins.tooltip.borderWidth=1;}
              }
            }catch(e){}
            ch.update('none'); ok=true;
          });
          // Dots de legenda HTML
          document.querySelectorAll('.bg-amber-400,.bg-amber-400.rounded-full').forEach(el=>el.style.setProperty('background-color',ORA,'important'));
          document.querySelectorAll('.bg-blue-500,.bg-blue-500.rounded-full').forEach(el=>el.style.setProperty('background-color',ORA2,'important'));
          if(!ok&&_t++<15)setTimeout(patch,350);
        }
        if(window.buildWeekChart&&!window._tm_origBWC){window._tm_origBWC=window.buildWeekChart;window.buildWeekChart=function(){window._tm_origBWC();_t=0;setTimeout(patch,100);};}
        if(window.updateCharts&&!window._tm_origUC){window._tm_origUC=window.updateCharts;window.updateCharts=function(){window._tm_origUC();_t=0;setTimeout(patch,120);};}
        [200,600,1400].forEach(d=>setTimeout(patch,d));
        if(window._tm_obs)window._tm_obs.disconnect();
        window._tm_obs=new MutationObserver(()=>{_t=0;setTimeout(patch,150);});
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});
      },
    },
    // ── 3. NEON — Dark Purple/Orange (mantém dark mode) ────────
    neon: {
      label:   'Neon',
      sub:     'Dark Gradient',
      icon:    '◉',
      preview: ['#0a0a12', '#7b2ff7', '#ff6b35'],
      fonts:   ['https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'],
      css: `
        /* ── Fontes Neon (dark mantido — só muda fontes e acentos) ── */
        body, button, input, select, textarea, td, th, label, p, a,
        span:not(.material-symbols-rounded):not([class*="material"]) {
          font-family: 'Space Grotesk', system-ui, sans-serif !important;
        }
        h1, h2, h3, h4, .page-title { font-family: 'Syne', sans-serif !important; letter-spacing:-0.02em!important; }
        .material-symbols-rounded,[class*="material-symbols"],[class*="material-icons"] { font-family:'Material Symbols Rounded'!important; }

        /* ── Variáveis ── */
        :root {
          --ne-v1:   #7b2ff7;
          --ne-v2:   #ff6b35;
          --ne-v3:   #c084fc;
          --ne-grad: linear-gradient(135deg,#7b2ff7 0%,#ff6b35 100%);
          --ne-dim:  rgba(123,47,247,0.12);
        }

        /* ── Fundo mais profundo ── */
        body, html { background-color:#07040f!important; }
        body::before {
          content:''!important; display:block!important; position:fixed!important; inset:0!important;
          background:
            radial-gradient(ellipse 60% 40% at 20% 20%,rgba(123,47,247,0.07) 0%,transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%,rgba(255,107,53,0.05) 0%,transparent 60%)!important;
          pointer-events:none!important; z-index:0!important;
        }
        body::after { display:none!important; }

        /* ── Sidebar ── */
        #sidebar, #sidebar-container>*, aside {
          background:rgba(7,4,15,0.97)!important;
          border-right:1px solid rgba(123,47,247,0.15)!important;
        }
        #sidebar a.active,.nav-item.active,.nav-item.active-nav {
          background:rgba(123,47,247,0.12)!important; color:var(--ne-v3)!important;
        }
        #sidebar a.active::before,.nav-item.active::before,.nav-item.active-nav::before {
          background:var(--ne-grad)!important; box-shadow:0 0 8px rgba(123,47,247,.5)!important;
        }
        #sidebar a:hover,.nav-item:hover { background:rgba(123,47,247,.07)!important; color:var(--ne-v3)!important; }

        /* ── Logo / Avatar ── */
        [id*="logo-icon"] { background:var(--ne-grad)!important; box-shadow:0 4px 16px rgba(123,47,247,.45)!important; }
        #user-avatar { background:var(--ne-grad)!important; box-shadow:0 0 16px rgba(123,47,247,.35)!important; }
        #user-role { background:var(--ne-grad)!important; -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important; }

        /* ── Header ── */
        header,#topbar,#header-container>* {
          background:rgba(7,4,15,0.96)!important;
          border-bottom:1px solid rgba(123,47,247,.12)!important;
          backdrop-filter:blur(16px)!important;
        }
        #global-search,#search-input {
          background:rgba(123,47,247,.06)!important;
          border:1px solid rgba(123,47,247,.18)!important;
        }
        #global-search:focus { border-color:var(--ne-v1)!important; box-shadow:0 0 0 3px rgba(123,47,247,.15)!important; }
        header button,header .ib { background:rgba(123,47,247,.06)!important; border:1px solid rgba(123,47,247,.15)!important; }

        /* ── Título ── */
        .text-gradient,#dashboard-title span,.page-title span,h1 span {
          background:var(--ne-grad)!important;
          -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important;
        }

        /* ── Nova Ordem ── */
        #nova-ordem-btn,button.bg-primary-600,button[class*="bg-primary-6"],
        button[class*="bg-primary-7"],[id*="nova-ordem"] {
          background:var(--ne-grad)!important; border:none!important;
          box-shadow:0 6px 20px rgba(123,47,247,.4)!important;
        }
        #nova-ordem-btn span,button.bg-primary-600 span { color:#fff!important; -webkit-text-fill-color:#fff!important; }

        /* ── Botões ── */
        .active-chart-btn { background:var(--ne-grad)!important; border-color:transparent!important; color:#fff!important; }
        .layout-btn.active-layout { background:rgba(123,47,247,.15)!important; border-color:rgba(123,47,247,.4)!important; color:var(--ne-v3)!important; }
        [class*="text-primary-6"],[class*="text-indigo-6"],[class*="text-indigo-4"] { color:var(--ne-v3)!important; }
        input:focus,select:focus { border-color:var(--ne-v1)!important; box-shadow:0 0 0 3px rgba(123,47,247,.15)!important; }
        input[type="checkbox"],input[type="radio"] { accent-color:var(--ne-v1)!important; }

        /* ── Cards dark — borda roxa sutil ── */
        .metric-card,
        .dark\:bg-slate-900,.dark\:bg-slate-800 {
          border-color:rgba(123,47,247,0.15)!important;
        }
        .metric-card:hover { border-color:rgba(123,47,247,0.35)!important; box-shadow:0 0 24px rgba(123,47,247,.06)!important; }

        /* Card Total — gradiente neon */
        .metric-card[style*="4f46e5"],.metric-card[style*="6366f1"] {
          background:var(--ne-grad)!important; border:none!important;
          box-shadow:0 8px 28px rgba(123,47,247,.4)!important;
        }

        /* Lote na tabela */
        td:first-child {
          background:var(--ne-grad)!important;
          -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important;
          font-weight:700!important;
        }

        /* Cmd cards */
        #layout-command .cmd-card { border-color:rgba(123,47,247,.15)!important; }
        #layout-command .cmd-card:hover { border-color:rgba(123,47,247,.35)!important; }
        #layout-command .cmd-total-card {
          background:var(--ne-grad)!important; border:none!important;
          box-shadow:0 8px 28px rgba(123,47,247,.4)!important;
        }
        #layout-command [style*="color:#6366f1"] { color:var(--ne-v3)!important; }
        #layout-command [style*="background:rgba(99,102,241"] {
          background:rgba(123,47,247,.1)!important; border-color:rgba(123,47,247,.2)!important; color:var(--ne-v3)!important;
        }
        #layout-command .cmd-badge-active { background:rgba(123,47,247,.1)!important; color:var(--ne-v3)!important; border-color:rgba(123,47,247,.2)!important; }
        #layout-command .cmd-badge-deliver { background:rgba(255,107,53,.1)!important; color:var(--ne-v2)!important; border-color:rgba(255,107,53,.2)!important; }

        /* ══ EQUIPE — avatares com fundo e letra branca ══ */
        #equipe [class*="w-10"][class*="h-10"],
        #equipe [class*="w-9"][class*="h-9"],
        #equipe [class*="w-8"][class*="h-8"],
        #equipe [class*="rounded-xl"][class*="flex"][class*="items-center"],
        #equipe [class*="rounded-full"][class*="flex"][class*="items-center"] {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.35) !important;
        }
        /* Garante que spans internos dos avatares também sejam brancos */
        #equipe [class*="w-10"] > span,
        #equipe [class*="w-9"] > span,
        #equipe [class*="w-8"] > span {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          background: none !important;
          -webkit-background-clip: unset !important;
        }

        /* Nomes — cor clara legível, não roxa */
        #equipe [class*="font-semibold"],
        #equipe [class*="font-medium"] {
          color: #e2e8f0 !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
        }
        /* E-mails — cinza muted, sem negrito */
        #equipe [class*="text-xs"] {
          color: #6b5a8a !important;
          -webkit-text-fill-color: #6b5a8a !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          font-weight: 400 !important;
        }
        /* td:first-child na equipe — sem gradient */
        #equipe td:first-child {
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          color: #e2e8f0 !important;
        }

        /* Scrollbar */
        *{scrollbar-color:rgba(123,47,247,.3) transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(123,47,247,.3);border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(123,47,247,.5);}
      `,
      onApply() {
        // Neon MANTÉM dark mode — só muda acentos
        document.documentElement.classList.add('dark');
        document.body.classList.remove('tm-nondark');

        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#8b7aaa';
          Chart.defaults.borderColor = 'rgba(123,47,247,0.1)';
          Chart.defaults.font.family = "'Space Grotesk', sans-serif";
        }

        const PURP='#7b2ff7', PURP_A='rgba(123,47,247,0.1)';
        const ORAN='#ff6b35', ORAN_A='rgba(255,107,53,0.08)';
        let _t=0;
        function patch() {
          if(typeof Chart==='undefined') return;
          const getChart=id=>typeof Chart.getChart==='function'?Chart.getChart(id):Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
          let ok=false;
          ['performanceChart','performanceChart2','performanceChart3','performanceChart4'].forEach(id=>{
            const ch=getChart(id);
            if(!ch||!ch.data||!ch.data.datasets||!ch.data.datasets.length)return;
            const ds=ch.data.datasets;
            if(ds[0]){ds[0].borderColor=PURP;ds[0].backgroundColor=PURP_A;ds[0].pointBackgroundColor=PURP;ds[0].pointBorderColor='#07040f';ds[0].pointBorderWidth=2;}
            if(ds[1]){ds[1].borderColor=ORAN;ds[1].backgroundColor=ORAN_A;ds[1].pointBackgroundColor=ORAN;ds[1].pointBorderColor='#07040f';ds[1].pointBorderWidth=2;}
            try{
              ['x','y'].forEach(ax=>{if(ch.options.scales&&ch.options.scales[ax]){ch.options.scales[ax].grid.color='rgba(123,47,247,0.07)';ch.options.scales[ax].ticks.color='#6b5a8a';}});
              if(ch.options.plugins){
                if(ch.options.plugins.legend?.labels)ch.options.plugins.legend.labels.color='#8b7aaa';
                if(ch.options.plugins.tooltip){
                  ch.options.plugins.tooltip.backgroundColor='rgba(7,4,15,0.97)';
                  ch.options.plugins.tooltip.titleColor='#f0eaff';
                  ch.options.plugins.tooltip.bodyColor='#8b7aaa';
                  ch.options.plugins.tooltip.borderColor='rgba(123,47,247,.25)';
                  ch.options.plugins.tooltip.borderWidth=1;
                }
              }
            }catch(e){}
            ch.update('none'); ok=true;
          });
          if(!ok&&_t++<15)setTimeout(patch,350);
        }
        if(window.buildWeekChart&&!window._tm_origBWC){window._tm_origBWC=window.buildWeekChart;window.buildWeekChart=function(){window._tm_origBWC();_t=0;setTimeout(patch,100);};}
        if(window.updateCharts&&!window._tm_origUC){window._tm_origUC=window.updateCharts;window.updateCharts=function(){window._tm_origUC();_t=0;setTimeout(patch,120);};}
        // ── Patch donut no Neon ───────────────────────────────────
        function patchNeonDonut() {
          if (typeof Chart === 'undefined') return;
          const getChart = id => typeof Chart.getChart === 'function'
            ? Chart.getChart(id)
            : Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
          const pie = getChart('distributionChart');
          if (!pie) return;
          // Sem bordas entre segmentos
          if (pie.data.datasets[0]) {
            pie.data.datasets[0].borderColor  = 'transparent';
            pie.data.datasets[0].borderWidth  = 0;
            pie.data.datasets[0].hoverOffset  = 6;
            // Cores neon: roxo, azul elétrico, verde neon, laranja
            pie.data.datasets[0].backgroundColor = [
              'rgba(123,47,247,0.85)',
              'rgba(99,147,255,0.85)',
              'rgba(16,220,160,0.85)',
              'rgba(255,107,53,0.85)'
            ];
          }
          // Tooltip dark
          if (pie.options.plugins?.tooltip) {
            pie.options.plugins.tooltip.backgroundColor = 'rgba(7,4,15,0.97)';
            pie.options.plugins.tooltip.titleColor = '#f0eaff';
            pie.options.plugins.tooltip.bodyColor  = '#8b7aaa';
            pie.options.plugins.tooltip.borderColor = 'rgba(123,47,247,0.25)';
            pie.options.plugins.tooltip.borderWidth = 1;
          }
          // Legend color
          if (pie.options.plugins?.legend?.labels)
            pie.options.plugins.legend.labels.color = '#8b7aaa';
          // Texto central escuro/claro no fundo dark
          const pluginIdx = (pie.config.plugins||[]).findIndex(p=>p.id==='centerText');
          const newPlugin = {
            id: 'centerText',
            beforeDraw(chart) {
              const { width, height, ctx: c } = chart;
              c.save();
              const cx = width/2, cy = height/2 - 10;
              c.font = "bold 28px 'Space Grotesk', sans-serif";
              c.fillStyle = '#f0eaff';
              c.textAlign = 'center'; c.textBaseline = 'middle';
              const orders = window.state?.orders || [];
              const total = orders.length || (pie.data.datasets[0].data.reduce((a,b)=>a+b,0));
              c.fillText(total, cx, cy);
              c.font = "12px 'Space Grotesk', sans-serif";
              c.fillStyle = '#6b5a8a';
              c.fillText('Total', cx, cy + 22);
              c.restore();
            }
          };
          if (pluginIdx >= 0) pie.config.plugins[pluginIdx] = newPlugin;
          pie.update('none');
        }

        // Intercepta buildPieChart
        if (window.buildPieChart && !window._tm_origBPC_ne) {
          window._tm_origBPC_ne = window.buildPieChart;
          window.buildPieChart = function() { window._tm_origBPC_ne(); setTimeout(patchNeonDonut, 80); };
        }

        [200,600,1400].forEach(d=>setTimeout(patch,d));
        [300,700,1500].forEach(d=>setTimeout(patchNeonDonut,d));
        if(window._tm_obs)window._tm_obs.disconnect();
        window._tm_obs=new MutationObserver(()=>{_t=0;setTimeout(patch,150);setTimeout(patchNeonDonut,200);});
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});
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

        /* ── Tabela — lote em cor sólida (gradient-clip falha em alguns browsers) ── */
        td:first-child {
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #c44dff !important;
          color: #c44dff !important;
          font-weight: 700 !important;
        }

        /* ── Cmd cards (layout command) ── */
        #layout-command .cmd-card {
          background:var(--clsurf)!important; border:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important;
        }
        #layout-command .cmd-card::before { display:none!important; }
        #layout-command .cmd-card:hover { border-color:rgba(196,77,255,.25)!important; box-shadow:var(--clsh2)!important; }

        /* Total card — mantém gradiente */
        #layout-command .cmd-total-card {
          background:var(--clgrad)!important; border:none!important;
          box-shadow:0 8px 28px rgba(255,107,157,.3)!important;
        }
        #layout-command .cmd-total-card * { color:rgba(255,255,255,.9)!important; -webkit-text-fill-color:rgba(255,255,255,.9)!important; }
        #layout-command .cmd-number { color:#fff!important; letter-spacing:-3px; }
        #layout-command .cmd-trend { background:rgba(255,255,255,.2)!important; color:#fff!important; }

        /* ── Ordens Recentes cmd — CONTRASTE ── */
        /* Título e subtítulo da seção */
        #layout-command .cmd-section-label { color:var(--clmut)!important; }
        #layout-command [style*="color:#e2e8f0"],
        #layout-command [style*="color: #e2e8f0"],
        #layout-command [style*="color:#f1f5f9"] {
          color:var(--cltext)!important;
        }
        #layout-command [style*="color:#64748b"],
        #layout-command [style*="color: #64748b"],
        #layout-command [style*="color:#475569"] {
          color:var(--clmut)!important;
        }

        /* Classes das linhas de ordem */
        #layout-command .cmd-order-lote   { color:var(--cltext)!important; font-weight:700!important; }
        #layout-command .cmd-order-product { color:var(--clmut)!important; }
        #layout-command .cmd-order-date    { color:var(--clmut)!important; }
        #layout-command .cmd-order-row {
          border-bottom:1px solid var(--clbdr)!important;
        }
        #layout-command .cmd-order-row:hover { background:rgba(196,77,255,.04)!important; border-radius:8px!important; }

        /* Badges status */
        #layout-command .cmd-badge-queue   { background:rgba(245,158,11,.1)!important; color:#f59e0b!important; border-color:rgba(245,158,11,.2)!important; }
        #layout-command .cmd-badge-active  { background:rgba(59,130,246,.1)!important; color:#3b82f6!important; border-color:rgba(59,130,246,.2)!important; }
        #layout-command .cmd-badge-done    { background:rgba(16,185,129,.1)!important; color:#10b981!important; border-color:rgba(16,185,129,.2)!important; }
        #layout-command .cmd-badge-deliver { background:rgba(139,92,246,.1)!important; color:#8b5cf6!important; border-color:rgba(139,92,246,.2)!important; }

        /* Stat numbers nos cards cmd */
        #layout-command .cmd-stat-num { color:var(--cltext)!important; }
        #layout-command [style*="color:#f59e0b"] { color:#f59e0b!important; }
        #layout-command [style*="color:#60a5fa"] { color:#3b82f6!important; }
        #layout-command [style*="color:#34d399"] { color:#10b981!important; }
        #layout-command [style*="color:#a78bfa"] { color:#8b5cf6!important; }

        /* Botão ver todas */
        #layout-command [style*="color:#6366f1"] { color:#c44dff!important; }
        #layout-command [style*="background:rgba(99,102,241"] {
          background:rgba(196,77,255,.08)!important; border-color:rgba(196,77,255,.2)!important; color:#c44dff!important;
        }

        /* Botões ação cmd */
        #layout-command .cmd-action-btn { border-radius:10px!important; font-weight:600!important; }

        /* Arco eficiência */
        #layout-command #cmd-efic { color:#10b981!important; }
        #layout-command [style*="color:#10b981"] { color:#10b981!important; }

        /* ── Dots legenda ── */
        .bg-amber-400.rounded-full, span.bg-amber-400 { background-color:#ff6b9d!important; }
        .bg-blue-500.rounded-full, span.bg-blue-500 { background-color:#a29bfe!important; }

        /* ══ KANBAN — Prateleira F ════════════════════════════════════ */

        /* Fundo da página kanban */
        #kanban { background-color:var(--clbg)!important; }

        /* Cards de posição (F11, F12...) */
        #kanban .rounded-xl, #kanban .rounded-2xl,
        #kanban [class*="kanban-cell"], #kanban [class*="position-card"],
        #kanban .bg-white, #kanban [class*="bg-slate-8"], #kanban [class*="bg-slate-9"] {
          background:var(--clsurf)!important;
          border:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important;
        }

        /* Textos nos cards de posição */
        #kanban [class*="text-slate-4"], #kanban [class*="text-slate-5"],
        #kanban [class*="text-slate-6"], #kanban .text-slate-400,
        #kanban .text-slate-500, #kanban [class*="dark:text-slate"] {
          color:var(--clmut)!important;
        }
        #kanban [class*="text-slate-9"], #kanban [class*="text-slate-8"],
        #kanban .text-slate-900, #kanban .text-slate-800,
        #kanban [class*="dark:text-white"] { color:var(--cltext)!important; }
        #kanban p, #kanban span:not(.material-symbols-rounded),
        #kanban div[class*="text-"] { color:inherit; }

        /* "sem dados", "sem taxa", "clique para formar" */
        #kanban [class*="text-xs"] { color:var(--clmut)!important; }
        #kanban [class*="font-bold"], #kanban [class*="font-semibold"] { color:var(--cltext)!important; }

        /* Rótulos de modelo (FIREFLY, GM ASP...) */
        #kanban [class*="border-b"] { border-color:var(--clbdr)!important; }
        #kanban thead, #kanban thead tr { background:var(--clsurf2)!important; }
        #kanban th { color:var(--clmut)!important; border-color:var(--clbdr)!important; }

        /* Filtros (Todos, Kanban OK, Incompleto...) */
        #kanban button[class*="rounded-full"],
        #kanban [class*="filter-btn"],
        #kanban button.rounded-full {
          border-color:var(--clbdr)!important;
          color:var(--cltext)!important;
        }

        /* Buscar posição input */
        #kanban input[placeholder*="posição"],
        #kanban input[placeholder*="Buscar"] {
          background:var(--clsurf)!important;
          border:1px solid var(--clbdr)!important;
          color:var(--cltext)!important;
        }

        /* Legenda (OK, Incompleto, Duplicado...) */
        #kanban [class*="legend"], #kanban [class*="bg-emerald"],
        #kanban [class*="bg-amber"], #kanban [class*="bg-blue"],
        #kanban [class*="bg-orange"], #kanban [class*="bg-slate"] {
          opacity:1!important;
        }

        /* Rótulos F12, F11... (coluna lateral) */
        #kanban [class*="row-label"],
        #kanban .sticky, #kanban [class*="text-slate-4"].font-mono,
        #kanban [style*="color:#64748b"], #kanban [style*="color: #64748b"] {
          color:var(--clmut)!important;
        }

        /* Área de drop/upload */
        #kanban [class*="border-dashed"] {
          border-color:rgba(196,77,255,.3)!important;
          background:rgba(196,77,255,.03)!important;
        }
        #kanban [class*="border-dashed"] * { color:var(--clmut)!important; }
        #kanban [class*="border-dashed"] [class*="text-primary"],
        #kanban [class*="border-dashed"] a { color:#c44dff!important; }

        /* Botões superiores (Google Sheets, Upload TOTVS) */
        #kanban button[class*="border"] {
          border-color:var(--clbdr)!important;
          color:var(--cltext)!important;
          background:var(--clsurf)!important;
        }
        /* Carregar XLS — mantém gradiente */
        #kanban button[class*="bg-primary"],
        #kanban button[class*="bg-emerald"],
        #kanban [id*="btn-upload-xls"],
        #kanban button[onclick*="XLS"], #kanban button[onclick*="xls"] {
          background:var(--clgrad)!important;
          color:#fff!important; border:none!important;
        }

        /* ══ MODAL KANBAN (popup F11-01) ══════════════════════════════ */

        /* Overlay do modal */
        .modal-overlay, [id*="modal-overlay"], [id*="kanban-modal"] ~ * {
          background:rgba(100,120,180,0.25)!important;
          backdrop-filter:blur(6px)!important;
        }

        /* Container do modal */
        [id*="kanban-detail"], [id*="shelf-modal"], [id*="position-modal"],
        [class*="kanban-modal"] > div,
        .fixed.inset-0 > div > div[class*="rounded"],
        .fixed.inset-0 > div > div[class*="bg-white"],
        .fixed.inset-0 > div > div[class*="dark:bg-slate"] {
          background:var(--clsurf)!important;
          border:1px solid var(--clbdr)!important;
          box-shadow:0 24px 64px rgba(100,120,180,0.2)!important;
          color:var(--cltext)!important;
        }

        /* Cabeçalho do modal — título, subtítulo, badge */
        .fixed [class*="font-black"], .fixed [class*="font-bold"],
        .fixed h2, .fixed h3 { color:var(--cltext)!important; }
        .fixed [class*="text-slate-4"], .fixed [class*="text-slate-5"],
        .fixed [class*="text-slate-6"], .fixed p.text-sm,
        .fixed span.text-sm, .fixed [class*="text-muted"] { color:var(--clmut)!important; }

        /* Tabela dentro do modal */
        .fixed thead, .fixed thead tr { background:var(--cltext)!important; }
        .fixed th {
          color:#fff!important;
          background:var(--cltext)!important;
          border-color:rgba(255,255,255,.1)!important;
        }
        .fixed tbody tr { border-bottom:1px solid var(--clbdr)!important; }
        .fixed tbody tr:hover td { background:var(--clsurf2)!important; }
        .fixed td { color:var(--cltext)!important; background:transparent!important; }
        /* PN (primeira coluna) */
        .fixed td:first-child {
          color:#c44dff!important;
          -webkit-text-fill-color:#c44dff!important;
          background:none!important; font-weight:700!important;
        }
        /* SALDO (terceira coluna) */
        .fixed td:nth-child(3) { color:#10b981!important; -webkit-text-fill-color:#10b981!important; font-weight:700!important; }

        /* Botão "Marcar como Vazio" */
        .fixed button[class*="border-red"], .fixed button[class*="text-red"],
        .fixed [class*="btn-danger"], .fixed button[onclick*="vazio"],
        .fixed button[onclick*="Vazio"] {
          background:rgba(239,68,68,.06)!important;
          border-color:rgba(239,68,68,.25)!important;
          color:#ef4444!important;
        }

        /* X fechar modal */
        .fixed button[class*="text-slate"], .fixed [class*="close-btn"] {
          color:var(--clmut)!important;
        }
        .fixed button[class*="text-slate"]:hover { color:var(--cltext)!important; }

        /* ══ PÁGINA EQUIPE ═══════════════════════════════════════════ */

        /* Fundo e tabela */
        #equipe { background: var(--clbg) !important; }
        #equipe table, #equipe thead, #equipe tbody { background: transparent !important; }
        #equipe thead tr { background: var(--clsurf2) !important; }
        #equipe th {
          color: var(--clmut) !important;
          background: var(--clsurf2) !important;
          border-color: var(--clbdr) !important;
          font-size: 10px !important; font-weight: 700 !important;
          letter-spacing: .07em !important; text-transform: uppercase !important;
        }
        #equipe tr { border-color: var(--clbdr) !important; background: transparent !important; }
        #equipe tr:hover { background: var(--clsurf2) !important; }
        #equipe td { color: var(--cltext) !important; background: transparent !important; }
        #equipe td:first-child {
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: var(--cltext) !important;
          color: var(--cltext) !important;
          font-weight: normal !important;
        }

        /* Avatares — letra branca, cor sólida discreta */
        #equipe [class*="w-10"][class*="h-10"],
        #equipe [class*="w-9"][class*="h-9"],
        #equipe [class*="w-8"][class*="h-8"] {
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
        }
        /* Mantém a cor original do avatar (definida pelo sistema por nível/inicial) */
        /* Apenas garante que a letra seja branca */
        #equipe [class*="w-10"] span,
        #equipe [class*="w-9"] span,
        #equipe [class*="w-8"] span {
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
        }

        /* Nomes — escuros, peso normal */
        #equipe [class*="font-semibold"],
        #equipe [class*="font-medium"] {
          color: var(--cltext) !important;
          -webkit-text-fill-color: var(--cltext) !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          font-weight: 600 !important;
        }

        /* E-mails — sem negrito, cinza suave */
        #equipe [class*="text-xs"],
        #equipe span[class*="text-xs"],
        #equipe [class*="text-slate-4"],
        #equipe [class*="text-slate-5"] {
          color: var(--clmut) !important;
          -webkit-text-fill-color: var(--clmut) !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          font-weight: 400 !important;   /* sem negrito */
        }

        /* Badges de nível */
        #equipe [class*="rounded-full"][class*="px-"] { font-weight: 600 !important; }

        /* Último acesso */
        #equipe [class*="tabular-nums"] { color: var(--clmut) !important; font-size: 12px !important; }

        /* Ações */
        #equipe button .material-symbols-rounded { color: var(--clmut) !important; opacity:.65!important; }
        #equipe button:hover .material-symbols-rounded { opacity:1!important; }

        /* ── Scrollbar ── */
        *{scrollbar-color:#dde3f0 transparent;}
        ::-webkit-scrollbar-thumb{background:#dde3f0;border-radius:3px;}
      `,
      onApply() {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('tm-nondark');

        // Limpa inline styles do sidebar (deixados pelo Premium)
        (function() {
          var sbEl = document.getElementById('sidebar');
          if (sbEl) {
            ['background','background-color','border-right','width','min-width','max-width'].forEach(function(p) {
              sbEl.style.removeProperty(p);
            });
          }
          var mcEl = document.getElementById('main-content');
          if (mcEl) mcEl.style.removeProperty('margin-left');
          // Desconecta observer do Premium
          if (window._pm_sbObs) { window._pm_sbObs.disconnect(); window._pm_sbObs = null; }
        })();

        // Chart.js defaults light
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#8a93b2';
          Chart.defaults.borderColor = 'rgba(200,210,230,0.3)';
          Chart.defaults.font.family = "'DM Sans', sans-serif";
        }

        // Cores
        const PINK='#ff6b9d', PINK_A='rgba(255,107,157,0.15)';
        const PURP='#a29bfe', PURP_A='rgba(162,155,254,0.14)';

        // ── Patch donut (distributionChart) ──────────────────────
        function patchDonut() {
          if (typeof Chart === 'undefined') return false;
          const getChart = id => typeof Chart.getChart === 'function'
            ? Chart.getChart(id)
            : Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);

          const pie = getChart('distributionChart');
          if (!pie) return false;

          // Remove bordas pretas entre segmentos
          if (pie.data.datasets[0]) {
            pie.data.datasets[0].borderColor  = '#ffffff';
            pie.data.datasets[0].borderWidth  = 3;
            pie.data.datasets[0].hoverOffset  = 6;
          }

          // Substitui o plugin centerText para texto escuro no light
          const pluginIdx = pie.config.plugins?.findIndex?.(p=>p.id==='centerText');
          const newPlugin = {
            id: 'centerText',
            beforeDraw(chart) {
              const { width, height, ctx: c } = chart;
              c.save();
              const cx = width / 2, cy = height / 2 - 10;
              c.font = "bold 28px 'DM Sans', sans-serif";
              c.fillStyle  = '#1a1f36'; // escuro no light
              c.textAlign  = 'center'; c.textBaseline = 'middle';
              const orders = window.state?.orders || [];
              c.fillText(orders.length || pie.data.datasets[0].data.reduce((a,b)=>a+b,0), cx, cy);
              c.font = "12px 'DM Sans', sans-serif"; c.fillStyle = '#8a93b2';
              c.fillText('Total', cx, cy + 22);
              c.restore();
            }
          };
          if (pluginIdx >= 0) pie.config.plugins[pluginIdx] = newPlugin;
          // Atualiza cores legend
          if (pie.options.plugins?.legend?.labels) pie.options.plugins.legend.labels.color = '#8a93b2';
          if (pie.options.plugins?.tooltip) {
            pie.options.plugins.tooltip.backgroundColor = 'rgba(255,255,255,.96)';
            pie.options.plugins.tooltip.titleColor = '#1a1f36';
            pie.options.plugins.tooltip.bodyColor  = '#8a93b2';
            pie.options.plugins.tooltip.borderColor = 'rgba(200,210,230,.6)';
            pie.options.plugins.tooltip.borderWidth = 1;
          }
          pie.update('none');
          return true;
        }

        // ── Patch line charts ─────────────────────────────────────
        let _t = 0;
        function patch() {
          if (typeof Chart === 'undefined') return;
          const getChart = id => typeof Chart.getChart === 'function'
            ? Chart.getChart(id)
            : Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);

          let ok = false;
          ['performanceChart','performanceChart2','performanceChart3'].forEach(id => {
            const ch = getChart(id);
            if (!ch||!ch.data||!ch.data.datasets||!ch.data.datasets.length) return;
            const ds = ch.data.datasets;
            if(ds[0]){ds[0].borderColor=PINK;ds[0].backgroundColor=PINK_A;ds[0].pointBackgroundColor=PINK;ds[0].pointBorderColor='#fff';ds[0].pointBorderWidth=2;}
            if(ds[1]){ds[1].borderColor=PURP;ds[1].backgroundColor=PURP_A;ds[1].pointBackgroundColor=PURP;ds[1].pointBorderColor='#fff';ds[1].pointBorderWidth=2;}
            try {
              ['x','y'].forEach(ax=>{if(ch.options.scales&&ch.options.scales[ax]){ch.options.scales[ax].grid.color='rgba(200,210,230,0.2)';ch.options.scales[ax].ticks.color='#8a93b2';}});
              if(ch.options.plugins){
                if(ch.options.plugins.legend?.labels) ch.options.plugins.legend.labels.color='#8a93b2';
                if(ch.options.plugins.tooltip){
                  ch.options.plugins.tooltip.backgroundColor='rgba(255,255,255,.96)';
                  ch.options.plugins.tooltip.titleColor='#1a1f36';
                  ch.options.plugins.tooltip.bodyColor='#8a93b2';
                  ch.options.plugins.tooltip.borderColor='rgba(200,210,230,.6)';
                  ch.options.plugins.tooltip.borderWidth=1;
                }
              }
            } catch(e) {}
            ch.update('none'); ok = true;
          });

          // Sempre tenta o donut também
          patchDonut();

          // Dots legenda HTML
          document.querySelectorAll('.bg-amber-400.rounded-full,span.bg-amber-400').forEach(el=>el.style.setProperty('background-color',PINK,'important'));
          document.querySelectorAll('.bg-blue-500.rounded-full,span.bg-blue-500').forEach(el=>el.style.setProperty('background-color',PURP,'important'));

          // ── Fix lotes invisíveis na tabela ──────────────────────
          // Remove o gradiente de texto do td:first-child que torna o skeleton visível
          document.querySelectorAll('#recent-orders-table td:first-child').forEach(el => {
            el.style.setProperty('background','none','important');
            el.style.setProperty('-webkit-background-clip','unset','important');
            el.style.setProperty('-webkit-text-fill-color','#c44dff','important');
            el.style.setProperty('color','#c44dff','important');
            el.style.setProperty('font-weight','700','important');
          });

          if (!ok && _t++ < 15) setTimeout(patch, 350);
        }

        // Intercepta buildWeekChart e buildPieChart
        if (window.buildWeekChart && !window._tm_origBWC) {
          window._tm_origBWC = window.buildWeekChart;
          window.buildWeekChart = function() { window._tm_origBWC(); _t=0; setTimeout(patch,100); };
        }
        if (window.buildPieChart && !window._tm_origBPC) {
          window._tm_origBPC = window.buildPieChart;
          window.buildPieChart = function() { window._tm_origBPC(); setTimeout(patchDonut,80); };
        }
        if (window.updateCharts && !window._tm_origUC) {
          window._tm_origUC = window.updateCharts;
          window.updateCharts = function() { window._tm_origUC(); _t=0; setTimeout(patch,120); };
        }

        [200,600,1400,3000].forEach(d => setTimeout(patch,d));

        // Observer DOM
        if (window._tm_obs) window._tm_obs.disconnect();
        window._tm_obs = new MutationObserver(() => { _t=0; setTimeout(patch,150); });
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});

        // Sidebar fix
        function fixSidebar() {
          const sb   = document.getElementById('sidebar');
          const main = document.getElementById('main-content');
          if(sb){sb.style.setProperty('width','72px','important');sb.style.setProperty('min-width','72px','important');sb.style.setProperty('max-width','72px','important');}
          if(main) main.style.setProperty('margin-left','72px','important');
        }
        fixSidebar(); setTimeout(fixSidebar,500);
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

    // ── Para de travar o dark mode antes de trocar ────────────
    if (window._tm_darkObserver) {
      window._tm_darkObserver.disconnect();
      window._tm_darkObserver = null;
    }

    // ── Se era um tema não-dark, restaura dark antes de trocar ─
    if (_current !== 'original' && id === 'original') {
      _restoreCharts(); // re-adiciona dark
    }

    _current = id;

    // ── Carrega fontes ────────────────────────────────────────
    if (t.fonts?.length) _loadFonts(t.fonts);

    // ── Injeta CSS ────────────────────────────────────────────
    if (!_styleEl) {
      _styleEl = document.createElement('style');
      _styleEl.id = 'tm-active';
      document.head.appendChild(_styleEl);
    }
    _styleEl.textContent = t.css;

    // ── Premium e Light: remove dark. Neon: mantém dark ─────────
    const LIGHT_THEMES = ['light'];
    if (LIGHT_THEMES.includes(id)) {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('tm-nondark');
      window._tm_darkObserver = new MutationObserver(() => {
        if (document.documentElement.classList.contains('dark') && _current === 'light') {
          document.documentElement.classList.remove('dark');
        }
      });
      window._tm_darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } else {
      // original e neon: dark mode ligado
      document.documentElement.classList.add('dark');
      document.body.classList.remove('tm-nondark');
    }

    // ── Executa JS específico do tema ─────────────────────────
    if (t.onApply) {
      try { t.onApply(); } catch(e) { console.warn('[ThemeManager] onApply:', e); }
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
      // Para o observer antes de re-adicionar dark
      if (window._tm_darkObserver) { window._tm_darkObserver.disconnect(); window._tm_darkObserver = null; }
      if (window._pm_sbObs)        { window._pm_sbObs.disconnect();        window._pm_sbObs = null; }

      // Limpa estilos inline do sidebar deixados pelo Premium
      (function() {
        var sbEl = document.getElementById('sidebar');
        if (sbEl) {
          ['background','background-color','border-right','width','min-width','max-width'].forEach(function(p) {
            sbEl.style.removeProperty(p);
          });
        }
        var mcEl = document.getElementById('main-content');
        if (mcEl) mcEl.style.removeProperty('margin-left');
      })();

      // Re-ativa dark mode do Tailwind
      document.documentElement.classList.add('dark');
      document.body.classList.remove('tm-nondark','tm-light','tm-premium');

      // Desconecta observer
      if (window._tm_obs) { window._tm_obs.disconnect(); window._tm_obs = null; }

      // Restaura funções de chart interceptadas
      if (window._tm_origBWC)    { window.buildWeekChart     = window._tm_origBWC;    window._tm_origBWC    = null; }
      if (window._tm_origBAC)    { window.buildAnalyticsChart= window._tm_origBAC;    window._tm_origBAC    = null; }
      if (window._tm_origBPC)    { window.buildPieChart       = window._tm_origBPC;    window._tm_origBPC    = null; }
      if (window._tm_origBPC_ne) { window.buildPieChart       = window._tm_origBPC_ne; window._tm_origBPC_ne = null; }
      if (window._tm_origUC)     { window.updateCharts        = window._tm_origUC;     window._tm_origUC     = null; }

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
    // Garante dark mode ativo antes de aplicar (o apply decide se remove)
    document.documentElement.classList.add('dark');
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
        position:fixed;top:11px;left:300px;z-index:9300;
        height:34px;padding:0 12px;border-radius:9px;border:none;cursor:pointer;
        background:rgba(255,255,255,0.07);backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.1);
        box-shadow:0 2px 8px rgba(0,0,0,0.15);
        display:flex;align-items:center;gap:6px;
        transition:all .2s;
        font-family:system-ui,sans-serif;font-size:11px;font-weight:600;
        color:rgba(255,255,255,0.65);letter-spacing:.02em;
        white-space:nowrap;
      }
      #tm-fab:hover{background:rgba(255,255,255,0.13);color:rgba(255,255,255,0.95);box-shadow:0 4px 14px rgba(0,0,0,0.25)}
      #tm-fab svg{width:13px;height:13px;stroke:currentColor;stroke-width:1.8;fill:none;flex-shrink:0}
      #tm-fab-swatch{width:13px;height:13px;border-radius:3px;flex-shrink:0;border:1px solid rgba(255,255,255,0.18)}

      /* Versão light do FAB */
      body.tm-light #tm-fab{
        background:rgba(255,255,255,0.92);
        border:1px solid rgba(200,210,230,0.5);
        color:#1a1f36;
        box-shadow:0 2px 8px rgba(100,120,180,0.1);
      }
      body.tm-light #tm-fab:hover{
        background:#ffffff;
        box-shadow:0 4px 14px rgba(100,120,180,0.16);
      }

      #tm-panel{
        position:fixed;top:53px;left:300px;z-index:9299;
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
        setTimeout(_makeVitoGraggable, 2000);
        console.log('✅ ThemeManager iniciado · 4 temas disponíveis');
      }
    }, 100);
  }

  function _makeVitoGraggable() {
    const KEY = 'vito_pos';
    function tryAttach() {
      const el = document.getElementById('vito-fab');
      if (!el) { setTimeout(tryAttach, 800); return; }
      if (el._vtDrag) return;
      el._vtDrag = true;
      let dragging = false, sx, sy, sl, st;
      function setPos(l, t) {
        el.style.setProperty('position','fixed','important');
        el.style.setProperty('left',l+'px','important');
        el.style.setProperty('top',t+'px','important');
        el.style.setProperty('right','auto','important');
        el.style.setProperty('bottom','auto','important');
      }
      try { const s=JSON.parse(localStorage.getItem(KEY)); if(s) setPos(s.l,s.t); } catch(e){}
      el.style.cursor='grab';
      function start(e) { const p=e.touches?e.touches[0]:e; dragging=true; sx=p.clientX; sy=p.clientY; const r=el.getBoundingClientRect(); sl=r.left; st=r.top; el.style.transition='none'; el.style.cursor='grabbing'; e.stopPropagation(); }
      function move(e) { if(!dragging) return; const p=e.touches?e.touches[0]:e; const W=window.innerWidth,H=window.innerHeight,S=el.offsetWidth||60; const l=Math.max(0,Math.min(W-S,sl+p.clientX-sx)); const t=Math.max(64,Math.min(H-S-8,st+p.clientY-sy)); setPos(l,t); e.preventDefault(); }
      function end() { if(!dragging) return; dragging=false; el.style.cursor='grab'; const r=el.getBoundingClientRect(); const W=window.innerWidth,H=window.innerHeight,S=r.width,M=16; const snapL=(r.left+S/2)<W/2?M:W-S-M; const snapT=(r.top+S/2)<H/2?80:H-S-M; el.style.transition='left .35s cubic-bezier(.34,1.56,.64,1),top .35s cubic-bezier(.34,1.56,.64,1)'; setPos(snapL,snapT); try{localStorage.setItem(KEY,JSON.stringify({l:snapL,t:snapT}));}catch(e){} }
      el.addEventListener('mousedown',start,{passive:false}); el.addEventListener('touchstart',start,{passive:false});
      window.addEventListener('mousemove',move); window.addEventListener('touchmove',move,{passive:false});
      window.addEventListener('mouseup',end); window.addEventListener('touchend',end);
    }
    tryAttach();
  }

  return { init, apply, togglePanel, THEMES };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
window.ThemeManager = ThemeManager;
