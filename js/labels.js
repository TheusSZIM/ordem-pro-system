/* ============================================
   CONTROLE DE ORDENS PRO - ETIQUETAS ZLP
   ============================================ */

// Abrir Modal de Finalização
function abrirFinalizacaoModal(ordemId) {
    const ordem = ordensDetalhadas.find(o => o.id === ordemId);
    if (!ordem) return;

    // Se não tem volumes definidos, define 1 por padrão
    if (!ordem.volumes) ordem.volumes = 1;
    if (!ordem.componentes) {
        ordem.componentes = [
            { codigo: 'ITEM-001', descricao: ordem.product, qtd: ordem.qty, faltante: 0 }
        ];
    }

    currentFinalizacaoOrdem = ordem;
    
    // Reset state
    finalizacaoState = {
        ordemCompleta: null,
        embalagemSeparada: null,
        itensFaltantes: []
    };

    // Update modal info
    const finalizacaoInfo = document.getElementById('finalizacao-ordem-info');
    if (finalizacaoInfo) {
        finalizacaoInfo.textContent = `Ordem ${ordem.id} - ${ordem.product} (${ordem.volumes} volumes)`;
    }

    // Reset buttons
    resetButtonStates();
    
    // Hide itens faltantes area
    const itensFaltantesArea = document.getElementById('itens-faltantes-area');
    if (itensFaltantesArea) itensFaltantesArea.classList.add('hidden');
    
    // Disable final button
    const btnConcluir = document.getElementById('btn-concluir-final');
    if (btnConcluir) btnConcluir.disabled = true;

    // Show modal
    const modal = document.getElementById('finalizacao-modal');
    const content = document.getElementById('finalizacao-content');
    if (modal && content) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

// Fechar Modal de Finalização
function closeFinalizacaoModal() {
    const modal = document.getElementById('finalizacao-modal');
    const content = document.getElementById('finalizacao-content');
    if (content) {
        content.classList.add('scale-95', 'opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
    }
    setTimeout(() => {
        if (modal) modal.classList.add('hidden');
        currentFinalizacaoOrdem = null;
    }, 300);
}

// Resetar Estados dos Botões
function resetButtonStates() {
    const btnCompletaSim = document.getElementById('btn-completa-sim');
    const btnCompletaNao = document.getElementById('btn-completa-nao');
    const btnEmbalagemSim = document.getElementById('btn-embalagem-sim');
    const btnEmbalagemNao = document.getElementById('btn-embalagem-nao');
    
    if (btnCompletaSim) {
        btnCompletaSim.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all flex items-center justify-center gap-2';
    }
    if (btnCompletaNao) {
        btnCompletaNao.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-all flex items-center justify-center gap-2';
    }
    if (btnEmbalagemSim) {
        btnEmbalagemSim.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center justify-center gap-2';
    }
    if (btnEmbalagemNao) {
        btnEmbalagemNao.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition-all flex items-center justify-center gap-2';
    }
}

// Definir Ordem Completa
function setOrdemCompleta(completa) {
    finalizacaoState.ordemCompleta = completa;
    
    const btnCompletaSim = document.getElementById('btn-completa-sim');
    const btnCompletaNao = document.getElementById('btn-completa-nao');
    const itensFaltantesArea = document.getElementById('itens-faltantes-area');
    
    // Update button states
    if (completa) {
        if (btnCompletaSim) {
            btnCompletaSim.className = 'flex-1 py-4 px-6 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl font-semibold text-emerald-600 transition-all flex items-center justify-center gap-2 shadow-md';
        }
        if (btnCompletaNao) {
            btnCompletaNao.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-all flex items-center justify-center gap-2';
        }
        
        // Hide itens faltantes
        if (itensFaltantesArea) itensFaltantesArea.classList.add('hidden');
        finalizacaoState.itensFaltantes = [];
    } else {
        if (btnCompletaSim) {
            btnCompletaSim.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all flex items-center justify-center gap-2';
        }
        if (btnCompletaNao) {
            btnCompletaNao.className = 'flex-1 py-4 px-6 border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-xl font-semibold text-amber-600 transition-all flex items-center justify-center gap-2 shadow-md';
        }
        
        // Show itens faltantes
        renderItensFaltantes();
        if (itensFaltantesArea) itensFaltantesArea.classList.remove('hidden');
    }
    
    checkCanFinalize();
}

// Definir Embalagem Separada
function setEmbalagemSeparada(separada) {
    finalizacaoState.embalagemSeparada = separada;
    
    const btnEmbalagemSim = document.getElementById('btn-embalagem-sim');
    const btnEmbalagemNao = document.getElementById('btn-embalagem-nao');
    
    // Update button states
    if (separada) {
        if (btnEmbalagemSim) {
            btnEmbalagemSim.className = 'flex-1 py-4 px-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl font-semibold text-blue-600 transition-all flex items-center justify-center gap-2 shadow-md';
        }
        if (btnEmbalagemNao) {
            btnEmbalagemNao.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition-all flex items-center justify-center gap-2';
        }
    } else {
        if (btnEmbalagemSim) {
            btnEmbalagemSim.className = 'flex-1 py-4 px-6 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all flex items-center justify-center gap-2';
        }
        if (btnEmbalagemNao) {
            btnEmbalagemNao.className = 'flex-1 py-4 px-6 border-2 border-slate-500 bg-slate-100 dark:bg-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2 shadow-md';
        }
    }
    
    checkCanFinalize();
}

// Renderizar Itens Faltantes
function renderItensFaltantes() {
    if (!currentFinalizacaoOrdem) return;
    
    const container = document.getElementById('itens-lista');
    if (!container) return;
    
    container.innerHTML = currentFinalizacaoOrdem.componentes.map((item, index) => `
        <div class="bg-white dark:bg-slate-900 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div class="flex items-center justify-between mb-2">
                <div class="flex-1">
                    <div class="font-semibold text-slate-900 dark:text-white text-sm">${item.codigo}</div>
                    <div class="text-xs text-slate-600 dark:text-slate-400">${item.descricao}</div>
                </div>
                <div class="text-sm font-bold text-slate-700 dark:text-slate-300">Qtd: ${item.qtd}</div>
            </div>
            <div class="flex items-center gap-3">
                <label class="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">Faltante:</label>
                <input type="number" 
                       min="0" 
                       max="${item.qtd}" 
                       value="0" 
                       onchange="updateItemFaltante(${index}, this.value)"
                       class="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            </div>
        </div>
    `).join('');
}

// Atualizar Item Faltante
function updateItemFaltante(index, value) {
    if (!currentFinalizacaoOrdem) return;
    
    const qtdFaltante = parseInt(value) || 0;
    finalizacaoState.itensFaltantes[index] = {
        ...currentFinalizacaoOrdem.componentes[index],
        faltante: qtdFaltante
    };
    
    checkCanFinalize();
}

// Verificar se pode Finalizar
function checkCanFinalize() {
    const canFinalize = finalizacaoState.ordemCompleta !== null && finalizacaoState.embalagemSeparada !== null;
    const btnConcluir = document.getElementById('btn-concluir-final');
    if (btnConcluir) btnConcluir.disabled = !canFinalize;
}

// Concluir Ordem Final
function concluirOrdemFinal() {
    if (!currentFinalizacaoOrdem) return;

    // Update ordem status
    currentFinalizacaoOrdem.status = 'completed';
    currentFinalizacaoOrdem.fimSeparacao = new Date().toLocaleString('pt-BR');
    
    // Calculate duration
    if (currentFinalizacaoOrdem.inicioSeparacao) {
        const inicio = new Date(currentFinalizacaoOrdem.inicioSeparacao);
        const fim = new Date();
        const diff = Math.abs(fim - inicio);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        currentFinalizacaoOrdem.tempoTotal = `${hours}h ${minutes}min`;
    }
    
    // Store finalization data
    currentFinalizacaoOrdem.finalizacaoData = {
        ordemCompleta: finalizacaoState.ordemCompleta,
        embalagemSeparada: finalizacaoState.embalagemSeparada,
        itensFaltantes: finalizacaoState.itensFaltantes.filter(i => i && i.faltante > 0)
    };

    // Close modal
    closeFinalizacaoModal();

    // Show preparing message
    showToast('Preparando etiquetas para impressão...', 'info');

    // Generate and print labels
    setTimeout(() => {
        gerarEImprimirEtiquetas(currentFinalizacaoOrdem);
    }, 500);
}

// Gerar e Imprimir Etiquetas
function gerarEImprimirEtiquetas(ordem) {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;
    
    printArea.innerHTML = '';

    // Generate ZLP labels for each volume
    for (let i = 1; i <= ordem.volumes; i++) {
        printArea.innerHTML += gerarEtiquetaZLP(ordem, i);
    }

    // Generate A4 IDs for each volume
    for (let i = 1; i <= ordem.volumes; i++) {
        printArea.innerHTML += gerarIdentificacaoA4(ordem, i);
    }

    // Wait for barcodes to render
    setTimeout(() => {
        // Generate all barcodes
        const barcodes = document.querySelectorAll('.barcode-svg');
        barcodes.forEach(svg => {
            const code = svg.getAttribute('data-code');
            if (typeof JsBarcode !== 'undefined') {
                JsBarcode(svg, code, {
                    format: 'CODE128',
                    width: 2,
                    height: 60,
                    displayValue: true,
                    fontSize: 14,
                    margin: 10
                });
            }
        });

        // Print
        printArea.style.display = 'block';
        window.print();
        printArea.style.display = 'none';

        // Update UI
        renderOrdensTable();
        renderRecentOrders();
        updateCharts();
        showToast('Etiquetas impressas com sucesso!', 'success');
    }, 300);
}

// Gerar Etiqueta ZLP
function gerarEtiquetaZLP(ordem, volumeNum) {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="zlp-label bg-white p-4 flex flex-col" style="border: 1px solid #000;">
            <!-- Header -->
            <div class="text-center mb-3 pb-2 border-b-2 border-black">
                <div class="text-2xl font-bold">MOVIMENTAÇÃO VETORE</div>
                <div class="text-sm">Sistema de Separação</div>
            </div>

            <!-- Ordem Info -->
            <div class="mb-3">
                <div class="text-xs text-gray-600 mb-1">ORDEM DE SEPARAÇÃO</div>
                <div class="text-3xl font-bold mb-2">${ordem.id}</div>
                <svg class="barcode-svg mx-auto" data-code="${ordem.id}"></svg>
            </div>

            <!-- Volume -->
            <div class="bg-black text-white p-3 text-center mb-3">
                <div class="text-sm">VOLUME</div>
                <div class="text-4xl font-bold">${volumeNum} / ${ordem.volumes}</div>
            </div>

            <!-- Product -->
            <div class="mb-3">
                <div class="text-xs text-gray-600">PRODUTO</div>
                <div class="text-lg font-semibold">${ordem.product}</div>
            </div>

            <!-- Cliente -->
            <div class="mb-3">
                <div class="text-xs text-gray-600">CLIENTE</div>
                <div class="text-md font-semibold">${ordem.cliente || 'N/A'}</div>
            </div>

            <!-- Destino -->
            <div class="mb-3">
                <div class="text-xs text-gray-600">DESTINO</div>
                <div class="text-md font-semibold flex items-center gap-1">
                    <span class="text-lg">📍</span> ${ordem.destino || 'N/A'}
                </div>
            </div>

            <!-- Footer Info -->
            <div class="mt-auto pt-2 border-t border-gray-300 text-xs grid grid-cols-2 gap-2">
                <div>
                    <span class="text-gray-600">Data:</span>
                    <span class="font-semibold">${dataAtual}</span>
                </div>
                <div>
                    <span class="text-gray-600">Hora:</span>
                    <span class="font-semibold">${horaAtual}</span>
                </div>
            </div>

            ${ordem.finalizacaoData?.embalagemSeparada ? `
                <div class="mt-2 bg-blue-100 border-2 border-blue-500 p-2 text-center">
                    <div class="text-xs font-bold text-blue-700">⚠️ EMBALAGEM SEPARADA</div>
                </div>
            ` : ''}

            ${ordem.finalizacaoData?.itensFaltantes?.length > 0 ? `
                <div class="mt-2 bg-amber-100 border-2 border-amber-500 p-2">
                    <div class="text-xs font-bold text-amber-700 mb-1">⚠️ ATENÇÃO - ITENS FALTANTES</div>
                    <div class="text-xs space-y-1">
                        ${ordem.finalizacaoData.itensFaltantes.map(item => `
                            <div>• ${item.codigo}: ${item.faltante} un</div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Gerar Identificação A4
function gerarIdentificacaoA4(ordem, volumeNum) {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    return `
        <div class="a4-id bg-white p-12 flex flex-col" style="border: 1px solid #000;">
            <!-- Header -->
            <div class="text-center mb-8 pb-6 border-b-4 border-black">
                <div class="text-5xl font-bold mb-2">MOVIMENTAÇÃO VETORE</div>
                <div class="text-2xl text-gray-600">Identificação de Volume</div>
            </div>

            <!-- Ordem -->
            <div class="mb-8 text-center">
                <div class="text-xl text-gray-600 mb-2">ORDEM DE SEPARAÇÃO</div>
                <div class="text-7xl font-bold mb-4">${ordem.id}</div>
                <svg class="barcode-svg mx-auto" data-code="${ordem.id}" style="width: 400px;"></svg>
            </div>

            <!-- Volume Badge -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center mb-8 rounded-2xl shadow-2xl">
                <div class="text-3xl mb-2">VOLUME</div>
                <div class="text-9xl font-bold">${volumeNum}</div>
                <div class="text-4xl mt-2">de ${ordem.volumes}</div>
            </div>

            <!-- Product Info -->
            <div class="grid grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <div class="text-lg text-gray-600 mb-2">PRODUTO</div>
                    <div class="text-2xl font-bold">${ordem.product}</div>
                </div>
                <div class="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <div class="text-lg text-gray-600 mb-2">CLIENTE</div>
                    <div class="text-2xl font-bold">${ordem.cliente || 'N/A'}</div>
                </div>
            </div>

            <!-- Destination -->
            <div class="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 mb-8">
                <div class="text-lg text-gray-600 mb-2">DESTINO</div>
                <div class="text-3xl font-bold flex items-center gap-3">
                    <span class="text-4xl">📍</span> ${ordem.destino || 'N/A'}
                </div>
            </div>

            <!-- Components Table -->
            ${ordem.componentes && ordem.componentes.length > 0 ? `
                <div class="mb-8">
                    <div class="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>📦</span> Componentes da Ordem
                    </div>
                    <table class="w-full border-2 border-gray-300">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="border border-gray-300 p-3 text-left text-lg">Código</th>
                                <th class="border border-gray-300 p-3 text-left text-lg">Descrição</th>
                                <th class="border border-gray-300 p-3 text-center text-lg">Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ordem.componentes.map(comp => `
                                <tr>
                                    <td class="border border-gray-300 p-3 font-mono text-lg">${comp.codigo}</td>
                                    <td class="border border-gray-300 p-3 text-lg">${comp.descricao}</td>
                                    <td class="border border-gray-300 p-3 text-center font-bold text-lg">${comp.qtd}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            <!-- Alerts -->
            ${ordem.finalizacaoData?.embalagemSeparada ? `
                <div class="mb-6 bg-blue-100 border-4 border-blue-500 p-6 rounded-xl">
                    <div class="text-3xl font-bold text-blue-700 text-center">
                        ⚠️ EMBALAGEM SEPARADA ⚠️
                    </div>
                </div>
            ` : ''}

            ${ordem.finalizacaoData?.itensFaltantes?.length > 0 ? `
                <div class="mb-6 bg-amber-100 border-4 border-amber-500 p-6 rounded-xl">
                    <div class="text-3xl font-bold text-amber-700 mb-4 text-center">
                        ⚠️ ATENÇÃO - ITENS FALTANTES ⚠️
                    </div>
                    <div class="text-xl space-y-2">
                        ${ordem.finalizacaoData.itensFaltantes.map(item => `
                            <div class="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-amber-400">
                                <span class="font-mono">${item.codigo} - ${item.descricao}</span>
                                <span class="font-bold text-red-600">FALTAM: ${item.faltante} unidades</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Observations -->
            ${ordem.observacoes ? `
                <div class="mb-6 bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
                    <div class="text-xl font-bold text-yellow-800 mb-2">📝 OBSERVAÇÕES:</div>
                    <div class="text-lg text-yellow-900">${ordem.observacoes}</div>
                </div>
            ` : ''}

            <!-- Footer -->
            <div class="mt-auto pt-6 border-t-2 border-gray-300">
                <div class="grid grid-cols-3 gap-4 text-center text-lg">
                    <div>
                        <div class="text-gray-600">Data Separação</div>
                        <div class="font-bold">${dataAtual}</div>
                    </div>
                    <div>
                        <div class="text-gray-600">Hora Separação</div>
                        <div class="font-bold">${horaAtual}</div>
                    </div>
                    <div>
                        <div class="text-gray-600">Data Prevista</div>
                        <div class="font-bold">${new Date(ordem.dataPrevista).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { abrirFinalizacaoModal, closeFinalizacaoModal, resetButtonStates, setOrdemCompleta, setEmbalagemSeparada, renderItensFaltantes, updateItemFaltante, checkCanFinalize, concluirOrdemFinal, gerarEImprimirEtiquetas, gerarEtiquetaZLP, gerarIdentificacaoA4 };
}
