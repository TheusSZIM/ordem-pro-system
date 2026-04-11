// ============================================
// KANBAN SHEETS — Prateleira F · ALM
// Layout fiel ao mapa físico por modelo
// ============================================

// ── MAPA FÍSICO DA PRATELEIRA F ──────────────────────────────────────────────
// Cada grupo define: posições, cor da faixa, classe CSS, nome do modelo
const MODELOS = [
    { nome:'FIREFLY',        pos:[1,2],         cor:'#93c5fd', cls:'m-firefly',    barColor:'#3b82f6' },
    { nome:'GM ASP',         pos:[3,4],         cor:'#86efac', cls:'m-gmasp',      barColor:'#22c55e' },
    { nome:'GM TURBO',       pos:[5,6],         cor:'#5eead4', cls:'m-gmturbo',    barColor:'#14b8a6' },
    { nome:'FRONT COVER',    pos:[7],           cor:'#67e8f9', cls:'m-frontcover', barColor:'#06b6d4' },
    { nome:'RENAULT',        pos:[8],           cor:'#a5b4fc', cls:'m-renault',    barColor:'#6366f1' },
    { nome:'HYUNDAI VOLUTA', pos:[9],           cor:'#fde047', cls:'m-hyundai',    barColor:'#eab308' },
    { nome:'HYUNDAI PRIME',  pos:[10],          cor:'#fca5a5', cls:'m-prime',      barColor:'#ef4444' },
    { nome:'MAN D08',        pos:[11],          cor:'#93c5fd', cls:'m-man',        barColor:'#2563eb' },
    { nome:'OUTROS',         pos:[12,13,14,15,16,17,18,19,20,21,22,23], cor:'#cbd5e1', cls:'m-outros', barColor:'#64748b' },
];

// Vagas bloqueadas (não são posições de kanban)
// Formato: 'F[nivel]-[pos]' — nível 10 não existe fisicamente / PORTAL em F1-18
const BLOQUEADAS = new Set(['F1-18']);
const NIVEL_SKIP = new Set([10]);  // nível 10 ausente no layout físico

// Mapa rápido pos → modelo
const POS_MODELO = {};
MODELOS.forEach(m => m.pos.forEach(p => POS_MODELO[p] = m));

const KS = {
    NIVEIS:   13,   // 0–12 (exceto 10)
    POSICOES: 23,
    LS_ESTOQUE:   'ks_url_estoque',
    LS_ESTRUTURA: 'ks_url_estrutura',
    grade: {},      // grade[nivel][pos] = item
    currentFilter: 'all',
};

// ── INIT ─────────────────────────────────────────────────────────────────────

function initKanban() {
    renderShelfSkeleton();
    const urlE = localStorage.getItem(KS.LS_ESTOQUE);
    const urlS = localStorage.getItem(KS.LS_ESTRUTURA);
    if (urlE) { setVal('sheets-url', urlE); setVal('cfg-sheets-url', urlE); }
    if (urlS)   setVal('cfg-struct-url', urlS);
    if (urlE) syncSheets(); else setSyncStatus('Configure o Google Sheets', 'neutral');
}

// ── SYNC ─────────────────────────────────────────────────────────────────────

async function syncSheets() {
    const urlE = (getVal('cfg-sheets-url') || getVal('sheets-url') || '').trim();
    const urlS = (getVal('cfg-struct-url') || '').trim();
    if (!urlE) { openSheetsConfig(); return; }

    setSyncStatus('Sincronizando…', 'loading');
    animateSyncIcon(true);
    try {
        const csvE = await fetchCSV(urlE);
        let minMax = {};
        if (urlS) { try { minMax = parseEstrutura(await fetchCSV(urlS)); } catch(_){} }

        KS.grade = parseEstoqueALM(csvE, minMax);
        renderShelf();
        updateStats();

        const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
        setSyncStatus('✓ Sincronizado', 'ok');
        setText('last-sync', `às ${now}`);
        localStorage.setItem(KS.LS_ESTOQUE, urlE);
        if (urlS) localStorage.setItem(KS.LS_ESTRUTURA, urlS);
    } catch(err) {
        console.error('[Kanban]', err);
        setSyncStatus(`Erro: ${err.message}`, 'error');
    }
    animateSyncIcon(false);
}

// ── FETCH + CSV ───────────────────────────────────────────────────────────────

async function fetchCSV(url) {
    const u = url.includes('output=csv') ? url
        : url.replace(/\/d\/([^/]+).*/, (_, id) =>
            `https://docs.google.com/spreadsheets/d/${id}/pub?output=csv`);
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
}

function parseCSVRows(csv) {
    return csv.trim().split('\n').map(line => {
        const cells = []; let cur = '', inQ = false;
        for (const ch of line) {
            if (ch==='"') inQ=!inQ;
            else if ((ch===','||ch===';') && !inQ) { cells.push(cur.trim()); cur=''; }
            else cur+=ch;
        }
        cells.push(cur.trim()); return cells;
    });
}

// ── PARSERS ───────────────────────────────────────────────────────────────────

function parseEstoqueALM(csv, minMax={}) {
    const rows = parseCSVRows(csv);
    if (rows.length < 2) return {};
    const h = rows[0].map(c=>(c||'').toLowerCase().trim());
    const fi = names => { for(const n of names){ const i=h.findIndex(c=>c.includes(n)); if(i>=0)return i; } return -1; };

    const iPN  = fi(['item']);
    const iDsc = fi(['descri','desc']);
    const iDep = fi(['dep']);
    const iLoc = fi(['localiz']);
    const iLot = fi(['lote']);
    const iUn  = fi(['un','unid']);
    const iQty = fi(['qtd liq','quantidade','qtd']);

    const grade = {};
    rows.slice(1).forEach(r => {
        if ((r[iDep]||'').trim().toUpperCase() !== 'ALM') return;
        const loc = (r[iLoc]||'').trim().toUpperCase();
        const p = parsePosicao(loc);
        if (!p) return;

        const { nivel, pos } = p;
        const qtd = parseQtd(r[iQty]);
        const pn  = (r[iPN]||'').trim();

        if (!grade[nivel]) grade[nivel] = {};
        if (!grade[nivel][pos]) {
            grade[nivel][pos] = {
                pn, desc:(r[iDsc]||'').trim(),
                qtd:0, un:(r[iUn]||'UN').trim(), lote:(r[iLot]||'').trim(),
                qtdMin: minMax[pn]?.qtdMin || 0,
                qtdMax: minMax[pn]?.qtdMax || 0,
            };
        }
        grade[nivel][pos].qtd += qtd;
    });
    return grade;
}

function parseEstrutura(csv) {
    const rows = parseCSVRows(csv);
    if (rows.length < 2) return {};
    const h = rows[0].map(c=>(c||'').toLowerCase().trim());
    const fi = names => { for(const n of names){ const i=h.findIndex(c=>c.includes(n)); if(i>=0)return i; } return -1; };
    const iPN=fi(['pn','item','cod']), iMn=fi(['min']), iMx=fi(['max']);
    const map = {};
    rows.slice(1).forEach(r => {
        const pn=(r[iPN]||'').trim();
        if(pn) map[pn]={qtdMin:parseQtd(r[iMn]),qtdMax:parseQtd(r[iMx])};
    });
    return map;
}

function parsePosicao(loc) {
    const m = loc.match(/^F(\d+)-0*(\d+)$/);
    if (!m) return null;
    const nivel=parseInt(m[1]), pos=parseInt(m[2]);
    if (nivel<0||nivel>12||pos<1||pos>23) return null;
    return {nivel,pos};
}

function parseQtd(v) {
    if (v==null||v==='') return 0;
    return parseFloat(String(v).replace(',','.')) || 0;
}

// ── RENDER ────────────────────────────────────────────────────────────────────

function renderShelfSkeleton() {
    const tbl = document.getElementById('shelf-table');
    if (!tbl) return;
    tbl.innerHTML = '';

    // Cabeçalho de modelos
    tbl.appendChild(buildModeloHeader());

    // Linhas skeleton
    for (let n=12; n>=0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.className = 'nivel-cell'; th.textContent = `F${n}`;
        tr.appendChild(th);
        for (let v=1; v<=KS.POSICOES; v++) {
            const td = document.createElement('td');
            td.className = `vaga skel ${POS_MODELO[v]?.cls||'m-outros'}`;
            td.style.opacity = '.35';
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
}

function renderShelf() {
    const tbl = document.getElementById('shelf-table');
    if (!tbl) return;
    tbl.innerHTML = '';
    tbl.appendChild(buildModeloHeader());

    let ok=0, low=0, empty=0, total=0;

    for (let n=12; n>=0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.className='nivel-cell'; th.textContent=`F${n}`;
        tr.appendChild(th);

        for (let v=1; v<=KS.POSICOES; v++) {
            const td = document.createElement('td');
            const modelo = POS_MODELO[v];
            const posKey = `F${n}-${v}`;
            const isBlocked = BLOQUEADAS.has(posKey);
            const item = KS.grade[n]?.[v];

            if (isBlocked) {
                td.className = `vaga m-blocked`;
                td.innerHTML = `<p style="font-size:9px;color:#64748b;text-align:center;margin-top:16px;font-weight:700;">PORTAL</p>`;
                td.title = 'Posição bloqueada';
            } else if (!item) {
                // Vaga livre — mostra cor do modelo mas vazia
                td.className = `vaga ${modelo?.cls||'m-outros'}`;
                td.dataset.filter = 'livre';
                td.innerHTML = `<div class="modelo-bar" style="background:${modelo?.barColor||'#64748b'}33"></div>`;
            } else {
                total++;
                const {pn, desc, qtd, qtdMin, un, lote} = item;
                const pct  = qtdMin>0 ? qtd/qtdMin : 1;
                let estado, qtyBg, qtyColor;
                if      (qtd<=0)    { estado='empty'; qtyBg='rgba(239,68,68,.2)';   qtyColor='#f87171'; empty++; }
                else if (pct<=.3)   { estado='low';   qtyBg='rgba(245,158,11,.2)';  qtyColor='#fbbf24'; low++;   }
                else                { estado='ok';     qtyBg='rgba(16,185,129,.2)';  qtyColor='#34d399'; ok++;    }

                td.className   = `vaga ocupada ${modelo?.cls||'m-outros'} s-${estado}`;
                td.dataset.filter  = estado;
                td.dataset.pn      = pn.toLowerCase();
                td.onclick = () => openKanbanDetail({pn,desc,un,qtdMin,qtdMax:item.qtdMax,
                    posicao:`F${n}-${String(v).padStart(2,'0')}`, modelo:modelo?.nome||'—'},
                    {quantidade:qtd,lote});

                td.innerHTML = `
                  <div class="modelo-bar" style="background:${modelo?.barColor||'#64748b'}"></div>
                  <p style="font-size:9px;font-weight:700;color:#cbd5e1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-top:5px;">${pn}</p>
                  <p style="font-size:7.5px;color:#94a3b8;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${desc.slice(0,22)}</p>
                  <span class="qty-badge" style="background:${qtyBg};color:${qtyColor};">${qtd%1===0?qtd:qtd.toFixed(1)}</span>
                  <div class="vaga-tip">
                    <b>${pn}</b> · ${modelo?.nome||'—'}<br>
                    ${desc.slice(0,40)}<br>
                    Qty: <b>${qtd} ${un}</b>${qtdMin?` / mín ${qtdMin}`:''}<br>
                    Pos: F${n}-${String(v).padStart(2,'0')} · ${lote||'sem lote'}<br>
                    ${estado==='empty'?'🔴 Repor agora':estado==='low'?'🟡 Nível baixo':'🟢 Ok'}
                  </div>`;
            }

            td.dataset.nivel = n;
            td.dataset.vaga  = v;
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }

    setText('ks-total', total);
    setText('ks-ok',    ok);
    setText('ks-low',   low);
    setText('ks-empty', empty);
    applyFilter(KS.currentFilter);
}

/** Linha de cabeçalho com nomes de modelos e colspan */
function buildModeloHeader() {
    const tr = document.createElement('tr');
    // célula vazia (coluna de nível)
    const th0 = document.createElement('th');
    th0.style.cssText = 'width:42px;min-width:42px;';
    tr.appendChild(th0);

    MODELOS.forEach(m => {
        const th = document.createElement('th');
        th.colSpan = m.pos.length;
        th.style.paddingBottom = '6px';
        th.innerHTML = `
          <div class="modelo-header"
               style="background:${m.cor}22;color:${m.barColor};border:1px solid ${m.barColor}44;
                      ${m.nome==='OUTROS'?'opacity:.5;':''}">
            ${m.nome}
          </div>`;
        tr.appendChild(th);
    });
    return tr;
}

// ── FILTRO ────────────────────────────────────────────────────────────────────

function filterKanban(type) {
    KS.currentFilter = type;
    document.querySelectorAll('.kf-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.filter===type));
    applyFilter(type);
}

function applyFilter(type) {
    const q = (document.getElementById('kanban-search')?.value||'').toLowerCase();
    document.querySelectorAll('td.vaga').forEach(td => {
        const f  = td.dataset.filter||'';
        const pn = td.dataset.pn||'';
        let show = true;
        if      (type==='search') show = !!pn && pn.includes(q);
        else if (type!=='all')    show = f===type;
        td.style.opacity       = show ? '1' : '0.1';
        td.style.pointerEvents = show ? 'auto' : 'none';
    });
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────

function openKanbanDetail(k, stock) {
    const qty = stock.quantidade||0;
    const pct = k.qtdMin>0 ? Math.round((qty/k.qtdMin)*100) : 100;
    const cor = qty<=0 ? 'bg-rose-500' : pct<=30 ? 'bg-amber-500' : 'bg-emerald-500';
    const est = qty<=0 ? '🔴 Repor agora' : pct<=30 ? '🟡 Nível baixo' : '🟢 Ok';
    const barMod = (POS_MODELO[parseInt((k.posicao||'F0-0').split('-')[1])]||{}).barColor||'#6366f1';

    setText('kd-pn', k.pn);
    document.getElementById('kd-modelo').innerHTML =
        `<span style="color:${barMod};font-weight:700;">${k.modelo}</span> · ${k.posicao}`;

    document.getElementById('kd-body').innerHTML = `
      <p class="text-xs text-slate-400">${k.desc}</p>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400">Status</p>
          <p class="font-semibold text-sm">${est}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400">Unidade</p>
          <p class="font-bold text-slate-900 dark:text-white">${k.un}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400">Qtd atual</p>
          <p class="font-bold text-slate-900 dark:text-white text-xl">${qty}</p>
        </div>
        ${k.qtdMin ? `
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400">Mínimo</p>
          <p class="font-bold text-slate-900 dark:text-white text-xl">${k.qtdMin}</p>
        </div>` : '<div></div>'}
      </div>
      ${k.qtdMin ? `
      <div>
        <div class="flex justify-between text-xs text-slate-400 mb-1"><span>Estoque</span><span>${pct}%</span></div>
        <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full ${cor} transition-all duration-700" style="width:${Math.min(pct,100)}%"></div>
        </div>
      </div>` : ''}
      ${stock.lote ? `<p class="text-xs text-slate-400">Lote: <b class="text-slate-600 dark:text-slate-300">${stock.lote}</b></p>` : ''}`;

    const modal=document.getElementById('kanban-detail-modal');
    const cont =document.getElementById('kanban-detail-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{ cont.style.transform='scale(1)'; cont.style.opacity='1'; });
}

function closeKanbanDetail() {
    const modal=document.getElementById('kanban-detail-modal');
    const cont =document.getElementById('kanban-detail-content');
    cont.style.transform='scale(.95)'; cont.style.opacity='0';
    setTimeout(()=>{ modal.classList.add('hidden'); cont.style.transform='scale(.95)'; },250);
}

// ── CONFIG ────────────────────────────────────────────────────────────────────

function openSheetsConfig() {
    setVal('cfg-sheets-url', localStorage.getItem(KS.LS_ESTOQUE)||'');
    setVal('cfg-struct-url', localStorage.getItem(KS.LS_ESTRUTURA)||'');
    const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');
    m.classList.remove('hidden');
    requestAnimationFrame(()=>{ c.style.transform='scale(1)'; c.style.opacity='1'; });
}

function closeSheetsConfig() {
    const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');
    c.style.transform='scale(.95)'; c.style.opacity='0';
    setTimeout(()=>{ m.classList.add('hidden'); c.style.transform='scale(.95)'; },250);
}

function saveSheetsConfig() { closeSheetsConfig(); syncSheets(); }
function updateStats() {}  // integrado no renderShelf

// ── HELPERS ───────────────────────────────────────────────────────────────────

function setSyncStatus(msg, type) {
    const e=document.getElementById('sync-status'); if(!e)return;
    const c={ok:'text-emerald-500',error:'text-rose-500',loading:'text-slate-400',neutral:'text-slate-400'};
    e.className=`font-medium ${c[type]||'text-slate-400'}`; e.textContent=msg;
}
function setText(id,v){ const e=document.getElementById(id); if(e) e.textContent=v??'—'; }
function getVal(id){ return document.getElementById(id)?.value||''; }
function setVal(id,v){ const e=document.getElementById(id); if(e) e.value=v; }
function animateSyncIcon(on){ const i=document.getElementById('sync-icon'); if(i) i.style.animation=on?'spin 1s linear infinite':''; }

// ── EXPOSE ────────────────────────────────────────────────────────────────────

window.initKanban=initKanban; window.syncSheets=syncSheets;
window.filterKanban=filterKanban; window.openSheetsConfig=openSheetsConfig;
window.closeSheetsConfig=closeSheetsConfig; window.saveSheetsConfig=saveSheetsConfig;
window.openKanbanDetail=openKanbanDetail; window.closeKanbanDetail=closeKanbanDetail;

document.addEventListener('pageChanged', e=>{ if(e.detail==='kanban') initKanban(); });
console.log('✅ kanban-sheets.js — Mapa físico com modelos!');
