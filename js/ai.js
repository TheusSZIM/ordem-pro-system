/**
 * js/ai.js — Vito · Assistente IA do Ordem Pro
 * Vetore Movimentação · Powered by Google Gemini (gratuito)
 *
 * SETUP:
 * 1. Acesse aistudio.google.com → "Get API Key" → copie a chave
 * 2. Cole no campo CFG.key abaixo
 * 3. Adicione <script src="js/ai.js"></script> no final do index.html
 */

const VetoAI = (() => {

  let _open = false;
  let _msgs = []; // formato Gemini: [{role, parts:[{text}]}]
  let _busy = false;

  // ── Configuração ────────────────────────────────────────────────
  const CFG = {
    key:       'AIzaSyCHGuI3ihk5LAwnvutTQga66ZkAqOSVBwU', // → aistudio.google.com
    model:     'gemini-1.5-flash-latest',
    maxTokens: 600,
    histMax:   16,
  };

  // ── Contexto dinâmico do sistema ────────────────────────────────
  function _ctx() {
    const o = window.state?.orders || [];
    const stats = {
      total:    o.length,
      pending:  o.filter(x => x.status === 'pending').length,
      prog:     o.filter(x => ['progress','in_progress'].includes(x.status)).length,
      done:     o.filter(x => x.status === 'completed').length,
      deliv:    o.filter(x => x.status === 'delivered').length,
    };
    const recent = o.slice(0,5).map(x =>
      `Lote ${x.lote||'—'} · ${x.product||'—'} · ${x.status}`
    ).join('\n') || 'Nenhuma ordem carregada';

    return `Você é o Vito, assistente inteligente do Ordem Pro — sistema de controle de ordens de separação da Vetore Movimentação.
Você é descontraído, amigável e direto. Fale em português do Brasil de forma casual mas profissional.
Use emojis com moderação. Seja conciso. Se não souber algo, seja honesto.

📊 STATUS ATUAL:
Total: ${stats.total} | A separar: ${stats.pending} | Em separação: ${stats.prog} | Concluídas: ${stats.done} | Entregues: ${stats.deliv}

📋 ÚLTIMAS ORDENS:
${recent}

🏭 SISTEMA:
- Ordens: status pending/in_progress/completed/delivered
- Kanban: prateleira F (Firefly, GM ASP, GM Turbo, Front Cover, Renault, Hyundai Voluta/Prime, MAN D08)
- Etiquetas ZLP para volumes, campos: lote, produto, quantidade, separador
- Usuários: níveis 0 (Visualizador) a 3 (Admin)
- Stack: HTML + Vanilla JS + Tailwind + Supabase + Vercel

Ajude com: buscar/explicar ordens, status, funcionalidades do sistema, operações de armazém.`;
  }

  // ── SVG do Vito (robô forklift fofo) ───────────────────────────
  function _svg(size, talking) {
    const t = talking ? true : false;
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vbg${size}" cx="38%" cy="32%">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#4338ca"/>
        </radialGradient>
      </defs>
      <!-- Rodas -->
      <ellipse cx="30" cy="88" rx="11" ry="6" fill="#1e1b4b" opacity="0.75"/>
      <ellipse cx="70" cy="88" rx="11" ry="6" fill="#1e1b4b" opacity="0.75"/>
      <ellipse cx="30" cy="87" rx="8"  ry="4" fill="#312e81" opacity="0.6"/>
      <ellipse cx="70" cy="87" rx="8"  ry="4" fill="#312e81" opacity="0.6"/>
      <!-- Garfo esquerdo -->
      <rect x="2"  y="52" width="17" height="4.5" rx="2" fill="#6366f1"/>
      <rect x="2"  y="62" width="17" height="4.5" rx="2" fill="#6366f1"/>
      <rect x="2"  y="48" width="9"  height="23"  rx="2" fill="#4f46e5"/>
      <rect x="1"  y="48" width="4"  height="23"  rx="2" fill="#818cf8" opacity="0.4"/>
      <!-- Corpo/chassi -->
      <rect x="14" y="50" width="72" height="36" rx="10" fill="url(#vbg${size})"/>
      <rect x="18" y="54" width="64" height="28" rx="8"  fill="#4338ca" opacity="0.4"/>
      <!-- Acento decorativo chassis -->
      <rect x="20" y="60" width="60" height="3"  rx="1.5" fill="white" opacity="0.06"/>
      <rect x="20" y="70" width="40" height="2"  rx="1"   fill="white" opacity="0.05"/>
      <!-- Cabeça -->
      <rect x="16" y="12" width="68" height="42" rx="12" fill="url(#vbg${size})"/>
      <!-- Visor escuro -->
      <rect x="20" y="16" width="60" height="34" rx="9"  fill="#0f0c29"/>
      <!-- Olhos brancos -->
      <circle cx="37" cy="34" r="10" fill="white"/>
      <circle cx="63" cy="34" r="10" fill="white"/>
      <!-- Íris -->
      <circle cx="39" cy="34" r="6" fill="#312e81"/>
      <circle cx="65" cy="34" r="6" fill="#312e81"/>
      <!-- Pupilas -->
      <circle cx="40" cy="34" r="3.5" fill="#0f0c29"/>
      <circle cx="66" cy="34" r="3.5" fill="#0f0c29"/>
      <!-- Brilho olhos -->
      <circle cx="37" cy="30" r="2.5" fill="white" opacity="0.92"/>
      <circle cx="63" cy="30" r="2.5" fill="white" opacity="0.92"/>
      <circle cx="42" cy="37" r="1"   fill="white" opacity="0.5"/>
      <circle cx="68" cy="37" r="1"   fill="white" opacity="0.5"/>
      <!-- Boca -->
      ${t
        ? '<ellipse cx="50" cy="47" rx="8" ry="5" fill="#312e81"/><rect x="43" y="44" width="14" height="2" rx="1" fill="white" opacity="0.15"/>'
        : '<path d="M41 47 Q50 53 59 47" stroke="#312e81" stroke-width="2.5" fill="none" stroke-linecap="round"/>'}
      <!-- Badge VT -->
      <rect x="40" y="74" width="20" height="9" rx="4" fill="rgba(255,255,255,0.12)"/>
      <text x="50" y="81" text-anchor="middle" fill="white" font-size="7" font-weight="bold" font-family="sans-serif" opacity="0.95">VT</text>
      <!-- Antena -->
      <rect x="48" y="4" width="4" height="10" rx="2" fill="#6366f1"/>
      <circle cx="50" cy="4" r="4" fill="#a5b4fc"/>
      <circle cx="50" cy="4" r="2" fill="white" opacity="0.8"/>
    </svg>`;
  }

  // ── CSS do widget ───────────────────────────────────────────────
  const _CSS = `
#vito-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
@keyframes vito-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes vito-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.45)} 70%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
@keyframes vito-in    { from{opacity:0;transform:translateY(18px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes vito-dot   { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
@keyframes vito-talk  { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.1)} }

#vito-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 9100;
  width: 68px; height: 68px; border-radius: 50%;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  filter: drop-shadow(0 6px 18px rgba(99,102,241,.55));
  animation: vito-pulse 2.8s ease-in-out infinite;
  transition: transform .2s;
}
#vito-fab:hover { transform: scale(1.1); }
#vito-fab-anim  { animation: vito-bob 2.2s ease-in-out infinite; }

#vito-panel {
  position: fixed; bottom: 106px; right: 24px; z-index: 9099;
  width: 340px; display: flex; flex-direction: column;
  background: #0a0f1e; border: 1px solid rgba(99,102,241,.35);
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.1);
  animation: vito-in .3s cubic-bezier(.16,1,.3,1);
}
#vito-panel.v-hidden { display: none; }

#vito-head {
  display: flex; align-items: center; gap: 10px;
  padding: 13px 15px;
  background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(67,56,202,.1));
  border-bottom: 1px solid rgba(99,102,241,.18);
}
#vito-head-avatar { flex-shrink: 0; animation: vito-bob 2.2s ease-in-out infinite; }
#vito-head-info   { flex: 1; }
#vito-head-name   { font-size: 14px; font-weight: 800; color: #e2e8f0; margin: 0; line-height: 1.2; }
#vito-head-sub    {
  font-size: 10px; color: #6366f1; margin: 0;
  display: flex; align-items: center; gap: 4px;
}
#vito-head-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #10b981; display: inline-block;
  box-shadow: 0 0 5px #10b981;
}
#vito-close-btn {
  background: transparent; border: none; cursor: pointer;
  color: #475569; padding: 4px; border-radius: 8px;
  display: flex; align-items: center; transition: color .2s, background .2s;
}
#vito-close-btn:hover { color: #f1f5f9; background: rgba(255,255,255,.06); }

#vito-msgs {
  flex: 1; overflow-y: auto; padding: 12px 13px;
  display: flex; flex-direction: column; gap: 8px;
  max-height: 320px; min-height: 120px;
  scrollbar-width: thin; scrollbar-color: rgba(99,102,241,.3) transparent;
}
.vmsg { display: flex; gap: 7px; animation: vito-in .22s ease; }
.vmsg.u { flex-direction: row-reverse; }
.vbub {
  max-width: 82%; padding: 9px 13px; font-size: 13px;
  line-height: 1.55; word-break: break-word;
}
.vbub.bot {
  background: rgba(99,102,241,.13); color: #c7d2fe;
  border: 1px solid rgba(99,102,241,.2);
  border-radius: 4px 14px 14px 14px;
}
.vbub.usr {
  background: #4338ca; color: white;
  border-radius: 14px 4px 14px 14px;
}
.vico { width: 26px; height: 26px; flex-shrink: 0; margin-top: 3px; }
.vtyping {
  display: flex; align-items: center; gap: 5px; padding: 10px 13px;
}
.vdot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #6366f1; animation: vito-dot 1.2s ease-in-out infinite;
}
.vdot:nth-child(2) { animation-delay: .2s; }
.vdot:nth-child(3) { animation-delay: .4s; }

#vito-hints {
  padding: 4px 12px 8px; display: flex; flex-wrap: wrap; gap: 4px;
  border-top: 1px solid rgba(99,102,241,.1);
}
.vhint {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 4px 10px; border-radius: 20px; font-size: 11px; cursor: pointer;
  border: 1px solid rgba(99,102,241,.28); background: rgba(99,102,241,.07);
  color: #818cf8; transition: all .15s; white-space: nowrap;
}
.vhint:hover { background: rgba(99,102,241,.2); color: #a5b4fc; }

#vito-foot {
  padding: 10px 11px;
  border-top: 1px solid rgba(99,102,241,.15);
  display: flex; gap: 8px; align-items: flex-end;
}
#vito-inp {
  flex: 1; background: rgba(255,255,255,.05);
  border: 1px solid rgba(99,102,241,.25); border-radius: 12px;
  padding: 9px 12px; color: #e2e8f0; font-size: 13px;
  resize: none; outline: none; line-height: 1.4;
  max-height: 80px; font-family: inherit;
  transition: border-color .2s;
}
#vito-inp::placeholder { color: #475569; }
#vito-inp:focus        { border-color: rgba(99,102,241,.5); }
#vito-send {
  background: #4338ca; border: none; border-radius: 10px;
  width: 36px; height: 36px; cursor: pointer; color: white; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
#vito-send:hover    { background: #6366f1; }
#vito-send:disabled { background: #374151; cursor: not-allowed; }
`;

  // ── HTML do widget ──────────────────────────────────────────────
  function _html() {
    return `
<style>${_CSS}</style>
<div id="vito-root">
  <!-- FAB -->
  <button id="vito-fab" onclick="VetoAI.toggle()" title="Vito — Assistente Vetore">
    <div id="vito-fab-anim">${_svg(62, false)}</div>
  </button>

  <!-- Painel de chat -->
  <div id="vito-panel" class="v-hidden">

    <!-- Header -->
    <div id="vito-head">
      <div id="vito-head-avatar">${_svg(38, false)}</div>
      <div id="vito-head-info">
        <p id="vito-head-name">Vito</p>
        <p id="vito-head-sub">
          <span id="vito-head-dot"></span>
          Assistente Vetore · online
        </p>
      </div>
      <button id="vito-close-btn" onclick="VetoAI.toggle()">
        <span class="material-symbols-rounded" style="font-size:18px">close</span>
      </button>
    </div>

    <!-- Mensagens -->
    <div id="vito-msgs"></div>

    <!-- Sugestões rápidas -->
    <div id="vito-hints">
      <span class="vhint" onclick="VetoAI.suggest('Qual o status das ordens agora?')">📊 Status</span>
      <span class="vhint" onclick="VetoAI.suggest('Como iniciar uma separação?')">🚀 Iniciar sep.</span>
      <span class="vhint" onclick="VetoAI.suggest('Como imprimir as etiquetas ZLP?')">🏷️ Etiquetas</span>
      <span class="vhint" onclick="VetoAI.suggest('Me explica o Kanban da prateleira F')">📦 Kanban</span>
    </div>

    <!-- Input -->
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

  // ── Chamada Gemini ──────────────────────────────────────────────
  async function _ask(text) {
    _msgs.push({ role: 'user', parts: [{ text }] });
    if (_msgs.length > CFG.histMax) _msgs = _msgs.slice(-CFG.histMax);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${CFG.model}:generateContent?key=${CFG.key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: _ctx() }] },
          contents: _msgs,
          generationConfig: { maxOutputTokens: CFG.maxTokens, temperature: 0.75 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);
    const data  = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Hmm, não consegui uma resposta. 😅 Tenta de novo?';

    _msgs.push({ role: 'model', parts: [{ text: reply }] });
    return reply;
  }

  // ── Helpers DOM ─────────────────────────────────────────────────
  function _appendMsg(role, text) {
    const box  = document.getElementById('vito-msgs');
    const div  = document.createElement('div');
    div.className = `vmsg ${role === 'bot' ? '' : 'u'}`;

    // formata negrito e quebras de linha
    const fmt = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    if (role === 'bot') {
      div.innerHTML = `
        <div class="vico">${_svg(26, true)}</div>
        <div class="vbub bot">${fmt}</div>`;
    } else {
      div.innerHTML = `<div class="vbub usr">${fmt}</div>`;
    }
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function _showTyping() {
    const box = document.getElementById('vito-msgs');
    const el  = document.createElement('div');
    el.id = 'vito-typ';
    el.className = 'vmsg';
    el.innerHTML = `
      <div class="vico">${_svg(26, false)}</div>
      <div class="vbub bot vtyping">
        <div class="vdot"></div><div class="vdot"></div><div class="vdot"></div>
      </div>`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function _hideTyping() {
    document.getElementById('vito-typ')?.remove();
  }

  // ── API pública ─────────────────────────────────────────────────
  function toggle() {
    _open = !_open;
    const panel = document.getElementById('vito-panel');
    if (!panel) return;

    if (_open) {
      panel.classList.remove('v-hidden');
      // Boas-vindas na primeira abertura
      if (_msgs.length === 0) {
        setTimeout(() => {
          const cnt = (window.state?.orders || []).length;
          _appendMsg('bot',
            `Oi! 👋 Sou o **Vito**, seu assistente aqui no Ordem Pro!\n\nAgora temos **${cnt} ordens** no sistema. Como posso ajudar?`
          );
        }, 280);
      }
      setTimeout(() => document.getElementById('vito-inp')?.focus(), 360);
    } else {
      panel.classList.add('v-hidden');
    }
  }

  async function send() {
    if (_busy) return;
    const inp  = document.getElementById('vito-inp');
    const text = (inp?.value || '').trim();
    if (!text) return;

    inp.value = '';
    inp.style.height = 'auto';
    _appendMsg('user', text);
    _busy = true;

    const btn = document.getElementById('vito-send');
    if (btn) btn.disabled = true;
    _showTyping();

    try {
      const reply = await _ask(text);
      _hideTyping();
      _appendMsg('bot', reply);
    } catch (err) {
      _hideTyping();
      console.error('[Vito]', err);
      if (CFG.key === 'SUA_CHAVE_GEMINI_AQUI') {
        _appendMsg('bot', '⚠️ Chave da API não configurada!\n\nAcesse **aistudio.google.com** → "Get API Key" e cole no campo `CFG.key` do arquivo `js/ai.js`.');
      } else {
        _appendMsg('bot', 'Ops, não consegui conectar agora. 😅 Tenta em instantes!');
      }
    } finally {
      _busy = false;
      if (btn) btn.disabled = false;
    }
  }

  function suggest(text) {
    const inp = document.getElementById('vito-inp');
    if (inp) { inp.value = text; inp.focus(); }
    send();
  }

  function init() {
    if (document.getElementById('vito-root')) return;
    document.body.insertAdjacentHTML('beforeend', _html());

    // Auto-resize textarea
    const inp = document.getElementById('vito-inp');
    if (inp) {
      inp.addEventListener('input', () => {
        inp.style.height = 'auto';
        inp.style.height = Math.min(inp.scrollHeight, 80) + 'px';
      });
    }
  }

  return { init, toggle, send, suggest };

})();

// ── Auto-init ──────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => VetoAI.init());
} else {
  VetoAI.init();
}

window.VetoAI = VetoAI;
console.log('✅ Vito carregado — Assistente IA do Ordem Pro!');
