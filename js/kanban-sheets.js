// ============================================================
// KANBAN SHEETS — Prateleira F · ALM
// Com contador de horas de produção por modelo
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
        { pn:'20.003.3297', desc:'Junta Voluta',           mult:1 },
        { pn:'20.003.3298', desc:'Junta Saida Voluta',     mult:1 },
        { pn:'20.006.3299', desc:'Nipple Inox Ø20',        mult:1 },
        { pn:'20.008.3289', desc:'Tampao Inox Ø32',        mult:1 },
        { pn:'20.003.3295', desc:'Junta Carcaca',          mult:1 },
        { pn:'20.001.3339', desc:'Rolamento Lip Seal HNBR',mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',    mult:1 },
        { pn:'20.007.4288', desc:'Parafuso M5X24,5',       mult:1 },
        { pn:'20.004.2520', desc:'Flange Sinterizada GM',  mult:1 },
    ],
    'GM TURBO': [
        { pn:'20.003.3297', desc:'Junta Voluta',           mult:1 },
        { pn:'20.003.3298', desc:'Junta Saida Voluta',     mult:1 },
        { pn:'20.006.3299', desc:'Nipple Inox Ø20',        mult:1 },
        { pn:'20.008.3289', desc:'Tampao Inox Ø32',        mult:1 },
        { pn:'20.003.3295', desc:'Junta Carcaca',          mult:1 },
        { pn:'20.001.3340', desc:'Rolamento FKM',          mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',    mult:1 },
        { pn:'20.007.4300', desc:'Parafuso M6x16',         mult:1 },
        { pn:'20.007.4288', desc:'Parafuso M5X24,5',       mult:1 },
        { pn:'20.004.2520', desc:'Flange Sinterizada GM',  mult:1 },
        { pn:'20.003.3296', desc:'Junta Cooler',           mult:1 },
    ],
    'FRONT COVER': [
        { pn:'20.007.3403', desc:'Parafuso M6X16',         mult:4  },
        { pn:'20.007.3404', desc:'Parafuso M8X28',         mult:4  },
        { pn:'20.005.0005', desc:'Palheta',                mult:2  },
        { pn:'20.006.3418', desc:'Bucha Guia',             mult:1  },
        { pn:'20.009.0001', desc:'Mola Anel Externo',      mult:1  },
        { pn:'20.003.3419', desc:'Anel Vedação PTFE',      mult:1  },
        { pn:'20.003.0010', desc:'Junta Deslizamento FKM', mult:1  },
        { pn:'20.009.0002', desc:'Mola Válvula',           mult:1  },
        { pn:'20.007.3408', desc:'Parafuso Bujão',         mult:1  },
        { pn:'20.007.3409', desc:'Parafuso M5x15',         mult:1  },
        { pn:'20.010.0001', desc:'Eletroválvula',          mult:1  },
        { pn:'20.009.0003', desc:'Mola Válvula Seg.',      mult:1  },
        { pn:'20.006.3416', desc:'Esfera G Cr15',          mult:1  },
        { pn:'20.003.3422', desc:'Junta HNBR J727',        mult:2  },
        { pn:'20.005.3427', desc:'Anel da Palheta',        mult:1  },
        { pn:'20.007.4635', desc:'Parafuso Tampão M6',     mult:2  },
        { pn:'21.008.9950', desc:'Tampão Ø14',             mult:1  },
        { pn:'20.008.1750', desc:'Tampa Respiro Ø7',       mult:1  },
    ],
    'RENAULT': [
        { pn:'16.400.7010', desc:'Rotor PPS MPI FFV',      mult:1 },
        { pn:'20.001.7010', desc:'Rolamento WZ1630075',    mult:1 },
        { pn:'20.002.1918', desc:'Selo Mecanico 94539',    mult:1 },
        { pn:'20.003.7010', desc:'Junta metal JZ3020',     mult:1 },
        { pn:'20.004.7015', desc:'Flange SMF4050',         mult:1 },
        { pn:'20.008.7010', desc:'Tampão Ø16 MPI FFV',    mult:1 },
    ],
    'HYUNDAI VOLUTA': [
        { pn:'20.003.7011', desc:'Junta Saida Voluta',     mult:1 },
        { pn:'20.006.7010', desc:'Pino Guia MPI FFV',      mult:2 },
        { pn:'20.006.7015', desc:'Nipple Aquecimento',     mult:1 },
        { pn:'20.007.7010', desc:'Parafuso M8x16',         mult:4 },
        { pn:'20.007.7011', desc:'Parafuso M6x25',         mult:6 },
        { pn:'20.007.7012', desc:'Parafuso M6x14',         mult:1 },
        { pn:'20.004.7010', desc:'Polia MPI FFV',          mult:1 },
        { pn:'22.010.7010', desc:'Sensor Temperatura',     mult:1 },
    ],
    'HYUNDAI PRIME': [
        { pn:'20.001.3114', desc:'Rolamento WR1630075-3',  mult:1 },
        { pn:'20.008.9950', desc:'Tampao Ø14',             mult:1 },
        { pn:'20.002.0344', desc:'Selo Mecanico 94566',    mult:1 },
        { pn:'16.400.0662', desc:'Rotor PPS Renault',      mult:1 },
    ],
    'MAN D08': [
        { pn:'20.001.1787', desc:'Rolamento WR2555127-1',  mult:1 },
        { pn:'20.002.2483', desc:'Selo Mecanico MAN',      mult:1 },
        { pn:'20.007.0444', desc:'Anel elastico EBI55',    mult:1 },
        { pn:'25.003.2302', desc:'Saco Plastico VCI',      mult:1 },
        { pn:'20.008.0662', desc:'Tampa respiro Ø20.188',  mult:1 },
    ],
};

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

// ── CONFIG GLOBAL ─────────────────────────────────────────────

const KS = {
    POSICOES: 11,
    grade: {},
    fonte: 'sheets',
    currentFilter: 'all',
    sheetsUrl: '',
    qtdBase: { 'FIREFLY':1000,'GM ASP':1000,'GM TURBO':1000,'FRONT COVER':1000,'RENAULT':1000,'HYUNDAI VOLUTA':375,'HYUNDAI PRIME':1000,'MAN D08':1000 },
    consumoHora: { 'FIREFLY':0,'GM ASP':0,'GM TURBO':0,'FRONT COVER':0,'RENAULT':0,'HYUNDAI VOLUTA':0,'HYUNDAI PRIME':0,'MAN D08':0 },
};

// ── SUPABASE CONFIG ───────────────────────────────────────────

async function carregarConfigDoSupabase() {
    try {
        const { data } = await supabaseClient.from('system_config').select('chave,valor')
            .in('chave',['kanban_sheets_url','kanban_qtd_base','kanban_consumo_hora']);
        if (!data) return;
        data.forEach(row => {
            if (row.chave==='kanban_sheets_url' && row.valor) KS.sheetsUrl = row.valor;
            if (row.chave==='kanban_qtd_base' && row.valor)
                try { KS.qtdBase = {...KS.qtdBase,...JSON.parse(row.valor)}; } catch(_) {}
            if (row.chave==='kanban_consumo_hora' && row.valor)
                try { KS.consumoHora = {...KS.consumoHora,...JSON.parse(row.valor)}; } catch(_) {}
        });
    } catch(e) { console.warn('Config kanban:', e.message); }
}

async function salvarUrlNoSupabase(url) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({ chave:'kanban_sheets_url', valor:url, updated_at:new Date().toISOString(), updated_by:user?.email||'admin' });
    KS.sheetsUrl = url;
}

async function salvarQtdNoSupabase(qtds) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({ chave:'kanban_qtd_base', valor:JSON.stringify(qtds), updated_at:new Date().toISOString(), updated_by:user?.email||'admin' });
}

async function salvarConsumoNoSupabase(consumo) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({ chave:'kanban_consumo_hora', valor:JSON.stringify(consumo), updated_at:new Date().toISOString(), updated_by:user?.email||'admin' });
}

function getQtdBase() { return KS.qtdBase; }

// ── CÁLCULO DE HORAS DE PRODUÇÃO ──────────────────────────────

function calcularHorasModelo(nomeModelo) {
    const modelo   = MODELOS.find(m => m.nome === nomeModelo);
    if (!modelo) return { horas:0, totalKits:0, consumo:0 };

    const estrutura = ESTRUTURAS[nomeModelo] || [];
    const consumo   = KS.consumoHora[nomeModelo] || 0;
    const qtdBase   = KS.qtdBase[nomeModelo] || 1000;

    // ── Lógica correta ───────────────────────────────────────────
    // 1. Para cada posição física (nivel+pos), acha o PN mais escasso
    //    que tenha pelo menos 1 peça E seja da estrutura do modelo
    // 2. Só considera posições com estrutura completa (status OK ou incompleto)
    // 3. Soma o PN mais escasso de CADA posição válida
    // 4. Horas = soma total ÷ consumo/hora
    //
    // Ex: 9 posições × 1.848 un mínima = 16.632 ÷ 120 pç/h = 138,6h

    let somaMinPN  = 0;  // soma do componente mínimo de cada posição
    let posCount   = 0;

    for (let nivel = 0; nivel <= 12; nivel++) {
        if (NIVEL_SKIP.has(nivel)) continue;
        for (const pos of modelo.pos) {
            const pnsPos = KS.grade[nivel]?.[pos] || new Map();
            if (pnsPos.size === 0) continue;

            // Verifica se a posição tem pelo menos 1 PN da estrutura
            let temPN = false;
            for (const comp of estrutura) {
                if ((pnsPos.get(comp.pn) || 0) > 0) { temPN = true; break; }
            }
            if (!temPN) continue;

            // Pega a MENOR quantidade de qualquer PN da estrutura nesta posição
            // (componente gargalo = determina quantas unidades pode montar)
            let minQtdPos = Infinity;
            for (const comp of estrutura) {
                const qtd = pnsPos.get(comp.pn) || 0;
                // PN ausente (0) limita a posição — mas só conta se estrutura completa
                const qtdEfetiva = qtd; // inclui zeros para ser conservador
                minQtdPos = Math.min(minQtdPos, qtdEfetiva);
            }
            if (minQtdPos === Infinity || minQtdPos <= 0) continue;

            somaMinPN += minQtdPos;
            posCount++;
        }
    }

    if (posCount === 0) return { horas:0, totalKits:0, consumo };

    const horas = consumo > 0 ? somaMinPN / consumo : 0;
    return { horas, totalKits: Math.round(somaMinPN), consumo, posCount };
}

// ── FLIP CARD — HORAS / DIAS ─────────────────────────────────

function buildFlipCard(horas, barColor, nomeModelo) {
    const maxHoras = 24;
    const pct      = Math.min(horas / maxHoras, 1);
    const W = 110, H = 62, R = 46, CX = 55, CY = 58;
    const angle    = Math.PI - pct * Math.PI;
    const px       = CX + R * Math.cos(angle);
    const py       = CY - R * Math.sin(angle);
    const bgX1     = CX - R, bgX2 = CX + R;

    let cor = '#475569';
    if (horas > 0) cor = horas < 4 ? '#ef4444' : horas < 8 ? '#f59e0b' : '#22c55e';

    const horasStr = horas > 0 ? horas.toFixed(1) : '—';
    const dias     = horas > 0 ? (horas / 24) : 0;
    const diasStr  = dias >= 1
        ? (Number.isInteger(Math.round(dias * 10) / 10)
            ? Math.round(dias).toString()
            : dias.toFixed(1))
        : (horas > 0 ? '<1' : '—');

    const arcFill = pct > 0
        ? `<path d="M ${bgX1} ${CY} A ${R} ${R} 0 0 1 ${px.toFixed(2)} ${py.toFixed(2)}"
                  fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round" opacity="0.9"/>`
        : '';

    const cardId = 'gauge-' + nomeModelo.replace(/\s+/g,'_');

    // Frente: gauge meia-lua + horas
    const front = `
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
             style="width:100%;max-width:110px;overflow:visible;">
            <path d="M ${bgX1} ${CY} A ${R} ${R} 0 0 1 ${bgX2} ${CY}"
                  fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="7" stroke-linecap="round"/>
            ${arcFill}
            <text x="${CX}" y="${CY - 4}" text-anchor="middle"
                  fill="${cor}" font-size="15" font-weight="800"
                  font-family="'Plus Jakarta Sans',sans-serif">${horasStr}</text>
            <text x="${CX}" y="${CY + 10}" text-anchor="middle"
                  fill="rgba(148,163,184,0.7)" font-size="7.5" font-weight="600"
                  font-family="'Plus Jakarta Sans',sans-serif">${horas > 0 ? 'horas' : 'sem dados'}</text>
        </svg>`;

    // Verso: dias em destaque
    const back = `
        <div style="
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            height:62px;width:110px;gap:2px;">
            <span style="
                font-size:26px;font-weight:900;line-height:1;
                color:${cor};font-family:'Plus Jakarta Sans',sans-serif;
                text-shadow:0 0 20px ${cor}66;">
                ${diasStr}
            </span>
            <span style="font-size:9px;font-weight:700;color:rgba(148,163,184,0.7);
                         text-transform:uppercase;letter-spacing:.08em;">
                ${horas > 0 ? (dias >= 1 ? 'dias' : 'menos de 1 dia') : 'sem dados'}
            </span>
            ${horas > 0 ? `<span style="font-size:8px;color:rgba(148,163,184,0.4);">${horasStr}h total</span>` : ''}
        </div>`;

    return `
        <div id="${cardId}" class="kanban-flip-card"
             style="perspective:600px;width:110px;height:62px;cursor:pointer;"
             onclick="flipGaugeCard('${cardId}')">
            <div class="kanban-flip-inner" style="
                position:relative;width:100%;height:100%;
                transform-style:preserve-3d;
                transition:transform 0.6s cubic-bezier(0.4,0.2,0.2,1);">
                <!-- FRENTE: horas -->
                <div class="kanban-flip-front" style="
                    position:absolute;inset:0;
                    backface-visibility:hidden;-webkit-backface-visibility:hidden;
                    display:flex;align-items:center;justify-content:center;">
                    ${front}
                </div>
                <!-- VERSO: dias -->
                <div class="kanban-flip-back" style="
                    position:absolute;inset:0;
                    backface-visibility:hidden;-webkit-backface-visibility:hidden;
                    transform:rotateY(180deg);
                    display:flex;align-items:center;justify-content:center;">
                    ${back}
                </div>
            </div>
        </div>`;
}

// Flip manual por clique
window.flipGaugeCard = function(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const inner = card.querySelector('.kanban-flip-inner');
    if (!inner) return;
    const isFlipped = inner.style.transform === 'rotateY(180deg)';
    inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
};

// Flip automático de todos os cards a cada 10s
function startGaugeAutoFlip() {
    if (window._gaugeFlipInterval) clearInterval(window._gaugeFlipInterval);
    let flipped = false;
    window._gaugeFlipInterval = setInterval(() => {
        flipped = !flipped;
        document.querySelectorAll('.kanban-flip-card .kanban-flip-inner').forEach(inner => {
            inner.style.transform = flipped ? 'rotateY(180deg)' : '';
        });
    }, 10000);
}

// ── INIT ─────────────────────────────────────────────────────

async function initKanban() {
    renderShelfSkeleton();
    setSyncStatus('Carregando…', 'loading');
    await carregarConfigDoSupabase();
    if (typeof aplicarPermissoes === 'function') aplicarPermissoes();
    const fonteSalva = localStorage.getItem('kanban_fonte') || 'sheets';
    KS.fonte = fonteSalva;
    setTimeout(() => setKanbanFonte(fonteSalva), 150);
    if (fonteSalva === 'totvs') {
        setSyncStatus('Aguardando arquivo XLS do TOTVS', 'neutral');
        if (Object.keys(KS.grade).length > 0) renderShelf();
    } else {
        if (KS.sheetsUrl) await syncSheets();
        else setSyncStatus('Configure o Google Sheets (Admin)', 'neutral');
    }
}

// ── SYNC ─────────────────────────────────────────────────────

async function syncSheets() {
    const url = (getVal('cfg-sheets-url')||'').trim() || KS.sheetsUrl;
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
    } catch(e) {
        setSyncStatus(`Erro: ${e.message}`, 'error');
    }
    animateSyncIcon(false);
}

// ── CSV ───────────────────────────────────────────────────────

async function fetchCSV(url) {
    const u = toCSVUrl(url.trim());
    console.log('[Kanban] Buscando CSV:', u);
    let r;
    try {
        r = await fetch(u, { redirect: 'follow' });
    } catch(e) {
        throw new Error('Falha de rede — verifique se a planilha está publicada como CSV público');
    }
    if (!r.ok) throw new Error(`HTTP ${r.status} — verifique a URL do Sheets`);
    const text = await r.text();
    if (!text || text.length < 10) throw new Error('Planilha vazia ou sem dados');
    return text;
}
function toCSVUrl(url) {
    // Já é URL de publicação do Sheets — garante output=csv
    if (url.includes('spreadsheets') && url.includes('output=')) {
        return url
            .replace('output=tsv', 'output=csv')
            .replace('output=xlsx','output=csv')
            .replace('output=pdf', 'output=csv');
    }
    // URL de edição — converte para URL de publicação
    const mId = url.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
    if (!mId) return url;
    const id   = mId[1];
    const mGid = url.match(/[?&#]gid=(\d+)/);
    const gid  = mGid ? `&gid=${mGid[1]}` : '';
    if (url.includes('/d/e/'))
        return `https://docs.google.com/spreadsheets/d/e/${id}/pub?single=true&output=csv${gid}`;
    return `https://docs.google.com/spreadsheets/d/${id}/pub?output=csv${gid}`;
}
function parseCSVRows(csv) {
    return csv.trim().split('\n').map(line=>{const cells=[];let cur='',inQ=false;for(const ch of line){if(ch==='"')inQ=!inQ;else if((ch===','||ch===';')&&!inQ){cells.push(cur.trim());cur='';}else cur+=ch;}cells.push(cur.trim());return cells;});
}
function parseEstoqueALM(csv) {
    const rows=parseCSVRows(csv); if(rows.length<2) return {};
    const h=rows[0].map(c=>(c||'').toLowerCase().trim());
    const fi=names=>{for(const n of names){const i=h.findIndex(c=>c.includes(n));if(i>=0)return i;}return -1;};
    const iPN  = fi(['item']);
    const iDep = fi(['dep']);
    const iLoc = fi(['localiz']);
    const iQty = fi(['qtd liq','quantidade','qtd']);

    const grade = {};
    // Dedup por PN+nivel+pos+quantidade:
    // O ERP exporta uma linha por tipo de alocação (picking + storage) para o MESMO lote.
    // Essas linhas têm EXATAMENTE a mesma quantidade → são duplicatas.
    // Lotes DIFERENTES do mesmo PN têm quantidades diferentes → devem ser somadas.
    const seen = new Set(); // chave: pn|nivel|pos|qtd

    rows.slice(1).forEach(r => {
        if ((r[iDep]||'').trim().toUpperCase() !== 'ALM') return;
        const loc = (r[iLoc]||'').trim().toUpperCase();
        const m   = loc.match(/^F(\d+)-0*(\d+)$/);
        if (!m) return;
        const nivel = parseInt(m[1]), pos = parseInt(m[2]);
        if (pos > KS.POSICOES || nivel > 12) return;

        const pn  = (r[iPN]||'').trim(); if (!pn) return;
        const qtd = parseFloat(String(r[iQty]||'0').replace(/\./g,'').replace(',','.'))||0;
        if (qtd <= 0) return;

        // Linha duplicada = mesmo PN, mesma posição, mesma quantidade exata
        const chave = pn + '|' + nivel + '|' + pos + '|' + qtd;
        if (seen.has(chave)) return;
        seen.add(chave);

        if (!grade[nivel])      grade[nivel]      = {};
        if (!grade[nivel][pos]) grade[nivel][pos] = new Map();
        grade[nivel][pos].set(pn, (grade[nivel][pos].get(pn)||0) + qtd);
    });
    return grade;
}

// ── UPLOAD XLS (TOTVS) ───────────────────────────────────────

function abrirUploadXLS() {
    document.getElementById('kanban-xls-input')?.click();
}

async function processarUploadXLS(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Aceita .xls e .xlsx
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xls','xlsx'].includes(ext)) {
        if (typeof showToast === 'function') showToast('Arquivo deve ser .xls ou .xlsx', 'warning');
        return;
    }

    setSyncStatus('Lendo arquivo...', 'loading');
    animateSyncIcon(true);

    try {
        // Lê o arquivo como ArrayBuffer
        const buffer = await file.arrayBuffer();

        // SheetJS — disponível via CDN no index.html
        const XLSX = window.XLSX;
        if (!XLSX) throw new Error('SheetJS não carregado. Adicione a CDN no index.html');

        const workbook  = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // primeira aba
        const sheet     = workbook.Sheets[sheetName];

        // Converte para CSV para usar o parser já existente
        const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ',', RS: '\n' });

        if (!csv || csv.length < 50) throw new Error('Arquivo vazio ou sem dados reconhecíveis');

        // Usa o mesmo parser do Google Sheets
        KS.grade = parseEstoqueALM(csv);

        // Salva nome do arquivo e timestamp para referência
        KS.ultimoArquivo = file.name;
        KS.ultimaSync    = new Date();

        renderShelf();

        const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
        setSyncStatus('✓ Arquivo carregado', 'ok');
        setText('last-sync', `${file.name} às ${now}`);

        if (typeof showToast === 'function')
            showToast(`✅ ${file.name} processado com sucesso!`, 'success');

        // Atualiza info do último arquivo no painel
        const nomeEl = document.getElementById('kanban-arquivo-nome');
        const horaEl = document.getElementById('kanban-arquivo-hora');
        const infoEl = document.getElementById('kanban-ultimo-arquivo');
        const dropEl = document.getElementById('kanban-drop-zone');
        if (nomeEl) nomeEl.textContent = file.name;
        if (horaEl) horaEl.textContent = 'às ' + new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
        if (infoEl) { infoEl.style.display = 'flex'; infoEl.classList.remove('hidden'); }
        if (dropEl) dropEl.style.display = 'none';

    } catch(e) {
        console.error('[Upload XLS]', e);
        setSyncStatus('Erro ao ler arquivo', 'error');
        if (typeof showToast === 'function')
            showToast('Erro: ' + e.message, 'error');
    }

    animateSyncIcon(false);
    // Limpa o input para permitir re-upload do mesmo arquivo
    event.target.value = '';
}

window.abrirUploadXLS     = abrirUploadXLS;
window.processarUploadXLS = processarUploadXLS;

// ── FONTE DE DADOS — Sheets ou TOTVS ─────────────────────────

KS.fonte = localStorage.getItem('kanban_fonte') || 'sheets';



function kanbanFonteAction() {
    if (KS.fonte === 'totvs') abrirUploadXLS();
    else syncSheets();
}

// Drag & drop no painel TOTVS
window.kanbanHandleDrop = function(event) {
    event.preventDefault();
    const dz = document.getElementById('kanban-drop-zone');
    if (dz) dz.style.background = 'rgba(16,185,129,.06)';
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xls','xlsx'].includes(ext)) {
        if (typeof showToast === 'function') showToast('Arquivo deve ser .xls ou .xlsx', 'warning');
        return;
    }
    // Simula o evento de upload
    processarUploadXLS({ target: { files: [file], value: '' } });
};

window.setKanbanFonte    = setKanbanFonte;
window.kanbanFonteAction = kanbanFonteAction;

// ── AVALIA POSIÇÃO ────────────────────────────────────────────

function avaliarPosicao(nivel, pos) {
    const modelo=POS_MODELO[pos]; if(!modelo) return{status:'vazio',itens:[],estranhos:[]};
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
    const totalFalta=itens.filter(i=>i.estado==='falta').length;
    const totalDup=itens.filter(i=>i.estado==='duplicado').length;
    let status;
    if(pnsPos.size===0){status='vazio';}
    else if(totalDup>0&&totalFalta===0){status='duplicado';}
    else if(totalFalta>0){status='incompleto';}
    else if(estranhos.length>0&&itens.filter(i=>i.estado==='ok').length===0){status='estranho';}
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
    // Inicia o flip automático horas ↔ dias a cada 10s
    startGaugeAutoFlip();
}

function buildCardHTML(avalia,modelo){
    const bar=`<div class="modelo-bar" style="background:${modelo?.barColor||'#64748b'}"></div>`;
    const t=avalia.itens.length;
    switch(avalia.status){
        case 'ok':return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:20px;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span><p style="font-size:9px;font-weight:800;color:#22c55e;">KANBAN OK</p><p style="font-size:8px;color:#64748b;">${t}/${t} itens</p></div>`;
        case 'duplicado':{const nd=avalia.itens.filter(i=>i.estado==='duplicado').length;return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#60a5fa;font-variation-settings:'FILL' 1">content_copy</span><p style="font-size:8.5px;font-weight:800;color:#60a5fa;">DUPLICADO</p><p style="font-size:8px;color:#60a5fa;">${nd} PN(s)</p></div>`;}
        case 'incompleto':{const nf=avalia.itens.filter(i=>i.estado==='falta').length;return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f59e0b;font-variation-settings:'FILL' 1">warning</span><p style="font-size:8.5px;font-weight:800;color:#f59e0b;">INCOMPLETO</p><p style="font-size:8px;color:#f59e0b;">${nf} faltando</p></div>`;}
        case 'estranho':return`${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f97316;font-variation-settings:'FILL' 1">help</span><p style="font-size:8px;font-weight:800;color:#f97316;">MAT. EXTRA</p><p style="font-size:8px;color:#f97316;">${avalia.estranhos.length} PN(s)</p></div>`;
        default:return bar;
    }
}

// ── HEADER COM GAUGE ──────────────────────────────────────────

function buildModeloHeader() {
    const tr = document.createElement('tr');
    const th0 = document.createElement('th');
    th0.className = 'nivel-cell';
    tr.appendChild(th0);

    MODELOS.forEach(m => {
        const th = document.createElement('th');
        th.colSpan = m.pos.length;
        th.style.paddingBottom = '8px';
        th.style.verticalAlign = 'bottom';

        const { horas, totalKits, consumo } = calcularHorasModelo(m.nome);

        const consumoStr = consumo > 0
            ? `<span style="font-size:9px;color:#64748b;">${consumo} pç/h</span>`
            : `<span style="font-size:9px;color:#475569;">sem taxa</span>`;

        th.innerHTML = `
            <div style="background:${m.cor||'#6366f1'}11;border:1.5px solid ${m.barColor}44;
                        border-radius:12px;padding:8px 6px 6px;text-align:center;min-width:110px;">
                <div style="font-size:10px;font-weight:900;color:${m.barColor};
                            text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">
                    ${m.nome}
                </div>
                <div style="display:flex;justify-content:center;margin:0 0 2px;">
                    ${buildFlipCard(horas, m.barColor, m.nome)}
                </div>
                <div style="margin-top:2px;">${consumoStr}</div>
                <div style="font-size:8px;color:rgba(148,163,184,0.35);margin-top:1px;">
                    clique para alternar
                </div>
            </div>`;
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
    if(flagAtual?.status==='pendente') body+=`<span style="background:rgba(239,68,68,.2);color:#f87171;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🚩 ${flagAtual.operador||'—'}</span>`;
    body+=`</div>`;
    body+=`<div class="overflow-y-auto" style="max-height:300px;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead style="position:sticky;top:0;background:#0f172a;z-index:1;"><tr style="border-bottom:1px solid rgba(148,163,184,.2);"><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">PN</th><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Descrição</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Saldo</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Esperado</th><th style="text-align:center;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">St.</th></tr></thead><tbody>`;
    avalia.itens.forEach(comp=>{
        const icon=comp.estado==='ok'?'✅':comp.estado==='duplicado'?'🔵':'⚠️';
        const cor=comp.estado==='ok'?'#22c55e':comp.estado==='duplicado'?'#60a5fa':'#f59e0b';
        body+=`<tr style="border-bottom:1px solid rgba(148,163,184,.07);"><td style="padding:6px 8px;font-family:monospace;font-size:11px;color:#cbd5e1;white-space:nowrap;">${comp.pn}</td><td style="padding:6px 8px;color:#94a3b8;font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${comp.desc}</td><td style="padding:6px 8px;text-align:right;font-weight:700;color:${cor};">${comp.qtdReal.toLocaleString('pt-BR')}</td><td style="padding:6px 8px;text-align:right;color:#64748b;">${comp.qtdEsperada.toLocaleString('pt-BR')}</td><td style="padding:6px 8px;text-align:center;">${icon}</td></tr>`;
    });
    body+='</tbody></table></div>';
    if(avalia.estranhos.length>0){body+=`<div style="margin-top:10px;padding:8px;background:rgba(249,115,22,.08);border-radius:8px;border:1px solid rgba(249,115,22,.2);"><p style="font-size:10px;font-weight:800;color:#f97316;margin-bottom:4px;">🟠 Fora da estrutura</p>`;avalia.estranhos.forEach(e=>{body+=`<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px;"><span style="font-family:monospace;color:#cbd5e1;">${e.pn}</span><span style="color:#f97316;font-weight:700;">${e.qtd}</span></div>`;});body+='</div>';}
    const nivel=typeof getNivel==='function'?getNivel():0;
    if(nivel>=2){
        const jaMarcado=flagAtual?.status==='pendente';
        body+=`<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(148,163,184,.12);display:flex;gap:8px;">${jaMarcado?`<button onclick="removerFlag('${posKey}');closeKanbanDetail();" style="flex:1;padding:8px;background:rgba(34,197,94,.15);color:#4ade80;border:1.5px solid rgba(34,197,94,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">check_circle</span>Remover flag</button>`:`<button onclick="abrirMarcarVazio('${posKey}','${modelo?.nome||''}');closeKanbanDetail();" style="flex:1;padding:8px;background:rgba(239,68,68,.12);color:#f87171;border:1.5px solid rgba(239,68,68,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">report</span>Marcar como Vazio</button>`}</div>`;
    }
    document.getElementById('kd-body').innerHTML=body;
    const modal=document.getElementById('kanban-detail-modal'),cont=document.getElementById('kanban-detail-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{cont.style.transform='scale(1)';cont.style.opacity='1';});
}

function closeKanbanDetail(){
    const modal=document.getElementById('kanban-detail-modal'),cont=document.getElementById('kanban-detail-content');
    cont.style.transform='scale(.95)';cont.style.opacity='0';
    setTimeout(()=>{modal.classList.add('hidden');cont.style.transform='scale(.95)';},250);
}

// ── MODAL CONSUMO POR HORA ─────────────────────────────────────

function openConsumoConfig(){
    if((typeof getNivel==='function'?getNivel():0)<3){showToast&&showToast('Apenas Admin pode configurar consumo','warning');return;}
    document.getElementById('consumo-config-modal')?.remove();

    const rows=MODELOS.map(m=>{
        const {horas,totalKits}=calcularHorasModelo(m.nome);
        const horasStr=horas>0?horas.toFixed(1)+'h':'—';
        let corHora='text-slate-400'; if(horas>0) corHora=horas<4?'text-red-400':horas<8?'text-amber-400':'text-emerald-400';
        return `
        <div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex-1">
                <span style="color:${m.barColor};font-weight:700;font-size:12px;">${m.nome}</span>
                <p class="text-[10px] text-slate-400">
                    ${totalKits > 0 ? `${totalKits.toLocaleString('pt-BR')} un em estoque` : 'Sem estoque / sem Sheets'}
                    ${horas > 0 ? `· <span class="${corHora} font-bold">${horasStr}</span>` : ''}
                </p>
            </div>
            <div class="flex items-center gap-2">
                <label class="text-[10px] text-slate-400 whitespace-nowrap">pç/hora:</label>
                <input type="number" min="0" step="1"
                       data-consumo="${m.nome}"
                       value="${KS.consumoHora[m.nome]||0}"
                       placeholder="0"
                       class="w-20 px-2 py-1.5 text-sm text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:border-primary-500 outline-none">
            </div>
        </div>`}).join('');

    const html=`
        <div id="consumo-config-modal" class="fixed inset-0 z-[95] hidden">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="fecharConsumoConfig()"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div id="consumo-config-content"
                     class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto"
                     style="transform:scale(.95);opacity:0;transition:all .25s;">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-symbols-rounded text-primary-500">speed</span>
                                Consumo por Hora
                            </h3>
                            <p class="text-xs text-slate-400 mt-0.5">
                                Horas = Estoque total ÷ Consumo/hora · Salvo para todos
                            </p>
                        </div>
                        <button onclick="fecharConsumoConfig()" class="text-slate-400 hover:text-slate-600">
                            <span class="material-symbols-rounded">close</span>
                        </button>
                    </div>
                    <div class="px-6 py-2 max-h-96 overflow-y-auto">${rows}</div>
                    <div class="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                        <button onclick="fecharConsumoConfig()"
                            class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button onclick="salvarConsumoConfig()"
                            class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            <span class="material-symbols-rounded text-sm">save</span>
                            Salvar para Todos
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend',html);
    const modal=document.getElementById('consumo-config-modal'),cont=document.getElementById('consumo-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{cont.style.transform='scale(1)';cont.style.opacity='1';});
}

function fecharConsumoConfig(){
    const m=document.getElementById('consumo-config-modal'),c=document.getElementById('consumo-config-content');
    if(!m) return; c.style.transform='scale(.95)'; c.style.opacity='0';
    setTimeout(()=>m.remove(),250);
}

async function salvarConsumoConfig(){
    const consumo={};
    document.querySelectorAll('[data-consumo]').forEach(inp=>{
        const v=parseFloat(inp.value)||0;
        consumo[inp.dataset.consumo]=v;
    });
    KS.consumoHora={...KS.consumoHora,...consumo};
    await salvarConsumoNoSupabase(KS.consumoHora);
    fecharConsumoConfig();
    renderShelf(); // atualiza gauges
    if(typeof showToast==='function') showToast('✅ Consumo salvo — gauges atualizados!','success');
}

// ── MODAL CONFIG QTD ──────────────────────────────────────────

function openQtdConfig(){
    if((typeof getNivel==='function'?getNivel():0)<3){showToast&&showToast('Apenas Admin pode alterar','warning');return;}
    document.getElementById('qtd-config-modal')?.remove();
    const rows=MODELOS.map(m=>`<div class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800"><div class="flex-1"><span style="color:${m.barColor};font-weight:700;font-size:12px;">${m.nome}</span><p style="font-size:10px;color:#64748b;">Pos. ${m.pos.join(', ')} · ${ESTRUTURAS[m.nome]?.length||0} componentes</p></div><div class="flex items-center gap-2"><label style="font-size:10px;color:#94a3b8;">Base (un):</label><input type="number" min="1" step="1" data-modelo="${m.nome}" value="${KS.qtdBase[m.nome]||1000}" class="w-24 px-2 py-1.5 text-sm text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:border-primary-500 outline-none"></div></div>`).join('');
    const html=`<div id="qtd-config-modal" class="fixed inset-0 z-[95] hidden"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeQtdConfig()"></div><div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"><div id="qtd-config-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto p-6" style="transform:scale(.95);opacity:0;transition:all .25s;"><div class="flex items-center justify-between mb-4"><div><h3 class="font-bold text-slate-900 dark:text-white">Quantidade Base por Kanban</h3><p class="text-xs text-slate-400 mt-0.5">Salvo globalmente para todos os usuários</p></div><button onclick="closeQtdConfig()" class="text-slate-400 hover:text-slate-600"><span class="material-symbols-rounded">close</span></button></div><div class="space-y-0 max-h-80 overflow-y-auto">${rows}</div><div class="flex gap-3 mt-5"><button onclick="closeQtdConfig()" class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600">Cancelar</button><button onclick="salvarQtdConfig()" class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">Salvar para Todos</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend',html);
    const modal=document.getElementById('qtd-config-modal'),cont=document.getElementById('qtd-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>{cont.style.transform='scale(1)';cont.style.opacity='1';});
}
function closeQtdConfig(){const m=document.getElementById('qtd-config-modal'),c=document.getElementById('qtd-config-content');if(!m)return;c.style.transform='scale(.95)';c.style.opacity='0';setTimeout(()=>m.remove(),250);}
async function salvarQtdConfig(){const qtds={};document.querySelectorAll('[data-modelo]').forEach(inp=>{const v=parseInt(inp.value);if(inp.dataset.modelo&&v>0)qtds[inp.dataset.modelo]=v;});KS.qtdBase={...KS.qtdBase,...qtds};await salvarQtdNoSupabase(KS.qtdBase);closeQtdConfig();renderShelf();if(typeof showToast==='function')showToast('✅ Quantidades salvas para todos!','success');}

// ── CONFIG SHEETS ─────────────────────────────────────────────

function openSheetsConfig(){if((typeof getNivel==='function'?getNivel():0)<3){showToast&&showToast('Apenas Admin pode alterar','warning');return;}setVal('cfg-sheets-url',KS.sheetsUrl);const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');m.classList.remove('hidden');requestAnimationFrame(()=>{c.style.transform='scale(1)';c.style.opacity='1';});}
function closeSheetsConfig(){const m=document.getElementById('sheets-config-modal'),c=document.getElementById('sheets-config-content');c.style.transform='scale(.95)';c.style.opacity='0';setTimeout(()=>{m.classList.add('hidden');c.style.transform='scale(.95)';},250);}
async function saveSheetsConfig(){const url=(getVal('cfg-sheets-url')||'').trim();if(!url){showToast&&showToast('Informe a URL','warning');return;}await salvarUrlNoSupabase(url);setVal('sheets-url',url);closeSheetsConfig();await syncSheets();showToast&&showToast('✅ URL salva para todos!','success');}

// ── FILTRO ────────────────────────────────────────────────────

function filterKanban(type){KS.currentFilter=type;document.querySelectorAll('.kf-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter===type));applyFilter(type);}
function applyFilter(type){const q=(document.getElementById('kanban-search')?.value||'').toLowerCase();document.querySelectorAll('td.vaga').forEach(td=>{const f=td.dataset.filter||'vazio',pos=td.dataset.pos||'';let show=true;if(type==='search')show=pos.toLowerCase().includes(q);else if(type!=='all')show=f===type;td.style.opacity=show?'1':'0.06';td.style.pointerEvents=show?'auto':'none';});}

// ── HELPERS ───────────────────────────────────────────────────

function setSyncStatus(msg,type){const e=document.getElementById('sync-status');if(!e)return;const c={ok:'text-emerald-500',error:'text-rose-500',loading:'text-slate-400',neutral:'text-slate-400'};e.className=`font-medium ${c[type]||'text-slate-400'}`;e.textContent=msg;}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v??'—';}
function getVal(id){return document.getElementById(id)?.value||'';}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v;}
function animateSyncIcon(on){const i=document.getElementById('sync-icon');if(i)i.style.animation=on?'spin 1s linear infinite':'';}

// ── EXPORTS ───────────────────────────────────────────────────

// ── FONTE DE DADOS — TABS ─────────────────────────────────────

function setKanbanFonte(fonte) {
    KS.fonte = fonte;
    localStorage.setItem('kanban_fonte', fonte);
    document.querySelectorAll('.kanban-fonte-tab').forEach(b => b.classList.remove('active-fonte'));
    document.getElementById('tab-' + fonte)?.classList.add('active-fonte');
    const panel = document.getElementById('kanban-totvs-panel');
    if (panel) panel.classList.toggle('visible', fonte === 'totvs');
    const label = document.getElementById('kanban-action-label');
    const icon  = document.getElementById('sync-icon');
    if (fonte === 'totvs') {
        if (label) label.textContent = 'Carregar XLS';
        if (icon)  icon.textContent  = 'upload_file';
    } else {
        if (label) label.textContent = 'Atualizar';
        if (icon)  icon.textContent  = 'sync';
    }
}
// Exporta imediatamente para que onclick do HTML funcione
window.setKanbanFonte = setKanbanFonte;

function kanbanFonteAction() {
    if (KS.fonte === 'totvs') abrirUploadXLS();
    else syncSheets();
}
window.kanbanFonteAction = kanbanFonteAction;

window.kanbanHandleDrop = function(event) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    const inp = document.getElementById('kanban-xls-input');
    if (inp) { inp.files = dt.files; inp.dispatchEvent(new Event('change',{bubbles:true})); }
};


window.initKanban=initKanban; window.setKanbanFonte=setKanbanFonte; window.kanbanFonteAction=kanbanFonteAction; window.syncSheets=syncSheets; window.filterKanban=filterKanban;
window.openSheetsConfig=openSheetsConfig; window.closeSheetsConfig=closeSheetsConfig; window.saveSheetsConfig=saveSheetsConfig;
window.openKanbanDetail=openKanbanDetail; window.closeKanbanDetail=closeKanbanDetail;
window.openQtdConfig=openQtdConfig; window.closeQtdConfig=closeQtdConfig; window.salvarQtdConfig=salvarQtdConfig;
window.openConsumoConfig=openConsumoConfig; window.fecharConsumoConfig=fecharConsumoConfig; window.salvarConsumoConfig=salvarConsumoConfig;
// abrirMarcarVazio, fecharMarcarVazio, confirmarMarcarVazio → definidas em estoque.js

document.addEventListener('pageChanged',e=>{if(e.detail==='kanban')initKanban();});
console.log('✅ kanban-sheets.js — com gauge de horas');
