// ============================================================
// CONFIGURAÇÕES — js/configuracoes.js
// Troca de senha + preferências do usuário logado
// ============================================================

async function renderConfiguracoes() {
    const user = window.auth?.getUser?.() || {};
    if (!user.id) return;

    // Preenche dados do perfil
    setVal('cfg-nome',   user.nome  || '');
    setVal('cfg-email',  user.email || '');
    setVal('cfg-cargo',  user.cargo || '');
    setVal('cfg-celula', user.celula|| '');

    const isVirtual = (user.email||'').includes('@ordemgro.local');
    const hint = document.getElementById('cfg-email-hint');
    if (hint) hint.textContent = isVirtual ? '🔒 E-mail virtual (interno)' : '';

    // Nível de acesso
    const nivelMap = {1:'Operador',2:'Coordenador',3:'Gestor',4:'Admin'};
    const nivelEl = document.getElementById('cfg-nivel-label');
    if (nivelEl) nivelEl.textContent = nivelMap[user.nivel] || '—';

    // Limpa formulário de senha
    ['cfg-senha-atual','cfg-nova-senha','cfg-confirma-senha'].forEach(id => setVal(id,''));
    atualizarForcaSenha('');
}

/* ── Salvar perfil (nome, cargo, celula) ── */
async function salvarPerfil() {
    const user = window.auth?.getUser?.();
    if (!user?.id) return;

    const nome   = getVal('cfg-nome').trim();
    const cargo  = getVal('cfg-cargo').trim();
    const celula = getVal('cfg-celula').trim();

    if (!nome) { showToast('Informe seu nome', 'warning'); return; }

    const btn = document.getElementById('btn-salvar-perfil');
    if (btn) { btn.disabled=true; btn.textContent='Salvando...'; }

    try {
        const { error } = await supabaseClient.from('usuarios')
            .update({ nome, cargo, celula }).eq('id', user.id);
        if (error) throw error;

        // Atualiza cache local do auth
        if (window.auth?.updateUserCache) window.auth.updateUserCache({ nome, cargo, celula });
        else {
            const s = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
            if (s.user) { s.user.nome=nome; s.user.cargo=cargo; s.user.celula=celula; }
            localStorage.setItem('ordem_pro_session', JSON.stringify(s));
        }

        showToast('✅ Perfil atualizado!', 'success');

        // Atualiza header se existir
        const headerNome = document.getElementById('user-display-name');
        if (headerNome) headerNome.textContent = nome;
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled=false; btn.textContent='Salvar Perfil'; }
    }
}

/* ── Troca de senha ── */
async function trocarSenha() {
    const user = window.auth?.getUser?.();
    if (!user?.id) return;

    const atual    = getVal('cfg-senha-atual');
    const nova     = getVal('cfg-nova-senha');
    const confirma = getVal('cfg-confirma-senha');

    if (!atual)          { showToast('Digite a senha atual', 'warning'); return; }
    if (nova.length < 6) { showToast('A nova senha deve ter pelo menos 6 caracteres', 'warning'); return; }
    if (nova !== confirma){ showToast('As senhas não conferem', 'warning'); return; }

    const btn = document.getElementById('btn-trocar-senha');
    if (btn) { btn.disabled=true; btn.textContent='Verificando...'; }

    try {
        // Verifica senha atual
        const { data: rows, error: errBusca } = await supabaseClient
            .from('usuarios').select('senha').eq('id', user.id).single();
        if (errBusca) throw errBusca;
        if (rows.senha !== atual) {
            showToast('Senha atual incorreta', 'error');
            document.getElementById('cfg-senha-atual')?.classList.add('border-red-500');
            return;
        }

        // Atualiza
        const { error } = await supabaseClient.from('usuarios')
            .update({ senha: nova }).eq('id', user.id);
        if (error) throw error;

        // Limpa campos
        ['cfg-senha-atual','cfg-nova-senha','cfg-confirma-senha'].forEach(id => setVal(id,''));
        atualizarForcaSenha('');
        showToast('✅ Senha alterada com sucesso!', 'success');
    } catch(e) {
        showToast('Erro: ' + e.message, 'error');
    } finally {
        if (btn) { btn.disabled=false; btn.textContent='Alterar Senha'; }
    }
}

/* ── Indicador de força de senha ── */
function atualizarForcaSenha(senha) {
    const bar   = document.getElementById('forca-bar');
    const label = document.getElementById('forca-label');
    if (!bar || !label) return;

    let score = 0;
    if (senha.length >= 6)  score++;
    if (senha.length >= 10) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;

    const levels = [
        { pct:'0%',    cor:'#ef4444', txt:''          },
        { pct:'25%',   cor:'#ef4444', txt:'Fraca'     },
        { pct:'50%',   cor:'#f59e0b', txt:'Regular'   },
        { pct:'75%',   cor:'#3b82f6', txt:'Boa'       },
        { pct:'100%',  cor:'#22c55e', txt:'Forte'     },
        { pct:'100%',  cor:'#22c55e', txt:'Muito forte'},
    ];
    const l = levels[Math.min(score, levels.length-1)];
    bar.style.width     = senha ? l.pct : '0%';
    bar.style.background = l.cor;
    label.textContent   = l.txt;
    label.style.color   = l.cor;
}

function getVal(id) { return document.getElementById(id)?.value||''; }
function setVal(id,v){ const e=document.getElementById(id); if(e) e.value=v; }

window.renderConfiguracoes = renderConfiguracoes;
window.salvarPerfil        = salvarPerfil;
window.trocarSenha         = trocarSenha;
window.atualizarForcaSenha = atualizarForcaSenha;

document.addEventListener('pageChanged', e => {
    if (e.detail === 'configuracoes') renderConfiguracoes();
});
console.log('✅ configuracoes.js carregado');
