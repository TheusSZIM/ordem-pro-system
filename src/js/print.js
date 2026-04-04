// ===================================
// ORDEM PRO SYSTEM - PRINT MANAGER
// ===================================

const PrintManager = {
    /**
     * Generate ZPL code for label
     */
    generateZPL(order) {
        if (!order) return '';

        const zpl = `
^XA
^FO50,50^A0N,50,50^FD${order.id}^FS
^FO50,120^A0N,30,30^FDCliente: ${order.client || 'N/A'}^FS
^FO50,160^A0N,30,30^FDProduto: ${order.product || 'N/A'}^FS
^FO50,200^A0N,25,25^FDData: ${helpers.formatDate(order.created_at)}^FS
^BY3,3,100
^FO50,250^BC^FD${order.id}^FS
^XZ
        `.trim();

        return zpl;
    },

    /**
     * Print label to ZPL printer
     */
    async printLabel(orderId) {
        const order = OrdersManager.getOrder(orderId);
        if (!order) {
            showToast('Ordem não encontrada', 'error');
            return;
        }

        const zpl = this.generateZPL(order);
        
        try {
            // Tentar enviar para impressora ZPL via API ou Windows Print
            // Este é um exemplo - você precisará configurar baseado na sua impressora
            
            // Opção 1: Via API se disponível
            if (window.ZPLPrinter) {
                await window.ZPLPrinter.print(zpl);
                showToast('Etiqueta enviada para impressora!', 'success');
            }
            // Opção 2: Download como arquivo
            else {
                this.downloadZPL(zpl, `etiqueta_${order.id}.zpl`);
                showToast('Arquivo ZPL baixado!', 'success');
            }
        } catch (error) {
            console.error('Error printing:', error);
            showToast('Erro ao imprimir etiqueta', 'error');
        }
    },

    /**
     * Download ZPL file
     */
    downloadZPL(zpl, filename) {
        const blob = new Blob([zpl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Preview label
     */
    previewLabel(orderId) {
        const order = OrdersManager.getOrder(orderId);
        if (!order) return;

        const zpl = this.generateZPL(order);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full mx-4 animate-scale-in shadow-soft-lg">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">Preview da Etiqueta</h3>
                    <button onclick="this.closest('.modal-overlay').remove()" 
                            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
                
                <div class="bg-slate-100 dark:bg-slate-900 rounded-xl p-8 mb-4">
                    <div class="bg-white p-6 rounded-lg border-2 border-dashed border-slate-300 max-w-md mx-auto">
                        <div class="text-center space-y-4">
                            <div class="text-2xl font-bold font-mono">${order.id}</div>
                            <div class="text-sm">
                                <div><strong>Cliente:</strong> ${order.client || 'N/A'}</div>
                                <div><strong>Produto:</strong> ${order.product || 'N/A'}</div>
                                <div><strong>Data:</strong> ${helpers.formatDate(order.created_at)}</div>
                            </div>
                            <div id="barcode-${orderId}"></div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Código ZPL:
                    </label>
                    <textarea readonly class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono" rows="8">${zpl}</textarea>
                </div>

                <div class="flex gap-3">
                    <button onclick="PrintManager.downloadZPL('${zpl.replace(/'/g, "\\'")}', 'etiqueta_${order.id}.zpl')"
                            class="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                        Download ZPL
                    </button>
                    <button onclick="PrintManager.printLabel('${orderId}'); this.closest('.modal-overlay').remove();"
                            class="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                        <span class="material-symbols-rounded text-sm align-middle">print</span>
                        Imprimir
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Generate barcode
        setTimeout(() => {
            const barcodeElement = document.getElementById(`barcode-${orderId}`);
            if (barcodeElement) {
                JsBarcode(barcodeElement, order.id, {
                    format: 'CODE128',
                    width: 2,
                    height: 60,
                    displayValue: false
                });
            }
        }, 100);
    },

    /**
     * Print order document
     */
    printOrderDocument(orderId) {
        const order = OrdersManager.getOrder(orderId);
        if (!order) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ordem ${order.id}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                    }
                    .section {
                        margin: 20px 0;
                    }
                    .section-title {
                        font-weight: bold;
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .section-content {
                        font-size: 16px;
                        padding: 5px 0;
                    }
                    @media print {
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ORDEM DE SEPARAÇÃO</h1>
                    <h2>${order.id}</h2>
                </div>
                
                <div class="section">
                    <div class="section-title">Cliente:</div>
                    <div class="section-content">${order.client || '-'}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Produto:</div>
                    <div class="section-content">${order.product || '-'}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Status:</div>
                    <div class="section-content">${helpers.getStatusLabel(order.status)}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Data de Criação:</div>
                    <div class="section-content">${helpers.formatDateTime(order.created_at)}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Observações:</div>
                    <div class="section-content">${order.notes || 'Sem observações'}</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
};

// Export to global scope
window.PrintManager = PrintManager;

console.log('✅ Print Manager loaded');
