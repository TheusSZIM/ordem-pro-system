// ============================================================
// ESTOQUE — js/estoque.js
// Flags de posições vazias — compartilhado via Supabase
// ============================================================

/* ── Carrega flags do Supabase ── */
async function getFlags() {
    try {
        const { data, error } = await supabaseClient
            .from('kanban_flags')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        // Converte array para objeto keyed por pos_key
        const map = {};
        (data || []).forEach(f => { map[f.pos_key] = f; });
        return map;
    } catch(e) {
        console.error('Erro ao carregar flags:', e);
        return {};
    }
}

/* ── Marca posição como vazia ── */
async function marcarPosicaoVazia(posKey, modelo, operador) {
    try {
        const { data, error } = await supabaseClient
            .from('kanban_flags')
            .upsert({
                pos_key:  posKey,
                modelo,
                operador: operador || 'Operador',
                status:   'pendente',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                regularizado_em:  null,
                regularizado_por: null,
            }, { onConflict: 'pos_key' })
            .select()
            .single();
        if (error) throw error;
        return data;
    } catch(e) {
        console.error('Erro ao marcar posição:', e);
        throw e;
    }
}

/* ── Regulariza posição ── */
async function regularizarPosicao(posKey) {
    try {
        const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
        const { error } = await supabaseClient
            .from('kanban_flags')
            .update({
                status: 'regularizado',
                regularizado_em:  new Date().toISOString(),
                regularizado_por: user?.nome || user?.email || 'Usuário',
                updated_at: new Date().toISOString(),
            })
            .eq('pos_key', posKey);
        if (error) throw error;
        if (typeof showToast === 'function') showToast(`✅ Posição ${posKey} regularizada`, 'success');
        await renderEstoque();
    } catch(e) {
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
    }
}

/* ── Remove flag permanentemente ── */
async function removerFlag(posKey) {
    try {
        const { error } = await supabaseClient
            .from('kanban_flags')
            .delete()
            .eq('pos_key', posKey);
        if (error) throw error;
        if (typeof showToast === 'function') showToast(`🗑️ Flag ${posKey} removida`, 'success');
        await renderEstoque();
    } catch(e) {
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
    }
}

/* ── Renderiza painel ── */
async function renderEstoque() {
    const lista = document.getElementById('estoque-flags-lista');
    const badge = document.getElementById('badge-flags-pendentes');
    if (!lista) return;

    lista.innerHTML = `
        <div class="col-span-full text-center py-10 text-slate-400">
            <span class="material-symbols-rounded text-4xl mb-2 block animate-spin opacity-50">progress_activity</span>
            Carregando...
        </div>`;

    const flags = await getFlags();
    const todos  = Object.values(flags).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const pendentes = todos.filter(f => f.status === 'pendente');

    if (badge) badge.textContent = pendentes.length;

    if (todos.length === 0) {
        lista.innerHTML = `
            <div class="col-span-full text-center py-16 text-slate-400">
                <span class="material-symbols-rounded text-5xl mb-3 block opacity-30">inventory</span>
                <p class="font-medium">Nenhuma posição marcada</p>
                <p class="text-sm mt-1">Flags manuais do Kanban aparecerão aqui</p>
            </div>`;
        return;
    }

    // Verifica permissão para ações
    const nivel = typeof getNivel === 'function' ? getNivel() : 0;
    const podeRegularizar = nivel >= 2;

    lista.innerHTML = todos.map(f => {
        const isPendente = f.status === 'pendente';
        const dt    = new Date(f.created_at);
        const dtStr = dt.toLocaleDateString('pt-BR') + ' ' +
                      dt.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
        const dtReg = f.regularizado_em
            ? new Date(f.regularizado_em).toLocaleDateString('pt-BR') + ' ' +
              new Date(f.regularizado_em).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})
            : null;

        return `
        <div class="flag-card ${isPendente?'flag-pendente':'flag-ok'} rounded-xl p-4 border space-y-3">
            <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         style="background:${isPendente?'rgba(239,68,68,.15)':'rgba(34,197,94,.12)'}">
                        <span class="material-symbols-rounded" style="color:${isPendente?'#f87171':'#4ade80'};font-size:20px;font-variation-settings:'FILL' 1">
                            ${isPendente?'report':'check_circle'}
                        </span>
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 dark:text-white text-base">${f.pos_key}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${f.modelo || '—'}</p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${isPendente?'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400':'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}">
                    ${isPendente?'Pendente':'Regularizado'}
                </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5">
                    <p class="text-slate-400 mb-0.5">Operador</p>
                    <p class="font-semibold text-slate-700 dark:text-slate-200">${f.operador || '—'}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5">
                    <p class="text-slate-400 mb-0.5">Marcado em</p>
                    <p class="font-semibold text-slate-700 dark:text-slate-200">${dtStr}</p>
                </div>
                ${dtReg ? `
                <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2.5 col-span-2">
                    <p class="text-emerald-500 mb-0.5">Regularizado em por ${f.regularizado_por||'—'}</p>
                    <p class="font-semibold text-emerald-700 dark:text-emerald-300">${dtReg}</p>
                </div>` : ''}
            </div>

            ${podeRegularizar ? `
            <div class="flex gap-2 pt-1">
                ${isPendente ? `
                <button onclick="regularizarPosicao('${f.pos_key}')"
                    class="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
                    <span class="material-symbols-rounded text-sm">check_circle</span>
                    Regularizado
                </button>` : ''}
                <button onclick="removerFlag('${f.pos_key}')"
                    class="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-lg text-xs font-semibold transition-colors">
                    <span class="material-symbols-rounded text-sm">delete</span>
                    Remover
                </button>
            </div>` : `
            <div class="pt-1">
                <p class="text-xs text-slate-400 text-center">Ações disponíveis para Separador ou superior</p>
            </div>`}
        </div>`;
    }).join('');
}

/* ── Filtro ── */
function filtrarFlags(status) {
    document.querySelectorAll('.flag-filtro').forEach(b =>
        b.classList.toggle('active-filtro', b.dataset.status === status));
    document.querySelectorAll('.flag-card').forEach(c => {
        if (status === 'todos') { c.style.display = ''; return; }
        const isPend = c.classList.contains('flag-pendente');
        c.style.display = ((status==='pendente'&&isPend)||(status==='regularizado'&&!isPend)) ? '' : 'none';
    });
}

/* ── Marcar vazio (chamado do kanban-sheets.js) ── */
function abrirMarcarVazio(posKey, modeloNome) {
    document.getElementById('marcar-vazio-modal')?.remove();
    const html = `
        <div id="marcar-vazio-modal" class="fixed inset-0 z-[100] hidden">
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="fecharMarcarVazio()"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div id="marcar-vazio-content"
                     class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto p-6 space-y-4"
                     style="transform:scale(.9);opacity:0;transition:all .2s;">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                            <span class="material-symbols-rounded text-red-500" style="font-size:22px;font-variation-settings:'FILL' 1">report</span>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-900 dark:text-white">Marcar como Vazio</h3>
                            <p class="text-xs text-slate-400">${posKey} · ${modeloNome}</p>
                        </div>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Registra que <strong class="text-slate-700 dark:text-slate-200">${posKey}</strong>
                        está fisicamente vazia. Visível para <strong>todos os usuários</strong> na aba Estoque.
                    </p>
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Seu nome</label>
                        <input id="mv-operador" type="text" placeholder="Digite seu nome..."
                            class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-red-500 dark:text-white">
                    </div>
                    <div class="flex gap-3">
                        <button onclick="fecharMarcarVazio()"
                            class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button onclick="confirmarMarcarVazio('${posKey}','${modeloNome}')"
                            class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
                            <span class="material-symbols-rounded text-sm">flag</span>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('marcar-vazio-modal');
    const cont  = document.getElementById('marcar-vazio-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{ cont.style.transform='scale(1)'; cont.style.opacity='1'; });
    setTimeout(()=>document.getElementById('mv-operador')?.focus(), 200);
}

function fecharMarcarVazio() {
    const modal = document.getElementById('marcar-vazio-modal');
    const cont  = document.getElementById('marcar-vazio-content');
    if (!modal) return;
    cont.style.transform='scale(.9)'; cont.style.opacity='0';
    setTimeout(()=>modal.remove(), 200);
}

async function confirmarMarcarVazio(posKey, modeloNome) {
    const operador = document.getElementById('mv-operador')?.value?.trim() || 'Operador';
    try {
        await marcarPosicaoVazia(posKey, modeloNome, operador);
        fecharMarcarVazio();
        if (typeof showToast === 'function')
            showToast(`🚩 ${posKey} marcado como vazio — visível para todos`, 'warning');
        // Atualiza estoque se estiver aberto
        if (document.getElementById('estoque')?.classList.contains('active')) {
            await renderEstoque();
        }
    } catch(e) {
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
    }
}

/* ── Listeners ── */
document.addEventListener('pageChanged', async e => {
    if (e.detail === 'estoque') await renderEstoque();
});

window.renderEstoque        = renderEstoque;
window.regularizarPosicao   = regularizarPosicao;
window.removerFlag           = removerFlag;
window.marcarPosicaoVazia   = marcarPosicaoVazia;
window.getFlags             = getFlags;
window.filtrarFlags         = filtrarFlags;
window.abrirMarcarVazio     = abrirMarcarVazio;
window.fecharMarcarVazio    = fecharMarcarVazio;
window.confirmarMarcarVazio = confirmarMarcarVazio;

console.log('✅ estoque.js — flags via Supabase');
