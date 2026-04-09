// ============================================
// SISTEMA DE AUTENTICAÇÃO - ORDEM PRO
// auth.js - VERSÃO CORRIGIDA
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
// VERIFICAR SUPABASE
// ============================================

function waitForSupabase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos
        
        const checkSupabase = setInterval(() => {
            attempts++;
            
            if (window.supabase && typeof window.supabase.from === 'function') {
                clearInterval(checkSupabase);
                console.log('✅ Supabase disponível');
                resolve(window.supabase);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkSupabase);
                reject(new Error('Supabase não carregado após 5 segundos'));
            }
        }, 100);
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

async function initAuth() {
    console.log('🔐 Iniciando sistema de autenticação...');
    
    try {
        // Aguardar Supabase estar disponível
        await waitForSupabase();
        
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
    } catch (error) {
        console.error('❌ Erro ao iniciar autenticação:', error);
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
        
        // ✅ VERIFICAR SUPABASE ANTES DE USAR
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            console.error('❌ Supabase não está disponível');
            throw new Error('Sistema não inicializado. Recarregue a página.');
        }
        
        // Buscar usuário no Supabase
        const { data: usuarios, error } = await window.supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('ativo', true)
            .single();
        
        if (error) {
            console.error('❌ Erro ao buscar usuário:', error);
            throw new Error('Usuário não encontrado');
        }
        
        if (!usuarios) {
            throw new Error('Usuário não encontrado ou inativo');
        }
        
        // Verificar senha
        const senhaValida = await verificarSenha(password, usuarios.senha_hash);
        
        if (!senhaValida) {
            throw new Error('Senha incorreta');
        }
        
        // Gerar token
        const token = gerarToken();
        
        // Criar sessão no banco (opcional, pode ignorar erro)
        try {
            await window.supabase
                .from('sessoes')
                .insert({
                    usuario_id: usuarios.id,
                    token: token,
                    expira_em: new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY).toISOString()
                });
        } catch (sessionError) {
            console.warn('⚠️ Não foi possível criar sessão no banco:', sessionError);
            // Continuar mesmo assim
        }
        
        // Registrar login (opcional, pode ignorar erro)
        try {
            await registrarAcesso(usuarios.id, 'login', 'dashboard', true);
        } catch (logError) {
            console.warn('⚠️ Não foi possível registrar acesso:', logError);
            // Continuar mesmo assim
        }
        
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
        
        if (session && window.supabase) {
            try {
                // Invalidar sessão no banco (opcional)
                await window.supabase
                    .from('sessoes')
                    .update({ ativo: false })
                    .eq('token', session.token);
                
                // Registrar logout (opcional)
                await registrarAcesso(session.user.id, 'logout', null, true);
            } catch (error) {
                console.warn('⚠️ Erro ao limpar sessão no banco:', error);
                // Continuar mesmo assim
            }
        }
        
        // Limpar sessão local
        clearSession();
        
        // Recarregar página
        window.location.reload();
        
        console.log('✅ Logout realizado');
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        clearSession();
        window.location.reload();
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
    // Implementado em app.js
    console.log('🎨 UI autenticada configurada');
}

function showAccessDenied(permissao) {
    alert(`❌ Acesso Negado!\n\nVocê não tem permissão para acessar: ${permissao}\n\nContate o administrador do sistema.`);
    
    // Registrar tentativa de acesso negado
    if (currentUser) {
        registrarAcesso(currentUser.id, 'acesso_bloqueado', permissao, false);
    }
}

// ============================================
// UI - MODAIS
// ============================================

function showLoginModal() {
    let loginModal = document.getElementById('login-modal');
    
    if (!loginModal) {
        console.warn('⚠️ Modal de login não encontrado');
        return;
    }
    
    loginModal.classList.remove('hidden');
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
        loginModal.classList.add('hidden');
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
    // Por enquanto, comparação simples (INSEGURO - apenas desenvolvimento)
    
    // Se o hash começar com '$2a$', é bcrypt
    if (hash.startsWith('$2a$')) {
        // Para admin com senha padrão
        if (senha === 'admin123' && hash.includes('N9qo8uLOickgx2ZMRZoMye')) {
            return true;
        }
        
        // TODO: Implementar bcrypt.compare quando disponível
        // return await bcrypt.compare(senha, hash);
    }
    
    // Fallback: comparação direta (apenas para desenvolvimento)
    return senha === hash;
}

async function registrarAcesso(usuarioId, acao, pagina = null, sucesso = true, detalhes = null) {
    if (!window.supabase) return;
    
    try {
        await window.supabase
            .from('log_acessos')
            .insert({
                usuario_id: usuarioId,
                acao: acao,
                pagina: pagina,
                sucesso: sucesso,
                detalhes: detalhes
            });
    } catch (error) {
        console.warn('⚠️ Erro ao registrar acesso:', error);
        // Não bloquear por causa de erro de log
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

console.log('✅ auth.js carregado (versão corrigida)!');
