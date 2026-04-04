// ===================================
// ORDEM PRO SYSTEM - HELPER FUNCTIONS
// ===================================

/**
 * Format date to Brazilian format
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
}

/**
 * Format datetime to Brazilian format
 * @param {Date|string} datetime - Datetime to format
 * @returns {string} Formatted datetime
 */
function formatDateTime(datetime) {
    if (!datetime) return '-';
    const d = new Date(datetime);
    return d.toLocaleString('pt-BR');
}

/**
 * Format currency to Brazilian Real
 * @param {number} value - Value to format
 * @returns {string} Formatted currency
 */
function formatCurrency(value) {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Format number with thousand separator
 * @param {number} value - Value to format
 * @returns {string} Formatted number
 */
function formatNumber(value) {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Calculate time difference between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date (default: now)
 * @returns {string} Formatted time difference
 */
function calculateTimeDifference(startDate, endDate = new Date()) {
    if (!startDate) return '-';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Sanitize HTML string
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado para área de transferência!', 'success');
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar texto', 'error');
    }
}

/**
 * Get status color class
 * @param {string} status - Order status
 * @returns {string} CSS class
 */
function getStatusColor(status) {
    const colors = {
        pending: 'status-pending',
        progress: 'status-progress',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
}

/**
 * Get status label
 * @param {string} status - Order status
 * @returns {string} Status label
 */
function getStatusLabel(status) {
    const labels = {
        pending: 'Pendente',
        progress: 'Em Andamento',
        completed: 'Concluída',
        cancelled: 'Cancelada'
    };
    return labels[status] || 'Desconhecido';
}

/**
 * Get status icon
 * @param {string} status - Order status
 * @returns {string} Material icon name
 */
function getStatusIcon(status) {
    const icons = {
        pending: 'schedule',
        progress: 'sync',
        completed: 'check_circle',
        cancelled: 'cancel'
    };
    return icons[status] || 'help';
}

/**
 * Get priority color
 * @param {string} priority - Priority level
 * @returns {string} CSS color class
 */
function getPriorityColor(priority) {
    const colors = {
        high: 'text-red-500',
        medium: 'text-amber-500',
        low: 'text-green-500'
    };
    return colors[priority] || 'text-slate-500';
}

/**
 * Export data to CSV
 * @param {Array} data - Data array
 * @param {string} filename - File name
 */
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        showToast('Nenhum dado para exportar', 'warning');
        return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => 
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${formatDate(new Date())}.csv`;
    link.click();
}

/**
 * Print element
 * @param {string} elementId - Element ID to print
 */
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Impressão</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Animate counter
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 * @param {number} duration - Duration in ms
 */
function animateCounter(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Export functions to global scope
window.helpers = {
    formatDate,
    formatDateTime,
    formatCurrency,
    formatNumber,
    calculateTimeDifference,
    debounce,
    generateId,
    validateEmail,
    sanitizeHtml,
    copyToClipboard,
    getStatusColor,
    getStatusLabel,
    getStatusIcon,
    getPriorityColor,
    exportToCSV,
    printElement,
    animateCounter
};

console.log('✅ Helper functions loaded');
