// Módulo de Estatísticas
class StatsModule {
    // Atualizar gráficos circulares
    updateProgressRing(percent, circleId, textId) {
        const circumference = 201; // 2 * PI * 32
        const offset = circumference - (percent / 100) * circumference;
        
        const circle = document.getElementById(circleId);
        const text = document.getElementById(textId);
        
        if (circle) {
            circle.style.strokeDashoffset = offset;
        }
        
        if (text) {
            text.textContent = Math.round(percent) + '%';
        }
    }

    // Atualizar todos os cards de estatísticas
    updateStatsCards(stats) {
        // Atualizar números
        const statPending = document.getElementById('stat-pending');
        const statProgress = document.getElementById('stat-progress');
        const statCompleted = document.getElementById('stat-completed');

        if (statPending) statPending.textContent = stats.pending;
        if (statProgress) statProgress.textContent = stats.progress;
        if (statCompleted) statCompleted.textContent = stats.completed;

        // Atualizar gráficos
        this.updateProgressRing(stats.pendingPercent, 'progress-pending', 'percent-pending');
        this.updateProgressRing(stats.progressPercent, 'progress-progress', 'percent-progress');
        this.updateProgressRing(stats.completedPercent, 'progress-completed', 'percent-completed');
    }

    // Gerar dados para gráfico
    generateChartData(orders) {
        const statusCount = {
            pending: 0,
            progress: 0,
            completed: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            if (statusCount.hasOwnProperty(order.status)) {
                statusCount[order.status]++;
            }
        });

        return {
            labels: ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada'],
            datasets: [{
                data: [
                    statusCount.pending,
                    statusCount.progress,
                    statusCount.completed,
                    statusCount.cancelled
                ],
                backgroundColor: [
                    '#fbbf24', // amber
                    '#3b82f6', // blue
                    '#10b981', // emerald
                    '#ef4444'  // red
                ]
            }]
        };
    }
}

// Instância global
const statsModule = new StatsModule();
