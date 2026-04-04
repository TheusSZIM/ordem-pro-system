// Módulo de Operadores
class OperatorsModule {
    constructor() {
        this.operators = [];
    }

    // Buscar todos os operadores
    async fetchAll() {
        try {
            const { data, error } = await supabase
                .from('operators')
                .select('*')
                .order('name');

            if (error) throw error;
            
            this.operators = data;
            return data;
        } catch (error) {
            console.error('Erro ao buscar operadores:', error);
            showToast('Erro ao carregar operadores', 'error');
            return [];
        }
    }

    // Buscar operadores ativos
    async fetchActive() {
        try {
            const { data, error } = await supabase
                .from('operators')
                .select('*')
                .eq('active', true)
                .order('name');

            if (error) throw error;
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar operadores ativos:', error);
            return [];
        }
    }

    // Criar operador
    async create(operatorData) {
        try {
            const { data, error } = await supabase
                .from('operators')
                .insert([operatorData])
                .select();

            if (error) throw error;

            showToast('Operador criado com sucesso!', 'success');
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Erro ao criar operador:', error);
            showToast('Erro ao criar operador', 'error');
            return { success: false, error };
        }
    }

    // Atualizar operador
    async update(id, updates) {
        try {
            const { data, error } = await supabase
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
    }

    // Obter estatísticas dos operadores
    getStats() {
        const total = this.operators.length;
        const active = this.operators.filter(op => op.active).length;
        const totalOrders = this.operators.reduce((sum, op) => sum + (op.total_orders || 0), 0);

        return {
            total,
            active,
            inactive: total - active,
            totalOrders,
            avgOrdersPerOperator: active > 0 ? Math.round(totalOrders / active) : 0
        };
    }
}

// Instância global
const operatorsModule = new OperatorsModule();
