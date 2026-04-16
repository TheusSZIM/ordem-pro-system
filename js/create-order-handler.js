// ============================================================
// MODAL DE DETALHES DA ORDEM — timeline completa + campo LOTE
// ============================================================

window.ORDEM_STATUS_MAP = window.ORDEM_STATUS_MAP || {
    pending:    { label:'A Separar',    bg:'bg-slate-100 dark:bg-slate-800',        text:'text-slate-600 dark:text-slate-300'   },
    progress:   { label:'Em Separação', bg:'bg-blue-100 dark:bg-blue-900/30',        text:'text-blue-700 dark:text-blue-400'     },
    in_progress:{ label:'Em Separação', bg:'bg-blue-100 dark:bg-blue-900/30',        text:'text-blue-700 dark:text-blue-400'     },
    completed:  { label:'Concluída',    bg:'bg-emerald-100 dark:bg-emerald-900/30',  text:'text-emerald-700 dark:text-emerald-400'},
    delivered:  { label:'Entregue',     bg:'bg-violet-100 dark:bg-violet-900/30',    text:'text-violet-700 dark:text-violet-400' },
};

function fmtDT(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' +
           d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}
function fmtDate(val) {
    if (!val) return '—';
    return new Date(val + 'T00:00:00').toLocaleDateString('pt-BR');
}

// ── Salvar LOTE ───────────────────────────────────────────────

window.salvarLoteModal = async function(ordId) {
    const input = document.getElementById('lote-modal-input');
    const val   = input ? input.value.trim() || null : null;
    try {
        const { error } = await supabaseClient.from('orders').update({ lote: val }).eq('id', ordId);
        if (error) throw error;
        const o = window.state?.orders?.find(x => x.id === ordId);
        if (o) o.lote = val;
        // Atualiza display
        const display = document.getElementById('lote-modal-display');
        if (display) display.textContent = val || '— sem lote';
        // Alterna views
        document.getElementById('lote-view-wrap')?.classList.remove('hidden');
        document.getElementById('lote-edit-wrap')?.classList.add('hidden');
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof showToast === 'function') showToast('✅ Lote salvo!', 'success');
    } catch(e) {
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
    }
};

window.toggleLoteEdit = function(show, loteAtual) {
    const viewWrap = document.getElementById('lote-view-wrap');
    const editWrap = document.getElementById('lote-edit-wrap');
    const input    = document.getElementById('lote-modal-input');
    if (show) {
        viewWrap?.classList.add('hidden');
        editWrap?.classList.remove('hidden');
        if (input) { input.value = loteAtual || ''; input.focus(); }
    } else {
        viewWrap?.classList.remove('hidden');
        editWrap?.classList.add('hidden');
    }
};

// ── Modal principal ───────────────────────────────────────────

window.showOrdemDetail = async function(orderId) {
    // Busca ordem do state ou do Supabase
    let ordem = window.state?.orders?.find(o => o.id === orderId);
    if (!ordem) { if (typeof showToast === 'function') showToast('Ordem não encontrada', 'error'); return; }

    // Atualiza dados frescos
    try {
        const { data, error } = await supabaseClient.from('orders').select('*').eq('id', orderId).single();
        if (!error && data) { ordem = data; }
    } catch(_) {}

    const status = window.ORDEM_STATUS_MAP[ordem.status] || window.ORDEM_STATUS_MAP.pending;
    const nivel  = typeof getNivel === 'function' ? getNivel() : 0;

    // ── Timeline ──────────────────────────────────────────────
    const steps = [
        {
            icon:'add_circle', cor:'#6366f1', titulo:'Ordem Registrada',
            linhas:[
                { label:'Data/Hora',  val: fmtDT(ordem.created_at) },
                { label:'Operador',   val: ordem.created_by || ordem.operador_responsavel || 'Sistema' },
                { label:'Produto',    val: ordem.product || '—' },
                { label:'Qtd',        val: ordem.quantity ? ordem.quantity + ' un' : '—' },
                { label:'Célula',     val: ordem.station  || ordem.estacao || '—' },
                { label:'Previsão',   val: fmtDate(ordem.data_prevista) },
                ordem.tipo_embalagem || ordem.packaging_type
                    ? { label:'Embalagem', val: ordem.tipo_embalagem || ordem.packaging_type }
                    : null,
                ordem.notes || ordem.observacoes
                    ? { label:'Obs', val: ordem.notes || ordem.observacoes }
                    : null,
            ].filter(Boolean),
            done: true,
        },
        {
            icon:'play_circle', cor:'#3b82f6', titulo:'Separação Iniciada',
            linhas:[
                { label:'Data/Hora',  val: fmtDT(ordem.inicio_separacao) },
                { label:'Separador',  val: ordem.separador || '—' },
            ],
            done: !!ordem.inicio_separacao,
        },
        {
            icon:'check_circle', cor:'#22c55e', titulo:'Separação Concluída',
            linhas:[
                { label:'Data/Hora',     val: fmtDT(ordem.fim_separacao) },
                { label:'Separador',     val: ordem.separador || '—' },
                { label:'Ordem',         val: ordem.ordem_completa === false ? '⚠️ Incompleta' : ordem.ordem_completa === true ? '✅ Completa' : '—' },
                { label:'Embalagem',     val: ordem.packaging_type || ordem.tipo_embalagem || '—' },
                { label:'Emb. separada', val: ordem.embalagem_separada === true ? '✅ Sim' : ordem.embalagem_separada === false ? '❌ Não' : '—' },
                ordem.numero_volumes ? { label:'Volumes', val: ordem.numero_volumes + ' vol.' } : null,
                { label:'Tempo total',   val: ordem.tempo_total || '—' },
            ].filter(Boolean),
            done: !!ordem.fim_separacao,
        },
        {
            icon:'local_shipping', cor:'#8b5cf6', titulo:'Entrega Registrada',
            linhas:[
                { label:'Data/Hora',   val: fmtDT(ordem.data_entrega) },
                { label:'Responsável', val: ordem.responsavel_entrega || '—' },
                ordem.destino_entrega    ? { label:'Destino',  val: ordem.destino_entrega    } : null,
                ordem.placa_veiculo      ? { label:'Veículo',  val: ordem.placa_veiculo      } : null,
                ordem.observacoes_entrega? { label:'Obs',      val: ordem.observacoes_entrega} : null,
            ].filter(Boolean),
            done: !!ordem.data_entrega,
        },
    ];

    const timelineHTML = steps.map((step, i) => {
        const isLast  = i === steps.length - 1;
        const opacity = step.done ? '1' : '0.32';

        const linhasHTML = step.linhas.map(l => `
            <div class="flex items-start gap-2 py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <span class="text-[10px] text-slate-400 w-24 flex-shrink-0 pt-0.5">${l.label}</span>
                <span class="text-[11px] font-medium text-slate-700 dark:text-slate-200 flex-1">${l.val}</span>
            </div>`).join('');

        return `
        <div class="flex gap-3" style="opacity:${opacity}">
            <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     style="background:${step.cor}22;border:2px solid ${step.done ? step.cor : 'rgba(148,163,184,.25)'};">
                    <span class="material-symbols-rounded text-sm" style="color:${step.cor};font-variation-settings:'FILL' 1">${step.icon}</span>
                </div>
                ${!isLast ? `<div class="w-0.5 flex-1 my-1 min-h-[16px] rounded-full" style="background:${step.done ? step.cor + '44' : 'rgba(148,163,184,.12)'}"></div>` : ''}
            </div>
            <div class="flex-1 pb-3">
                <div class="flex items-center gap-2 mb-1.5">
                    <p class="text-xs font-bold" style="color:${step.cor}">${step.titulo}</p>
                    ${!step.done ? '<span class="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">Pendente</span>' : ''}
                </div>
                ${step.done ? `<div class="bg-slate-50 dark:bg-slate-800/40 rounded-xl px-3 py-1 space-y-0">${linhasHTML}</div>` : ''}
            </div>
        </div>`;
    }).join('');

    // ── Botão de ação ─────────────────────────────────────────
    let actionBtn = '';
    if (ordem.status === 'pending' && nivel >= 2) {
        actionBtn = `
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label class="block text-xs font-semibold text-slate-500 mb-1.5">Selecione o Operador</label>
                <select id="operador-iniciar-${ordem.id}"
                    class="w-full px-3 py-2 mb-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:border-primary-500 outline-none">
                    <option value="">Carregando...</option>
                </select>
                <button onclick="window.iniciarOrdem('${ordem.id}')"
                    class="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    style="background:linear-gradient(135deg,#2563eb,#3b82f6);">
                    <span class="material-symbols-rounded text-lg">play_arrow</span>
                    Iniciar Separação
                </button>
            </div>`;
    } else if (['progress','in_progress'].includes(ordem.status) && nivel >= 2) {
        actionBtn = `
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button onclick="window.concluirOrdem('${ordem.id}')"
                    class="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    style="background:linear-gradient(135deg,#059669,#10b981);">
                    <span class="material-symbols-rounded text-lg">check_circle</span>
                    Concluir Separação
                </button>
            </div>`;
    } else if (ordem.status === 'completed' && nivel >= 1) {
        actionBtn = `
            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button onclick="window.irParaEntrega('${ordem.id}')"
                    class="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors"
                    style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);">
                    <span class="material-symbols-rounded text-lg">local_shipping</span>
                    Registrar Entrega
                </button>
            </div>`;
    }

    // ── Monta e injeta modal ──────────────────────────────────
    document.getElementById('ordem-detail-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'ordem-detail-modal';
    modal.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';

    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style="max-height:90vh;">

            <!-- Header -->
            <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Ordem #${ordem.id}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}">${status.label}</span>
                    <button id="btn-fechar-modal"
                        class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                        <span class="material-symbols-rounded text-lg">close</span>
                    </button>
                </div>
            </div>

            <!-- Body scrollável -->
            <div class="flex-1 overflow-y-auto px-5 py-5">

                <!-- Campo LOTE editável -->
                <div class="flex items-center gap-3 mb-5 p-3 rounded-xl"
                     style="background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18);">
                    <span class="material-symbols-rounded text-indigo-400 text-lg flex-shrink-0">label</span>
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lote</p>

                        <!-- View -->
                        <div id="lote-view-wrap" class="flex items-center gap-2">
                            <span id="lote-modal-display" class="text-sm font-semibold text-white">
                                ${ordem.lote || '— sem lote'}
                            </span>
                            <button id="btn-editar-lote"
                                class="p-0.5 text-slate-500 hover:text-indigo-400 transition-colors rounded" title="Editar lote">
                                <span class="material-symbols-rounded text-sm">edit</span>
                            </button>
                        </div>

                        <!-- Edit -->
                        <div id="lote-edit-wrap" class="hidden flex items-center gap-2">
                            <input id="lote-modal-input" type="text"
                                placeholder="Ex: LOTE-2024-001"
                                class="flex-1 px-2 py-1 text-sm rounded-lg text-white outline-none"
                                style="background:rgba(255,255,255,.08);border:1px solid rgba(99,102,241,.5);">
                            <button id="btn-salvar-lote"
                                class="px-2.5 py-1 text-xs font-bold text-white rounded-lg"
                                style="background:#4f46e5;">Salvar</button>
                            <button id="btn-cancelar-lote"
                                class="text-xs text-slate-400 hover:text-slate-200 px-1">✕</button>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                ${timelineHTML}

                <!-- Botão de ação -->
                ${actionBtn}
            </div>
        </div>`;

    document.body.appendChild(modal);

    // ── Event listeners (sem inline JS) ──────────────────────

    // Fechar
    document.getElementById('btn-fechar-modal').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Editar lote
    document.getElementById('btn-editar-lote').onclick = () => {
        window.toggleLoteEdit(true, ordem.lote);
    };
    document.getElementById('btn-cancelar-lote').onclick = () => {
        window.toggleLoteEdit(false);
    };
    document.getElementById('btn-salvar-lote').onclick = () => {
        window.salvarLoteModal(ordem.id);
    };
    document.getElementById('lote-modal-input').addEventListener('keydown', e => {
        if (e.key === 'Enter')  window.salvarLoteModal(ordem.id);
        if (e.key === 'Escape') window.toggleLoteEdit(false);
    });

    // Operadores (se pendente)
    if (ordem.status === 'pending' && nivel >= 2) {
        carregarOperadoresModal(ordem.id);
    }
};

// ── Carregar operadores ───────────────────────────────────────

async function carregarOperadoresModal(ordemId) {
    const sel = document.getElementById('operador-iniciar-' + ordemId);
    if (!sel) return;
    try {
        const ops = await fetchOperators();
        sel.innerHTML = '<option value="">Selecione um operador...</option>';
        ops.forEach(op => sel.innerHTML += `<option value="${op.id}">${op.name}</option>`);
    } catch {
        sel.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// ── Ações ─────────────────────────────────────────────────────

window.iniciarOrdem = async function(orderId) {
    const sel = document.getElementById('operador-iniciar-' + orderId);
    const operadorId = sel?.value;
    if (!operadorId) { showToast && showToast('Selecione um operador!', 'warning'); return; }
    const operadorNome = sel.options[sel.selectedIndex]?.text || '';
    try {
        const { error } = await supabaseClient.from('orders').update({
            status: 'progress', operator_id: operadorId,
            separador: operadorNome, inicio_separacao: new Date().toISOString(),
        }).eq('id', orderId);
        if (error) throw error;
        document.getElementById('ordem-detail-modal')?.remove();
        await loadOrders();
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable  === 'function') renderOrdensTable();
        showToast && showToast('✅ Separação iniciada!', 'success');
    } catch(e) { showToast && showToast('Erro: ' + e.message, 'error'); }
};

window.concluirOrdem = function(orderId) {
    document.getElementById('ordem-detail-modal')?.remove();
    setTimeout(() => {
        if (typeof abrirFinalizacaoModal === 'function') abrirFinalizacaoModal(orderId);
    }, 300);
};

window.irParaEntrega = function(orderId) {
    document.getElementById('ordem-detail-modal')?.remove();
    if (typeof showPage === 'function') showPage('entrega');
    setTimeout(() => {
        const campo = document.getElementById('entrega-ordem');
        if (campo) {
            campo.value = orderId;
            campo.classList.add('ring-2','ring-violet-500');
            setTimeout(() => campo.classList.remove('ring-2','ring-violet-500'), 2000);
        }
        document.getElementById('entrega-responsavel')?.focus();
        showToast && showToast('Preencha os dados de entrega e confirme', 'info');
    }, 200);
};

window.entregarOrdem = window.irParaEntrega;

console.log('✅ ordem-detail-modal.js — timeline completa');
