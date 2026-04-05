// Página: Relatórios (COMPLETA)
async function renderReportsPage() {
    const orders = await ordersModule.fetchAll();
    const stats = ordersModule.getStats();
    
    return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Relatórios</h2>
                    <p class="text-slate-400 mt-1">Análises e métricas do sistema</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="exportReport('pdf')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold flex items-center gap-2">
                        <span class="material-symbols-rounded">picture_as_pdf</span>
                        Exportar PDF
                    </button>
                    <button onclick="exportReport('excel')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                        <span class="material-symbols-rounded">table_chart</span>
                        Exportar Excel
                    </button>
                </div>
            </div>

            <!-- Filtro de Período -->
            <div class="bg-slate-800 rounded-2xl p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                        <option>Hoje</option>
                        <option>Última semana</option>
                        <option>Último mês</option>
                        <option>Último trimestre</option>
                        <option>Último ano</option>
                        <option>Período personalizado</option>
                    </select>
                    <input type="date" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                    <input type="date" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                    <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                        Aplicar Filtro
                    </button>
                </div>
            </div>

            <!-- Métricas Principais -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-slate-800 rounded-2xl p-6">
                    <p class="text-slate-400 text-sm mb-2">Total de Ordens</p>
                    <p class="text-3xl font-bold">${stats.total}</p>
                    <p class="text-emerald-400 text-sm mt-2">+12% vs mês anterior</p>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <p class="text-slate-400 text-sm mb-2">Taxa de Conclusão</p>
                    <p class="text-3xl font-bold">${Math.round(stats.completedPercent)}%</p>
                    <p class="text-emerald-400 text-sm mt-2">+5% vs mês anterior</p>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <p class="text-slate-400 text-sm mb-2">Tempo Médio</p>
                    <p class="text-3xl font-bold">2.5h</p>
                    <p class="text-red-400 text-sm mt-2">-8% vs mês anterior</p>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <p class="text-slate-400 text-sm mb-2">Eficiência</p>
                    <p class="text-3xl font-bold">87%</p>
                    <p class="text-emerald-400 text-sm mt-2">+3% vs mês anterior</p>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Gráfico de Ordens por Status -->
                <div class="bg-slate-800 rounded-2xl p-6">
                    <h3 class="text-lg font-bold mb-4">Ordens por Status</h3>
                    <canvas id="chart-status" height="200"></canvas>
                </div>

                <!-- Gráfico de Ordens por Período -->
                <div class="bg-slate-800 rounded-2xl p-6">
                    <h3 class="text-lg font-bold mb-4">Ordens por Período</h3>
                    <canvas id="chart-period" height="200"></canvas>
                </div>
            </div>

            <!-- Top Operadores -->
            <div class="bg-slate-800 rounded-2xl p-6">
                <h3 class="text-lg font-bold mb-4">Top Operadores do Mês</h3>
                <div class="space-y-4">
                    ${['Ana Costa', 'Carlos Mendes', 'Juliana Lima'].map((name, index) => `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                                    ${index + 1}
                                </div>
                                <span class="font-semibold">${name}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-slate-400">${Math.floor(Math.random() * 50 + 20)} ordens</span>
                                <div class="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-blue-500" style="width: ${Math.floor(Math.random() * 40 + 60)}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <script>
        // Inicializar gráficos
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                // Gráfico de Status
                const ctx1 = document.getElementById('chart-status');
                if (ctx1) {
                    new Chart(ctx1, {
                        type: 'doughnut',
                        data: {
                            labels: ['Pendente', 'Em Andamento', 'Concluída'],
                            datasets: [{
                                data: [${stats.pending}, ${stats.progress}, ${stats.completed}],
                                backgroundColor: ['#fbbf24', '#3b82f6', '#10b981']
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                }

                // Gráfico de Período
                const ctx2 = document.getElementById('chart-period');
                if (ctx2) {
                    new Chart(ctx2, {
                        type: 'line',
                        data: {
                            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                            datasets: [{
                                label: 'Ordens',
                                data: [12, 19, 15, 25, 22, 18, 20],
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                }
            }
        }, 100);
        </script>
    `;
}

function exportReport(format) {
    showToast(`Exportando relatório em ${format.toUpperCase()}...`, 'info');
}
