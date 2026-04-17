// ============================================
// ENTREGA DE ORDEM — js/entrega.js
// Funções executadas pelo index.html
// ============================================

/* Renderiza a lista de ordens concluídas no painel lateral */
function renderOrdensEntrega() {
    const lista = document.getElementById('ordens-concluidas-lista');
    const badge = document.getElementById('badge-concluidas');
    if (!lista) return;

    const concluidas = (window.state?.orders || []).filter(o => o.status === 'completed');

    if (badge) badge.textContent = concluidas.length;

    if (concluidas.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-10 text-slate-400">
                <span class="material-symbols-rounded text-4xl mb-2 block opacity-40">check_circle</span>
                <p class="text-sm">Nenhuma ordem concluída<br>aguardando entrega</p>
            </div>`;
        return;
    }

    lista.innerHTML = concluidas.map(o => `
        <div class="ordem-concluida-card" data-id="${o.id}" onclick="selecionarOrdemEntrega('${o.id}')">
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        ${o.lote
                            ? `<span style="background:rgba(99,102,241,.15);color:#818cf8;padding:2px 8px;border-radius:20px;font-size:11px;">${o.lote}</span>`
                            : `<span class="text-slate-500 font-normal text-xs">sem lote</span>`
                        }
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">${o.product || '—'}</p>
                </div>
                <span class="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    Pronta
                </span>
            </div>
            <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span class="flex items-center gap-1">
                    <span class="material-symbols-rounded" style="font-size:13px">inventory_2</span>
                    ${o.quantity || 0} un
                </span>
                ${o.station ? `<span class="flex items-center gap-1">
                    <span class="material-symbols-rounded" style="font-size:13px">location_on</span>
                    ${o.station}
                </span>` : ''}
                ${o.fim_separacao ? `<span class="flex items-center gap-1 ml-auto">
                    <span class="material-symbols-rounded" style="font-size:13px">schedule</span>
                    ${new Date(o.fim_separacao).toLocaleDateString('pt-BR')}
                </span>` : ''}
            </div>
        </div>
    `).join('');
}

/* Seleciona uma ordem e preenche o formulário */
function selecionarOrdemEntrega(orderId) {
    const campo = document.getElementById('entrega-ordem');
    if (campo) {
        campo.value = orderId;
        campo.classList.add('ring-2', 'ring-primary-500');
        setTimeout(() => campo.classList.remove('ring-2', 'ring-primary-500'), 1500);
    }

    document.querySelectorAll('.ordem-concluida-card').forEach(el =>
        el.classList.toggle('selected', el.dataset.id === orderId));

    document.getElementById('entrega-responsavel')?.focus();
}

/* Submit do formulário de entrega */
async function handleEntrega(event) {
    event.preventDefault();

    const ordemId     = document.getElementById('entrega-ordem')?.value?.trim();
    const responsavel = document.getElementById('entrega-responsavel')?.value?.trim();
    const obs         = document.getElementById('entrega-obs')?.value?.trim();
    const confirmado  = document.getElementById('entrega-confirm')?.checked;

    if (!ordemId)     { showToast('Informe o número da ordem', 'warning'); return; }
    if (!responsavel) { showToast('Informe o responsável pela entrega', 'warning'); return; }
    if (!confirmado)  { showToast('Confirme que a ordem está pronta', 'warning'); return; }

    const ordem = window.state?.orders?.find(o => o.id === ordemId);
    if (!ordem)                       { showToast('Ordem não encontrada', 'error'); return; }
    if (ordem.status !== 'completed') { showToast('Esta ordem não está com status "Concluída"', 'warning'); return; }

    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="material-symbols-rounded animate-spin">progress_activity</span> Registrando...'; }

    try {
        const agora = new Date().toISOString();

        const { error } = await supabaseClient
            .from('orders')
            .update({
                status:              'delivered',
                data_entrega:        agora,
                responsavel_entrega: responsavel,
                observacoes_entrega: obs || null,
            })
            .eq('id', ordemId);

        if (error) throw error;

        if (typeof syncOrdemParaSheets === 'function') {
            syncOrdemParaSheets({ id: ordemId, status: 'delivered',
                responsavel_entrega: responsavel, data_entrega: agora }, 'atualizar');
        }

        await loadOrders();
        renderOrdensEntrega();
        if (typeof renderRecentOrders   === 'function') renderRecentOrders();
        if (typeof renderOrdensTable    === 'function') renderOrdensTable();
        if (typeof updateCharts         === 'function') updateCharts();
        if (typeof renderDashboardStats === 'function') renderDashboardStats();

        document.getElementById('entrega-form')?.reset();
        document.querySelectorAll('.ordem-concluida-card').forEach(el => el.classList.remove('selected'));

        const loteLabel = ordem.lote ? `Lote ${ordem.lote}` : `Ordem #${ordemId}`;
        showToast(`✅ Entrega de ${loteLabel} registrada!`, 'success');
        if (window.notify) window.notify.entrega(ordem.product, responsavel);

    } catch (err) {
        console.error('Erro ao registrar entrega:', err);
        showToast('Erro ao registrar entrega: ' + err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span class="material-symbols-rounded">local_shipping</span> Registrar Saída';
        }
    }
}

/* Escuta evento de mudança de página */
document.addEventListener('pageChanged', e => {
    if (e.detail === 'entrega') renderOrdensEntrega();
});

window.renderOrdensEntrega    = renderOrdensEntrega;
window.selecionarOrdemEntrega = selecionarOrdemEntrega;
window.handleEntrega          = handleEntrega;

console.log('✅ entrega.js carregado');
