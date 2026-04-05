// ============================================
// MODAL DE FINALIZAÇÃO - COM EVENT LISTENERS
// ============================================

let finalizacaoData = {
    orderId: null,
    ordemCompleta: null,
    embalagemSeparada: null,
    numeroVolumes: 1
};

// Abrir Modal de Finalização
window.abrirFinalizacaoModal = function(orderId) {
    console.log('📋 Abrindo modal de finalização:', orderId);
    
    finalizacaoData = {
        orderId: orderId,
        ordemCompleta: null,
        embalagemSeparada: null,
        numeroVolumes: 1
    };
    
    const ordem = state.orders?.find(o => o.id === orderId);
    
    if (!ordem) {
        alert('Ordem não encontrada!');
        return;
    }
    
    const modalHTML = `
        <div class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="finalizacao-modal" style="z-index: 9999;">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" style="position: relative; z-index: 10000;">
                
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-slate-900 border-b p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Finalizar Separação</h2>
                            <p class="text-sm text-slate-600 dark:text-slate-400">Ordem #${ordem.id} - ${ordem.product}</p>
                        </div>
                        <button id="btn-fechar-modal" class="text-slate-400 hover:text-slate-600">
                            <span class="material-symbols-rounded text-3xl">close</span>
                        </button>
                    </div>
                </div>
                
                <!-- Body -->
                <div class="p-6 space-y-6">
                    
                    <!-- Pergunta 1 -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">1</span>
                            A ordem foi completada 100%?
                        </h3>
                        
                        <div class="flex gap-4">
                            <button data-action="ordem-completa-sim" class="flex-1 py-4 px-6 border-2 border-slate-300 rounded-xl font-semibold hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                ✓ Sim, 100% Completa
                            </button>
                            <button data-action="ordem-completa-nao" class="flex-1 py-4 px-6 border-2 border-slate-300 rounded-xl font-semibold hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all">
                                ✗ Não, Faltam Itens
                            </button>
                        </div>
                    </div>
                    
                    <!-- Pergunta 2 -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">2</span>
                            Embalagem foi separada?
                        </h3>
                        
                        <div class="flex gap-4">
                            <button data-action="embalagem-sim" class="flex-1 py-4 px-6 border-2 border-slate-300 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                ✓ Sim
                            </button>
                            <button data-action="embalagem-nao" class="flex-1 py-4 px-6 border-2 border-slate-300 rounded-xl font-semibold hover:border-slate-500 hover:bg-slate-100 transition-all">
                                ✗ Não
                            </button>
                        </div>
                    </div>
                    
                    <!-- Pergunta 3 -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            <span class="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">3</span>
                            Quantos volumes tem esta ordem?
                        </h3>
                        
                        <div class="flex items-center gap-4">
                            <button data-action="volume-menos" class="w-12 h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg">
                                <span class="material-symbols-rounded">remove</span>
                            </button>
                            
                            <input type="number" id="numero-volumes" min="1" max="99" value="1" class="flex-1 text-center text-4xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-300 py-2" readonly>
                            
                            <button data-action="volume-mais" class="w-12 h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-lg">
                                <span class="material-symbols-rounded">add</span>
                            </button>
                        </div>
                        
                        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p class="text-sm text-blue-800">
                                Serão geradas <strong id="total-etiquetas">1</strong> etiqueta(s) ZLP e <strong id="total-folhas">1</strong> folha(s) A4
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-slate-900 border-t p-6 flex justify-between items-center">
                    <p class="text-sm text-slate-500">Responda todas as perguntas</p>
                    <button id="btn-concluir-final" disabled class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center gap-2">
                        <span class="material-symbols-rounded">print</span>
                        Concluir e Gerar Etiquetas
                    </button>
                </div>
                
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar event listeners
    attachEventListeners();
    
    console.log('✅ Modal de finalização aberto');
};

// Anexar Event Listeners
function attachEventListeners() {
    console.log('🔗 Anexando event listeners...');
    
    // Fechar modal
    const btnFechar = document.getElementById('btn-fechar-modal');
    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            console.log('Fechando modal');
            document.getElementById('finalizacao-modal')?.remove();
        });
    }
    
    // Ordem Completa - SIM
    const btnCompletaSim = document.querySelector('[data-action="ordem-completa-sim"]');
    if (btnCompletaSim) {
        btnCompletaSim.addEventListener('click', () => {
            console.log('Ordem completa: SIM');
            setOrdemCompleta(true);
        });
    }
    
    // Ordem Completa - NÃO
    const btnCompletaNao = document.querySelector('[data-action="ordem-completa-nao"]');
    if (btnCompletaNao) {
        btnCompletaNao.addEventListener('click', () => {
            console.log('Ordem completa: NÃO');
            setOrdemCompleta(false);
        });
    }
    
    // Embalagem - SIM
    const btnEmbalagemSim = document.querySelector('[data-action="embalagem-sim"]');
    if (btnEmbalagemSim) {
        btnEmbalagemSim.addEventListener('click', () => {
            console.log('Embalagem: SIM');
            setEmbalagemSeparada(true);
        });
    }
    
    // Embalagem - NÃO
    const btnEmbalagemNao = document.querySelector('[data-action="embalagem-nao"]');
    if (btnEmbalagemNao) {
        btnEmbalagemNao.addEventListener('click', () => {
            console.log('Embalagem: NÃO');
            setEmbalagemSeparada(false);
        });
    }
    
    // Volume - MENOS
    const btnVolumeMenos = document.querySelector('[data-action="volume-menos"]');
    if (btnVolumeMenos) {
        btnVolumeMenos.addEventListener('click', () => {
            console.log('Volume: -1');
            changeVolumes(-1);
        });
    }
    
    // Volume - MAIS
    const btnVolumeMais = document.querySelector('[data-action="volume-mais"]');
    if (btnVolumeMais) {
        btnVolumeMais.addEventListener('click', () => {
            console.log('Volume: +1');
            changeVolumes(1);
        });
    }
    
    // Concluir Final
    const btnConcluir = document.getElementById('btn-concluir-final');
    if (btnConcluir) {
        btnConcluir.addEventListener('click', () => {
            console.log('Concluir ordem final');
            concluirOrdemFinal();
        });
    }
    
    console.log('✅ Event listeners anexados');
}

// Set Ordem Completa
function setOrdemCompleta(completa) {
    finalizacaoData.ordemCompleta = completa;
    
    const btnSim = document.querySelector('[data-action="ordem-completa-sim"]');
    const btnNao = document.querySelector('[data-action="ordem-completa-nao"]');
    
    if (completa) {
        btnSim?.classList.add('border-emerald-500', 'bg-emerald-50', 'text-emerald-600');
        btnNao?.classList.remove('border-amber-500', 'bg-amber-50', 'text-amber-600');
    } else {
        btnNao?.classList.add('border-amber-500', 'bg-amber-50', 'text-amber-600');
        btnSim?.classList.remove('border-emerald-500', 'bg-emerald-50', 'text-emerald-600');
    }
    
    verificarFormulario();
}

// Set Embalagem Separada
function setEmbalagemSeparada(separada) {
    finalizacaoData.embalagemSeparada = separada;
    
    const btnSim = document.querySelector('[data-action="embalagem-sim"]');
    const btnNao = document.querySelector('[data-action="embalagem-nao"]');
    
    if (separada) {
        btnSim?.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-600');
        btnNao?.classList.remove('border-slate-500', 'bg-slate-100');
    } else {
        btnNao?.classList.add('border-slate-500', 'bg-slate-100');
        btnSim?.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600');
    }
    
    verificarFormulario();
}

// Change Volumes
function changeVolumes(delta) {
    const input = document.getElementById('numero-volumes');
    let valor = parseInt(input?.value) || 1;
    valor = Math.max(1, Math.min(99, valor + delta));
    if (input) input.value = valor;
    updateVolumes(valor);
}

// Update Volumes
function updateVolumes(valor) {
    valor = Math.max(1, Math.min(99, parseInt(valor) || 1));
    finalizacaoData.numeroVolumes = valor;
    
    const etiquetas = document.getElementById('total-etiquetas');
    const folhas = document.getElementById('total-folhas');
    
    if (etiquetas) etiquetas.textContent = valor;
    if (folhas) folhas.textContent = valor;
    
    verificarFormulario();
}

// Verificar Formulário
function verificarFormulario() {
    const completo = finalizacaoData.ordemCompleta !== null && 
                     finalizacaoData.embalagemSeparada !== null && 
                     finalizacaoData.numeroVolumes >= 1;
    
    const btn = document.getElementById('btn-concluir-final');
    if (btn) {
        btn.disabled = !completo;
        console.log('Formulário completo:', completo);
    }
}

// Concluir Ordem Final
async function concluirOrdemFinal() {
    console.log('🎯 INICIANDO CONCLUSÃO...');
    console.log('📊 Dados da finalização:', finalizacaoData);
    console.log('📦 State orders:', state.orders);
    
    // Verificar se dados estão completos
    if (finalizacaoData.ordemCompleta === null) {
        alert('⚠️ Responda a pergunta 1: Ordem completa?');
        return;
    }
    
    if (finalizacaoData.embalagemSeparada === null) {
        alert('⚠️ Responda a pergunta 2: Embalagem separada?');
        return;
    }
    
    if (!finalizacaoData.numeroVolumes || finalizacaoData.numeroVolumes < 1) {
        alert('⚠️ Defina o número de volumes!');
        return;
    }
    
    try {
        const ordem = state.orders?.find(o => o.id === finalizacaoData.orderId);
        console.log('🔍 Ordem encontrada:', ordem);
        
        if (!ordem) {
            alert('❌ Ordem não encontrada no state!');
            return;
        }
        
        console.log('💾 Salvando no Supabase...');
        console.log('📝 Dados para atualizar:', {
            status: 'completed',
            fim_separacao: new Date().toISOString(),
            ordem_completa: finalizacaoData.ordemCompleta,
            embalagem_separada: finalizacaoData.embalagemSeparada,
            numero_volumes: finalizacaoData.numeroVolumes
        });
        
        // Atualizar no Supabase
        const { data, error } = await supabaseClient
            .from('orders')
            .update({
                status: 'completed',
                fim_separacao: new Date().toISOString(),
                ordem_completa: finalizacaoData.ordemCompleta,
                embalagem_separada: finalizacaoData.embalagemSeparada,
                numero_volumes: finalizacaoData.numeroVolumes
            })
            .eq('id', finalizacaoData.orderId)
            .select()
            .single();
        
        if (error) {
            console.error('❌ ERRO SUPABASE:', error);
            console.error('❌ Error details:', JSON.stringify(error, null, 2));
            alert(`❌ Erro ao salvar no Supabase: ${error.message}`);
            return;
        }
        
        console.log('✅ SUPABASE ATUALIZADO:', data);
        
        // Gerar etiquetas
        console.log('🖨️ Gerando etiquetas...');
        gerarEtiquetas(ordem);
        
        // Fechar modal
        console.log('🚪 Fechando modal...');
        document.getElementById('finalizacao-modal')?.remove();
        
        // Recarregar
        console.log('🔄 Recarregando dados...');
        await loadOrders();
        
        console.log('🎨 Atualizando interface...');
        if (typeof renderRecentOrders === 'function') renderRecentOrders();
        if (typeof renderOrdensTable === 'function') renderOrdensTable();
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateCharts === 'function') updateCharts();
        
        showToast('✅ Ordem concluída! Etiquetas geradas!', 'success');
        console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
        
    } catch (error) {
        console.error('❌ ERRO GERAL:', error);
        console.error('❌ Stack trace:', error.stack);
        alert(`❌ Erro: ${error.message}`);
    }
}

// Gerar Etiquetas
function gerarEtiquetas(ordem) {
    console.log('🖨️ Gerando etiquetas...', ordem);
    
    let html = '';
    
    for (let i = 1; i <= finalizacaoData.numeroVolumes; i++) {
        // Etiqueta ZLP
        html += `
            <div class="etiqueta-zlp" style="page-break-after: always; width: 10cm; height: 6cm; border: 2px solid #000; padding: 10px; background: white; color: black;">
                <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                    #${ordem.id}
                </div>
                <div style="text-align: center; font-size: 18px; margin-bottom: 10px;">
                    ${ordem.product}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                    <span>QTD: ${ordem.quantity}</span>
                    <span>VOL: ${i}/${finalizacaoData.numeroVolumes}</span>
                </div>
                <div style="text-align: center; font-size: 10px; margin-top: 20px;">
                    ${new Date().toLocaleDateString('pt-BR')}
                </div>
            </div>
        `;
        
        // Folha A4
        html += `
            <div class="folha-a4" style="page-break-after: always; width: 21cm; padding: 2cm; background: white; color: black;">
                <h1 style="text-align: center; margin-bottom: 30px;">ORDEM DE SEPARAÇÃO</h1>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Número:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${ordem.id}</td>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Volume:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${i} de ${finalizacaoData.numeroVolumes}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Produto:</td>
                        <td colspan="3" style="padding: 10px; border: 1px solid #000;">${ordem.product}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Quantidade:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${ordem.quantity} un</td>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Data:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${formatDate(ordem.data_prevista)}</td>
                    </tr>
                </table>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Ordem Completa:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${finalizacaoData.ordemCompleta ? '✓ SIM' : '✗ NÃO'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #000; font-weight: bold;">Embalagem Separada:</td>
                        <td style="padding: 10px; border: 1px solid #000;">${finalizacaoData.embalagemSeparada ? '✓ SIM' : '✗ NÃO'}</td>
                    </tr>
                </table>
            </div>
        `;
    }
    
    const printArea = document.getElementById('print-area') || createPrintArea();
    printArea.innerHTML = html;
    
    setTimeout(() => {
        window.print();
    }, 500);
}

function createPrintArea() {
    const area = document.createElement('div');
    area.id = 'print-area';
    area.style.display = 'none';
    document.body.appendChild(area);
    return area;
}

console.log('✅ finalizacao-modal.js carregado (EVENT LISTENERS)');

// Exportar para testes
window.finalizacaoModalTest = function() {
    console.log('Estado atual:', finalizacaoData);
    console.log('Botões encontrados:', {
        fechar: !!document.getElementById('btn-fechar-modal'),
        completaSim: !!document.querySelector('[data-action="ordem-completa-sim"]'),
        completaNao: !!document.querySelector('[data-action="ordem-completa-nao"]'),
        embalagemSim: !!document.querySelector('[data-action="embalagem-sim"]'),
        embalagemNao: !!document.querySelector('[data-action="embalagem-nao"]'),
        volumeMenos: !!document.querySelector('[data-action="volume-menos"]'),
        volumeMais: !!document.querySelector('[data-action="volume-mais"]'),
        concluir: !!document.getElementById('btn-concluir-final')
    });
};
