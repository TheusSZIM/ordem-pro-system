// Stats Module - FIEL
const statsModule = {
    async getDashboardStats() {
        const orders = await ordersModule.fetchAll();
        
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            progress: orders.filter(o => o.status === 'progress').length,
            completed: orders.filter(o => o.status === 'completed').length,
        };
    }
};
