// ============================================
// MODIFICAÇÕES PARA app.js - VERSÃO CORRIGIDA
// ADICIONAR ESTAS FUNÇÕES NO ARQUIVO app.js
// ============================================

// ✅ ADICIONAR NO TOPO DO app.js (após outras variáveis globais)

// Verificar se sistema de autenticação está disponível
function isAuthSystemAvailable() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

// ============================================
// MODIFICAR A FUNÇÃO initApp() OU DOMContentLoaded
// SUBSTITUIR O CÓDIGO EXISTENTE POR ESTE:
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando aplicação...');
    
    // ✅ VERIFICAR SE AUTH ESTÁ DISPONÍVEL
    if (isAuthSystemAvailable()) {
        console.log('🔐 Sistema de autenticação disponível');
        
        // Inicializar autenticação
        if (typeof auth.init === 'function') {
            await auth.init();
        }
        
        // Verificar se está autenticado
        if (typeof auth.isAuthenticated === 'function' && !auth.isAuthenticated()) {
            console.log('⚠️ Usuário não autenticado');
            // Modal de login será exibido pelo auth.js
            return; // Parar execução
        }
        
        console.log('✅ Usuário autenticado');
        
        // Configurar UI autenticada
        if (typeof setupAuthenticatedUI === 'function') {
            setupAuthenticatedUI();
        }
    } else {
        console.warn('⚠️ Sistema de autenticação não carregado - continuando sem auth');
        // Continuar sem autenticação (modo desenvolvimento)
    }
    
    // Inicializar tema e funções
    if (typeof initTheme === 'function') initTheme();
    if (typeof renderRecentOrders === 'function') renderRecentOrders();
    if (typeof initCharts === 'function') initCharts();
    if (typeof animateCounters === 'function') animateCounters();
    
    // Atualizar relógio
    if (typeof updateTime === 'function') {
        setInterval(updateTime, 1000);
        updateTime();
    }
    
    // Atualizar dashboard
    if (typeof updateDashboard === 'function') {
        updateDashboard();
        setInterval(updateDashboard, 30000);
    }
});

// ============================================
// ADICIONAR FUNÇÃO setupAuthenticatedUI
// ============================================

function setupAuthenticatedUI() {
    console.log('🎨 Configurando UI autenticada...');
    
    // ✅ VERIFICAR SE AUTH ESTÁ DISPONÍVEL
    if (!isAuthSystemAvailable()) {
        console.warn('⚠️ auth não disponível para configurar UI');
        return;
    }
    
    // Obter usuário atual
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
        console.warn('⚠️ Nenhum usuário autenticado');
        return;
    }
    
    console.log('👤 Usuário atual:', currentUser.nome);
    
    // Atualizar informações do usuário no header (se existir)
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) {
        userNameElement.textContent = currentUser.nome;
    }
    
    if (userRoleElement) {
        userRoleElement.textContent = currentUser.cargo || getNivelNome(currentUser.nivel_acesso);
    }
    
    if (userAvatarElement && currentUser.foto_url) {
        userAvatarElement.src = currentUser.foto_url;
    }
    
    // Configurar botão de logout (se existir)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja realmente sair do sistema?')) {
                auth.logout();
            }
        });
    }
    
    console.log('✅ UI autenticada configurada');
}

// ============================================
// ADICIONAR FUNÇÃO AUXILIAR
// ============================================

function getNivelNome(nivel) {
    switch (nivel) {
        case 1: return 'Operador';
        case 2: return 'Coordenador';
        case 3: return 'Gestor';
        case 4: return 'Administrador';
        default: return 'Usuário';
    }
}

// ============================================
// ADICIONAR FUNÇÃO showNotification (se não existir)
// ============================================

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in-right z-50`;
    notification.innerHTML = `
        <span class="material-symbols-rounded">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
