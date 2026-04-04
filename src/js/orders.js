// ===================================
// ORDEM PRO SYSTEM - ORDERS MANAGER
// ===================================

const OrdersManager = {
    orders: [],
    currentFilter: 'all',
    currentSort: 'newest',

    /**
     * Initialize orders manager
     */
    async init() {
        await this.loadOrders();
        this.setupEventListeners();
    },

    /**
     * Load orders from Supabase or localStorage
     */
    async loadOrders() {
        try {
            if (window.supabaseClient) {
                // Load from Supabase
                const { data, error } = await window.supabaseClient
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                this.orders = data || [];
                StorageManager.saveOrders(this.orders); // Backup to localStorage
            } else {
                // Fallback to localStorage
                this.orders = StorageManager.getOrders();
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.orders = StorageManager.getOrders(); // Fallback
            showToast('Erro ao carregar ordens. Usando dados locais.', 'warning');
        }
    },

    /**
     * Create new order
     */
    async createOrder(orderData) {
        try {
            const newOrder = {
                id: helpers.generateId(),
                ...orderData,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from('orders')
                    .insert([newOrder])
                    .select();

                if (error) throw error;
                
                this.orders.unshift(data[0]);
            } else {
                this.orders.unshift(newOrder);
                StorageManager.saveOrders(this.orders);
            }

            showToast('Ordem criada com sucesso!', 'success');
            this.render();
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            showToast('Erro ao criar ordem', 'error');
            return null;
        }
    },

    /**
     * Update order
     */
    async updateOrder(orderId, updates) {
        try {
            const updatedData = {
                ...updates,
                updated_at: new Date().toISOString()
            };

            if (window.supabaseClient) {
                const { error } = await window.supabaseClient
                    .from('orders')
                    .update(updatedData)
                    .eq('id', orderId);

                if (error) throw error;
            }

            const index = this.orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                this.orders[index] = { ...this.orders[index], ...updatedData };
                StorageManager.saveOrders(this.orders);
            }

            showToast('Ordem atualizada!', 'success');
            this.render();
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            showToast('Erro ao atualizar ordem', 'error');
            return false;
        }
    },

    /**
     * Delete order
     */
    async deleteOrder(orderId) {
        try {
            if (window.supabaseClient) {
                const { error } = await window.supabaseClient
                    .from('orders')
                    .delete()
                    .eq('id', orderId);

                if (error) throw error;
            }

            this.orders = this.orders.filter(o => o.id !== orderId);
            StorageManager.saveOrders(this.orders);

            showToast('Ordem excluída!', 'success');
            this.render();
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            showToast('Erro ao excluir ordem', 'error');
            return false;
        }
    },

    /**
     * Get order by ID
     */
    getOrder(orderId) {
        return this.orders.find(o => o.id === orderId);
    },

    /**
     * Filter orders
     */
    filterOrders(filter) {
        this.currentFilter = filter;
        this.render();
    },

    /**
     * Sort orders
     */
    sortOrders(sortBy) {
        this.currentSort = sortBy;
        this.render();
    },

    /**
     * Get filtered and sorted orders
     */
    getFilteredOrders() {
        let filtered = [...this.orders];

        // Apply filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(o => o.status === this.currentFilter);
        }

        // Apply sort
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'priority':
                    const priorities = { high: 3, medium: 2, low: 1 };
                    return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    },

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.orders.length,
            pending: this.orders.filter(o => o.status === 'pending').length,
            progress: this.orders.filter(o => o.status === 'progress').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length
        };
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterOrders(filter);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortOrders(e.target.value);
            });
        }
    },

    /**
     * Render orders table
     */
    render() {
        const container = document.getElementById('orders-table-body');
        if (!container) return;

        const orders = this.getFilteredOrders();
        
        if (orders.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-slate-500">
                        <span class="material-symbols-rounded text-6xl mb-4 opacity-30">inventory_2</span>
                        <p class="text-lg font-medium">Nenhuma ordem encontrada</p>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onclick="OrdersManager.viewOrder('${order.id}')">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-mono text-sm font-semibold text-primary-600 dark:text-primary-400">
                        ${order.id}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-slate-900 dark:text-white">${order.product || '-'}</div>
                    <div class="text-sm text-slate-500">${order.client || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${helpers.getStatusColor(order.status)}">
                        <span class="material-symbols-rounded text-sm">${helpers.getStatusIcon(order.status)}</span>
                        ${helpers.getStatusLabel(order.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    ${helpers.formatDateTime(order.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center gap-2 justify-end">
                        <button onclick="event.stopPropagation(); OrdersManager.editOrder('${order.id}')"
                                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <span class="material-symbols-rounded text-slate-600 dark:text-slate-400">edit</span>
                        </button>
                        <button onclick="event.stopPropagation(); OrdersManager.deleteOrderConfirm('${order.id}')"
                                class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <span class="material-symbols-rounded text-red-600">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    /**
     * View order details
     */
    viewOrder(orderId) {
        const order = this.getOrder(orderId);
        if (!order) return;

        // Implementar modal de visualização
        console.log('View order:', order);
    },

    /**
     * Edit order
     */
    editOrder(orderId) {
        const order = this.getOrder(orderId);
        if (!order) return;

        // Implementar modal de edição
        console.log('Edit order:', order);
    },

    /**
     * Delete order with confirmation
     */
    deleteOrderConfirm(orderId) {
        showConfirm(
            'Tem certeza que deseja excluir esta ordem?',
            () => this.deleteOrder(orderId)
        );
    }
};

// Export to global scope
window.OrdersManager = OrdersManager;

console.log('✅ Orders Manager loaded');
