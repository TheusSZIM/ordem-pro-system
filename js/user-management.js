// ============================================================
// USER MANAGEMENT — js/user-management.js
// Gestão de usuários (Admin/Gestor)
// E-mails virtuais: nome@ordemgro.local
// ============================================================

const NIVEIS = {
    1: { label:'Operador',    cor:'#64748b', bg:'rgba(100,116,139,.15)' },
    2: { label:'Coordenador', cor:'#3b82f6', bg:'rgba(59,130,246,.15)'  },
    3: { label:'Gestor',      cor:'#8b5cf6', bg:'rgba(139,92,246,.15)'  },
    4: { label:'Admin',       cor:'#ef4444', bg:'rgba(239,68,68,.15)'   },
};

const SENHA_PADRAO = 'Ordem@2024';

/* ── Carrega lista de usuários ── */
async function loadUsuarios() {
    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('id, nome, email, nivel, ativo, cargo, celula, created_at, last_login')
            .order('nivel', { ascending: false })
            .order('nome');
        if (error) throw error;
        return data || [];
    } catch(e) {
        console.error('Erro ao carregar usuários:', e);
        return [];
    }
}

/* ── Renderiza tabela de equipe ── */
async function renderEquipe() {
    const tbody = document.getElementById('equipe-tbody');
    const count = document.getElementById('equipe-count');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400">
        <span class="material-symbols-rounded text-3xl animate-spin block mb-2">progress_activity</span>Carregando...</td></tr>`;

    const usuarios = await loadUsuarios();
    if (count) count.textContent = usuarios.length;

    if (!usuarios.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-slate-400">Nenhum usuário encontrado</td></tr>`;
        return;
    }

    const currentUser = window.auth?.getUser?.() || {};
    const currentNivel = currentUser.nivel || 1;

    tbody.innerHTML = usuarios.map(u => {
        const nv   = NIVEIS[u.nivel] || NIVEIS[1];
        const ativo = u.ativo !== false;
        const isVirtual = u.email?.includes('@ordemgro.local');
        const lastLogin = u.last_login
            ? new Date(u.last_login).toLocaleDateString('pt-BR') + ' ' +
              new Date(u.last_login).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
            : 'Nunca';

        return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!ativo?'opacity-50':''}">
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
                         style="background:${nv.cor}">
                        ${u.nome?.charAt(0).toUpperCase()||'?'}
                    </div>
                    <div>
                        <p class="font-semibold text-sm text-slate-900 dark:text-white">${u.nome||'—'}</p>
                        <p class="text-xs text-slate-400 flex items-center gap-1">
                            ${isVirtual?'<span title="E-mail virtual">🔒</span>':''}
                            ${u.email||'—'}
                        </p>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" style="background:${nv.bg};color:${nv.cor}">
                    ${nv.label}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">${u.cargo||'—'}</td>
            <td class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">${u.celula||'—'}</td>
            <td class="px-4 py-3 text-xs text-slate-400">${lastLogin}</td>
            <td class="px-4 py-3 text-right">
                ${currentNivel >= 3 ? `
                <div class="flex items-center justify-end gap-1">
                    <button onclick="abrirEditarUsuario('${u.id}')"
                        class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Editar">
                        <span class="material-symbols-rounded text-lg">edit</span>
                    </button>
                    <button onclick="resetarSenha('${u.id}','${u.nome}')"
                        class="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-600 transition-colors" title="Resetar senha">
                        <span class="material-symbols-rounded text-lg">lock_reset</span>
                    </button>
                    ${currentNivel >= 4 ? `
                    <button onclick="toggleUsuarioAtivo('${u.id}',${ativo},'${u.nome}')"
                        class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors" title="${ativo?'Desativar':'Ativar'}">
                        <span class="material-symbols-rounded text-lg">${ativo?'person_off':'person_check'}</span>
                    </button>` : ''}
                </div>` : '—'}
            </td>
        </tr>`;
    }).join('');
}

/* ── Cria / Edita usuário ── */
function abrirNovoUsuario() {
    abrirFormUsuario(null);
}

async function abrirEditarUsuario(id) {
    const { data } = await supabaseClient.from('usuarios').select('*').eq('id', id).single();
    abrirFormUsuario(data);
}

function abrirFormUsuario(u) {
    const existing = document.getElementById('form-usuario-modal');
    if (existing) existing.remove();

    const isEdit = !!u;
    const titulo = isEdit ? 'Editar Usuário' : 'Novo Usuário';

    /* Gera e-mail virtual a partir do nome */
    function gerarEmailVirtual(nome) {
        if (!nome) return '';
        return nome.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
            + '@ordemgro.local';
    }

    const html = `
    <div id="form-usuario-modal" class="fixed inset-0 z-[95] hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="fecharFormUsuario()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div id="form-usuario-content"
                 class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto"
                 style="transform:scale(.95);opacity:0;transition:all .25s;">

                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <span class="material-symbols-rounded text-primary-600">person_add</span>
                        </div>
                        <h3 class="font-bold text-slate-900 dark:text-white">${titulo}</h3>
                    </div>
                    <button onclick="fecharFormUsuario()" class="text-slate-400 hover:text-slate-600">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Nome completo *</label>
                            <input id="fu-nome" type="text" value="${u?.nome||''}"
                                placeholder="Ex: João Silva"
                                oninput="if(!document.getElementById('fu-email-manual').checked){ document.getElementById('fu-email').value = gerarEmailVirtualUI(this.value); }"
                                class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 dark:text-white">
                        </div>

                        <div class="col-span-2">
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="text-xs font-semibold text-slate-500">E-mail / Login *</label>
                                <label class="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                                    <input type="checkbox" id="fu-email-manual" onchange="toggleEmailManual(this.checked)"
                                        class="w-3.5 h-3.5 rounded">
                                    Definir manualmente
                                </label>
                            </div>
                            <div class="relative">
                                <input id="fu-email" type="text"
                                    value="${u?.email||''}"
                                    placeholder="gerado automaticamente do nome"
                                    readonly
                                    class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 dark:text-white read-only:opacity-70">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" id="fu-email-hint">@ordemgro.local</span>
                            </div>
                            ${!isEdit ? `<p class="text-xs text-slate-400 mt-1">
                                🔒 Senha padrão: <strong class="text-slate-600 dark:text-slate-300">${SENHA_PADRAO}</strong> — usuário deve trocar no primeiro acesso</p>` : ''}
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Nível de acesso *</label>
                            <select id="fu-nivel"
                                class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 dark:text-white">
                                ${Object.entries(NIVEIS).map(([n,nv])=>
                                    `<option value="${n}" ${u?.nivel==n?'selected':''}>${n} — ${nv.label}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Cargo</label>
                            <input id="fu-cargo" type="text" value="${u?.cargo||''}"
                                placeholder="Ex: Separador"
                                class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 dark:text-white">
                        </div>

                        <div class="col-span-2">
                            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Célula / Setor</label>
                            <input id="fu-celula" type="text" value="${u?.celula||''}"
                                placeholder="Ex: Linha A"
                                class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500 dark:text-white">
                        </div>
                    </div>

                    <!-- Nível info -->
                    <div id="nivel-info" class="p-3 rounded-xl text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                        Selecione um nível para ver as permissões
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                    <button onclick="fecharFormUsuario()"
                        class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                    <button onclick="salvarUsuario('${u?.id||''}')"
                        class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-rounded text-sm">save</span>
                        ${isEdit ? 'Salvar' : 'Criar Usuário'}
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('form-usuario-modal');
    const cont  = document.getElementById('form-usuario-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{ cont.style.transform='scale(1)'; cont.style.opacity='1'; });

    // Atualiza info de nível ao mudar select
    document.getElementById('fu-nivel').addEventListener('change', atualizarNivelInfo);
    atualizarNivelInfo();
    document.getElementById('fu-nome').focus();
}

window.gerarEmailVirtualUI = function(nome) {
    return nome.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/\s+/g,'.').replace(/[^a-z0-9.]/g,'')
        + '@ordemgro.local';
};

window.toggleEmailManual = function(manual) {
    const el = document.getElementById('fu-email');
    const hint = document.getElementById('fu-email-hint');
    el.readOnly = !manual;
    el.style.opacity = manual ? '1' : '0.7';
    if (hint) hint.style.display = manual ? 'none' : '';
    if (!manual) {
        const nome = document.getElementById('fu-nome').value;
        el.value = window.gerarEmailVirtualUI(nome);
    }
};

function atualizarNivelInfo() {
    const n = parseInt(document.getElementById('fu-nivel')?.value||1);
    const infos = {
        1:'👷 Operador: visualiza ordens próprias, inicia separação, registra entrega.',
        2:'📋 Coordenador: acesso completo às ordens, visualiza equipe, sem gestão de usuários.',
        3:'📊 Gestor: tudo do Coordenador + gestão de equipe e relatórios.',
        4:'🔑 Admin: acesso total, cria e gerencia usuários.',
    };
    const el = document.getElementById('nivel-info');
    if (el) el.textContent = infos[n] || '';
}

function fecharFormUsuario() {
    const modal = document.getElementById('form-usuario-modal');
    const cont  = document.getElementById('form-usuario-content');
    if (!modal) return;
    cont.style.transform='scale(.95)'; cont.style.opacity='0';
    setTimeout(()=>{ modal.remove(); }, 250);
}

async function salvarUsuario(id) {
    const nome   = document.getElementById('fu-nome').value.trim();
    const email  = document.getElementById('fu-email').value.trim();
    const nivel  = parseInt(document.getElementById('fu-nivel').value);
    const cargo  = document.getElementById('fu-cargo').value.trim();
    const celula = document.getElementById('fu-celula').value.trim();

    if (!nome)  { showToast('Informe o nome', 'warning'); return; }
    if (!email) { showToast('Informe o e-mail', 'warning'); return; }

    const btn = document.querySelector('#form-usuario-modal button[onclick*="salvarUsuario"]');
    if (btn) { btn.disabled=true; btn.textContent='Salvando...'; }

    try {
        const payload = { nome, email, nivel, cargo, celula };

        if (id) {
            // Editar
            const { error } = await supabaseClient.from('usuarios').update(payload).eq('id', id);
            if (error) throw error;
            showToast('✅ Usuário atualizado!', 'success');
        } else {
            // Criar novo — senha padrão
            payload.senha = SENHA_PADRAO;
            payload.ativo = true;
            const { error } = await supabaseClient.from('usuarios').insert(payload);
            if (error) throw error;
            showToast(`✅ Usuário criado! Senha padrão: ${SENHA_PADRAO}`, 'success');
        }

        fecharFormUsuario();
        await renderEquipe();
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled=false; }
    }
}

/* ── Resetar senha para o padrão ── */
async function resetarSenha(id, nome) {
    if (!confirm(`Resetar senha de "${nome}" para a senha padrão?\n\nSenha padrão: ${SENHA_PADRAO}`)) return;
    try {
        const { error } = await supabaseClient.from('usuarios')
            .update({ senha: SENHA_PADRAO }).eq('id', id);
        if (error) throw error;
        showToast(`✅ Senha de ${nome} resetada para o padrão`, 'success');
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    }
}

/* ── Ativar/Desativar ── */
async function toggleUsuarioAtivo(id, ativo, nome) {
    const acao = ativo ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${acao} o usuário "${nome}"?`)) return;
    try {
        const { error } = await supabaseClient.from('usuarios')
            .update({ ativo: !ativo }).eq('id', id);
        if (error) throw error;
        showToast(`✅ Usuário ${ativo?'desativado':'ativado'}`, 'success');
        await renderEquipe();
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    }
}

window.renderEquipe          = renderEquipe;
window.abrirNovoUsuario      = abrirNovoUsuario;
window.abrirEditarUsuario    = abrirEditarUsuario;
window.fecharFormUsuario     = fecharFormUsuario;
window.salvarUsuario         = salvarUsuario;
window.resetarSenha          = resetarSenha;
window.toggleUsuarioAtivo    = toggleUsuarioAtivo;

document.addEventListener('pageChanged', e => {
    if (e.detail === 'equipe') renderEquipe();
});
console.log('✅ user-management.js carregado');
