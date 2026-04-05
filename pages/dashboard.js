// Página: Dashboard - FIEL AO ORIGINAL
async function renderDashboardPage() {
    const stats = await statsModule.getDashboardStats();
    
    return `
        <div class="p-6 space-y-6">
            <!-- Cards de Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total de Ordens -->
                <div class="bg-slate-800 rounded-2xl p-6 hover-lift">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-400 text-2xl">receipt_long</span>
                        </div>
                        <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">+12%</span>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-slate-400">Total de Ordens</p>
                        <p class="text-3xl font-bold">${stats.total}</p>
                    </div>
                </div>

                <!-- Pendentes -->
                <div class="bg-slate-800 rounded-2xl p-6 hover-lift">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-amber-400 text-2xl">pending</span>
                        </div>
                        <span class="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">Ativas</span>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-slate-400">Pendentes</p>
                        <p class="text-3xl font-bold text-amber-400">${stats.pending}</p>
                    </div>
                </div>

                <!-- Em Andamento -->
                <div class="bg-slate-800 rounded-2xl p-6 hover-lift">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-400 text-2xl">sync</span>
                        </div>
                        <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">Agora</span>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-slate-400">Em Andamento</p>
                        <p class="text-3xl font-bold text-blue-400">${stats.progress}</p>
                    </div>
                </div>

                <!-- Concluídas -->
                <div class="bg-slate-800 rounded-2xl p-6 hover-lift">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-emerald-400 text-2xl">check_circle</span>
                        </div>
                        <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Hoje</span>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-slate-400">Concluídas</p>
                        <p class="text-3xl font-bold text-emerald-400">${stats.completed}</p>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Gráfico de Ordens -->
                <div class="bg-slate-800 rounded-2xl p-6">
                    <h3 class="text-lg font-bold mb-4">Ordens por Status</h3>
                    <canvas id="chart-status" height="200"></canvas>
                </div>

                <!-- Gráfico de Tendência -->
                <div class="bg-slate-800 rounded-2xl p-6">
                    <h3 class="text-lg font-bold mb-4">Tendência Semanal</h3>
                    <canvas id="chart-trend" height="200"></canvas>
                </div>
            </div>

            <!-- Ordens Recentes -->
            <div class="bg-slate-800 rounded-2xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold">Ordens Recentes</h3>
                    <button onclick="showPage('orders')" class="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                        Ver todas →
                    </button>
                </div>
                
                <div id="recent-orders">
                    <p class="text-center text-slate-400 py-8">Carregando ordens...</p>
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
                                backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { color: '#cbd5e1', padding: 15 }
                                }
                            }
                        }
                    });
                }

                // Gráfico de Tendência
                const ctx2 = document.getElementById('chart-trend');
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
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { color: '#cbd5e1' },
                                    grid: { color: '#334155' }
                                },
                                x: {
                                    ticks: { color: '#cbd5e1' },
                                    grid: { display: false }
                                }
                            }
                        }
                    });
                }
            }
            
            // Carregar ordens recentes
            loadRecentOrders();
        }, 100);
        
        async function loadRecentOrders() {
            const orders = await ordersModule.fetchAll();
            const recent = orders.slice(0, 5);
            const container = document.getElementById('recent-orders');
            
            if (recent.length === 0) {
                container.innerHTML = '<p class="text-center text-slate-400 py-8">Nenhuma ordem encontrada</p>';
                return;
            }
            
            container.innerHTML = recent.map(order => `
                <div class="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-rounded text-blue-400">receipt</span>
                        </div>
                        <div>
                            <p class="font-semibold">${order.id}</p>
                            <p class="text-sm text-slate-400">${order.client || 'Cliente'}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}">
                            ${getStatusLabel(order.status)}
                        </span>
                        <p class="text-xs text-slate-400 mt-1">${formatDate(order.created_at)}</p>
                    </div>
                </div>
            `).join('');
        }
        </script>
    `;
}
