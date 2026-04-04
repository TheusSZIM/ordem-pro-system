// Módulo de Ordens
class OrdersModule {
    constructor() {
        this.orders = [];
    }

    // Buscar todas as ordens
    async fetchAll() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            this.orders = data;
            return data;
        } catch (error) {
            console.error('Erro ao buscar ordens:', error);
            showToast('Erro ao carregar ordens', 'error');
            return [];
        }
    }

    // Criar nova ordem
    async create(orderData) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (error) throw error;

            showToast('Ordem criada com sucesso!', 'success');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao criar ordem:', error);
            showToast('Erro ao criar ordem', 'error');
            return { success: false, error };
        }
    }

    // Atualizar ordem
    async update(id, updates) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;

            showToast('Ordem atualizada!', 'success');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
            showToast('Erro ao atualizar ordem', 'error');
            return { success: false, error };
        }
    }

    // Deletar ordem
    async delete(id) {
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showToast('Ordem deletada!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Erro ao deletar ordem:', error);
            showToast('Erro ao deletar ordem', 'error');
            return { success: false, error };
        }
    }

    // Filtrar por status
    filterByStatus(status) {
        return this.orders.filter(order => order.status === status);
    }

    // Obter estatísticas
    getStats() {
        const total = this.orders.length;
        const pending = this.orders.filter(o => o.status === 'pending').length;
        const progress = this.orders.filter(o => o.status === 'progress').length;
        const completed = this.orders.filter(o => o.status === 'completed').length;

        return {
            total,
            pending,
            progress,
            completed,
            pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0,
            progressPercent: total > 0 ? Math.round((progress / total) * 100) : 0,
            completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

// Instância global
const ordersModule = new OrdersModule();
