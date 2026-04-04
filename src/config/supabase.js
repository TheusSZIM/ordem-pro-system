// Supabase Configuration
// IMPORTANTE: Adicione suas credenciais do Supabase aqui
// Você pode encontrar essas informações em: https://supabase.com/dashboard/project/_/settings/api

const SUPABASE_CONFIG = {
    url: 'https://yngpkgymponqtllviyth.supabase.co', // Substitua com sua URL do projeto
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZ3BrZ3ltcG9ucXRsbHZpeXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMzA0NjQsImV4cCI6MjA5MDkwNjQ2NH0.6AYk-NG6TSSPVfEXBWEhU-KemrIka6ycztPkwxhU5R8', // Substitua com sua chave anônima
};

// Inicializar cliente Supabase
const supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
    : null;

// Verificar se o Supabase foi inicializado corretamente
if (!supabase) {
    console.error('⚠️ Supabase não foi inicializado. Verifique as configurações.');
}

// Exportar configuração e cliente
window.supabaseClient = supabase;
window.supabaseConfig = SUPABASE_CONFIG;

console.log('✅ Configuração do Supabase carregada');
