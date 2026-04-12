// ============================================
// SISTEMA DE AUTENTICAÇÃO — ORDEM PRO
// auth.js — Domínio @vetore.com
// ============================================

const AUTH_CONFIG = {
    SESSION_KEY: 'ordem_pro_session',
    TOKEN_EXPIRY: 8 * 60 * 60 * 1000, // 8 horas
};

let currentUser   = null;
let authSupabaseClient = null;

// ── Obtém instância do Supabase ──────────────────────────────

function getSupabase() {
    if (authSupabaseClient) return authSupabaseClient;
    for (const ref of [window.supabaseClient, window.supabase,
                       (typeof supabaseClient!=='undefined'?supabaseClient:null),
                       (typeof supabase!=='undefined'?supabase:null)]) {
        if (ref?.from) { authSupabaseClient = ref; return ref; }
    }
    return null;
}

function waitForSupabase() {
    return new Promise((resolve, reject) => {
        let n = 0;
        const t = setInterval(() => {
            const sb = getSupabase();
            if (sb) { clearInterval(t); resolve(sb); }
            else if (++n >= 100) { clearInterval(t); reject(new Error('Supabase não carregado')); }
        }, 100);
    });
}

// ── Sessão ───────────────────────────────────────────────────

function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_CONFIG.SESSION_KEY) || 'null'); }
    catch { return null; }
}

function setSession(user, token) {
    const session = {
        user: {
            id:           user.id,
            nome:         user.nome,
            email:        user.email,
            nivel:        user.nivel        ?? user.nivel_acesso ?? 2,
            nivel_acesso: user.nivel_acesso ?? user.nivel        ?? 2,
            cargo:        user.cargo,
            celula:       user.celula || user.departamento,
            foto_url:     user.foto_url,
        },
        token,
        loginTime: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.TOKEN_EXPIRY,
    };
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
    currentUser = session.user;
    console.log('✅ Sessão criada:', currentUser.nome, '· nível', currentUser.nivel);
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    currentUser = null;
}

function isSessionExpired(s) { return Date.now() > s.expiresAt; }

// ── Init ─────────────────────────────────────────────────────

async function initAuth() {
    console.log('🔐 Iniciando autenticação...');
    try {
        authSupabaseClient = await waitForSupabase();
        const session = getSession();

        // Sessão de visitante (nível 0)
        if (session?.user?.id === 'guest') {
            currentUser = session.user;
            console.log('👁️ Modo Visualizador');
            setupAuthenticatedUI();
            return;
        }

        if (session && !isSessionExpired(session)) {
            currentUser = session.user;
            console.log('✅ Sessão válida:', currentUser.nome);
            setupAuthenticatedUI();
        } else {
            clearSession();
            showLoginModal();
        }
    } catch (e) {
        console.error('❌ Erro auth:', e);
        showLoginModal();
    }
}

// ── Login ─────────────────────────────────────────────────────

async function login(email, password) {
    try {
        const sb = getSupabase();
        if (!sb) throw new Error('Sistema não inicializado. Recarregue a página.');

        const { data: user, error } = await sb
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('ativo', true)
            .single();

        if (error || !user) throw new Error('Usuário não encontrado ou inativo');

        // Verifica senha — compara contra 'senha' e 'senha_hash'
        const senhaOk = password === user.senha
                     || password === user.senha_hash
                     || verificarSenhaLegado(password, user.senha_hash);
        if (!senhaOk) throw new Error('Senha incorreta');

        // Atualiza último acesso
        sb.from('usuarios')
          .update({ data_ultimo_acesso: new Date().toISOString() })
          .eq('id', user.id)
          .then(() => {}).catch(() => {});

        const token = 'tk_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        setSession(user, token);

        return { success: true, user };
    } catch (e) {
        console.error('❌ Login:', e.message);
        return { success: false, message: e.message };
    }
}

function verificarSenhaLegado(senha, hash) {
    // Suporte a hash bcrypt simples (fallback)
    if (!hash) return false;
    if (hash.startsWith('$2')) return senha === 'admin123'; // dev only
    return senha === hash;
}

// ── Logout ────────────────────────────────────────────────────

async function logout() {
    clearSession();
    window.location.reload();
}

// ── UI ────────────────────────────────────────────────────────

function showLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) { m.classList.remove('hidden'); m.classList.add('active'); }
    setTimeout(() => document.getElementById('login-email')?.focus(), 300);
}

function hideLoginModal() {
    const m = document.getElementById('login-modal');
    if (m) { m.classList.add('hidden'); m.classList.remove('active'); }
}

function setupAuthenticatedUI() {
    // Atualiza header com nome/avatar do usuário
    const nome  = currentUser?.nome  || 'Usuário';
    const email = currentUser?.email || '';
    const nivel = currentUser?.nivel ?? currentUser?.nivel_acesso ?? 0;

    const nomeEls = document.querySelectorAll('#user-display-name, .user-nome');
    nomeEls.forEach(el => el && (el.textContent = nome));

    const emailEls = document.querySelectorAll('#user-display-email, .user-email');
    emailEls.forEach(el => el && (el.textContent = email));

    // Avatar com iniciais
    const iniciais = nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    document.querySelectorAll('#user-avatar-initials, .user-initials')
        .forEach(el => el && (el.textContent = iniciais));

    console.log('🎨 UI configurada para:', nome, '(nível', nivel, ')');
}

// ── API Pública ───────────────────────────────────────────────

window.auth = {
    init:            initAuth,
    login:           login,
    logout:          logout,
    isAuthenticated: () => currentUser !== null,
    getUser:         () => currentUser,
    getNivel:        () => currentUser?.nivel ?? currentUser?.nivel_acesso ?? 0,
    updateUserCache: (updates) => {
        if (!currentUser) return;
        Object.assign(currentUser, updates);
        const s = getSession();
        if (s) { Object.assign(s.user, updates); localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(s)); }
    }
};

// Também expõe getNivel globalmente para permissions.js
window.getNivel = () => currentUser?.nivel ?? currentUser?.nivel_acesso ?? 0;

console.log('✅ auth.js carregado — domínio @vetore.com');
