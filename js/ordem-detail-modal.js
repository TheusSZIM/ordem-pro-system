// ============================================================
// MODAL DE DETALHES DA ORDEM — com timeline completa
// ============================================================

const ORDEM_STATUS_MAP = {
    pending:   { label:'A Separar',    bg:'bg-slate-100 dark:bg-slate-800',   text:'text-slate-600 dark:text-slate-300' },
    progress:  { label:'Em Separação', bg:'bg-blue-100 dark:bg-blue-900/30',  text:'text-blue-700 dark:text-blue-400' },
    in_progress:{ label:'Em Separação',bg:'bg-blue-100 dark:bg-blue-900/30',  text:'text-blue-700 dark:text-blue-400' },
    completed: { label:'Concluída',    bg:'bg-emerald-100 dark:bg-emerald-900/30', text:'text-emerald-700 dark:text-emerald-400' },
    delivered: { label:'Entregue',     bg:'bg-violet-100 dark:bg-violet-900/30',  text:'text-violet-700 dark:text-violet-400' },
};

function fmtDT(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' ' +
           d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
}
function fmtDate(val) {
    if (!val) return '—';
    const d = new Date(val + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

window.showOrdemDetail = async function(orderId) {
    // Busca a ordem com todos os campos direto do Supabase para ter dados frescos
    let ordem = window.state?.orders?.find(o => o.id === orderId);
    if (!ordem) { alert('Ordem não encontrada!'); return; }

    // Busca dados completos (com campos extras)
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        if (!error && data) ordem = data;
    } catch(_) {}

    const status = ORDEM_STATUS_MAP[ordem.status] || ORDEM_STATUS_MAP.pending;
    const nivel  = typeof getNivel === 'function' ? getNivel() : 0;

    // ── Linha do tempo ────────────────────────────────────────

    const steps = [
        {
            icon: 'add_circle',
            cor:  '#6366f1',
            titulo: 'Ordem Registrada',
            linhas: [
                { label:'Data/Hora', val: fmtDT(ordem.created_at) },
                { label:'Operador',  val: ordem.created_by || ordem.operador_responsavel || 'Sistema' },
                { label:'Produto',   val: ordem.product || '—' },
                { label:'Qtd',       val: ordem.quantity ? `${ordem.quantity} un` : '—' },
                { label:'Célula',    val: ordem.station || ordem.estacao || '—' },
                { label:'Previsão',  val: fmtDate(ordem.data_prevista) },
                ordem.tipo_embalagem||ordem.packaging_type ? { label:'Embalagem', val: ordem.tipo_embalagem || ordem.packaging_type } : null,
                ordem.notes||ordem.observacoes ? { label:'Obs', val: ordem.notes || ordem.observacoes } : null,
            ].filter(Boolean),
            done: true,
        },
        {
            icon: 'play_circle',
            cor:  '#3b82f6',
            titulo: 'Separação Iniciada',
            linhas: [
                { label:'Data/Hora',  val: fmtDT(ordem.inicio_separacao) },
                { label:'Separador',  val: ordem.separador || ordem.operador_responsavel || '—' },
            ],
            done: !!ordem.inicio_separacao,
        },
        {
            icon: 'check_circle',
            cor:  '#22c55e',
            titulo: 'Separação Concluída',
            linhas: [
                { label:'Data/Hora',    val: fmtDT(ordem.fim_separacao) },
                { label:'Separador',    val: ordem.separador || '—' },
                { label:'Ordem',        val: ordem.ordem_completa === false ? '⚠️ Incompleta' : ordem.ordem_completa === true ? '✅ Completa (100%)' : '—' },
                { label:'Embalagem',    val: ordem.packaging_type || ordem.tipo_embalagem || '—' },
                { label:'Emb. separada',val: ordem.embalagem_separada === true ? '✅ Sim' : ordem.embalagem_separada === false ? '❌ Não' : '—' },
                ordem.numero_volumes ? { label:'Volumes', val: `${ordem.numero_volumes} vol.` } : null,
                { label:'Tempo total',  val: ordem.tempo_total || '—' },
            ].filter(Boolean),
            done: !!ordem.fim_separacao,
        },
        {
            icon: 'local_shipping',
            cor:  '#8b5cf6',
            titulo: 'Entrega Registrada',
            linhas: [
                { label:'Data/Hora',     val: fmtDT(ordem.data_entrega) },
                { label:'Responsável',   val: ordem.responsavel_entrega || '—' },
                ordem.destino_entrega  ? { label:'Destino',  val: ordem.destino_entrega } : null,
                ordem.placa_veiculo    ? { label:'Veículo',  val: ordem.placa_veiculo   } : null,
                ordem.observacoes_entrega ? { label:'Obs', val: ordem.observacoes_entrega } : null,
            ].filter(Boolean),
            done: !!ordem.data_entrega,
        },
    ];

    // ── HTML do timeline ──────────────────────────────────────

    const timelineHTML = steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const opacity = step.done ? '1' : '0.35';
        const borderColor = step.done ? step.cor : 'rgba(148,163,184,.2)';

        const linhasHTML = step.linhas.map(l => `
            <div class="flex items-start gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <span class="text-[10px] text-slate-400 w-24 flex-shrink-0 pt-0.5">${l.label}</span>
                <span class="text-[11px] font-medium text-slate-700 dark:text-slate-200 flex-1">${l.val}</span>
            </div>`).join('');

        return `
        <div class="flex gap-3" style="opacity:${opacity}">
            <!-- Ícone + linha vertical -->
            <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     style="background:${step.cor}22;border:2px solid ${step.done ? step.cor : 'rgba(148,163,184,.3)'};">
                    <span class="material-symbols-rounded text-sm" style="color:${step.cor};font-variation-settings:'FILL' 1">
                        ${step.icon}
                    </span>
                </div>
                ${!isLast ? `<div class="w-0.5 flex-1 my-1 rounded-full" style="background:${step.done?step.cor+'44':'rgba(148,163,184,.15)'}; min-height:20px;"></div>` : ''}
            </div>
            <!-- Conteúdo -->
            <div class="flex-1 pb-4">
                <div class="flex items-center gap-2 mb-1.5">
                    <p class="text-xs font-bold" style="color:${step.cor}">${step.titulo}</p>
                    ${!step.done ? '<span class="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">Pendente</span>' : ''}
                </div>
                ${step.done ? `<div class="bg-slate-50 dark:bg-slate-800/40 rounded-xl px-3 py-1.5 space-y-0">${linhasHTML}</div>` : ''}
            </div>
        </div>`;
    }).join('');

    // ── Botões de ação ────────────────────────────────────────

    let actionBtn = '';
    if (ordem.status === 'pending' && nivel >= 2) {
        actionBtn = `
            <div class="mt-4">
                <label class="block text-xs font-semibold text-slate-500 mb-1.5">Selecione o Operador</label>
                <select id="operador-iniciar-${ordem.id}"
                    class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:border-primary-500 outline-none mb-3">
                    <option value="">Carregando...</option>
                </select>
                <button onclick="window.iniciarOrdem('${ordem.id}')"
                    class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                    <span class="material-symbols-rounded text-lg">play_arrow</span>
                    Iniciar Separação
                </button>
            </div>`;
    } else if (['progress','in_progress'].includes(ordem.status) && nivel >= 2) {
        actionBtn = `
            <button onclick="window.concluirOrdem('${ordem.id}')"
                class="w-full mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <span class="material-symbols-rounded text-lg">check_circle</span>
                Concluir Separação
            </button>`;
    } else if (ordem.status === 'completed' && nivel >= 1) {
        actionBtn = `
            <button onclick="window.irParaEntrega('${ordem.id}')"
                class="w-full mt-4 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <span class="material-symbols-rounded text-lg">local_shipping</span>
                Registrar Entrega
            </button>`;
    }

    // ── Monta modal ───────────────────────────────────────────

    const modalHTML = `
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="ordem-detail-modal">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Ordem #${ordem.id}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}">
                            ${status.label}
                        </span>
                        <button onclick="document.getElementById('ordem-detail-modal').remove()"
                            class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                            <span class="material-symbols-rounded text-lg">close</span>
                        </button>
                    </div>
                </div>

                <!-- Timeline scrollável -->
                <div class="flex-1 overflow-y-auto px-5 py-5">
                    ${timelineHTML}
                    ${actionBtn}
                </div>
            </div>
        </div>`;

    document.getElementById('ordem-detail-modal')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Carrega operadores se necessário
    if (ordem.status === 'pending' && nivel >= 2) {
        carregarOperadores(ordem.id);
    }
};

// ── Carregar operadores ───────────────────────────────────────

async function carregarOperadores(ordemId) {
    const dropdown = document.getElementById(`operador-iniciar-${ordemId}`);
    if (!dropdown) return;
    try {
        const operators = await fetchOperators();
        dropdown.innerHTML = '<option value="">Selecione um operador...</option>';
        operators.forEach(op => {
            dropdown.innerHTML += `<option value="${op.id}">${op.name}</option>`;
        });
    } catch {
        dropdown.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

// ── Iniciar ordem ─────────────────────────────────────────────

window.iniciarOrdem = async function(orderId) {
    const dropdown  = document.getElementById(`operador-iniciar-${orderId}`);
    const operadorId = dropdown?.value;
    if (!operadorId) { showToast('Selecione um operador!', 'warning'); return; }

    // Nome do operador para registrar
    const operadorNome = dropdown.options[dropdown.selectedIndex]?.text || '';

    try {
        const { error } = await supabaseClient.from('orders').update({
            status:            'progress',
            operator_id:       operadorId,
            separador:         operadorNome,
            inicio_separacao:  new Date().toISOString(),
        }).eq('id', orderId);
        if (error) throw error;

        document.getElementById('ordem-detail-modal')?.remove();
        await loadOrders();
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable  === 'function') renderOrdensTable();
        showToast('✅ Separação iniciada!', 'success');
    } catch(e) { showToast('Erro: ' + e.message, 'error'); }
};

// ── Concluir ordem ────────────────────────────────────────────

window.concluirOrdem = function(orderId) {
    document.getElementById('ordem-detail-modal')?.remove();
    setTimeout(() => {
        if (typeof abrirFinalizacaoModal === 'function') abrirFinalizacaoModal(orderId);
    }, 300);
};

// ── Ir para entrega ───────────────────────────────────────────

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
        showToast('Preencha os dados de entrega e confirme', 'info');
    }, 200);
};

window.entregarOrdem = window.irParaEntrega;

// ── Salva created_by ao criar ordem ──────────────────────────

window.getCreatedByFromSession = function() {
    try {
        const s = JSON.parse(localStorage.getItem('ordem_pro_session') || '{}');
        return s?.user?.nome || s?.user?.email || 'Sistema';
    } catch(_) { return 'Sistema'; }
};

console.log('✅ ordem-detail-modal.js — timeline completa');
