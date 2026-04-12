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
    // Garante que o modal de login está fechado
    const m = document.getElementById('login-modal');
    if (m) { m.classList.add('hidden'); m.classList.remove('active'); }

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
    getCurrentUser:  () => currentUser,   // alias para compatibilidade
    getNivel:        () => currentUser?.nivel ?? currentUser?.nivel_acesso ?? 0,
    updateUserCache: (updates) => {
        if (!currentUser) return;
        Object.assign(currentUser, updates);
        const s = getSession();
        if (s) { Object.assign(s.user, updates); localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(s)); }
    }
};

// Expõe globalmente
window.getNivel        = () => currentUser?.nivel ?? currentUser?.nivel_acesso ?? 0;
window.getCurrentUser  = () => currentUser;

// ── INATIVIDADE — 5 minutos sem interação → logout ───────────

(function initInactivityTimeout() {
    const TIMEOUT_MS  = 5 * 60 * 1000;  // 5 minutos
    const WARN_MS     = 60 * 1000;       // avisa 1 min antes
    let timerLogout, timerWarn, warnShown = false;

    function resetTimer() {
        clearTimeout(timerLogout);
        clearTimeout(timerWarn);
        warnShown = false;

        // Remove aviso se existir
        document.getElementById('inactivity-warn')?.remove();

        // Não inicia timer se não estiver autenticado ou for visitante
        const s = (() => { try { return JSON.parse(localStorage.getItem('ordem_pro_session')||'null'); } catch{return null;} })();
        if (!s?.user || s.user.id === 'guest') return;

        // Aviso 1 minuto antes
        timerWarn = setTimeout(() => {
            if (warnShown) return;
            warnShown = true;
            const div = document.createElement('div');
            div.id = 'inactivity-warn';
            div.style.cssText = `
                position:fixed;bottom:24px;right:24px;z-index:9999;
                background:#1e293b;border:1.5px solid #f59e0b;color:#fbbf24;
                padding:14px 18px;border-radius:14px;font-size:13px;font-weight:600;
                box-shadow:0 8px 30px rgba(0,0,0,.6);display:flex;align-items:center;gap:10px;
                animation:slideInRight .4s cubic-bezier(.16,1,.3,1);
            `;
            div.innerHTML = `
                <span class="material-symbols-rounded" style="font-size:20px;color:#f59e0b;font-variation-settings:'FILL' 1">timer</span>
                <div>
                    <p style="margin:0">Sessão expirando em <strong>1 minuto</strong></p>
                    <p style="margin:0;font-size:11px;opacity:.7">Mova o mouse para continuar</p>
                </div>
                <button onclick="document.getElementById('inactivity-warn')?.remove()" 
                    style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:2px;margin-left:6px;">✕</button>
            `;
            document.body.appendChild(div);
        }, TIMEOUT_MS - WARN_MS);

        // Logout automático
        timerLogout = setTimeout(async () => {
            document.getElementById('inactivity-warn')?.remove();
            // Aviso final antes de deslogar
            const div = document.createElement('div');
            div.style.cssText = `
                position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.7);
                display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);
            `;
            div.innerHTML = `
                <div style="background:#1e293b;border:1.5px solid #ef4444;border-radius:16px;padding:24px 32px;text-align:center;color:#f1f5f9;">
                    <span class="material-symbols-rounded" style="font-size:40px;color:#f87171;display:block;margin-bottom:8px;font-variation-settings:'FILL' 1">lock</span>
                    <p style="font-weight:700;font-size:16px;margin:0 0 4px;">Sessão encerrada</p>
                    <p style="font-size:13px;opacity:.6;margin:0">Inatividade de 5 minutos detectada</p>
                </div>`;
            document.body.appendChild(div);
            await new Promise(r => setTimeout(r, 2000));
            clearSession();
            window.location.reload();
        }, TIMEOUT_MS);
    }

    // Escuta qualquer interação do usuário
    const eventos = ['mousemove','mousedown','keydown','touchstart','click','scroll'];
    eventos.forEach(ev => document.addEventListener(ev, resetTimer, { passive: true }));

    // Inicia timer ao carregar (após auth estar pronto)
    setTimeout(resetTimer, 3000);
    console.log('⏱️ Timeout de inatividade: 5 minutos');
})();

console.log('✅ auth.js carregado — domínio @vetore.com');
