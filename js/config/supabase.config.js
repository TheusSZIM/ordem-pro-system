// Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://yngpkgymponqtllviyth.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZ3BrZ3ltcG9ucXRsbHZpeXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODc0NjQsImV4cCI6MjA1OTM2MzQ2NH0.8EBWFVW_7MZGQdpzkqK1xO7yPPtLIOGXMvOLmKGW_m0'
};

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
