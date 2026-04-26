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
    // AGCO 1250 — componentes configuráveis via painel de prateleiras
    'AGCO 1250': [],
};

// ── MODELOS PADRÃO — sobrepostos pela config do Supabase ────
const MODELOS_DEFAULT = [
    { nome:'FIREFLY',        pos:[1,2],  cor:'#93c5fd', cls:'m-firefly',    barColor:'#3b82f6' },
    { nome:'GM ASP',         pos:[3,4],  cor:'#86efac', cls:'m-gmasp',      barColor:'#22c55e' },
    { nome:'GM TURBO',       pos:[5,6],  cor:'#5eead4', cls:'m-gmturbo',    barColor:'#14b8a6' },
    { nome:'FRONT COVER',    pos:[7],    cor:'#67e8f9', cls:'m-frontcover', barColor:'#06b6d4' },
    { nome:'HYUNDAI VOLUTA', pos:[8],    cor:'#fde047', cls:'m-hyundai',    barColor:'#eab308' },
    { nome:'AGCO 1250',      pos:[9],    cor:'#d8b4fe', cls:'m-agco',       barColor:'#a855f7' },
    { nome:'RENAULT',        pos:[10],   cor:'#a5b4fc', cls:'m-renault',    barColor:'#6366f1' },
    { nome:'MAN D08',        pos:[11],   cor:'#93c5fd', cls:'m-man',        barColor:'#2563eb' },
];

// MODELOS ativo — será substituído ao carregar config do Supabase
let MODELOS = [...MODELOS_DEFAULT];

const NIVEL_SKIP = new Set([]); // nenhum nível físico pulado
let POS_MODELO = {};

function recalcPosModelo() {
    POS_MODELO = {};
    MODELOS.forEach(m => m.pos.forEach(p => { POS_MODELO[p] = m; }));
}
recalcPosModelo();

// ── CONFIG GLOBAL ─────────────────────────────────────────────

const KS = {
    POSICOES: 11,
    grade: {},
    fonte: 'sheets',
    gradeXLS: {},
    currentFilter: 'all',
    sheetsUrl: '',
    ultimoArquivo: '',
    ultimaSync: null,
    lotesMap: new Map(), // "posKey|pn" → [lote1, lote2, ...] capturado do XLS
    multiplos: {},       // "modelo|pn" → mult (override do ESTRUTURAS hardcoded)
    qtdBase: { 'FIREFLY':1000,'GM ASP':1000,'GM TURBO':1000,'FRONT COVER':1000,'HYUNDAI VOLUTA':1000,'AGCO 1250':1000,'RENAULT':1000,'MAN D08':1000 },
    consumoHora: { 'FIREFLY':0,'GM ASP':0,'GM TURBO':0,'FRONT COVER':0,'HYUNDAI VOLUTA':0,'AGCO 1250':0,'RENAULT':0,'MAN D08':0 },
};

// ── SERIALIZAÇÃO DO GRADE (Map ↔ JSON) ────────────────────────
// KS.grade é { nivel: { pos: Map<pn,qtd> } }
// JSON não serializa Map → converte para objeto aninhado

function gradeToJSON(grade) {
    const obj = {};
    for (const nivel in grade) {
        obj[nivel] = {};
        for (const pos in grade[nivel]) {
            const map = grade[nivel][pos];
            obj[nivel][pos] = map instanceof Map
                ? Object.fromEntries(map)
                : map;
        }
    }
    return obj;
}

function gradeFromJSON(obj) {
    const grade = {};
    for (const nivel in obj) {
        grade[nivel] = {};
        for (const pos in obj[nivel]) {
            grade[nivel][pos] = new Map(Object.entries(obj[nivel][pos]));
        }
    }
    return grade;
}

// Serializa Map<string, string[]> → objeto JSON
function lotesToJSON(lotesMap) {
    const obj = {};
    for (const [k, v] of lotesMap) { obj[k] = v; }
    return obj;
}

// Restaura objeto JSON → Map<string, string[]>
function lotesFromJSON(obj) {
    const map = new Map();
    for (const k in obj) { map.set(k, Array.isArray(obj[k]) ? obj[k] : [obj[k]]); }
    return map;
}

// ── SUPABASE CONFIG ───────────────────────────────────────────

async function carregarConfigDoSupabase() {
    try {
        const { data } = await supabaseClient.from('system_config').select('chave,valor')
            .in('chave', [
                'kanban_sheets_url',
                'kanban_qtd_base',
                'kanban_consumo_hora',
                'kanban_grade_totvs',
                'kanban_grade_totvs_meta',
                'kanban_lotes_totvs',   // ← lotes por posição/PN
                'kanban_multiplos',      // ← múltiplos por modelo/PN
                'kanban_modelos_config', // ← modelos/posições configuráveis
                'kanban_estruturas_ext', // ← estruturas adicionais (ex: AGCO)
            ]);
        if (!data) return;
        data.forEach(row => {
            if (row.chave === 'kanban_sheets_url' && row.valor)
                KS.sheetsUrl = row.valor;
            if (row.chave === 'kanban_qtd_base' && row.valor)
                try { KS.qtdBase = { ...KS.qtdBase, ...JSON.parse(row.valor) }; } catch(_) {}
            if (row.chave === 'kanban_consumo_hora' && row.valor)
                try { KS.consumoHora = { ...KS.consumoHora, ...JSON.parse(row.valor) }; } catch(_) {}

            // ── Carrega grade TOTVS compartilhado ───────────────
            if (row.chave === 'kanban_grade_totvs' && row.valor) {
                try {
                    const obj = JSON.parse(row.valor);
                    KS.gradeXLS = gradeFromJSON(obj);
                    console.log('[Supabase] Grade TOTVS carregado:', Object.keys(obj).length, 'níveis');
                } catch(e) {
                    console.warn('[Supabase] Erro ao carregar grade TOTVS:', e.message);
                }
            }
            if (row.chave === 'kanban_grade_totvs_meta' && row.valor) {
                try {
                    const meta = JSON.parse(row.valor);
                    KS.ultimoArquivo = meta.arquivo || '';
                    KS.ultimaSync    = meta.data ? new Date(meta.data) : null;
                } catch(_) {}
            }
            if (row.chave === 'kanban_lotes_totvs' && row.valor) {
                try {
                    KS.lotesMap = lotesFromJSON(JSON.parse(row.valor));
                    console.log('[Supabase] LotesMap carregado —', KS.lotesMap.size, 'entradas');
                } catch(e) {
                    console.warn('[Supabase] Erro ao carregar lotesMap:', e.message);
                }
            }
            if (row.chave === 'kanban_multiplos' && row.valor) {
                try {
                    KS.multiplos = JSON.parse(row.valor);
                    console.log('[Supabase] Múltiplos carregados —', Object.keys(KS.multiplos).length, 'entradas');
                } catch(e) {
                    console.warn('[Supabase] Erro ao carregar múltiplos:', e.message);
                }
            }
            if (row.chave === 'kanban_modelos_config' && row.valor) {
                try {
                    const cfg = JSON.parse(row.valor);
                    if (Array.isArray(cfg) && cfg.length > 0) {
                        MODELOS = cfg;
                        KS.POSICOES = Math.max(...cfg.flatMap(m => m.pos));
                        recalcPosModelo();
                        console.log('[Supabase] Modelos carregados —', MODELOS.length, 'modelos,', KS.POSICOES, 'posições');
                    }
                } catch(e) {
                    console.warn('[Supabase] Erro ao carregar modelos:', e.message);
                }
            }
            if (row.chave === 'kanban_estruturas_ext' && row.valor) {
                try {
                    const ext = JSON.parse(row.valor);
                    Object.assign(ESTRUTURAS, ext);
                    console.log('[Supabase] Estruturas ext carregadas —', Object.keys(ext).join(', '));
                } catch(e) {
                    console.warn('[Supabase] Erro ao carregar estruturas ext:', e.message);
                }
            }
        });
    } catch(e) { console.warn('Config kanban:', e.message); }
}

async function salvarUrlNoSupabase(url) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_sheets_url', valor: url,
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
    KS.sheetsUrl = url;
}

async function salvarQtdNoSupabase(qtds) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_qtd_base', valor: JSON.stringify(qtds),
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
}

async function salvarModelosNoSupabase(modelos) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_modelos_config', valor: JSON.stringify(modelos),
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
}

async function salvarEstruturasExtNoSupabase(ext) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_estruturas_ext', valor: JSON.stringify(ext),
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
}

async function salvarMultiplosNoSupabase(multiplos) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_multiplos', valor: JSON.stringify(multiplos),
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
}

async function salvarConsumoNoSupabase(consumo) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    await supabaseClient.from('system_config').upsert({
        chave: 'kanban_consumo_hora', valor: JSON.stringify(consumo),
        updated_at: new Date().toISOString(), updated_by: user?.email || 'admin'
    });
}

// ── NOVO: Salva o grade TOTVS no Supabase para todos verem ────
async function salvarGradeNoSupabase(grade, nomeArquivo) {
    const user = window.auth?.getUser?.() || window.auth?.getCurrentUser?.();
    const agora = new Date().toISOString();
    try {
        const gradeJSON = JSON.stringify(gradeToJSON(grade));

        // Grade pode ser grande — verifica tamanho (~4MB limite seguro)
        if (gradeJSON.length > 4_000_000) {
            console.warn('[Supabase] Grade muito grande para salvar:', gradeJSON.length, 'bytes');
            if (typeof showToast === 'function')
                showToast('⚠️ Arquivo grande — apenas você verá os dados desta sessão', 'warning');
            return false;
        }

        const lotesJSON = JSON.stringify(lotesToJSON(KS.lotesMap));

        await Promise.all([
            supabaseClient.from('system_config').upsert({
                chave: 'kanban_grade_totvs',
                valor: gradeJSON,
                updated_at: agora,
                updated_by: user?.email || 'admin',
            }),
            supabaseClient.from('system_config').upsert({
                chave: 'kanban_grade_totvs_meta',
                valor: JSON.stringify({ arquivo: nomeArquivo, data: agora, usuario: user?.email || 'admin' }),
                updated_at: agora,
                updated_by: user?.email || 'admin',
            }),
            supabaseClient.from('system_config').upsert({
                chave: 'kanban_lotes_totvs',
                valor: lotesJSON,
                updated_at: agora,
                updated_by: user?.email || 'admin',
            }),
        ]);

        console.log('[Supabase] Grade TOTVS salvo — tamanho:', gradeJSON.length, 'bytes');
        return true;
    } catch(e) {
        console.error('[Supabase] Erro ao salvar grade:', e.message);
        if (typeof showToast === 'function')
            showToast('Erro ao salvar no servidor: ' + e.message, 'error');
        return false;
    }
}

function getQtdBase() { return KS.qtdBase; }

// ── CÁLCULO DE HORAS DE PRODUÇÃO ──────────────────────────────

function calcularHorasModelo(nomeModelo) {
    const modelo = MODELOS.find(m => m.nome === nomeModelo);
    if (!modelo) return { horas:0, totalKits:0, consumo:0 };

    const estrutura = ESTRUTURAS[nomeModelo] || [];
    const consumo   = KS.consumoHora[nomeModelo] || 0;

    let somaMinPN = 0, posCount = 0;

    for (let nivel = 0; nivel <= 12; nivel++) {
        if (NIVEL_SKIP.has(nivel)) continue;
        for (const pos of modelo.pos) {
            const pnsPos = KS.grade[nivel]?.[pos] || new Map();
            if (pnsPos.size === 0) continue;
            let temPN = false;
            for (const comp of estrutura) {
                if ((pnsPos.get(comp.pn) || 0) > 0) { temPN = true; break; }
            }
            if (!temPN) continue;
            let minQtdPos = Infinity;
            for (const comp of estrutura) {
                minQtdPos = Math.min(minQtdPos, pnsPos.get(comp.pn) || 0);
            }
            if (minQtdPos === Infinity || minQtdPos <= 0) continue;
            somaMinPN += minQtdPos;
            posCount++;
        }
    }

    if (posCount === 0) return { horas:0, totalKits:0, consumo };
    const horas = consumo > 0 ? somaMinPN / consumo : 0;
    if (consumo > 0) console.log('[Horas]', nomeModelo, '→', horas.toFixed(1) + 'h');
    return { horas, totalKits: Math.round(somaMinPN), consumo, posCount };
}

// ── FLIP CARD — HORAS / DIAS ─────────────────────────────────

function buildFlipCard(horas, barColor, nomeModelo) {
    const maxHoras = 24;
    const pct      = Math.min(horas / maxHoras, 1);
    const W = 110, H = 62, R = 46, CX = 55, CY = 58;
    const angle = Math.PI - pct * Math.PI;
    const px = CX + R * Math.cos(angle);
    const py = CY - R * Math.sin(angle);
    const bgX1 = CX - R, bgX2 = CX + R;

    let cor = '#475569';
    if (horas > 0) cor = horas < 4 ? '#ef4444' : horas < 8 ? '#f59e0b' : '#22c55e';

    const horasStr = horas > 0 ? horas.toFixed(1) : '—';
    const dias = horas > 0 ? (horas / 24) : 0;
    const diasStr = dias >= 1
        ? (Number.isInteger(Math.round(dias * 10) / 10) ? Math.round(dias).toString() : dias.toFixed(1))
        : (horas > 0 ? '<1' : '—');

    const arcFill = pct > 0
        ? `<path d="M ${bgX1} ${CY} A ${R} ${R} 0 0 1 ${px.toFixed(2)} ${py.toFixed(2)}"
                  fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round" opacity="0.9"/>`
        : '';

    const cardId = 'gauge-' + nomeModelo.replace(/\s+/g, '_');

    const front = `
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:110px;overflow:visible;">
            <path d="M ${bgX1} ${CY} A ${R} ${R} 0 0 1 ${bgX2} ${CY}"
                  fill="none" stroke="rgba(148,163,184,0.15)" stroke-width="7" stroke-linecap="round"/>
            ${arcFill}
            <text x="${CX}" y="${CY - 4}" text-anchor="middle" fill="${cor}" font-size="15" font-weight="800"
                  font-family="'Plus Jakarta Sans',sans-serif">${horasStr}</text>
            <text x="${CX}" y="${CY + 10}" text-anchor="middle" fill="rgba(148,163,184,0.7)" font-size="7.5"
                  font-weight="600" font-family="'Plus Jakarta Sans',sans-serif">${horas > 0 ? 'horas' : 'sem dados'}</text>
        </svg>`;

    const back = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:62px;width:110px;gap:2px;">
            <span style="font-size:26px;font-weight:900;line-height:1;color:${cor};font-family:'Plus Jakarta Sans',sans-serif;text-shadow:0 0 20px ${cor}66;">${diasStr}</span>
            <span style="font-size:9px;font-weight:700;color:rgba(148,163,184,0.7);text-transform:uppercase;letter-spacing:.08em;">${horas > 0 ? (dias >= 1 ? 'dias' : 'menos de 1 dia') : 'sem dados'}</span>
            ${horas > 0 ? `<span style="font-size:8px;color:rgba(148,163,184,0.4);">${horasStr}h total</span>` : ''}
        </div>`;

    return `
        <div id="${cardId}" class="kanban-flip-card" style="perspective:600px;width:110px;height:62px;cursor:pointer;" onclick="flipGaugeCard('${cardId}')">
            <div class="kanban-flip-inner" style="position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.6s cubic-bezier(0.4,0.2,0.2,1);">
                <div class="kanban-flip-front" style="position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;align-items:center;justify-content:center;">${front}</div>
                <div class="kanban-flip-back" style="position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:rotateY(180deg);display:flex;align-items:center;justify-content:center;">${back}</div>
            </div>
        </div>`;
}

window.flipGaugeCard = function(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const inner = card.querySelector('.kanban-flip-inner');
    if (!inner) return;
    inner.style.transform = inner.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
};

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

    // Carrega config + grade compartilhado do Supabase
    await carregarConfigDoSupabase();

    if (typeof aplicarPermissoes === 'function') aplicarPermissoes();

    const fonteSalva = localStorage.getItem('kanban_fonte') || 'sheets';
    KS.fonte = fonteSalva;
    setTimeout(() => setKanbanFonte(fonteSalva), 150);

    if (fonteSalva === 'totvs') {
        // Se há grade compartilhado no Supabase, carrega imediatamente
        if (KS.gradeXLS && Object.keys(KS.gradeXLS).length > 0) {
            KS.grade = KS.gradeXLS;
            renderShelf();
            const dataStr = KS.ultimaSync
                ? new Date(KS.ultimaSync).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
                : '—';
            setSyncStatus('✓ ' + (KS.ultimoArquivo || 'Arquivo carregado'), 'ok');
            setText('last-sync', 'enviado em ' + dataStr);

            // Atualiza UI do painel de upload
            const infoEl = document.getElementById('kanban-ultimo-arquivo');
            const dropEl = document.getElementById('kanban-drop-zone');
            if (infoEl) {
                infoEl.textContent = KS.ultimoArquivo || 'Arquivo carregado';
                infoEl.classList.remove('hidden');
                infoEl.style.display = 'flex';
            }
            if (dropEl) dropEl.style.display = 'none';
        } else {
            setSyncStatus('Aguardando arquivo XLS do TOTVS', 'neutral');
        }
    } else {
        if (KS.sheetsUrl) await syncSheets();
        else setSyncStatus('Configure o Google Sheets (Admin)', 'neutral');
    }
}

// ── SYNC SHEETS ───────────────────────────────────────────────

async function syncSheets() {
    const url = (getVal('cfg-sheets-url') || '').trim() || KS.sheetsUrl;
    if (!url) { openSheetsConfig(); return; }
    setSyncStatus('Sincronizando…', 'loading');
    animateSyncIcon(true);
    try {
        const csv = await fetchCSV(url);
        KS.grade = parseEstoqueALM(csv);
        renderShelf();
        const now = new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
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
    if (url.includes('spreadsheets') && url.includes('output=')) {
        return url.replace('output=tsv','output=csv').replace('output=xlsx','output=csv').replace('output=pdf','output=csv');
    }
    const mId = url.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
    if (!mId) return url;
    const id = mId[1];
    const mGid = url.match(/[?&#]gid=(\d+)/);
    const gid = mGid ? `&gid=${mGid[1]}` : '';
    if (url.includes('/d/e/'))
        return `https://docs.google.com/spreadsheets/d/e/${id}/pub?single=true&output=csv${gid}`;
    return `https://docs.google.com/spreadsheets/d/${id}/pub?output=csv${gid}`;
}

function parseCSVRows(csv) {
    return csv.trim().split('\n').map(line => {
        const cells = []; let cur = '', inQ = false;
        for (const ch of line) {
            if (ch === '"') inQ = !inQ;
            else if ((ch === ',' || ch === ';') && !inQ) { cells.push(cur.trim()); cur = ''; }
            else cur += ch;
        }
        cells.push(cur.trim());
        return cells;
    });
}

function parseEstoqueXLS(rows) {
    if (!rows || rows.length < 2) return {};
    const h = rows[0].map(c => String(c || '').toLowerCase().trim());
    const fi = names => { for (const n of names) { const i = h.findIndex(c => c.includes(n)); if (i >= 0) return i; } return -1; };

    const iPN  = fi(['item']);
    const iDep = fi(['dep']);
    const iLoc = fi(['localiz']);
    const iQty = fi(['qtd liq','quantidade','qtd']);
    // Lote — TOTVS exporta com nomes variados dependendo da versão/relatório
    const iLote = fi(['nro.lote','nro lote','n.lote','nr.lote','nr lote','num.lote','num lote','lote','lot num','batch','lote/serie','lote ']);

    // DEBUG — mostra cabeçalho e índices no console para diagnóstico
    console.log('[XLS] Cabeçalho:', h);
    console.log('[XLS] Índices → PN:'+iPN+' DEP:'+iDep+' LOC:'+iLoc+' QTY:'+iQty+' LOTE:'+iLote);

    const grade = {}, seen = new Set();
    KS.lotesMap = new Map(); // zera ao reprocessar

    rows.slice(1).forEach(r => {
        if (!r || !r.length) return;
        if (String(r[iDep] || '').trim().toUpperCase() !== 'ALM') return;
        const loc = String(r[iLoc] || '').trim().toUpperCase();
        const m = loc.match(/^F(\d+)-0*(\d+)$/);
        if (!m) return;
        const nivel = parseInt(m[1]), pos = parseInt(m[2]);
        if (pos > KS.POSICOES || nivel > 12) return;
        const pn = String(r[iPN] || '').trim();
        if (!pn) return;

        let qtd = r[iQty];
        if (typeof qtd === 'number') {
            qtd = Math.round(qtd);
        } else {
            const s = String(qtd || '0').trim();
            if (/\.\d{3}/.test(s) || (s.includes(',') && !s.includes('.'))) {
                qtd = parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
            } else {
                qtd = parseFloat(s.replace(/,/g, '')) || 0;
            }
        }
        if (qtd <= 0) return;

        const chave = pn + '|' + nivel + '|' + pos + '|' + qtd;
        if (seen.has(chave)) return;
        seen.add(chave);

        if (!grade[nivel]) grade[nivel] = {};
        if (!grade[nivel][pos]) grade[nivel][pos] = new Map();
        grade[nivel][pos].set(pn, (grade[nivel][pos].get(pn) || 0) + qtd);

        // ── Captura lote ───────────────────────────────────────
        let lote = '';

        // Tentativa 1: coluna detectada pelo fi()
        if (iLote >= 0 && r[iLote] != null) {
            lote = String(r[iLote]).trim();
        }

        // Tentativa 2: varredura de todas as colunas com nome relacionado a lote
        if (!lote) {
            for (let ci = 0; ci < h.length; ci++) {
                if (ci === iPN || ci === iDep || ci === iLoc || ci === iQty) continue;
                const hdr = h[ci] || '';
                if (!hdr.match(/lote|lot|batch|serie|nro|nr\.|num/)) continue;
                const val = String(r[ci] || '').trim();
                if (val && val.length >= 2) { lote = val; break; }
            }
        }

        // Tentativa 3: qualquer coluna com valor alfanumérico que pareça lote
        // (apenas se as tentativas 1 e 2 falharam)
        if (!lote) {
            const skipIdx = new Set([iPN, iDep, iLoc, iQty]);
            for (let ci = 0; ci < r.length; ci++) {
                if (skipIdx.has(ci)) continue;
                const val = String(r[ci] || '').trim();
                // Padrão típico TOTVS: letras+números, 4-20 chars, sem espaços
                if (/^[A-Za-z0-9\.\-\/]{4,20}$/.test(val)) { lote = val; break; }
            }
        }

        if (lote && lote !== '0' && lote.toLowerCase() !== 'nan') {
            const posKey = 'F' + nivel + '-' + String(pos).padStart(2, '0');
            const loteKey = posKey + '|' + pn;
            const arr = KS.lotesMap.get(loteKey) || [];
            if (!arr.includes(lote)) arr.push(lote);
            KS.lotesMap.set(loteKey, arr);
        }
    });

    console.log('[XLS] Grade:', Object.keys(grade).length, 'níveis | LotesMap:', KS.lotesMap.size, 'entradas');
    return grade;
}

function parseEstoqueALM(csv) {
    const rows = parseCSVRows(csv);
    if (rows.length < 2) return {};
    const h = rows[0].map(c => (c || '').toLowerCase().trim());
    const fi = names => { for (const n of names) { const i = h.findIndex(c => c.includes(n)); if (i >= 0) return i; } return -1; };
    const iPN = fi(['item']), iDep = fi(['dep']), iLoc = fi(['localiz']), iQty = fi(['qtd liq','quantidade','qtd']);
    const grade = {}, seen = new Set();

    rows.slice(1).forEach(r => {
        if ((r[iDep] || '').trim().toUpperCase() !== 'ALM') return;
        const loc = (r[iLoc] || '').trim().toUpperCase();
        const m = loc.match(/^F(\d+)-0*(\d+)$/);
        if (!m) return;
        const nivel = parseInt(m[1]), pos = parseInt(m[2]);
        if (pos > KS.POSICOES || nivel > 12) return;
        const pn = (r[iPN] || '').trim();
        if (!pn) return;
        const qtd = parseFloat(String(r[iQty] || '0').replace(/\./g, '').replace(',', '.')) || 0;
        if (qtd <= 0) return;
        const chave = pn + '|' + nivel + '|' + pos + '|' + qtd;
        if (seen.has(chave)) return;
        seen.add(chave);
        if (!grade[nivel]) grade[nivel] = {};
        if (!grade[nivel][pos]) grade[nivel][pos] = new Map();
        grade[nivel][pos].set(pn, (grade[nivel][pos].get(pn) || 0) + qtd);
    });
    return grade;
}

// ── UPLOAD XLS (TOTVS) — AGORA SALVA NO SUPABASE ─────────────

function abrirUploadXLS() {
    document.getElementById('kanban-xls-input')?.click();
}

async function processarUploadXLS(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xls', 'xlsx'].includes(ext)) {
        if (typeof showToast === 'function') showToast('Arquivo deve ser .xls ou .xlsx', 'warning');
        return;
    }

    setSyncStatus('Lendo arquivo...', 'loading');
    animateSyncIcon(true);

    try {
        const buffer = await file.arrayBuffer();
        const XLSX = window.XLSX;
        if (!XLSX) throw new Error('SheetJS não carregado. Adicione a CDN no index.html');

        const workbook  = XLSX.read(buffer, { type: 'array', cellDates: false });
        const sheetName = workbook.SheetNames[0];
        const sheet     = workbook.Sheets[sheetName];
        const rows      = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: true });

        if (!rows || rows.length < 2) throw new Error('Arquivo vazio ou sem dados reconhecíveis');

        KS.grade         = parseEstoqueXLS(rows);
        KS.gradeXLS      = KS.grade;
        KS.ultimoArquivo = file.name;
        KS.ultimaSync    = new Date();

        renderShelf();

        // Abre diagnóstico automaticamente se nenhum lote foi capturado
        if (KS.lotesMap.size === 0) {
            console.warn('[XLS] Nenhum lote detectado. Abrindo diagnóstico...');
            if (typeof window.diagnosticarXLS === 'function') {
                setTimeout(() => window.diagnosticarXLS(rows), 500);
            }
        } else {
            console.log('[XLS] ✅', KS.lotesMap.size, 'lotes capturados');
        }

        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setSyncStatus('✓ Arquivo carregado', 'ok');
        setText('last-sync', `${file.name} às ${now}`);

        // ── Salva no Supabase para todos os usuários ──────────
        setSyncStatus('Sincronizando com o servidor...', 'loading');
        const salvo = await salvarGradeNoSupabase(KS.grade, file.name);
        if (salvo) {
            setSyncStatus('✓ Disponível para todos', 'ok');
            if (typeof showToast === 'function')
                showToast(`✅ ${file.name} processado e compartilhado com todos!`, 'success');
        } else {
            setSyncStatus('✓ Carregado (só esta sessão)', 'ok');
            if (typeof showToast === 'function')
                showToast(`✅ ${file.name} carregado — erro ao salvar no servidor`, 'warning');
        }

        // Atualiza UI do painel
        const nomeEl = document.getElementById('kanban-arquivo-nome');
        const horaEl = document.getElementById('kanban-arquivo-hora');
        const infoEl = document.getElementById('kanban-ultimo-arquivo');
        const dropEl = document.getElementById('kanban-drop-zone');
        if (nomeEl) nomeEl.textContent = file.name;
        if (horaEl) horaEl.textContent = 'às ' + now;
        if (infoEl) { infoEl.textContent = file.name; infoEl.style.display = 'flex'; infoEl.classList.remove('hidden'); }
        if (dropEl) dropEl.style.display = 'none';

    } catch(e) {
        console.error('[Upload XLS]', e);
        setSyncStatus('Erro ao ler arquivo', 'error');
        if (typeof showToast === 'function') showToast('Erro: ' + e.message, 'error');
    }

    animateSyncIcon(false);
    event.target.value = '';
}

window.abrirUploadXLS     = abrirUploadXLS;
window.processarUploadXLS = processarUploadXLS;

// ── DIAGNÓSTICO DE COLUNAS XLS ────────────────────────────────
// Mostra um modal com todas as colunas detectadas para ajudar a
// identificar o nome exato da coluna de Lote no arquivo TOTVS.
window.diagnosticarXLS = function(rows) {
    if (!rows || rows.length < 2) return;
    const h = rows[0].map((c, i) => ({ i, nome: String(c || '').trim(), ex: String(rows[1]?.[i] || '').trim() }));

    const linhas = h.map(col =>
        `<tr style="border-bottom:1px solid rgba(148,163,184,.1);">
            <td style="padding:4px 8px;color:#94a3b8;font-size:11px;text-align:right;">${col.i}</td>
            <td style="padding:4px 8px;font-weight:700;color:#e2e8f0;font-size:11px;">${col.nome || '(vazio)'}</td>
            <td style="padding:4px 8px;color:#64748b;font-size:10px;font-family:monospace;">${col.ex || '—'}</td>
        </tr>`
    ).join('');

    const lotesInfo = KS.lotesMap.size > 0
        ? `<div style="margin-top:10px;padding:8px;background:rgba(34,197,94,.1);border-radius:8px;border:1px solid rgba(34,197,94,.3);">
               <p style="font-size:11px;font-weight:700;color:#22c55e;">✅ ${KS.lotesMap.size} lotes capturados!</p>
               <p style="font-size:10px;color:#64748b;margin-top:2px;">Ex: ${[...KS.lotesMap.entries()].slice(0,2).map(([k,v])=>k+' → '+v.join(',')).join(' | ')}</p>
           </div>`
        : `<div style="margin-top:10px;padding:8px;background:rgba(239,68,68,.1);border-radius:8px;border:1px solid rgba(239,68,68,.3);">
               <p style="font-size:11px;font-weight:700;color:#ef4444;">⚠️ Nenhum lote detectado automaticamente</p>
               <p style="font-size:10px;color:#64748b;margin-top:2px;">Identifique abaixo qual coluna contém o número do lote e informe o nome exato.</p>
           </div>`;

    document.getElementById('xls-diag-modal')?.remove();
    const html = `
    <div id="xls-diag-modal" class="fixed inset-0 z-[99] hidden">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('xls-diag-modal')?.remove()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div class="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto p-5"
                 style="transform:scale(1);opacity:1;max-height:85vh;display:flex;flex-direction:column;">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <span class="material-symbols-rounded text-amber-400">manage_search</span>
                        Diagnóstico — Colunas do XLS
                    </h3>
                    <button onclick="document.getElementById('xls-diag-modal')?.remove()" class="text-slate-400 hover:text-white">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                ${lotesInfo}
                <p style="font-size:10px;color:#64748b;margin:8px 0 4px;">Colunas encontradas no arquivo:</p>
                <div style="overflow-y:auto;flex:1;">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:1px solid rgba(148,163,184,.2);">
                                <th style="padding:4px 8px;color:#64748b;font-size:10px;text-align:right;">#</th>
                                <th style="padding:4px 8px;color:#64748b;font-size:10px;text-align:left;">Nome da Coluna</th>
                                <th style="padding:4px 8px;color:#64748b;font-size:10px;text-align:left;">Exemplo (1ª linha)</th>
                            </tr>
                        </thead>
                        <tbody>${linhas}</tbody>
                    </table>
                </div>
                <p style="font-size:10px;color:#64748b;margin-top:8px;">Se o lote não foi detectado, informe o nome exato da coluna ao suporte.</p>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('xls-diag-modal').classList.remove('hidden');
};

// ── FONTE DE DADOS ────────────────────────────────────────────

KS.fonte = localStorage.getItem('kanban_fonte') || 'sheets';

function kanbanFonteAction() {
    if (KS.fonte === 'totvs') abrirUploadXLS();
    else syncSheets();
}

window.kanbanHandleDrop = function(event) {
    event.preventDefault();
    const dz = document.getElementById('kanban-drop-zone');
    if (dz) dz.style.background = 'rgba(16,185,129,.06)';
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xls', 'xlsx'].includes(ext)) {
        if (typeof showToast === 'function') showToast('Arquivo deve ser .xls ou .xlsx', 'warning');
        return;
    }
    processarUploadXLS({ target: { files: [file], value: '' } });
};

window.setKanbanFonte    = setKanbanFonte;
window.kanbanFonteAction = kanbanFonteAction;

// ── AVALIA POSIÇÃO ────────────────────────────────────────────

function avaliarPosicao(nivel, pos) {
    const modelo = POS_MODELO[pos];
    if (!modelo) return { status:'vazio', itens:[], estranhos:[] };
    const estrutura   = ESTRUTURAS[modelo.nome] || [];
    const pnsPos      = KS.grade[nivel]?.[pos] || new Map();
    const qtdBase     = KS.qtdBase[modelo.nome] || 1000;
    const estruturaPNs = new Set(estrutura.map(e => e.pn));

    const itens = estrutura.map(comp => {
        const qtdReal     = pnsPos.get(comp.pn) || 0;
        // Usa múltiplo salvo no Supabase (se existir) ou o valor do ESTRUTURAS
        const multKey     = modelo.nome + '|' + comp.pn;
        const mult        = KS.multiplos[multKey] !== undefined ? KS.multiplos[multKey] : comp.mult;
        const qtdEsperada = qtdBase * mult;
        const estado      = qtdReal <= 0 ? 'falta' : qtdReal >= qtdEsperada * 1.8 ? 'duplicado' : 'ok';
        return { ...comp, mult, qtdReal, qtdEsperada, estado };
    });

    const estranhos = [];
    for (const [pn, qtd] of pnsPos) {
        if (!estruturaPNs.has(pn) && qtd > 0) estranhos.push({ pn, qtd });
    }

    const totalFalta = itens.filter(i => i.estado === 'falta').length;
    const totalDup   = itens.filter(i => i.estado === 'duplicado').length;
    let status;
    if (pnsPos.size === 0) status = 'vazio';
    else if (totalDup > 0 && totalFalta === 0) status = 'duplicado';
    else if (totalFalta > 0) status = 'incompleto';
    else if (estranhos.length > 0 && itens.filter(i => i.estado === 'ok').length === 0) status = 'estranho';
    else status = 'ok';

    return { status, itens, estranhos, qtdBase };
}

// ── RENDER ────────────────────────────────────────────────────

function renderShelfSkeleton() {
    const tbl = document.getElementById('shelf-table');
    if (!tbl) return;
    tbl.innerHTML = '';
    tbl.appendChild(buildModeloHeader());
    for (let n = 12; n >= 0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th'); th.className = 'nivel-cell'; th.textContent = `F${n}`; tr.appendChild(th);
        for (let v = 1; v <= KS.POSICOES; v++) {
            const td = document.createElement('td');
            td.className = `vaga skel ${POS_MODELO[v]?.cls || ''}`;
            td.style.opacity = '.3';
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
    let cntOk = 0, cntInc = 0, cntEst = 0, cntDup = 0;

    for (let n = 12; n >= 0; n--) {
        if (NIVEL_SKIP.has(n)) continue;
        const tr = document.createElement('tr');
        const th = document.createElement('th'); th.className = 'nivel-cell'; th.textContent = `F${n}`; tr.appendChild(th);

        for (let v = 1; v <= KS.POSICOES; v++) {
            const td = document.createElement('td');
            const modelo = POS_MODELO[v];
            const avalia = avaliarPosicao(n, v);
            const posKey = `F${n}-${String(v).padStart(2, '0')}`;

            switch (avalia.status) {
                case 'ok':        td.className = `vaga vaga-ok ${modelo?.cls || ''}`;                  cntOk++;  td.dataset.filter = 'ok';        break;
                case 'incompleto':td.className = `vaga vaga-inc pulse-anim ${modelo?.cls || ''}`;      cntInc++; td.dataset.filter = 'incompleto'; break;
                case 'duplicado': td.className = `vaga vaga-dup pulse-anim-blue ${modelo?.cls || ''}`;cntDup++; td.dataset.filter = 'duplicado';  break;
                case 'estranho':  td.className = `vaga vaga-est pulse-anim ${modelo?.cls || ''}`;      cntEst++; td.dataset.filter = 'estranho';   break;
                default:          td.className = `vaga vaga-vazio ${modelo?.cls || ''}`;                         td.dataset.filter = 'vazio';
            }
            td.dataset.nivel = n; td.dataset.vaga = v; td.dataset.pos = posKey;
            td.innerHTML = buildCardHTML(avalia, modelo);
            if (avalia.status !== 'vazio') { td.classList.add('ocupada'); td.onclick = () => openKanbanDetail(avalia, modelo, posKey); }
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }

    setText('ks-total', cntOk + cntInc + cntEst + cntDup);
    setText('ks-ok', cntOk); setText('ks-low', cntInc); setText('ks-empty', cntEst); setText('ks-dup', cntDup);
    applyFilter(KS.currentFilter);
    startGaugeAutoFlip();
}

function buildCardHTML(avalia, modelo) {
    const bar = `<div class="modelo-bar" style="background:${modelo?.barColor || '#64748b'}"></div>`;
    const t = avalia.itens.length;
    switch (avalia.status) {
        case 'ok': return `${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:20px;color:#22c55e;font-variation-settings:'FILL' 1">check_circle</span><p style="font-size:9px;font-weight:800;color:#22c55e;">KANBAN OK</p><p style="font-size:8px;color:#64748b;">${t}/${t} itens</p></div>`;
        case 'duplicado': { const nd = avalia.itens.filter(i => i.estado === 'duplicado').length; return `${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#60a5fa;font-variation-settings:'FILL' 1">content_copy</span><p style="font-size:8.5px;font-weight:800;color:#60a5fa;">DUPLICADO</p><p style="font-size:8px;color:#60a5fa;">${nd} PN(s)</p></div>`; }
        case 'incompleto': { const nf = avalia.itens.filter(i => i.estado === 'falta').length; return `${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f59e0b;font-variation-settings:'FILL' 1">warning</span><p style="font-size:8.5px;font-weight:800;color:#f59e0b;">INCOMPLETO</p><p style="font-size:8px;color:#f59e0b;">${nf} faltando</p></div>`; }
        case 'estranho': return `${bar}<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 4px);margin-top:4px;gap:2px;"><span class="material-symbols-rounded" style="font-size:18px;color:#f97316;font-variation-settings:'FILL' 1">help</span><p style="font-size:8px;font-weight:800;color:#f97316;">MAT. EXTRA</p><p style="font-size:8px;color:#f97316;">${avalia.estranhos.length} PN(s)</p></div>`;
        default: return bar;
    }
}

function buildModeloHeader() {
    const tr  = document.createElement('tr');
    const th0 = document.createElement('th'); th0.className = 'nivel-cell'; tr.appendChild(th0);

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
            <div style="background:${m.cor || '#6366f1'}11;border:1.5px solid ${m.barColor}44;border-radius:12px;padding:8px 6px 6px;text-align:center;min-width:110px;">
                <div style="font-size:10px;font-weight:900;color:${m.barColor};text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">${m.nome}</div>
                <div style="display:flex;justify-content:center;margin:0 0 2px;">${buildFlipCard(horas, m.barColor, m.nome)}</div>
                <div style="margin-top:2px;">${consumoStr}</div>
                <div style="font-size:8px;color:rgba(148,163,184,0.35);margin-top:1px;">clique para alternar</div>
            </div>`;
        tr.appendChild(th);
    });
    return tr;
}

// ── MODAL DETALHE ─────────────────────────────────────────────

function openKanbanDetail(avalia, modelo, posKey) {
    const flags = (typeof getFlags === 'function') ? getFlags() : {};
    const flagAtual = flags[posKey];
    setText('kd-pn', posKey);
    document.getElementById('kd-modelo').innerHTML = `<span style="color:${modelo?.barColor || '#6366f1'};font-weight:700;">${modelo?.nome || '—'}</span><span style="font-size:10px;color:#64748b;margin-left:8px;">Base: ${avalia.qtdBase} un/kanban</span>`;

    // Botão imprimir — injeta no header do modal
    const printBtnId = 'kd-print-btn';
    setTimeout(() => {
        const existing = document.getElementById(printBtnId);
        if (existing) existing.remove();
        const closeBtn = document.querySelector('#kanban-detail-content button[onclick*="closeKanbanDetail"]');
        if (closeBtn) {
            const btn = document.createElement('button');
            btn.id = printBtnId;
            btn.onclick = () => {
                if (typeof imprimirKanban === 'function') {
                    imprimirKanban(avalia, modelo, posKey);
                } else {
                    alert('kanban-print.js não carregado');
                }
            };
            btn.title = 'Imprimir espelho A4';
            btn.style.cssText = `
                display:flex;align-items:center;gap:6px;
                padding:6px 14px;border-radius:10px;border:none;cursor:pointer;
                background:rgba(99,102,241,0.12);color:#818cf8;
                font-size:12px;font-weight:700;transition:all .15s;
                font-family:inherit;
            `;
            btn.innerHTML = '<span class="material-symbols-rounded" style="font-size:17px;">print</span> Imprimir';
            btn.onmouseenter = () => { btn.style.background = 'rgba(99,102,241,0.22)'; btn.style.color = '#a5b4fc'; };
            btn.onmouseleave = () => { btn.style.background = 'rgba(99,102,241,0.12)'; btn.style.color = '#818cf8'; };
            closeBtn.parentElement.insertBefore(btn, closeBtn);
        }
    }, 50);
    const statusBadge = { ok:'<span style="background:rgba(34,197,94,.2);color:#22c55e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">✅ KANBAN OK</span>', duplicado:'<span style="background:rgba(96,165,250,.2);color:#60a5fa;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🔵 DUPLICADO</span>', incompleto:'<span style="background:rgba(245,158,11,.2);color:#f59e0b;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">⚠️ INCOMPLETO</span>', estranho:'<span style="background:rgba(249,115,22,.2);color:#f97316;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🟠 MATERIAL EXTRA</span>' }[avalia.status] || '';

    let body = `<div class="mb-3 flex items-center gap-2 flex-wrap">${statusBadge}`;
    if (flagAtual?.status === 'pendente') body += `<span style="background:rgba(239,68,68,.2);color:#f87171;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">🚩 ${flagAtual.operador || '—'}</span>`;
    body += `</div>`;
    body += `<div class="overflow-y-auto" style="max-height:300px;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead style="position:sticky;top:0;background:#0f172a;z-index:1;"><tr style="border-bottom:1px solid rgba(148,163,184,.2);"><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">PN</th><th style="text-align:left;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Descrição</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Saldo</th><th style="text-align:right;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">Esperado</th><th style="text-align:center;padding:6px 8px;color:#94a3b8;font-size:10px;text-transform:uppercase;">St.</th></tr></thead><tbody>`;
    avalia.itens.forEach(comp => {
        const icon = comp.estado === 'ok' ? '✅' : comp.estado === 'duplicado' ? '🔵' : '⚠️';
        const cor  = comp.estado === 'ok' ? '#22c55e' : comp.estado === 'duplicado' ? '#60a5fa' : '#f59e0b';
        body += `<tr style="border-bottom:1px solid rgba(148,163,184,.07);"><td style="padding:6px 8px;font-family:monospace;font-size:11px;color:#cbd5e1;white-space:nowrap;">${comp.pn}</td><td style="padding:6px 8px;color:#94a3b8;font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${comp.desc}</td><td style="padding:6px 8px;text-align:right;font-weight:700;color:${cor};">${comp.qtdReal.toLocaleString('pt-BR')}</td><td style="padding:6px 8px;text-align:right;color:#64748b;">${comp.qtdEsperada.toLocaleString('pt-BR')}</td><td style="padding:6px 8px;text-align:center;">${icon}</td></tr>`;
    });
    body += '</tbody></table></div>';

    if (avalia.estranhos.length > 0) {
        body += `<div style="margin-top:10px;padding:8px;background:rgba(249,115,22,.08);border-radius:8px;border:1px solid rgba(249,115,22,.2);"><p style="font-size:10px;font-weight:800;color:#f97316;margin-bottom:4px;">🟠 Fora da estrutura</p>`;
        avalia.estranhos.forEach(e => { body += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px;"><span style="font-family:monospace;color:#cbd5e1;">${e.pn}</span><span style="color:#f97316;font-weight:700;">${e.qtd}</span></div>`; });
        body += '</div>';
    }

    const nivel = typeof getNivel === 'function' ? getNivel() : 0;
    if (nivel >= 2) {
        const jaMarcado = flagAtual?.status === 'pendente';
        body += `<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(148,163,184,.12);display:flex;gap:8px;">${jaMarcado ? `<button onclick="removerFlag('${posKey}');closeKanbanDetail();" style="flex:1;padding:8px;background:rgba(34,197,94,.15);color:#4ade80;border:1.5px solid rgba(34,197,94,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">check_circle</span>Remover flag</button>` : `<button onclick="abrirMarcarVazio('${posKey}','${modelo?.nome || ''}');closeKanbanDetail();" style="flex:1;padding:8px;background:rgba(239,68,68,.12);color:#f87171;border:1.5px solid rgba(239,68,68,.3);border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-rounded" style="font-size:16px;">report</span>Marcar como Vazio</button>`}</div>`;
    }

    document.getElementById('kd-body').innerHTML = body;
    const modal = document.getElementById('kanban-detail-modal'), cont = document.getElementById('kanban-detail-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { cont.style.transform = 'scale(1)'; cont.style.opacity = '1'; });
}

function closeKanbanDetail() {
    const modal = document.getElementById('kanban-detail-modal'), cont = document.getElementById('kanban-detail-content');
    cont.style.transform = 'scale(.95)'; cont.style.opacity = '0';
    setTimeout(() => { modal.classList.add('hidden'); cont.style.transform = 'scale(.95)'; }, 250);
}

// ── MODAL CONSUMO POR HORA ─────────────────────────────────────


// ══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE PRATELEIRAS — Reclassificação de modelos
// ══════════════════════════════════════════════════════════════

const CORES_PRESET = [
    { bg:'#93c5fd', bar:'#3b82f6', label:'Azul' },
    { bg:'#86efac', bar:'#22c55e', label:'Verde' },
    { bg:'#5eead4', bar:'#14b8a6', label:'Teal' },
    { bg:'#67e8f9', bar:'#06b6d4', label:'Cyan' },
    { bg:'#a5b4fc', bar:'#6366f1', label:'Índigo' },
    { bg:'#fde047', bar:'#eab308', label:'Amarelo' },
    { bg:'#fca5a5', bar:'#ef4444', label:'Vermelho' },
    { bg:'#93c5fd', bar:'#2563eb', label:'Azul Escuro' },
    { bg:'#d8b4fe', bar:'#a855f7', label:'Roxo' },
    { bg:'#fcd34d', bar:'#f59e0b', label:'Âmbar' },
    { bg:'#6ee7b7', bar:'#10b981', label:'Esmeralda' },
    { bg:'#f9a8d4', bar:'#ec4899', label:'Rosa' },
];

function openPrateleiraConfig() {
    if ((typeof getNivel === 'function' ? getNivel() : 0) < 3) {
        showToast && showToast('Apenas Admin pode reconfigurar prateleiras', 'warning'); return;
    }
    document.getElementById('prateleira-config-modal')?.remove();

    function buildModeloRow(m, idx) {
        const posStr = m.pos.join(', ');
        const coresOpts = CORES_PRESET.map((c, ci) =>
            `<option value="${ci}" ${m.barColor === c.bar ? 'selected' : ''}>${c.label}</option>`
        ).join('');
        const estrutPNs = (ESTRUTURAS[m.nome] || []).length;
        return `
        <div class="prateleira-row" data-idx="${idx}" style="
            background:#1e293b;border:1px solid #334155;border-radius:12px;
            padding:12px;margin-bottom:8px;cursor:default;">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <!-- Drag handle -->
                <span class="prat-drag" title="Arrastar para reordenar"
                      style="color:#475569;cursor:grab;font-size:20px;line-height:1;
                             user-select:none;flex-shrink:0;">⠿</span>

                <!-- Cor -->
                <div style="width:14px;height:14px;border-radius:4px;flex-shrink:0;
                            background:${m.barColor};box-shadow:0 0 6px ${m.barColor}66;"></div>

                <!-- Nome -->
                <input type="text" data-field="nome" data-idx="${idx}" value="${m.nome}"
                       placeholder="Nome do modelo"
                       style="flex:1;min-width:100px;padding:5px 8px;font-size:12px;font-weight:700;
                              background:#0f172a;border:1px solid #334155;border-radius:8px;
                              color:#e2e8f0;outline:none;"
                       onfocus="this.style.borderColor='#6366f1'"
                       onblur="this.style.borderColor='#334155'"
                       onchange="updateModeloField(${idx},'nome',this.value)">

                <!-- Posições -->
                <input type="text" data-field="pos" data-idx="${idx}" value="${posStr}"
                       placeholder="Ex: 1, 2"
                       title="Posições (separadas por vírgula)"
                       style="width:80px;padding:5px 8px;font-size:12px;
                              background:#0f172a;border:1px solid #334155;border-radius:8px;
                              color:#94a3b8;outline:none;text-align:center;"
                       onfocus="this.style.borderColor='#6366f1'"
                       onblur="this.style.borderColor='#334155'"
                       onchange="updateModeloField(${idx},'pos',this.value)">

                <!-- Cor preset -->
                <select data-field="cor" data-idx="${idx}" onchange="updateModeloField(${idx},'cor',this.value)"
                        style="padding:5px 6px;font-size:11px;background:#0f172a;
                               border:1px solid #334155;border-radius:8px;color:#94a3b8;outline:none;">
                    ${coresOpts}
                </select>

                <!-- Info estrutura -->
                <span style="font-size:10px;color:#475569;white-space:nowrap;">${estrutPNs} PN(s)</span>

                <!-- Botão remover -->
                <button onclick="removerModeloRow(${idx})" title="Remover modelo"
                        style="padding:4px 8px;border-radius:8px;border:1px solid rgba(239,68,68,.3);
                               background:rgba(239,68,68,.1);color:#f87171;font-size:11px;cursor:pointer;
                               flex-shrink:0;">✕</button>
            </div>
        </div>`;
    }

    // Estado temporário
    window._pratCfg = MODELOS.map(m => ({ ...m, pos: [...m.pos] }));

    const html = `
    <div id="prateleira-config-modal" class="fixed inset-0 z-[97] hidden">
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" onclick="fecharPrateleiraConfig()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div id="prateleira-config-content"
                 style="background:#0f172a;border:1px solid #1e293b;border-radius:20px;
                        box-shadow:0 24px 64px rgba(0,0,0,.6);
                        width:100%;max-width:680px;pointer-events:auto;
                        transform:scale(.95);opacity:0;transition:all .25s;
                        max-height:92vh;display:flex;flex-direction:column;">

                <!-- Header -->
                <div style="padding:20px 24px 16px;border-bottom:1px solid #1e293b;flex-shrink:0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <div>
                            <h3 style="font-size:16px;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px;">
                                <span class="material-symbols-rounded" style="color:#6366f1;font-size:22px;">shelves</span>
                                Configuração de Prateleiras
                            </h3>
                            <p style="font-size:11px;color:#64748b;margin-top:2px;">
                                Reclassifique modelos, posições e cores · Salvo globalmente para todos
                            </p>
                        </div>
                        <button onclick="fecharPrateleiraConfig()"
                                style="background:none;border:none;color:#64748b;cursor:pointer;font-size:20px;padding:4px;">✕</button>
                    </div>

                    <!-- Quick info -->
                    <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">
                        <div style="background:#1e293b;border-radius:8px;padding:6px 12px;font-size:11px;color:#94a3b8;">
                            <span style="color:#6366f1;font-weight:700;" id="prat-count">${MODELOS.length}</span> modelos
                        </div>
                        <div style="background:#1e293b;border-radius:8px;padding:6px 12px;font-size:11px;color:#94a3b8;">
                            <span style="color:#22c55e;font-weight:700;" id="prat-pos-count">${KS.POSICOES}</span> posições
                        </div>
                        <div style="background:#1e293b;border-radius:8px;padding:6px 12px;font-size:11px;color:#94a3b8;">
                            Níveis F0 → F12
                        </div>
                    </div>
                </div>

                <!-- Lista de modelos -->
                <div id="prat-lista" style="padding:16px 24px;overflow-y:auto;flex:1;">
                    ${window._pratCfg.map((m, i) => buildModeloRow(m, i)).join('')}
                </div>

                <!-- Botão adicionar -->
                <div style="padding:0 24px 12px;flex-shrink:0;">
                    <button onclick="adicionarModeloRow()"
                            style="width:100%;padding:10px;border:2px dashed #334155;
                                   border-radius:10px;background:none;color:#64748b;
                                   font-size:12px;font-weight:600;cursor:pointer;
                                   transition:all .15s;display:flex;align-items:center;
                                   justify-content:center;gap:6px;"
                            onmouseenter="this.style.borderColor='#6366f1';this.style.color='#818cf8'"
                            onmouseleave="this.style.borderColor='#334155';this.style.color='#64748b'">
                        <span class="material-symbols-rounded" style="font-size:16px;">add</span>
                        Adicionar Modelo
                    </button>
                </div>

                <!-- Footer -->
                <div style="padding:16px 24px;border-top:1px solid #1e293b;
                            display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;">
                    <button onclick="resetarPrateleiras()"
                            style="padding:8px 16px;border:1px solid #334155;border-radius:10px;
                                   background:none;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;">
                        Restaurar padrão
                    </button>
                    <div style="flex:1;"></div>
                    <button onclick="fecharPrateleiraConfig()"
                            style="padding:8px 16px;border:1px solid #334155;border-radius:10px;
                                   background:none;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;">
                        Cancelar
                    </button>
                    <button onclick="salvarPrateleiraConfig()"
                            style="padding:8px 20px;border:none;border-radius:10px;
                                   background:linear-gradient(135deg,#4f46e5,#6366f1);
                                   color:#fff;font-size:12px;font-weight:700;cursor:pointer;
                                   display:flex;align-items:center;gap:6px;
                                   box-shadow:0 4px 14px rgba(99,102,241,.4);">
                        <span class="material-symbols-rounded" style="font-size:16px;">save</span>
                        Salvar para Todos
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('prateleira-config-modal');
    const cont  = document.getElementById('prateleira-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { cont.style.transform = 'scale(1)'; cont.style.opacity = '1'; });
}

function updateModeloField(idx, field, value) {
    if (!window._pratCfg || !window._pratCfg[idx]) return;
    if (field === 'pos') {
        window._pratCfg[idx].pos = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
    } else if (field === 'cor') {
        const preset = CORES_PRESET[parseInt(value)];
        if (preset) {
            window._pratCfg[idx].cor      = preset.bg;
            window._pratCfg[idx].barColor = preset.bar;
            // Atualiza o dot de cor
            const row = document.querySelector(`.prateleira-row[data-idx="${idx}"]`);
            if (row) {
                const dot = row.querySelector('div[style*="border-radius:4px"]');
                if (dot) { dot.style.background = preset.bar; dot.style.boxShadow = `0 0 6px ${preset.bar}66`; }
            }
        }
    } else {
        window._pratCfg[idx][field] = value;
    }
    // Atualiza contadores
    const total = window._pratCfg.reduce((acc, m) => acc + m.pos.length, 0);
    const el = document.getElementById('prat-pos-count');
    if (el) el.textContent = total;
}

function adicionarModeloRow() {
    if (!window._pratCfg) return;
    const nextPos = (Math.max(0, ...window._pratCfg.flatMap(m => m.pos)) + 1);
    const novo = {
        nome: 'Novo Modelo',
        pos: [nextPos],
        cor: '#d8b4fe',
        barColor: '#a855f7',
        cls: 'm-custom' + Date.now()
    };
    window._pratCfg.push(novo);
    const idx = window._pratCfg.length - 1;

    // Adiciona row na lista
    const lista = document.getElementById('prat-lista');
    if (lista) {
        const temp = document.createElement('div');
        const preset = CORES_PRESET.findIndex(c => c.bar === novo.barColor);
        const coresOpts = CORES_PRESET.map((c, ci) =>
            `<option value="${ci}" ${ci === preset ? 'selected' : ''}>${c.label}</option>`).join('');
        temp.innerHTML = `<div class="prateleira-row" data-idx="${idx}" style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;"><span class="prat-drag" style="color:#475569;cursor:grab;font-size:20px;line-height:1;user-select:none;flex-shrink:0;">⠿</span><div style="width:14px;height:14px;border-radius:4px;flex-shrink:0;background:${novo.barColor};box-shadow:0 0 6px ${novo.barColor}66;"></div><input type="text" data-field="nome" data-idx="${idx}" value="${novo.nome}" style="flex:1;min-width:100px;padding:5px 8px;font-size:12px;font-weight:700;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;outline:none;" onchange="updateModeloField(${idx},'nome',this.value)"><input type="text" data-field="pos" data-idx="${idx}" value="${novo.pos.join(', ')}" style="width:80px;padding:5px 8px;font-size:12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#94a3b8;outline:none;text-align:center;" onchange="updateModeloField(${idx},'pos',this.value)"><select data-field="cor" data-idx="${idx}" onchange="updateModeloField(${idx},'cor',this.value)" style="padding:5px 6px;font-size:11px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#94a3b8;outline:none;">${coresOpts}</select><span style="font-size:10px;color:#475569;">0 PN(s)</span><button onclick="removerModeloRow(${idx})" style="padding:4px 8px;border-radius:8px;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);color:#f87171;font-size:11px;cursor:pointer;flex-shrink:0;">✕</button></div></div>`;
        lista.appendChild(temp.firstElementChild);
    }

    const cnt = document.getElementById('prat-count');
    if (cnt) cnt.textContent = window._pratCfg.length;
    ESTRUTURAS[novo.nome] = ESTRUTURAS[novo.nome] || [];
}

function removerModeloRow(idx) {
    if (!window._pratCfg || !window._pratCfg[idx]) return;
    if (!confirm(`Remover "${window._pratCfg[idx].nome}"?`)) return;
    window._pratCfg.splice(idx, 1);
    // Re-renderiza a lista
    const lista = document.getElementById('prat-lista');
    if (!lista) return;
    lista.innerHTML = window._pratCfg.map((m, i) => {
        const coresOpts = CORES_PRESET.map((c, ci) =>
            `<option value="${ci}" ${m.barColor === c.bar ? 'selected' : ''}>${c.label}</option>`).join('');
        const estrutPNs = (ESTRUTURAS[m.nome] || []).length;
        return `<div class="prateleira-row" data-idx="${i}" style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:8px;"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;"><span class="prat-drag" style="color:#475569;cursor:grab;font-size:20px;line-height:1;user-select:none;flex-shrink:0;">⠿</span><div style="width:14px;height:14px;border-radius:4px;flex-shrink:0;background:${m.barColor};box-shadow:0 0 6px ${m.barColor}66;"></div><input type="text" data-field="nome" data-idx="${i}" value="${m.nome}" style="flex:1;min-width:100px;padding:5px 8px;font-size:12px;font-weight:700;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;outline:none;" onchange="updateModeloField(${i},'nome',this.value)"><input type="text" data-field="pos" data-idx="${i}" value="${m.pos.join(', ')}" style="width:80px;padding:5px 8px;font-size:12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#94a3b8;outline:none;text-align:center;" onchange="updateModeloField(${i},'pos',this.value)"><select data-field="cor" data-idx="${i}" onchange="updateModeloField(${i},'cor',this.value)" style="padding:5px 6px;font-size:11px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#94a3b8;outline:none;">${coresOpts}</select><span style="font-size:10px;color:#475569;white-space:nowrap;">${estrutPNs} PN(s)</span><button onclick="removerModeloRow(${i})" style="padding:4px 8px;border-radius:8px;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);color:#f87171;font-size:11px;cursor:pointer;flex-shrink:0;">✕</button></div></div>`;
    }).join('');
    const cnt = document.getElementById('prat-count');
    if (cnt) cnt.textContent = window._pratCfg.length;
}

async function salvarPrateleiraConfig() {
    if (!window._pratCfg || !window._pratCfg.length) return;

    // Valida: nenhuma posição duplicada
    const allPos = window._pratCfg.flatMap(m => m.pos);
    const dups   = allPos.filter((p, i) => allPos.indexOf(p) !== i);
    if (dups.length) {
        if (typeof showToast === 'function') showToast(`⚠️ Posições duplicadas: ${[...new Set(dups)].join(', ')}`, 'error');
        return;
    }

    // Garante campo cls
    window._pratCfg.forEach(m => {
        if (!m.cls) m.cls = 'm-' + m.nome.toLowerCase().replace(/\s+/g, '');
    });

    // Aplica imediatamente
    MODELOS = window._pratCfg;
    KS.POSICOES = Math.max(...MODELOS.flatMap(m => m.pos));
    recalcPosModelo();

    // Salva no Supabase
    await salvarModelosNoSupabase(MODELOS);

    // Salva estruturas adicionais (modelos sem estrutura definida)
    const extEstrutura = {};
    MODELOS.forEach(m => {
        if (!ESTRUTURAS[m.nome]) ESTRUTURAS[m.nome] = [];
        if (ESTRUTURAS[m.nome].length === 0) extEstrutura[m.nome] = [];
    });
    if (Object.keys(extEstrutura).length) await salvarEstruturasExtNoSupabase(extEstrutura);

    fecharPrateleiraConfig();
    renderShelf();
    if (typeof showToast === 'function') showToast('✅ Prateleiras salvas para todos!', 'success');
}

async function resetarPrateleiras() {
    if (!confirm('Restaurar configuração padrão das prateleiras?')) return;
    MODELOS = [...MODELOS_DEFAULT];
    KS.POSICOES = Math.max(...MODELOS.flatMap(m => m.pos));
    recalcPosModelo();
    await salvarModelosNoSupabase(MODELOS);
    fecharPrateleiraConfig();
    renderShelf();
    if (typeof showToast === 'function') showToast('✅ Prateleiras restauradas!', 'success');
}

function fecharPrateleiraConfig() {
    const m = document.getElementById('prateleira-config-modal');
    const c = document.getElementById('prateleira-config-content');
    if (!m) return;
    c.style.transform = 'scale(.95)'; c.style.opacity = '0';
    setTimeout(() => { m.remove(); window._pratCfg = null; }, 250);
}

window.openPrateleiraConfig  = openPrateleiraConfig;
window.fecharPrateleiraConfig = fecharPrateleiraConfig;
window.salvarPrateleiraConfig = salvarPrateleiraConfig;
window.resetarPrateleiras    = resetarPrateleiras;
window.adicionarModeloRow    = adicionarModeloRow;
window.removerModeloRow      = removerModeloRow;
window.updateModeloField     = updateModeloField;


// ── MODAL CONFIG MÚLTIPLOS ───────────────────────────────────

function openMultiplosConfig() {
    if ((typeof getNivel === 'function' ? getNivel() : 0) < 3) {
        showToast && showToast('Apenas Admin pode alterar múltiplos', 'warning'); return;
    }
    document.getElementById('multiplos-config-modal')?.remove();

    // Monta seções por modelo
    const secoes = MODELOS.map(m => {
        const estrutura = ESTRUTURAS[m.nome] || [];
        const linhas = estrutura.map(comp => {
            const multKey = m.nome + '|' + comp.pn;
            const multAtual = KS.multiplos[multKey] !== undefined ? KS.multiplos[multKey] : comp.mult;
            return `
            <div class="flex items-center gap-2 py-1.5 border-b border-slate-800">
                <div class="flex-1 min-w-0">
                    <p style="font-size:10px;font-family:monospace;color:#94a3b8;">${comp.pn}</p>
                    <p style="font-size:10px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${comp.desc}</p>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                    <label style="font-size:9px;color:#475569;">mult:</label>
                    <input type="number" min="0" step="0.5"
                           data-mult-key="${multKey}"
                           value="${multAtual}"
                           style="width:56px;padding:3px 6px;text-align:right;font-size:11px;font-weight:700;
                                  background:#1e293b;border:1px solid #334155;border-radius:6px;color:#fff;outline:none;"
                           onfocus="this.style.borderColor='#6366f1'"
                           onblur="this.style.borderColor='#334155'">
                </div>
            </div>`;
        }).join('');

        return `
        <div style="margin-bottom:12px;">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;
                        color:${m.barColor};padding:6px 0 4px;border-bottom:1.5px solid ${m.barColor}33;">
                ${m.nome}
                <span style="font-size:9px;font-weight:500;color:#64748b;margin-left:6px;">
                    (${estrutura.length} componentes · base ${KS.qtdBase[m.nome]||1000} un)
                </span>
            </div>
            ${linhas}
        </div>`;
    }).join('');

    const html = `
    <div id="multiplos-config-modal" class="fixed inset-0 z-[96] hidden">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="fecharMultiplosConfig()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div id="multiplos-config-content"
                 class="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto"
                 style="transform:scale(.95);opacity:0;transition:all .25s;max-height:88vh;display:flex;flex-direction:column;">

                <!-- Header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
                    <div>
                        <h3 class="font-bold text-white flex items-center gap-2">
                            <span class="material-symbols-rounded text-indigo-400">calculate</span>
                            Múltiplos por Componente
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">
                            Quantidade esperada = Base × Múltiplo · Salvo para todos
                        </p>
                    </div>
                    <button onclick="fecharMultiplosConfig()" class="text-slate-400 hover:text-white">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <!-- Filtro de modelo -->
                <div class="px-5 pt-3 pb-2 flex-shrink-0">
                    <select id="mult-modelo-filter" onchange="filtrarModulosMult(this.value)"
                            class="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white outline-none">
                        <option value="all">Todos os modelos</option>
                        ${MODELOS.map(m => `<option value="${m.nome}">${m.nome}</option>`).join('')}
                    </select>
                </div>

                <!-- Corpo scrollável -->
                <div id="multiplos-body" class="px-5 pb-2 overflow-y-auto flex-1">
                    ${secoes}
                </div>

                <!-- Footer -->
                <div class="flex gap-3 px-5 py-4 border-t border-slate-800 flex-shrink-0">
                    <button onclick="resetarMultiplos()"
                        class="px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                        Restaurar padrões
                    </button>
                    <div class="flex-1"></div>
                    <button onclick="fecharMultiplosConfig()"
                        class="px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                        Cancelar
                    </button>
                    <button onclick="salvarMultiplosConfig()"
                        class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <span class="material-symbols-rounded text-sm">save</span>
                        Salvar para Todos
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('multiplos-config-modal');
    const cont  = document.getElementById('multiplos-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { cont.style.transform = 'scale(1)'; cont.style.opacity = '1'; });
}

function filtrarModulosMult(modelo) {
    const body = document.getElementById('multiplos-body');
    if (!body) return;
    body.querySelectorAll('div[style*="margin-bottom"]').forEach(sec => {
        const titulo = sec.querySelector('div[style*="font-weight:900"]')?.textContent?.trim() || '';
        sec.style.display = (modelo === 'all' || titulo.startsWith(modelo)) ? '' : 'none';
    });
}

function fecharMultiplosConfig() {
    const m = document.getElementById('multiplos-config-modal');
    const c = document.getElementById('multiplos-config-content');
    if (!m) return;
    c.style.transform = 'scale(.95)'; c.style.opacity = '0';
    setTimeout(() => m.remove(), 250);
}

async function salvarMultiplosConfig() {
    const novos = {};
    document.querySelectorAll('[data-mult-key]').forEach(inp => {
        const v = parseFloat(inp.value);
        if (!isNaN(v) && v >= 0) novos[inp.dataset.multKey] = v;
    });
    KS.multiplos = novos;
    await salvarMultiplosNoSupabase(novos);
    fecharMultiplosConfig();
    renderShelf();
    if (typeof showToast === 'function') showToast('✅ Múltiplos salvos para todos!', 'success');
}

async function resetarMultiplos() {
    if (!confirm('Restaurar múltiplos para os valores padrão do sistema?')) return;
    KS.multiplos = {};
    await salvarMultiplosNoSupabase({});
    fecharMultiplosConfig();
    renderShelf();
    if (typeof showToast === 'function') showToast('✅ Múltiplos restaurados!', 'success');
}

window.openMultiplosConfig  = openMultiplosConfig;
window.fecharMultiplosConfig = fecharMultiplosConfig;
window.salvarMultiplosConfig = salvarMultiplosConfig;
window.resetarMultiplos      = resetarMultiplos;
window.filtrarModulosMult    = filtrarModulosMult;

// ── MODAL CONSUMO POR HORA ─────────────────────────────────────

function openConsumoConfig() {
    if ((typeof getNivel === 'function' ? getNivel() : 0) < 3) { showToast && showToast('Apenas Admin pode configurar consumo', 'warning'); return; }
    document.getElementById('consumo-config-modal')?.remove();
    const rows = MODELOS.map(m => {
        const { horas, totalKits } = calcularHorasModelo(m.nome);
        const horasStr = horas > 0 ? horas.toFixed(1) + 'h' : '—';
        let corHora = 'text-slate-400'; if (horas > 0) corHora = horas < 4 ? 'text-red-400' : horas < 8 ? 'text-amber-400' : 'text-emerald-400';
        return `<div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800"><div class="flex-1"><span style="color:${m.barColor};font-weight:700;font-size:12px;">${m.nome}</span><p class="text-[10px] text-slate-400">${totalKits > 0 ? `${totalKits.toLocaleString('pt-BR')} un em estoque` : 'Sem estoque'} ${horas > 0 ? `· <span class="${corHora} font-bold">${horasStr}</span>` : ''}</p></div><div class="flex items-center gap-2"><label class="text-[10px] text-slate-400 whitespace-nowrap">pç/hora:</label><input type="number" min="0" step="1" data-consumo="${m.nome}" value="${KS.consumoHora[m.nome] || 0}" class="w-20 px-2 py-1.5 text-sm text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:border-primary-500 outline-none"></div></div>`;
    }).join('');
    const html = `<div id="consumo-config-modal" class="fixed inset-0 z-[95] hidden"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="fecharConsumoConfig()"></div><div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"><div id="consumo-config-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto" style="transform:scale(.95);opacity:0;transition:all .25s;"><div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800"><div><h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2"><span class="material-symbols-rounded text-primary-500">speed</span>Consumo por Hora</h3><p class="text-xs text-slate-400 mt-0.5">Horas = Estoque total ÷ Consumo/hora · Salvo para todos</p></div><button onclick="fecharConsumoConfig()" class="text-slate-400 hover:text-slate-600"><span class="material-symbols-rounded">close</span></button></div><div class="px-6 py-2 max-h-96 overflow-y-auto">${rows}</div><div class="flex gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800"><button onclick="fecharConsumoConfig()" class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300">Cancelar</button><button onclick="salvarConsumoConfig()" class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><span class="material-symbols-rounded text-sm">save</span>Salvar para Todos</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById('consumo-config-modal'), cont = document.getElementById('consumo-config-content');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { cont.style.transform = 'scale(1)'; cont.style.opacity = '1'; });
}
function fecharConsumoConfig() { const m = document.getElementById('consumo-config-modal'), c = document.getElementById('consumo-config-content'); if (!m) return; c.style.transform = 'scale(.95)'; c.style.opacity = '0'; setTimeout(() => m.remove(), 250); }
async function salvarConsumoConfig() { const consumo = {}; document.querySelectorAll('[data-consumo]').forEach(inp => { consumo[inp.dataset.consumo] = parseFloat(inp.value) || 0; }); KS.consumoHora = { ...KS.consumoHora, ...consumo }; await salvarConsumoNoSupabase(KS.consumoHora); fecharConsumoConfig(); renderShelf(); if (typeof showToast === 'function') showToast('✅ Consumo salvo — gauges atualizados!', 'success'); }

// ── MODAL CONFIG QTD ──────────────────────────────────────────

function openQtdConfig() { if ((typeof getNivel === 'function' ? getNivel() : 0) < 3) { showToast && showToast('Apenas Admin pode alterar', 'warning'); return; } document.getElementById('qtd-config-modal')?.remove(); const rows = MODELOS.map(m => `<div class="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800"><div class="flex-1"><span style="color:${m.barColor};font-weight:700;font-size:12px;">${m.nome}</span><p style="font-size:10px;color:#64748b;">Pos. ${m.pos.join(', ')} · ${ESTRUTURAS[m.nome]?.length || 0} componentes</p></div><div class="flex items-center gap-2"><label style="font-size:10px;color:#94a3b8;">Base (un):</label><input type="number" min="1" step="1" data-modelo="${m.nome}" value="${KS.qtdBase[m.nome] || 1000}" class="w-24 px-2 py-1.5 text-sm text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:border-primary-500 outline-none"></div></div>`).join(''); const html = `<div id="qtd-config-modal" class="fixed inset-0 z-[95] hidden"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeQtdConfig()"></div><div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"><div id="qtd-config-content" class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto p-6" style="transform:scale(.95);opacity:0;transition:all .25s;"><div class="flex items-center justify-between mb-4"><div><h3 class="font-bold text-slate-900 dark:text-white">Quantidade Base por Kanban</h3><p class="text-xs text-slate-400 mt-0.5">Salvo globalmente para todos os usuários</p></div><button onclick="closeQtdConfig()" class="text-slate-400 hover:text-slate-600"><span class="material-symbols-rounded">close</span></button></div><div class="space-y-0 max-h-80 overflow-y-auto">${rows}</div><div class="flex gap-3 mt-5"><button onclick="closeQtdConfig()" class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600">Cancelar</button><button onclick="salvarQtdConfig()" class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">Salvar para Todos</button></div></div></div></div>`; document.body.insertAdjacentHTML('beforeend', html); const modal = document.getElementById('qtd-config-modal'), cont = document.getElementById('qtd-config-content'); modal.classList.remove('hidden'); requestAnimationFrame(() => { cont.style.transform = 'scale(1)'; cont.style.opacity = '1'; }); }
function closeQtdConfig() { const m = document.getElementById('qtd-config-modal'), c = document.getElementById('qtd-config-content'); if (!m) return; c.style.transform = 'scale(.95)'; c.style.opacity = '0'; setTimeout(() => m.remove(), 250); }
async function salvarQtdConfig() { const qtds = {}; document.querySelectorAll('[data-modelo]').forEach(inp => { const v = parseInt(inp.value); if (inp.dataset.modelo && v > 0) qtds[inp.dataset.modelo] = v; }); KS.qtdBase = { ...KS.qtdBase, ...qtds }; await salvarQtdNoSupabase(KS.qtdBase); closeQtdConfig(); renderShelf(); if (typeof showToast === 'function') showToast('✅ Quantidades salvas para todos!', 'success'); }

// ── CONFIG SHEETS ─────────────────────────────────────────────

function openSheetsConfig() { if ((typeof getNivel === 'function' ? getNivel() : 0) < 3) { showToast && showToast('Apenas Admin pode alterar', 'warning'); return; } setVal('cfg-sheets-url', KS.sheetsUrl); const m = document.getElementById('sheets-config-modal'), c = document.getElementById('sheets-config-content'); m.classList.remove('hidden'); requestAnimationFrame(() => { c.style.transform = 'scale(1)'; c.style.opacity = '1'; }); }
function closeSheetsConfig() { const m = document.getElementById('sheets-config-modal'), c = document.getElementById('sheets-config-content'); c.style.transform = 'scale(.95)'; c.style.opacity = '0'; setTimeout(() => { m.classList.add('hidden'); c.style.transform = 'scale(.95)'; }, 250); }
async function saveSheetsConfig() { const url = (getVal('cfg-sheets-url') || '').trim(); if (!url) { showToast && showToast('Informe a URL', 'warning'); return; } await salvarUrlNoSupabase(url); setVal('sheets-url', url); closeSheetsConfig(); await syncSheets(); showToast && showToast('✅ URL salva para todos!', 'success'); }

// ── FILTRO ────────────────────────────────────────────────────

function filterKanban(type) { KS.currentFilter = type; document.querySelectorAll('.kf-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === type)); applyFilter(type); }
function applyFilter(type) { const q = (document.getElementById('kanban-search')?.value || '').toLowerCase(); document.querySelectorAll('td.vaga').forEach(td => { const f = td.dataset.filter || 'vazio', pos = td.dataset.pos || ''; let show = true; if (type === 'search') show = pos.toLowerCase().includes(q); else if (type !== 'all') show = f === type; td.style.opacity = show ? '1' : '0.06'; td.style.pointerEvents = show ? 'auto' : 'none'; }); }

// ── HELPERS ───────────────────────────────────────────────────

function setSyncStatus(msg, type) { const e = document.getElementById('sync-status'); if (!e) return; const c = { ok:'text-emerald-500', error:'text-rose-500', loading:'text-slate-400', neutral:'text-slate-400' }; e.className = `font-medium ${c[type] || 'text-slate-400'}`; e.textContent = msg; }
function setText(id, v) { const e = document.getElementById(id); if (e) e.textContent = v ?? '—'; }
function getVal(id) { return document.getElementById(id)?.value || ''; }
function setVal(id, v) { const e = document.getElementById(id); if (e) e.value = v; }
function animateSyncIcon(on) { const i = document.getElementById('sync-icon'); if (i) i.style.animation = on ? 'spin 1s linear infinite' : ''; }

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
        if (KS.gradeXLS && Object.keys(KS.gradeXLS).length > 0) {
            KS.grade = KS.gradeXLS;
            renderShelf();
            const infoEl = document.getElementById('kanban-ultimo-arquivo');
            if (infoEl && KS.ultimoArquivo) { infoEl.textContent = KS.ultimoArquivo; infoEl.classList.remove('hidden'); }
            setSyncStatus('✓ ' + (KS.ultimoArquivo || 'Arquivo carregado'), 'ok');
        } else {
            setSyncStatus('Aguardando arquivo XLS do TOTVS', 'neutral');
        }
    } else {
        if (label) label.textContent = 'Atualizar';
        if (icon)  icon.textContent  = 'sync';
    }
}

window.setKanbanFonte    = setKanbanFonte;
window.kanbanFonteAction = kanbanFonteAction;

// ── EXPORTS ───────────────────────────────────────────────────

window.initKanban = initKanban; window.setKanbanFonte = setKanbanFonte; window.kanbanFonteAction = kanbanFonteAction; window.syncSheets = syncSheets; window.filterKanban = filterKanban;
window.openSheetsConfig = openSheetsConfig; window.closeSheetsConfig = closeSheetsConfig; window.saveSheetsConfig = saveSheetsConfig;
window.openKanbanDetail = openKanbanDetail; window.closeKanbanDetail = closeKanbanDetail;
window.openQtdConfig = openQtdConfig; window.closeQtdConfig = closeQtdConfig; window.salvarQtdConfig = salvarQtdConfig;
window.openMultiplosConfig = openMultiplosConfig; window.fecharMultiplosConfig = fecharMultiplosConfig;
window.openPrateleiraConfig = openPrateleiraConfig;
window.openConsumoConfig = openConsumoConfig; window.fecharConsumoConfig = fecharConsumoConfig; window.salvarConsumoConfig = salvarConsumoConfig;

document.addEventListener('pageChanged', e => { if (e.detail === 'kanban') initKanban(); });
console.log('✅ kanban-sheets.js — XLS compartilhado via Supabase');
