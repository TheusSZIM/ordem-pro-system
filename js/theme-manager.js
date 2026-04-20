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

    // ── 2. PREMIUM — Dark Premium Orange (Manus) ──────────
    premium: {
      label:   'Premium',
      sub:     'Dark Orange',
      icon:    '◆',
      preview: ['#1a1a1a', '#ff6b00'],
      fonts:   [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      ],
      css: `
        /* ══ PREMIUM — Dark Orange ══ */
        :root {
          --tm-bg:        #0f0f0f;
          --tm-bg1:       #1a1a1a;
          --tm-bg2:       #252525;
          --tm-bg3:       #2e2e2e;
          --tm-accent:    #ff6b00;
          --tm-accent2:   #ff8c00;
          --tm-accent-dim:rgba(255,107,0,0.12);
          --tm-border:    #3a3a3a;
          --tm-t1:        #ffffff;
          --tm-t2:        #cccccc;
          --tm-t3:        #999999;
        }

        body, html {
          background: linear-gradient(135deg,#0f0f0f 0%,#1a1a1a 100%) !important;
          color: #ffffff !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }
        body::before { display:none !important; }
        body::after  { display:none !important; }
        .bg-grid     { display:none !important; }

        /* Sidebar */
        #sidebar, aside, .sidebar, #sidebar-container > * {
          background: linear-gradient(180deg,#1a1a1a 0%,#151515 100%) !important;
          border-right: 1px solid #3a3a3a !important;
          box-shadow: 8px 0 16px rgba(0,0,0,0.5) !important;
          width: 280px !important;
        }
        #main-content, #main-content.sb-mini { margin-left: 280px !important; }

        /* Logo */
        #sidebar .rounded-xl, #sidebar .rounded-2xl,
        [id*="logo-icon"], .logo-icon {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          box-shadow: 0 4px 12px rgba(255,107,0,0.3) !important;
        }

        /* Nav items */
        #sidebar a, #sidebar button, .nav-item, aside a {
          color: #888888 !important;
          background: transparent !important;
          border-radius: 10px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          font-family: 'Inter', sans-serif !important;
          transition: all 0.3s ease !important;
        }
        #sidebar a:hover, .nav-item:hover {
          background: rgba(255,107,0,0.1) !important;
          color: #ff6b00 !important;
          transform: translateX(4px) !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: linear-gradient(135deg,rgba(255,107,0,0.2),rgba(255,107,0,0.05)) !important;
          color: #ff6b00 !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          background: #ff6b00 !important;
          box-shadow: none !important;
        }

        /* Section labels */
        .nav-section-title, [class*="nav-section"],
        #sidebar .text-xs.uppercase { color: #666666 !important; }

        /* Header */
        header, #topbar, #header-container > * {
          background: #1a1a1a !important;
          border-bottom: 1px solid #3a3a3a !important;
          backdrop-filter: none !important;
        }
        #global-search, #search-input {
          background: #252525 !important;
          border: 1px solid #3a3a3a !important;
          color: #ffffff !important;
        }
        #global-search::placeholder { color: #666666 !important; }
        #user-avatar {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          border: none !important; box-shadow: none !important;
        }
        #user-name { color: #ffffff !important; }
        #user-role { color: #ff6b00 !important; background: none !important;
          -webkit-text-fill-color: #ff6b00 !important; }
        header button, header .ib {
          background: #252525 !important; border: 1px solid #3a3a3a !important;
          color: #999999 !important;
        }
        [id*="notification-badge"] { background: #ff6b00 !important; }

        /* Cards */
        .card, [class*="card"], .rounded-xl, .rounded-2xl,
        [class*="bg-white"], [class*="dark:bg-slate"] {
          background: #252525 !important;
          border: 1px solid #3a3a3a !important;
          backdrop-filter: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }
        .card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; }
        .card::after, [class*="card"]::after, .rounded-xl::after { display:none !important; }

        /* Page title */
        #dashboard-title, .page-title, h1 { color: #ffffff !important; font-family: 'Inter', sans-serif !important; }
        #dashboard-title span, .page-title span, h1 span {
          color: #ff6b00 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #ff6b00 !important;
        }

        /* Botão Nova Ordem */
        #nova-ordem-btn, .btn-primary, [id*="nova-ordem"],
        button[class*="bg-indigo"] {
          background: linear-gradient(135deg,#ff6b00,#ff8c00) !important;
          background-image: none !important;
          border: none !important;
          box-shadow: 0 4px 16px rgba(255,107,0,0.35) !important;
          color: #fff !important;
        }
        #nova-ordem-btn:hover { box-shadow: 0 6px 24px rgba(255,107,0,0.5) !important; }

        /* Layout switcher */
        #layout-switcher button.active, [id*="btn-layout"].active {
          background: #ff6b00 !important; border-color: transparent !important;
        }

        /* Tabelas */
        thead, thead tr { background: #1a1a1a !important; }
        th { color: #666666 !important; border-bottom: 1px solid #3a3a3a !important; }
        tr { border-bottom: 1px solid rgba(58,58,58,0.5) !important; }
        tr:hover td { background: rgba(255,107,0,0.04) !important; }
        td { color: #cccccc !important; }
        td:first-child { color: #ff6b00 !important; -webkit-text-fill-color: #ff6b00 !important; background: none !important; }

        /* Badges */
        [class*="fila"], [class*="pending"], .badge-fila {
          background: rgba(255,107,0,0.12) !important; color: #ff8c00 !important;
          border-color: rgba(255,107,0,0.25) !important;
        }
        [class*="ativo"], [class*="progress"] { background: rgba(59,130,246,0.12) !important; color: #60a5fa !important; border-color: rgba(59,130,246,0.25) !important; }
        [class*="pronto"], [class*="completed"] { background: rgba(34,197,94,0.1) !important; color: #4ade80 !important; border-color: rgba(34,197,94,0.2) !important; }
        [class*="entregue"], [class*="delivered"] { background: rgba(168,85,247,0.1) !important; color: #c084fc !important; border-color: rgba(168,85,247,0.2) !important; }

        /* Inputs */
        input:not([type="range"]):not([type="checkbox"]), select, textarea {
          background: #252525 !important; border: 1px solid #3a3a3a !important; color: #ffffff !important;
        }
        input:focus, select:focus { border-color: #ff6b00 !important; box-shadow: 0 0 0 3px rgba(255,107,0,0.15) !important; }
        label { color: #999999 !important; }

        /* Kanban */
        .kanban-col, [class*="kanban-col"] { background: #252525 !important; border-color: #3a3a3a !important; }
        .kanban-card, [class*="kanban-card"] { background: #2e2e2e !important; border-color: rgba(255,107,0,0.1) !important; }
        .kanban-card:hover { border-color: rgba(255,107,0,0.3) !important; }

        /* Modais */
        .modal, [class*="modal-container"], [id*="-modal"] > div > div {
          background: #252525 !important; border-color: #3a3a3a !important;
        }
        [class*="modal-header"] { background: linear-gradient(135deg,rgba(255,107,0,0.08),transparent) !important; }
        .modal-overlay, [id*="modal-overlay"] { background: rgba(0,0,0,0.8) !important; backdrop-filter: blur(4px) !important; }

        /* Textos slate */
        [class*="text-slate-3"] { color: #ffffff !important; }
        [class*="text-slate-4"], [class*="text-slate-5"] { color: #cccccc !important; }
        [class*="text-slate-6"], [class*="text-slate-7"] { color: #999999 !important; }
        [class*="bg-slate-9"], [class*="bg-slate-8"] { background-color: #1a1a1a !important; }
        [class*="border-slate"] { border-color: #3a3a3a !important; }
        [class*="text-indigo"] { color: #ff6b00 !important; }
        [class*="bg-indigo"], [class*="from-indigo"] { background: transparent !important; }

        /* Sidebar footer / user */
        #sidebar-footer, .sidebar-footer, [id*="sidebar-footer"] {
          border-top: 1px solid #3a3a3a !important;
        }
        .user-profile, [class*="user-profile"] {
          background: rgba(255,107,0,0.05) !important;
          border: 1px solid rgba(255,107,0,0.1) !important;
        }

        /* Dropdowns */
        .dropdown, [class*="dropdown-menu"], [id*="user-menu"] {
          background: #252525 !important; border-color: #3a3a3a !important;
        }
        .dropdown-item:hover { background: rgba(255,107,0,0.08) !important; color: #ff6b00 !important; }

        /* Scrollbar */
        * { scrollbar-color: rgba(255,107,0,0.3) transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.3); }

        /* SVG donut */
        svg circle[stroke*="6366"], svg circle[stroke*="4f46"] { stroke: #ff6b00 !important; }
      `,
    },

    // ── 3. NEON — Dark Neon Gradient (Claude3) ─────────────
    neon: {
      label:   'Neon',
      sub:     'Dark Gradient',
      icon:    '◉',
      preview: ['#0a0a12', '#7b2ff7', '#ff6b35'],
      fonts:   [
        'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
      ],
      css: `
        /* ══ NEON — Dark Gradient ══ */
        body, html {
          background: #0a0a12 !important;
          color: #f0eaff !important;
          font-family: 'Space Grotesk', system-ui, sans-serif !important;
        }
        body::before {
          content: '' !important; display: block !important;
          position: fixed !important; inset: 0 !important;
          background:
            radial-gradient(ellipse 80% 50% at 10% 80%, rgba(255,107,53,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 90% 90%, rgba(123,47,247,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 10%, rgba(76,201,240,0.06) 0%, transparent 50%) !important;
          pointer-events: none !important; z-index: 0 !important;
        }
        body::after {
          content: '' !important; display: block !important;
          position: fixed !important; inset: 0 !important;
          background-image:
            linear-gradient(rgba(120,80,220,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,80,220,0.04) 1px, transparent 1px) !important;
          background-size: 48px 48px !important;
          pointer-events: none !important; z-index: 0 !important;
        }
        .bg-grid { display:none !important; }

        /* Sidebar */
        #sidebar, aside, .sidebar, #sidebar-container > * {
          background: rgba(10,8,20,0.97) !important;
          border-right: 1px solid rgba(120,80,220,0.18) !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: none !important;
          width: 240px !important;
        }
        #main-content { margin-left: 240px !important; }

        /* Logo */
        [id*="logo-icon"], .logo-icon {
          background: linear-gradient(135deg,#ff6b35,#7b2ff7) !important;
          box-shadow: 0 0 20px rgba(255,107,53,0.4) !important;
        }
        #logo-name { font-family: 'Syne', sans-serif !important; font-weight: 800 !important;
          background: linear-gradient(90deg,#ff8c42,#c77dff) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }

        /* Nav items */
        #sidebar a, #sidebar button, .nav-item, aside a {
          color: #8b7aaa !important; background: transparent !important;
          font-family: 'Space Grotesk', sans-serif !important; font-size: 13.5px !important;
          border-radius: 10px !important; transition: all 0.25s !important;
        }
        #sidebar a:hover, .nav-item:hover {
          background: rgba(123,47,247,0.12) !important; color: #c77dff !important; transform: none !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: linear-gradient(90deg,rgba(255,107,53,0.15),rgba(123,47,247,0.15)) !important;
          color: #ff8c42 !important; border: 1px solid rgba(255,107,53,0.2) !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before { display:none !important; }

        /* Nav badges */
        .nav-badge, [class*="nav-badge"] {
          background: linear-gradient(90deg,#ff6b35,#f72585) !important;
          color: white !important; border-radius: 20px !important;
        }

        /* Header */
        header, #topbar, #header-container > * {
          background: rgba(10,8,20,0.9) !important;
          border-bottom: 1px solid rgba(120,80,220,0.18) !important;
          backdrop-filter: blur(20px) !important;
        }
        #global-search, #search-input {
          background: rgba(30,20,50,0.8) !important;
          border: 1px solid rgba(120,80,220,0.18) !important;
          color: #f0eaff !important;
        }
        #global-search:focus { border-color: rgba(123,47,247,0.5) !important; }
        #global-search::placeholder { color: #5a4d72 !important; }
        header button, header .ib {
          background: rgba(30,20,50,0.8) !important;
          border: 1px solid rgba(120,80,220,0.18) !important; color: #8b7aaa !important;
        }
        header button:hover { border-color: rgba(180,100,255,0.3) !important; color: #c77dff !important; }
        #user-avatar {
          background: linear-gradient(135deg,#9d4edd,#f72585) !important;
          border: 1px solid rgba(123,47,247,0.3) !important; box-shadow: none !important;
        }
        #user-name { color: #f0eaff !important; font-family: 'Space Grotesk', sans-serif !important; }
        #user-role {
          background: linear-gradient(90deg,#ff8c42,#c77dff) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }
        [id*="notification-badge"] { background: #ff6b35 !important; box-shadow: 0 0 6px #ff6b35 !important; }

        /* Cards */
        .card, [class*="card"], .rounded-xl, .rounded-2xl,
        [class*="bg-white"], [class*="dark:bg-slate"] {
          background: rgba(18,16,32,0.85) !important;
          border: 1px solid rgba(120,80,220,0.18) !important;
          backdrop-filter: blur(12px) !important;
          box-shadow: none !important;
        }
        .card:hover { border-color: rgba(180,100,255,0.3) !important; box-shadow: 0 0 30px rgba(123,47,247,0.08) !important; }
        .card::after, .rounded-xl::after { display:none !important; }

        /* Page title */
        #dashboard-title, .page-title, h1 {
          font-family: 'Syne', sans-serif !important; font-weight: 800 !important;
          color: #f0eaff !important;
        }
        #dashboard-title span, .page-title span, h1 span {
          background: linear-gradient(90deg,#ff8c42,#9d4edd,#c77dff) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Botão Nova Ordem */
        #nova-ordem-btn, .btn-primary, [id*="nova-ordem"], button[class*="bg-indigo"] {
          background: linear-gradient(135deg,#ff6b35,#7b2ff7) !important;
          background-image: none !important; border: none !important;
          box-shadow: 0 0 20px rgba(255,107,53,0.3) !important; color: #fff !important;
        }

        /* Layout switcher */
        #layout-switcher button.active {
          background: linear-gradient(135deg,#ff6b35,#7b2ff7) !important;
          border-color: transparent !important;
        }

        /* Tabelas */
        thead, thead tr { background: rgba(10,8,20,0.8) !important; }
        th { color: #5a4d72 !important; border-color: rgba(120,80,220,0.18) !important; }
        tr { border-color: rgba(120,80,220,0.08) !important; }
        tr:hover td { background: rgba(123,47,247,0.05) !important; }
        td { color: #8b7aaa !important; }
        td:first-child {
          background: linear-gradient(90deg,#ff8c42,#c77dff) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Badges */
        [class*="fila"], [class*="pending"] { background: rgba(255,107,53,0.1) !important; color: #ff8c42 !important; border-color: rgba(255,107,53,0.25) !important; }
        [class*="ativo"], [class*="progress"] { background: rgba(76,201,240,0.1) !important; color: #4cc9f0 !important; border-color: rgba(76,201,240,0.2) !important; }
        [class*="pronto"], [class*="completed"] { background: rgba(6,214,160,0.1) !important; color: #06d6a0 !important; border-color: rgba(6,214,160,0.2) !important; }
        [class*="entregue"], [class*="delivered"] { background: rgba(247,37,133,0.1) !important; color: #f72585 !important; border-color: rgba(247,37,133,0.2) !important; }

        /* Inputs */
        input:not([type="range"]):not([type="checkbox"]), select, textarea {
          background: rgba(30,20,50,0.8) !important;
          border: 1px solid rgba(120,80,220,0.18) !important; color: #f0eaff !important;
        }
        input:focus, select:focus { border-color: rgba(123,47,247,0.5) !important; box-shadow: 0 0 0 3px rgba(123,47,247,0.12) !important; }
        input::placeholder { color: #5a4d72 !important; }
        label { color: #8b7aaa !important; }
        option { background: #0a0a12 !important; }

        /* Kanban */
        .kanban-col { background: rgba(18,16,32,0.7) !important; border-color: rgba(120,80,220,0.18) !important; }
        .kanban-card { background: rgba(22,18,40,0.9) !important; border-color: rgba(120,80,220,0.12) !important; }
        .kanban-card:hover { border-color: rgba(180,100,255,0.3) !important; }

        /* Modais */
        .modal, [id*="-modal"] > div > div { background: rgba(18,16,32,0.97) !important; border-color: rgba(180,100,255,0.3) !important; }
        [class*="modal-header"] { background: linear-gradient(135deg,rgba(255,107,53,0.07),rgba(123,47,247,0.07)) !important; }
        .modal-overlay { background: rgba(4,2,12,0.85) !important; backdrop-filter: blur(8px) !important; }

        /* Override */
        [class*="text-slate-3"] { color: #f0eaff !important; }
        [class*="text-slate-4"], [class*="text-slate-5"] { color: #8b7aaa !important; }
        [class*="text-slate-6"], [class*="text-slate-7"] { color: #5a4d72 !important; }
        [class*="bg-slate-9"], [class*="bg-slate-8"] { background-color: rgba(10,8,20,0.97) !important; }
        [class*="border-slate"] { border-color: rgba(120,80,220,0.18) !important; }
        [class*="text-indigo"] { color: #c77dff !important; }
        [class*="bg-indigo"], [class*="from-indigo"] { background: transparent !important; }

        /* Dropdowns */
        .dropdown, [id*="user-menu"] { background: rgba(10,8,20,0.98) !important; border-color: rgba(180,100,255,0.3) !important; }
        .dropdown-item:hover { background: rgba(123,47,247,0.12) !important; color: #c77dff !important; }

        /* Scrollbar */
        * { scrollbar-color: rgba(123,47,247,0.4) transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(123,47,247,0.4) !important; }

        svg circle[stroke*="6366"] { stroke: #7b2ff7 !important; }
      `,
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
          letter-spacing:normal!important;white-space:nowrap!important;
        }

        /* ── CSS Vars (claude.html) ── */
        :root {
          --clbg:#f0f2f8; --clsurf:#ffffff; --clsurf2:#f7f8fc;
          --clbdr:rgba(200,210,230,0.5); --cltext:#1a1f36; --clmut:#8a93b2;
          --clgrad:linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%);
          --clsh:0 2px 12px rgba(100,120,180,0.07);
          --clsh2:0 6px 28px rgba(100,120,180,0.11);
        }

        /* ── Backgrounds ── */
        html, body { background-color: var(--clbg) !important; }
        body::before, body::after, .bg-grid { display:none!important; }

        /* ── Textos dark→light ── */
        body, .dark body { color: var(--cltext) !important; }
        .dark\:text-white, .dark\:text-slate-100, .dark\:text-slate-200 { color: var(--cltext) !important; }
        .dark\:text-slate-400, .dark\:text-slate-500 { color: var(--clmut) !important; }
        .dark\:bg-slate-950,.dark\:bg-slate-900,.dark\:bg-slate-800 { background-color: var(--clsurf) !important; }
        .bg-slate-50 { background-color: var(--clbg) !important; }

        /* ── SIDEBAR 72px ── */
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

        /* Esconde só textos da sidebar */
        #sidebar .logo-text, #sidebar [class*="logo-sub"],
        #sidebar [class*="text-xs"]:not(.material-symbols-rounded),
        #sidebar [class*="nav-section"], #sidebar [class*="tracking-wider"],
        #sidebar p, #sidebar [class*="text-sm"]:not(.material-symbols-rounded) { display:none!important; }

        /* Nav items */
        #sidebar a, #sidebar button, .nav-item, [class*="nav-item"] {
          color:var(--clmut)!important;
          background:transparent!important; background-image:none!important;
          border:none!important; box-shadow:none!important;
        }
        #sidebar a:hover,.nav-item:hover { background:var(--clsurf2)!important; color:var(--cltext)!important; }
        #sidebar a.active,.nav-item.active,.nav-item.active-nav {
          background:linear-gradient(135deg,rgba(255,107,157,.12),rgba(160,77,255,.12))!important;
          color:#c44dff!important;
        }
        #sidebar a.active::before,.nav-item.active::before,.nav-item.active-nav::before {
          background:var(--clgrad)!important; box-shadow:none!important;
        }
        [id*="logo-icon"] { background:var(--clgrad)!important; box-shadow:0 6px 16px rgba(255,107,157,.35)!important; }

        /* ── HEADER ── */
        header,#topbar,#header-container>* {
          background:var(--clsurf)!important;
          border-bottom:1px solid var(--clbdr)!important;
          backdrop-filter:none!important;
          box-shadow:var(--clsh)!important;
        }
        #global-search,#search-input {
          background:var(--clsurf2)!important; border:1px solid var(--clbdr)!important;
          color:var(--cltext)!important; border-radius:12px!important;
        }
        #global-search::placeholder { color:var(--clmut)!important; }
        #global-search:focus { border-color:#c44dff!important; box-shadow:0 0 0 3px rgba(196,77,255,.1)!important; }
        header button,header .ib {
          background:var(--clsurf2)!important; border:1px solid var(--clbdr)!important; color:var(--clmut)!important;
        }
        header button:hover { background:var(--clbg)!important; color:var(--cltext)!important; }
        #user-avatar { background:var(--clgrad)!important; border:none!important; box-shadow:0 4px 12px rgba(255,107,157,.3)!important; color:#fff!important; }
        #user-name { color:var(--cltext)!important; }
        #user-role { color:var(--clmut)!important; background:none!important; -webkit-text-fill-color:var(--clmut)!important; }

        /* ── Título ── */
        .text-gradient,#dashboard-title span,.page-title span,h1 span {
          background:var(--clgrad)!important;
          -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important;
        }
        #dashboard-title,h1[class*="text-2xl"],h1[class*="text-3xl"],
        h2[class*="font-bold"],h3[class*="font-bold"] { color:var(--cltext)!important; }

        /* ── METRIC CARDS ── */
        .metric-card {
          background:var(--clsurf)!important; border:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important; color:var(--cltext)!important;
          border-radius:20px!important;
        }
        .metric-card:hover { transform:translateY(-2px) scale(1.01)!important; box-shadow:var(--clsh2)!important; }

        /* Números — sem gradiente */
        #stat-a-separar-wrap h3, #stat-em-separacao-wrap h3,
        #stat-concluidas-hoje-wrap h3 {
          color:var(--cltext)!important; -webkit-text-fill-color:var(--cltext)!important;
          background:none!important; font-size:2rem!important; font-weight:800!important;
        }
        #stat-total-wrap h3 {
          color:#fff!important; -webkit-text-fill-color:#fff!important;
          background:none!important; font-size:2rem!important; font-weight:800!important;
        }

        /* Card Total — warm gradient */
        .metric-card[style*="4f46e5"], .metric-card[style*="6366f1"] {
          background:var(--clgrad)!important; border:none!important;
          box-shadow:0 8px 28px rgba(255,107,157,.3)!important;
        }
        .metric-card[style*="4f46e5"] * {
          color:rgba(255,255,255,.9)!important; -webkit-text-fill-color:rgba(255,255,255,.9)!important;
        }
        .metric-card[style*="4f46e5"] .rounded-2xl { background:rgba(255,255,255,.2)!important; }
        .metric-card p.text-xs { color:var(--clmut)!important; }

        /* ── Cards white ── */
        .bg-white.rounded-2xl, .bg-white.rounded-xl,
        .dark\:bg-slate-900.rounded-2xl, .dark\:bg-slate-900.rounded-xl {
          background:var(--clsurf)!important;
          border:1px solid var(--clbdr)!important;
          box-shadow:var(--clsh)!important;
        }
        .bg-white.rounded-2xl *:not(.material-symbols-rounded),
        .dark\:bg-slate-900.rounded-2xl *:not(.material-symbols-rounded),
        .bg-white.rounded-xl *:not(.material-symbols-rounded) { color:var(--cltext)!important; }

        /* ── Botão Nova Ordem ── */
        button.bg-primary-600, button[class*="bg-primary-6"], button[class*="bg-primary-7"],
        #nova-ordem-btn, [id*="nova-ordem"] {
          background:var(--clgrad)!important; border:none!important; color:#fff!important;
          font-weight:700!important; box-shadow:0 6px 20px rgba(255,107,157,.35)!important;
          border-radius:14px!important;
        }
        button.bg-primary-600 span, button[class*="bg-primary-6"] span { color:#fff!important; -webkit-text-fill-color:#fff!important; }

        /* Botões Semana/Mês + layout */
        .chart-mode-btn { color:var(--clmut)!important; border-color:var(--clbdr)!important; background:transparent!important; }
        .active-chart-btn { background:var(--clgrad)!important; border-color:transparent!important; color:#fff!important; }
        .layout-btn { color:var(--clmut)!important; border-color:var(--clbdr)!important; background:transparent!important; }
        .layout-btn.active-layout { background:rgba(196,77,255,.1)!important; border-color:rgba(196,77,255,.35)!important; color:#c44dff!important; }

        /* ── Tabelas ── */
        thead,thead tr { background:var(--clsurf2)!important; }
        th { color:var(--clmut)!important; border-bottom:1px solid var(--clbdr)!important; background:var(--clsurf2)!important; }
        tr { border-bottom:1px solid rgba(200,210,230,.3)!important; }
        tr:hover td { background:var(--clsurf2)!important; }
        td { color:var(--cltext)!important; background:transparent!important; }
        td:first-child { background:var(--clgrad)!important; -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important; font-weight:700!important; }

        /* ── Badges ── */
        [class*="fila"],[class*="pending"]    { background:rgba(255,159,67,.12)!important; color:#ff9f43!important; border:1px solid rgba(255,159,67,.22)!important; }
        [class*="ativo"],[class*="progress"]  { background:rgba(84,160,255,.12)!important; color:#54a0ff!important; border:1px solid rgba(84,160,255,.2)!important; }
        [class*="pronto"],[class*="completed"]{ background:rgba(29,209,161,.12)!important; color:#1dd1a1!important; border:1px solid rgba(29,209,161,.2)!important; }
        [class*="entregue"],[class*="delivered"]{ background:rgba(162,155,254,.12)!important; color:#a29bfe!important; border:1px solid rgba(162,155,254,.2)!important; }

        /* ── Dots legenda ── */
        .bg-amber-400.rounded-full,span.bg-amber-400 { background-color:#ff6b9d!important; }
        .bg-blue-500.rounded-full,span.bg-blue-500 { background-color:#a29bfe!important; }

        /* ── Inputs ── */
        input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),select,textarea {
          background:var(--clsurf2)!important; border:1px solid var(--clbdr)!important; color:var(--cltext)!important;
        }
        input:focus,select:focus { border-color:#c44dff!important; box-shadow:0 0 0 3px rgba(196,77,255,.1)!important; }
        input::placeholder { color:var(--clmut)!important; }

        /* ── Modais ── */
        .modal-overlay,[id*="modal-overlay"] { background:rgba(100,120,180,.3)!important; backdrop-filter:blur(8px)!important; }
        [id*="-modal"]>div>div { background:var(--clsurf)!important; border:1px solid var(--clbdr)!important; }
        [class*="modal-header"] { background:var(--clsurf2)!important; border-bottom:1px solid var(--clbdr)!important; }

        /* ── Vito ── */
        #vito-panel { background:rgba(255,255,255,.98)!important; border:1px solid rgba(200,210,230,.6)!important; }
        #vito-head { background:linear-gradient(135deg,rgba(255,107,157,.06),rgba(196,77,255,.04))!important; border-bottom-color:var(--clbdr)!important; }
        #vito-head-name { color:var(--cltext)!important; }
        #vito-head-sub { color:#c44dff!important; -webkit-text-fill-color:#c44dff!important; background:none!important; }
        #vito-head-dot { background:#1dd1a1!important; }
        .vbub.bot { background:rgba(196,77,255,.05)!important; border-color:rgba(196,77,255,.15)!important; color:var(--cltext)!important; }
        .vbub.usr { background:var(--clgrad)!important; color:#fff!important; }
        .vdot { background:#c44dff!important; }
        #vito-inp { background:var(--clsurf2)!important; border-color:var(--clbdr)!important; color:var(--cltext)!important; }
        #vito-send { background:var(--clgrad)!important; }
        #vito-fab { filter:drop-shadow(0 4px 12px rgba(255,107,157,.35))!important; }
        #vito-hints,#vito-foot { border-top-color:var(--clbdr)!important; }

        /* ══ LAYOUT 1 — CLÁSSICO ══════════════════════════════════ */
        /* Chart card + distribuição */
        #layout-classic .bg-white.dark\:bg-slate-900,
        #layout-classic .dark\:bg-slate-900 {
          background: var(--clsurf) !important;
          border: 1px solid var(--clbdr) !important;
          box-shadow: var(--clsh) !important;
        }
        /* Textos dentro dos cards do clássico */
        #layout-classic h3 { color: var(--cltext) !important; }
        #layout-classic p.text-xs, #layout-classic p.text-slate-400,
        #layout-classic .text-slate-400, #layout-classic .text-slate-500 {
          color: var(--clmut) !important;
        }
        /* Linha separadora */
        #layout-classic .border-slate-100, #layout-classic .dark\:border-slate-800 {
          border-color: var(--clbdr) !important;
        }
        /* Thead da tabela ordens recentes */
        #layout-classic thead tr { background: var(--clsurf2) !important; }
        #layout-classic th { color: var(--clmut) !important; border-color: var(--clbdr) !important; }
        #layout-classic td { color: var(--cltext) !important; }
        #layout-classic tbody tr:hover td { background: var(--clsurf2) !important; }
        /* Ações rápidas */
        #layout-classic button.w-full:hover { background: var(--clsurf2) !important; }
        #layout-classic button.w-full p { color: var(--cltext) !important; }
        #layout-classic button.w-full span.text-xs { color: var(--clmut) !important; }
        /* Bot ver todas */
        #layout-classic button.text-primary-600 { color: #c44dff !important; }

        /* ══ LAYOUT 2 — ANALYTICS ═══════════════════════════════════ */
        #layout-analytics .metric-card,
        #layout-analytics .bg-white.dark\:bg-slate-900,
        #layout-analytics .dark\:bg-slate-900 {
          background: var(--clsurf) !important;
          border: 1px solid var(--clbdr) !important;
          box-shadow: var(--clsh) !important;
          color: var(--cltext) !important;
        }
        /* Card escuro de eficiência (analytics) */
        #layout-analytics .metric-card[style*="1e293b"],
        #layout-analytics .metric-card[style*="0f172a"],
        #layout-analytics [style*="background:#1e293b"],
        #layout-analytics [style*="background:#0f172a"] {
          background: var(--clsurf) !important;
          border: 1px solid var(--clbdr) !important;
        }
        #layout-analytics .metric-card[style*="1e293b"] *,
        #layout-analytics .metric-card[style*="0f172a"] * { color: var(--cltext) !important; }
        #layout-analytics h3 { color: var(--cltext) !important; }
        #layout-analytics .text-slate-400, #layout-analytics .text-slate-500,
        #layout-analytics .dark\:text-slate-400 { color: var(--clmut) !important; }
        #layout-analytics .border-slate-100, #layout-analytics .dark\:border-slate-800,
        #layout-analytics .border-t { border-color: var(--clbdr) !important; }
        /* Barras de progresso — fundo */
        #layout-analytics .bg-slate-100, #layout-analytics .dark\:bg-slate-800 {
          background: var(--clsurf2) !important;
        }
        /* Timeline items */
        #layout-analytics .tl-card, #layout-analytics [class*="tl-card"] {
          background: var(--clsurf2) !important;
          border-color: var(--clbdr) !important;
          color: var(--cltext) !important;
        }
        #layout-analytics .tl-card:hover { background: rgba(196,77,255,.06) !important; }
        #layout-analytics #al-timeline * { color: var(--cltext) !important; }

        /* ══ LAYOUT 3 — COMPACTO ════════════════════════════════════ */
        #layout-compact .bg-white.dark\:bg-slate-900,
        #layout-compact .bg-white.dark\:bg-slate-900.rounded-xl,
        #layout-compact .dark\:bg-slate-900 {
          background: var(--clsurf) !important;
          border: 1px solid var(--clbdr) !important;
          box-shadow: var(--clsh) !important;
        }
        #layout-compact h3 { color: var(--cltext) !important; }
        #layout-compact .text-slate-400, #layout-compact .dark\:text-slate-400,
        #layout-compact .text-slate-500 { color: var(--clmut) !important; }
        #layout-compact .border-slate-200, #layout-compact .dark\:border-slate-800,
        #layout-compact .divide-slate-100, #layout-compact .dark\:divide-slate-800 {
          border-color: var(--clbdr) !important;
        }
        /* Lista de ordens do compacto */
        #layout-compact #cp-orders-list > * { border-color: var(--clbdr) !important; }
        #layout-compact #cp-orders-list .text-slate-700,
        #layout-compact #cp-orders-list .dark\:text-slate-200 { color: var(--cltext) !important; }
        /* Ações rápidas compacto */
        #layout-compact .bg-primary-50, #layout-compact [class*="bg-primary-50"] {
          background: rgba(196,77,255,.08) !important;
        }
        #layout-compact .bg-indigo-50 { background: rgba(99,102,241,.08) !important; }
        #layout-compact .bg-violet-50 { background: rgba(139,92,246,.08) !important; }
        #layout-compact .bg-amber-50  { background: rgba(245,158,11,.08) !important; }
        #layout-compact .bg-emerald-50{ background: rgba(16,185,129,.08) !important; }
        #layout-compact [class*="text-primary-6"] { color: #c44dff !important; }
        /* Barras de progresso */
        #layout-compact .bg-amber-100, #layout-compact [class*="bg-amber-100"],
        #layout-compact .dark\:bg-amber-900 { background: rgba(245,158,11,.1) !important; }
        #layout-compact .bg-blue-100, #layout-compact .dark\:bg-blue-900 { background: rgba(59,130,246,.1) !important; }
        #layout-compact .bg-emerald-100, #layout-compact .dark\:bg-emerald-900 { background: rgba(16,185,129,.1) !important; }
        #layout-compact .bg-violet-100, #layout-compact .dark\:bg-violet-900 { background: rgba(139,92,246,.1) !important; }

        /* ══ LAYOUT 4 — COMMAND CENTER ══════════════════════════════ */
        /* Cards cmd — background hardcoded #0d1526 */
        #layout-command .cmd-card {
          background: var(--clsurf) !important;
          border: 1px solid var(--clbdr) !important;
          box-shadow: var(--clsh) !important;
        }
        #layout-command .cmd-card::before { display:none !important; }
        #layout-command .cmd-card:hover {
          border-color: rgba(196,77,255,.3) !important;
          box-shadow: var(--clsh2) !important;
        }

        /* Total card — mantém warm gradient */
        #layout-command .cmd-total-card {
          background: var(--clgrad) !important;
          border: none !important;
          box-shadow: 0 8px 28px rgba(255,107,157,.3) !important;
        }
        #layout-command .cmd-total-card::after { display:none !important; }
        #layout-command .cmd-total-card:hover { border-color: transparent !important; }
        #layout-command .cmd-total-card * { color: rgba(255,255,255,.9) !important; }
        #layout-command .cmd-trend {
          background: rgba(255,255,255,.2) !important; color: #fff !important;
        }
        #layout-command .cmd-number { color: #fff !important; letter-spacing:-3px; }

        /* Textos dentro dos cmd-cards */
        #layout-command .cmd-stat-num[style*="f59e0b"] { color: #f59e0b !important; }
        #layout-command .cmd-stat-num[style*="60a5fa"] { color: #60a5fa !important; }
        #layout-command .cmd-stat-num[style*="34d399"] { color: #34d399 !important; }
        #layout-command [style*="color:#64748b"], #layout-command [style*="color: #64748b"] {
          color: var(--clmut) !important;
        }
        #layout-command [style*="color:#e2e8f0"], #layout-command [style*="color: #e2e8f0"],
        #layout-command [style*="color:#f1f5f9"] { color: var(--cltext) !important; }
        #layout-command [style*="color:#475569"] { color: var(--clmut) !important; }
        #layout-command .cmd-section-label { color: var(--clmut) !important; }

        /* Linhas separadoras das ordens */
        #layout-command .cmd-order-row {
          border-bottom: 1px solid var(--clbdr) !important;
        }
        #layout-command .cmd-order-row:hover { background: rgba(196,77,255,.04) !important; }
        #layout-command .cmd-order-lote { color: var(--cltext) !important; }
        #layout-command .cmd-order-product { color: var(--clmut) !important; }
        #layout-command .cmd-order-date { color: var(--clmut) !important; }

        /* Badges cmd */
        #layout-command .cmd-badge-queue  { background:rgba(245,158,11,.1)!important; color:#f59e0b!important; border-color:rgba(245,158,11,.2)!important; }
        #layout-command .cmd-badge-active { background:rgba(59,130,246,.1)!important; color:#60a5fa!important; border-color:rgba(59,130,246,.2)!important; }
        #layout-command .cmd-badge-done   { background:rgba(16,185,129,.1)!important; color:#34d399!important; border-color:rgba(16,185,129,.2)!important; }
        #layout-command .cmd-badge-deliver{ background:rgba(139,92,246,.1)!important; color:#a78bfa!important; border-color:rgba(139,92,246,.2)!important; }

        /* Botões de ação cmd */
        #layout-command .cmd-action-btn[style*="rgba(99,102,241"] {
          background: rgba(196,77,255,.08) !important; border-color: rgba(196,77,255,.2) !important; color: #c44dff !important;
        }
        #layout-command .cmd-action-btn[style*="rgba(59,130,246"] {
          background: rgba(59,130,246,.08) !important; border-color: rgba(59,130,246,.2) !important; color: #60a5fa !important;
        }
        #layout-command .cmd-action-btn[style*="rgba(139,92,246"] {
          background: rgba(139,92,246,.08) !important; border-color: rgba(139,92,246,.2) !important; color: #a78bfa !important;
        }
        #layout-command .cmd-action-btn[style*="rgba(245,158,11"] {
          background: rgba(245,158,11,.08) !important; border-color: rgba(245,158,11,.2) !important; color: #f59e0b !important;
        }

        /* Arco de eficiência */
        #layout-command #cmd-efic { color: #10b981 !important; }

        /* Botão ver todas */
        #layout-command [style*="color:#6366f1"] { color: #c44dff !important; }
        #layout-command [style*="background:rgba(99,102,241"] {
          background: rgba(196,77,255,.08) !important;
          border-color: rgba(196,77,255,.2) !important;
          color: #c44dff !important;
        }

        /* ── Scrollbar ── */
        *{scrollbar-color:#dde3f0 transparent;}
        ::-webkit-scrollbar-thumb{background:#dde3f0;border-radius:3px;}
      `,
      onApply() {
        // NÃO remove a classe dark — Tailwind CDN regenera CSS e trava animações
        document.body.classList.add('tm-light');

        // Chart.js defaults light
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#8a93b2';
          Chart.defaults.borderColor = 'rgba(200,210,230,0.3)';
          Chart.defaults.font.family = "'DM Sans', sans-serif";
        }

        // Patch cores dos charts
        const PINK='#ff6b9d', PINK_A='rgba(255,107,157,0.15)';
        const PURP='#a29bfe', PURP_A='rgba(162,155,254,0.14)';
        let _t = 0;
        function patch() {
          if (typeof Chart === 'undefined') return;
          let ok = false;
          ['performanceChart','performanceChart2','performanceChart3'].forEach(id => {
            const ch = typeof Chart.getChart==='function'
              ? Chart.getChart(id)
              : Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
            if (!ch||!ch.data||!ch.data.datasets||!ch.data.datasets.length) return;
            const ds = ch.data.datasets;
            if(ds[0]){ds[0].borderColor=PINK;ds[0].backgroundColor=PINK_A;ds[0].pointBackgroundColor=PINK;ds[0].pointBorderColor='#fff';ds[0].pointBorderWidth=2;}
            if(ds[1]){ds[1].borderColor=PURP;ds[1].backgroundColor=PURP_A;ds[1].pointBackgroundColor=PURP;ds[1].pointBorderColor='#fff';ds[1].pointBorderWidth=2;}
            try {
              ['x','y'].forEach(ax=>{if(ch.options.scales&&ch.options.scales[ax]){ch.options.scales[ax].grid.color='rgba(200,210,230,0.2)';ch.options.scales[ax].ticks.color='#8a93b2';}});
              if(ch.options.plugins){
                if(ch.options.plugins.legend?.labels)ch.options.plugins.legend.labels.color='#8a93b2';
                if(ch.options.plugins.tooltip){ch.options.plugins.tooltip.backgroundColor='rgba(255,255,255,.96)';ch.options.plugins.tooltip.titleColor='#1a1f36';ch.options.plugins.tooltip.bodyColor='#8a93b2';ch.options.plugins.tooltip.borderColor='rgba(200,210,230,.6)';ch.options.plugins.tooltip.borderWidth=1;}
              }
            }catch(e){}
            ch.update('none'); ok=true;
          });
          document.querySelectorAll('.bg-amber-400,.bg-amber-400.rounded-full').forEach(el=>el.style.setProperty('background-color',PINK,'important'));
          document.querySelectorAll('.bg-blue-500,.bg-blue-500.rounded-full').forEach(el=>el.style.setProperty('background-color',PURP,'important'));
          if(!ok&&_t++<15) setTimeout(patch,350);
        }

        if(window.buildWeekChart&&!window._tm_origBWC){
          window._tm_origBWC=window.buildWeekChart;
          window.buildWeekChart=function(){window._tm_origBWC();_t=0;setTimeout(patch,100);};
        }
        if(window.updateCharts&&!window._tm_origUC){
          window._tm_origUC=window.updateCharts;
          window.updateCharts=function(){window._tm_origUC();_t=0;setTimeout(patch,120);};
        }

        [200,600,1400,3000].forEach(d=>setTimeout(patch,d));

        if(window._tm_obs)window._tm_obs.disconnect();
        window._tm_obs=new MutationObserver(()=>{_t=0;setTimeout(patch,150);});
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});

        // Sidebar fix sem mexer no main content (evita quebrar layout de carregamento)
        function fixSidebar() {
          const sb=document.getElementById('sidebar');
          if(sb){sb.style.setProperty('width','72px','important');sb.style.setProperty('min-width','72px','important');sb.style.setProperty('max-width','72px','important');}
          const main=document.getElementById('main-content');
          if(main)main.style.setProperty('margin-left','72px','important');
        }
        fixSidebar();
        setTimeout(fixSidebar,500);
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

  // Restaura cores padrão dos charts (ao sair do tema Light)
  function _restoreCharts() {
    try {
      // Desconecta observer
      if (window._tm_obs) { window._tm_obs.disconnect(); window._tm_obs = null; }
      window._tm_patchFn = null;

      // Restaura buildWeekChart / buildAnalyticsChart originais
      if (window._tm_origBWC) { window.buildWeekChart = window._tm_origBWC; window._tm_origBWC = null; }
      if (window._tm_origBAC) { window.buildAnalyticsChart = window._tm_origBAC; window._tm_origBAC = null; }

      if (typeof Chart === 'undefined') return;

      // Restaura defaults escuros
      Chart.defaults.color       = '#94a3b8';
      Chart.defaults.borderColor = 'rgba(148,163,184,0.12)';
      Chart.defaults.font.family = '"Plus Jakarta Sans", system-ui, sans-serif';

      // Restaura cores originais dos datasets e rebuilda
      if (typeof buildWeekChart    === 'function') buildWeekChart();
      if (typeof buildPieChart     === 'function') buildPieChart();
      if (typeof buildAnalyticsChart === 'function') buildAnalyticsChart();

      // Restaura dots de legenda HTML
      document.querySelectorAll('.bg-amber-400').forEach(el => { el.style.backgroundColor = ''; });
      document.querySelectorAll('.bg-blue-500').forEach(el  => { el.style.backgroundColor = ''; });

      // Restaura sidebar e main content para tamanho original
      const sb   = document.getElementById('sidebar');
      const main = document.getElementById('main-content');
      if (sb)   { sb.style.removeProperty('width'); sb.style.removeProperty('min-width'); }
      if (main) { main.style.removeProperty('margin-left'); main.style.removeProperty('transition'); }

      // Remove classe light do body
      document.body.classList.remove('tm-light');
    } catch(e) {}
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
