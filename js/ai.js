/**
 * js/ai.js — Vito · Assistente IA do Ordem Pro
 * Vetore Movimentação · Powered by Groq (Llama 3.1)
 *
 * SETUP (Admin faz uma vez):
 * 1. console.groq.com → "Create API Key" → copie a chave (gsk_...)
 * 2. Abra o Vito → clique em "Configurar Chave" → cole e salve
 * 3. A chave fica no Supabase e todos os usuários usam automaticamente
 */

const VetoAI = (() => {

  let _open = false;
  let _msgs = [];
  let _busy = false;
  let _cooldownUntil = 0;
  let _keyLoaded = false; // chave já carregada do Supabase?

  const CFG = {
    // Prioridade: localStorage (admin local) → Supabase (compartilhada) → vazio
    get key() {
      return localStorage.getItem('vito_groq_key') || window._vitoSharedKey || '';
    },
    model:    'llama-3.1-8b-instant',
    maxTokens: 600,
    histMax:   16,
  };

  // ── Carrega chave compartilhada do Supabase ───────────────────
  async function _loadSharedKey() {
    if (_keyLoaded) return;
    _keyLoaded = true;
    try {
      if (typeof supabaseClient === 'undefined') return;
      const { data } = await supabaseClient
        .from('system_config')
        .select('valor')
        .eq('chave', 'vito_api_key')
        .single();
      if (data?.valor) {
        window._vitoSharedKey = data.valor;
        console.log('[Vito] Chave compartilhada carregada do Supabase');
      }
    } catch(e) {
      console.warn('[Vito] Chave compartilhada não encontrada:', e.message);
    }
  }

  // ── Salva chave no Supabase (só Admin) ───────────────────────
  async function _saveSharedKey(key) {
    try {
      if (typeof supabaseClient === 'undefined') return false;
      const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
      await supabaseClient.from('system_config').upsert({
        chave: 'vito_api_key',
        valor: key,
        updated_at: new Date().toISOString(),
        updated_by: user?.email || 'admin'
      });
      window._vitoSharedKey = key;
      console.log('[Vito] Chave salva no Supabase para todos os usuários');
      return true;
    } catch(e) {
      console.error('[Vito] Erro ao salvar chave:', e.message);
      return false;
    }
  }

  // ── Remove chave compartilhada (só Admin) ─────────────────────
  async function _removeSharedKey() {
    try {
      if (typeof supabaseClient === 'undefined') return;
      await supabaseClient
        .from('system_config')
        .delete()
        .eq('chave', 'vito_api_key');
      window._vitoSharedKey = '';
      localStorage.removeItem('vito_groq_key');
      console.log('[Vito] Chave removida do Supabase');
    } catch(e) {
      console.error('[Vito] Erro ao remover chave:', e.message);
    }
  }

  // ── Contexto dinâmico ──────────────────────────────────────────
  function _ctx() {
    const o = window.state?.orders || [];
    const s = {
      total:   o.length,
      pending: o.filter(x => x.status === 'pending').length,
      prog:    o.filter(x => ['progress','in_progress'].includes(x.status)).length,
      done:    o.filter(x => x.status === 'completed').length,
      deliv:   o.filter(x => x.status === 'delivered').length,
    };
    const recent = o.slice(0,5).map(x =>
      `Lote ${x.lote||'—'} · ${x.product||'—'} · ${x.status}`
    ).join('\n') || 'Sem ordens';

    return `Você é o Vito, assistente inteligente do Ordem Pro — sistema de controle de ordens de separação da Vetore Movimentação.
Seja descontraído, amigável e direto. Fale em português do Brasil casual. Use emojis com moderação. Respostas concisas.

📊 STATUS ATUAL:
Total: ${s.total} | A separar: ${s.pending} | Em separação: ${s.prog} | Concluídas: ${s.done} | Entregues: ${s.deliv}

📋 ÚLTIMAS ORDENS:
${recent}

🏭 SISTEMA:
- Status das ordens: pending / in_progress / completed / delivered
- Kanban prateleira F: Firefly, GM ASP, GM Turbo, Front Cover, Renault, Hyundai Voluta, AGCO 1250, MAN D08
- Etiquetas ZLP para volumes, campo lote, produto, quantidade, separador
- Usuários: níveis 0 (Visualizador) → 3 (Admin)
- Stack: HTML + Vanilla JS + Tailwind + Supabase + Vercel

Ajude com: busca/explicação de ordens, status, funcionalidades, operações de armazém.

IMAGENS: Quando o usuário pedir para VER ou MOSTRAR algo, adicione ao final:
[IMG_SEARCH: termo de busca em português]`;
  }

  // ── SVG Vito ──────────────────────────────────────────────────
  function _svg(size, talking) {
    const s = size, t = !!talking;
    const sc = s / 100;
    const h  = Math.round(120 * sc);
    return `<svg width="${s}" height="${h}" viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
  <defs>
    <linearGradient id="vg_body_${s}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#7c7cf8"/>
      <stop offset="55%"  stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="vg_side_${s}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#312e81"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="vg_top_${s}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <filter id="vg_eye_${s}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#312e81" flood-opacity="0.4"/>
    </filter>
  </defs>
  <ellipse cx="50" cy="117" rx="26" ry="4" fill="#000" opacity="0.18"/>
  <rect x="33" y="95" width="13" height="16" rx="4" fill="#312e81"/>
  <rect x="54" y="95" width="13" height="16" rx="4" fill="#312e81"/>
  <rect x="28" y="107" width="20" height="8"  rx="4" fill="#1e1b4b"/>
  <rect x="52" y="107" width="20" height="8"  rx="4" fill="#1e1b4b"/>
  <polygon points="82,30 92,22 92,90 82,98" fill="url(#vg_side_${s})"/>
  <polygon points="18,30 82,30 92,22 28,22" fill="url(#vg_top_${s})"/>
  <rect x="18" y="30" width="64" height="68" rx="6" fill="url(#vg_body_${s})"/>
  <rect x="18" y="30" width="3"  height="68" rx="1" fill="white" opacity="0.12"/>
  <rect x="18" y="30" width="64" height="3"  rx="1" fill="white" opacity="0.14"/>
  <circle cx="22" cy="34" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="78" cy="34" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="22" cy="94" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="78" cy="94" r="2.5" fill="#818cf8" opacity="0.7"/>
  <rect x="22" y="34" width="56" height="40" rx="5" fill="#0f0c29"/>
  <circle cx="38" cy="52" r="11" fill="white" filter="url(#vg_eye_${s})"/>
  <circle cx="62" cy="52" r="11" fill="white" filter="url(#vg_eye_${s})"/>
  <circle cx="40" cy="52" r="7"  fill="#1e1b4b"/>
  <circle cx="64" cy="52" r="7"  fill="#1e1b4b"/>
  <circle cx="41" cy="52" r="4.5" fill="#0a0820"/>
  <circle cx="65" cy="52" r="4.5" fill="#0a0820"/>
  <circle cx="36" cy="48" r="3"  fill="white" opacity="0.92"/>
  <circle cx="60" cy="48" r="3"  fill="white" opacity="0.92"/>
  <circle cx="44" cy="56" r="1.5" fill="white" opacity="0.45"/>
  <circle cx="68" cy="56" r="1.5" fill="white" opacity="0.45"/>
  ${t
    ? `<ellipse cx="50" cy="69" rx="8" ry="5" fill="#0f0c29"/>
       <ellipse cx="50" cy="67" rx="5" ry="2" fill="white" opacity="0.12"/>`
    : `<path d="M40 68 Q50 76 60 68" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.75"/>`
  }
  <rect x="36" y="80" width="28" height="12" rx="5" fill="#1e1b4b" opacity="0.85"/>
  <text x="50" y="90" text-anchor="middle" fill="#818cf8" font-size="7.5" font-weight="800" font-family="'Plus Jakarta Sans',sans-serif" letter-spacing="1">VT</text>
  <rect x="5" y="44" width="14" height="26" rx="6" fill="#3730a3"/>
  <rect x="2"  y="68" width="18" height="9" rx="4" fill="#1e1b4b"/>
  <rect x="5"  y="70" width="9"  height="5" rx="1" fill="#6366f1" opacity="0.7"/>
  <rect x="81" y="44" width="14" height="22" rx="6" fill="#3730a3"/>
  <rect x="93" y="54" width="3.5" height="22" rx="1.5" fill="#c7d2fe"/>
  <ellipse cx="94.7" cy="53" rx="4" ry="4" fill="#fbbf24"/>
  <ellipse cx="94.7" cy="53" rx="2" ry="2" fill="white" opacity="0.6"/>
</svg>`;
  }

  // ── CSS ────────────────────────────────────────────────────────
  const _CSS = `
#vito-root *{box-sizing:border-box;font-family:'Plus Jakarta Sans',sans-serif}
@keyframes vito-bob {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes vito-pulse{0%,100%{filter:drop-shadow(0 6px 18px rgba(99,102,241,.5))} 70%{filter:drop-shadow(0 6px 28px rgba(99,102,241,.9))}}
@keyframes vito-in  {from{opacity:0;transform:translateY(20px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes vito-dot {0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}

#vito-fab{position:fixed;bottom:24px;right:24px;z-index:9100;background:transparent;border:none;cursor:pointer;padding:0;animation:vito-pulse 2.8s ease-in-out infinite;transition:transform .2s;}
#vito-fab:hover{transform:scale(1.08)}
#vito-bob{animation:vito-bob 2.2s ease-in-out infinite}

#vito-panel{position:fixed;bottom:148px;right:24px;z-index:9099;width:340px;display:flex;flex-direction:column;background:#0a0f1e;border:1px solid rgba(99,102,241,.35);border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6),0 0 0 1px rgba(99,102,241,.1);animation:vito-in .3s cubic-bezier(.16,1,.3,1);}
#vito-panel.v-hidden{display:none}

#vito-head{display:flex;align-items:center;gap:10px;padding:13px 15px;background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(67,56,202,.1));border-bottom:1px solid rgba(99,102,241,.18);}
#vito-head-av{flex-shrink:0;animation:vito-bob 2.2s ease-in-out infinite}
#vito-head-info{flex:1}
#vito-head-name{font-size:14px;font-weight:800;color:#e2e8f0;margin:0;line-height:1.2}
#vito-head-sub{font-size:10px;color:#6366f1;margin:0;display:flex;align-items:center;gap:4px}
#vito-head-dot{width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 5px #10b981}
#vito-x-btn{background:transparent;border:none;cursor:pointer;color:#475569;padding:4px;border-radius:8px;display:flex;align-items:center;transition:color .2s,background .2s;}
#vito-x-btn:hover{color:#f1f5f9;background:rgba(255,255,255,.06)}

#vito-msgs{flex:1;overflow-y:auto;padding:12px 13px;display:flex;flex-direction:column;gap:8px;max-height:300px;min-height:100px;scrollbar-width:thin;scrollbar-color:rgba(99,102,241,.3) transparent;}
.vmsg{display:flex;gap:7px;animation:vito-in .22s ease}
.vmsg.u{flex-direction:row-reverse}
.vbub{max-width:82%;padding:9px 13px;font-size:13px;line-height:1.55;word-break:break-word}
.vbub.bot{background:rgba(99,102,241,.13);color:#c7d2fe;border:1px solid rgba(99,102,241,.2);border-radius:4px 14px 14px 14px}
.vbub.usr{background:#4338ca;color:white;border-radius:14px 4px 14px 14px}
.vico{width:28px;height:34px;flex-shrink:0;margin-top:2px}
.vtyping{display:flex;align-items:center;gap:5px;padding:10px 13px}
.vdot{width:7px;height:7px;border-radius:50%;background:#6366f1;animation:vito-dot 1.2s ease-in-out infinite}
.vdot:nth-child(2){animation-delay:.2s}
.vdot:nth-child(3){animation-delay:.4s}

#vito-hints{padding:4px 12px 8px;display:flex;flex-wrap:wrap;gap:4px;border-top:1px solid rgba(99,102,241,.1)}
.vhint{display:inline-flex;align-items:center;gap:3px;padding:4px 10px;border-radius:20px;font-size:11px;cursor:pointer;border:1px solid rgba(99,102,241,.28);background:rgba(99,102,241,.07);color:#818cf8;transition:all .15s;white-space:nowrap;}
.vhint:hover{background:rgba(99,102,241,.2);color:#a5b4fc}

#vito-foot{padding:10px 11px;border-top:1px solid rgba(99,102,241,.15);display:flex;gap:8px;align-items:flex-end}
#vito-inp{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(99,102,241,.25);border-radius:12px;padding:9px 12px;color:#e2e8f0;font-size:13px;resize:none;outline:none;line-height:1.4;max-height:80px;font-family:inherit;transition:border-color .2s;}
#vito-inp::placeholder{color:#475569}
#vito-inp:focus{border-color:rgba(99,102,241,.5)}
#vito-send{background:#4338ca;border:none;border-radius:10px;width:36px;height:36px;cursor:pointer;color:white;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background .2s;}
#vito-send:hover{background:#6366f1}
#vito-send:disabled{background:#374151;cursor:not-allowed}

/* Setup da chave */
#vito-setup{padding:16px;display:flex;flex-direction:column;gap:10px}
#vito-setup p{font-size:12px;color:#94a3b8;margin:0;line-height:1.5}
#vito-setup a{color:#818cf8;text-decoration:none}
#vito-setup a:hover{text-decoration:underline}
#vito-key-inp{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(99,102,241,.3);border-radius:10px;padding:9px 12px;color:#e2e8f0;font-size:12px;font-family:monospace;outline:none;transition:border-color .2s;}
#vito-key-inp:focus{border-color:rgba(99,102,241,.6)}
#vito-key-inp::placeholder{color:#475569}
#vito-save-key{background:#4338ca;border:none;border-radius:10px;padding:9px 0;color:white;font-size:13px;font-weight:700;cursor:pointer;width:100%;transition:background .2s;font-family:inherit;}
#vito-save-key:hover{background:#6366f1}
#vito-key-status{font-size:11px;text-align:center;padding:4px 0;border-radius:8px;display:none;}
`;

  // ── HTML ───────────────────────────────────────────────────────
  function _html() {
    return `
<style>${_CSS}</style>
<div id="vito-root">
  <button id="vito-fab" onclick="VetoAI.toggle()" title="Vito — Assistente Vetore">
    <div id="vito-bob">${_svg(70, false)}</div>
  </button>

  <div id="vito-panel" class="v-hidden">
    <div id="vito-head">
      <div id="vito-head-av">${_svg(40, false)}</div>
      <div id="vito-head-info">
        <p id="vito-head-name">Vito</p>
        <p id="vito-head-sub">
          <span id="vito-head-dot"></span>Assistente Vetore · online
        </p>
      </div>
      <button id="vito-x-btn" onclick="VetoAI.toggle()">
        <span class="material-symbols-rounded" style="font-size:18px">close</span>
      </button>
    </div>

    <div id="vito-msgs"></div>

    <div id="vito-hints">
      <span class="vhint" onclick="VetoAI.suggest('Qual o status das ordens agora?')">📊 Status</span>
      <span class="vhint" onclick="VetoAI.suggest('Como iniciar uma separação?')">🚀 Separação</span>
      <span class="vhint" onclick="VetoAI.suggest('espelho kanban FIREFLY')">📥 Espelho XLS</span>
      <span class="vhint" onclick="VetoAI.suggest('Explica o Kanban da prateleira F')">📦 Kanban</span>
    </div>

    <!-- Setup da chave — aparece quando não há chave configurada -->
    <div id="vito-setup" style="display:none">
      <p id="vito-setup-info">Para usar o Vito, um Admin precisa configurar a chave da API Groq.</p>
      <input id="vito-key-inp" type="password" placeholder="gsk_..." autocomplete="off"/>
      <div id="vito-key-options" style="display:flex;gap:6px;">
        <button id="vito-save-key" onclick="VetoAI.saveKey()" style="flex:1;">
          💾 Salvar para todos
        </button>
      </div>
      <div id="vito-key-status"></div>
    </div>

    <div id="vito-foot">
      <textarea id="vito-inp" placeholder="Pergunte ao Vito..." rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();VetoAI.send()}">
      </textarea>
      <button id="vito-send" onclick="VetoAI.send()">
        <span class="material-symbols-rounded" style="font-size:17px">send</span>
      </button>
    </div>
  </div>
</div>`;
  }

  // ── Groq API ──────────────────────────────────────────────────
  async function _ask(text) {
    _msgs.push({ role: 'user', content: text });
    if (_msgs.length > CFG.histMax) _msgs = _msgs.slice(-CFG.histMax);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CFG.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CFG.model,
        messages: [
          { role: 'system', content: _ctx() },
          ..._msgs,
        ],
        max_tokens: CFG.maxTokens,
        temperature: 0.75,
      }),
    });

    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (res.status === 401) throw new Error('FORBIDDEN');
    if (!res.ok) throw new Error(`Groq ${res.status}`);

    const data  = await res.json();
    const reply = data?.choices?.[0]?.message?.content
      || 'Não consegui uma resposta. 😅 Tenta de novo?';
    _msgs.push({ role: 'assistant', content: reply });
    return reply;
  }

  // ── DOM helpers ────────────────────────────────────────────────
  function _addMsg(role, text) {
    const box = document.getElementById('vito-msgs');
    const div = document.createElement('div');
    div.className = `vmsg ${role === 'bot' ? '' : 'u'}`;

    let imgBtn = '';
    const imgMatch = text.match(/\[IMG_SEARCH:\s*(.+?)\]/);
    if (imgMatch) {
      const termo = imgMatch[1].trim();
      const url   = 'https://www.google.com/search?q=' + encodeURIComponent(termo) + '&tbm=isch';
      imgBtn = `<a href="${url}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:7px 13px;border-radius:10px;font-size:12px;font-weight:700;background:rgba(99,102,241,.18);border:1px solid rgba(99,102,241,.35);color:#a5b4fc;text-decoration:none;"
        onmouseover="this.style.background='rgba(99,102,241,.32)'"
        onmouseout="this.style.background='rgba(99,102,241,.18)'">
        🔍 Ver imagens: ${termo}
      </a>`;
      text = text.replace(/\[IMG_SEARCH:\s*.+?\]/, '').trim();
    }

    const fmt = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>');

    div.innerHTML = role === 'bot'
      ? `<div class="vico">${_svg(28, true)}</div><div class="vbub bot">${fmt}${imgBtn}</div>`
      : `<div class="vbub usr">${fmt}</div>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function _showTyping() {
    const box = document.getElementById('vito-msgs');
    const el  = document.createElement('div');
    el.id = 'vito-typ'; el.className = 'vmsg';
    el.innerHTML = `<div class="vico">${_svg(28,false)}</div>
      <div class="vbub bot vtyping">
        <div class="vdot"></div><div class="vdot"></div><div class="vdot"></div>
      </div>`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }
  function _hideTyping() { document.getElementById('vito-typ')?.remove(); }

  function _showSetup() {
    const setup = document.getElementById('vito-setup');
    const hints = document.getElementById('vito-hints');
    const foot  = document.getElementById('vito-foot');
    const info  = document.getElementById('vito-setup-info');
    if (!setup) return;

    // Ajusta mensagem conforme nível do usuário
    const nivel = typeof getNivel === 'function' ? getNivel() : 0;
    if (nivel >= 3) {
      if (info) info.innerHTML = 'Cole a chave da API Groq abaixo.<br><a href="https://console.groq.com" target="_blank">console.groq.com</a> → API Keys → Create API Key<br><br><strong>Ao salvar, todos os usuários usarão esta chave automaticamente.</strong>';
    } else {
      if (info) info.textContent = 'O Vito ainda não foi configurado. Solicite ao Admin do sistema que configure a chave da API.';
      // Esconde o formulário para não-admins
      const inp = document.getElementById('vito-key-inp');
      const btn = document.getElementById('vito-save-key');
      const opts = document.getElementById('vito-key-options');
      if (inp) inp.style.display = 'none';
      if (opts) opts.style.display = 'none';
    }

    setup.style.display = 'flex';
    setup.style.flexDirection = 'column';
    if (hints) hints.style.display = 'none';
    if (foot)  foot.style.display  = 'none';
    setTimeout(() => document.getElementById('vito-key-inp')?.focus(), 100);
  }

  function _hideSetup() {
    const setup = document.getElementById('vito-setup');
    const hints = document.getElementById('vito-hints');
    const foot  = document.getElementById('vito-foot');
    if (setup) setup.style.display = 'none';
    if (hints) hints.style.display = '';
    if (foot)  foot.style.display  = '';
  }

  function _setKeyStatus(msg, ok) {
    const el = document.getElementById('vito-key-status');
    if (!el) return;
    el.style.display = 'block';
    el.style.background = ok ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.12)';
    el.style.color = ok ? '#10b981' : '#f87171';
    el.textContent = msg;
  }

  // ── API pública ────────────────────────────────────────────────
  function toggle() {
    _open = !_open;
    const panel = document.getElementById('vito-panel');
    if (!panel) return;
    if (_open) {
      panel.classList.remove('v-hidden');
      if (_msgs.length === 0) {
        setTimeout(() => {
          if (!CFG.key) {
            _showSetup();
            return;
          }
          const cnt = (window.state?.orders || []).length;
          _addMsg('bot',
            `Oi! 👋 Sou o **Vito**, assistente do Ordem Pro!\n\nTemos **${cnt} ordens** no sistema agora. Em que posso ajudar?`);
        }, 280);
      }
      setTimeout(() => document.getElementById('vito-inp')?.focus(), 360);
    } else {
      panel.classList.add('v-hidden');
    }
  }

  async function send() {
    if (_busy) return;
    if (Date.now() < _cooldownUntil) {
      const rem = Math.ceil((_cooldownUntil - Date.now()) / 1000);
      _addMsg('bot', `⏳ Ainda em cooldown. Aguarda mais ${rem}s.`);
      return;
    }
    const inp  = document.getElementById('vito-inp');
    const text = (inp?.value || '').trim();
    if (!text) return;
    inp.value = ''; inp.style.height = 'auto';

    // Chave digitada diretamente no chat (admin power user)
    if (text.startsWith('gsk_')) {
      await _saveSharedKey(text);
      localStorage.setItem('vito_groq_key', text);
      _hideSetup();
      _addMsg('bot', '✅ Chave salva no Supabase! Todos os usuários do sistema já podem usar o Vito automaticamente. 🎉');
      return;
    }

    // ── Detecção de intenção: espelho do kanban ─────────────────
    const txtNorm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (/espelho|folha|ficha|imprimir|xls|excel/.test(txtNorm) && /kanban|prateleira|posicao|posição/.test(txtNorm)) {
      _addMsg('user', text);
      _gerarEspelhoXLS(text);
      return;
    }

    if (!CFG.key) { _showSetup(); return; }
    _addMsg('user', text);
    _busy = true;
    const btn = document.getElementById('vito-send');
    if (btn) btn.disabled = true;
    _showTyping();
    try {
      _addMsg('bot', await _ask(text));
    } catch(e) {
      console.error('[Vito]', e);
      if (e.message === 'RATE_LIMIT') {
        _cooldownUntil = Date.now() + 60000;
        let secs = 60;
        const box = document.getElementById('vito-msgs');
        const el  = document.createElement('div');
        el.className = 'vmsg'; el.id = 'vito-cd-msg';
        el.innerHTML = `<div class="vico">${_svg(28,false)}</div>
          <div class="vbub bot">⏳ Limite da API atingido. Aguarde <strong id="vito-cd">${secs}s</strong>.</div>`;
        box.appendChild(el); box.scrollTop = box.scrollHeight;
        const iv = setInterval(() => {
          secs--;
          const cd = document.getElementById('vito-cd');
          if (cd) cd.textContent = secs + 's';
          if (secs <= 0) { clearInterval(iv); document.getElementById('vito-cd-msg')?.remove(); _addMsg('bot', '✅ Pronto! Pode perguntar agora.'); }
        }, 1000);
      }
      let msg;
      if (!CFG.key) msg = '⚠️ Chave não configurada. Admin deve configurar a chave da API.';
      else if (e.message === 'FORBIDDEN') msg = '🔑 Chave inválida ou expirada. Admin deve atualizar a chave em console.groq.com → API Keys.';
      else msg = 'Ops, não consegui conectar agora. 😅 Tenta em instantes!';
      _addMsg('bot', msg);
    } finally {
      _hideTyping();
      _busy = false;
      if (btn) btn.disabled = false;
    }
  }

  function suggest(text) {
    if (_busy) return;
    const inp = document.getElementById('vito-inp');
    if (inp) { inp.value = text; inp.focus(); }
    send();
  }

  async function saveKey() {
    const inp = document.getElementById('vito-key-inp');
    const key = (inp?.value || '').trim();

    if (!key.startsWith('gsk_')) {
      if (inp) inp.style.borderColor = '#ef4444';
      _setKeyStatus('❌ Chave inválida — deve começar com gsk_', false);
      return;
    }

    const btn = document.getElementById('vito-save-key');
    if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

    // Salva no Supabase para todos + no localStorage local
    const ok = await _saveSharedKey(key);
    localStorage.setItem('vito_groq_key', key);

    if (btn) { btn.disabled = false; btn.textContent = '💾 Salvar para todos'; }

    if (ok) {
      _setKeyStatus('✅ Chave salva! Todos os usuários podem usar o Vito agora.', true);
      setTimeout(() => {
        _hideSetup();
        _addMsg('bot', '✅ Chave configurada com sucesso! Todos os usuários do sistema agora têm acesso ao Vito automaticamente. 🎉');
      }, 1500);
    } else {
      // Salvou só local
      _setKeyStatus('⚠️ Salvo localmente. Erro ao salvar no servidor.', false);
      setTimeout(() => {
        _hideSetup();
        _addMsg('bot', '✅ Chave salva localmente. Para compartilhar com todos, verifique a conexão com o Supabase.');
      }, 1500);
    }
  }

  async function removeKey() {
    if (!confirm('Remover a chave da API de todos os usuários?')) return;
    await _removeSharedKey();
    if (typeof showToast === 'function') showToast('Chave do Vito removida', 'warning');
  }

  async function init() {
    if (document.getElementById('vito-root')) return;
    document.body.insertAdjacentHTML('beforeend', _html());

    // Auto-redimensiona textarea
    const inp = document.getElementById('vito-inp');
    if (inp) inp.addEventListener('input', () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
    });

    // Carrega chave compartilhada do Supabase em background
    // (supabaseClient pode não estar pronto ainda — tenta em 1s)
    setTimeout(async () => {
      await _loadSharedKey();
      // Se o painel já estiver aberto e esperando chave, re-verifica
      if (_open && !CFG.key) {
        _showSetup();
      } else if (_open && CFG.key && document.getElementById('vito-setup')?.style.display !== 'none') {
        _hideSetup();
        const cnt = (window.state?.orders || []).length;
        _addMsg('bot', `Oi! 👋 Sou o **Vito**! Temos **${cnt} ordens** no sistema. Em que posso ajudar?`);
      }
    }, 1200);
  }

  // ── Gera XLS do espelho Kanban e oferece download ─────────────
  function _gerarEspelhoXLS(texto) {
    const XLSX = window.XLSX;
    if (!XLSX) {
      _addMsg('bot', '⚠️ SheetJS não carregado. Verifique se o CDN está no index.html.');
      return;
    }

    // ── Detecta o que o usuário quer ──────────────────────────────
    // Tenta extrair posição específica (ex: F11-01, f11-1)
    const matchPos = texto.match(/[Ff](\d+)[-\s]?0*(\d+)/);
    // Tenta extrair modelo por nome
    const modelos  = MODELOS || [];
    const matchMod = modelos.find(m =>
      texto.toLowerCase().includes(m.nome.toLowerCase())
    );

    // ── Monta a lista de posições a exportar ──────────────────────
    let targets = []; // [{posKey, nivel, pos, modelo}]
    

    if (matchPos) {
      // Posição específica: F11-01
      const nivel = parseInt(matchPos[1]);
      const pos   = parseInt(matchPos[2]);
      const modelo = POS_MODELO?.[pos];
      if (modelo) targets = [{ posKey: `F${nivel}-${String(pos).padStart(2,'0')}`, nivel, pos, modelo }];
    } else if (matchMod) {
      // Modelo inteiro: todas as posições e níveis com material
      for (let nivel = 0; nivel <= 12; nivel++) {
        for (const pos of matchMod.pos) {
          const pnsPos = KS?.grade?.[nivel]?.[pos];
          if (pnsPos && pnsPos.size > 0) {
            targets.push({ posKey: `F${nivel}-${String(pos).padStart(2,'0')}`, nivel, pos, modelo: matchMod });
          }
        }
      }
    } else {
      // Tudo — todas as posições com material
      modelos.forEach(m => {
        for (let nivel = 0; nivel <= 12; nivel++) {
          for (const pos of m.pos) {
            const pnsPos = KS?.grade?.[nivel]?.[pos];
            if (pnsPos && pnsPos.size > 0) {
              targets.push({ posKey: `F${nivel}-${String(pos).padStart(2,'0')}`, nivel, pos, modelo: m });
            }
          }
        }
      });
    }

    if (!targets.length) {
      const dica = matchPos
        ? `Posição F${matchPos[1]}-${matchPos[2].padStart(2,'0')} não tem material registrado.`
        : matchMod
          ? `Modelo ${matchMod.nome} não tem posições com material.`
          : 'Nenhuma posição com material encontrada. Carregue o XLS do TOTVS primeiro.';
      _addMsg('bot', `⚠️ ${dica}`);
      return;
    }

    // ── Monta workbook ────────────────────────────────────────────
    const wb  = XLSX.utils.book_new();
    const estruturas = ESTRUTURAS || {};
    const multiplos  = KS?.multiplos || {};
    const qtdBase    = KS?.qtdBase   || {};
    const lotesMap   = KS?.lotesMap  || new Map();

    // Uma sheet por posição se ≤5 posições, senão tudo em uma sheet
    if (targets.length <= 5) {
      targets.forEach(({ posKey, nivel, pos, modelo }) => {
        const estrutura = estruturas[modelo.nome] || [];
        const pnsPos    = KS?.grade?.[nivel]?.[pos] || new Map();
        const base      = qtdBase[modelo.nome] || 1000;

        const rows = [
          [modelo.nome],                          // linha 1 — modelo
          [],                                      // linha 2 — vazia
          ['Componente','Descrição','Quantidade','Lote','Múltiplo','Esperado','Status'],
        ];

        estrutura.forEach(comp => {
          const multKey = modelo.nome + '|' + comp.pn;
          const mult    = multiplos[multKey] !== undefined ? multiplos[multKey] : comp.mult;
          const qtdReal = pnsPos.get(comp.pn) || 0;
          const esperado = base * mult;
          const loteKey  = posKey + '|' + comp.pn;
          const lotes    = lotesMap.get(loteKey) || [];
          const status   = qtdReal <= 0 ? '⚠️ Falta' : qtdReal >= esperado * 1.8 ? '🔵 Duplicado' : '✅ OK';
          rows.push([
            comp.pn,
            comp.desc,
            qtdReal,
            lotes.join(' / ') || '—',
            mult,
            esperado,
            status,
          ]);
        });

        rows.push([], [posKey], [], ['CONFERENTE:', '', '', 'DATA:', '']);

        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Larguras de coluna
        ws['!cols'] = [
          { wch: 16 }, // PN
          { wch: 36 }, // Descrição
          { wch: 12 }, // Quantidade
          { wch: 22 }, // Lote
          { wch: 8  }, // Múltiplo
          { wch: 10 }, // Esperado
          { wch: 12 }, // Status
        ];

        XLSX.utils.book_append_sheet(wb, ws, posKey);
      });
    } else {
      // Uma única sheet com tudo
      const allRows = [['Posição','Modelo','PN','Descrição','Quantidade','Lote','Múltiplo','Esperado','Status']];
      targets.forEach(({ posKey, nivel, pos, modelo }) => {
        const estrutura = estruturas[modelo.nome] || [];
        const pnsPos    = KS?.grade?.[nivel]?.[pos] || new Map();
        const base      = qtdBase[modelo.nome] || 1000;
        estrutura.forEach(comp => {
          const multKey  = modelo.nome + '|' + comp.pn;
          const mult     = multiplos[multKey] !== undefined ? multiplos[multKey] : comp.mult;
          const qtdReal  = pnsPos.get(comp.pn) || 0;
          const esperado = base * mult;
          const loteKey  = posKey + '|' + comp.pn;
          const lotes    = lotesMap.get(loteKey) || [];
          const status   = qtdReal <= 0 ? 'Falta' : qtdReal >= esperado * 1.8 ? 'Duplicado' : 'OK';
          allRows.push([posKey, modelo.nome, comp.pn, comp.desc, qtdReal, lotes.join(' / ') || '—', mult, esperado, status]);
        });
      });
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      ws['!cols'] = [
        {wch:10},{wch:16},{wch:16},{wch:36},{wch:12},{wch:22},{wch:8},{wch:10},{wch:12}
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Espelho Kanban');
    }

    // ── Download ──────────────────────────────────────────────────
    const nomeArq = targets.length === 1
      ? `espelho_kanban_${targets[0].posKey}.xlsx`
      : matchMod
        ? `espelho_kanban_${matchMod.nome.replace(/\s+/g,'_')}.xlsx`
        : `espelho_kanban_completo.xlsx`;

    XLSX.writeFile(wb, nomeArq);

    // ── Mensagem de confirmação no chat ───────────────────────────
    const desc = targets.length === 1
      ? `posição **${targets[0].posKey}** (${targets[0].modelo.nome})`
      : matchMod
        ? `modelo **${matchMod.nome}** — ${targets.length} posições`
        : `kanban completo — ${targets.length} posições`;

    _addMsg('bot',
      `📥 Espelho gerado! O arquivo **${nomeArq}** foi baixado automaticamente.\n\n` +
      `Conteúdo: ${desc}.\n\n` +
      `Cada aba contém: PN, Descrição, Quantidade, Lote, Múltiplo, Esperado e Status (✅/⚠️/🔵).`
    );
  }

  return { init, toggle, send, suggest, saveKey, removeKey };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => VetoAI.init());
} else {
  VetoAI.init();
}
window.VetoAI = VetoAI;
console.log('✅ Vito carregado — Chave compartilhada via Supabase');
