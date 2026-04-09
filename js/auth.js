// ============================================
// SISTEMA DE AUTENTICAÇÃO - ORDEM PRO
// auth.js
// ============================================

// ============================================
// CONFIGURAÇÃO
// ============================================

const AUTH_CONFIG = {
    SESSION_KEY: 'ordem_pro_session',
    TOKEN_EXPIRY: 8 * 60 * 60 * 1000, // 8 horas
    PERMISSOES: {
        DASHBOARD: 'dashboard',
        ORDENS: 'ordens',
        KANBAN: 'kanban',
        GESTAO: 'gestao',
        EQUIPE: 'equipe',
        ESTOQUE: 'estoque',
        ENTREGA: 'entrega'
    },
    NIVEIS: {
        OPERADOR: 1,
        COORDENADOR: 2,
        GESTOR: 3,
        ADMIN: 4
    }
};

// ============================================
// ESTADO DA SESSÃO
// ============================================

let currentUser = null;

// ============================================
// INICIALIZAÇÃO
// ============================================

function initAuth() {
    console.log('🔐 Iniciando sistema de autenticação...');
    
    // Verificar sessão existente
    const session = getSession();
    
    if (session && !isSessionExpired(session)) {
        // Sessão válida
        currentUser = session.user;
        console.log('✅ Usuário autenticado:', currentUser.nome);
        setupAuthenticatedUI();
    } else {
        // Sem sessão ou expirada
        console.log('⚠️ Sem autenticação válida');
        clearSession();
        showLoginModal();
    }
}

// ============================================
// GERENCIAMENTO DE SESSÃO
// ============================================

function getSession() {
    try {
        const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error('❌ Erro ao ler sessão:', error);
        return null;
    }
}

function setSession(user, token) {
    const session = {
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            nivel_acesso: user.nivel_acesso,
            cargo: user.cargo,
            foto_url: user.foto_url
        },
        token: token,
        loginTime: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.TOKEN_EXPIRY
    };
    
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
    currentUser = session.user;
    
    console.log('✅ Sessão criada:', currentUser.nome);
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    currentUser = null;
    console.log('🔓 Sessão encerrada');
}

function isSessionExpired(session) {
    return Date.now() > session.expiresAt;
}

// ============================================
// AUTENTICAÇÃO
// ============================================

async function login(email, password) {
    try {
        console.log('🔐 Tentando fazer login:', email);
        
        // Buscar usuário no Supabase
        const { data: usuarios, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('ativo', true)
            .single();
        
        if (error || !usuarios) {
            throw new Error('Usuário não encontrado ou inativo');
        }
        
        // Verificar senha (usar bcrypt no backend real)
        // Por enquanto, comparação simples (INSEGURO - apenas para desenvolvimento)
        const senhaValida = await verificarSenha(password, usuarios.senha_hash);
        
        if (!senhaValida) {
            // Registrar tentativa falha
            await registrarAcesso(usuarios.id, 'login', null, false, {
                motivo: 'senha_incorreta'
            });
            throw new Error('Senha incorreta');
        }
        
        // Gerar token
        const token = gerarToken();
        
        // Criar sessão no banco
        const { error: sessionError } = await supabase
            .from('sessoes')
            .insert({
                usuario_id: usuarios.id,
                token: token,
                expira_em: new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY).toISOString()
            });
        
        if (sessionError) {
            throw new Error('Erro ao criar sessão');
        }
        
        // Registrar login bem-sucedido
        await registrarAcesso(usuarios.id, 'login', 'dashboard', true);
        
        // Salvar sessão localmente
        setSession(usuarios, token);
        
        return {
            success: true,
            user: usuarios
        };
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function logout() {
    try {
        const session = getSession();
        
        if (session) {
            // Invalidar sessão no banco
            await supabase
                .from('sessoes')
                .update({ ativo: false })
                .eq('token', session.token);
            
            // Registrar logout
            await registrarAcesso(session.user.id, 'logout', null, true);
        }
        
        // Limpar sessão local
        clearSession();
        
        // Redirecionar para login
        showLoginModal();
        
        console.log('✅ Logout realizado');
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        clearSession();
        showLoginModal();
    }
}

// ============================================
// VERIFICAÇÃO DE PERMISSÕES
// ============================================

function hasPermission(permissao) {
    if (!currentUser) return false;
    
    const nivel = currentUser.nivel_acesso;
    
    // Admin tem acesso a tudo
    if (nivel === AUTH_CONFIG.NIVEIS.ADMIN) return true;
    
    // Verificar permissão por nível
    switch (permissao) {
        case AUTH_CONFIG.PERMISSOES.DASHBOARD:
        case AUTH_CONFIG.PERMISSOES.ORDENS:
        case AUTH_CONFIG.PERMISSOES.KANBAN:
            return nivel >= AUTH_CONFIG.NIVEIS.OPERADOR;
        
        case AUTH_CONFIG.PERMISSOES.GESTAO:
        case AUTH_CONFIG.PERMISSOES.EQUIPE:
            return nivel >= AUTH_CONFIG.NIVEIS.GESTOR;
        
        case AUTH_CONFIG.PERMISSOES.ESTOQUE:
        case AUTH_CONFIG.PERMISSOES.ENTREGA:
            return nivel >= AUTH_CONFIG.NIVEIS.ADMIN;
        
        default:
            return false;
    }
}

function requirePermission(permissao, callback) {
    if (!hasPermission(permissao)) {
        showAccessDenied(permissao);
        return false;
    }
    
    if (callback) callback();
    return true;
}

// ============================================
// UI - PROTEÇÃO DE PÁGINAS
// ============================================

function setupAuthenticatedUI() {
    // Mostrar/ocultar menu baseado em permissões
    const menuItems = {
        'menu-dashboard': AUTH_CONFIG.PERMISSOES.DASHBOARD,
        'menu-ordens': AUTH_CONFIG.PERMISSOES.ORDENS,
        'menu-kanban': AUTH_CONFIG.PERMISSOES.KANBAN,
        'menu-gestao': AUTH_CONFIG.PERMISSOES.GESTAO,
        'menu-equipe': AUTH_CONFIG.PERMISSOES.EQUIPE,
        'menu-estoque': AUTH_CONFIG.PERMISSOES.ESTOQUE,
        'menu-entrega': AUTH_CONFIG.PERMISSOES.ENTREGA
    };
    
    Object.entries(menuItems).forEach(([menuId, permissao]) => {
        const menuItem = document.getElementById(menuId);
        if (menuItem) {
            if (hasPermission(permissao)) {
                menuItem.style.display = '';
            } else {
                menuItem.style.display = 'none';
            }
        }
    });
    
    // Mostrar informações do usuário
    updateUserProfile();
}

function updateUserProfile() {
    if (!currentUser) return;
    
    // Atualizar nome do usuário na UI
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.nome;
    }
    
    // Atualizar foto do usuário
    const userPhotoElement = document.getElementById('user-photo');
    if (userPhotoElement && currentUser.foto_url) {
        userPhotoElement.src = currentUser.foto_url;
    }
    
    // Atualizar cargo
    const userRoleElement = document.getElementById('user-role');
    if (userRoleElement) {
        const roles = {
            1: 'Operador',
            2: 'Coordenador',
            3: 'Gestor',
            4: 'Administrador'
        };
        userRoleElement.textContent = roles[currentUser.nivel_acesso] || currentUser.cargo;
    }
}

// ============================================
// UI - MODAIS
// ============================================

function showLoginModal() {
    // Criar modal de login se não existir
    let loginModal = document.getElementById('login-modal');
    
    if (!loginModal) {
        loginModal = createLoginModal();
        document.body.appendChild(loginModal);
    }
    
    loginModal.classList.add('active');
    
    // Focar no campo de email
    setTimeout(() => {
        document.getElementById('login-email')?.focus();
    }, 300);
}

function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.remove('active');
    }
}

function showAccessDenied(permissao) {
    alert(`❌ Acesso Negado!\n\nVocê não tem permissão para acessar: ${permissao}\n\nContate o administrador do sistema.`);
    
    // Registrar tentativa de acesso negado
    if (currentUser) {
        registrarAcesso(currentUser.id, 'acesso_bloqueado', permissao, false);
    }
}

// ============================================
// HELPERS
// ============================================

function gerarToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

async function verificarSenha(senha, hash) {
    // IMPORTANTE: Usar bcrypt.js no frontend ou validar no backend
    // Por enquanto, comparação simples (INSEGURO)
    
    // Se o hash começar com '$2a$', é bcrypt
    if (hash.startsWith('$2a$')) {
        // Importar bcrypt.js e verificar
        // return await bcrypt.compare(senha, hash);
        
        // Por enquanto, aceitar senha 'admin123' para admin
        if (senha === 'admin123' && hash.includes('N9qo8uLOickgx2ZMRZoMye')) {
            return true;
        }
    }
    
    // Fallback: comparação direta (apenas para desenvolvimento)
    return senha === hash;
}

async function registrarAcesso(usuarioId, acao, pagina = null, sucesso = true, detalhes = null) {
    try {
        await supabase
            .from('log_acessos')
            .insert({
                usuario_id: usuarioId,
                acao: acao,
                pagina: pagina,
                sucesso: sucesso,
                detalhes: detalhes
            });
    } catch (error) {
        console.error('❌ Erro ao registrar acesso:', error);
    }
}

// ============================================
// EXPORTAR
// ============================================

window.auth = {
    init: initAuth,
    login: login,
    logout: logout,
    hasPermission: hasPermission,
    requirePermission: requirePermission,
    getCurrentUser: () => currentUser,
    isAuthenticated: () => currentUser !== null
};

console.log('✅ auth.js carregado!');
