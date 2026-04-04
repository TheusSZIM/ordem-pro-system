// Página: Dashboard
async function renderDashboardPage() {
    const orders = await ordersModule.fetchAll();
    const stats = ordersModule.getStats();
    
    return `
        <div class="p-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-slate-400 text-sm font-medium">A Separar</h3>
                            <p id="stat-pending" class="text-white text-3xl font-bold mt-1">${stats.pending}</p>
                            <p class="text-emerald-400 text-sm mt-1">
                                <span class="inline-flex items-center gap-1">
                                    <span class="material-symbols-rounded text-xs">trending_up</span>vs ontem
                                </span>
                            </p>
                        </div>
                        <div class="progress-ring-container" style="width: 80px; height: 80px;">
                            <svg width="80" height="80" style="transform: rotate(-90deg);">
                                <circle cx="40" cy="40" r="32" stroke="rgba(251, 191, 36, 0.2)" stroke-width="8" fill="none"/>
                                <circle id="progress-pending" cx="40" cy="40" r="32" stroke="#fbbf24" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="201" stroke-dashoffset="201"/>
                            </svg>
                            <div class="progress-ring-text text-amber-400" id="percent-pending">${stats.pendingPercent}%</div>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-slate-400 text-sm font-medium">Em Separação</h3>
                            <p id="stat-progress" class="text-white text-3xl font-bold mt-1">${stats.progress}</p>
                            <p class="text-slate-400 text-sm mt-1">operadores ativos</p>
                        </div>
                        <div class="progress-ring-container" style="width: 80px; height: 80px;">
                            <svg width="80" height="80" style="transform: rotate(-90deg);">
                                <circle cx="40" cy="40" r="32" stroke="rgba(59, 130, 246, 0.2)" stroke-width="8" fill="none"/>
                                <circle id="progress-progress" cx="40" cy="40" r="32" stroke="#3b82f6" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="201" stroke-dashoffset="201"/>
                            </svg>
                            <div class="progress-ring-text text-blue-400" id="percent-progress">${stats.progressPercent}%</div>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-2xl p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-slate-400 text-sm font-medium">Concluídas Hoje</h3>
                            <p id="stat-completed" class="text-white text-3xl font-bold mt-1">${stats.completed}</p>
                            <p class="text-emerald-400 text-sm mt-1">
                                <span class="inline-flex items-center gap-1">
                                    <span class="material-symbols-rounded text-xs">check_circle</span>eficiência
                                </span>
                            </p>
                        </div>
                        <div class="progress-ring-container" style="width: 80px; height: 80px;">
                            <svg width="80" height="80" style="transform: rotate(-90deg);">
                                <circle cx="40" cy="40" r="32" stroke="rgba(16, 185, 129, 0.2)" stroke-width="8" fill="none"/>
                                <circle id="progress-completed" cx="40" cy="40" r="32" stroke="#10b981" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="201" stroke-dashoffset="201"/>
                            </svg>
                            <div class="progress-ring-text text-emerald-400" id="percent-completed">${stats.completedPercent}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800 rounded-2xl p-6">
                <h3 class="text-lg font-bold mb-4">Ordens Recentes</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="border-b border-slate-700">
                            <tr>
                                <th class="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Produto</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th class="px-4 py-3 text-left text-sm font-semibold">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.slice(0, 10).map(order => `
                                <tr class="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td class="px-4 py-3 font-mono text-sm text-blue-400">${order.id}</td>
                                    <td class="px-4 py-3">${order.client || '-'}</td>
                                    <td class="px-4 py-3">${order.product || '-'}</td>
                                    <td class="px-4 py-3"><span class="px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}">${getStatusLabel(order.status)}</span></td>
                                    <td class="px-4 py-3 text-sm text-slate-400">${formatDate(order.created_at)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function initDashboard() {
    const stats = ordersModule.getStats();
    statsModule.updateStatsCards(stats);
}
