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

    // ── 4. LIGHT — Light Colorful (Claude) ─────────────────
    light: {
      label:   'Light',
      sub:     'Colorful Clear',
      icon:    '◇',
      preview: ['#f0f2f8', '#ff6b9d', '#c44dff'],
      fonts:   [
        'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap',
      ],
      css: `
        /* ══ LIGHT — Colorful Clear — fiel ao claude.html ══ */

        /* Fontes */
        body, button, input, select, textarea, td, th, label, p, span, div, a {
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }
        .material-symbols-rounded, [class*="material-symbols"], [class*="material-icons"] {
          font-family: 'Material Symbols Rounded' !important;
        }

        /* ── BASE ── */
        html, body, #app, .min-h-screen {
          background-color: #f0f2f8 !important;
          background: #f0f2f8 !important;
          color: #1a1f36 !important;
        }
        body::before, body::after { display:none !important; }
        .bg-grid { display:none !important; }

        /* Variáveis de cor light */
        :root {
          --surface:  #ffffff;
          --surface2: #f7f8fc;
          --bg:       #f0f2f8;
          --border-l: rgba(200,210,230,0.5);
          --text-l:   #1a1f36;
          --muted-l:  #8a93b2;
          --shadow-s: 0 2px 12px rgba(100,120,180,0.07);
          --shadow-m: 0 6px 28px rgba(100,120,180,0.11);
          --grad-w:   linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%);
        }

        /* ── SIDEBAR — 72px icon-only ── */
        #sidebar,
        #sidebar-container > *,
        aside,
        .sidebar,
        [id*="sidebar"] {
          width: 72px !important;
          min-width: 72px !important;
          max-width: 72px !important;
          background: #ffffff !important;
          border-right: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 2px 12px rgba(100,120,180,0.07) !important;
          backdrop-filter: none !important;
          overflow: hidden !important;
          padding: 24px 0 !important;
          align-items: center !important;
          display: flex !important;
          flex-direction: column !important;
        }

        /* Main content ajustado */
        #main-content {
          margin-left: 72px !important;
          padding-top: 64px !important;
        }
        #main-content.sb-mini { margin-left: 72px !important; }

        /* Esconde TUDO que não é ícone na sidebar */
        #sidebar *:not(.material-symbols-rounded):not([class*="material-symbols"]):not([class*="material-icons"]),
        #sidebar-container *:not(.material-symbols-rounded):not([class*="material-symbols"]):not([class*="material-icons"]),
        [id*="sidebar"] *:not(.material-symbols-rounded):not([class*="material-symbols"]):not([class*="material-icons"]) {
          font-size: 0 !important;
          letter-spacing: 0 !important;
          word-spacing: 0 !important;
        }
        /* Restaura os ícones */
        #sidebar .material-symbols-rounded,
        #sidebar [class*="material-symbols"],
        [id*="sidebar"] .material-symbols-rounded {
          font-size: 22px !important;
          font-family: 'Material Symbols Rounded' !important;
          display: block !important;
          visibility: visible !important;
          color: inherit !important;
        }
        /* Esconde textos específicos */
        #sidebar .text-sm, #sidebar .text-xs,
        #sidebar .font-bold:not(.material-symbols-rounded),
        #sidebar [class*="logo-text"],
        #sidebar [class*="logo-sub"],
        #sidebar [class*="nav-section"],
        #sidebar [class*="text-"]:not(.material-symbols-rounded),
        [id*="sidebar"] span:not(.material-symbols-rounded):not([class*="material"]),
        [id*="sidebar"] p, [id*="sidebar"] div > *:not(a):not(button):not(.material-symbols-rounded) {
          line-height: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Tab lateral - esconde */
        #sb-tab, .sidebar-toggle, [id*="sb-tab"] {
          display: none !important;
        }

        /* Logo — ícone centralizado */
        #sidebar .rounded-xl,
        #sidebar .rounded-2xl,
        [id*="logo-icon"],
        .logo-icon,
        #sidebar-container [class*="rounded"],
        #sidebar header {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          border-radius: 14px !important;
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          box-shadow: 0 6px 16px rgba(255,107,157,0.35) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 auto 16px !important;
          color: #fff !important;
          font-size: 20px !important;
        }

        /* Nav items — quadrado centralizado */
        #sidebar a, #sidebar button,
        .nav-item, [class*="nav-item"],
        aside a, aside button {
          width: 46px !important;
          height: 46px !important;
          min-width: 46px !important;
          border-radius: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 2px auto !important;
          padding: 0 !important;
          color: #8a93b2 !important;
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
          transition: all 0.2s !important;
          position: relative !important;
          text-decoration: none !important;
          flex-direction: column !important;
          gap: 0 !important;
        }
        #sidebar a:hover, .nav-item:hover, aside a:hover {
          background: #f7f8fc !important;
          color: #1a1f36 !important;
          transform: none !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav, aside a.active {
          background: linear-gradient(135deg,rgba(255,107,157,0.12),rgba(196,77,255,0.12)) !important;
          color: #c44dff !important;
        }
        /* Barra indicadora do item ativo */
        #sidebar a.active::before,
        .nav-item.active::before,
        .nav-item.active-nav::before {
          content: '' !important;
          position: absolute !important;
          left: -13px !important; top: 50% !important;
          transform: translateY(-50%) !important;
          width: 3px !important; height: 22px !important;
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          border-radius: 0 3px 3px 0 !important;
          box-shadow: none !important;
          display: block !important;
        }

        /* ── HEADER / TOPBAR ── */
        header, #topbar, .topbar, #header-container > * {
          background: #ffffff !important;
          border-bottom: 1px solid rgba(200,210,230,0.5) !important;
          backdrop-filter: none !important;
          box-shadow: 0 2px 12px rgba(100,120,180,0.07) !important;
          color: #1a1f36 !important;
        }

        /* Título do topbar */
        header h1, header h2, header .page-title,
        #topbar h1, #topbar h2 {
          color: #1a1f36 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 700 !important;
        }

        /* Search */
        #global-search, #search-input,
        input[placeholder*="Buscar"] {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
          border-radius: 12px !important;
        }
        #global-search::placeholder, input[placeholder*="Buscar"]::placeholder {
          color: #8a93b2 !important;
        }
        #global-search:focus {
          border-color: #c44dff !important;
          box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important;
        }

        /* Header buttons */
        header button, header .ib, #topbar button {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #8a93b2 !important;
        }
        header button:hover { background: #f0f2f8 !important; color: #1a1f36 !important; }

        /* Avatar */
        #user-avatar, [class*="user-avatar"] {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(255,107,157,0.3) !important;
          color: #fff !important;
        }
        #user-name { color: #1a1f36 !important; font-weight: 600 !important; }
        #user-role {
          color: #8a93b2 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: #8a93b2 !important;
        }
        [id*="notification-badge"] { background: #ff6b6b !important; }

        /* ── PAGE TITLE ── */
        #dashboard-title, .page-title, h1[class*="text-4xl"], h1[class*="text-3xl"] {
          color: #1a1f36 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 800 !important;
        }
        #dashboard-title span, .page-title span, h1 span, h1 em, .title-accent {
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        /* ── CARDS ── */
        .card, [class*="card"],
        .rounded-xl, .rounded-2xl,
        [class*="bg-white"],
        [class*="dark:bg-slate"],
        [class*="bg-slate-8"], [class*="bg-slate-9"] {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 6px 28px rgba(100,120,180,0.11) !important;
          backdrop-filter: none !important;
          color: #1a1f36 !important;
        }
        .card::before, .card::after,
        .rounded-xl::before, .rounded-xl::after { display:none !important; }
        .card:hover, [class*="card"]:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 36px rgba(100,120,180,0.16) !important;
          border-color: rgba(200,210,230,0.7) !important;
        }

        /* ── BOTÃO NOVA ORDEM ── */
        #nova-ordem-btn, .btn-primary,
        [id*="nova-ordem"], button[class*="bg-indigo"],
        a[class*="bg-indigo"] {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          background-image: none !important;
          border: none !important;
          box-shadow: 0 6px 20px rgba(255,107,157,0.35) !important;
          color: #fff !important;
          font-weight: 700 !important;
        }
        #nova-ordem-btn:hover {
          box-shadow: 0 8px 28px rgba(255,107,157,0.5) !important;
          transform: translateY(-1px) !important;
        }

        /* Layout switcher */
        #layout-switcher button, [id*="btn-layout"] {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #8a93b2 !important;
        }
        #layout-switcher button.active, [id*="btn-layout"].active {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          border-color: transparent !important; color: #fff !important;
          box-shadow: 0 4px 14px rgba(255,107,157,0.3) !important;
        }

        /* ── INPUTS ── */
        input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),
        select, textarea {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #c44dff !important;
          box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important;
          outline: none !important;
        }
        input::placeholder, textarea::placeholder { color: #8a93b2 !important; }
        label { color: #1a1f36 !important; }
        option { background: #ffffff !important; color: #1a1f36 !important; }
        input[type="checkbox"], input[type="radio"] { accent-color: #c44dff !important; }

        /* ── TABELAS ── */
        table { background: transparent !important; }
        thead, thead tr { background: #f7f8fc !important; }
        th {
          color: #8a93b2 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 10px !important; font-weight: 700 !important;
          letter-spacing: .07em !important; text-transform: uppercase !important;
          border-bottom: 1px solid rgba(200,210,230,0.5) !important;
          background: #f7f8fc !important;
          padding: 10px 16px !important;
        }
        tr { border-bottom: 1px solid rgba(200,210,230,0.3) !important; transition: background .15s !important; }
        tr:hover td { background: #f7f8fc !important; }
        tr:last-child td { border-bottom: none !important; }
        td {
          background: transparent !important;
          color: #1a1f36 !important;
          font-size: 13px !important;
          padding: 12px 16px !important;
        }
        td:first-child {
          font-weight: 600 !important;
          background: linear-gradient(135deg,#ff9a56,#c44dff) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        td strong, td b { color: #1a1f36 !important; -webkit-text-fill-color: #1a1f36 !important; }

        /* ── BADGES ── */
        .badge, [class*="badge"] { font-family: 'DM Sans', sans-serif !important; font-weight: 700 !important; }
        [class*="fila"], [class*="pending"], .badge-fila {
          background: rgba(255,154,86,0.12) !important; color: #ff9f43 !important;
          border: 1px solid rgba(255,154,86,0.25) !important;
        }
        [class*="ativo"], [class*="progress"] {
          background: rgba(84,160,255,0.12) !important; color: #54a0ff !important;
          border: 1px solid rgba(84,160,255,0.25) !important;
        }
        [class*="pronto"], [class*="completed"] {
          background: rgba(29,209,161,0.12) !important; color: #1dd1a1 !important;
          border: 1px solid rgba(29,209,161,0.2) !important;
        }
        [class*="entregue"], [class*="delivered"] {
          background: rgba(162,155,254,0.12) !important; color: #a29bfe !important;
          border: 1px solid rgba(162,155,254,0.25) !important;
        }

        /* ── KANBAN ── */
        .kanban-col, [class*="kanban-col"] {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
        }
        .kanban-col-header { color: #1a1f36 !important; border-bottom-color: rgba(200,210,230,0.5) !important; }
        .kanban-card, [class*="kanban-card"] {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
          box-shadow: 0 2px 8px rgba(100,120,180,0.08) !important;
        }
        .kanban-card:hover {
          box-shadow: 0 8px 24px rgba(100,120,180,0.15) !important;
          transform: translateY(-2px) !important;
        }

        /* ── MODAIS ── */
        .modal-overlay, [id*="modal-overlay"], [class*="overlay"],
        .fixed.inset-0[class*="bg-"] {
          background: rgba(100,120,180,0.3) !important;
          backdrop-filter: blur(8px) !important;
        }
        .modal, [class*="modal-container"], [class*="modal-box"],
        [id*="-modal"] > div > div {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 24px 64px rgba(100,120,180,0.2) !important;
          backdrop-filter: none !important;
        }
        [class*="modal-header"] {
          background: #f7f8fc !important;
          border-bottom: 1px solid rgba(200,210,230,0.5) !important;
        }
        [class*="modal-title"] { color: #1a1f36 !important; font-weight: 700 !important; }
        [class*="modal-footer"] { border-top: 1px solid rgba(200,210,230,0.5) !important; }

        /* ── DROPDOWNS ── */
        .dropdown, [class*="dropdown-menu"], [id*="user-menu"], [id*="dropdown"] {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 12px 36px rgba(100,120,180,0.15) !important;
        }
        .dropdown-item, [class*="dropdown-item"] {
          color: #1a1f36 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 13px !important;
        }
        .dropdown-item:hover { background: #f7f8fc !important; color: #c44dff !important; }
        [class*="dropdown-divider"] { border-color: rgba(200,210,230,0.5) !important; }

        /* ── NOTIFICAÇÕES ── */
        .toast, [class*="toast"] {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
          box-shadow: 0 8px 24px rgba(100,120,180,0.15) !important;
        }

        /* ── GRÁFICOS ── */
        canvas { filter: none !important; }
        svg circle[stroke*="6366"], svg circle[stroke*="4f46"] { stroke: #c44dff !important; }

        /* ── QUICK ACTIONS ── */
        .quick-action, [class*="quick-action"], button[onclick*="showPage"] {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
          box-shadow: none !important;
        }
        .quick-action:hover { background: #f0f2f8 !important; border-color: rgba(200,210,230,0.7) !important; color: #c44dff !important; }
        .quick-action .material-symbols-rounded { color: #c44dff !important; }

        /* ── OVERRIDE SLATE/INDIGO ── */
        [class*="text-slate-3"], [class*="dark:text-slate-3"] { color: #1a1f36 !important; }
        [class*="text-slate-4"], [class*="text-slate-5"],
        [class*="dark:text-slate-4"] { color: #8a93b2 !important; }
        [class*="text-slate-6"], [class*="text-slate-7"] { color: #bcc4d8 !important; }
        [class*="bg-slate-9"], [class*="bg-slate-8"],
        [class*="dark:bg-slate"] { background-color: #ffffff !important; }
        [class*="border-slate"] { border-color: rgba(200,210,230,0.5) !important; }
        [class*="text-indigo"] { color: #c44dff !important; }
        [class*="bg-indigo-5"], [class*="bg-indigo-6"], [class*="bg-indigo-7"] {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          background-color: transparent !important;
        }
        [class*="from-indigo"], [class*="to-indigo"] { background: transparent !important; }

        /* ── TEXTOS GERAIS ── */
        .text-white { color: #1a1f36 !important; }
        [class*="dark:text-"] { color: #1a1f36 !important; }
        hr, [class*="divider"] { border-color: rgba(200,210,230,0.5) !important; }

        /* ── SCROLLBAR ── */
        * { scrollbar-color: #dde3f0 rgba(240,242,248,0.5); }
        ::-webkit-scrollbar-track { background: rgba(240,242,248,0.5) !important; }
        ::-webkit-scrollbar-thumb { background: #dde3f0 !important; border-radius: 3px !important; }
        ::-webkit-scrollbar-thumb:hover { background: #c44dff !important; }

        /* ── NÚMEROS DOS STAT CARDS — seletores precisos ── */
        /* Remove gradiente dos 3 primeiros cards */
        #stat-a-separar-wrap h3,
        #stat-em-separacao-wrap h3,
        #stat-concluidas-hoje-wrap h3 {
          color: #1a1f36 !important;
          -webkit-text-fill-color: #1a1f36 !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          background-clip: unset !important;
          font-size: 2rem !important;
          font-weight: 800 !important;
        }
        /* Total de ordens — texto branco */
        #stat-total-wrap h3 {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          font-size: 2rem !important;
          font-weight: 800 !important;
        }

        /* ── CARD TOTAL — troca indigo por warm gradient ── */
        .metric-card[style*="#4f46e5"],
        .metric-card[style*="4f46e5"],
        .metric-card[style*="6366f1"] {
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          border: none !important;
          box-shadow: 0 8px 24px rgba(255,107,157,0.3) !important;
        }
        /* Ícone dentro do card total */
        .metric-card[style*="#4f46e5"] .rounded-2xl,
        .metric-card[style*="4f46e5"] .rounded-2xl,
        .metric-card[style*="6366f1"] .rounded-2xl {
          background: rgba(255,255,255,0.2) !important;
        }
        /* Texto dentro do card total */
        .metric-card[style*="#4f46e5"] p,
        .metric-card[style*="#4f46e5"] span,
        .metric-card[style*="4f46e5"] p,
        .metric-card[style*="4f46e5"] span {
          color: rgba(255,255,255,0.85) !important;
          -webkit-text-fill-color: rgba(255,255,255,0.85) !important;
        }

        /* ── TEXT-GRADIENT — título do dashboard ── */
        .text-gradient {
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        /* ── LEGENDAS DO GRÁFICO — cores atualizadas via JS ── */
        /* Dot amarelo → rosa */
        .bg-amber-400.rounded-full { background-color: rgb(255,107,157) !important; }
        /* Dot azul → roxo */
        .bg-blue-500.rounded-full { background-color: rgb(162,155,254) !important; }

        /* ── CHART CONTAINER — mais alto ── */
        .h-48 { height: 14rem !important; }
        canvas { filter: none !important; }

        /* ── BOTÕES DE MODO (Semana/Mês) ── */
        .chart-mode-btn {
          color: #8a93b2 !important;
          border-color: rgba(200,210,230,0.5) !important;
          background: transparent !important;
        }
        .active-chart-btn {
          background: linear-gradient(135deg,#ff9a56,#c44dff) !important;
          border-color: transparent !important;
          color: #fff !important;
        }

        /* ── BOTÕES DE LAYOUT ── */
        .layout-btn {
          color: #8a93b2 !important;
          border-color: rgba(200,210,230,0.35) !important;
          background: transparent !important;
        }
        .layout-btn:hover {
          border-color: rgba(196,77,255,0.4) !important;
          color: #c44dff !important;
          background: rgba(196,77,255,0.08) !important;
        }
        .layout-btn.active-layout {
          background: rgba(196,77,255,0.1) !important;
          border-color: rgba(196,77,255,0.4) !important;
          color: #c44dff !important;
        }

        /* ── METRIC CARDS ── */
        .metric-card {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 2px 12px rgba(100,120,180,0.07) !important;
        }
        .metric-card:hover {
          box-shadow: 0 8px 24px rgba(100,120,180,0.13) !important;
        }

        /* ── TÍTULOS E TEXTOS NOS CARDS ── */
        .metric-card p.text-xs { color: #8a93b2 !important; }
        .metric-card .text-slate-400 { color: #8a93b2 !important; }

        /* ── AÇÕES RÁPIDAS ── */
        .bg-primary-100, [class*="bg-primary-100"] { background: rgba(196,77,255,0.1) !important; }
        .text-primary-600, [class*="text-primary-600"] { color: #c44dff !important; }
        .text-primary-600:hover { color: #a855f7 !important; }
        button[onclick*="showPage"].text-primary-600 { color: #c44dff !important; }

        /* ── CHART BACKGROUND ── */
        #layout-classic .bg-white.rounded-2xl,
        #layout-classic .dark\:bg-slate-900.rounded-2xl {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
        }

        /* ── VITO ── */
        #vito-panel {
          background: rgba(255,255,255,0.98) !important;
          border: 1px solid rgba(200,210,230,0.6) !important;
          box-shadow: 0 24px 64px rgba(100,120,180,0.2) !important;
          backdrop-filter: blur(8px) !important;
        }
        #vito-head {
          background: linear-gradient(135deg,rgba(255,107,157,0.06),rgba(196,77,255,0.04)) !important;
          border-bottom-color: rgba(200,210,230,0.5) !important;
        }
        #vito-head-name { color: #1a1f36 !important; }
        #vito-head-sub { color: #c44dff !important; -webkit-text-fill-color: #c44dff !important; background: none !important; }
        #vito-head-dot { background: #1dd1a1 !important; box-shadow: 0 0 5px #1dd1a1 !important; }
        .vbub.bot { background: rgba(196,77,255,0.05) !important; border-color: rgba(196,77,255,0.15) !important; color: #1a1f36 !important; }
        .vbub.usr { background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important; color: #fff !important; }
        .vdot { background: #c44dff !important; }
        .vhint { border-color: rgba(196,77,255,0.2) !important; color: #c44dff !important; background: rgba(196,77,255,0.05) !important; }
        .vhint:hover { background: rgba(196,77,255,0.1) !important; }
        #vito-inp { background: #f7f8fc !important; border-color: rgba(200,210,230,0.5) !important; color: #1a1f36 !important; }
        #vito-inp:focus { border-color: #c44dff !important; box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important; }
        #vito-inp::placeholder { color: #8a93b2 !important; }
        #vito-send { background: linear-gradient(135deg,#ff9a56,#c44dff) !important; color: #fff !important; }
        #vito-hints { border-top-color: rgba(200,210,230,0.5) !important; }
        #vito-foot  { border-top-color: rgba(200,210,230,0.5) !important; }
        #vito-fab { filter: drop-shadow(0 4px 12px rgba(255,107,157,0.35)) !important; }

        /* ── LOGIN ── */
        #login-modal { background: #f0f2f8 !important; }
        #login-modal .rounded-2xl {
          background: rgba(255,255,255,0.96) !important;
          border-color: rgba(200,210,230,0.6) !important;
          box-shadow: 0 24px 64px rgba(100,120,180,0.2) !important;
        }
        #login-modal .w-16.h-16 {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          box-shadow: 0 8px 24px rgba(255,107,157,0.4) !important;
        }
        #login-modal button[type="submit"] {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          box-shadow: 0 6px 20px rgba(255,107,157,0.35) !important;
        }
        #login-modal input {
          background: #f7f8fc !important;
          border-color: rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
        }
        #login-modal label { color: #8a93b2 !important; }
        #login-modal .text-white, #login-modal h2 { color: #1a1f36 !important; }
        #login-modal p { color: #8a93b2 !important; }
      `,
    },
  };

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
