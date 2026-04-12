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

// ── setupAuthenticatedUI — atualiza TODOS os elementos do header ──

function setupAuthenticatedUI() {
    // 1. Garante modal fechado
    const lm = document.getElementById('login-modal');
    if (lm) { lm.classList.add('hidden'); lm.classList.remove('active'); }

    // 2. Obtém usuário da sessão (tenta auth e localStorage)
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

    const nome    = user.nome  || 'Usuário';
    const email   = user.email || '';
    const nivel   = user.nivel ?? user.nivel_acesso ?? 0;
    const cargo   = user.cargo || getNivelNome(nivel);
    const iniciais = nome.split(' ').filter(Boolean).map(p=>p[0]).slice(0,2).join('').toUpperCase() || '?';

    console.log('👤 setupAuthenticatedUI →', nome, '(nível', nivel, ')');

    // 3. IDs exatos do header.html
    const setTxt = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    // Header (barra superior)
    setTxt('header-user-name',  nome);
    setTxt('header-user-role',  cargo);

    // Avatar header
    const avatarEl = document.getElementById('header-avatar');
    if (avatarEl) avatarEl.textContent = iniciais;

    // Menu dropdown
    setTxt('menu-user-name',  nome);
    setTxt('menu-user-email', email);
    setTxt('menu-user-badge', getNivelNome(nivel));

    const menuAvatarEl = document.getElementById('menu-avatar');
    if (menuAvatarEl) menuAvatarEl.textContent = iniciais;

    // Modal de perfil
    setTxt('profile-name',  nome);
    setTxt('profile-email', email);
    setTxt('profile-cargo', cargo);
    setTxt('profile-nivel', getNivelNome(nivel));
    setTxt('profile-badge', getNivelNome(nivel));

    const profileAvatarEl = document.getElementById('profile-avatar-big');
    if (profileAvatarEl) profileAvatarEl.textContent = iniciais;

    // Sessão (horário de login)
    try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        if (s.loginTime) {
            const dt = new Date(s.loginTime);
            setTxt('profile-sessao', dt.toLocaleString('pt-BR'));
        }
    } catch(_) {}

    // Garante que o search bar está limpo e sem autocomplete
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

window.setupAuthenticatedUI  = setupAuthenticatedUI;
window.setupUserHeader       = setupUserHeader;
window.refreshDashboard      = refreshDashboard;
window.getNivelNome          = getNivelNome;
window.isAuthSystemAvailable = isAuthSystemAvailable;

console.log('✅ app.js carregado');
