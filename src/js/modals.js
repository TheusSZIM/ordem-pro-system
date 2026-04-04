// ===================================
// ORDEM PRO SYSTEM - MODALS MANAGER
// ===================================

const ModalsManager = {
    /**
     * Show new order modal
     */
    showNewOrderModal() {
        const modal = document.createElement('div');
        modal.id = 'new-order-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full mx-4 animate-scale-in shadow-soft-lg max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Nova Ordem</h2>
                    <button onclick="ModalsManager.close()" 
                            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form id="new-order-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Cliente *
                            </label>
                            <input type="text" name="client" required
                                   class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 transition-colors">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Produto *
                            </label>
                            <input type="text" name="product" required
                                   class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 transition-colors">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Quantidade
                            </label>
                            <input type="number" name="quantity" min="1" value="1"
                                   class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 transition-colors">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Prioridade
                            </label>
                            <select name="priority"
                                    class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 transition-colors">
                                <option value="low">Baixa</option>
                                <option value="medium" selected>Média</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Observações
                        </label>
                        <textarea name="notes" rows="4"
                                  class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 transition-colors"></textarea>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="ModalsManager.close()"
                                class="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Cancelar
                        </button>
                        <button type="submit"
                                class="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                            Criar Ordem
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = document.getElementById('new-order-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const orderData = Object.fromEntries(formData.entries());
            
            await OrdersManager.createOrder(orderData);
            ModalsManager.close();
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ModalsManager.close();
            }
        });
    },

    /**
     * Show order details modal
     */
    showOrderDetailsModal(orderId) {
        const order = OrdersManager.getOrder(orderId);
        if (!order) return;

        const modal = document.createElement('div');
        modal.id = 'order-details-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-3xl w-full mx-4 animate-scale-in shadow-soft-lg max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Detalhes da Ordem</h2>
                    <button onclick="ModalsManager.close()" 
                            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Order Header -->
                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <div>
                            <div class="text-sm text-slate-600 dark:text-slate-400">ID da Ordem</div>
                            <div class="text-xl font-mono font-bold text-primary-600 dark:text-primary-400">${order.id}</div>
                        </div>
                        <span class="status-badge ${helpers.getStatusColor(order.status)}">
                            <span class="material-symbols-rounded text-sm">${helpers.getStatusIcon(order.status)}</span>
                            ${helpers.getStatusLabel(order.status)}
                        </span>
                    </div>

                    <!-- Order Details -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Cliente</div>
                            <div class="text-lg font-medium">${order.client || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Produto</div>
                            <div class="text-lg font-medium">${order.product || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Quantidade</div>
                            <div class="text-lg font-medium">${order.quantity || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Prioridade</div>
                            <div class="text-lg font-medium capitalize ${helpers.getPriorityColor(order.priority)}">
                                ${order.priority || '-'}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Criada em</div>
                            <div class="text-lg font-medium">${helpers.formatDateTime(order.created_at)}</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Atualizada em</div>
                            <div class="text-lg font-medium">${helpers.formatDateTime(order.updated_at)}</div>
                        </div>
                    </div>

                    ${order.notes ? `
                        <div>
                            <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Observações</div>
                            <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">${order.notes}</div>
                        </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="flex gap-3 pt-4 border-t dark:border-slate-700">
                        <button onclick="PrintManager.previewLabel('${order.id}')"
                                class="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <span class="material-symbols-rounded text-sm align-middle">print</span>
                            Imprimir Etiqueta
                        </button>
                        <button onclick="PrintManager.printOrderDocument('${order.id}')"
                                class="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                            <span class="material-symbols-rounded text-sm align-middle">description</span>
                            Imprimir Documento
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ModalsManager.close();
            }
        });
    },

    /**
     * Close current modal
     */
    close() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }
};

// Export to global scope
window.ModalsManager = ModalsManager;

console.log('✅ Modals Manager loaded');
