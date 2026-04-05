// Operators Module - FIEL
const operatorsModule = {
    async fetchAll() {
        try {
            const { data, error } = await window.supabase
                .from('operators')
                .select('*')
                .order('name', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar operadores:', error);
            return [];
        }
    },
    
    async create(operatorData) {
        try {
            const { data, error } = await window.supabase
                .from('operators')
                .insert([operatorData])
                .select();
            
            if (error) throw error;
            showToast('Operador adicionado!', 'success');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao criar operador:', error);
            showToast('Erro ao adicionar operador', 'error');
            return { success: false, error };
        }
    },
    
    async update(id, updates) {
        try {
            const { data, error } = await window.supabase
                .from('operators')
                .update(updates)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            showToast('Operador atualizado!', 'success');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao atualizar operador:', error);
            showToast('Erro ao atualizar operador', 'error');
            return { success: false, error };
        }
    },
    
    getStats() {
        return {
            total: 0,
            active: 0,
            totalOrders: 0
        };
    }
};
