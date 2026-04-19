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
        /* ══ LIGHT — Colorful ══ */
        body, html {
          background: #f0f2f8 !important;
          color: #1a1f36 !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
        }
        body::before { display:none !important; }
        body::after  { display:none !important; }
        .bg-grid     { display:none !important; }
        .dark\\:bg-slate-950, .dark\\:bg-slate-900 { background-color: #f0f2f8 !important; }

        /* Sidebar — icon only, 72px */
        #sidebar, aside, .sidebar, #sidebar-container > * {
          width: 72px !important;
          background: #ffffff !important;
          border-right: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 2px 12px rgba(100,120,180,0.07) !important;
          backdrop-filter: none !important;
          align-items: center !important;
        }
        #main-content { margin-left: 72px !important; }
        #main-content.sb-mini { margin-left: 72px !important; }

        /* Esconde textos na sidebar, mantém ícones */
        #sidebar .logo-text, #sidebar .logo-sub,
        #sidebar [class*="text-xs"], #sidebar [class*="nav-section"],
        .sidebar-header [class*="text"], [id*="sidebar"] .text-sm,
        [id*="sidebar"] .font-bold:not(.material-symbols-rounded),
        #sidebar a span:not(.material-symbols-rounded),
        #sidebar button span:not(.material-symbols-rounded) {
          display: none !important;
        }

        /* Logo icon */
        [id*="logo-icon"], .logo-icon {
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          box-shadow: 0 6px 16px rgba(255,107,157,0.35) !important;
          width: 42px !important; height: 42px !important; border-radius: 14px !important;
        }

        /* Nav items — icon only */
        #sidebar a, #sidebar button, .nav-item, aside a {
          width: 46px !important; height: 46px !important;
          border-radius: 14px !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          color: #8a93b2 !important; background: transparent !important;
          padding: 0 !important; gap: 0 !important; margin: 2px auto !important;
          transform: none !important;
        }
        #sidebar a:hover, .nav-item:hover {
          background: #f7f8fc !important; color: #1a1f36 !important; transform: none !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: linear-gradient(135deg,rgba(255,107,157,0.12),rgba(160,77,255,0.12)) !important;
          color: #c44dff !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          left: -12px !important; width: 3px !important; height: 22px !important;
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          top: 50% !important; transform: translateY(-50%) !important;
          border-radius: 0 3px 3px 0 !important; box-shadow: none !important;
        }

        /* Header */
        header, #topbar, #header-container > * {
          background: #ffffff !important;
          border-bottom: 1px solid rgba(200,210,230,0.5) !important;
          backdrop-filter: none !important;
          box-shadow: 0 2px 12px rgba(100,120,180,0.07) !important;
        }
        #global-search, #search-input {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
        }
        #global-search::placeholder { color: #8a93b2 !important; }
        header button, header .ib {
          background: #f7f8fc !important;
          border: 1px solid rgba(200,210,230,0.5) !important; color: #8a93b2 !important;
        }
        header button:hover { background: #f0f2f8 !important; color: #1a1f36 !important; }
        #user-avatar {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(255,107,157,0.3) !important;
        }
        #user-name { color: #1a1f36 !important; }
        #user-role { color: #8a93b2 !important; background: none !important; -webkit-text-fill-color: #8a93b2 !important; }
        [id*="notification-badge"] { background: #ff6b6b !important; }

        /* Cards */
        .card, [class*="card"], .rounded-xl, .rounded-2xl,
        [class*="bg-white"], [class*="dark:bg-slate"] {
          background: #ffffff !important;
          border: 1px solid rgba(200,210,230,0.5) !important;
          box-shadow: 0 6px 28px rgba(100,120,180,0.11) !important;
          backdrop-filter: none !important;
          color: #1a1f36 !important;
        }
        .card:hover { transform: translateY(-2px) !important; box-shadow: 0 12px 36px rgba(100,120,180,0.16) !important; }
        .card::after, .rounded-xl::after { display:none !important; }

        /* Page title */
        #dashboard-title, .page-title, h1 { color: #1a1f36 !important; }
        #dashboard-title span, .page-title span, h1 span {
          background: linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Botão Nova Ordem */
        #nova-ordem-btn, .btn-primary, [id*="nova-ordem"], button[class*="bg-indigo"] {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          background-image: none !important; border: none !important;
          box-shadow: 0 6px 20px rgba(255,107,157,0.35) !important; color: #fff !important;
        }

        /* Layout switcher */
        #layout-switcher button { background: #f7f8fc !important; border-color: rgba(200,210,230,0.5) !important; color: #8a93b2 !important; }
        #layout-switcher button.active {
          background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important;
          border-color: transparent !important; color: #fff !important;
        }

        /* Tabelas */
        thead, thead tr { background: #f7f8fc !important; }
        th { color: #8a93b2 !important; border-color: rgba(200,210,230,0.5) !important; }
        tr { border-color: rgba(200,210,230,0.3) !important; }
        tr:hover td { background: rgba(196,77,255,0.03) !important; }
        td { color: #1a1f36 !important; background: transparent !important; }
        td:first-child {
          background: linear-gradient(135deg,#ff9a56,#c44dff) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
        }

        /* Badges */
        [class*="fila"], [class*="pending"] { background: rgba(255,154,86,0.12) !important; color: #ff9a56 !important; border-color: rgba(255,154,86,0.25) !important; }
        [class*="ativo"], [class*="progress"] { background: rgba(84,160,255,0.12) !important; color: #54a0ff !important; border-color: rgba(84,160,255,0.25) !important; }
        [class*="pronto"], [class*="completed"] { background: rgba(29,209,161,0.12) !important; color: #1dd1a1 !important; border-color: rgba(29,209,161,0.2) !important; }
        [class*="entregue"], [class*="delivered"] { background: rgba(162,155,254,0.12) !important; color: #9b59b6 !important; border-color: rgba(162,155,254,0.25) !important; }

        /* Inputs */
        input:not([type="range"]):not([type="checkbox"]), select, textarea {
          background: #f7f8fc !important; border: 1px solid rgba(200,210,230,0.5) !important;
          color: #1a1f36 !important;
        }
        input:focus, select:focus { border-color: #c44dff !important; box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important; }
        input::placeholder { color: #8a93b2 !important; }
        label { color: #1a1f36 !important; }
        option { background: #ffffff !important; color: #1a1f36 !important; }

        /* Kanban */
        .kanban-col { background: #f7f8fc !important; border-color: rgba(200,210,230,0.5) !important; }
        .kanban-card { background: #ffffff !important; border-color: rgba(200,210,230,0.5) !important; color: #1a1f36 !important; }
        .kanban-card:hover { box-shadow: 0 8px 24px rgba(100,120,180,0.15) !important; transform: translateY(-2px) !important; }

        /* Modais */
        .modal, [id*="-modal"] > div > div {
          background: #ffffff !important; border-color: rgba(200,210,230,0.5) !important;
          box-shadow: 0 24px 64px rgba(100,120,180,0.2) !important;
        }
        [class*="modal-header"] { background: #f7f8fc !important; border-color: rgba(200,210,230,0.5) !important; }
        .modal-overlay { background: rgba(100,120,180,0.3) !important; backdrop-filter: blur(8px) !important; }
        [class*="modal-title"] { color: #1a1f36 !important; }

        /* Override slate/indigo */
        [class*="text-slate-3"] { color: #1a1f36 !important; }
        [class*="text-slate-4"], [class*="text-slate-5"] { color: #8a93b2 !important; }
        [class*="text-slate-6"], [class*="text-slate-7"] { color: #bcc4d8 !important; }
        [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="dark:bg-slate"] { background-color: #ffffff !important; }
        [class*="border-slate"] { border-color: rgba(200,210,230,0.5) !important; }
        [class*="text-indigo"] { color: #c44dff !important; }
        [class*="bg-indigo"] { background: linear-gradient(135deg,#ff9a56,#ff6b9d,#c44dff) !important; }

        /* Dropdowns */
        .dropdown, [id*="user-menu"] { background: #ffffff !important; border-color: rgba(200,210,230,0.5) !important; box-shadow: 0 12px 36px rgba(100,120,180,0.15) !important; }
        .dropdown-item { color: #1a1f36 !important; }
        .dropdown-item:hover { background: #f7f8fc !important; color: #c44dff !important; }

        /* Scrollbar */
        * { scrollbar-color: rgba(196,77,255,0.3) rgba(240,242,248,0.5); }
        ::-webkit-scrollbar-track { background: rgba(240,242,248,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(196,77,255,0.3); }

        /* Textos gerais */
        p, span, div, h1, h2, h3, h4, td, th, label { color: inherit; }
        .text-white { color: #1a1f36 !important; }

        svg circle[stroke*="6366"] { stroke: #c44dff !important; }
      `,
    },
  };

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

    // Salva por usuário
    if (save) localStorage.setItem(KEY + '_' + _uid(), id);

    _updatePanel();
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: id } }));
    console.log('🎨 Tema:', t.label);
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
        position:fixed;bottom:88px;right:24px;z-index:9300;
        width:42px;height:42px;border-radius:13px;border:none;cursor:pointer;
        background:rgba(15,15,15,0.85);backdrop-filter:blur(12px);
        box-shadow:0 4px 20px rgba(0,0,0,0.4);
        display:flex;align-items:center;justify-content:center;
        transition:transform .2s,box-shadow .2s;
      }
      #tm-fab:hover{transform:scale(1.08);box-shadow:0 6px 26px rgba(0,0,0,0.5)}
      #tm-fab svg{width:19px;height:19px;stroke:rgba(255,255,255,0.75);stroke-width:1.8;fill:none}

      #tm-panel{
        position:fixed;bottom:140px;right:24px;z-index:9299;
        width:230px;background:rgba(12,10,24,0.98);
        border:1px solid rgba(255,255,255,0.1);border-radius:16px;
        padding:16px;backdrop-filter:blur(24px);
        box-shadow:0 20px 60px rgba(0,0,0,0.6);
        transition:opacity .25s,transform .25s;
      }
      #tm-panel.tm-hide{opacity:0;transform:translateY(10px);pointer-events:none}

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
    fab.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`;
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
