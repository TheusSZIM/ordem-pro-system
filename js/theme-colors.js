// ============================================
// SISTEMA DE TEMAS DE COR — Ordem Pro
// js/theme-colors.js
// ============================================

const THEMES = {
    indigo: {
        nome: 'Índigo',
        emoji: '🟣',
        cor: '#6366f1',
        vars: {
            '--t50':  '#eef2ff', '--t100': '#e0e7ff', '--t200': '#c7d2fe',
            '--t300': '#a5b4fc', '--t400': '#818cf8', '--t500': '#6366f1',
            '--t600': '#4f46e5', '--t700': '#4338ca', '--t800': '#3730a3',
            '--t900': '#312e81',
        }
    },
    azul: {
        nome: 'Azul',
        emoji: '🔵',
        cor: '#3b82f6',
        vars: {
            '--t50':  '#eff6ff', '--t100': '#dbeafe', '--t200': '#bfdbfe',
            '--t300': '#93c5fd', '--t400': '#60a5fa', '--t500': '#3b82f6',
            '--t600': '#2563eb', '--t700': '#1d4ed8', '--t800': '#1e40af',
            '--t900': '#1e3a8a',
        }
    },
    verde: {
        nome: 'Verde',
        emoji: '🟢',
        cor: '#10b981',
        vars: {
            '--t50':  '#ecfdf5', '--t100': '#d1fae5', '--t200': '#a7f3d0',
            '--t300': '#6ee7b7', '--t400': '#34d399', '--t500': '#10b981',
            '--t600': '#059669', '--t700': '#047857', '--t800': '#065f46',
            '--t900': '#064e3b',
        }
    },
    roxo: {
        nome: 'Roxo',
        emoji: '🟪',
        cor: '#8b5cf6',
        vars: {
            '--t50':  '#f5f3ff', '--t100': '#ede9fe', '--t200': '#ddd6fe',
            '--t300': '#c4b5fd', '--t400': '#a78bfa', '--t500': '#8b5cf6',
            '--t600': '#7c3aed', '--t700': '#6d28d9', '--t800': '#5b21b6',
            '--t900': '#4c1d95',
        }
    },
    rosa: {
        nome: 'Rosa',
        emoji: '🩷',
        cor: '#ec4899',
        vars: {
            '--t50':  '#fdf2f8', '--t100': '#fce7f3', '--t200': '#fbcfe8',
            '--t300': '#f9a8d4', '--t400': '#f472b6', '--t500': '#ec4899',
            '--t600': '#db2777', '--t700': '#be185d', '--t800': '#9d174d',
            '--t900': '#831843',
        }
    },
    vermelho: {
        nome: 'Vermelho',
        emoji: '🔴',
        cor: '#ef4444',
        vars: {
            '--t50':  '#fef2f2', '--t100': '#fee2e2', '--t200': '#fecaca',
            '--t300': '#fca5a5', '--t400': '#f87171', '--t500': '#ef4444',
            '--t600': '#dc2626', '--t700': '#b91c1c', '--t800': '#991b1b',
            '--t900': '#7f1d1d',
        }
    },
    laranja: {
        nome: 'Laranja',
        emoji: '🟠',
        cor: '#f97316',
        vars: {
            '--t50':  '#fff7ed', '--t100': '#ffedd5', '--t200': '#fed7aa',
            '--t300': '#fdba74', '--t400': '#fb923c', '--t500': '#f97316',
            '--t600': '#ea580c', '--t700': '#c2410c', '--t800': '#9a3412',
            '--t900': '#7c2d12',
        }
    },
    teal: {
        nome: 'Teal',
        emoji: '🩵',
        cor: '#14b8a6',
        vars: {
            '--t50':  '#f0fdfa', '--t100': '#ccfbf1', '--t200': '#99f6e4',
            '--t300': '#5eead4', '--t400': '#2dd4bf', '--t500': '#14b8a6',
            '--t600': '#0d9488', '--t700': '#0f766e', '--t800': '#115e59',
            '--t900': '#134e4a',
        }
    },
};

const THEME_LS_KEY = 'op_color_theme';

// ── Injeta CSS de variáveis + overrides ──────────────────────

function applyThemeVars(themeKey) {
    const theme = THEMES[themeKey] || THEMES.indigo;
    let style = document.getElementById('theme-vars-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'theme-vars-style';
        document.head.appendChild(style);
    }

    const vars = Object.entries(theme.vars).map(([k,v]) => `${k}:${v}`).join(';');

    style.textContent = `
        :root { ${vars}; }

        /* ── Botões primários ── */
        .bg-primary-600, [class*="bg-primary-600"] { background-color: var(--t600) !important; }
        .bg-primary-700, [class*="bg-primary-700"],
        .hover\\:bg-primary-700:hover             { background-color: var(--t700) !important; }
        .bg-primary-500                            { background-color: var(--t500) !important; }
        .bg-primary-100                            { background-color: var(--t100) !important; }
        .bg-primary-50                             { background-color: var(--t50)  !important; }

        /* dark variants */
        .dark .dark\\:bg-primary-900\\/30 { background-color: color-mix(in srgb, var(--t900) 30%, transparent) !important; }
        .dark .dark\\:bg-primary-900\\/20 { background-color: color-mix(in srgb, var(--t900) 20%, transparent) !important; }

        /* ── Texto primário ── */
        .text-primary-600  { color: var(--t600) !important; }
        .text-primary-700  { color: var(--t700) !important; }
        .text-primary-500  { color: var(--t500) !important; }
        .text-primary-400  { color: var(--t400) !important; }
        .text-primary-300  { color: var(--t300) !important; }
        .dark .dark\\:text-primary-400 { color: var(--t400) !important; }

        /* ── Bordas ── */
        .border-primary-500 { border-color: var(--t500) !important; }
        .border-primary-600 { border-color: var(--t600) !important; }

        /* ── Focus ring ── */
        .focus\\:ring-primary-500:focus { --tw-ring-color: var(--t500) !important; }

        /* ── Gradientes (logo, botões, header) ── */
        .from-primary-600 { --tw-gradient-from: var(--t600) !important; }
        .to-primary-800   { --tw-gradient-to:   var(--t800) !important; }
        .from-primary-500 { --tw-gradient-from: var(--t500) !important; }
        .to-primary-700   { --tw-gradient-to:   var(--t700) !important; }

        /* ── Shadows glow ── */
        .shadow-primary-500\\/30 { box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--t500) 30%, transparent) !important; }
        .shadow-primary-500\\/50 { box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--t500) 50%, transparent) !important; }
        .shadow-glow             { box-shadow: 0 0 20px color-mix(in srgb, var(--t500) 20%, transparent) !important; }

        /* ── Active nav na sidebar ── */
        .nav-item.active-nav {
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--t600) 22%, transparent),
                color-mix(in srgb, var(--t600) 6%,  transparent)) !important;
            color: var(--t400) !important;
        }
        .nav-item.active-nav::before {
            background: linear-gradient(180deg, var(--t300), var(--t600)) !important;
        }
        .nav-item:hover { color: var(--t300) !important; }
        .nav-badge { background: color-mix(in srgb, var(--t500) 25%, transparent) !important; color: var(--t400) !important; }
        #sb-pill .material-symbols-rounded { color: var(--t400) !important; }
        #sb-pill { border-color: color-mix(in srgb, var(--t500) 30%, transparent) !important; }

        /* ── Distribuição gráfico ── */
        .text-gradient {
            background: linear-gradient(135deg, var(--t600) 0%, var(--t400) 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }

        /* ── Active nav no CSS global ── */
        .active-nav {
            color: var(--t600) !important;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--t600) 10%, transparent),
                color-mix(in srgb, var(--t600) 5%,  transparent)) !important;
        }
        .dark .active-nav { color: var(--t400) !important; }
        .active-nav::before { background: var(--t600) !important; }

        /* ── Ordens tabs ── */
        .bg-primary-100.dark\\:bg-primary-900\\/30 { background-color: var(--t100) !important; }
        .text-primary-700.dark\\:text-primary-400  { color: var(--t700) !important; }

        /* ── Kanban filter btn active ── */
        .kf-btn.active { background: var(--t600) !important; border-color: var(--t600) !important; }
        .kf-btn:hover  { border-color: var(--t500) !important; color: var(--t400) !important; }
    `;
}

// ── Aplica tema salvo ou padrão ───────────────────────────────

function loadSavedTheme() {
    const saved = getUserThemeKey();
    applyThemeVars(saved);
    window._currentTheme = saved;
}

function getUserThemeKey() {
    // Tenta carregar tema do usuário logado, senão usa o global
    try {
        const session = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        const email   = session?.user?.email;
        if (email) {
            const userKey = `${THEME_LS_KEY}_${email}`;
            return localStorage.getItem(userKey) || localStorage.getItem(THEME_LS_KEY) || 'indigo';
        }
    } catch(_) {}
    return localStorage.getItem(THEME_LS_KEY) || 'indigo';
}

function setTheme(themeKey) {
    applyThemeVars(themeKey);
    window._currentTheme = themeKey;

    // Salva globalmente
    localStorage.setItem(THEME_LS_KEY, themeKey);

    // Salva também por usuário
    try {
        const session = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        const email   = session?.user?.email;
        if (email) localStorage.setItem(`${THEME_LS_KEY}_${email}`, themeKey);
    } catch(_) {}

    // Atualiza seletores visuais se estiverem abertos
    document.querySelectorAll('.theme-swatch').forEach(el => {
        el.classList.toggle('ring-2', el.dataset.theme === themeKey);
        el.classList.toggle('ring-offset-2', el.dataset.theme === themeKey);
        el.classList.toggle('ring-white', el.dataset.theme === themeKey);
    });
}

// ── Renderiza o painel de seleção de temas ───────────────────

function renderThemePanel() {
    const current = window._currentTheme || getUserThemeKey();
    return `
        <div class="space-y-4">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cor do Sistema</p>
                <div class="grid grid-cols-4 gap-3">
                    ${Object.entries(THEMES).map(([key, t]) => `
                        <button
                            class="theme-swatch flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                            data-theme="${key}"
                            onclick="setTheme('${key}')"
                            title="${t.nome}"
                        >
                            <div class="w-9 h-9 rounded-full ring-offset-slate-900 transition-all ${current===key?'ring-2 ring-white ring-offset-2':''}"
                                 style="background: linear-gradient(135deg, ${t.vars['--t400']}, ${t.vars['--t700']});
                                        box-shadow: 0 4px 12px ${t.vars['--t500']}55;">
                            </div>
                            <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                                ${t.nome}
                            </span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ── Abre modal de personalização ─────────────────────────────

window.openPersonalizacao = function() {
    // Fecha o menu dropdown se estiver aberto
    document.getElementById('user-menu')?.classList.add('hidden');

    const existing = document.getElementById('personalizacao-modal');
    if (existing) { existing.remove(); return; }

    const html = `
        <div id="personalizacao-modal" class="fixed inset-0 z-[95] hidden">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="document.getElementById('personalizacao-modal').remove()"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div id="personalizacao-content"
                     class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto p-6 space-y-5"
                     style="transform:scale(.95);opacity:0;transition:all .25s;">

                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                                 style="background: linear-gradient(135deg, var(--t500,#6366f1), var(--t700,#4338ca))">
                                <span class="material-symbols-rounded text-white text-xl">palette</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white">Personalização</h3>
                                <p class="text-xs text-slate-400">Tema salvo por usuário</p>
                            </div>
                        </div>
                        <button onclick="document.getElementById('personalizacao-modal').remove()"
                                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <span class="material-symbols-rounded">close</span>
                        </button>
                    </div>

                    <!-- Modo escuro/claro -->
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-rounded text-slate-500">dark_mode</span>
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Modo Escuro</span>
                        </div>
                        <button onclick="toggleTheme()"
                                class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                                id="dark-toggle-btn">
                            <span class="absolute inset-0 rounded-full" style="background: var(--t600,#4f46e5)"></span>
                            <span id="dark-toggle-knob"
                                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                                  style="transform: translateX(${document.documentElement.classList.contains('dark')?'20px':'0px'})">
                            </span>
                        </button>
                    </div>

                    <!-- Seleção de cor -->
                    <div id="theme-panel-content">
                        ${renderThemePanel()}
                    </div>

                    <p class="text-[11px] text-slate-400 text-center">
                        As cores são salvas automaticamente por usuário
                    </p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal   = document.getElementById('personalizacao-modal');
    const content = document.getElementById('personalizacao-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { content.style.transform = 'scale(1)'; content.style.opacity = '1'; });

    // Atualiza o toggle de dark mode quando mudar
    const origToggle = window.toggleTheme;
    window.toggleTheme = function() {
        if (origToggle) origToggle();
        const knob = document.getElementById('dark-toggle-knob');
        if (knob) knob.style.transform = `translateX(${document.documentElement.classList.contains('dark')?'20px':'0px'})`;
    };
};

// ── Carrega o tema assim que o script é executado ─────────────
loadSavedTheme();

// Reaplica após login (quando usuário muda)
window.addEventListener('authReady', loadSavedTheme);

window.THEMES          = THEMES;
window.setTheme        = setTheme;
window.loadSavedTheme  = loadSavedTheme;
window.renderThemePanel = renderThemePanel;

console.log('✅ theme-colors.js carregado — tema:', window._currentTheme);
