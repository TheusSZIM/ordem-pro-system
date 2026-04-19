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

    // ── 4. LIGHT — Claude Light (CSS direto do claude.html) ──
    light: {
      label:   'Light',
      sub:     'Colorful Clear',
      icon:    '◇',
      preview: ['#f0f2f8', '#ff6b9d', '#c44dff'],
      fonts:   [
        'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap',
      ],
      css: `
        /* ╔══════════════════════════════════════════════════════╗
           ║  TEMA LIGHT — CSS direto do claude.html              ║
           ║  Variáveis + mapeamento para o sistema Ordem Pro     ║
           ╚══════════════════════════════════════════════════════╝ */

        /* ── Fonte ── */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        /* ── Variáveis CSS do claude.html ── */
        :root {
          --bg:          #f0f2f8;
          --surface:     #ffffff;
          --surface2:    #f7f8fc;
          --border:      rgba(200,210,230,0.5);
          --text:        #1a1f36;
          --text-muted:  #8a93b2;
          --text-light:  #bcc4d8;
          --coral:       #ff6b6b;
          --orange:      #ff9f43;
          --yellow:      #ffd32a;
          --mint:        #1dd1a1;
          --teal:        #00d2d3;
          --sky:         #54a0ff;
          --violet:      #9b59b6;
          --pink:        #fd79a8;
          --purple:      #a29bfe;
          --indigo:      #5f27cd;
          --grad-warm:   linear-gradient(135deg,#ff9a56 0%,#ff6b9d 50%,#c44dff 100%);
          --grad-cool:   linear-gradient(135deg,#667eea 0%,#764ba2 100%);
          --grad-mint:   linear-gradient(135deg,#11998e 0%,#38ef7d 100%);
          --grad-sky:    linear-gradient(135deg,#2980b9 0%,#6dd5fa 100%);
          --grad-fire:   linear-gradient(135deg,#f093fb 0%,#f5576c 100%);
          --shadow-sm:   0 2px 12px rgba(100,120,180,0.07);
          --shadow:      0 6px 28px rgba(100,120,180,0.11);
          --shadow-lg:   0 16px 48px rgba(100,120,180,0.15);
          --radius:      20px;
          --radius-sm:   12px;
        }

        /* ── Protege ícones ── */
        .material-symbols-rounded,[class*="material-symbols"],[class*="material-icons"] {
          font-family: 'Material Symbols Rounded' !important;
          font-weight: normal !important; font-style: normal !important;
          letter-spacing: normal !important; white-space: nowrap !important;
        }

        /* ══ BASE ════════════════════════════════════════════════ */
        html, body, #app, .min-h-screen {
          background: var(--bg) !important;
          color: var(--text) !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        body::before, body::after { display:none !important; }
        .bg-grid { display:none !important; }
        .dark\:bg-slate-950, .dark\:bg-slate-900,
        [class*="bg-slate-9"], [class*="bg-slate-8"] {
          background-color: var(--bg) !important;
        }
        * { scrollbar-color: #dde3f0 transparent; scrollbar-width: thin; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#dde3f0; border-radius:3px; }

        /* ══ SIDEBAR — 72px icon-only ════════════════════════════ */
        #sidebar, #sidebar-container > *, aside, .sidebar, [id*="sidebar"] {
          width: 72px !important; min-width: 72px !important; max-width: 72px !important;
          background: var(--surface) !important;
          border-right: 1px solid var(--border) !important;
          box-shadow: var(--shadow-sm) !important;
          backdrop-filter: none !important;
          overflow: hidden !important;
          padding: 24px 0 !important;
          display: flex !important; flex-direction: column !important; align-items: center !important;
          gap: 6px !important;
        }
        /* Esconde textos, mantém ícones */
        #sidebar *:not(.material-symbols-rounded):not([class*="material"]) {
          font-size: 0 !important; line-height: 0 !important;
        }
        #sidebar .material-symbols-rounded, [id*="sidebar"] .material-symbols-rounded {
          font-size: 22px !important;
          font-family: 'Material Symbols Rounded' !important;
          display: flex !important; visibility: visible !important;
          color: inherit !important;
        }

        /* Tab de toggle da sidebar — oculta */
        #sb-tab, .sidebar-toggle, [id*="sb-tab"] { display:none !important; }

        /* Logo */
        #sidebar header, #sidebar .rounded-xl, [id*="logo-icon"] {
          width: 42px !important; height: 42px !important;
          border-radius: 14px !important;
          background: var(--grad-warm) !important;
          box-shadow: 0 6px 16px rgba(255,107,157,0.35) !important;
          display: flex !important; align-items: center !important;
          justify-content: center !important; margin: 0 auto 16px !important;
          color: #fff !important; font-size: 20px !important;
          min-width: 42px !important;
        }

        /* Nav items */
        #sidebar a, #sidebar button, .nav-item, [class*="nav-item"], aside a, aside button {
          width: 46px !important; height: 46px !important; min-width: 46px !important;
          border-radius: 14px !important;
          display: flex !important; align-items: center !important;
          justify-content: center !important;
          margin: 0 auto 0 !important; padding: 0 !important;
          color: var(--text-muted) !important;
          background: transparent !important; background-color: transparent !important;
          background-image: none !important; border: none !important; box-shadow: none !important;
          transition: all 0.2s !important; position: relative !important;
          flex-direction: column !important; gap: 0 !important;
        }
        #sidebar a:hover, .nav-item:hover {
          background: var(--surface2) !important; color: var(--text) !important;
          transform: none !important;
        }
        #sidebar a.active, .nav-item.active, .nav-item.active-nav {
          background: linear-gradient(135deg,rgba(255,107,157,0.12),rgba(160,77,255,0.12)) !important;
          color: #c44dff !important;
        }
        #sidebar a.active::before, .nav-item.active::before, .nav-item.active-nav::before {
          content: '' !important; position: absolute !important;
          left: -13px !important; top: 50% !important; transform: translateY(-50%) !important;
          width: 3px !important; height: 22px !important;
          background: var(--grad-warm) !important;
          border-radius: 0 3px 3px 0 !important; display: block !important;
        }
        /* Zera margin-left do conteúdo */
        #main-content { margin-left: 72px !important; }
        #main-content.sb-mini { margin-left: 72px !important; }

        /* ══ HEADER / TOPBAR ══════════════════════════════════════ */
        header, #topbar, .topbar, #header-container > * {
          background: var(--surface) !important;
          border-bottom: 1px solid var(--border) !important;
          backdrop-filter: none !important;
          box-shadow: var(--shadow-sm) !important;
        }
        /* Search */
        #global-search, #search-input, input[placeholder*="Buscar"] {
          background: var(--surface2) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          border-radius: 12px !important;
        }
        #global-search:focus { border-color: #c44dff !important; box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important; }
        #global-search::placeholder { color: var(--text-muted) !important; }
        /* Botões do header */
        header button, header .ib {
          background: var(--surface2) !important; border: 1px solid var(--border) !important;
          color: var(--text-muted) !important; border-radius: 12px !important;
        }
        header button:hover { background: var(--bg) !important; color: var(--text) !important; }
        /* Avatar */
        #user-avatar { background: var(--grad-warm) !important; border: none !important;
          box-shadow: 0 4px 12px rgba(255,107,157,0.3) !important; color:#fff !important; }
        #user-name { color: var(--text) !important; font-weight:700 !important; }
        #user-role { color: var(--text-muted) !important; background:none !important;
          -webkit-text-fill-color: var(--text-muted) !important; }
        [id*="notification-badge"] { background: var(--coral) !important; }

        /* ══ PAGE TITLE ═══════════════════════════════════════════ */
        #dashboard-title, .page-title, h1[class*="text-3xl"], h1[class*="text-2xl"] {
          color: var(--text) !important;
          font-family: 'DM Sans', sans-serif !important; font-weight: 800 !important;
        }
        .text-gradient, #dashboard-title span, .page-title span, h1 span {
          background: var(--grad-warm) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        /* ══ METRIC CARDS ══ (sistema: .metric-card) ══════════════ */
        .metric-card {
          background: var(--surface) !important;
          border-radius: var(--radius) !important;
          border: 1px solid var(--border) !important;
          box-shadow: var(--shadow-sm) !important;
          backdrop-filter: none !important;
        }
        .metric-card:hover {
          transform: translateY(-2px) scale(1.01) !important;
          box-shadow: var(--shadow) !important;
        }
        .metric-card::before, .metric-card::after { display:none !important; }

        /* Números nos cards — sem gradiente */
        #stat-a-separar-wrap h3, #stat-em-separacao-wrap h3,
        #stat-concluidas-hoje-wrap h3 {
          color: var(--text) !important; -webkit-text-fill-color: var(--text) !important;
          background: none !important; -webkit-background-clip: unset !important;
          font-size: 2rem !important; font-weight: 800 !important;
        }
        #stat-total-wrap h3 {
          color: #fff !important; -webkit-text-fill-color: #fff !important;
          background: none !important; font-size: 2.2rem !important; font-weight: 800 !important;
        }

        /* Card Total — warm gradient (substitui indigo) */
        .metric-card[style*="4f46e5"], .metric-card[style*="6366f1"],
        .metric-card[style*="background:linear-gradient"] {
          background: var(--grad-warm) !important;
          border: none !important;
          box-shadow: 0 8px 28px rgba(255,107,157,0.3) !important;
        }
        .metric-card[style*="4f46e5"] *, .metric-card[style*="6366f1"] *,
        .metric-card[style*="background:linear-gradient"] * {
          color: rgba(255,255,255,0.9) !important;
          -webkit-text-fill-color: rgba(255,255,255,0.9) !important;
        }
        .metric-card[style*="4f46e5"] .rounded-2xl { background:rgba(255,255,255,0.2) !important; }

        /* Labels nos cards */
        .metric-card .text-xs { color: var(--text-muted) !important; }
        .metric-card .text-slate-400, .metric-card .text-slate-500 { color: var(--text-muted) !important; }

        /* ══ CARDS GENÉRICOS ══════════════════════════════════════ */
        .card, [class*="card"], .rounded-xl, .rounded-2xl,
        [class*="bg-white"], [class*="dark:bg-slate"] {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          box-shadow: var(--shadow-sm) !important;
          backdrop-filter: none !important;
          color: var(--text) !important;
        }
        .card::before, .card::after, .rounded-xl::before, .rounded-xl::after { display:none !important; }
        .card:hover, [class*="card"]:hover {
          box-shadow: var(--shadow) !important;
        }

        /* ══ BOTÃO NOVA ORDEM ═════════════════════════════════════ */
        #nova-ordem-btn, .btn-primary, [id*="nova-ordem"], button[class*="bg-indigo"],
        button[class*="bg-primary"], a[class*="bg-indigo"] {
          background: var(--grad-warm) !important; background-image: none !important;
          border: none !important; color: #fff !important; font-family: 'DM Sans', sans-serif !important;
          font-weight: 700 !important; border-radius: 14px !important;
          box-shadow: 0 6px 20px rgba(255,107,157,0.35) !important;
          transition: all 0.25s cubic-bezier(.34,1.56,.64,1) !important;
        }
        #nova-ordem-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 28px rgba(255,107,157,0.5) !important; }

        /* Layout switcher */
        .layout-btn { color: var(--text-muted) !important; border-color: var(--border) !important; background: transparent !important; }
        .layout-btn:hover { border-color: #c44dff !important; color: #c44dff !important; background: rgba(196,77,255,0.06) !important; }
        .layout-btn.active-layout { background: rgba(196,77,255,0.1) !important; border-color: rgba(196,77,255,0.35) !important; color: #c44dff !important; }

        /* Botões Semana/Mês */
        .chart-mode-btn { color: var(--text-muted) !important; border-color: var(--border) !important; background: transparent !important; border-radius: 8px !important; font-weight: 600 !important; }
        .active-chart-btn { background: var(--grad-warm) !important; border-color: transparent !important; color: #fff !important; box-shadow: 0 4px 12px rgba(255,107,157,0.25) !important; }

        /* ══ INPUTS ═══════════════════════════════════════════════ */
        input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), select, textarea {
          background: var(--surface2) !important; border: 1px solid var(--border) !important;
          color: var(--text) !important; font-family: 'DM Sans', sans-serif !important;
          border-radius: var(--radius-sm) !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #c44dff !important; box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important;
          outline: none !important;
        }
        input::placeholder { color: var(--text-muted) !important; }
        label { color: var(--text) !important; }
        option { background: var(--surface) !important; color: var(--text) !important; }
        input[type="checkbox"], input[type="radio"] { accent-color: #c44dff !important; }

        /* ══ TABELAS ══════════════════════════════════════════════ */
        table { background: transparent !important; border-collapse: collapse !important; }
        thead, thead tr { background: var(--surface2) !important; }
        th {
          color: var(--text-muted) !important; font-family: 'DM Sans', sans-serif !important;
          font-size: 10px !important; font-weight: 700 !important;
          letter-spacing: .07em !important; text-transform: uppercase !important;
          padding: 10px 16px !important; background: var(--surface2) !important;
          border-bottom: 1px solid var(--border) !important;
        }
        tr { border-bottom: 1px solid rgba(200,210,230,0.3) !important; transition: background .15s !important; }
        tr:last-child td { border-bottom: none !important; }
        tr:hover td { background: var(--surface2) !important; }
        td {
          background: transparent !important; color: var(--text) !important;
          font-size: 13px !important; padding: 12px 16px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        /* Lote — warm gradient text */
        td:first-child {
          background: var(--grad-warm) !important;
          -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
          font-weight: 700 !important;
        }

        /* ══ BADGES ═══════════════════════════════════════════════ */
        [class*="fila"], [class*="pending"], .badge-fila {
          background: rgba(255,159,67,0.12) !important; color: var(--orange) !important;
          border: 1px solid rgba(255,159,67,0.22) !important;
        }
        [class*="ativo"], [class*="progress"] {
          background: rgba(84,160,255,0.12) !important; color: var(--sky) !important;
          border: 1px solid rgba(84,160,255,0.2) !important;
        }
        [class*="pronto"], [class*="completed"] {
          background: rgba(29,209,161,0.12) !important; color: var(--mint) !important;
          border: 1px solid rgba(29,209,161,0.2) !important;
        }
        [class*="entregue"], [class*="delivered"] {
          background: rgba(162,155,254,0.12) !important; color: var(--purple) !important;
          border: 1px solid rgba(162,155,254,0.2) !important;
        }

        /* ══ DOTS DE LEGENDA DO GRÁFICO ═══════════════════════════ */
        .bg-amber-400.rounded-full, span.bg-amber-400, .bg-amber-400.inline-block {
          background-color: #ff6b9d !important;
        }
        .bg-blue-500.rounded-full, span.bg-blue-500, .bg-blue-500.inline-block {
          background-color: #a29bfe !important;
        }

        /* ══ CHART HEIGHT ═════════════════════════════════════════ */
        .h-48 { height: 15rem !important; }
        canvas { filter: none !important; }

        /* ══ AÇÕES RÁPIDAS ════════════════════════════════════════ */
        .bg-primary-100, [class*="bg-primary-100"] { background: rgba(196,77,255,0.1) !important; }
        .text-primary-600 { color: #c44dff !important; }
        button[onclick*="showPage('kanban')"] .bg-indigo-100,
        button[onclick*="showPage('entrega')"] .bg-violet-100,
        button[onclick*="showPage('estoque')"] .bg-amber-100 { border-radius: 10px !important; }

        /* ══ KANBAN ═══════════════════════════════════════════════ */
        .kanban-col, [class*="kanban-col"] {
          background: var(--surface2) !important; border: 1px solid var(--border) !important;
        }
        .kanban-card, [class*="kanban-card"] {
          background: var(--surface) !important; border: 1px solid var(--border) !important;
          color: var(--text) !important; box-shadow: var(--shadow-sm) !important;
          border-radius: var(--radius-sm) !important;
        }
        .kanban-card:hover { transform: translateY(-2px) !important; box-shadow: var(--shadow) !important; }

        /* ══ MODAIS ═══════════════════════════════════════════════ */
        .modal-overlay, [id*="modal-overlay"], [class*="overlay"] {
          background: rgba(100,120,180,0.3) !important; backdrop-filter: blur(8px) !important;
        }
        .modal, [class*="modal-container"], [id*="-modal"] > div > div {
          background: var(--surface) !important; border: 1px solid var(--border) !important;
          box-shadow: var(--shadow-lg) !important; backdrop-filter: none !important;
          border-radius: var(--radius) !important;
        }
        [class*="modal-header"] { background: var(--surface2) !important; border-bottom: 1px solid var(--border) !important; }
        [class*="modal-title"] { color: var(--text) !important; font-weight: 700 !important; }
        [class*="modal-footer"] { border-top: 1px solid var(--border) !important; }

        /* ══ DROPDOWNS ════════════════════════════════════════════ */
        .dropdown, [class*="dropdown-menu"], [id*="user-menu"] {
          background: var(--surface) !important; border: 1px solid var(--border) !important;
          box-shadow: var(--shadow) !important;
        }
        .dropdown-item { color: var(--text) !important; font-family: 'DM Sans', sans-serif !important; }
        .dropdown-item:hover { background: var(--surface2) !important; color: #c44dff !important; }
        [class*="dropdown-divider"] { border-color: var(--border) !important; }

        /* ══ TEXTO / OVERRIDE SLATE ═══════════════════════════════ */
        [class*="text-slate-9"], [class*="text-slate-8"],
        [class*="dark:text-white"], [class*="dark:text-slate-1"] { color: var(--text) !important; }
        [class*="text-slate-4"], [class*="text-slate-5"], [class*="text-slate-6"] { color: var(--text-muted) !important; }
        [class*="text-slate-3"] { color: var(--text-light) !important; }
        [class*="text-indigo"], [class*="text-primary"] { color: #c44dff !important; }
        [class*="bg-indigo-5"], [class*="bg-indigo-6"], [class*="bg-indigo-7"] {
          background: var(--grad-warm) !important;
        }
        [class*="from-indigo"], [class*="to-indigo"],
        [class*="bg-indigo"], [class*="bg-primary"] { background: transparent !important; }
        hr, [class*="divider"] { border-color: var(--border) !important; }
        .text-white:not(button):not([style*="background"]):not([class*="btn"]) {
          color: var(--text) !important;
        }

        /* ══ LOGIN ════════════════════════════════════════════════ */
        #login-modal { background: var(--bg) !important; }
        #login-modal .rounded-2xl {
          background: rgba(255,255,255,0.96) !important; border-color: var(--border) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        #login-modal .w-16.h-16 { background: var(--grad-warm) !important; box-shadow: 0 8px 24px rgba(255,107,157,0.4) !important; }
        #login-modal button[type="submit"] { background: var(--grad-warm) !important; box-shadow: 0 6px 20px rgba(255,107,157,0.35) !important; }
        #login-modal input { background: var(--surface2) !important; border-color: var(--border) !important; color: var(--text) !important; }
        #login-modal h2 { color: var(--text) !important; }
        #login-modal p { color: var(--text-muted) !important; }

        /* ══ VITO ══════════════════════════════════════════════════ */
        #vito-panel { background: rgba(255,255,255,0.98) !important; border: 1px solid rgba(200,210,230,0.6) !important; box-shadow: var(--shadow-lg) !important; }
        #vito-head { background: linear-gradient(135deg,rgba(255,107,157,0.06),rgba(196,77,255,0.04)) !important; border-bottom-color: var(--border) !important; }
        #vito-head-name { color: var(--text) !important; }
        #vito-head-sub { color: #c44dff !important; -webkit-text-fill-color: #c44dff !important; background:none !important; }
        #vito-head-dot { background: var(--mint) !important; box-shadow: 0 0 5px var(--mint) !important; }
        .vbub.bot { background: rgba(196,77,255,0.05) !important; border-color: rgba(196,77,255,0.15) !important; color: var(--text) !important; }
        .vbub.usr { background: var(--grad-warm) !important; color:#fff !important; }
        .vdot { background: #c44dff !important; }
        .vhint { border-color: rgba(196,77,255,0.2) !important; color: #c44dff !important; background: rgba(196,77,255,0.05) !important; }
        .vhint:hover { background: rgba(196,77,255,0.1) !important; }
        #vito-inp { background: var(--surface2) !important; border-color: var(--border) !important; color: var(--text) !important; }
        #vito-inp:focus { border-color: #c44dff !important; box-shadow: 0 0 0 3px rgba(196,77,255,0.1) !important; }
        #vito-inp::placeholder { color: var(--text-muted) !important; }
        #vito-send { background: var(--grad-warm) !important; }
        #vito-fab { filter: drop-shadow(0 4px 12px rgba(255,107,157,0.35)) !important; }
        #vito-hints, #vito-foot { border-top-color: var(--border) !important; }
        #vito-save-key { background: var(--grad-warm) !important; }
      `,
      onApply() {
        // ── Chart.js defaults ────────────────────────────────
        if (typeof Chart !== 'undefined') {
          Chart.defaults.color       = '#8a93b2';
          Chart.defaults.borderColor = 'rgba(200,210,230,0.3)';
          Chart.defaults.font.family = "'DM Sans', sans-serif";
        }

        // ── Patch cores dos gráficos ─────────────────────────
        const PINK    = '#ff6b9d';
        const PINK_A  = 'rgba(255,107,157,0.15)';
        const PURPLE  = '#a29bfe';
        const PURPLE_A= 'rgba(162,155,254,0.14)';

        let _tries = 0;
        function patch() {
          if (typeof Chart === 'undefined') return;
          let ok = false;
          ['performanceChart','performanceChart2','performanceChart3'].forEach(id => {
            const ch = typeof Chart.getChart === 'function'
              ? Chart.getChart(id)
              : Object.values(Chart.instances||{}).find(c=>c.canvas&&c.canvas.id===id);
            if (!ch || !ch.data || !ch.data.datasets || !ch.data.datasets.length) return;
            const ds = ch.data.datasets;
            if (ds[0]) { ds[0].borderColor=PINK; ds[0].backgroundColor=PINK_A; ds[0].pointBackgroundColor=PINK; ds[0].pointBorderColor='#fff'; ds[0].pointBorderWidth=2; }
            if (ds[1]) { ds[1].borderColor=PURPLE; ds[1].backgroundColor=PURPLE_A; ds[1].pointBackgroundColor=PURPLE; ds[1].pointBorderColor='#fff'; ds[1].pointBorderWidth=2; }
            try {
              if (ch.options.scales) {
                if (ch.options.scales.x) { ch.options.scales.x.grid.color='rgba(200,210,230,0.2)'; ch.options.scales.x.ticks.color='#8a93b2'; }
                if (ch.options.scales.y) { ch.options.scales.y.grid.color='rgba(200,210,230,0.2)'; ch.options.scales.y.ticks.color='#8a93b2'; }
              }
              if (ch.options.plugins) {
                if (ch.options.plugins.legend && ch.options.plugins.legend.labels) ch.options.plugins.legend.labels.color='#8a93b2';
                if (ch.options.plugins.tooltip) { ch.options.plugins.tooltip.backgroundColor='rgba(255,255,255,0.96)'; ch.options.plugins.tooltip.titleColor='#1a1f36'; ch.options.plugins.tooltip.bodyColor='#8a93b2'; ch.options.plugins.tooltip.borderColor='rgba(200,210,230,0.6)'; ch.options.plugins.tooltip.borderWidth=1; }
              }
            } catch(e) {}
            ch.update('none');
            ok = true;
          });
          // Dots legenda HTML
          document.querySelectorAll('.bg-amber-400,.bg-amber-400.rounded-full,span.bg-amber-400').forEach(el=>el.style.setProperty('background-color',PINK,'important'));
          document.querySelectorAll('.bg-blue-500,.bg-blue-500.rounded-full,span.bg-blue-500').forEach(el=>el.style.setProperty('background-color',PURPLE,'important'));
          if (!ok && _tries++ < 15) setTimeout(patch, 350);
        }

        // Intercepta buildWeekChart e updateCharts
        if (window.buildWeekChart && !window._tm_origBWC) {
          window._tm_origBWC = window.buildWeekChart;
          window.buildWeekChart = function() { window._tm_origBWC(); _tries=0; setTimeout(patch,100); };
        }
        if (window.updateCharts && !window._tm_origUC) {
          window._tm_origUC = window.updateCharts;
          window.updateCharts = function() { window._tm_origUC(); _tries=0; setTimeout(patch,120); };
        }

        // Aplica com delays
        [200,600,1400,3000].forEach(d=>setTimeout(patch,d));

        // Observer DOM
        if (window._tm_obs) window._tm_obs.disconnect();
        window._tm_obs = new MutationObserver(()=>{ _tries=0; setTimeout(patch,150); });
        window._tm_obs.observe(document.getElementById('dashboard-container')||document.body,{childList:true,subtree:true});

        // Sidebar/layout fix
        function fixLayout() {
          const main = document.getElementById('main-content');
          const sb   = document.getElementById('sidebar');
          if (main) { main.style.setProperty('margin-left','72px','important'); main.style.setProperty('transition','none','important'); }
          if (sb)   { sb.style.setProperty('width','72px','important'); sb.style.setProperty('min-width','72px','important'); sb.style.setProperty('max-width','72px','important'); }
          document.body.classList.add('tm-light');
        }
        fixLayout();
        [300,800,1500].forEach(d=>setTimeout(fixLayout,d));
      },
    },
  };

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
