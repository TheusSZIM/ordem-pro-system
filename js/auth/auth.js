// Sistema de Autenticação
class Auth {
    constructor() {
        this.currentUser = null;
        this.checkAuth();
    }

    // Verificar se usuário está autenticado
    async checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            this.currentUser = session.user;
            return true;
        }
        
        // Redirecionar para login se não autenticado
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login') && currentPage !== '/') {
            this.showLoginPage();
        }
        
        return false;
    }

    // Login
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            showToast('Login realizado com sucesso!', 'success');
            
            // Redirecionar para dashboard
            window.location.href = '/';
            
            return { success: true };
        } catch (error) {
            console.error('Erro no login:', error);
            showToast('Erro ao fazer login: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Logout
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            this.currentUser = null;
            showToast('Logout realizado com sucesso!', 'success');
            this.showLoginPage();
            
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
            showToast('Erro ao fazer logout: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Registrar usuário
    async register(email, password, userData) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;

            showToast('Usuário registrado com sucesso!', 'success');
            return { success: true, data };
        } catch (error) {
            console.error('Erro no registro:', error);
            showToast('Erro ao registrar: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Mostrar página de login
    showLoginPage() {
        const app = document.getElementById('app');
        if (app && typeof renderLoginPage === 'function') {
            renderLoginPage();
        }
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Instância global
const auth = new Auth();
