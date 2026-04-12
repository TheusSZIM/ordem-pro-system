// ============================================================
// KANBAN SHEETS — Prateleira F · ALM
// Lógica por estrutura de cada modelo
// ============================================================

// ── ESTRUTURAS DOS MODELOS ───────────────────────────────────
// Cada PN tem: desc (descrição), mult (múltiplo por kanban)
const ESTRUTURAS = {
    'FIREFLY': [
        { pn:'20.001.3192', desc:'Rolamento B.Agua WB1630064 Firefly',    mult:1 },
        { pn:'20.002.1918', desc:'Selo Mecanico 94539',                    mult:1 },
        { pn:'20.007.2820', desc:'Anel Elástico 14,2X1,6',                mult:1 },
        { pn:'20.004.0001', desc:'Acoplamento Sinterizado',                mult:1 },
        { pn:'20.003.0016', desc:'O\'ring Ø34,59±0,37',                   mult:1 },
        { pn:'20.003.0002', desc:'Junta Ø45,6X3,62',                      mult:1 },
    ],
    'GM ASP': [
        { pn:'20.003.3297', desc:'Junta Voluta',                           mult:1 },
        { pn:'20.003.3298', desc:'Junta Saida Voluta',                     mult:1 },
        { pn:'20.006.3299', desc:'Nipple Inox Ø20',                        mult:1 },
        { pn:'20.008.3289', desc:'Tampao Inox Ø32',                        mult:1 },
        { pn:'20.003.3295', desc:'Junta Carcaca Bomba D\'Agua',            mult:1 },
        { pn:'16.400.3029', desc:'Rotor PPS Ø46 GM Aspirado',             mult:1 },
        { pn:'20.001.3339', desc:'Rolamento Lip Seal HNBR CSS Prime',      mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',                    mult:1 },
        { pn:'20.007.4288', desc:'Parafuso Hexalobular M5X24,5',           mult:1 },
        { pn:'20.004.2520', desc:'Flange Sinterizada GM',                  mult:1 },
    ],
    'GM TURBO': [
        { pn:'20.003.3297', desc:'Junta Voluta',                           mult:1 },
        { pn:'20.003.3298', desc:'Junta Saida Voluta',                     mult:1 },
        { pn:'20.006.3299', desc:'Nipple Inox Ø20',                        mult:1 },
        { pn:'20.008.3289', desc:'Tampao Inox Ø32',                        mult:1 },
        { pn:'20.003.3295', desc:'Junta Carcaca Bomba D\'Agua',            mult:1 },
        { pn:'16.400.3292', desc:'Rotor PPS Ø51,5 GM Turbo',              mult:1 },
        { pn:'20.001.3340', desc:'Rolamento Lip Seal FKM WR1630106',       mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',                    mult:1 },
        { pn:'20.007.4300', desc:'Parafuso Hexalobular M6x16',             mult:1 },
        { pn:'20.007.4288', desc:'Parafuso Hexalobular M5X24,5',           mult:1 },
        { pn:'20.004.2520', desc:'Flange Sinterizada GM',                  mult:1 },
        { pn:'20.003.3296', desc:'Junta Cooler',                           mult:1 },
    ],
    'FRONT COVER': [
        { pn:'20.007.3403', desc:'Parafuso M6X16 10.9 SOCKET T30',        mult:4  },
        { pn:'20.007.3404', desc:'Parafuso M8X28 10.9 SOCKET T30',        mult:4  },
        { pn:'20.005.3414', desc:'Anel Externo Front Cover',               mult:11 },
        { pn:'20.005.0005', desc:'Palheta',                                mult:2  },
        { pn:'20.006.3418', desc:'Bucha Guia Front Cover',                 mult:1  },
        { pn:'20.009.0001', desc:'Mola - Anel Externo',                    mult:1  },
        { pn:'20.003.3419', desc:'Anel Vedação PTFE-GF20',                 mult:1  },
        { pn:'20.003.0010', desc:'Junta de Deslizamento FKM',              mult:1  },
        { pn:'20.006.3420', desc:'Válvula SAE 8620',                       mult:1  },
        { pn:'20.009.0002', desc:'Mola - Válvula',                         mult:1  },
        { pn:'20.007.3408', desc:'Parafuso Bujão 8.8 M16 X 1,5',          mult:1  },
        { pn:'20.007.3409', desc:'Parafuso M5x15 10.9',                    mult:1  },
        { pn:'20.010.0001', desc:'Eletroválvula c/ O\'ring Ø9,5x1,5',     mult:1  },
        { pn:'20.009.0003', desc:'Mola - Válvula de Segurança',            mult:1  },
        { pn:'20.006.3416', desc:'Esfera G Cr15',                          mult:1  },
        { pn:'20.003.0012', desc:'Retentor PTFE/ACM c/ Capa Proteção',     mult:1  },
        { pn:'20.003.3422', desc:'Junta HNBR (J727)',                      mult:2  },
        { pn:'20.005.3427', desc:'Anel da Palheta (VANE RING VDOP)',       mult:1  },
        { pn:'20.007.4635', desc:'Parafuso Tampão Vedação M6 - FC',        mult:2  },
        { pn:'21.008.9950', desc:'Tampão Ø14',                             mult:1  },
        { pn:'20.008.1750', desc:'Tampa Respiro Ø7',                       mult:1  },
    ],
    'RENAULT': [
        { pn:'20.001.3114', desc:'Rolamento WR1630075-3 BR10',             mult:1 },
        { pn:'20.008.9950', desc:'Tampao Ø14',                             mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',                    mult:1 },
        { pn:'16.400.0662', desc:'Rotor PPS Renault BR10',                 mult:1 },
    ],
    'HYUNDAI VOLUTA': [
        { pn:'20.003.7011', desc:'Junta Saida Voluta - HNBR',              mult:1 },
        { pn:'20.006.7010', desc:'Pino Guia MPI FFV',                      mult:2 },
        { pn:'20.006.7015', desc:'Nipple de Aquecimento Ø20',              mult:1 },
        { pn:'20.007.7010', desc:'Parafuso M8 x 16 10.9 fl. hex.',        mult:4 },
        { pn:'20.007.7011', desc:'Parafuso M6 x 25 8.8 fl. hex.',         mult:6 },
        { pn:'20.007.7012', desc:'Parafuso M6 x 14 8.8 fl. hex.',         mult:1 },
        { pn:'20.004.7010', desc:'Polia MPI FFV',                          mult:1 },
        { pn:'22.010.7010', desc:'Sensor de Temperatura 39220-2M425',      mult:1 },
    ],
    'HYUNDAI PRIME': [
        { pn:'16.400.7010', desc:'Rotor PPS MPI FFV Hyundai',             mult:1 },
        { pn:'20.001.7010', desc:'Rolamento WZ1630075 MPI FFV',            mult:1 },
        { pn:'20.002.1918', desc:'Selo Mecanico 94539',                    mult:1 },
        { pn:'20.003.7010', desc:'Junta de metal 0.3t JZ3020 MPI FFV',    mult:1 },
        { pn:'20.004.7015', desc:'Flange Sinterizada MPI FFV SMF4050',     mult:1 },
        { pn:'20.008.7010', desc:'Tampão Ø16 MPI FFV - AÇO 1008',        mult:1 },
    ],
    'MAN D08': [
        { pn:'20.001.1787', desc:'Rolamento WR2555127-1 MAN D08',          mult:1 },
        { pn:'20.002.2483', desc:'Selo Mecanico MAN 933 025 00',           mult:1 },
        { pn:'20.007.0444', desc:'Anel elastico EBI55',                    mult:1 },
        { pn:'25.003.2302', desc:'Saco Plastico VCI 350x400x60 Azul',      mult:1 },
        { pn:'20.008.0662', desc:'Tampa respiro Ø20.188 DIN443 A',         mult:1 },
    ],
};

// ── MAPA FÍSICO ──────────────────────────────────────────────
const MODELOS = [
    { nome:'FIREFLY',        pos:[1,2],  cor:'#93c5fd', cls:'m-firefly',    barColor:'#3b82f6' },
    { nome:'GM ASP',         pos:[3,4],  cor:'#86efac', cls:'m-gmasp',      barColor:'#22c55e' },
    { nome:'GM TURBO',       pos:[5,6],  cor:'#5eead4', cls:'m-gmturbo',    barColor:'#14b8a6' },
    { nome:'FRONT COVER',    pos:[7],    cor:'#67e8f9', cls:'m-frontcover', barColor:'#06b6d4' },
    { nome:'RENAULT',        pos:[8],    cor:'#a5b4fc', cls:'m-renault',    barColor:'#6366f1' },
    { nome:'HYUNDAI VOLUTA', pos:[9],    cor:'#fde047', cls:'m-hyundai',    barColor:'#eab308' },
    { nome:'HYUNDAI PRIME',  pos:[10],   cor:'#fca5a5', cls:'m-prime',      barColor:'#ef4444' },
    { nome:'MAN D08',        pos:[11],   cor:'#93c5fd', cls:'m-man',        barColor:'#2563eb' },
];

const NIVEL_SKIP = new Set([10]);
const POS_MODELO = {};
MODELOS.forEach(m => m.pos.forEach(p => POS_MODELO[p] = m));

const KS = {
    POSICOES: 11,
    LS_ESTOQUE:   'ks_url_estoque',
    LS_ESTRUTURA: 'ks_url_estrutura',
    // grade[nivel][pos] = { pns: {pn: qtd}, estranhos: [{pn,qtd}] }
    grade: {},
    currentFilter: 'all',
};

// ── INIT ─────────────────────────────────────────────────────

function initKanban() {
    renderShelfSkeleton();
    const urlE = localStorage.getItem(KS.LS_ESTOQUE);
    const urlS = localStorage.getItem(KS.LS_ESTRUTURA);
    if (urlE) { setVal('sheets-url', urlE); setVal('cfg-sheets-url', urlE); }
    if (urlS)   setVal('cfg-struct-url', urlS);
    if (urlE) syncSheets(); else setSyncStatus('Configure o Google Sheets', 'neutral');
}

// ── SYNC ─────────────────────────────────────────────────────

async function syncSheets() {
    const urlE = (getVal('cfg-sheets-url') || getVal('sheets-url') || '').trim();
    if (!urlE) { openSheetsConfig(); return; }

    setSyncStatus('Sincronizando…', 'loading');
    animateSyncIcon(true);
    try {
        const csvE = await fetchCSV(urlE);
        KS.grade = parseEstoqueALM(csvE);
        renderShelf();
        updateStats();
        const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
        setSyncStatus('✓ Sincronizado', 'ok');
        setText('last-sync', `às ${now}`);
        localStorage.setItem(KS.LS_ESTOQUE, urlE);
    } catch(err) {
        console.error('[Kanban]', err);
        setSyncStatus(`Erro: ${err.message}`, 'error');
    }
    animateSyncIcon(false);
}

// ── FETCH CSV ─────────────────────────────────────────────────

async function fetchCSV(url) {
    const u = toCSVUrl(url.trim());
    console.log('[Kanban] Fetching:', u);
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
}

function toCSVUrl(url) {
    if (url.includes('output=')) {
        return url.replace('output=tsv','output=csv')
                  .replace('output=xlsx','output=csv')
                  .replace('output=pdf','output=csv');
    }
    const mId = url.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
    if (!mId) return url;
    const id = mId[1];
    const mGid = url.match(/[?&#]gid=(\d+)/);
    const gid  = mGid ? `&gid=${mGid[1]}` : '';
    if (url.includes('/d/e/'))
        return `https://docs.google.com/spreadsheets/d/e/${id}/pub?single=true&output=csv${gid}`;
    return `https://docs.google.com/spreadsheets/d/${id}/pub?output=csv${gid}`;
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

// ── PARSER — grade por posição com PNs ───────────────────────
// grade[nivel][pos] = Map<pn, qtd>

function parseEstoqueALM(csv) {
    const rows = parseCSVRows(csv);
    if (rows.length < 2) return {};

    const h   = rows[0].map(c=>(c||'').toLowerCase().trim());
    const fi  = names => { for(const n of names){ const i=h.findIndex(c=>c.includes(n)); if(i>=0)return i; } return -1; };
    const iPN  = fi(['item']);
    const iDep = fi(['dep']);
    const iLoc = fi(['localiz']);
    const iQty = fi(['qtd liq','quantidade','qtd']);

    const grade = {};
    rows.slice(1).forEach(r => {
        if ((r[iDep]||'').trim().toUpperCase() !== 'ALM') return;
        const loc = (r[iLoc]||'').trim().toUpperCase();
        const m   = loc.match(/^F(\d+)-0*(\d+)$/);
        if (!m) return;
        const nivel = parseInt(m[1]);
        const pos   = parseInt(m[2]);
        if (pos > KS.POSICOES || nivel > 12) return;

        const pn  = (r[iPN]||'').trim();
        const qtd = parseFloat(String(r[iQty]||'0').replace(',','.')) || 0;
        if (!pn) return;

        if (!grade[nivel]) grade[nivel] = {};
        if (!grade[nivel][pos]) grade[nivel][pos] = new Map();
        const atual = grade[nivel][pos].get(pn) || 0;
        grade[nivel][pos].set(pn, atual + qtd);
    });
    return grade;
}

// ── AVALIA ESTADO DE UMA POSIÇÃO ──────────────────────────────
// Retorna: { status, estruturaOk[], estruturaFalta[], estranhos[] }

function avaliarPosicao(nivel, pos) {
    const modelo    = POS_MODELO[pos];
    if (!modelo) return { status:'vazio', estruturaOk:[], estruturaFalta:[], estranhos:[] };

    const estrutura = ESTRUTURAS[modelo.nome] || [];
    const pnsPos    = KS.grade[nivel]?.[pos] || new Map(); // Map<pn, qtd>

    const estruturaPNs = new Set(estrutura.map(e => e.pn));
    const estruturaOk  = [];
    const estruturaFalta = [];

    // Verifica cada componente da estrutura
    for (const comp of estrutura) {
        const qtd = pnsPos.get(comp.pn) || 0;
        if (qtd > 0) {
            estruturaOk.push({ ...comp, qtd });
        } else {
            estruturaFalta.push({ ...comp, qtd: 0 });
        }
    }

    // Verifica PNs na posição que NÃO fazem parte da estrutura
    const estranhos = [];
    for (const [pn, qtd] of pnsPos) {
        if (!estruturaPNs.has(pn) && qtd > 0) {
            estranhos.push({ pn, qtd });
        }
    }

    // Determina status
    let status;
    if (pnsPos.size === 0 || (estruturaOk.length === 0 && estranhos.length === 0)) {
        status = 'vazio';
    } else if (estruturaFalta.length === 0 && estranhos.length === 0) {
        status = 'ok';         // 🟢 todos os PNs presentes
    } else if (estruturaFalta.length > 0 && estruturaOk.length > 0) {
        status = 'incompleto'; // 🟡 faltam alguns
    } else if (estruturaFalta.length === estrutura.length && estranhos.length === 0) {
        status = 'vazio';      // estrutura toda zerada = vazio
    } else if (estranhos.length > 0 && estruturaOk.length === 0) {
        status = 'estranho';   // 🟠 só tem material que não é da estrutura
    } else if (estranhos.length > 0) {
        status = 'incompleto'; // tem estrutura parcial + estranhos
    } else {
        status = 'vazio';
    }

    return { status, estruturaOk, estruturaFalta, estranhos };
}

// ── RENDER SKELETON ───────────────────────────────────────────

function renderShelfSkeleton() {
    const tbl = document.getElementById('shelf-table');
    if (!tbl) return;
    tbl.innerHTML = '';
    tbl.appendChild(buildModeloHeader());
    for (let n=12; n>=0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.className = 'nivel-cell'; th.textContent = `F${n}`;
        tr.appendChild(th);
        for (let v=1; v<=KS.POSICOES; v++) {
            const td = document.createElement('td');
            td.className = `vaga skel ${POS_MODELO[v]?.cls||''}`;
            td.style.opacity = '.3';
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
}

// ── RENDER SHELF ──────────────────────────────────────────────

function renderShelf() {
    const tbl = document.getElementById('shelf-table');
    if (!tbl) return;
    tbl.innerHTML = '';
    tbl.appendChild(buildModeloHeader());

    let cntOk=0, cntInc=0, cntEst=0, cntVazio=0;

    for (let n=12; n>=0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.className='nivel-cell'; th.textContent=`F${n}`;
        tr.appendChild(th);

        for (let v=1; v<=KS.POSICOES; v++) {
            const td     = document.createElement('td');
            const modelo = POS_MODELO[v];
            const avalia = avaliarPosicao(n, v);
            const posKey = `F${n}-${String(v).padStart(2,'0')}`;

            // Classes e estilos por status
            let extra = '';
            switch(avalia.status) {
                case 'ok':
                    td.className = `vaga vaga-ok ${modelo?.cls||''}`;
                    td.dataset.filter = 'ok';
                    cntOk++;
                    break;
                case 'incompleto':
                    td.className = `vaga vaga-inc pulse-anim ${modelo?.cls||''}`;
                    td.dataset.filter = 'incompleto';
                    cntInc++;
                    break;
                case 'estranho':
                    td.className = `vaga vaga-est pulse-anim ${modelo?.cls||''}`;
                    td.dataset.filter = 'estranho';
                    cntEst++;
                    break;
                default:
                    td.className = `vaga vaga-vazio ${modelo?.cls||''}`;
                    td.dataset.filter = 'vazio';
                    cntVazio++;
            }

            td.dataset.nivel = n;
            td.dataset.vaga  = v;
            td.dataset.pos   = posKey;

            // Conteúdo do card
            td.innerHTML = buildCardHTML(avalia, modelo, posKey);

            // Click abre detalhe
            if (avalia.status !== 'vazio') {
                td.classList.add('ocupada');
                td.onclick = () => openKanbanDetail(avalia, modelo, posKey);
            }

            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }

    setText('ks-total', cntOk + cntInc + cntEst);
    setText('ks-ok',    cntOk);
    setText('ks-low',   cntInc);
    setText('ks-empty', cntEst);
    applyFilter(KS.currentFilter);
}

// ── HTML DO CARD ─────────────────────────────────────────────

function buildCardHTML(avalia, modelo, posKey) {
    const bar = `<div class="modelo-bar" style="background:${modelo?.barColor||'#64748b'}"></div>`;

    switch(avalia.status) {
        case 'ok':
            return `
                ${bar}
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;">
                    <span class="material-symbols-rounded" style="font-size:20px;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span>
                    <p style="font-size:9px;font-weight:800;color:#22c55e;text-align:center;">KANBAN OK</p>
                    <p style="font-size:8px;color:#64748b;text-align:center;">${avalia.estruturaOk.length} / ${avalia.estruturaOk.length} itens</p>
                </div>`;

        case 'incompleto':
            const faltam = avalia.estruturaFalta.length;
            return `
                ${bar}
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;">
                    <span class="material-symbols-rounded" style="font-size:18px;color:#f59e0b;font-variation-settings:'FILL' 1">warning</span>
                    <p style="font-size:8.5px;font-weight:800;color:#f59e0b;text-align:center;">INCOMPLETO</p>
                    <p style="font-size:8px;color:#f59e0b;text-align:center;">${faltam} faltando</p>
                </div>`;

        case 'estranho':
            return `
                ${bar}
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;">
                    <span class="material-symbols-rounded" style="font-size:18px;color:#f97316;font-variation-settings:'FILL' 1">help</span>
                    <p style="font-size:8px;font-weight:800;color:#f97316;text-align:center;">MAT. EXTRA</p>
                    <p style="font-size:8px;color:#f97316;text-align:center;">${avalia.estranhos.length} PN(s)</p>
                </div>`;

        default: // vazio
            return `${bar}`;
    }
}

// ── HEADER DE MODELOS ─────────────────────────────────────────

function buildModeloHeader() {
    const tr = document.createElement('tr');
    const th0 = document.createElement('th'); th0.className = 'nivel-cell';
    tr.appendChild(th0);
    MODELOS.forEach(m => {
        const th = document.createElement('th');
        th.colSpan = m.pos.length;
        th.style.paddingBottom = '8px';
        th.innerHTML = `
          <div style="background:${m.cor}22;color:${m.barColor};
                      border:1.5px solid ${m.barColor}55;padding:6px 4px;
                      border-radius:8px;font-size:10px;font-weight:800;
                      text-transform:uppercase;letter-spacing:.5px;text-align:center;">
            ${m.nome}
          </div>`;
        tr.appendChild(th);
    });
    return tr;
}

// ── MODAL DETALHE ─────────────────────────────────────────────

function openKanbanDetail(avalia, modelo, posKey) {
    const { status, estruturaOk, estruturaFalta, estranhos } = avalia;
    setText('kd-pn', posKey);
    document.getElementById('kd-modelo').innerHTML =
        `<span style="color:${modelo?.barColor||'#6366f1'};font-weight:700;">${modelo?.nome||'—'}</span>`;

    // Badge de status
    const statusBadge = {
        ok:         '<span style="background:rgba(34,197,94,.2);color:#22c55e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">✅ KANBAN OK</span>',
        incompleto: '<span style="background:rgba(245,158,11,.2);color:#f59e0b;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">⚠️ INCOMPLETO</span>',
        estranho:   '<span style="background:rgba(249,115,22,.2);color:#f97316;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🟠 MATERIAL EXTRA</span>',
    }[status] || '';

    let body = `<div class="mb-3">${statusBadge}</div>`;

    // Componentes OK
    if (estruturaOk.length > 0) {
        body += `<p class="text-xs font-bold text-emerald-500 mb-2">✅ Presentes (${estruturaOk.length})</p>`;
        body += estruturaOk.map(c => `
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <span class="text-xs font-mono text-slate-600 dark:text-slate-300">${c.pn}</span>
                    <p class="text-[10px] text-slate-400">${c.desc}</p>
                </div>
                <span class="text-xs font-bold text-emerald-500 ml-2">${c.qtd}</span>
            </div>`).join('');
    }

    // Faltando
    if (estruturaFalta.length > 0) {
        body += `<p class="text-xs font-bold text-amber-500 mt-3 mb-2">⚠️ Faltando (${estruturaFalta.length})</p>`;
        body += estruturaFalta.map(c => `
            <div class="flex justify-between items-center py-1.5 border-b border-amber-100 dark:border-amber-900/20">
                <div>
                    <span class="text-xs font-mono text-slate-600 dark:text-slate-300">${c.pn}</span>
                    <p class="text-[10px] text-slate-400">${c.desc}</p>
                </div>
                <span class="text-xs font-bold text-amber-500 ml-2">0 / mult ${c.mult}</span>
            </div>`).join('');
    }

    // Estranhos
    if (estranhos.length > 0) {
        body += `<p class="text-xs font-bold text-orange-500 mt-3 mb-2">🟠 Não pertence à estrutura (${estranhos.length})</p>`;
        body += estranhos.map(c => `
            <div class="flex justify-between items-center py-1.5 border-b border-orange-100 dark:border-orange-900/20">
                <span class="text-xs font-mono text-slate-600 dark:text-slate-300">${c.pn}</span>
                <span class="text-xs font-bold text-orange-500 ml-2">${c.qtd}</span>
            </div>`).join('');
    }

    document.getElementById('kd-body').innerHTML = `<div class="space-y-0 max-h-72 overflow-y-auto">${body}</div>`;

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

// ── FILTRO ────────────────────────────────────────────────────

function filterKanban(type) {
    KS.currentFilter = type;
    document.querySelectorAll('.kf-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === type));
    applyFilter(type);
}

function applyFilter(type) {
    const q = (document.getElementById('kanban-search')?.value||'').toLowerCase();
    document.querySelectorAll('td.vaga').forEach(td => {
        const f   = td.dataset.filter||'vazio';
        const pos = td.dataset.pos||'';
        let show = true;
        if      (type==='search') show = pos.toLowerCase().includes(q);
        else if (type!=='all')    show = f===type;
        td.style.opacity       = show ? '1' : '0.06';
        td.style.pointerEvents = show ? 'auto' : 'none';
    });
}

// ── CONFIG SHEETS ─────────────────────────────────────────────

function openSheetsConfig() {
    setVal('cfg-sheets-url', localStorage.getItem(KS.LS_ESTOQUE)||'');
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
function updateStats() {}

// ── HELPERS ───────────────────────────────────────────────────

function setSyncStatus(msg,type){
    const e=document.getElementById('sync-status');if(!e)return;
    const c={ok:'text-emerald-500',error:'text-rose-500',loading:'text-slate-400',neutral:'text-slate-400'};
    e.className=`font-medium ${c[type]||'text-slate-400'}`;e.textContent=msg;
}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v??'—';}
function getVal(id){return document.getElementById(id)?.value||'';}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v;}
function animateSyncIcon(on){const i=document.getElementById('sync-icon');if(i)i.style.animation=on?'spin 1s linear infinite':'';}

// ── EXPOSE ────────────────────────────────────────────────────

window.initKanban=initKanban; window.syncSheets=syncSheets;
window.filterKanban=filterKanban; window.openSheetsConfig=openSheetsConfig;
window.closeSheetsConfig=closeSheetsConfig; window.saveSheetsConfig=saveSheetsConfig;
window.openKanbanDetail=openKanbanDetail; window.closeKanbanDetail=closeKanbanDetail;

document.addEventListener('pageChanged', e=>{ if(e.detail==='kanban') initKanban(); });
console.log('✅ kanban-sheets.js — lógica por estrutura carregada!');
