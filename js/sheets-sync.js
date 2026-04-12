// ============================================
// SHEETS SYNC — js/sheets-sync.js
// Envia ordens para o Google Sheets via webhook
// ============================================

async function syncOrdemParaSheets(ordem, acao = 'inserir') {
    const url = localStorage.getItem('sheets_webhook_url');
    if (!url) return; // não configurado — silencioso

    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao, ordem }),
        });
        console.log(`📊 Sheets sync: ${acao} → ${ordem.id}`);
    } catch (err) {
        console.warn('⚠️ Sheets sync falhou (não crítico):', err.message);
    }
}

function configurarSheetsWebhook(url) {
    localStorage.setItem('sheets_webhook_url', url);
    console.log('✅ Webhook Sheets configurado:', url);
}

window.syncOrdemParaSheets     = syncOrdemParaSheets;
window.configurarSheetsWebhook = configurarSheetsWebhook;

console.log('✅ sheets-sync.js carregado');
