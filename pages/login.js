// Página: Login
function renderLoginPage() {
    return `
        <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div class="w-full max-w-md">
                <div class="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                    <div class="text-center mb-8">
                        <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4">
                            <span class="material-symbols-rounded text-white text-3xl">inventory_2</span>
                        </div>
                        <h1 class="text-2xl font-bold">Controle Pro</h1>
                        <p class="text-slate-400 text-sm mt-2">ENTERPRISE + ZLP</p>
                    </div>
                    
                    <form id="login-form" onsubmit="handleLogin(event)" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <input type="email" id="login-email" required class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" placeholder="seu@email.com">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Senha</label>
                            <input type="password" id="login-password" required class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" placeholder="••••••••">
                        </div>
                        
                        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await auth.login(email, password);
}
