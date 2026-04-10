// ============================================
// USER PROFILE — header dinâmico + modal perfil
// ============================================

const NIVEL_MAP = {
    1: { label: 'Operador',     icon: 'person',            color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
    2: { label: 'Coordenador',  icon: 'manage_accounts',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    3: { label: 'Gestor',       icon: 'supervisor_account',color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    4: { label: 'Administrador',icon: 'admin_panel_settings',color:'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

/** Gera as iniciais do nome (máx 2 letras) */
function getInitials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

/** Preenche o header e o menu dropdown com dados do usuário logado */
function setupUserHeader() {
    if (typeof auth === 'undefined' || !auth.isAuthenticated()) return;

    const user   = auth.getCurrentUser();
    if (!user) return;

    const nivel  = NIVEL_MAP[user.nivel_acesso] || NIVEL_MAP[1];
    const initials = getInitials(user.nome);
    const cargo  = user.cargo || nivel.label;

    // — Avatar (header) —
    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) headerAvatar.textContent = initials;

    // — Nome e cargo no header —
    setText('header-user-name', user.nome);
    setText('header-user-role', cargo);

    // — Menu dropdown —
    const menuAvatar = document.getElementById('menu-avatar');
    if (menuAvatar) menuAvatar.textContent = initials;

    setText('menu-user-name',  user.nome);
    setText('menu-user-email', user.email);

    const badge = document.getElementById('menu-user-badge');
    if (badge) {
        badge.textContent = nivel.label;
        badge.className = `inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${nivel.color}`;
    }
}

/** Abre o modal de perfil */
function openUserProfile() {
    closeUserMenu();

    if (typeof auth === 'undefined' || !auth.isAuthenticated()) return;
    const user  = auth.getCurrentUser();
    if (!user) return;

    const nivel    = NIVEL_MAP[user.nivel_acesso] || NIVEL_MAP[1];
    const initials = getInitials(user.nome);
    const cargo    = user.cargo || nivel.label;
    const sessao   = new Date().toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' });

    // Avatar grande
    const bigAvatar = document.getElementById('profile-avatar-big');
    if (bigAvatar) bigAvatar.textContent = initials;

    setText('profile-name',  user.nome);
    setText('profile-email', user.email);
    setText('profile-cargo', cargo);
    setText('profile-nivel', `Nível ${user.nivel_acesso} — ${nivel.label}`);
    setText('profile-sessao', sessao);

    const profileBadge = document.getElementById('profile-badge');
    if (profileBadge) {
        profileBadge.textContent = nivel.label;
        profileBadge.className = `inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${nivel.color}`;
    }

    // Abre o modal com animação
    const modal   = document.getElementById('profile-modal');
    const content = document.getElementById('profile-modal-content');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        content.style.transform = 'scale(1)';
        content.style.opacity   = '1';
    });
}

/** Fecha o modal de perfil */
function closeUserProfile() {
    const modal   = document.getElementById('profile-modal');
    const content = document.getElementById('profile-modal-content');
    if (!modal || !content) return;

    content.style.transform = 'scale(0.95)';
    content.style.opacity   = '0';
    setTimeout(() => modal.classList.add('hidden'), 280);
}

/** Fecha o menu dropdown */
function closeUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.add('hidden');
}

/** Logout com confirmação visual */
async function handleLogout() {
    closeUserProfile();
    closeUserMenu();

    // Mini feedback antes de sair
    const btn = event?.currentTarget;
    if (btn) {
        btn.innerHTML = '<span class="material-symbols-rounded animate-spin text-lg">progress_activity</span> Saindo...';
        btn.disabled = true;
    }

    await new Promise(r => setTimeout(r, 600));

    if (typeof auth !== 'undefined') {
        await auth.logout();
    } else {
        localStorage.clear();
        window.location.reload();
    }
}

// ─── helpers ────────────────────────────────────────────────────────────────

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '—';
}

// ─── init ───────────────────────────────────────────────────────────────────

// Fecha o dropdown ao clicar fora
document.addEventListener('click', e => {
    const menu   = document.getElementById('user-menu');
    const toggle = e.target.closest('[onclick="toggleUserMenu()"]');
    if (!toggle && menu && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Chama setupUserHeader após carregamento dos componentes
window.addEventListener('authReady', setupUserHeader);

// Fallback: tenta após 1.5 s caso o evento não dispare
setTimeout(setupUserHeader, 1500);

// Expõe funções globalmente
window.openUserProfile  = openUserProfile;
window.closeUserProfile = closeUserProfile;
window.closeUserMenu    = closeUserMenu;
window.handleLogout     = handleLogout;
window.setupUserHeader  = setupUserHeader;

console.log('✅ user-profile.js carregado!');
