// Página: Configurações (COMPLETA)
function renderSettingsPage() {
    return `
        <div class="p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-bold">Configurações</h2>
                <p class="text-slate-400 mt-1">Gerencie as configurações do sistema</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Menu Lateral -->
                <div class="bg-slate-800 rounded-2xl p-4">
                    <nav class="space-y-1">
                        <button onclick="showSettingsTab('general')" 
                                class="settings-tab-btn active w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-700"
                                data-tab="general">
                            <span class="material-symbols-rounded">settings</span>
                            <span class="font-semibold">Geral</span>
                        </button>
                        <button onclick="showSettingsTab('notifications')" 
                                class="settings-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-700"
                                data-tab="notifications">
                            <span class="material-symbols-rounded">notifications</span>
                            <span class="font-semibold">Notificações</span>
                        </button>
                        <button onclick="showSettingsTab('appearance')" 
                                class="settings-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-700"
                                data-tab="appearance">
                            <span class="material-symbols-rounded">palette</span>
                            <span class="font-semibold">Aparência</span>
                        </button>
                        <button onclick="showSettingsTab('security')" 
                                class="settings-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-700"
                                data-tab="security">
                            <span class="material-symbols-rounded">lock</span>
                            <span class="font-semibold">Segurança</span>
                        </button>
                        <button onclick="showSettingsTab('integrations')" 
                                class="settings-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-slate-700"
                                data-tab="integrations">
                            <span class="material-symbols-rounded">extension</span>
                            <span class="font-semibold">Integrações</span>
                        </button>
                    </nav>
                </div>

                <!-- Conteúdo -->
                <div class="lg:col-span-2">
                    <!-- Tab: Geral -->
                    <div id="settings-general" class="settings-tab-content">
                        <div class="bg-slate-800 rounded-2xl p-6">
                            <h3 class="text-lg font-bold mb-6">Configurações Gerais</h3>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Nome da Empresa</label>
                                    <input type="text" value="Movimentação Vetore" 
                                           class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Fuso Horário</label>
                                    <select class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                        <option>América/São_Paulo (UTC-3)</option>
                                        <option>América/Nova_York (UTC-5)</option>
                                        <option>Europa/Londres (UTC+0)</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Idioma</label>
                                    <select class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                        <option>Português (Brasil)</option>
                                        <option>English (US)</option>
                                        <option>Español</option>
                                    </select>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-medium">Modo de Manutenção</p>
                                        <p class="text-sm text-slate-400">Desabilitar acesso ao sistema</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" class="sr-only peer">
                                        <div class="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <button class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Notificações -->
                    <div id="settings-notifications" class="settings-tab-content hidden">
                        <div class="bg-slate-800 rounded-2xl p-6">
                            <h3 class="text-lg font-bold mb-6">Notificações</h3>
                            
                            <div class="space-y-4">
                                ${['Nova ordem criada', 'Ordem concluída', 'Status alterado', 'Comentários', 'Menções'].map(item => `
                                    <div class="flex items-center justify-between py-3 border-b border-slate-700">
                                        <div>
                                            <p class="font-medium">${item}</p>
                                            <p class="text-sm text-slate-400">Receber notificações por email</p>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked class="sr-only peer">
                                            <div class="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Aparência -->
                    <div id="settings-appearance" class="settings-tab-content hidden">
                        <div class="bg-slate-800 rounded-2xl p-6">
                            <h3 class="text-lg font-bold mb-6">Aparência</h3>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium mb-3">Tema</label>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="bg-slate-700 rounded-lg p-4 cursor-pointer border-2 border-blue-500">
                                            <div class="w-full h-20 bg-slate-950 rounded mb-2"></div>
                                            <p class="text-center text-sm font-semibold">Escuro</p>
                                        </div>
                                        <div class="bg-slate-700 rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-slate-500">
                                            <div class="w-full h-20 bg-white rounded mb-2"></div>
                                            <p class="text-center text-sm font-semibold">Claro</p>
                                        </div>
                                        <div class="bg-slate-700 rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-slate-500">
                                            <div class="w-full h-20 bg-gradient-to-br from-slate-950 to-white rounded mb-2"></div>
                                            <p class="text-center text-sm font-semibold">Auto</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Cor de Destaque</label>
                                    <div class="flex gap-3">
                                        ${['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => `
                                            <div class="w-10 h-10 rounded-full cursor-pointer border-2 ${color === '#3b82f6' ? 'border-white' : 'border-transparent'}" 
                                                 style="background: ${color}"></div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Segurança -->
                    <div id="settings-security" class="settings-tab-content hidden">
                        <div class="bg-slate-800 rounded-2xl p-6">
                            <h3 class="text-lg font-bold mb-6">Segurança</h3>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Senha Atual</label>
                                    <input type="password" 
                                           class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Nova Senha</label>
                                    <input type="password" 
                                           class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                                    <input type="password" 
                                           class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
                                </div>

                                <button class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                                    Alterar Senha
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Integrações -->
                    <div id="settings-integrations" class="settings-tab-content hidden">
                        <div class="bg-slate-800 rounded-2xl p-6">
                            <h3 class="text-lg font-bold mb-6">Integrações</h3>
                            
                            <div class="space-y-4">
                                <div class="bg-slate-700 rounded-lg p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                                                <span class="material-symbols-rounded text-white">database</span>
                                            </div>
                                            <div>
                                                <p class="font-semibold">Supabase</p>
                                                <p class="text-sm text-slate-400">Conectado</p>
                                            </div>
                                        </div>
                                        <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Ativo</span>
                                    </div>
                                </div>

                                <div class="bg-slate-700 rounded-lg p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                                                <span class="material-symbols-rounded text-white">email</span>
                                            </div>
                                            <div>
                                                <p class="font-semibold">Email (SMTP)</p>
                                                <p class="text-sm text-slate-400">Não configurado</p>
                                            </div>
                                        </div>
                                        <button class="px-3 py-1 bg-blue-600 rounded text-xs font-semibold">Configurar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showSettingsTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.settings-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-slate-700');
    });
    
    // Mostrar tab selecionada
    document.getElementById('settings-' + tabName).classList.remove('hidden');
    
    // Adicionar active no botão
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'bg-slate-700');
}
