// ============================================
// MODAL DE FINALIZAÇÃO DE SEPARAÇÃO
// ============================================

let finalizacaoState = {
    orderId: null,
    ordemCompleta: null,
    itensFaltantes: [],
    embalagemSeparada: null,
    numeroVolumes: 1
};

// Abrir Modal de Finalização
function abrirFinalizacaoModal(orderId) {
    console.log('📋 Abrindo modal de finalização:', orderId);
    
    // Resetar estado
    finalizacaoState = {
        orderId: orderId,
        ordemCompleta: null,
        itensFaltantes: [],
        embalagemSeparada: null,
        numeroVolumes: 1
    };
    
    // Encontrar ordem
    const ordem = state.orders?.find(o => o.id === orderId);
    
    if (!ordem) {
        showToast('❌ Ordem não encontrada!', 'error');
        return;
    }
    
    // Criar modal
    const modalHTML = `
        <div class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="finalizacao-modal">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-10">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-symbols-rounded text-emerald-500">check_circle</span>
                                Finalizar Separação
                            </h2>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Ordem #${ordem.id} - ${ordem.product}</p>
                        </div>
                        <button onclick="closeFinalizacaoModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <span class="material-symbols-rounded text-3xl">close</span>
                        </button>
                    </div>
                </div>
                
                <!-- Body -->
                <div class="p-6 overflow-y-auto flex-1 space-y-6">
                    
                    <!-- Pergunta 1: Ordem Completa? -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700" id="pergunta-1">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                            A ordem foi completada 100%?
                        </h3>
                        
                        <div class="flex gap-4">
                            <button onclick="setOrdemCompleta(true)" id="btn-completa-sim" class="flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-rounded">check_circle</span>
                                Sim, 100% Completa
                            </button>
                            <button onclick="setOrdemCompleta(false)" id="btn-completa-nao" class="flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-rounded">warning</span>
                                Não, Faltam Itens
                            </button>
                        </div>
                    </div>
                    
                    <!-- Área de Itens Faltantes (Hidden) -->
                    <div id="itens-faltantes-area" class="hidden bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                        <h4 class="text-md font-bold text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-2">
                            <span class="material-symbols-rounded">inventory_2</span>
                            Marque os Itens Faltantes
                        </h4>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg">
                                <input type="checkbox" id="item-1" class="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500">
                                <label for="item-1" class="flex-1 text-sm font-medium text-slate-900 dark:text-white">
                                    ${ordem.product}
                                </label>
                                <input type="number" min="0" max="${ordem.quantity}" value="0" placeholder="Qtd faltante" class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pergunta 2: Embalagem Separada? -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700" id="pergunta-2">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-sm font-bold">2</span>
                            Embalagem foi separada?
                        </h3>
                        
                        <div class="flex gap-4">
                            <button onclick="setEmbalagemSeparada(true)" id="btn-embalagem-sim" class="flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-rounded">checkroom</span>
                                Sim
                            </button>
                            <button onclick="setEmbalagemSeparada(false)" id="btn-embalagem-nao" class="flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-rounded">close</span>
                                Não
                            </button>
                        </div>
                    </div>
                    
                    <!-- Pergunta 3: Número de Volumes -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700" id="pergunta-3">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-sm font-bold">3</span>
                            Quantos volumes tem esta ordem?
                        </h3>
                        
                        <div class="flex items-center gap-4">
                            <button onclick="changeVolumes(-1)" class="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                <span class="material-symbols-rounded">remove</span>
                            </button>
                            
                            <div class="flex-1 text-center">
                                <input type="number" id="numero-volumes" min="1" max="99" value="1" onchange="updateVolumes(this.value)" class="w-full text-center text-4xl font-bold text-primary-600 dark:text-primary-400 bg-transparent border-b-2 border-primary-300 dark:border-primary-700 focus:border-primary-500 focus:outline-none py-2">
                                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">volumes</p>
                            </div>
                            
                            <button onclick="changeVolumes(1)" class="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors">
                                <span class="material-symbols-rounded">add</span>
                            </button>
                        </div>
                        
                        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p class="text-sm text-blue-800 dark:text-blue-300">
                                <span class="material-symbols-rounded text-sm align-middle">info</span>
                                Serão geradas <strong id="total-etiquetas">1</strong> etiqueta(s) ZLP e <strong id="total-folhas">1</strong> folha(s) A4
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div class="text-sm text-slate-500 dark:text-slate-400">
                        Responda todas as perguntas para continuar
                    </div>
                    <button onclick="concluirOrdemFinal()" id="btn-concluir-final" disabled class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:shadow-none">
                        <span class="material-symbols-rounded">print</span>
                        Concluir e Gerar Etiquetas
                    </button>
                </div>
                
            </div>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    console.log('✅ Modal de finalização aberto');
}

// Definir Ordem Completa
function setOrdemCompleta(completa) {
    finalizacaoState.ordemCompleta = completa;
    
    // Atualizar UI dos botões
    const btnSim = document.getElementById('btn-completa-sim');
    const btnNao = document.getElementById('btn-completa-nao');
    
    if (completa) {
        btnSim.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20', 'text-emerald-600');
        btnNao.classList.remove('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/20', 'text-amber-600');
    } else {
        btnNao.classList.add('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/20', 'text-amber-600');
        btnSim.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20', 'text-emerald-600');
    }
    
    // Mostrar/ocultar área de itens faltantes
    const area = document.getElementById('itens-faltantes-area');
    if (completa) {
        area.classList.add('hidden');
    } else {
        area.classList.remove('hidden');
    }
    
    verificarFormularioCompleto();
}

// Definir Embalagem Separada
function setEmbalagemSeparada(separada) {
    finalizacaoState.embalagemSeparada = separada;
    
    // Atualizar UI dos botões
    const btnSim = document.getElementById('btn-embalagem-sim');
    const btnNao = document.getElementById('btn-embalagem-nao');
    
    if (separada) {
        btnSim.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600');
        btnNao.classList.remove('border-slate-500', 'bg-slate-100', 'dark:bg-slate-700', 'text-slate-700');
    } else {
        btnNao.classList.add('border-slate-500', 'bg-slate-100', 'dark:bg-slate-700', 'text-slate-700');
        btnSim.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600');
    }
    
    verificarFormularioCompleto();
}

// Alterar Volumes
function changeVolumes(delta) {
    const input = document.getElementById('numero-volumes');
    let valor = parseInt(input.value) || 1;
    valor = Math.max(1, Math.min(99, valor + delta));
    input.value = valor;
    updateVolumes(valor);
}

// Atualizar Volumes
function updateVolumes(valor) {
    valor = Math.max(1, Math.min(99, parseInt(valor) || 1));
    finalizacaoState.numeroVolumes = valor;
    
    document.getElementById('total-etiquetas').textContent = valor;
    document.getElementById('total-folhas').textContent = valor;
    
    verificarFormularioCompleto();
}

// Verificar se Formulário Completo
function verificarFormularioCompleto() {
    const completo = finalizacaoState.ordemCompleta !== null && 
                     finalizacaoState.embalagemSeparada !== null && 
                     finalizacaoState.numeroVolumes >= 1;
    
    const btn = document.getElementById('btn-concluir-final');
    if (btn) {
        btn.disabled = !completo;
    }
}

// Concluir Ordem Final
async function concluirOrdemFinal() {
    console.log('🎯 Concluindo ordem...', finalizacaoState);
    
    try {
        const ordem = state.orders?.find(o => o.id === finalizacaoState.orderId);
        
        if (!ordem) {
            showToast('❌ Ordem não encontrada!', 'error');
            return;
        }
        
        // Atualizar no Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .update({
                status: 'completed',
                fim_separacao: new Date().toISOString(),
                ordem_completa: finalizacaoState.ordemCompleta,
                embalagem_separada: finalizacaoState.embalagemSeparada,
                numero_volumes: finalizacaoState.numeroVolumes
            })
            .eq('id', finalizacaoState.orderId)
            .select()
            .single();
        
        if (error) {
            console.error('❌ Erro ao concluir ordem:', error);
            showToast('❌ Erro ao concluir ordem!', 'error');
            return;
        }
        
        console.log('✅ Ordem concluída:', data);
        
        // Gerar etiquetas e folhas
        gerarEtiquetasEFolhas(ordem);
        
        // Fechar modal
        closeFinalizacaoModal();
        
        // Recarregar dados
        await loadOrders();
        
        // Atualizar interface
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateCharts === 'function') updateCharts();
        
        showToast('✅ Ordem concluída! Etiquetas geradas com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        showToast('❌ Erro ao concluir ordem!', 'error');
    }
}

// Gerar Etiquetas ZLP e Folhas A4
function gerarEtiquetasEFolhas(ordem) {
    console.log('🖨️ Gerando etiquetas e folhas...', ordem);
    
    // Criar área de impressão
    const printArea = document.getElementById('print-area') || createPrintArea();
    
    let htmlContent = '';
    
    // Gerar para cada volume
    for (let i = 1; i <= finalizacaoState.numeroVolumes; i++) {
        // Etiqueta ZLP (formato zebra)
        htmlContent += gerarEtiquetaZLP(ordem, i, finalizacaoState.numeroVolumes);
        
        // Folha A4 com detalhes
        htmlContent += gerarFolhaA4(ordem, i, finalizacaoState.numeroVolumes);
    }
    
    printArea.innerHTML = htmlContent;
    
    // Abrir janela de impressão
    setTimeout(() => {
        window.print();
    }, 500);
}

// Gerar Etiqueta ZLP
function gerarEtiquetaZLP(ordem, volume, total) {
    return `
        <div class="etiqueta-zlp" style="page-break-after: always; width: 10cm; height: 6cm; border: 2px solid #000; padding: 10px; font-family: monospace; background: white; color: black;">
            <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                ${ordem.id}
            </div>
            <div style="text-align: center; font-size: 18px; margin-bottom: 10px;">
                ${ordem.product}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px;">
                <span>QTD: ${ordem.quantity}</span>
                <span>VOL: ${volume}/${total}</span>
            </div>
            <div style="text-align: center; margin-top: 10px;">
                <svg id="barcode-${volume}" style="width: 100%; height: 40px;"></svg>
            </div>
            <div style="text-align: center; font-size: 10px; margin-top: 5px;">
                ${formatDate(new Date())}
            </div>
        </div>
    `;
}

// Gerar Folha A4
function gerarFolhaA4(ordem, volume, total) {
    return `
        <div class="folha-a4" style="page-break-after: always; width: 21cm; height: 29.7cm; padding: 2cm; background: white; color: black; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; margin-bottom: 30px; color: #000;">ORDEM DE SEPARAÇÃO</h1>
            
            <div style="border: 2px solid #000; padding: 20px; margin-bottom: 20px;">
                <h2 style="margin-top: 0;">Informações da Ordem</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Número:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${ordem.id}</td>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Volume:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${volume} de ${total}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Produto:</td>
                        <td colspan="3" style="padding: 10px; border: 1px solid #ccc;">${ordem.product}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Quantidade:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${ordem.quantity} un</td>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Data:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${formatDate(ordem.data_prevista)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Célula:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${ordem.station || '-'}</td>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Embalagem:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${ordem.packaging_type || '-'}</td>
                    </tr>
                </table>
            </div>
            
            ${ordem.notes ? `
                <div style="border: 2px solid #f59e0b; padding: 20px; margin-bottom: 20px; background: #fef3c7;">
                    <h3 style="margin-top: 0; color: #92400e;">Observações:</h3>
                    <p style="color: #000;">${ordem.notes}</p>
                </div>
            ` : ''}
            
            <div style="border: 2px solid #000; padding: 20px;">
                <h3>Status da Separação:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Ordem Completa:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${finalizacaoState.ordemCompleta ? '✓ SIM' : '✗ NÃO - Itens faltantes'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Embalagem Separada:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${finalizacaoState.embalagemSeparada ? '✓ SIM' : '✗ NÃO'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">Data Conclusão:</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">${formatDateTime(new Date())}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
                Gerado automaticamente pelo Sistema Ordem Pro
            </div>
        </div>
    `;
}

// Criar área de impressão
function createPrintArea() {
    const area = document.createElement('div');
    area.id = 'print-area';
    area.style.display = 'none';
    document.body.appendChild(area);
    return area;
}

// Fechar Modal de Finalização
function closeFinalizacaoModal() {
    const modal = document.getElementById('finalizacao-modal');
    if (modal) {
        modal.remove();
    }
}

// Exportar funções
window.abrirFinalizacaoModal = abrirFinalizacaoModal;
window.closeFinalizacaoModal = closeFinalizacaoModal;
window.setOrdemCompleta = setOrdemCompleta;
window.setEmbalagemSeparada = setEmbalagemSeparada;
window.changeVolumes = changeVolumes;
window.updateVolumes = updateVolumes;
window.concluirOrdemFinal = concluirOrdemFinal;
window.concluirSeparacao = abrirFinalizacaoModal; // Alias

console.log('✅ finalizacao-modal.js carregado!');
