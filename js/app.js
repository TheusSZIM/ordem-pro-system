/* ============================================
   CONTROLE DE ORDENS PRO - APLICAÇÃO PRINCIPAL
   app.js — sem DOMContentLoaded duplicado
   (a inicialização fica no index.html)
   ============================================ */

// ── Helpers ───────────────────────────────────────────────────

function isAuthSystemAvailable() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

function getNivelNome(nivel) {
    const niveis = { 0:'Visualizador', 1:'Stage', 2:'Separador', 3:'Admin' };
    return niveis[nivel] || 'Usuário';
}

// ── setupAuthenticatedUI ──────────────────────────────────────
// Chamado pelo index.html após carregar tudo.
// A versão do auth.js já esconde o modal e atualiza o header.
// Esta versão complementa com dados da sessão no header.

function setupAuthenticatedUI() {
    // Garante modal fechado
    const lm = document.getElementById('login-modal');
    if (lm) { lm.classList.add('hidden'); lm.classList.remove('active'); }

    if (!isAuthSystemAvailable()) return;

    const user = auth.getCurrentUser?.() || auth.getUser?.();
    if (!user) return;

    console.log('👤 Configurando UI para:', user.nome, '· nível', user.nivel ?? user.nivel_acesso);

    // Nome e email no header
    const nome  = user.nome  || 'Usuário';
    const email = user.email || '';
    const nivel = user.nivel ?? user.nivel_acesso ?? 0;

    document.querySelectorAll('#user-display-name,  .user-nome')
        .forEach(el => el && (el.textContent = nome));
    document.querySelectorAll('#user-display-email, .user-email')
        .forEach(el => el && (el.textContent = email));
    document.querySelectorAll('#user-nivel-label,   .user-nivel')
        .forEach(el => el && (el.textContent = getNivelNome(nivel)));

    // Avatar com iniciais
    const iniciais = nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    document.querySelectorAll('#user-avatar-initials, .user-initials')
        .forEach(el => el && (el.textContent = iniciais));

    console.log('✅ UI autenticada configurada');
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

// ── Expõe globalmente ─────────────────────────────────────────

window.setupAuthenticatedUI = setupAuthenticatedUI;
window.setupUserHeader      = setupUserHeader;
window.refreshDashboard     = refreshDashboard;
window.getNivelNome         = getNivelNome;
window.isAuthSystemAvailable = isAuthSystemAvailable;

console.log('✅ app.js carregado (sem DOMContentLoaded duplicado)');
