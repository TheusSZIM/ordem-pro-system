/**
 * js/ai.js — Vito · Assistente IA do Ordem Pro
 * Vetore Movimentação · Powered by Google Gemini (gratuito)
 *
 * SETUP:
 * 1. console.groq.com → "Create API Key" → copie a chave
 * 2. Cole em CFG.key abaixo (começa com gsk_...)
 * 3. Adicione <script src="js/ai.js"></script> no index.html (último script)
 */

const VetoAI = (() => {

  let _open = false;
  let _msgs = [];
  let _busy = false;
  let _cooldownUntil = 0;

  const CFG = {
    // Chave lida do localStorage — nunca no código-fonte!
    get key() { return localStorage.getItem('vito_groq_key') || ''; },
    model:    'llama-3.1-8b-instant',
    maxTokens: 600,
    histMax:   16,
  };

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
- Kanban prateleira F: Firefly, GM ASP, GM Turbo, Front Cover, Renault, Hyundai Voluta/Prime, MAN D08
- Etiquetas ZLP para volumes, campo lote, produto, quantidade, separador
- Usuários: níveis 0 (Visualizador) → 3 (Admin)
- Stack: HTML + Vanilla JS + Tailwind + Supabase + Vercel

Ajude com: busca/explicação de ordens, status, funcionalidades, operações de armazém.`;
  }

  // ── SVG Vito — caixinha robô estilo 3D ────────────────────────
  function _svg(size, talking) {
    const s = size, t = !!talking;
    // escala os pontos de 100×120 → size
    const sc = s / 100;
    const h  = Math.round(120 * sc);
    return `<svg width="${s}" height="${h}" viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
  <defs>
    <!-- gradiente corpo (face frontal) -->
    <linearGradient id="vg_body_${s}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#7c7cf8"/>
      <stop offset="55%"  stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <!-- lateral direita do cubo -->
    <linearGradient id="vg_side_${s}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#312e81"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <!-- topo do cubo -->
    <linearGradient id="vg_top_${s}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <!-- sombra suave nos olhos -->
    <filter id="vg_eye_${s}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#312e81" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Sombra no chão -->
  <ellipse cx="50" cy="117" rx="26" ry="4" fill="#000" opacity="0.18"/>

  <!-- ── Pernas ── -->
  <rect x="33" y="95" width="13" height="16" rx="4" fill="#312e81"/>
  <rect x="54" y="95" width="13" height="16" rx="4" fill="#312e81"/>
  <!-- Pés -->
  <rect x="28" y="107" width="20" height="8"  rx="4" fill="#1e1b4b"/>
  <rect x="52" y="107" width="20" height="8"  rx="4" fill="#1e1b4b"/>
  <!-- Brilho pés -->
  <rect x="30" y="108" width="10" height="3"  rx="1.5" fill="white" opacity="0.08"/>
  <rect x="54" y="108" width="10" height="3"  rx="1.5" fill="white" opacity="0.08"/>

  <!-- ── Cubo corpo — efeito 3D ── -->
  <!-- Lateral direita -->
  <polygon points="82,30 92,22 92,90 82,98" fill="url(#vg_side_${s})"/>
  <!-- Topo -->
  <polygon points="18,30 82,30 92,22 28,22" fill="url(#vg_top_${s})"/>
  <!-- Face frontal principal -->
  <rect x="18" y="30" width="64" height="68" rx="6" fill="url(#vg_body_${s})"/>
  <!-- Brilho edge esquerdo -->
  <rect x="18" y="30" width="3"  height="68" rx="1" fill="white" opacity="0.12"/>
  <!-- Brilho edge topo -->
  <rect x="18" y="30" width="64" height="3"  rx="1" fill="white" opacity="0.14"/>

  <!-- ── Rebites nos cantos ── -->
  <circle cx="22" cy="34" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="78" cy="34" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="22" cy="94" r="2.5" fill="#818cf8" opacity="0.7"/>
  <circle cx="78" cy="94" r="2.5" fill="#818cf8" opacity="0.7"/>

  <!-- ── Painel visor (área escura do rosto) ── -->
  <rect x="22" y="34" width="56" height="40" rx="5" fill="#0f0c29"/>
  <rect x="22" y="34" width="56" height="2"  rx="1" fill="white" opacity="0.06"/>

  <!-- ── Olhos ── -->
  <!-- globo ocular esq -->
  <circle cx="38" cy="52" r="11" fill="white" filter="url(#vg_eye_${s})"/>
  <!-- globo ocular dir -->
  <circle cx="62" cy="52" r="11" fill="white" filter="url(#vg_eye_${s})"/>
  <!-- íris esq -->
  <circle cx="40" cy="52" r="7"  fill="#1e1b4b"/>
  <!-- íris dir -->
  <circle cx="64" cy="52" r="7"  fill="#1e1b4b"/>
  <!-- pupila esq -->
  <circle cx="41" cy="52" r="4.5" fill="#0a0820"/>
  <!-- pupila dir -->
  <circle cx="65" cy="52" r="4.5" fill="#0a0820"/>
  <!-- brilho primário -->
  <circle cx="36" cy="48" r="3"  fill="white" opacity="0.92"/>
  <circle cx="60" cy="48" r="3"  fill="white" opacity="0.92"/>
  <!-- brilho secundário -->
  <circle cx="44" cy="56" r="1.5" fill="white" opacity="0.45"/>
  <circle cx="68" cy="56" r="1.5" fill="white" opacity="0.45"/>

  <!-- ── Boca ── -->
  ${t
    ? `<!-- falando -->
       <ellipse cx="50" cy="69" rx="8" ry="5" fill="#0f0c29"/>
       <ellipse cx="50" cy="67" rx="5" ry="2" fill="white" opacity="0.12"/>`
    : `<!-- sorriso -->
       <path d="M40 68 Q50 76 60 68"
         stroke="white" stroke-width="2.5" fill="none"
         stroke-linecap="round" opacity="0.75"/>`
  }

  <!-- ── Badge VT no peito ── -->
  <rect x="36" y="80" width="28" height="12" rx="5" fill="#1e1b4b" opacity="0.85"/>
  <rect x="37" y="81" width="26" height="5"  rx="2" fill="white"  opacity="0.05"/>
  <text x="50" y="90" text-anchor="middle" fill="#818cf8"
    font-size="7.5" font-weight="800" font-family="'Plus Jakarta Sans',sans-serif"
    letter-spacing="1">VT</text>

  <!-- ── Braço esquerdo ── -->
  <rect x="5" y="44" width="14" height="26" rx="6" fill="#3730a3"/>
  <rect x="5" y="44" width="5"  height="26" rx="3" fill="#4f46e5" opacity="0.4"/>
  <!-- Mão esq (scanner) -->
  <rect x="2"  y="68" width="18" height="9" rx="4" fill="#1e1b4b"/>
  <rect x="5"  y="70" width="9"  height="5" rx="1" fill="#6366f1" opacity="0.7"/>
  <rect x="5"  y="70" width="9"  height="2" rx="1" fill="white"   opacity="0.15"/>

  <!-- ── Braço direito ── -->
  <rect x="81" y="44" width="14" height="22" rx="6" fill="#3730a3"/>
  <rect x="88" y="44" width="5"  height="22" rx="3" fill="#4f46e5" opacity="0.35"/>
  <!-- Varinha / caneta -->
  <rect x="93" y="54" width="3.5" height="22" rx="1.5" fill="#c7d2fe"/>
  <rect x="93" y="54" width="1.5" height="22" rx="1"   fill="white" opacity="0.3"/>
  <!-- ponta da varinha -->
  <ellipse cx="94.7" cy="53" rx="4" ry="4" fill="#fbbf24"/>
  <ellipse cx="94.7" cy="53" rx="2" ry="2" fill="white" opacity="0.6"/>
  <ellipse cx="93.5" cy="51.5" rx="1" ry="1" fill="white" opacity="0.9"/>
</svg>`;
  }

  // ── CSS ────────────────────────────────────────────────────────
  const _CSS = `
#vito-root *{box-sizing:border-box;font-family:'Plus Jakarta Sans',sans-serif}
@keyframes vito-bob {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes vito-pulse{0%,100%{filter:drop-shadow(0 6px 18px rgba(99,102,241,.5))}
  70%{filter:drop-shadow(0 6px 28px rgba(99,102,241,.9))}}
@keyframes vito-in  {from{opacity:0;transform:translateY(20px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes vito-dot {0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}

#vito-fab{
  position:fixed;bottom:24px;right:24px;z-index:9100;
  background:transparent;border:none;cursor:pointer;padding:0;
  animation:vito-pulse 2.8s ease-in-out infinite;
  transition:transform .2s;
}
#vito-fab:hover{transform:scale(1.08)}
#vito-bob{animation:vito-bob 2.2s ease-in-out infinite}

#vito-panel{
  position:fixed;bottom:148px;right:24px;z-index:9099;
  width:340px;display:flex;flex-direction:column;
  background:#0a0f1e;border:1px solid rgba(99,102,241,.35);
  border-radius:20px;overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,.6),0 0 0 1px rgba(99,102,241,.1);
  animation:vito-in .3s cubic-bezier(.16,1,.3,1);
}
#vito-panel.v-hidden{display:none}

#vito-head{
  display:flex;align-items:center;gap:10px;padding:13px 15px;
  background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(67,56,202,.1));
  border-bottom:1px solid rgba(99,102,241,.18);
}
#vito-head-av  {flex-shrink:0;animation:vito-bob 2.2s ease-in-out infinite}
#vito-head-info{flex:1}
#vito-head-name{font-size:14px;font-weight:800;color:#e2e8f0;margin:0;line-height:1.2}
#vito-head-sub {font-size:10px;color:#6366f1;margin:0;display:flex;align-items:center;gap:4px}
#vito-head-dot {width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 5px #10b981}
#vito-x-btn{
  background:transparent;border:none;cursor:pointer;
  color:#475569;padding:4px;border-radius:8px;
  display:flex;align-items:center;transition:color .2s,background .2s;
}
#vito-x-btn:hover{color:#f1f5f9;background:rgba(255,255,255,.06)}

#vito-msgs{
  flex:1;overflow-y:auto;padding:12px 13px;
  display:flex;flex-direction:column;gap:8px;
  max-height:300px;min-height:100px;
  scrollbar-width:thin;scrollbar-color:rgba(99,102,241,.3) transparent;
}
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
.vhint{
  display:inline-flex;align-items:center;gap:3px;
  padding:4px 10px;border-radius:20px;font-size:11px;cursor:pointer;
  border:1px solid rgba(99,102,241,.28);background:rgba(99,102,241,.07);
  color:#818cf8;transition:all .15s;white-space:nowrap;
}
.vhint:hover{background:rgba(99,102,241,.2);color:#a5b4fc}

#vito-foot{padding:10px 11px;border-top:1px solid rgba(99,102,241,.15);display:flex;gap:8px;align-items:flex-end}
#vito-inp{
  flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(99,102,241,.25);
  border-radius:12px;padding:9px 12px;color:#e2e8f0;font-size:13px;
  resize:none;outline:none;line-height:1.4;max-height:80px;font-family:inherit;
  transition:border-color .2s;
}
#vito-inp::placeholder{color:#475569}
#vito-inp:focus{border-color:rgba(99,102,241,.5)}
#vito-send{
  background:#4338ca;border:none;border-radius:10px;
  width:36px;height:36px;cursor:pointer;color:white;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;transition:background .2s;
}
#vito-send:hover{background:#6366f1}
#vito-send:disabled{background:#374151;cursor:not-allowed}
#vito-setup{padding:16px;display:flex;flex-direction:column;gap:10px}
#vito-setup p{font-size:12px;color:#94a3b8;margin:0;line-height:1.5}
#vito-setup a{color:#818cf8;text-decoration:none}
#vito-setup a:hover{text-decoration:underline}
#vito-key-inp{
  width:100%;background:rgba(255,255,255,.05);
  border:1px solid rgba(99,102,241,.3);border-radius:10px;
  padding:9px 12px;color:#e2e8f0;font-size:12px;
  font-family:monospace;outline:none;
  transition:border-color .2s;
}
#vito-key-inp:focus{border-color:rgba(99,102,241,.6)}
#vito-key-inp::placeholder{color:#475569}
#vito-save-key{
  background:#4338ca;border:none;border-radius:10px;
  padding:9px 0;color:white;font-size:13px;font-weight:700;
  cursor:pointer;width:100%;transition:background .2s;
  font-family:inherit;
}
#vito-save-key:hover{background:#6366f1}
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
      <span class="vhint" onclick="VetoAI.suggest('Como imprimir etiquetas ZLP?')">🏷️ Etiquetas</span>
      <span class="vhint" onclick="VetoAI.suggest('Explica o Kanban da prateleira F')">📦 Kanban</span>
    </div>

    <!-- Setup da chave (mostrado quando não configurada) -->
    <div id="vito-setup" style="display:none">
      <p>Para usar o Vito, informe sua chave da API Groq.<br>
        Obtenha gratuitamente em <a href="https://console.groq.com" target="_blank">console.groq.com</a>
        → <strong>API Keys</strong> → <strong>Create API Key</strong>.<br><br>
        A chave é salva apenas no seu navegador (localStorage) e nunca vai para o código.
      </p>
      <input id="vito-key-inp" type="password" placeholder="gsk_..." autocomplete="off"/>
      <button id="vito-save-key" onclick="VetoAI.saveKey()">Salvar chave e começar</button>
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

  // ── Groq API (formato OpenAI) ──────────────────────────────────
  async function _ask(text) {
    // histórico no formato OpenAI: [{role:'user'|'assistant', content}]
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
    const fmt = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n/g,'<br>');
    div.innerHTML = role === 'bot'
      ? `<div class="vico">${_svg(28, true)}</div><div class="vbub bot">${fmt}</div>`
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

  // ── API pública ────────────────────────────────────────────────
  function toggle() {
    _open = !_open;
    const panel = document.getElementById('vito-panel');
    if (!panel) return;
    if (_open) {
      panel.classList.remove('v-hidden');
      if (_msgs.length === 0) {
        setTimeout(() => {
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

    // Detecta chave Groq digitada no chat
    if (text.startsWith('gsk_')) {
      localStorage.setItem('vito_groq_key', text);
      _hideSetup();
      _addMsg('bot', '✅ Chave salva com sucesso! Agora pode me perguntar o que quiser. 😄\n\n⚠️ Dica: não compartilhe sua chave com ninguém.');
      return;
    }

    // Sem chave configurada: mostra form de setup
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
        // cooldown: bloqueia por 60s sem retry automático
        _cooldownUntil = Date.now() + 60000;
        let secs = 60;
        const box = document.getElementById('vito-msgs');
        const el  = document.createElement('div');
        el.className = 'vmsg'; el.id = 'vito-cd-msg';
        el.innerHTML = `<div class="vico">${_svg(28,false)}</div>
          <div class="vbub bot">⏳ Limite da API atingido. Aguarde <strong id="vito-cd">${secs}s</strong> para perguntar novamente.</div>`;
        box.appendChild(el); box.scrollTop = box.scrollHeight;
        const iv = setInterval(() => {
          secs--;
          const cd = document.getElementById('vito-cd');
          if (cd) cd.textContent = secs + 's';
          if (secs <= 0) {
            clearInterval(iv);
            document.getElementById('vito-cd-msg')?.remove();
            _addMsg('bot', '✅ Pronto! Pode perguntar agora.');
          }
        }, 1000);
      }
      let msg;
      if (!CFG.key)
        msg = '⚠️ Chave não configurada! Abra o Vito e informe sua chave Groq.';
      else if (e.message === 'FORBIDDEN')
        msg = '🔑 Chave inválida. Verifique em **console.groq.com** → API Keys.';
      else if (e.message?.startsWith('ALL_FAILED_404'))
        msg = '⚠️ Erro na API Groq. Verifique sua chave em console.groq.com';
      else
        msg = 'Ops, não consegui conectar agora. 😅 Tenta em instantes!';
      _addMsg('bot', msg);
    } finally {
      _hideTyping();
      _busy = false;
      if (btn) btn.disabled = false;
    }
  }

  function suggest(text) {
    if (_busy) return; // ignora cliques duplos
    const inp = document.getElementById('vito-inp');
    if (inp) { inp.value = text; inp.focus(); }
    send();
  }

  function init() {
    if (document.getElementById('vito-root')) return;
    document.body.insertAdjacentHTML('beforeend', _html());
    const inp = document.getElementById('vito-inp');
    if (inp) inp.addEventListener('input', () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
    });
  }

  function _showSetup() {
    document.getElementById('vito-setup').style.display = 'flex';
    document.getElementById('vito-setup').style.flexDirection = 'column';
    document.getElementById('vito-hints').style.display = 'none';
    document.getElementById('vito-foot').style.display  = 'none';
    setTimeout(() => document.getElementById('vito-key-inp')?.focus(), 100);
  }

  function _hideSetup() {
    document.getElementById('vito-setup').style.display = 'none';
    document.getElementById('vito-hints').style.display = '';
    document.getElementById('vito-foot').style.display  = '';
  }

  function saveKey() {
    const inp = document.getElementById('vito-key-inp');
    const key = (inp?.value || '').trim();
    if (!key.startsWith('gsk_')) {
      inp.style.borderColor = '#ef4444';
      inp.placeholder = 'Chave inválida — deve começar com gsk_';
      return;
    }
    localStorage.setItem('vito_groq_key', key);
    _hideSetup();
    _addMsg('bot', '✅ Chave salva! Agora pode me perguntar o que quiser. 😄');
  }

  return { init, toggle, send, suggest, saveKey };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => VetoAI.init());
} else {
  VetoAI.init();
}
window.VetoAI = VetoAI;
console.log('✅ Vito carregado — Powered by Groq (Llama 3.1)!');
