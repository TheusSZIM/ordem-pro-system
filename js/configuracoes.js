// ============================================================
// CONFIGURAÇÕES — js/configuracoes.js
// Troca de senha + preferências do usuário logado
// ============================================================

async function renderConfiguracoes() {
    const user = window.auth?.getUser?.() || {};
    if (!user.id) return;

    // Preenche dados do perfil
    setVal('cfg-nome',   user.nome  || '');
    setVal('cfg-email',  user.email || '');
    setVal('cfg-cargo',  user.cargo || '');
    setVal('cfg-celula', user.celula|| '');

    const isVirtual = (user.email||'').includes('@vetore.com');
    const hint = document.getElementById('cfg-email-hint');
    if (hint) hint.textContent = isVirtual ? '🔒 E-mail virtual (interno)' : '';

    // Nível de acesso
    const nivelMap = {1:'Operador',2:'Coordenador',3:'Gestor',4:'Admin'};
    const nivelEl = document.getElementById('cfg-nivel-label');
    if (nivelEl) nivelEl.textContent = nivelMap[user.nivel] || '—';

    // Limpa formulário de senha
    ['cfg-senha-atual','cfg-nova-senha','cfg-confirma-senha'].forEach(id => setVal(id,''));
    atualizarForcaSenha('');
}

/* ── Salvar perfil (nome, cargo, celula) ── */
async function salvarPerfil() {
    const user = window.auth?.getUser?.();
    if (!user?.id) return;

    const nome   = getVal('cfg-nome').trim();
    const cargo  = getVal('cfg-cargo').trim();
    const celula = getVal('cfg-celula').trim();

    if (!nome) { showToast('Informe seu nome', 'warning'); return; }

    const btn = document.getElementById('btn-salvar-perfil');
    if (btn) { btn.disabled=true; btn.textContent='Salvando...'; }

    try {
        const { error } = await supabaseClient.from('usuarios')
            .update({ nome, cargo, celula, departamento: celula }).eq('id', user.id);
        if (error) throw error;

        // Atualiza cache local do auth
        if (window.auth?.updateUserCache) window.auth.updateUserCache({ nome, cargo, celula });
        else {
            const s = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
            if (s.user) { s.user.nome=nome; s.user.cargo=cargo; s.user.celula=celula; }
            localStorage.setItem('ordem_pro_session', JSON.stringify(s));
        }

        showToast('✅ Perfil atualizado!', 'success');

        // Atualiza header se existir
        const headerNome = document.getElementById('user-display-name');
        if (headerNome) headerNome.textContent = nome;
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled=false; btn.textContent='Salvar Perfil'; }
    }
}

/* ── Troca de senha ── */
async function trocarSenha() {
    const user = window.auth?.getUser?.();
    if (!user?.id) return;

    const atual    = getVal('cfg-senha-atual');
    const nova     = getVal('cfg-nova-senha');
    const confirma = getVal('cfg-confirma-senha');

    if (!atual)          { showToast('Digite a senha atual', 'warning'); return; }
    if (nova.length < 6) { showToast('A nova senha deve ter pelo menos 6 caracteres', 'warning'); return; }
    if (nova !== confirma){ showToast('As senhas não conferem', 'warning'); return; }

    const btn = document.getElementById('btn-trocar-senha');
    if (btn) { btn.disabled=true; btn.textContent='Verificando...'; }

    try {
        // Verifica senha atual
        const { data: rows, error: errBusca } = await supabaseClient
            .from('usuarios').select('senha, senha_hash').eq('id', user.id).single();
        if (errBusca) throw errBusca;
        if (rows.senha !== atual && rows.senha_hash !== atual) {
            showToast('Senha atual incorreta', 'error');
            document.getElementById('cfg-senha-atual')?.classList.add('border-red-500');
            return;
        }

        // Atualiza
        const { error } = await supabaseClient.from('usuarios')
            .update({ senha: nova, senha_hash: nova }).eq('id', user.id);
        if (error) throw error;

        // Limpa campos
        ['cfg-senha-atual','cfg-nova-senha','cfg-confirma-senha'].forEach(id => setVal(id,''));
        atualizarForcaSenha('');
        showToast('✅ Senha alterada com sucesso!', 'success');
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled=false; btn.textContent='Alterar Senha'; }
    }
}

/* ── Indicador de força de senha ── */
function atualizarForcaSenha(senha) {
    const bar   = document.getElementById('forca-bar');
    const label = document.getElementById('forca-label');
    if (!bar || !label) return;

    let score = 0;
    if (senha.length >= 6)  score++;
    if (senha.length >= 10) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;

    const levels = [
        { pct:'0%',    cor:'#ef4444', txt:''          },
        { pct:'25%',   cor:'#ef4444', txt:'Fraca'     },
        { pct:'50%',   cor:'#f59e0b', txt:'Regular'   },
        { pct:'75%',   cor:'#3b82f6', txt:'Boa'       },
        { pct:'100%',  cor:'#22c55e', txt:'Forte'     },
        { pct:'100%',  cor:'#22c55e', txt:'Muito forte'},
    ];
    const l = levels[Math.min(score, levels.length-1)];
    bar.style.width     = senha ? l.pct : '0%';
    bar.style.background = l.cor;
    label.textContent   = l.txt;
    label.style.color   = l.cor;
}

function getVal(id) { return document.getElementById(id)?.value||''; }
function setVal(id,v){ const e=document.getElementById(id); if(e) e.value=v; }

window.renderConfiguracoes = renderConfiguracoes;
window.salvarPerfil        = salvarPerfil;
window.trocarSenha         = trocarSenha;
window.atualizarForcaSenha = atualizarForcaSenha;

document.addEventListener('pageChanged', e => {
    if (e.detail === 'configuracoes') renderConfiguracoes();
});
console.log('✅ configuracoes.js carregado');

// ── NOTIFICAÇÕES — preferências por usuário ───────────────────

const NOTIF_KEYS = ['registro','inicio','conclusao','entrega'];
const NOTIF_COLOR = '#6366f1'; // indigo — cor do toggle ativo

function getNotifPrefs() {
    try {
        const s   = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        const uid = s?.user?.id || 'guest';
        const raw = localStorage.getItem('notif_prefs_' + uid);
        return raw ? JSON.parse(raw) : { registro:false, inicio:false, conclusao:false, entrega:false };
    } catch(_) { return { registro:false, inicio:false, conclusao:false, entrega:false }; }
}

function saveNotifPrefs(prefs) {
    try {
        const s   = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        const uid = s?.user?.id || 'guest';
        localStorage.setItem('notif_prefs_' + uid, JSON.stringify(prefs));
    } catch(_) {}
}

function applyToggleUI(key, active) {
    const btn  = document.getElementById('notif-toggle-' + key);
    if (!btn) return;
    const dot  = btn.querySelector('.notif-toggle-dot');
    btn.style.background = active ? NOTIF_COLOR : '#e2e8f0';
    btn.setAttribute('aria-checked', active ? 'true' : 'false');
    if (dot) dot.style.transform = active ? 'translateX(20px)' : 'translateX(4px)';
}

function renderNotifPrefs() {
    const prefs   = getNotifPrefs();
    const allOn   = NOTIF_KEYS.every(k => prefs[k]);

    NOTIF_KEYS.forEach(k => applyToggleUI(k, !!prefs[k]));
    applyToggleUI('all', allOn);

    // Dark mode: ajusta cor do toggle off para combinar
    document.querySelectorAll('.notif-toggle-btn').forEach(btn => {
        if (btn.getAttribute('aria-checked') !== 'true') {
            btn.style.background = document.documentElement.classList.contains('dark')
                ? 'rgba(148,163,184,.25)'
                : '#e2e8f0';
        }
    });
}

window.toggleNotif = function(key) {
    const prefs = getNotifPrefs();
    prefs[key]  = !prefs[key];
    saveNotifPrefs(prefs);
    applyToggleUI(key, prefs[key]);

    // Atualiza toggle "Todas"
    const allOn = NOTIF_KEYS.every(k => prefs[k]);
    applyToggleUI('all', allOn);

    const labels = { registro:'Novo Registro', inicio:'Início de Separação', conclusao:'Conclusão', entrega:'Entrega' };
    if (typeof showToast === 'function')
        showToast((prefs[key] ? '🔔 ' : '🔕 ') + labels[key] + (prefs[key] ? ' ativada' : ' desativada'), 'success');
};

window.toggleNotifAll = function() {
    const prefs = getNotifPrefs();
    const allOn = NOTIF_KEYS.every(k => prefs[k]);
    const next  = !allOn;
    NOTIF_KEYS.forEach(k => { prefs[k] = next; });
    saveNotifPrefs(prefs);
    NOTIF_KEYS.forEach(k => applyToggleUI(k, next));
    applyToggleUI('all', next);

    if (typeof showToast === 'function')
        showToast(next ? '🔔 Todas as notificações ativadas' : '🔕 Todas as notificações desativadas', 'success');
};

// Exposição global para disparar notificações de outros módulos
window.notifPrefs = {
    get: getNotifPrefs,
    deveNotificar: function(tipo) {
        const prefs = getNotifPrefs();
        return !!prefs[tipo];
    }
};

// Renderiza ao abrir a página
document.addEventListener('pageChanged', e => {
    if (e.detail === 'configuracoes') {
        setTimeout(renderNotifPrefs, 100);
    }
});

console.log('✅ configuracoes.js — notificações carregadas');
