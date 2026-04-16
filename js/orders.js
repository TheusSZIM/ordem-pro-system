/* ============================================
   CONTROLE DE ORDENS PRO - GERENCIAMENTO DE ORDENS
   Alterações: coluna ID → LOTE, removida coluna CLIENTE
   ============================================ */

const statusMap = {
    pending:    { label:'Pendente',      bg:'bg-amber-100 dark:bg-amber-900/30',   text:'text-amber-700 dark:text-amber-400',   color:'amber'   },
    progress:   { label:'Em Separação',  bg:'bg-blue-100 dark:bg-blue-900/30',     text:'text-blue-700 dark:text-blue-400',     color:'blue'    },
    in_progress:{ label:'Em Separação',  bg:'bg-blue-100 dark:bg-blue-900/30',     text:'text-blue-700 dark:text-blue-400',     color:'blue'    },
    completed:  { label:'Concluída',     bg:'bg-emerald-100 dark:bg-emerald-900/30',text:'text-emerald-700 dark:text-emerald-400',color:'emerald' },
    delivered:  { label:'Entregue',      bg:'bg-violet-100 dark:bg-violet-900/30', text:'text-violet-700 dark:text-violet-400', color:'violet'  },
};

// ── Dashboard: ordens recentes ────────────────────────────────

function renderRecentOrders() {
    console.log('📊 Renderizando ordens recentes...');
    const tbody = document.getElementById('recent-orders-table');
    if (!tbody) { console.warn('⚠️ Tabela recent-orders-table não encontrada'); return; }
    if (!state?.orders) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">Carregando...</td></tr>';
        return;
    }

    const recentes = state.orders.slice(0, 5);
    if (recentes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">Nenhuma ordem encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = recentes.map(ordem => {
        const status   = statusMap[ordem.status] || statusMap.pending;
        const progress = calculateProgress(ordem);
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onclick="showOrdemDetail('${ordem.id}')">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    ${ordem.lote
                        ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">${ordem.lote}</span>`
                        : `<span class="text-slate-400 text-xs font-normal">— sem lote</span>`
                    }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">${ordem.product || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ${status.label}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="w-full max-w-[100px]">
                        <div class="flex items-center justify-between text-xs mb-1">
                            <span class="text-slate-600 dark:text-slate-400">${progress}%</span>
                        </div>
                        <div class="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-${status.color}-500 rounded-full transition-all duration-500" style="width:${progress}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">${formatDate(ordem.data_prevista || ordem.created_at)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="event.stopPropagation(); showOrdemDetail('${ordem.id}')" class="text-primary-600 hover:text-primary-700">
                        <span class="material-symbols-rounded">visibility</span>
                    </button>
                </td>
            </tr>`;
    }).join('');

    console.log(`✅ ${recentes.length} ordens recentes renderizadas`);
}

// ── Aba de ordens ─────────────────────────────────────────────

function setOrdensTab(tab) {
    if (!state) state = {};
    state.currentOrdensTab = tab;
    document.querySelectorAll('.ordens-tab').forEach(btn => {
        const active = btn.dataset.tab === tab;
        btn.className = active
            ? 'ordens-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            : 'ordens-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    });
    renderOrdensTable();
}

// ── Tabela principal de ordens ────────────────────────────────

function renderOrdensTable() {
    console.log('📋 Renderizando tabela de ordens...');
    const tbody = document.getElementById('ordens-table-body');
    if (!tbody) { console.warn('⚠️ Tabela ordens-table-body não encontrada'); return; }

    if (!state?.orders) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">Carregando...</td></tr>';
        return;
    }

    let filtered = [...state.orders];

    // Filtro por aba
    if (state.currentOrdensTab && state.currentOrdensTab !== 'all') {
        filtered = filtered.filter(o => o.status === state.currentOrdensTab);
    }

    // Filtro por busca — agora busca em lote também
    if (state.ordensSearchTerm) {
        const term = state.ordensSearchTerm.toLowerCase();
        filtered = filtered.filter(o =>
            (o.lote    && o.lote.toLowerCase().includes(term))    ||
            (o.id      && o.id.toLowerCase().includes(term))      ||
            (o.product && o.product.toLowerCase().includes(term)) ||
            (o.operator_id && o.operator_id.toLowerCase().includes(term))
        );
    }

    // Contadores
    const pending   = state.orders.filter(o => o.status === 'pending').length;
    const progress  = state.orders.filter(o => ['progress','in_progress'].includes(o.status)).length;
    const completed = state.orders.filter(o => o.status === 'completed').length;
    const delivered = state.orders.filter(o => o.status === 'delivered').length;

    updateCounter('count-pending',   pending);
    updateCounter('count-progress',  progress);
    updateCounter('count-completed', completed);
    updateCounter('count-delivered', delivered);
    updateCounter('count-all',       state.orders.length);

    const paginationInfo = document.getElementById('ordens-pagination-info');
    if (paginationInfo) paginationInfo.textContent = `Mostrando ${filtered.length} ordens`;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">Nenhuma ordem encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(ordem => {
        const status = statusMap[ordem.status] || statusMap.pending;

        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <!-- LOTE — editável inline com clique duplo -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white"
                    title="Duplo clique para editar o lote">
                    <div class="flex items-center gap-1.5 group">
                        <span class="lote-display" id="lote-${ordem.id}">
                            ${ordem.lote
                                ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">${ordem.lote}</span>`
                                : '<span class="text-slate-400 font-normal text-xs">— sem lote</span>'}
                        </span>
                        <button onclick="abrirEdicaoLoteInline('${ordem.id}','${(ordem.lote||'').replace(/'/g,"\'")}')"
                            class="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-500 transition-all rounded"
                            title="Editar lote">
                            <span class="material-symbols-rounded text-sm">edit</span>
                        </button>
                    </div>
                </td>

                <!-- PRODUTO -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                    <div class="flex items-center gap-2">
                        ${ordem.priority === 'high' ? '<span class="material-symbols-rounded text-amber-500 text-sm">flag</span>' : ''}
                        ${ordem.product || '-'}
                    </div>
                </td>

                <!-- STATUS -->
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text}">
                        <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        ${status.label}
                    </span>
                </td>

                <!-- QUANTIDADE -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    ${ordem.quantity || 0} un
                </td>

                <!-- DATA/HORA INÍCIO (sem CLIENTE) -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    ${formatDate(ordem.inicio_separacao || ordem.created_at)}
                </td>

                <!-- AÇÕES -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                        <button onclick="showOrdemDetail('${ordem.id}')"
                            class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Ver detalhes">
                            <span class="material-symbols-rounded">visibility</span>
                        </button>
                        ${ordem.status === 'pending' ? `
                        <button onclick="iniciarSeparacao('${ordem.id}')"
                            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Iniciar separação">
                            <span class="material-symbols-rounded">play_arrow</span>
                        </button>` : ''}
                        ${['progress','in_progress'].includes(ordem.status) ? `
                        <button onclick="abrirFinalizacaoModal('${ordem.id}')"
                            class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Concluir">
                            <span class="material-symbols-rounded">check_circle</span>
                        </button>` : ''}
                        ${ordem.status === 'completed' ? `
                        <button onclick="irParaEntrega('${ordem.id}')"
                            class="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors" title="Registrar entrega">
                            <span class="material-symbols-rounded">local_shipping</span>
                        </button>` : ''}
                    </div>
                </td>
            </tr>`;
    }).join('');

    console.log(`✅ ${filtered.length} ordens renderizadas`);
}

// ── Helpers ───────────────────────────────────────────────────

function updateCounter(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function calculateProgress(ordem) {
    if (ordem.status === 'delivered')  return 100;
    if (ordem.status === 'completed')  return 85;
    if (['progress','in_progress'].includes(ordem.status)) return 50;
    return 20;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
    } catch { return '-'; }
}

function filterOrdens() {
    const searchInput = document.getElementById('search-ordens');
    if (searchInput) {
        if (!state) state = {};
        state.ordensSearchTerm = searchInput.value;
        renderOrdensTable();
    }
}

// ── Edição inline de lote na tabela ─────────────────────────

function abrirEdicaoLoteInline(ordId, loteAtual) {
    const cell = document.getElementById('lote-' + ordId);
    if (!cell) return;
    cell.innerHTML = `
        <div class="flex items-center gap-1.5">
            <input id="lote-inline-${ordId}" type="text" value="${loteAtual}"
                placeholder="Ex: LOTE-2024-001"
                class="w-32 px-2 py-1 text-xs rounded-lg dark:text-white outline-none"
                style="background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.5);"
                onkeydown="if(event.key==='Enter') salvarLoteInline('${ordId}'); if(event.key==='Escape') renderOrdensTable();"
                onclick="event.stopPropagation()">
            <button onclick="event.stopPropagation(); salvarLoteInline('${ordId}')"
                class="px-2 py-1 text-xs font-bold text-white rounded-lg" style="background:#4f46e5;">OK</button>
            <button onclick="event.stopPropagation(); renderOrdensTable()"
                class="text-xs text-slate-400 hover:text-slate-200 px-1">✕</button>
        </div>`;
    setTimeout(() => document.getElementById('lote-inline-' + ordId)?.focus(), 50);
}

async function salvarLoteInline(ordId) {
    const input = document.getElementById('lote-inline-' + ordId);
    const val   = (input?.value || '').trim() || null;
    const client = window.supabaseClient;
    if (!client) { if(typeof showToast==='function') showToast('Supabase não conectado','error'); return; }
    try {
        const { error } = await client.from('orders').update({ lote: val }).eq('id', ordId);
        if (error) throw error;
        const o = window.state?.orders?.find(x => x.id === ordId);
        if (o) o.lote = val;
        if (typeof showToast === 'function') showToast('✅ Lote ' + (val ? '"'+val+'"' : 'removido') + ' salvo!', 'success');
        renderOrdensTable();
    } catch(e) {
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
        console.error('salvarLoteInline:', e);
    }
}

window.abrirEdicaoLoteInline = abrirEdicaoLoteInline;
window.salvarLoteInline       = salvarLoteInline;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderRecentOrders, renderOrdensTable, setOrdensTab, filterOrdens, statusMap };
}

console.log('✅ orders.js carregado!');
