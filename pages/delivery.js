// Página: Entrega de Ordem (COMPLETA)
async function renderDeliveryPage() {
    const orders = await ordersModule.fetchAll();
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    return `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold">Entrega de Ordem</h2>
                    <p class="text-slate-400 mt-1">${completedOrders.length} ordens concluídas para entrega</p>
                </div>
                <button onclick="scheduleDelivery()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2">
                    <span class="material-symbols-rounded">local_shipping</span>
                    Agendar Entrega
                </button>
            </div>

            <!-- Timeline de Entregas -->
            <div class="bg-slate-800 rounded-2xl p-6 mb-6">
                <h3 class="text-lg font-bold mb-6">Timeline de Entregas Hoje</h3>
                
                <div class="space-y-6">
                    ${completedOrders.slice(0, 5).map((order, index) => `
                        <div class="flex gap-4">
                            <div class="flex flex-col items-center">
                                <div class="w-10 h-10 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-slate-700'} flex items-center justify-center">
                                    <span class="material-symbols-rounded text-white text-sm">
                                        ${index === 0 ? 'local_shipping' : 'check'}
                                    </span>
                                </div>
                                ${index < completedOrders.length - 1 ? '<div class="w-0.5 h-16 bg-slate-700 mt-2"></div>' : ''}
                            </div>
                            
                            <div class="flex-1 pb-8">
                                <div class="bg-slate-700 rounded-xl p-4">
                                    <div class="flex items-start justify-between mb-2">
                                        <div>
                                            <span class="font-mono text-sm text-blue-400">${order.id}</span>
                                            <h4 class="font-semibold mt-1">${order.client}</h4>
                                        </div>
                                        <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                                            ${index === 0 ? 'Em rota' : 'Agendado'}
                                        </span>
                                    </div>
                                    <p class="text-sm text-slate-400">${order.product}</p>
                                    <div class="flex items-center gap-4 mt-3 text-sm text-slate-400">
                                        <span class="flex items-center gap-1">
                                            <span class="material-symbols-rounded text-sm">schedule</span>
                                            ${new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                        </span>
                                        <button onclick="viewDeliveryDetails('${order.id}')" class="text-blue-400 hover:text-blue-300">
                                            Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Mapa de Entregas (Placeholder) -->
            <div class="bg-slate-800 rounded-2xl p-6">
                <h3 class="text-lg font-bold mb-4">Mapa de Entregas</h3>
                <div class="bg-slate-700 rounded-lg h-96 flex items-center justify-center">
                    <div class="text-center text-slate-400">
                        <span class="material-symbols-rounded text-6xl mb-4 block">map</span>
                        Mapa de entregas em desenvolvimento
                    </div>
                </div>
            </div>
        </div>
    `;
}

function scheduleDelivery() {
    showToast('Agendar entrega - Em desenvolvimento', 'info');
}

function viewDeliveryDetails(orderId) {
    showToast('Detalhes da entrega: ' + orderId, 'info');
}
