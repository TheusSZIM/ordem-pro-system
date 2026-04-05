/* ============================================
   CONTROLE DE ORDENS PRO - GERENCIAMENTO DE ORDENS
   ============================================ */

// Renderizar Ordens Recentes
function renderRecentOrders() {
    const tbody = document.getElementById('recent-orders-table');
    if (!tbody || typeof ordensDetalhadas === 'undefined') return;
    
    const recentes = ordensDetalhadas.slice(0, 5);
    
    tbody.innerHTML = recentes.map(ordem => {
        const status = statusMap[ordem.status];
        const progress = calculateProgress(ordem);
        
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onclick="showOrdemDetail('${ordem.id}')">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${ordem.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">${ordem.product}</td>
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
                            <div class="h-full bg-${status.color}-500 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">${formatDate(ordem.dataPrevista)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="event.stopPropagation(); showOrdemDetail('${ordem.id}')" class="text-primary-600 hover:text-primary-700">
                        <span class="material-symbols-rounded">visibility</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Configurar Aba de Ordens
function setOrdensTab(tab) {
    state.currentOrdensTab = tab;
    
    // Update tab styles
    document.querySelectorAll('.ordens-tab').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        if (isActive) {
            btn.className = 'ordens-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400';
        } else {
            btn.className = 'ordens-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
        }
    });
    
    renderOrdensTable();
}

// Renderizar Tabela de Ordens
function renderOrdensTable() {
    const tbody = document.getElementById('ordens-table-body');
    if (!tbody || typeof ordensDetalhadas === 'undefined') return;
    
    let filtered = ordensDetalhadas;
    
    // Filter by tab
    if (state.currentOrdensTab !== 'all') {
        filtered = filtered.filter(o => o.status === state.currentOrdensTab);
    }
    
    // Filter by search
    if (state.ordensSearchTerm) {
        const term = state.ordensSearchTerm.toLowerCase();
        filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(term) || 
            o.product.toLowerCase().includes(term) ||
            o.operator.toLowerCase().includes(term) ||
            (o.cliente && o.cliente.toLowerCase().includes(term))
        );
    }
    
    // Update counts
    document.getElementById('count-pending').textContent = ordensDetalhadas.filter(o => o.status === 'pending').length;
    document.getElementById('count-progress').textContent = ordensDetalhadas.filter(o => o.status === 'progress').length;
    document.getElementById('count-completed').textContent = ordensDetalhadas.filter(o => o.status === 'completed').length;
    document.getElementById('count-delivered').textContent = ordensDetalhadas.filter(o => o.status === 'delivered').length;
    document.getElementById('count-all').textContent = ordensDetalhadas.length;
    
    // Pagination info
    document.getElementById('ordens-pagination-info').textContent = `Mostrando ${filtered.length} ordens`;
    
    tbody.innerHTML = filtered.map(ordem => {
        const status = statusMap[ordem.status];
        
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${ordem.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                    <div class="flex items-center gap-2">
                        ${ordem.prioridade ? '<span class="material-symbols-rounded text-amber-500 text-sm">flag</span>' : ''}
                        ${ordem.product}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.text}">
                        <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        ${status.label}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">${ordem.qty} un</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    ${ordem.cliente || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    ${ordem.inicioSeparacao || '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                        <button onclick="showOrdemDetail('${ordem.id}')" class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="Ver detalhes">
                            <span class="material-symbols-rounded">visibility</span>
                        </button>
                        ${ordem.status === 'pending' ? `
                            <button onclick="iniciarSeparacao('${ordem.id}')" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Iniciar separação">
                                <span class="material-symbols-rounded">play_arrow</span>
                            </button>
                        ` : ''}
                        ${ordem.status === 'progress' ? `
                            <button onclick="abrirFinalizacaoModal('${ordem.id}')" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Concluir e Imprimir">
                                <span class="material-symbols-rounded">check_circle</span>
                            </button>
                        ` : ''}
                        ${ordem.status === 'completed' ? `
                            <button onclick="prepararEntrega('${ordem.id}')" class="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors" title="Registrar entrega">
                                <span class="material-symbols-rounded">local_shipping</span>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filtrar Ordens
function filterOrdens() {
    const input = document.getElementById('search-ordens');
    state.ordensSearchTerm = input ? input.value : '';
    renderOrdensTable();
}

// Iniciar Separação
function iniciarSeparacao(id) {
    const ordem = ordensDetalhadas.find(o => o.id === id);
    if (ordem) {
        ordem.status = 'progress';
        ordem.inicioSeparacao = new Date().toLocaleString('pt-BR');
        ordem.separador = 'Marcos Vieira'; // Current user
        ordem.tempoTotal = 'Em andamento';
        
        showToast('Separação iniciada com sucesso!', 'success');
        renderOrdensTable();
        renderRecentOrders();
        updateCharts();
    }
}

// Preparar Entrega
function prepararEntrega(id) {
    showPage('entrega');
    const entregaOrdem = document.getElementById('entrega-ordem');
    if (entregaOrdem) entregaOrdem.value = id;
    const entregaData = document.getElementById('entrega-data');
    if (entregaData) entregaData.value = new Date().toISOString().split('T')[0];
}

// Renderizar Ordens para Entrega
function renderOrdensEntrega() {
    const container = document.getElementById('ordens-entrega-list');
    if (!container || typeof ordensDetalhadas === 'undefined') return;
    
    const concluidas = ordensDetalhadas.filter(o => o.status === 'completed');
    
    if (concluidas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400">
                <span class="material-symbols-rounded text-4xl mb-2">inventory_2</span>
                <p class="text-sm">Nenhuma ordem pronta para entrega</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = concluidas.map(ordem => `
        <div class="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group" onclick="preencherEntrega('${ordem.id}')">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-slate-900 dark:text-white">${ordem.id}</span>
                <span class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">Pronta</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-1">${ordem.product}</p>
            <p class="text-xs text-slate-400">${ordem.qty} unidades • ${ordem.volumes || 1} vol • ${ordem.celula}</p>
        </div>
    `).join('');
}

// Preencher Entrega
function preencherEntrega(id) {
    const entregaOrdem = document.getElementById('entrega-ordem');
    if (entregaOrdem) entregaOrdem.value = id;
    const entregaData = document.getElementById('entrega-data');
    if (entregaData) entregaData.value = new Date().toISOString().split('T')[0];
}

// Handler de Entrega
function handleEntrega(e) {
    e.preventDefault();
    
    const ordemId = document.getElementById('entrega-ordem').value;
    const data = document.getElementById('entrega-data').value;
    const responsavel = document.getElementById('entrega-responsavel').value;
    const obs = document.getElementById('entrega-obs').value;
    
    const ordem = ordensDetalhadas.find(o => o.id === ordemId);
    if (ordem) {
        ordem.status = 'delivered';
        ordem.dataEntrega = data + ' ' + new Date().toLocaleTimeString('pt-BR');
        ordem.responsavelEntrega = responsavel;
        if (obs) ordem.observacoes += ' | Entrega: ' + obs;
        
        showToast('Entrega registrada com sucesso!', 'success');
        document.getElementById('entrega-form').reset();
        renderOrdensEntrega();
        renderOrdensTable();
        updateCharts();
    }
}

// Handler de Nova Ordem
function handleNewOrder(e) {
    e.preventDefault();
    
    const numero = document.getElementById('ordem-numero').value;
    const produto = document.getElementById('ordem-produto').value;
    const quantidade = document.getElementById('ordem-quantidade').value;
    const volumes = document.getElementById('ordem-volumes').value;
    const cliente = document.getElementById('ordem-cliente').value;
    const destino = document.getElementById('ordem-destino').value;
    const dataPrevista = document.getElementById('ordem-data-prevista').value;
    const operador = document.getElementById('ordem-operador').value;
    const celula = document.getElementById('ordem-celula').value;
    const tipoEmbalagem = document.querySelector('input[name="tipo-embalagem"]:checked')?.value;
    const reposicaoTipo = document.getElementById('ordem-reposicao-tipo')?.value;
    const observacoes = document.getElementById('ordem-observacoes').value;
    const prioridade = document.getElementById('ordem-prioridade').checked;
    
    if (!numero || !produto || !quantidade || !dataPrevista || !cliente || !destino) {
        showToast('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    const novaOrdem = {
        id: numero,
        product: produto,
        status: 'pending',
        qty: parseInt(quantidade),
        operator: operador || 'Não atribuído',
        celula: celula || 'Não definida',
        tipoEmbalagem: tipoEmbalagem,
        reposicaoTipo: tipoEmbalagem === 'Reposição' ? reposicaoTipo : null,
        dataInicio: null,
        horaInicio: null,
        dataPrevista: dataPrevista,
        separador: null,
        inicioSeparacao: null,
        fimSeparacao: null,
        tempoTotal: null,
        observacoes: observacoes,
        prioridade: prioridade,
        volumes: parseInt(volumes) || 1,
        cliente: cliente,
        destino: destino,
        componentes: [
            { codigo: 'COMP-001', descricao: 'Componente Principal', qtd: parseInt(quantidade), faltante: 0 }
        ]
    };
    
    ordensDetalhadas.unshift(novaOrdem);
    
    closeModal();
    showToast('Ordem criada com sucesso!', 'success');
    
    // Refresh current view
    if (state.currentPage === 'dashboard') {
        renderRecentOrders();
        updateCharts();
        animateCounters();
    } else if (state.currentPage === 'ordens') {
        renderOrdensTable();
    } else if (state.currentPage === 'kanban') {
        initKanban();
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderRecentOrders, setOrdensTab, renderOrdensTable, filterOrdens, iniciarSeparacao, prepararEntrega, renderOrdensEntrega, preencherEntrega, handleEntrega, handleNewOrder };
}
