// Funções Auxiliares (Helpers)

// Mostrar toast de notificação
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-emerald-600' :
        type === 'error' ? 'bg-red-600' :
        type === 'warning' ? 'bg-amber-600' :
        'bg-blue-600'
    } text-white`;
    
    toast.textContent = message;
    container.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => toast.classList.add('translate-x-0'), 10);
    
    // Remover após duração
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Criar container de toasts se não existir
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-[9999] space-y-2';
    document.body.appendChild(container);
    return container;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Formatar data e hora
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Obter cor do status
function getStatusColor(status) {
    const colors = {
        pending: 'bg-amber-500/20 text-amber-400',
        progress: 'bg-blue-500/20 text-blue-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
        cancelled: 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
}

// Obter label do status
function getStatusLabel(status) {
    const labels = {
        pending: 'Pendente',
        progress: 'Em Andamento',
        completed: 'Concluída',
        cancelled: 'Cancelada'
    };
    return labels[status] || 'Desconhecido';
}

// Debounce para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatar número com separadores
function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}
