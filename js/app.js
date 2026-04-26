/* ============================================
   CONTROLE DE ORDENS PRO - app.js
   ============================================ */

function isAuthSystemAvailable() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

function getNivelNome(nivel) {
    const niveis = { 0:'Visualizador', 1:'Stage', 2:'Separador', 3:'Admin' };
    return niveis[nivel] || 'Usuário';
}

// ── Controle de página ────────────────────────────────────────

let _initMode  = true;   // true enquanto o sistema ainda está inicializando
let _savedPage = 'dashboard';

// Lê a última página salva imediatamente
try { _savedPage = localStorage.getItem('vt_active_page') || 'dashboard'; } catch(_) {}

// ── showPage ──────────────────────────────────────────────────

function showPage(page) {
    // Durante o init, bloqueia qualquer chamada para 'dashboard'
    // quando o usuário estava em outra página (ex: separacao, kanban)
    if (_initMode && page === 'dashboard' && _savedPage && _savedPage !== 'dashboard') {
        console.log('[showPage] Init mode — bloqueando dashboard, página salva:', _savedPage);
        return;
    }

    // Salva a página escolhida
    try { localStorage.setItem('vt_active_page', page); } catch(_) {}
    _savedPage = page;

    // Esconde todas as .page
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.add('hidden');
        p.classList.remove('active');
    });

    // Mostra a solicitada
    const target = document.getElementById(page);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    } else {
        console.warn('[showPage] Página não encontrada:', page);
    }

    // Atualiza nav-items
    document.querySelectorAll('.nav-item[data-page]').forEach(function(el) {
        el.classList.toggle('active-nav', el.dataset.page === page);
    });

    // Fecha sidebar no mobile
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
    }

    // Dispara evento para módulos (kanban, separacao, etc.)
    document.dispatchEvent(new CustomEvent('pageChanged', { detail: page }));

    // Inits específicos
    const inits = {
        kanban:    () => { if (typeof initKanban    === 'function') initKanban(); },
        separacao: () => { if (typeof initSeparacao === 'function') initSeparacao(); },
        ordens:    () => { if (typeof renderRecentOrders === 'function') renderRecentOrders(); },
        dashboard: () => { if (typeof dashUpdateAll === 'function') dashUpdateAll(); },
    };
    if (inits[page]) inits[page]();

    console.log('[showPage]', page);
}

// ── Finaliza o init e restaura a página salva ─────────────────
// Chamado pelo index.html após todos os setups terminarem

function restoreActivePage() {
    _initMode = false; // libera o bloqueio

    const page = _savedPage || 'dashboard';
    const el   = document.getElementById(page);

    if (el) {
        // Força direto no DOM sem passar pelo guard do init
        document.querySelectorAll('.page').forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('active');
        });
        el.classList.remove('hidden');
        el.classList.add('active');

        // Atualiza nav
        document.querySelectorAll('.nav-item[data-page]').forEach(function(nav) {
            nav.classList.toggle('active-nav', nav.dataset.page === page);
        });

        // Dispara evento e inits
        document.dispatchEvent(new CustomEvent('pageChanged', { detail: page }));
        if (page === 'separacao' && typeof initSeparacao === 'function') initSeparacao();
        if (page === 'kanban'    && typeof initKanban    === 'function') initKanban();

        console.log('[restoreActivePage] →', page);
    } else {
        // Fallback para dashboard
        _savedPage = 'dashboard';
        showPage('dashboard');
    }
}

// ── setupAuthenticatedUI ──────────────────────────────────────

function setupAuthenticatedUI() {
    const lm = document.getElementById('login-modal');
    if (lm) { lm.classList.add('hidden'); lm.classList.remove('active'); }

    let user = null;
    if (isAuthSystemAvailable()) {
        user = auth.getCurrentUser?.() || auth.getUser?.();
    }
    if (!user) {
        try {
            const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
            user = s?.user || null;
        } catch(_) {}
    }
    if (!user) return;

    const nome     = user.nome  || 'Usuário';
    const email    = user.email || '';
    const nivel    = user.nivel ?? user.nivel_acesso ?? 0;
    const cargo    = user.cargo || getNivelNome(nivel);
    const iniciais = nome.split(' ').filter(Boolean).map(p=>p[0]).slice(0,2).join('').toUpperCase() || '?';

    const setTxt = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    setTxt('header-user-name', nome);
    setTxt('header-user-role', cargo);
    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl) avatarEl.textContent = iniciais;

    setTxt('menu-user-name',  nome);
    setTxt('menu-user-email', email);
    setTxt('menu-user-badge', getNivelNome(nivel));
    const menuAvatarEl = document.getElementById('menu-avatar');
    if (menuAvatarEl) menuAvatarEl.textContent = iniciais;

    setTxt('profile-name',  nome);
    setTxt('profile-email', email);
    setTxt('profile-cargo', cargo);
    setTxt('profile-nivel', getNivelNome(nivel));
    setTxt('profile-badge', getNivelNome(nivel));
    const profileAvatarEl = document.getElementById('profile-avatar-big');
    if (profileAvatarEl) profileAvatarEl.textContent = iniciais;

    try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        if (s.loginTime) setTxt('profile-sessao', new Date(s.loginTime).toLocaleString('pt-BR'));
    } catch(_) {}

    const gs = document.getElementById('global-search');
    if (gs) { gs.value = ''; gs.setAttribute('autocomplete','off'); }

    console.log('✅ UI atualizada para:', nome);
}

function setupUserHeader() { setupAuthenticatedUI(); }

function refreshDashboard() {
    const btn = document.getElementById('refresh-btn');
    if (btn) btn.classList.add('animate-spin');
    setTimeout(async () => {
        if (btn) btn.classList.remove('animate-spin');
        if (typeof loadOrders           === 'function') await loadOrders();
        if (typeof renderRecentOrders   === 'function') renderRecentOrders();
        if (typeof renderDashboardStats === 'function') renderDashboardStats();
        if (typeof updateCharts         === 'function') updateCharts();
        if (typeof showToast            === 'function') showToast('Dashboard atualizado!', 'success');
    }, 800);
}

// ── Exports ───────────────────────────────────────────────────

window.showPage              = showPage;
window.restoreActivePage     = restoreActivePage;
window.setupAuthenticatedUI  = setupAuthenticatedUI;
window.setupUserHeader       = setupUserHeader;
window.refreshDashboard      = refreshDashboard;
window.getNivelNome          = getNivelNome;
window.isAuthSystemAvailable = isAuthSystemAvailable;

console.log('✅ app.js carregado | página salva:', _savedPage);
