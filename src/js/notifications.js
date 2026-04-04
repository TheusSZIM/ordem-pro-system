// ===================================
// ORDEM PRO SYSTEM - NOTIFICATIONS
// ===================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found');
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };
    
    toast.innerHTML = `
        <span class="material-symbols-rounded" style="font-size: 24px;">
            ${icons[type] || 'info'}
        </span>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; opacity: 0.7;">
            <span class="material-symbols-rounded" style="font-size: 20px;">close</span>
        </button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show loading toast
 * @param {string} message - Loading message
 * @returns {Object} Toast element with close method
 */
function showLoadingToast(message = 'Carregando...') {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found');
        return null;
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-info';
    toast.innerHTML = `
        <div class="loading-spinner" style="width: 24px; height: 24px; border-width: 2px;"></div>
        <span style="flex: 1;">${message}</span>
    `;
    
    container.appendChild(toast);
    
    return {
        element: toast,
        close: () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        },
        update: (newMessage) => {
            const span = toast.querySelector('span');
            if (span) span.textContent = newMessage;
        }
    };
}

/**
 * Show confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback on confirm
 * @param {Function} onCancel - Callback on cancel
 */
function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in shadow-soft-lg">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span class="material-symbols-rounded text-amber-600 dark:text-amber-500 text-3xl">help</span>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">Confirmação</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${message}</p>
                </div>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button id="cancel-btn" class="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Cancelar
                </button>
                <button id="confirm-btn" class="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                    Confirmar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const confirmBtn = overlay.querySelector('#confirm-btn');
    const cancelBtn = overlay.querySelector('#cancel-btn');
    
    confirmBtn.onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    cancelBtn.onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
}

/**
 * Show alert dialog
 * @param {string} message - Alert message
 * @param {string} type - Alert type (info, success, error, warning)
 * @param {Function} onClose - Callback on close
 */
function showAlert(message, type = 'info', onClose) {
    const icons = {
        info: 'info',
        success: 'check_circle',
        error: 'error',
        warning: 'warning'
    };
    
    const colors = {
        info: 'blue',
        success: 'green',
        error: 'red',
        warning: 'amber'
    };
    
    const color = colors[type] || 'blue';
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in shadow-soft-lg">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center">
                    <span class="material-symbols-rounded text-${color}-600 dark:text-${color}-500 text-3xl">${icons[type]}</span>
                </div>
                <div class="flex-1">
                    <p class="text-slate-900 dark:text-white font-medium">${message}</p>
                </div>
            </div>
            
            <button id="close-btn" class="w-full px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all mt-4">
                Fechar
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const closeBtn = overlay.querySelector('#close-btn');
    closeBtn.onclick = () => {
        overlay.remove();
        if (onClose) onClose();
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onClose) onClose();
        }
    };
}

// Export to global scope
window.showToast = showToast;
window.showLoadingToast = showLoadingToast;
window.showConfirm = showConfirm;
window.showAlert = showAlert;

console.log('✅ Notification system loaded');
