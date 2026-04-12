// ============================================================
// KANBAN SHEETS — Prateleira F · ALM
// Configurações salvas no Supabase (compartilhado entre usuários)
// Edição apenas para Admin (nível 3)
// ============================================================

// ── ESTRUTURAS ────────────────────────────────────────────────
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

const MODELOS = [
    { nome:'FIREFLY',        pos:[1,2],  cor:'#93c5fd', cls:'m-firefly',    barColor:'#3b82f6' },
    { nome:'GM ASP',         pos:[3,4],  cor:'#86efac', cls:'m-gmasp',      barColor:'#22c55e' },
    { nome:'GM TURBO',       pos:[5,6],  cor:'#5eead4', cls:'m-gmturbo',    barColor:'#14b8a6' },
    { nome:'FRONT COVER',    pos:[7],    cor:'#67e8f9', cls:'m-frontcover', barColor:'#06b6d4' },
    { nome:'RENAULT',        pos:[8],    cor:'#a5b4fc', cls:'m-renault',    barColor:'#6366f1' },
    { nome:'HYUNDAI VOLUTA', pos:[9],    cor:'#fde047', cls:'m-hyundai',    barColor:'#eab308' },
    { nome:'HYUNDAI PRIME',  pos:[10],   cls:'m-prime',  barColor:'#ef4444' },
    { nome:'MAN D08',        pos:[11],   cls:'m-man',    barColor:'#2563eb' },
];

const NIVEL_SKIP = new Set([10]);
const POS_MODELO = {};
MODELOS.forEach(m => m.pos.forEach(p => POS_MODELO[p] = m));

// ── CONFIG — carregado do Supabase, compartilhado ─────────────

const KS = {
    POSICOES: 11,
    grade: {},
    currentFilter: 'all',
    // Configs globais (vêm do Supabase)
    sheetsUrl: '',
    qtdBase: {
        'FIREFLY':1000,'GM ASP':1000,'GM TURBO':1000,'FRONT COVER':1000,
        'RENAULT':1000,'HYUNDAI VOLUTA':375,'HYUNDAI PRIME':1000,'MAN D08':1000,
    },
};

// ── SUPABASE CONFIG — lê e salva configurações globais ────────

async function carregarConfigDoSupabase() {
    try {
        const { data } = await supabaseClient
            .from('system_config')
            .select('chave, valor')
            .in('chave', ['kanban_sheets_url','kanban_qtd_base']);

        if (!data) return;
        data.forEach(row => {
            if (row.chave === 'kanban_sheets_url' && row.valor) {
                KS.sheetsUrl = row.valor;
            }
            if (row.chave === 'kanban_qtd_base' && row.valor) {
                try { KS.qtdBase = { ...KS.qtdBase, ...JSON.parse(row.valor) }; } catch(_) {}
            }
        });
        console.log('✅ Config kanban carregada do Supabase:', KS.sheetsUrl ? '(URL ok)' : '(sem URL)');
    } catch(e) {
        console.warn('⚠️ Erro ao carregar config:', e.message);
    }
}

async function salvarUrlNoSupabase(url) {
    try {
        const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
        await supabaseClient.from('system_config').upsert({
            chave: 'kanban_sheets_url',
            valor: url,
            updated_at: new Date().toISOString(),
            updated_by: user?.email || 'admin',
        });
        KS.sheetsUrl = url;
        console.log('✅ URL salva no Supabase');
    } catch(e) { console.error('Erro ao salvar URL:', e); }
}

async function salvarQtdNoSupabase(qtds) {
    try {
        const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
        await supabaseClient.from('system_config').upsert({
            chave: 'kanban_qtd_base',
            valor: JSON.stringify(qtds),
            updated_at: new Date().toISOString(),
            updated_by: user?.email || 'admin',
        });
        console.log('✅ Quantidades salvas no Supabase');
    } catch(e) { console.error('Erro ao salvar qtd:', e); }
}

function getQtdBase() { return KS.qtdBase; }

// ── INIT ─────────────────────────────────────────────────────

async function initKanban() {
    renderShelfSkeleton();
    setSyncStatus('Carregando configurações...', 'loading');

    // 1. Carrega config do Supabase (compartilhado entre todos)
    await carregarConfigDoSupabase();

    // 2. Preenche campo URL se Admin
    if (KS.sheetsUrl) {
        setVal('sheets-url', KS.sheetsUrl);
        setVal('cfg-sheets-url', KS.sheetsUrl);
    }

    // 3. Aplica permissões (esconde controles para não-Admin)
    if (typeof aplicarPermissoes === 'function') aplicarPermissoes();

    // 4. Carrega dados se tiver URL
    if (KS.sheetsUrl) {
        await syncSheets();
    } else {
        setSyncStatus('Configure o Google Sheets (Admin)', 'neutral');
    }
}

// ── SYNC ─────────────────────────────────────────────────────

async function syncSheets() {
    // Pega URL: do campo (Admin) ou da config carregada (todos)
    const urlCampo = (getVal('cfg-sheets-url') || getVal('sheets-url') || '').trim();
    const url = urlCampo || KS.sheetsUrl;
    if (!url) { openSheetsConfig(); return; }

    setSyncStatus('Sincronizando…', 'loading');
    animateSyncIcon(true);
    try {
        const csv = await fetchCSV(url);
        KS.grade = parseEstoqueALM(csv);
        renderShelf();
        const now = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
        setSyncStatus('✓ Sincronizado', 'ok');
        setText('last-sync', `às ${now}`);
    } catch(err) {
        console.error('[Kanban]', err);
        setSyncStatus(`Erro: ${err.message}`, 'error');
    }
    animateSyncIcon(false);
}

// ── CSV ───────────────────────────────────────────────────────

async function fetchCSV(url) {
    const u = toCSVUrl(url.trim());
    const r = await fetch(u);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
}

function toCSVUrl(url) {
    if (url.includes('output='))
        return url.replace('output=tsv','output=csv').replace('output=xlsx','output=csv').replace('output=pdf','output=csv');
    const mId = url.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
    if (!mId) return url;
    const id=mId[1]; const mGid=url.match(/[?&#]gid=(\d+)/); const gid=mGid?`&gid=${mGid[1]}`:'';
    if (url.includes('/d/e/')) return `https://docs.google.com/spreadsheets/d/e/${id}/pub?single=true&output=csv${gid}`;
    return `https://docs.google.com/spreadsheets/d/${id}/pub?output=csv${gid}`;
}

function parseCSVRows(csv) {
    return csv.trim().split('\n').map(line => {
        const cells=[]; let cur='', inQ=false;
        for (const ch of line) {
            if (ch==='"') inQ=!inQ;
            else if ((ch===','||ch===';')&&!inQ) { cells.push(cur.trim()); cur=''; }
            else cur+=ch;
        }
        cells.push(cur.trim()); return cells;
    });
}

function parseEstoqueALM(csv) {
    const rows=parseCSVRows(csv); if (rows.length<2) return {};
    const h=rows[0].map(c=>(c||'').toLowerCase().trim());
    const fi=names=>{for(const n of names){const i=h.findIndex(c=>c.includes(n));if(i>=0)return i;}return -1;};
    const iPN=fi(['item']),iDep=fi(['dep']),iLoc=fi(['localiz']),iQty=fi(['qtd liq','quantidade','qtd']);
    const grade={};
    rows.slice(1).forEach(r=>{
        if((r[iDep]||'').trim().toUpperCase()!=='ALM') return;
        const loc=(r[iLoc]||'').trim().toUpperCase();
        const m=loc.match(/^F(\d+)-0*(\d+)$/); if(!m) return;
        const nivel=parseInt(m[1]),pos=parseInt(m[2]);
        if(pos>KS.POSICOES||nivel>12) return;
        const pn=(r[iPN]||'').trim(); if(!pn) return;
        const qtd=parseFloat(String(r[iQty]||'0').replace(',','.'))||0;
        if(!grade[nivel]) grade[nivel]={};
        if(!grade[nivel][pos]) grade[nivel][pos]=new Map();
        grade[nivel][pos].set(pn,(grade[nivel][pos].get(pn)||0)+qtd);
    });
    return grade;
}

// ── AVALIA POSIÇÃO ────────────────────────────────────────────

function avaliarPosicao(nivel, pos) {
    const modelo=POS_MODELO[pos]; if(!modelo) return {status:'vazio',itens:[],estranhos:[]};
    const estrutura=ESTRUTURAS[modelo.nome]||[];
    const pnsPos=KS.grade[nivel]?.[pos]||new Map();
    const qtdBase=KS.qtdBase[modelo.nome]||1000;
    const estruturaPNs=new Set(estrutura.map(e=>e.pn));
    const itens=estrutura.map(comp=>{
        const qtdReal=pnsPos.get(comp.pn)||0;
        const qtdEsperada=qtdBase*comp.mult;
        const estado=qtdReal<=0?'falta':qtdReal>=qtdEsperada*1.8?'duplicado':'ok';
        return{...comp,qtdReal,qtdEsperada,estado};
    });
    const estranhos=[];
    for(const[pn,qtd]of pnsPos){if(!estruturaPNs.has(pn)&&qtd>0)estranhos.push({pn,qtd});}
    const totalOk=itens.filter(i=>i.estado==='ok').length;
    const totalFalta=itens.filter(i=>i.estado==='falta').length;
    const totalDup=itens.filter(i=>i.estado==='duplicado').length;
    let status;
    if(pnsPos.size===0){status='vazio';}
    else if(totalDup>0&&totalFalta===0){status='duplicado';}
    else if(totalFalta>0){status='incompleto';}
    else if(estranhos.length>0&&totalOk===0){status='estranho';}
    else{status='ok';}
    return{status,itens,estranhos,qtdBase};
}

// ── RENDER ────────────────────────────────────────────────────

function renderShelfSkeleton() {
    const tbl=document.getElementById('shelf-table'); if(!tbl) return;
    tbl.innerHTML=''; tbl.appendChild(buildModeloHeader());
    for(let n=12;n>=0;n--){
        if(NIVEL_SKIP.has(n)) continue;
        const tr=document.createElement('tr');
        const th=document.createElement('th'); th.className='nivel-cell'; th.textContent=`F${n}`; tr.appendChild(th);
        for(let v=1;v<=KS.POSICOES;v++){const td=document.createElement('td');td.className=`vaga skel ${POS_MODELO[v]?.cls||''}`;td.style.opacity='.3';tr.appendChild(td);}
        tbl.appendChild(tr);
    }
}

function renderShelf() {
    const tbl=document.getElementById('shelf-table'); if(!tbl) return;
    tbl.innerHTML=''; tbl.appendChild(buildModeloHeader());
    let cntOk=0,cntInc=0,cntEst=0,cntDup=0;
    for(let n=12;n>=0;n--){
        if(NIVEL_SKIP.has(n)) continue;
        const tr=document.createElement('tr');
        const th=document.createElement('th'); th.className='nivel-cell'; th.textContent=`F${n}`; tr.appendChild(th);
        for(let v=1;v<=KS.POSICOES;v++){
            const td=document.createElement('td');
            const modelo=POS_MODELO[v]; const avalia=avaliarPosicao(n,v);
            const posKey=`F${n}-${String(v).padStart(2,'0')}`;
            switch(avalia.status){
                case 'ok':        td.className=`vaga vaga-ok ${modelo?.cls||''}`;                  cntOk++;  td.dataset.filter='ok';        break;
                case 'incompleto':td.className=`vaga vaga-inc pulse-anim ${modelo?.cls||''}`;      cntInc++; td.dataset.filter='incompleto'; break;
                case 'duplicado': td.className=`vaga vaga-dup pulse-anim-blue ${modelo?.cls||''}`;cntDup++; td.dataset.filter='duplicado';  break;
                case 'estranho':  td.className=`vaga vaga-est pulse-anim ${modelo?.cls||''}`;      cntEst++; td.dataset.filter='estranho';   break;
                default:          td.className=`vaga vaga-vazio ${modelo?.cls||''}`;                         td.dataset.filter='vazio';
            }
            td.dataset.nivel=n; td.dataset.vaga=v; td.dataset.pos=posKey;
            td.innerHTML=buildCardHTML(avalia,modelo);
            if(avalia.status!=='vazio'){td.classList.add('ocupada');td.onclick=()=>openKanbanDetail(avalia,modelo,posKey);}
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
    setText('ks-total',cntOk+cntInc+cntEst+cntDup);
    setText('ks-ok',cntOk); setText('ks-low',cntInc); setText('ks-empty',cntEst); setText('ks-dup',cntDup);
    applyFilter(KS.currentFilter);
}

function buildCardHTML(avalia,modelo){
    const bar=`<div class="modelo-bar" style="background:${modelo?.barColor||'#64748b'}"></div>`;
    const total=avalia.itens.length;
    switch(avalia.status){
        case 'ok':return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;"><span class="material-symbols-rounded" style="font-size:20px;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span><p style="font-size:9px;font-weight:800;color:#22c55e;text-align:center;">KANBAN OK</p><p style="font-size:8px;color:#64748b;">${total}/${total} itens</p></div>`;
        case 'duplicado':{const nd=avalia.itens.filter(i=>i.estado==='duplicado').length;return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;"><span class="material-symbols-rounded" style="font-size:18px;color:#60a5fa;font-variation-settings:'FILL' 1">content_copy</span><p style="font-size:8.5px;font-weight:800;color:#60a5fa;text-align:center;">DUPLICADO</p><p style="font-size:8px;color:#60a5fa;">${nd} PN(s)</p></div>`;}
        case 'incompleto':{const nf=avalia.itens.filter(i=>i.estado==='falta').length;return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f59e0b;font-variation-settings:'FILL' 1">warning</span><p style="font-size:8.5px;font-weight:800;color:#f59e0b;text-align:center;">INCOMPLETO</p><p style="font-size:8px;color:#f59e0b;">${nf} faltando</p></div>`;}
        case 'estranho':return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:3px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f97316;font-variation-settings:'FILL' 1">help</span><p style="font-size:8px;font-weight:800;color:#f97316;text-align:center;">MAT. EXTRA</p><p style="font-size:8px;color:#f97316;">${avalia.estranhos.length} PN(s)</p></div>`;
        default:return bar;
    }
}

function buildModeloHeader(){
    const tr=document.createElement('tr');
    const th0=document.createElement('th'); th0.className='nivel-cell'; tr.appendChild(th0);
    MODELOS.forEach(m=>{
        const th=document.createElement('th'); th.colSpan=m.pos.length; th.style.paddingBottom='8px';
        th.innerHTML=`<div style="background:${(m.cor||'#6366f1')}22;color:${m.barColor};border:1.5px solid ${m.barColor}55;padding:6px 4px;border-radius:8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;text-align:center;">${m.nome}</div>`;
        tr.appendChild(th);
    });
    return tr;
}

// ── MODAL DETALHE ─────────────────────────────────────────────

function openKanbanDetail(avalia,modelo,posKey){
    const flags=(typeof getFlags==='function')?getFlags():{};
    const flagAtual=flags[posKey];
    setText('kd-pn',posKey);
    document.getElementById('kd-modelo').innerHTML=`<span style="color:${modelo?.barColor||'#6366f1'};font-weight:700;">${modelo?.nome||'—'}</span><span style="font-size:10px;color:#64748b;margin-left:8px;">Base: ${avalia.qtdBase} un/kanban</span>`;
    const statusBadge={ok:'<span style="background:rgba(34,197,94,.2);color:#22c55e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">✅ KANBAN OK</span>',duplicado:'<span style="background:rgba(96,165,250,.2);color:#60a5fa;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🔵 DUPLICADO</span>',incompleto:'<span style="background:rgba(245,158,11,.2);color:#f59e0b;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">⚠️ INCOMPLETO</span>',estranho:'<span style="background:rgba(249,115,22,.2);color:#f97316;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🟠 MATERIAL EXTRA</span>'}[avalia.status]||'';
    let body=`<div class="mb-3 flex items-center gap-2 flex-wrap">${statusBadge}`;
    if(flagAtual?.status==='pendente') body+=`<span style="background:rgba(239,68,68,.2);color:#f87171;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🚩 Marcado vazio por ${flagAtual.operador}</span>`;
    body+=`</div>`;
    body+=`<div class="overflow-y-auto" style="max-height:340px;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead style="position:sticky;top:0;background:#0f172a;z-index:1;"><tr style="border-bottom:1px solid rgba(148,163,184,.2);"><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;">PN</th><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;">Descrição</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;">Saldo</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;">Esperado</th><th style="text-align:center;padding:6px 8px;color:#94a3b8;font-weight:600;font-size:10px;text-transform:uppercase;">St.</th></tr></thead><tbody>`;
    avalia.itens.forEach(comp=>{
        const icon=comp.estado==='ok'?'✅':comp.estado==='duplicado'?'🔵':'⚠️';
        const cor=comp.estado==='ok'?'#22c55e':comp.estado==='duplicado'?'#60a5fa':'#f59e0b';
        const bgRow=comp.estado==='falta'?'background:rgba(245,158,11,.04);':comp.estado==='duplicado'?'background:rgba(96,165,250,.04);':'';
        body+=`<tr style="border-bottom:1px solid rgba(148,163,184,.07);${bgRow}"><td style="padding:7px 8px;font-family:monospace;font-size:11px;color:#cbd5e1;white-space:nowrap;">${comp.pn}</td><td style="padding:7px 8px;color:#94a3b8;font-size:11px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${comp.desc}</td><td style="padding:7px 8px;text-align:right;font-weight:700;color:${cor};font-size:12px;">${comp.qtdReal.toLocaleString('pt-BR')}</td><td style="padding:7px 8px;text-align:right;color:#64748b;font-size:11px;">${comp.qtdEsperada.toLocaleString('pt-BR')}</td><td style="padding:7px 8px;text-align:center;font-size:14px;">${icon}</td></tr>`;
    });
    body+='</tbody></table></div>';
    if(avalia.estranhos.length>0){body+=`<div style="margin-top:12px;padding:10px;background:rgba(249,115,22,.08);border-radius:10px;border:1px solid rgba(249,115,22,.2);"><p style="font-size:10px;font-weight:800;color:#f97316;margin-bottom:6px;text-transform:uppercase;">🟠 Fora da estrutura</p>`;avalia.estranhos.forEach(e=>{body+=`<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px;border-bottom:1px solid rgba(249,115,22,.1);"><span style="font-family:monospace;color:#cbd5e1;">${e.pn}</span><span style="color:#f97316;font-weight:700;">${e.qtd}</span></div>`;});body+='</div>';}
    
    // Botão Marcar Vazio — só nível 2+
    const nivel=typeof getNivel==='function'?getNivel():0;
    if(nivel>=2){
        const jaMarcado=flagAtual?.status==='pendente';
        body+=`<div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(148,163,184,.12);"><p style="font-size:10px;color:#64748b;margin-bottom:8px;text-transform:uppercase;font-weight:600;letter-spacing:.05em;">Ação do operador</p><div style="display:flex;gap:8px;">${jaMarcado?`<button onclick="removerFlag('${posKey}');closeKanbanDetail();" style="flex:1;padding:9px;background:rgba(34,197,94,.15);color:#4ade80;border:1.5px solid rgba(34,197,94,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">check_circle</span>Remover flag (regularizado)</button>`:`<button onclick="abrirMarcarVazio('${posKey}','${modelo?.nome||''}');closeKanbanDetail();" style="flex:1;padding:9px;background:rgba(239,68,68,.12);color:#f87171;border:1.5px solid rgba(239,68,68,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">report</span>Marcar como Vazio</button>`}<button onclick="if(typeof showPage==='function')showPage('estoque')" style="padding:9px 14px;background:rgba(99,102,241,.12);color:#818cf8;border:1.5px solid rgba(99,102,241,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;" title="Ver regularizações"><span class="material-symbols-rounded" style="font-size:16px;">inventory_2</span></button></div></div>`;
    }
    
    document.getElementById('kd-body').innerHTML=body;
    const modal=document.getElementById('kanban-detail-modal');
    const cont=document.getElementById('kanban-detail-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{cont.style.transform='scale(1)';cont.style.opacity='1';});
}

function closeKanbanDetail(){
    const modal=document.getElementById('kanban-detail-modal'),cont=document.getElementById('kanban-detail-content');
    cont.style.transform='scale(.95)';cont.style.opacity='0';
    setTimeout(()=>{modal.classList.add('hidden');cont.style.transform='scale(.95)';},250);
}

// ── MODAL QTD CONFIG (só Admin) ───────────────────────────────

function openQtdConfig(){
    if((typeof getNivel==='function'?getNivel():0)<3){showToast('Apenas Admin pode alterar as quantidades','warning');return;}
    const qtds=KS.qtdBase;
    document.getElementById('qtd-config-modal')?.remove();
    const rows=MODELOS.map(m=>`<div class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800"><div class="flex-1"><span style="color:${m.barColor};font-weight:700;font-size:12px;">${m.nome}</span><p style="font-size:10px;color:#64748b;">Pos. ${m.pos.join(', ')} · ${ESTRUTURAS[m.nome]?.length||0} componentes</p></div><div class="flex items-center gap-2"><label style="font-size:10px;color:#94a3b8;">Base (un):</label><input type="number" min="1" step="1" data-modelo="${m.nome}" value="${qtds[m.nome]||1000}" class="w-24 px-2 py-1.5 text-sm text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:border-primary-500 outline-none"></div></div>`).join('');
    const html=`<div id="qtd-config-modal" class="fixed inset-0 z-[95] hidden"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeQtdConfig()"></div><div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"><div id="qtd-config-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto p-6" style="transform:scale(.95);opacity:0;transition:all .25s;"><div class="flex items-center justify-between mb-4"><div><h3 class="font-bold text-slate-900 dark:text-white">Quantidade Base por Kanban</h3><p class="text-xs text-slate-400 mt-0.5">Salvo globalmente — válido para todos os usuários</p></div><button onclick="closeQtdConfig()" class="text-slate-400 hover:text-slate-600"><span class="material-symbols-rounded">close</span></button></div><div class="space-y-0 max-h-80 overflow-y-auto">${rows}</div><div class="flex gap-3 mt-5"><button onclick="closeQtdConfig()" class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">Cancelar</button><button onclick="salvarQtdConfig()" class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors">Salvar para Todos</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend',html);
    const modal=document.getElementById('qtd-config-modal'),cont=document.getElementById('qtd-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{cont.style.transform='scale(1)';cont.style.opacity='1';});
}

function closeQtdConfig(){
    const modal=document.getElementById('qtd-config-modal'),cont=document.getElementById('qtd-config-content');
    if(!modal) return;
    cont.style.transform='scale(.95)';cont.style.opacity='0';
    setTimeout(()=>modal.remove(),250);
}

async function salvarQtdConfig(){
    const qtds={};
    document.querySelectorAll('[data-modelo]').forEach(inp=>{const v=parseInt(inp.value);if(inp.dataset.modelo&&v>0)qtds[inp.dataset.modelo]=v;});
    KS.qtdBase={...KS.qtdBase,...qtds};
    // Salva no Supabase (global para todos)
    await salvarQtdNoSupabase(KS.qtdBase);
    closeQtdConfig();
    renderShelf();
    if(typeof showToast==='function') showToast('✅ Quantidades salvas para todos os usuários!','success');
}

// ── MODAL CONFIG SHEETS (só Admin) ───────────────────────────

function openSheetsConfig(){
    if((typeof getNivel==='function'?getNivel():0)<3){showToast('Apenas Admin pode alterar a integração','warning');return;}
    setVal('cfg-sheets-url', KS.sheetsUrl);
    const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');
    m.classList.remove('hidden');
    requestAnimationFrame(()=>{c.style.transform='scale(1)';c.style.opacity='1';});
}
function closeSheetsConfig(){
    const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');
    c.style.transform='scale(.95)';c.style.opacity='0';
    setTimeout(()=>{m.classList.add('hidden');c.style.transform='scale(.95)';},250);
}
async function saveSheetsConfig(){
    const url=(getVal('cfg-sheets-url')||'').trim();
    if(!url){showToast('Informe a URL do Sheets','warning');return;}
    // Salva no Supabase (global para todos)
    await salvarUrlNoSupabase(url);
    setVal('sheets-url',url);
    closeSheetsConfig();
    await syncSheets();
    if(typeof showToast==='function') showToast('✅ URL salva para todos os usuários!','success');
}

// ── FILTRO ────────────────────────────────────────────────────

function filterKanban(type){
    KS.currentFilter=type;
    document.querySelectorAll('.kf-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter===type));
    applyFilter(type);
}
function applyFilter(type){
    const q=(document.getElementById('kanban-search')?.value||'').toLowerCase();
    document.querySelectorAll('td.vaga').forEach(td=>{
        const f=td.dataset.filter||'vazio',pos=td.dataset.pos||'';
        let show=true;
        if(type==='search') show=pos.toLowerCase().includes(q);
        else if(type!=='all') show=f===type;
        td.style.opacity=show?'1':'0.06';
        td.style.pointerEvents=show?'auto':'none';
    });
}

// ── HELPERS ───────────────────────────────────────────────────

function setSyncStatus(msg,type){const e=document.getElementById('sync-status');if(!e)return;const c={ok:'text-emerald-500',error:'text-rose-500',loading:'text-slate-400',neutral:'text-slate-400'};e.className=`font-medium ${c[type]||'text-slate-400'}`;e.textContent=msg;}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v??'—';}
function getVal(id){return document.getElementById(id)?.value||'';}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v;}
function animateSyncIcon(on){const i=document.getElementById('sync-icon');if(i)i.style.animation=on?'spin 1s linear infinite':'';}

window.initKanban=initKanban; window.syncSheets=syncSheets; window.filterKanban=filterKanban;
window.openSheetsConfig=openSheetsConfig; window.closeSheetsConfig=closeSheetsConfig; window.saveSheetsConfig=saveSheetsConfig;
window.openKanbanDetail=openKanbanDetail; window.closeKanbanDetail=closeKanbanDetail;
window.openQtdConfig=openQtdConfig; window.closeQtdConfig=closeQtdConfig; window.salvarQtdConfig=salvarQtdConfig;
window.abrirMarcarVazio=abrirMarcarVazio; window.fecharMarcarVazio=fecharMarcarVazio; window.confirmarMarcarVazio=confirmarMarcarVazio;

document.addEventListener('pageChanged',e=>{if(e.detail==='kanban') initKanban();});
console.log('✅ kanban-sheets.js — configs globais via Supabase');
