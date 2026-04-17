// ============================================================
// NOTIFICATIONS — js/notifications.js
// Gerencia lista de notificações + disparo baseado em prefs
// ============================================================

const NOTIF_STORE_KEY = 'notif_history_';
const MAX_NOTIFS      = 30;

function getNotifUid() {
    try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        return s?.user?.id || 'guest';
    } catch(_) { return 'guest'; }
}

function getNotifHistory() {
    try {
        return JSON.parse(localStorage.getItem(NOTIF_STORE_KEY + getNotifUid()) || '[]');
    } catch(_) { return []; }
}

function saveNotifHistory(list) {
    try {
        localStorage.setItem(NOTIF_STORE_KEY + getNotifUid(), JSON.stringify(list.slice(0, MAX_NOTIFS)));
    } catch(_) {}
}

// ── Adiciona notificação ──────────────────────────────────────

function addNotification(tipo, titulo, descricao) {
    // Verifica se o usuário quer esse tipo
    const prefs = window.notifPrefs?.get?.() || {};
    if (!prefs[tipo]) return;

    const list = getNotifHistory();
    list.unshift({
        id:    Date.now(),
        tipo,
        titulo,
        descricao,
        lida:  false,
        ts:    new Date().toISOString(),
    });
    saveNotifHistory(list);
    renderNotifPanel();
    updateNotifBadge();
}

// ── Renderiza painel ──────────────────────────────────────────

const NOTIF_ICONS = {
    registro:  { icon:'add_circle',    cor:'#6366f1' },
    inicio:    { icon:'play_circle',   cor:'#3b82f6' },
    conclusao: { icon:'check_circle',  cor:'#22c55e' },
    entrega:   { icon:'local_shipping',cor:'#8b5cf6' },
};

function renderNotifPanel() {
    const list = getNotifHistory();
    const panel = document.getElementById('notif-list');
    if (!panel) return;

    if (!list.length) {
        panel.innerHTML = `
            <div class="p-6 text-center text-slate-400">
                <span class="material-symbols-rounded text-3xl block mb-2 opacity-30">notifications_none</span>
                <p class="text-sm">Nenhuma notificação</p>
                <p class="text-xs mt-1 opacity-70">Configure em <button onclick="showPage('configuracoes');toggleNotifications()" class="text-primary-500 underline">Configurações</button></p>
            </div>`;
        return;
    }

    panel.innerHTML = list.map(n => {
        const cfg = NOTIF_ICONS[n.tipo] || { icon:'notifications', cor:'#6366f1' };
        const ts  = formatNotifTime(n.ts);
        return `
        <div class="flex gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.lida ? 'border-l-2' : 'border-l-2 border-transparent'}"
             style="${!n.lida ? 'border-left-color:' + cfg.cor : ''}"
             onclick="marcarLida(${n.id})">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                 style="background:${cfg.cor}18">
                <span class="material-symbols-rounded text-sm" style="color:${cfg.cor};font-variation-settings:'FILL' 1">${cfg.icon}</span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-${n.lida?'medium':'bold'} text-slate-${n.lida?'600 dark:text-slate-400':'800 dark:text-slate-200'} leading-tight">${n.titulo}</p>
                <p class="text-xs text-slate-500 mt-0.5 truncate">${n.descricao}</p>
                <p class="text-[10px] text-slate-400 mt-1">${ts}</p>
            </div>
            ${!n.lida ? `<span class="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style="background:${cfg.cor}"></span>` : ''}
        </div>`;
    }).join('');
}

function formatNotifTime(iso) {
    if (!iso) return '';
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)  return 'agora mesmo';
    if (diff < 3600) return Math.floor(diff/60) + ' min atrás';
    if (diff < 86400) return Math.floor(diff/3600) + 'h atrás';
    return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
}

// ── Badge ─────────────────────────────────────────────────────

function updateNotifBadge() {
    const list   = getNotifHistory();
    const naoLidas = list.filter(n => !n.lida).length;
    const badge  = document.getElementById('notif-badge');
    if (!badge) return;
    badge.classList.toggle('hidden', naoLidas === 0);
}

// ── Marcar lida ───────────────────────────────────────────────

window.marcarLida = function(id) {
    const list = getNotifHistory();
    const n    = list.find(x => x.id === id);
    if (n) { n.lida = true; saveNotifHistory(list); renderNotifPanel(); updateNotifBadge(); }
};

window.marcarTodasLidas = function() {
    const list = getNotifHistory();
    list.forEach(n => n.lida = true);
    saveNotifHistory(list);
    renderNotifPanel();
    updateNotifBadge();
    if (typeof showToast === 'function') showToast('Todas as notificações marcadas como lidas', 'success');
};

// ── API pública — chamada pelos outros módulos ────────────────

window.notify = {
    registro: (produto, qtd) => addNotification(
        'registro',
        'Nova ordem registrada',
        `${produto || 'Produto'} · ${qtd || 0} un`
    ),
    inicio: (produto, operador) => addNotification(
        'inicio',
        'Separação iniciada',
        `${produto || 'Produto'} por ${operador || 'Operador'}`
    ),
    conclusao: (produto, lote) => addNotification(
        'conclusao',
        'Separação concluída',
        `${produto || 'Produto'}${lote ? ' · Lote ' + lote : ''}`
    ),
    entrega: (produto, responsavel) => addNotification(
        'entrega',
        'Entrega registrada',
        `${produto || 'Produto'} entregue por ${responsavel || '—'}`
    ),
};

// ── Inicializa ao carregar ────────────────────────────────────

document.addEventListener('pageChanged', e => {
    if (e.detail === 'configuracoes') {
        // Re-renderiza panel quando abrir configurações
        setTimeout(renderNotifPanel, 200);
    }
});

// Atualiza badge e painel quando o sino for aberto
const _origToggleNotifications = window.toggleNotifications;
window.toggleNotifications = function() {
    if (typeof _origToggleNotifications === 'function') _origToggleNotifications();
    renderNotifPanel();
};

// Init
setTimeout(() => {
    renderNotifPanel();
    updateNotifBadge();
}, 800);

console.log('✅ notifications.js — sistema de notificações carregado');
