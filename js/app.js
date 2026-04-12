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

    // 3. Atualiza por ID (os mais comuns no header.html)
    const setTxt = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    setTxt('user-display-name',   nome);
    setTxt('user-display-email',  email);
    setTxt('user-display-cargo',  cargo);
    setTxt('user-nivel-label',    getNivelNome(nivel));
    setTxt('user-avatar-initials',iniciais);
    setTxt('header-user-name',    nome);
    setTxt('header-user-email',   email);
    setTxt('header-user-cargo',   cargo);

    // 4. Atualiza por classe (fallback)
    document.querySelectorAll('.user-nome, .user-name')
        .forEach(el => el.textContent = nome);
    document.querySelectorAll('.user-email')
        .forEach(el => el.textContent = email);
    document.querySelectorAll('.user-initials, .user-avatar-initials')
        .forEach(el => el.textContent = iniciais);
    document.querySelectorAll('.user-cargo, .user-role')
        .forEach(el => el.textContent = cargo);
    document.querySelectorAll('.user-nivel')
        .forEach(el => el.textContent = getNivelNome(nivel));

    // 5. Substitui "Carregando..." onde aparecer
    document.querySelectorAll('[data-user-field]').forEach(el => {
        const field = el.dataset.userField;
        if (field === 'nome')    el.textContent = nome;
        if (field === 'email')   el.textContent = email;
        if (field === 'cargo')   el.textContent = cargo;
        if (field === 'iniciais') el.textContent = iniciais;
    });

    // 6. Força substituição de texto "Carregando..." no header
    document.querySelectorAll('header *, #header-container *').forEach(el => {
        if (el.children.length === 0 && el.textContent.trim() === 'Carregando...') {
            el.textContent = nome;
        }
    });

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
