// Supabase Config - FIEL
(function() {
    const SUPABASE_URL = 'https://yngpkgymponqtllviyth.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZ3BrZ3ltcG9ucXRsbHZpeXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODc0NjQsImV4cCI6MjA1OTM2MzQ2NH0.8EBWFVW_7MZGQdpzkqK1xO7yPPtLIOGXMvOLmKGW_m0';
    
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseConfigured = true;
})();
