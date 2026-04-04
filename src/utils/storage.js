// ===================================
// ORDEM PRO SYSTEM - LOCAL STORAGE
// ===================================

const StorageManager = {
    // Keys
    KEYS: {
        ORDERS: 'ordem_pro_orders',
        THEME: 'ordem_pro_theme',
        USER: 'ordem_pro_user',
        SETTINGS: 'ordem_pro_settings'
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Get all orders
     * @returns {Array} Orders array
     */
    getOrders() {
        return this.get(this.KEYS.ORDERS, []);
    },

    /**
     * Save orders
     * @param {Array} orders - Orders array
     * @returns {boolean} Success status
     */
    saveOrders(orders) {
        return this.set(this.KEYS.ORDERS, orders);
    },

    /**
     * Get single order by ID
     * @param {string} orderId - Order ID
     * @returns {Object|null} Order object or null
     */
    getOrder(orderId) {
        const orders = this.getOrders();
        return orders.find(o => o.id === orderId) || null;
    },

    /**
     * Add new order
     * @param {Object} order - Order object
     * @returns {boolean} Success status
     */
    addOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        return this.saveOrders(orders);
    },

    /**
     * Update existing order
     * @param {string} orderId - Order ID
     * @param {Object} updates - Updates object
     * @returns {boolean} Success status
     */
    updateOrder(orderId, updates) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        
        if (index === -1) return false;
        
        orders[index] = { ...orders[index], ...updates };
        return this.saveOrders(orders);
    },

    /**
     * Delete order
     * @param {string} orderId - Order ID
     * @returns {boolean} Success status
     */
    deleteOrder(orderId) {
        const orders = this.getOrders();
        const filtered = orders.filter(o => o.id !== orderId);
        return this.saveOrders(filtered);
    },

    /**
     * Get theme preference
     * @returns {string} Theme ('light' or 'dark')
     */
    getTheme() {
        return this.get(this.KEYS.THEME, 'light');
    },

    /**
     * Save theme preference
     * @param {string} theme - Theme ('light' or 'dark')
     * @returns {boolean} Success status
     */
    saveTheme(theme) {
        return this.set(this.KEYS.THEME, theme);
    },

    /**
     * Get user data
     * @returns {Object|null} User object or null
     */
    getUser() {
        return this.get(this.KEYS.USER, null);
    },

    /**
     * Save user data
     * @param {Object} user - User object
     * @returns {boolean} Success status
     */
    saveUser(user) {
        return this.set(this.KEYS.USER, user);
    },

    /**
     * Clear user data (logout)
     * @returns {boolean} Success status
     */
    clearUser() {
        return this.remove(this.KEYS.USER);
    },

    /**
     * Get settings
     * @returns {Object} Settings object
     */
    getSettings() {
        return this.get(this.KEYS.SETTINGS, {
            notifications: true,
            autoRefresh: true,
            refreshInterval: 30000,
            language: 'pt-BR',
            dateFormat: 'dd/MM/yyyy'
        });
    },

    /**
     * Save settings
     * @param {Object} settings - Settings object
     * @returns {boolean} Success status
     */
    saveSettings(settings) {
        return this.set(this.KEYS.SETTINGS, settings);
    },

    /**
     * Export all data
     * @returns {Object} All stored data
     */
    exportData() {
        return {
            orders: this.getOrders(),
            theme: this.getTheme(),
            user: this.getUser(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Import data
     * @param {Object} data - Data to import
     * @returns {boolean} Success status
     */
    importData(data) {
        try {
            if (data.orders) this.saveOrders(data.orders);
            if (data.theme) this.saveTheme(data.theme);
            if (data.user) this.saveUser(data.user);
            if (data.settings) this.saveSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Export to global scope
window.StorageManager = StorageManager;

console.log('✅ Storage Manager loaded');
