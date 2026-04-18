// ============================================================
// DASHBOARD — js/dashboard.js
// Layout switcher + analytics + compact + command updaters
// ============================================================

// ── Layout switcher ───────────────────────────────────────────

function setDashLayout(layout) {
    try {
        const s   = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        const uid = s?.user?.id || 'guest';
        localStorage.setItem('dash_layout_' + uid, layout);
    } catch(_) { localStorage.setItem('dash_layout', layout); }

    document.querySelectorAll('.dash-layout').forEach(el => el.classList.remove('active'));
    document.getElementById('layout-' + layout)?.classList.add('active');

    document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active-layout'));
    document.getElementById('layout-btn-' + layout)?.classList.add('active-layout');

    setTimeout(() => {
        if (typeof initCharts === 'function') initCharts();
        dashUpdateAll();
    }, 80);
}

function loadSavedLayout() {
    try {
        const s   = JSON.parse(localStorage.getItem('ordem_pro_session')||'{}');
        const uid = s?.user?.id || 'guest';
        return localStorage.getItem('dash_layout_' + uid)
            || localStorage.getItem('dash_layout')
            || 'classic';
    } catch(_) { return 'classic'; }
}

// ── Analytics layout ──────────────────────────────────────────

function updateAnalyticsLayout() {
    const orders = window.state?.orders || [];
    const total     = orders.length;
    const pending   = orders.filter(o => o.status === 'pending').length;
    const progress  = orders.filter(o => ['progress','in_progress'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const efic      = total > 0 ? Math.round((completed + delivered) / total * 100) : 0;

    const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    const bar = (id, p) => { const e = document.getElementById(id); if(e) e.style.width = p + '%'; };
    const pct = n      => total > 0 ? Math.round(n/total*100) + '%' : '0%';

    set('al-a-separar', pending); set('al-em-separacao', progress);
    set('al-concluidas', completed); set('al-eficiencia', efic + '%');

    bar('al-bar-pending',   total ? pending/total*100   : 0);
    bar('al-bar-progress',  total ? progress/total*100  : 0);
    bar('al-bar-completed', total ? completed/total*100 : 0);

    set('al-pct-pending',   pct(pending));
    set('al-pct-progress',  pct(progress));
    set('al-pct-completed', pct(completed));
    set('al-pct-delivered', pct(delivered));

    bar('al-barp-pending',   total ? pending/total*100   : 0);
    bar('al-barp-progress',  total ? progress/total*100  : 0);
    bar('al-barp-completed', total ? completed/total*100 : 0);
    bar('al-barp-delivered', total ? delivered/total*100 : 0);

    const arc = document.getElementById('al-efic-arc');
    if (arc) arc.style.strokeDashoffset = 125.6 * (1 - efic/100);

    const tl = document.getElementById('al-timeline');
    if (tl) {
        const sc = {
            pending:    {c:'#f59e0b',l:'Pendente'},
            progress:   {c:'#3b82f6',l:'Em Sep.'},
            in_progress:{c:'#3b82f6',l:'Em Sep.'},
            completed:  {c:'#10b981',l:'Concluída'},
            delivered:  {c:'#8b5cf6',l:'Entregue'},
        };
        tl.innerHTML = orders.slice(0,4).map(o => {
            const cfg = sc[o.status] || sc.pending;
            const dt  = new Date(o.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
            return `<div class="tl-card" onclick="showOrdemDetail('${o.id}')">
                <div style="width:8px;height:8px;border-radius:50%;background:${cfg.c};flex-shrink:0"></div>
                <div style="flex:1;min-width:0">
                    <p style="font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.lote||o.product||o.id}</p>
                    <p style="font-size:10px;color:#94a3b8">${o.product||'—'}</p>
                </div>
                <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:20px;background:${cfg.c}22;color:${cfg.c};flex-shrink:0">${cfg.l}</span>
                <span style="font-size:10px;color:#94a3b8;flex-shrink:0">${dt}</span>
            </div>`;
        }).join('') || '<div style="font-size:12px;color:#94a3b8;text-align:center;padding:8px">Sem ordens</div>';
    }
}

// ── Compact layout ────────────────────────────────────────────

function updateCompactLayout() {
    const orders = window.state?.orders || [];
    const total     = orders.length;
    const pending   = orders.filter(o => o.status === 'pending').length;
    const progress  = orders.filter(o => ['progress','in_progress'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
    const bar = (id, p) => { const e = document.getElementById(id); if(e) e.style.width = p + '%'; };

    set('cp-pending',   pending);  set('cp-progress',  progress);
    set('cp-completed', completed); set('cp-delivered', delivered);
    bar('cp-bar-pending',   total ? pending/total*100   : 0);
    bar('cp-bar-progress',  total ? progress/total*100  : 0);
    bar('cp-bar-completed', total ? completed/total*100 : 0);
    bar('cp-bar-delivered', total ? delivered/total*100 : 0);

    const list = document.getElementById('cp-orders-list');
    if (list) {
        const sc = {
            pending:    {c:'#f59e0b',dot:'🟡',l:'Pendente'},
            progress:   {c:'#3b82f6',dot:'🔵',l:'Em Sep.'},
            in_progress:{c:'#3b82f6',dot:'🔵',l:'Em Sep.'},
            completed:  {c:'#10b981',dot:'🟢',l:'Pronta'},
            delivered:  {c:'#8b5cf6',dot:'🟣',l:'Entregue'},
        };
        list.innerHTML = orders.slice(0,8).map(o => {
            const cfg = sc[o.status] || sc.pending;
            return `<div style="display:flex;align-items:center;gap:10px;padding:8px 16px;cursor:pointer;transition:background .15s"
                onmouseover="this.style.background='rgba(99,102,241,.06)'"
                onmouseout="this.style.background=''"
                onclick="showOrdemDetail('${o.id}')">
                <span style="font-size:13px">${cfg.dot}</span>
                <div style="flex:1;min-width:0">
                    <p style="font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.lote||'—'}</p>
                    <p style="font-size:10px;color:#94a3b8">${o.product||'—'} · ${o.quantity||0} un</p>
                </div>
                <span style="font-size:10px;font-weight:600;color:${cfg.c};flex-shrink:0">${cfg.l}</span>
            </div>`;
        }).join('') || '<div style="padding:12px;font-size:12px;color:#94a3b8;text-align:center">Sem ordens</div>';
    }
}

// ── Command layout ────────────────────────────────────────────

function updateCommandLayout() {
    const orders = window.state?.orders || [];
    const total     = orders.length;
    const pending   = orders.filter(o => o.status === 'pending').length;
    const progress  = orders.filter(o => ['progress','in_progress'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const efic      = total > 0 ? Math.round((completed + delivered) / total * 100) : 0;

    const set = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };

    set('cmd-total',     total);
    set('cmd-pending',   pending);
    set('cmd-progress',  progress);
    set('cmd-completed', completed);
    set('cmd-delivered', delivered);
    set('cmd-efic',      efic + '%');
    set('cmd-done-sum',  completed + delivered);

    // Arco de eficiência
    const arc = document.getElementById('cmd-efic-arc');
    if (arc) {
        const circ = 2 * Math.PI * 54;
        arc.style.strokeDasharray  = circ;
        arc.style.strokeDashoffset = circ * (1 - efic / 100);
        arc.style.stroke = efic >= 80 ? '#10b981' : efic >= 50 ? '#f59e0b' : '#ef4444';
    }
    const eficTxt = document.getElementById('cmd-efic-color');
    if (eficTxt) eficTxt.style.color = efic >= 80 ? '#10b981' : efic >= 50 ? '#f59e0b' : '#ef4444';

    // Lista de ordens recentes
    const list = document.getElementById('cmd-orders-list');
    if (list) {
        const sc = {
            pending:    {c:'#f59e0b', bg:'rgba(245,158,11,.12)', label:'FILA'},
            progress:   {c:'#3b82f6', bg:'rgba(59,130,246,.12)', label:'ATIVO'},
            in_progress:{c:'#3b82f6', bg:'rgba(59,130,246,.12)', label:'ATIVO'},
            completed:  {c:'#10b981', bg:'rgba(16,185,129,.12)', label:'PRONTO'},
            delivered:  {c:'#8b5cf6', bg:'rgba(139,92,246,.12)', label:'ENTREGUE'},
        };
        list.innerHTML = orders.slice(0,6).map(o => {
            const cfg = sc[o.status] || sc.pending;
            const dt  = new Date(o.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
            return `<div class="cmd-order-row" onclick="showOrdemDetail('${o.id}')">
                <div class="cmd-order-dot" style="background:${cfg.c}"></div>
                <div class="cmd-order-info">
                    <span class="cmd-order-lote">${o.lote || '—'}</span>
                    <span class="cmd-order-product">${o.product || '—'} · ${o.quantity||0} un</span>
                </div>
                <span class="cmd-order-badge" style="background:${cfg.bg};color:${cfg.c}">${cfg.label}</span>
                <span class="cmd-order-date">${dt}</span>
            </div>`;
        }).join('') || '<div class="cmd-empty">Nenhuma ordem registrada</div>';
    }
}

// ── Shared ────────────────────────────────────────────────────

function dashUpdateAll() {
    updateAnalyticsLayout();
    updateCompactLayout();
    updateCommandLayout();
}

window.refreshDashboard = function() {
    const icon = document.querySelector('#refresh-btn .material-symbols-rounded');
    if (icon) icon.style.animation = 'spin 1s linear infinite';
    setTimeout(() => {
        if (icon) icon.style.animation = '';
        if (typeof renderDashboardStats === 'function') renderDashboardStats();
        if (typeof renderRecentOrders   === 'function') renderRecentOrders();
        if (typeof initCharts           === 'function') initCharts();
        dashUpdateAll();
    }, 600);
};

window.updateTime = function() {
    const el = document.getElementById('current-time');
    if (el) el.textContent = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
};

// ── Exports ───────────────────────────────────────────────────

window.setDashLayout          = setDashLayout;
window.updateAnalyticsLayout  = updateAnalyticsLayout;
window.updateCompactLayout    = updateCompactLayout;
window.updateCommandLayout    = updateCommandLayout;
window.dashUpdateAll          = dashUpdateAll;

// Listen to state updates
document.addEventListener('stateUpdated', dashUpdateAll);

// Init when dashboard page is shown
document.addEventListener('pageChanged', e => {
    if (e.detail === 'dashboard') {
        setTimeout(() => {
            setDashLayout(loadSavedLayout());
            dashUpdateAll();
            if (typeof updateTime === 'function') updateTime();
        }, 100);
    }
});

console.log('✅ dashboard.js — 4 layouts carregados (classic, analytics, compact, command)');
