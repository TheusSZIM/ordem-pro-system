/* ============================================
   CONTROLE DE ORDENS PRO - app.js
   Sem DOMContentLoaded próprio (index.html gerencia)
   ============================================ */

function isAuthSystemAvailable() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

function getNivelNome(nivel) {
    const niveis = { 0:'Visualizador', 1:'Stage', 2:'Separador', 3:'Admin' };
    return niveis[nivel] || 'Usuário';
}

// ── showPage — controla qual página está visível ──────────────
// Funciona para TODAS as páginas, inclusive as novas (separacao, etc.)

function showPage(page) {
    // 1. Esconde todas as .page
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.add('hidden');
        p.classList.remove('active');
    });

    // 2. Mostra a solicitada (busca por ID direto)
    const target = document.getElementById(page);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    } else {
        console.warn('[showPage] Página não encontrada:', page);
    }

    // 3. Atualiza nav-items (active-nav)
    document.querySelectorAll('.nav-item[data-page]').forEach(function(el) {
        el.classList.toggle('active-nav', el.dataset.page === page);
    });

    // 4. Fecha sidebar no mobile
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
    }

    // 5. Dispara evento para módulos que escutam (kanban, separacao, etc.)
    document.dispatchEvent(new CustomEvent('pageChanged', { detail: page }));

    // 6. Inits específicos por página
    const inits = {
        kanban:    () => { if (typeof initKanban    === 'function') initKanban(); },
        separacao: () => { if (typeof initSeparacao === 'function') initSeparacao(); },
        ordens:    () => { if (typeof renderRecentOrders === 'function') renderRecentOrders(); },
        dashboard: () => { if (typeof dashUpdateAll === 'function') dashUpdateAll(); },
    };
    if (inits[page]) inits[page]();

    console.log('[showPage]', page);
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

    console.log('👤 setupAuthenticatedUI →', nome, '(nível', nivel, ')');

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
        if (s.loginTime) {
            const dt = new Date(s.loginTime);
            setTxt('profile-sessao', dt.toLocaleString('pt-BR'));
        }
    } catch(_) {}

    const gs = document.getElementById('global-search');
    if (gs) { gs.value = ''; gs.setAttribute('autocomplete','off'); }

    console.log('✅ UI atualizada para:', nome);
}

// ── setupUserHeader (alias) ───────────────────────────────────

function setupUserHeader() { setupAuthenticatedUI(); }

// ── Refresh Dashboard ─────────────────────────────────────────

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
window.setupAuthenticatedUI  = setupAuthenticatedUI;
window.setupUserHeader       = setupUserHeader;
window.refreshDashboard      = refreshDashboard;
window.getNivelNome          = getNivelNome;
window.isAuthSystemAvailable = isAuthSystemAvailable;

console.log('✅ app.js carregado');
