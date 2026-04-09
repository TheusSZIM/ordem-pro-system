// ============================================
// ADICIONAR NO INÍCIO DO app.js
// Logo após 'use strict';
// ============================================

// ============================================
// INICIALIZAÇÃO COM AUTENTICAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicação...');
    
    // PASSO 1: Verificar autenticação
    if (typeof auth !== 'undefined') {
        auth.init();
        
        // PASSO 2: Se autenticado, carregar app
        if (auth.isAuthenticated()) {
            console.log('✅ Usuário autenticado, carregando dados...');
            initializeApp();
        } else {
            console.log('⚠️ Usuário não autenticado, aguardando login...');
        }
    } else {
        console.warn('⚠️ Sistema de autenticação não carregado');
        // Carregar app mesmo assim (para desenvolvimento)
        initializeApp();
    }
});

// Função principal de inicialização
function initializeApp() {
    // Código de inicialização existente
    if (typeof loadOrders === 'function') {
        loadOrders();
    }
    if (typeof renderDashboardStats === 'function') {
        renderDashboardStats();
    }
    if (typeof updateClock === 'function') {
        updateClock();
        setInterval(updateClock, 1000);
    }
    if (typeof initCharts === 'function') {
        initCharts();
    }
}


// ============================================
// SUBSTITUIR FUNÇÃO showPage EXISTENTE
// Adicionar verificação de permissões
// ============================================

// VERSÃO ORIGINAL (comentar ou deletar):
/*
function showPage(pageId) {
    // ... código existente ...
}
*/

// VERSÃO COM PROTEÇÃO:
function showPage(pageId) {
    console.log('📄 Navegando para:', pageId);
    
    // ✅ VERIFICAÇÃO DE PERMISSÕES
    const paginasProtegidas = {
        'gestao': 'gestao',
        'equipe': 'equipe',
        'estoque': 'estoque',
        'entrega': 'entrega'
    };
    
    const permissaoNecessaria = paginasProtegidas[pageId];
    
    if (permissaoNecessaria) {
        // Verificar se está autenticado
        if (typeof auth === 'undefined' || !auth.isAuthenticated()) {
            console.warn('⚠️ Usuário não autenticado');
            if (typeof auth !== 'undefined') {
                auth.init(); // Mostrar login
            }
            return;
        }
        
        // Verificar permissão específica
        if (!auth.hasPermission(permissaoNecessaria)) {
            console.warn(`⚠️ Sem permissão para acessar: ${pageId}`);
            
            // Mostrar mensagem de acesso negado
            showAccessDeniedMessage(pageId);
            return;
        }
        
        console.log(`✅ Permissão concedida para: ${pageId}`);
    }
    
    // ✅ CÓDIGO ORIGINAL DA FUNÇÃO (manter como está)
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar página solicitada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Atualizar menu ativo
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const menuItem = document.querySelector(`[onclick*="${pageId}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
    } else {
        console.error(`❌ Página não encontrada: ${pageId}`);
    }
}

// Função auxiliar para mostrar acesso negado
function showAccessDeniedMessage(pageId) {
    const nomesPages = {
        'gestao': 'Gestão',
        'equipe': 'Equipe',
        'estoque': 'Estoque',
        'entrega': 'Entrega de Ordem'
    };
    
    const nomePagina = nomesPages[pageId] || pageId;
    
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg animate-slide-down';
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-rounded text-red-600">lock</span>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-red-900 dark:text-red-400 mb-1">Acesso Negado</h4>
                <p class="text-sm text-red-700 dark:text-red-500">
                    Você não tem permissão para acessar: <strong>${nomePagina}</strong>
                </p>
                <p class="text-xs text-red-600 dark:text-red-600 mt-2">
                    Contate o administrador do sistema para solicitar acesso.
                </p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-red-400 hover:text-red-600">
                <span class="material-symbols-rounded">close</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// ============================================
// FUNÇÃO AUXILIAR: Atualizar UI do Usuário
// Adicionar no final do arquivo
// ============================================

function setupAuthenticatedUI() {
    console.log('🎨 Configurando UI autenticada...');
    
    if (!auth || !auth.isAuthenticated()) {
        console.warn('⚠️ Usuário não autenticado');
        return;
    }
    
    const user = auth.getCurrentUser();
    if (!user) return;
    
    // Atualizar nome do usuário
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.nome;
    }
    
    // Atualizar foto do usuário
    const userPhotoElement = document.getElementById('user-photo');
    if (userPhotoElement) {
        const photoUrl = user.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=8b5cf6&color=fff`;
        userPhotoElement.src = photoUrl;
    }
    
    // Atualizar cargo
    const userRoleElement = document.getElementById('user-role');
    if (userRoleElement) {
        const cargos = {
            1: 'Operador',
            2: 'Coordenador',
            3: 'Gestor',
            4: 'Administrador'
        };
        userRoleElement.textContent = user.cargo || cargos[user.nivel_acesso] || 'Usuário';
    }
    
    // Esconder/mostrar itens de menu baseado em permissões
    const menuItems = document.querySelectorAll('[data-permission]');
    menuItems.forEach(item => {
        const permission = item.getAttribute('data-permission');
        if (permission) {
            if (auth.hasPermission(permission)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    });
    
    console.log('✅ UI configurada para:', user.nome);
}


// ============================================
// FUNÇÃO DE NOTIFICAÇÃO
// Se não existir, adicionar
// ============================================

function showNotification(message, type = 'info') {
    const colors = {
        success: 'emerald',
        error: 'red',
        warning: 'amber',
        info: 'blue'
    };
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    
    const color = colors[type] || 'blue';
    const icon = icons[type] || 'info';
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-xl p-4 shadow-lg animate-slide-down`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="material-symbols-rounded text-${color}-600">${icon}</span>
            <span class="text-sm text-${color}-900 dark:text-${color}-400">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-${color}-400 hover:text-${color}-600">
                <span class="material-symbols-rounded text-sm">close</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
