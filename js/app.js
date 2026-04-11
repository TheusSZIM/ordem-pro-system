/* ============================================
   CONTROLE DE ORDENS PRO - APLICAÇÃO PRINCIPAL
   ============================================ */

// ── Verifica se auth está disponível ─────────────────────────
function isAuthSystemAvailable() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando aplicação...');

    if (isAuthSystemAvailable()) {
        console.log('🔐 Sistema de autenticação disponível');
        await auth.init();

        if (!auth.isAuthenticated()) {
            console.log('⚠️ Usuário não autenticado, aguardando login...');
            return;
        }
    } else {
        console.warn('⚠️ Sistema de autenticação não carregado - continuando sem auth');
    }

    // Carregar dados do Supabase
    if (typeof loadOrders === 'function') await loadOrders();

    // Renderizar o que já está no DOM (partes não-async)
    if (typeof initTheme        === 'function') initTheme();
    if (typeof updateTime       === 'function') { updateTime(); setInterval(updateTime, 1000); }
    if (typeof animateCounters  === 'function') animateCounters();

    // Configurar UI do usuário
    if (typeof setupAuthenticatedUI === 'function') setupAuthenticatedUI();
    if (typeof setupUserHeader      === 'function') setupUserHeader();
});

// ── Após componentes HTML carregarem (chamado pelo index.html) ─

window.onComponentsLoaded = async function() {
    console.log('✅ Componentes carregados — inicializando interface...');

    if (isAuthSystemAvailable()) {
        await auth.init();
        if (!auth.isAuthenticated()) return;
    }

    // Garante que os dados estão prontos
    if (typeof loadOrders === 'function') await loadOrders();

    // Inicializa gráficos (canvas já existe no DOM)
    if (typeof initCharts           === 'function') initCharts();

    // Renderiza ordens recentes (tabela já existe no DOM)
    if (typeof renderRecentOrders   === 'function') renderRecentOrders();

    // Estatísticas do dashboard
    if (typeof renderDashboardStats === 'function') {
        renderDashboardStats();
        setInterval(renderDashboardStats, 30000);
    }

    // UI autenticada
    if (typeof setupAuthenticatedUI === 'function') setupAuthenticatedUI();
    if (typeof setupUserHeader      === 'function') setupUserHeader();

    console.log('✅ Interface inicializada');
};

// ── setupAuthenticatedUI ──────────────────────────────────────

function setupAuthenticatedUI() {
    if (!isAuthSystemAvailable()) {
        console.warn('⚠️ auth não disponível para configurar UI');
        return;
    }
    console.log('🎨 Configurando UI autenticada...');
    const user = auth.getCurrentUser();
    if (!user) return;
    console.log('👤 Usuário atual:', user.nome);
    console.log('✅ UI autenticada configurada');
}

// ── Nível de acesso ───────────────────────────────────────────

function getNivelNome(nivel) {
    const niveis = { 1:'Operador', 2:'Coordenador', 3:'Gestor', 4:'Administrador' };
    return niveis[nivel] || 'Usuário';
}

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

window.refreshDashboard = refreshDashboard;
console.log('✅ app.js carregado');
