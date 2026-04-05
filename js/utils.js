/* ============================================
   CONTROLE DE ORDENS PRO - UTILITÁRIOS
   ============================================ */

// Formatar Data
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

// Calcular Progresso
function calculateProgress(ordem) {
    switch(ordem.status) {
        case 'pending': return 0;
        case 'progress': return 50;
        case 'completed': return 100;
        case 'delivered': return 100;
        default: return 0;
    }
}

// Animar Contadores
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Atualizar Hora
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const timeEl = document.getElementById('current-time');
    if (timeEl) timeEl.textContent = timeStr;
}

// Sistema de Toast
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    
    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    toast.className = `flex items-center gap-3 px-4 py-3 ${colors[type]} text-white rounded-xl shadow-lg transform translate-y-10 opacity-0 transition-all duration-300 min-w-[300px]`;
    toast.innerHTML = `
        <span class="material-symbols-rounded">${icons[type]}</span>
        <p class="text-sm font-medium">${message}</p>
        <button onclick="this.parentElement.remove()" class="ml-auto hover:bg-white/20 rounded p-1">
            <span class="material-symbols-rounded text-sm">close</span>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Gerar Timeline
function generateTimeline(ordem) {
    const steps = [];
    const now = new Date().toLocaleString('pt-BR');
    
    // Created
    steps.push({
        icon: 'add_circle',
        color: 'slate',
        title: 'Ordem Criada',
        time: ordem.dataInicio || 'Data não registrada',
        active: true
    });
    
    if (ordem.status !== 'pending') {
        steps.push({
            icon: 'play_circle',
            color: 'blue',
            title: 'Separação Iniciada',
            time: ordem.inicioSeparacao || now,
            active: true,
            by: ordem.separador
        });
    }
    
    if (ordem.status === 'completed' || ordem.status === 'delivered') {
        steps.push({
            icon: 'check_circle',
            color: 'emerald',
            title: 'Separação Concluída',
            time: ordem.fimSeparacao || now,
            active: true,
            by: ordem.separador
        });
    }
    
    if (ordem.status === 'delivered') {
        steps.push({
            icon: 'local_shipping',
            color: 'violet',
            title: 'Ordem Entregue',
            time: ordem.dataEntrega || now,
            active: true,
            by: ordem.responsavelEntrega
        });
    }
    
    if (ordem.status === 'progress') {
        steps.push({
            icon: 'hourglass_empty',
            color: 'amber',
            title: 'Em Andamento',
            time: 'Previsão: ' + formatDate(ordem.dataPrevista),
            active: false
        });
    }
    
    return `
        <div class="space-y-0">
            ${steps.map((step, index) => `
                <div class="flex gap-4">
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30 text-${step.color}-600 flex items-center justify-center ${step.active ? '' : 'opacity-50'}">
                            <span class="material-symbols-rounded text-sm">${step.icon}</span>
                        </div>
                        ${index < steps.length - 1 ? '<div class="w-0.5 h-12 bg-slate-200 dark:bg-slate-700 mt-1"></div>' : ''}
                    </div>
                    <div class="pb-8 ${step.active ? '' : 'opacity-50'}">
                        <p class="text-sm font-semibold text-slate-900 dark:text-white">${step.title}</p>
                        <p class="text-xs text-slate-500 mt-0.5">${step.time}</p>
                        ${step.by ? `<p class="text-xs text-slate-400 mt-0.5">Por: ${step.by}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Tema
function initTheme() {
    if (state.theme === 'dark' || (!state.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    state.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    if (typeof updateCharts === 'function') {
        updateCharts();
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatDate, calculateProgress, animateCounters, updateTime, showToast, generateTimeline, initTheme, toggleTheme };
}
