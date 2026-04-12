// ============================================================
// PERMISSIONS — js/permissions.js
// Níveis: 0=Visualizador 1=Stage 2=Separador 3=Admin
// ============================================================

const NIVEIS_LABEL = { 0:'Visualizador', 1:'Stage', 2:'Separador', 3:'Admin' };

const PERMISSOES = {
    pages: {
        dashboard:     [0,1,2,3],
        kanban:        [0,2,3],
        ordens:        [0,2,3],
        equipe:        [3],
        estoque:       [2,3],
        entrega:       [1,2,3],
        configuracoes: [0,1,2,3],
    },
    actions: {
        criarOrdem:           [1,2,3],
        editarOrdem:          [2,3],
        iniciarSeparacao:     [2,3],
        concluirSeparacao:    [2,3],
        registrarEntrega:     [1,2,3],
        marcarVazioKanban:    [2,3],
        // Kanban edit — APENAS Admin
        editarSheetsKanban:   [3],
        editarQtdKanban:      [3],
        configuracaoSistema:  [3],
        // Usuários
        gerenciarUsuarios:    [3],
        criarUsuario:         [3],
        editarUsuario:        [3],
        regularizarEstoque:   [2,3],
    }
};

function getNivel() {
    try {
        // Tenta auth primeiro
        if (typeof window.auth?.getNivel === 'function') return window.auth.getNivel();
        const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        return s?.user?.nivel ?? s?.user?.nivel_acesso ?? 0;
    } catch(_) { return 0; }
}

function podeAcessar(recurso, tipo = 'actions') {
    const lista = PERMISSOES[tipo]?.[recurso] || [];
    return lista.includes(getNivel());
}
function podePage(page) { return podeAcessar(page, 'pages'); }
function podeAcao(acao) { return podeAcessar(acao, 'actions'); }

// ── Oculta/mostra elemento ────────────────────────────────────

function setVisible(el, visible) {
    if (!el) return;
    el.style.display    = visible ? '' : 'none';
    el.style.visibility = visible ? '' : 'hidden';
    el.style.pointerEvents = visible ? '' : 'none';
}

function hideById(...ids) {
    ids.forEach(id => { const e = document.getElementById(id); if (e) { e.style.display='none'; e.style.pointerEvents='none'; } });
}

// ── Aplica permissões em toda a UI ────────────────────────────

function aplicarPermissoes() {
    const nivel = getNivel();
    const podeEditarKanban   = podeAcao('editarSheetsKanban');   // só Admin
    const podeGerenciarUsers = podeAcao('gerenciarUsuarios');     // só Admin
    const podeCriarOrdem     = podeAcao('criarOrdem');

    console.log(`🔒 Permissões — nível ${nivel} (${NIVEIS_LABEL[nivel]||'?'})`);

    // ── SIDEBAR: só abas permitidas ──────────────────────────
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
        btn.style.display = podePage(btn.dataset.page) ? '' : 'none';
    });

    // ── KANBAN: esconde controles de edição para níveis < Admin ──
    if (!podeEditarKanban) {
        hideById('kanban-sync-btn', 'kanban-qtd-btn', 'kanban-cfg-btn', 'sync-icon');

        // Esconde o bloco do input URL + botão Sync
        const urlBloco = document.querySelector('#kanban-controls .flex.items-center.gap-2');
        if (urlBloco) urlBloco.style.display = 'none';

        // Adiciona badge de visualização se não existir
        const controls = document.getElementById('kanban-controls');
        if (controls && !document.getElementById('kanban-view-badge')) {
            controls.insertAdjacentHTML('beforeend', `
                <div id="kanban-view-badge" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-400">
                    <span class="material-symbols-rounded text-sm">visibility</span>
                    Modo visualização
                </div>`);
        }
    } else {
        // Admin: remove badge se existir
        document.getElementById('kanban-view-badge')?.remove();
        // Garante que os controles estão visíveis
        ['kanban-sync-btn','kanban-qtd-btn','kanban-cfg-btn'].forEach(id => {
            const e = document.getElementById(id);
            if (e) e.style.display = '';
        });
    }

    // ── NOVA ORDEM: só nível 1+ ──────────────────────────────
    if (!podeCriarOrdem) {
        document.querySelectorAll('[onclick*="new-order"], [onclick*="showModal(\'new-order"]').forEach(el => {
            el.style.display = 'none';
        });
    }

    // ── EQUIPE: botão "Novo Usuário" — só Admin ──────────────
    const btnNovoUser = document.getElementById('btn-novo-usuario');
    if (btnNovoUser) btnNovoUser.style.display = podeGerenciarUsers ? '' : 'none';

    // Botões de editar/deletar usuário na tabela — só Admin
    if (!podeGerenciarUsers) {
        document.querySelectorAll('[onclick*="abrirEditarUsuario"], [onclick*="resetarSenha"], [onclick*="toggleUsuarioAtivo"]')
            .forEach(el => el.style.display = 'none');
    }

    // ── CONFIGURAÇÕES: esconde sessão de gerenciar usuários ──
    // (apenas senha própria é sempre permitida)

    // ── MARCAR VAZIO: nível 2+ ───────────────────────────────
    if (!podeAcao('marcarVazioKanban')) {
        document.querySelectorAll('[onclick*="abrirMarcarVazio"]').forEach(el => el.style.display = 'none');
    }

    // ── ESTOQUE: regularizar — nível 2+ ──────────────────────
    if (!podeAcao('regularizarEstoque')) {
        document.querySelectorAll('[onclick*="regularizar"], [onclick*="removerFlag"]').forEach(el => el.style.display = 'none');
    }
}

// ── Sobrescreve showPage com verificação de permissão ─────────

function wrapShowPageComPermissao() {
    const _orig = window.showPage;
    window.showPage = function(page) {
        if (!podePage(page)) {
            if (typeof showToast === 'function')
                showToast('Acesso não permitido para o seu nível', 'warning');
            return;
        }
        if (_orig) _orig(page);
        // Reaplica permissões após render da nova página
        setTimeout(aplicarPermissoes, 150);
    };
}

// ── Visitante sem login ───────────────────────────────────────

function entrarComoVisualizador() {
    localStorage.setItem('ordem_pro_session', JSON.stringify({
        user: { id:'guest', nome:'Visitante', email:'', nivel:0, nivel_acesso:0 },
        token:'guest', loginTime: Date.now(),
        expiresAt: Date.now() + (8 * 60 * 60 * 1000),
    }));
    window.location.reload();
}

// ── Escuta mudança de página para reaplicar ───────────────────

document.addEventListener('pageChanged', () => setTimeout(aplicarPermissoes, 200));

// ── Exports ───────────────────────────────────────────────────
window.getNivel                  = getNivel;
window.podeAcao                  = podeAcao;
window.podePage                  = podePage;
window.aplicarPermissoes         = aplicarPermissoes;
window.wrapShowPageComPermissao  = wrapShowPageComPermissao;
window.entrarComoVisualizador    = entrarComoVisualizador;
window.NIVEIS_LABEL              = NIVEIS_LABEL;

console.log('✅ permissions.js carregado');
