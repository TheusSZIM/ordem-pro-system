// Helper Functions - FIEL

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text || '-';
    return text.substring(0, maxLength) + '...';
}

function getStatusColor(status) {
    const colors = {
        'pending': 'bg-amber-500/20 text-amber-400',
        'progress': 'bg-blue-500/20 text-blue-400',
        'completed': 'bg-emerald-500/20 text-emerald-400',
        'cancelled': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Pendente',
        'progress': 'Em Andamento',
        'completed': 'Concluída',
        'cancelled': 'Cancelada'
    };
    return labels[status] || status;
}

function generateOrderId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}-${random}`;
}
