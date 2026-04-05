// Supabase Configuration
// Adicione este arquivo em: js/supabase-config.js

const SUPABASE_URL = 'https://yngpkgymponqtllviyth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZ3BrZ3ltcG9ucXRsbHZpeXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODc0NjQsImV4cCI6MjA1OTM2MzQ2NH0.8EBWFVW_7MZGQdpzkqK1xO7yPPtLIOGXMvOLmKGW_m0';

// Inicializar cliente Supabase (SEM const para evitar conflito!)
let supabaseClient;

// Aguardar o CDN do Supabase carregar
if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase Client inicializado!');
} else {
    console.error('❌ CDN do Supabase não carregado!');
}

// ============================================
// FUNÇÕES DE ORDENS
// ============================================

async function fetchOrders() {
    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Erro ao buscar ordens:', error);
        return [];
    }
    return data || [];
}

async function createOrder(orderData) {
    const { data, error } = await supabaseClient
        .from('orders')
        .insert([orderData])
        .select();
    
    if (error) {
        console.error('Erro ao criar ordem:', error);
        return { success: false, error };
    }
    
    showToast('Ordem criada com sucesso!', 'success');
    return { success: true, data: data[0] };
}

async function updateOrder(orderId, updates) {
    const { data, error } = await supabaseClient
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select();
    
    if (error) {
        console.error('Erro ao atualizar ordem:', error);
        return { success: false, error };
    }
    
    showToast('Ordem atualizada!', 'success');
    return { success: true, data: data[0] };
}

async function deleteOrder(orderId) {
    const { error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', orderId);
    
    if (error) {
        console.error('Erro ao deletar ordem:', error);
        return { success: false, error };
    }
    
    showToast('Ordem deletada!', 'success');
    return { success: true };
}

// ============================================
// FUNÇÕES DE PRODUTOS
// ============================================

async function fetchProducts() {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });
    
    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
    return data || [];
}

async function createProduct(productData) {
    const { data, error } = await supabaseClient
        .from('products')
        .insert([productData])
        .select();
    
    if (error) {
        console.error('Erro ao criar produto:', error);
        return { success: false, error };
    }
    
    showToast('Produto cadastrado!', 'success');
    return { success: true, data: data[0] };
}

async function updateProductStock(productId, quantity, movementType = 'ADJUSTMENT') {
    // Atualizar estoque
    const { data: product, error: fetchError } = await supabaseClient
        .from('products')
        .select('current_stock')
        .eq('id', productId)
        .single();
    
    if (fetchError) return { success: false, error: fetchError };
    
    const newStock = movementType === 'OUT' 
        ? product.current_stock - quantity 
        : product.current_stock + quantity;
    
    const { error: updateError } = await supabaseClient
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', productId);
    
    if (updateError) return { success: false, error: updateError };
    
    // Registrar movimentação
    await supabaseClient.from('stock_movements').insert([{
        product_id: productId,
        movement_type: movementType,
        quantity: quantity
    }]);
    
    showToast('Estoque atualizado!', 'success');
    return { success: true };
}

// ============================================
// FUNÇÕES DE OPERADORES
// ============================================

async function fetchOperators() {
    const { data, error } = await supabaseClient
        .from('operators')
        .select('*')
        .order('name', { ascending: true });
    
    if (error) {
        console.error('Erro ao buscar operadores:', error);
        return [];
    }
    return data || [];
}

async function createOperator(operatorData) {
    const { data, error } = await supabaseClient
        .from('operators')
        .insert([operatorData])
        .select();
    
    if (error) {
        console.error('Erro ao criar operador:', error);
        return { success: false, error };
    }
    
    showToast('Operador cadastrado!', 'success');
    return { success: true, data: data[0] };
}

// ============================================
// FUNÇÕES DE ENTREGAS
// ============================================

async function createDelivery(deliveryData) {
    const { data, error } = await supabaseClient
        .from('deliveries')
        .insert([deliveryData])
        .select();
    
    if (error) {
        console.error('Erro ao registrar entrega:', error);
        return { success: false, error };
    }
    
    // Atualizar status da ordem para 'delivered'
    await updateOrder(deliveryData.order_id, { status: 'delivered' });
    
    showToast('Entrega registrada!', 'success');
    return { success: true, data: data[0] };
}

async function fetchDeliveries() {
    const { data, error } = await supabaseClient
        .from('deliveries')
        .select(`
            *,
            orders (id, client, product)
        `)
        .order('delivery_date', { ascending: false });
    
    if (error) {
        console.error('Erro ao buscar entregas:', error);
        return [];
    }
    return data || [];
}

// ============================================
// FUNÇÕES DE ITENS DA ORDEM
// ============================================

async function addOrderItem(orderItemData) {
    const { data, error } = await supabaseClient
        .from('order_items')
        .insert([orderItemData])
        .select();
    
    if (error) {
        console.error('Erro ao adicionar item:', error);
        return { success: false, error };
    }
    
    return { success: true, data: data[0] };
}

async function fetchOrderItems(orderId) {
    const { data, error } = await supabaseClient
        .from('order_items')
        .select(`
            *,
            products (code, name, unit)
        `)
        .eq('order_id', orderId);
    
    if (error) {
        console.error('Erro ao buscar itens:', error);
        return [];
    }
    return data || [];
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

function subscribeToOrders(callback) {
    return supabaseClient
        .channel('orders-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'orders' }, 
            (payload) => {
                console.log('Ordem atualizada:', payload);
                if (typeof callback === 'function') {
                    callback(payload);
                }
            }
        )
        .subscribe();
}

// ============================================
// UTILITÁRIOS
// ============================================

function showToast(message, type = 'info') {
    // Implementar notificação visual
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Você pode adicionar uma notificação visual aqui
    // Por exemplo, usando a biblioteca de toast do seu sistema
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

window.supabaseClient = supabaseClient;
window.fetchOrders = fetchOrders;
window.createOrder = createOrder;
window.updateOrder = updateOrder;
window.deleteOrder = deleteOrder;
window.fetchProducts = fetchProducts;
window.createProduct = createProduct;
window.updateProductStock = updateProductStock;
window.fetchOperators = fetchOperators;
window.createOperator = createOperator;
window.createDelivery = createDelivery;
window.fetchDeliveries = fetchDeliveries;
window.addOrderItem = addOrderItem;
window.fetchOrderItems = fetchOrderItems;
window.subscribeToOrders = subscribeToOrders;
window.showToast = showToast;
