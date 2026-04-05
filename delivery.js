// Orders Module - FIEL
const ordersModule = {
    async fetchAll() {
        try {
            const { data, error } = await window.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar ordens:', error);
            return [];
        }
    },
    
    async create(orderData) {
        try {
            const { data, error } = await window.supabase
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
    },
    
    async update(id, updates) {
        try {
            const { data, error } = await window.supabase
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
    },
    
    async delete(id) {
        try {
            const { error } = await window.supabase
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
    },
    
    getStats() {
        // Retorna estatísticas mock - será atualizado com dados reais
        return {
            total: 0,
            pending: 0,
            progress: 0,
            completed: 0,
            completedPercent: 0
        };
    }
};
