// ============================================================
// SEPARACAO.JS — Performance por separador
// Lê window.state.orders (já carregado pelo sistema)
// ============================================================

const SEP_CORES = [
  '#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#06b6d4','#ec4899','#84cc16','#f97316','#14b8a6',
];

// ── Utilitários ───────────────────────────────────────────────

function _sepMinutos(inicio, fim) {
  if (!inicio) return null;
  const s = new Date(inicio);
  const e = fim ? new Date(fim) : new Date();
  if (isNaN(s) || isNaN(e)) return null;
  return Math.max(0, Math.round((e - s) / 60000));
}

function _sepFmtTempo(min) {
  if (min === null || min === undefined) return '—';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function _sepTempoClass(min) {
  if (min === null) return '';
  if (min <= 30) return 'sep-tempo-ok';
  if (min <= 90) return 'sep-tempo-warn';
  return 'sep-tempo-slow';
}

function _sepIniciais(nome) {
  if (!nome) return '?';
  return nome.trim().split(/\s+/).map(p => p[0]?.toUpperCase() || '').slice(0, 2).join('');
}

function _sepPeriodFiltro(ordem) {
  const period = document.getElementById('sep-period')?.value || 'today';
  const ref = ordem.fimSeparacao || ordem.inicioSeparacao || ordem.created_at;
  if (!ref) return period === 'all';
  const d = new Date(ref);
  const now = new Date();
  if (period === 'today') {
    return d.toDateString() === now.toDateString();
  }
  if (period === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    return d >= startOfWeek;
  }
  if (period === 'month') {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return true; // all
}

// ── Processa ordens ───────────────────────────────────────────

function _sepProcessar(ordens) {
  const mapa = {}; // nome → dados do separador

  ordens.forEach(o => {
    const sep = o.separador || o.operator || o.operador || null;
    if (!sep) return;
    if (!_sepPeriodFiltro(o)) return;

    if (!mapa[sep]) {
      mapa[sep] = {
        nome:         sep,
        concluidas:   0,
        emAndamento:  0,
        tempos:       [],
        ultimas:      [],
        emAtual:      null,
      };
    }

    const min = _sepMinutos(o.inicioSeparacao || o.inicio_separacao, o.fimSeparacao || o.fim_separacao);

    const concluida = ['completed','concluida','concluído','done'].includes(
      (o.status || '').toLowerCase()
    );

    if (concluida) {
      mapa[sep].concluidas++;
      if (min !== null) mapa[sep].tempos.push(min);
      mapa[sep].ultimas.push({
        lote:     o.lote || o.id || '—',
        produto:  o.product || o.produto || '—',
        min,
        fim:      o.fimSeparacao || o.fim_separacao || null,
      });
    } else if (['progress','in_progress','separando'].includes((o.status || '').toLowerCase())) {
      mapa[sep].emAndamento++;
      mapa[sep].emAtual = {
        lote:    o.lote || o.id || '—',
        produto: o.product || o.produto || '—',
        inicio:  o.inicioSeparacao || o.inicio_separacao,
      };
    }
  });

  // Ordena ultimas por data (mais recentes primeiro)
  Object.values(mapa).forEach(sep => {
    sep.ultimas.sort((a,b) => (b.fim||'') > (a.fim||'') ? 1 : -1);
    sep.ultimas = sep.ultimas.slice(0, 4);
    sep.tempoMedio = sep.tempos.length
      ? Math.round(sep.tempos.reduce((a,b) => a+b, 0) / sep.tempos.length)
      : null;
    sep.tempoMax = sep.tempos.length ? Math.max(...sep.tempos) : null;
  });

  return Object.values(mapa).sort((a,b) => b.concluidas - a.concluidas);
}

// ── Render cards ──────────────────────────────────────────────

function _sepRenderCard(sep, idx) {
  const cor  = SEP_CORES[idx % SEP_CORES.length];
  const ini  = _sepIniciais(sep.nome);
  const ativo = sep.emAndamento > 0;
  const max   = Math.max(...Object.values(window.state?.orders || []).map(()=>1).fill(sep.concluidas)) || 1;

  // Barra de progresso relativa ao melhor separador
  const pct = window._sepMaxConcluidas
    ? Math.round((sep.concluidas / window._sepMaxConcluidas) * 100)
    : 100;

  const ultimasHTML = sep.ultimas.length
    ? sep.ultimas.map(o => `
        <div class="sep-order-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="sep-order-lote">${o.lote}</span>
            <span style="font-size:10px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.produto}</span>
          </div>
          <span class="sep-order-tempo ${_sepTempoClass(o.min)}">${_sepFmtTempo(o.min)}</span>
        </div>`).join('')
    : `<p style="font-size:11px;color:#475569;text-align:center;padding:8px 0;">Nenhuma ordem concluída</p>`;

  const emAtualHTML = sep.emAtual
    ? `<div style="padding:0 20px 12px;">
         <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;
                     background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);
                     border-radius:10px;">
           <span style="font-size:14px;">⚙️</span>
           <div style="min-width:0;">
             <p style="font-size:10px;color:#f59e0b;font-weight:700;margin:0;">EM ANDAMENTO</p>
             <p style="font-size:11px;color:#94a3b8;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
               ${sep.emAtual.lote} · ${_sepFmtTempo(_sepMinutos(sep.emAtual.inicio, null))} rodando
             </p>
           </div>
         </div>
       </div>`
    : '';

  return `
  <div class="sep-card">
    <div class="sep-card-header">
      <div class="sep-avatar" style="background:${cor}22;color:${cor};border:1.5px solid ${cor}44;">
        ${ini}
      </div>
      <div style="flex:1;min-width:0;">
        <p style="font-size:14px;font-weight:700;margin:0;color:var(--t,#e2e8f0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${sep.nome}</p>
        <p style="font-size:10px;color:#64748b;margin:2px 0 0;">
          ${sep.concluidas} ordem${sep.concluidas!==1?'s':''} concluída${sep.concluidas!==1?'s':''}
        </p>
      </div>
      <span class="sep-status-badge ${ativo ? 'sep-status-ativo' : 'sep-status-livre'}">
        ${ativo ? '● Ativo' : '○ Livre'}
      </span>
    </div>

    <!-- Métricas -->
    <div class="sep-metrics">
      <div class="sep-metric">
        <p class="sep-metric-label">Concluídas</p>
        <p class="sep-metric-value" style="color:${cor};">${sep.concluidas}</p>
        <p class="sep-metric-sub">ordens</p>
      </div>
      <div class="sep-metric">
        <p class="sep-metric-label">Tempo médio</p>
        <p class="sep-metric-value" style="color:${cor};font-size:16px;">${_sepFmtTempo(sep.tempoMedio)}</p>
        <p class="sep-metric-sub">por ordem</p>
      </div>
      <div class="sep-metric">
        <p class="sep-metric-label">Em andamento</p>
        <p class="sep-metric-value" style="color:${sep.emAndamento > 0 ? '#f59e0b' : '#475569'};font-size:18px;">${sep.emAndamento}</p>
        <p class="sep-metric-sub">agora</p>
      </div>
    </div>

    <!-- Barra relativa -->
    <div class="sep-progress-wrap" style="padding-top:12px;">
      <div class="sep-progress-label">
        <span>Produtividade relativa</span>
        <span style="color:${cor};font-weight:700;">${pct}%</span>
      </div>
      <div class="sep-progress-track">
        <div class="sep-progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${cor}aa,${cor});"></div>
      </div>
    </div>

    ${emAtualHTML}

    <!-- Últimas ordens -->
    <div style="padding:0 20px 6px;">
      <p style="font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#475569;margin-bottom:6px;">
        Últimas ordens
      </p>
    </div>
    <div class="sep-orders-list">
      ${ultimasHTML}
    </div>
  </div>`;
}

// ── Render tabela top tempos ──────────────────────────────────

function _sepRenderTop(ordens) {
  const period = document.getElementById('sep-period')?.value || 'today';

  const comTempo = ordens
    .filter(o => {
      if (!_sepPeriodFiltro(o)) return false;
      const min = _sepMinutos(o.inicioSeparacao || o.inicio_separacao, o.fimSeparacao || o.fim_separacao);
      return min !== null && min > 0 && ['completed','concluida','concluído','done'].includes((o.status||'').toLowerCase());
    })
    .map(o => ({
      lote:    o.lote || o.id || '—',
      produto: o.product || o.produto || '—',
      sep:     o.separador || o.operator || o.operador || '—',
      inicio:  o.inicioSeparacao || o.inicio_separacao,
      fim:     o.fimSeparacao || o.fim_separacao,
      min:     _sepMinutos(o.inicioSeparacao || o.inicio_separacao, o.fimSeparacao || o.fim_separacao),
    }))
    .sort((a,b) => b.min - a.min)
    .slice(0, 10);

  const tbody = document.getElementById('sep-top-tbody');
  if (!tbody) return;
  const label = document.getElementById('sep-top-label');

  if (!comTempo.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 text-sm">
      Nenhuma ordem com tempo de separação registrado no período.
    </td></tr>`;
    if (label) label.textContent = 'Nenhum dado';
    return;
  }

  if (label) label.textContent = `Top ${comTempo.length}`;

  const rankClass = i => i === 0 ? 'sep-rank-1' : i === 1 ? 'sep-rank-2' : i === 2 ? 'sep-rank-3' : 'sep-rank-n';

  tbody.innerHTML = comTempo.map((o, i) => {
    const fimStr = o.fim
      ? new Date(o.fim).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
      : '—';
    const iniStr = o.inicio
      ? new Date(o.inicio).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
      : '—';
    const maxMin = comTempo[0].min;
    const pct    = Math.round((o.min / maxMin) * 100);

    return `<tr>
      <td><span class="sep-rank ${rankClass(i)}">${i+1}</span></td>
      <td>
        <p style="font-weight:700;font-family:monospace;font-size:11px;color:#818cf8;margin:0;">${o.lote}</p>
        <p style="font-size:10px;color:#475569;margin:2px 0 0;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.produto}</p>
      </td>
      <td style="font-size:12px;color:#94a3b8;">${o.sep}</td>
      <td style="font-size:11px;color:#64748b;">${iniStr}</td>
      <td style="font-size:11px;color:#64748b;">${fimStr}</td>
      <td style="text-align:right;">
        <div class="sep-gauge-wrap">
          <div class="sep-gauge-bar">
            <div class="sep-gauge-fill" style="width:${pct}%;background:${o.min > 90 ? '#ef4444' : o.min > 30 ? '#f59e0b' : '#10b981'};"></div>
          </div>
          <span class="sep-order-tempo ${_sepTempoClass(o.min)}" style="white-space:nowrap;">${_sepFmtTempo(o.min)}</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ── KPIs globais ──────────────────────────────────────────────

function _sepRenderKPIs(seps, ordens) {
  const ativos     = seps.filter(s => s.emAndamento > 0).length;
  const concluidas = seps.reduce((a,s) => a + s.concluidas, 0);
  const todos_tempos = seps.flatMap(s => s.tempos);
  const tempoMed   = todos_tempos.length
    ? Math.round(todos_tempos.reduce((a,b)=>a+b,0) / todos_tempos.length)
    : null;
  const andamento  = seps.reduce((a,s) => a + s.emAndamento, 0);

  const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
  set('sep-kpi-ativos',     ativos     || '—');
  set('sep-kpi-concluidas', concluidas || '—');
  set('sep-kpi-tempo',      _sepFmtTempo(tempoMed));
  set('sep-kpi-andamento',  andamento  || '—');
}

// ── Refresh principal ─────────────────────────────────────────

window.sepRefresh = function() {
  const ordens = window.state?.orders || [];
  const icon   = document.getElementById('sep-refresh-icon');

  if (icon) { icon.style.animation = 'spin 1s linear infinite'; }

  setTimeout(() => {
    const seps = _sepProcessar(ordens);
    window._sepMaxConcluidas = seps.length ? Math.max(...seps.map(s=>s.concluidas), 1) : 1;

    const grid  = document.getElementById('sep-cards-grid');
    const empty = document.getElementById('sep-empty');

    if (!seps.length) {
      if (grid)  grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
    } else {
      if (empty) empty.classList.add('hidden');
      if (grid)  grid.innerHTML = seps.map((s,i) => _sepRenderCard(s,i)).join('');
    }

    _sepRenderKPIs(seps, ordens);
    _sepRenderTop(ordens);

    const now = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    const el  = document.getElementById('sep-last-update');
    if (el) el.textContent = `às ${now}`;
    if (icon) icon.style.animation = '';
  }, 100);
};

// ── Init ──────────────────────────────────────────────────────

window.initSeparacao = function() {
  sepRefresh();
  // Auto-refresh a cada 60s quando a aba estiver visível
  if (window._sepInterval) clearInterval(window._sepInterval);
  window._sepInterval = setInterval(() => {
    const page = document.getElementById('separacao');
    if (page && !page.classList.contains('hidden')) sepRefresh();
  }, 60000);
};

// Escuta evento de troca de página
document.addEventListener('pageChanged', e => {
  if (e.detail === 'separacao') initSeparacao();
});

console.log('✅ separacao.js carregado');
