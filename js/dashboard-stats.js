<!-- ============================================
     CONTROLE DE ORDENS PRO - DASHBOARD PAGE
     CONTRASTE MELHORADO PARA MODO ESCURO
     ============================================ -->

<!-- DASHBOARD PAGE -->
<div id="dashboard" class="page active p-6 max-w-[1600px] mx-auto space-y-6">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 animate-slide-up">
        <div>
            <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-1 bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full animate-pulse border border-emerald-500/30">
                    Sistema Online
                </span>
                <span class="text-slate-400 dark:text-slate-500 text-sm" id="current-time">14:45</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Dashboard <span class="text-gradient">Controle de Ordens</span>
            </h2>
            <p class="text-slate-500 dark:text-slate-400 mt-1">Visão geral em tempo real do sistema</p>
        </div>
        
        <div class="flex gap-3">
            <button onclick="showModal('new-order')" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group">
                <span class="material-symbols-rounded group-hover:rotate-90 transition-transform duration-300">add</span>
                Nova Ordem
            </button>
            <button onclick="refreshDashboard()" class="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:rotate-180" id="refresh-btn">
                <span class="material-symbols-rounded">refresh</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <!-- CARD 1: A SEPARAR - MELHOR CONTRASTE -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 hover-lift cursor-pointer group" onclick="showPage('ordens'); setOrdensTab('pending');">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">A Separar</p>
                    <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-1 counter" data-target="12" id="stat-a-separar">0</h3>
                </div>
                <!-- ✅ ID MANTIDO -->
                <div class="relative w-16 h-16" id="progress-a-separar">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700"></circle>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="175.84" stroke-dashoffset="70.34" class="text-amber-500 dark:text-amber-400 progress-ring-circle"></circle>
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-amber-600 dark:text-amber-400">60%</span>
                </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span class="material-symbols-rounded text-lg">trending_up</span>
                    +2
                </span>
                <span class="text-slate-500 dark:text-slate-400">vs ontem</span>
            </div>
        </div>

        <!-- CARD 2: EM SEPARAÇÃO - MELHOR CONTRASTE -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 hover-lift cursor-pointer group" onclick="showPage('ordens'); setOrdensTab('progress');">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Em Separação</p>
                    <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-1 counter" data-target="5" id="stat-em-separacao">0</h3>
                </div>
                <!-- ✅ ID MANTIDO -->
                <div class="relative w-16 h-16" id="progress-em-separacao">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700"></circle>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="175.84" stroke-dashoffset="131.88" class="text-blue-500 dark:text-blue-400 progress-ring-circle"></circle>
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">25%</span>
                </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <div class="flex -space-x-2">
                    <img class="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-slate-300 dark:ring-slate-600" src="https://ui-avatars.com/api/?name=M&background=4f46e5&color=fff" alt="">
                    <img class="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-slate-300 dark:ring-slate-600" src="https://ui-avatars.com/api/?name=A&background=10b981&color=fff" alt="">
                </div>
                <span class="text-slate-500 dark:text-slate-400 text-xs font-medium">2 operadores ativos</span>
            </div>
        </div>

        <!-- CARD 3: CONCLUÍDAS HOJE - MELHOR CONTRASTE -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 hover-lift cursor-pointer group" onclick="showPage('ordens'); setOrdensTab('completed');">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Concluídas Hoje</p>
                    <h3 class="text-4xl font-bold text-slate-900 dark:text-white mt-1 counter" data-target="8" id="stat-concluidas-hoje">0</h3>
                </div>
                <!-- ✅ ID MANTIDO -->
                <div class="relative w-16 h-16" id="progress-concluidas">
                    <svg class="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" class="text-slate-200 dark:text-slate-700"></circle>
                        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="175.84" stroke-dashoffset="105.50" class="text-emerald-500 dark:text-emerald-400 progress-ring-circle"></circle>
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400">40%</span>
                </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span class="material-symbols-rounded text-lg">check_circle</span>
                    85% eficiência
                </span>
            </div>
        </div>

        <!-- CARD 4: TOTAL - GRADIENTE MELHORADO -->
        <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-500 dark:via-primary-600 dark:to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/40 dark:shadow-primary-500/30 hover-lift cursor-pointer group border-2 border-primary-500/30" onclick="showPage('ordens'); setOrdensTab('all');">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-sm font-semibold text-white/90 mb-1">Total de Ordens</p>
                    <h3 class="text-4xl font-bold mt-1 counter text-white" data-target="61" id="stat-total">0</h3>
                </div>
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                    <span class="material-symbols-rounded text-4xl">inventory</span>
                </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-white/90">
                <span class="flex items-center gap-1 font-semibold text-white">
                    <span class="material-symbols-rounded text-lg">analytics</span>
                    +12%
                </span>
                <span>este mês</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 animate-slide-up" style="animation-delay: 0.2s">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Desempenho da Semana</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Comparativo de ordens processadas</p>
                </div>
                <div class="flex gap-2">
                    <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">Semana</button>
                    <button class="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Mês</button>
                </div>
            </div>
            <div class="h-80">
                <canvas id="performanceChart"></canvas>
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 animate-slide-up" style="animation-delay: 0.3s">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Distribuição</h3>
                <div class="h-48 relative">
                    <canvas id="distributionChart"></canvas>
                    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span class="text-3xl font-bold text-slate-900 dark:text-white">61</span>
                        <span class="text-xs text-slate-600 dark:text-slate-400 font-medium">Total</span>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 animate-slide-up" style="animation-delay: 0.4s">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Ações Rápidas</h3>
                <div class="space-y-2">
                    <button onclick="showModal('new-order')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                        <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span class="material-symbols-rounded">add</span>
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Nova Ordem</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">Criar ordem de separação</p>
                        </div>
                        <span class="material-symbols-rounded ml-auto text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </button>
                    
                    <button onclick="showPage('kanban')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                        <div class="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span class="material-symbols-rounded">view_column</span>
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-semibold text-slate-900 dark:text-white">Ver Kanban</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">Visualização em colunas</p>
                        </div>
                        <span class="material-symbols-rounded ml-auto text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 overflow-hidden animate-slide-up" style="animation-delay: 0.5s">
        <div class="px-6 py-4 border-b-2 border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ordens Recentes</h3>
            <button onclick="showPage('ordens')" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">Ver todas</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-slate-100 dark:bg-slate-800/70">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Produto</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Progresso</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Prazo</th>
                        <th class="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-slate-100 dark:divide-slate-700" id="recent-orders-table">
                </tbody>
            </table>
        </div>
    </div>
</div>
