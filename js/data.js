// ============================================
// DATA.JS - Integrado com Supabase
// ============================================

// Estado Global da Aplicação
const state = {
    orders: [],
    products: [],
    operators: [],
    deliveries: [],
    currentPage: 'dashboard',
    theme: localStorage.getItem('theme') || 'dark',
    filters: {
        status: '',
        search: '',
        dateRange: ''
    }
};

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================

async function initializeData() {
    console.log('🔄 Carregando dados do Supabase...');
    
    try {
        // Carregar dados em paralelo
        const [orders, products, operators] = await Promise.all([
            fetchOrders(),
            fetchProducts(),
            fetchOperators()
        ]);
        
        state.orders = orders;
        state.products = products;
        state.operators = operators;
        
        console.log('✅ Dados carregados:', {
            ordens: orders.length,
            produtos: products.length,
            operadores: operators.length
        });
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        return false;
    }
}

// ============================================
// FUNÇÕES DE ORDENS
// ============================================

async function loadOrders() {
    state.orders = await fetchOrders();
    return state.orders;
}

async function createNewOrder(orderData) {
    const result = await createOrder(orderData);
    
    if (result.success) {
        state.orders.unshift(result.data);
        return result;
    }
    
    return result;
}

async function updateOrderStatus(orderId, newStatus) {
    const result = await updateOrder(orderId, { status: newStatus });
    
    if (result.success) {
        const index = state.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            state.orders[index] = { ...state.orders[index], ...result.data };
        }
    }
    
    return result;
}

async function deleteOrderById(orderId) {
    const result = await deleteOrder(orderId);
    
    if (result.success) {
        state.orders = state.orders.filter(o => o.id !== orderId);
    }
    
    return result;
}

// ============================================
// FUNÇÕES DE PRODUTOS
// ============================================

async function loadProducts() {
    state.products = await fetchProducts();
    return state.products;
}

async function createNewProduct(productData) {
    const result = await createProduct(productData);
    
    if (result.success) {
        state.products.push(result.data);
    }
    
    return result;
}

async function adjustProductStock(productId, quantity, movementType) {
    const result = await updateProductStock(productId, quantity, movementType);
    
    if (result.success) {
        // Recarregar produtos para ter estoque atualizado
        await loadProducts();
    }
    
    return result;
}

// ============================================
// FUNÇÕES DE OPERADORES
// ============================================

async function loadOperators() {
    state.operators = await fetchOperators();
    return state.operators;
}

async function createNewOperator(operatorData) {
    const result = await createOperator(operatorData);
    
    if (result.success) {
        state.operators.push(result.data);
    }
    
    return result;
}

// ============================================
// FUNÇÕES DE ENTREGAS
// ============================================

async function registerDelivery(deliveryData) {
    const result = await createDelivery(deliveryData);
    
    if (result.success) {
        // Atualizar ordem local
        const orderIndex = state.orders.findIndex(o => o.id === deliveryData.order_id);
        if (orderIndex !== -1) {
            state.orders[orderIndex].status = 'delivered';
        }
    }
    
    return result;
}

async function loadDeliveries() {
    state.deliveries = await fetchDeliveries();
    return state.deliveries;
}

// ============================================
// FUNÇÕES DE FILTRO E BUSCA
// ============================================

function getFilteredOrders() {
    let filtered = [...state.orders];
    
    // Filtro por status
    if (state.filters.status) {
        filtered = filtered.filter(o => o.status === state.filters.status);
    }
    
    // Filtro por busca
    if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(search) ||
            (o.client && o.client.toLowerCase().includes(search)) ||
            (o.product && o.product.toLowerCase().includes(search))
        );
    }
    
    // Filtro por data
    if (state.filters.dateRange) {
        const now = new Date();
        filtered = filtered.filter(o => {
            const orderDate = new Date(o.created_at);
            
            switch(state.filters.dateRange) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return orderDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return orderDate >= monthAgo;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

function getOrdersByStatus(status) {
    return state.orders.filter(o => o.status === status);
}

function getProductsByCategory(category) {
    return state.products.filter(p => p.category === category);
}

function getLowStockProducts() {
    return state.products.filter(p => p.current_stock <= p.min_stock);
}

// ============================================
// FUNÇÕES DE ESTATÍSTICAS
// ============================================

function getOrdersStats() {
    const total = state.orders.length;
    const pending = state.orders.filter(o => o.status === 'pending').length;
    const progress = state.orders.filter(o => o.status === 'progress').length;
    const completed = state.orders.filter(o => o.status === 'completed').length;
    const delivered = state.orders.filter(o => o.status === 'delivered').length;
    
    return {
        total,
        pending,
        progress,
        completed,
        delivered,
        completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

function getProductsStats() {
    const total = state.products.length;
    const lowStock = getLowStockProducts().length;
    const outOfStock = state.products.filter(p => p.current_stock === 0).length;
    
    return {
        total,
        lowStock,
        outOfStock,
        categories: [...new Set(state.products.map(p => p.category))]
    };
}

function getOperatorsStats() {
    const total = state.operators.length;
    const active = state.operators.filter(o => o.active).length;
    const totalOrders = state.operators.reduce((sum, op) => sum + (op.total_orders || 0), 0);
    
    return {
        total,
        active,
        inactive: total - active,
        totalOrders
    };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getOrderById(orderId) {
    return state.orders.find(o => o.id === orderId);
}

function getProductById(productId) {
    return state.products.find(p => p.id === productId);
}

function getOperatorById(operatorId) {
    return state.operators.find(o => o.id === operatorId);
}

// ============================================
// REAL-TIME UPDATES (Opcional)
// ============================================

function enableRealTimeUpdates() {
    // Escutar mudanças nas ordens
    subscribeToOrders(async (payload) => {
        console.log('📡 Atualização em tempo real:', payload);
        
        switch(payload.eventType) {
            case 'INSERT':
                state.orders.unshift(payload.new);
                break;
            case 'UPDATE':
                const index = state.orders.findIndex(o => o.id === payload.new.id);
                if (index !== -1) {
                    state.orders[index] = payload.new;
                }
                break;
            case 'DELETE':
                state.orders = state.orders.filter(o => o.id !== payload.old.id);
                break;
        }
        
        // Recarregar visualização se necessário
        if (typeof renderRecentOrders === 'function') {
            renderRecentOrders();
        }
    });
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

// Inicializar dados quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeData();
    });
} else {
    initializeData();
}

// Disponibilizar globalmente
window.state = state;
window.loadOrders = loadOrders;
window.createNewOrder = createNewOrder;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrderById = deleteOrderById;
window.loadProducts = loadProducts;
window.createNewProduct = createNewProduct;
window.adjustProductStock = adjustProductStock;
window.loadOperators = loadOperators;
window.createNewOperator = createNewOperator;
window.registerDelivery = registerDelivery;
window.loadDeliveries = loadDeliveries;
window.getFilteredOrders = getFilteredOrders;
window.getOrdersByStatus = getOrdersByStatus;
window.getOrdersStats = getOrdersStats;
window.getProductsStats = getProductsStats;
window.getOperatorsStats = getOperatorsStats;
window.getOrderById = getOrderById;
window.enableRealTimeUpdates = enableRealTimeUpdates;
