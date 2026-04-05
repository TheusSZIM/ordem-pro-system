/* ============================================
   CONTROLE DE ORDENS PRO - DADOS E ESTADO
   ============================================ */

// Estado Global
const state = {
    theme: localStorage.getItem('theme') || 'light',
    currentPage: 'dashboard',
    currentOrdensTab: 'pending',
    ordensSearchTerm: ''
};

// Mapeamento de Status
const statusMap = {
    'pending': { 
        label: 'Pendente Separação', 
        color: 'amber', 
        bg: 'bg-amber-100 dark:bg-amber-900/30', 
        text: 'text-amber-700 dark:text-amber-400' 
    },
    'progress': { 
        label: 'Em Separação', 
        color: 'blue', 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400' 
    },
    'completed': { 
        label: 'Ordem Pronta', 
        color: 'emerald', 
        bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
        text: 'text-emerald-700 dark:text-emerald-400' 
    },
    'delivered': { 
        label: 'Entregue', 
        color: 'violet', 
        bg: 'bg-violet-100 dark:bg-violet-900/30', 
        text: 'text-violet-700 dark:text-violet-400' 
    }
};

// Dados das Ordens
let ordensDetalhadas = [
    { 
        id: 'ORD-2024-001', 
        product: 'TX-900 Industrial Sensor', 
        status: 'completed', 
        qty: 100, 
        operator: 'Marcos Vieira',
        celula: 'Linha A - Estação 3',
        tipoEmbalagem: 'Montadora',
        dataInicio: '2024-04-03',
        horaInicio: '08:30',
        dataPrevista: '2024-04-05',
        separador: 'Marcos Vieira',
        inicioSeparacao: '2024-04-03 08:30',
        fimSeparacao: '2024-04-03 14:45',
        tempoTotal: '6h 15min',
        observacoes: 'Ordem priorizada devido à urgência da linha de montagem.',
        volumes: 3,
        cliente: 'Metalúrgica Silva LTDA',
        destino: 'Curitiba - PR',
        componentes: [
            { codigo: 'TX-900-01', descricao: 'Sensor Principal', qtd: 100, faltante: 0 },
            { codigo: 'TX-900-02', descricao: 'Cabo Conector', qtd: 100, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-002', 
        product: 'Válvula de Controle X2', 
        status: 'completed', 
        qty: 75, 
        operator: 'Ana Silva',
        celula: 'Linha B - Estação 1',
        tipoEmbalagem: 'Reposição',
        reposicaoTipo: 'Caixa 34 - 486 Peças',
        dataInicio: '2024-04-03',
        horaInicio: '09:15',
        dataPrevista: '2024-04-06',
        separador: 'Ana Silva',
        inicioSeparacao: '2024-04-03 09:15',
        fimSeparacao: '2024-04-03 16:20',
        tempoTotal: '7h 05min',
        observacoes: 'Reposição de estoque conforme solicitação.',
        volumes: 2,
        cliente: 'Construções ABC S.A.',
        destino: 'São Paulo - SP',
        componentes: [
            { codigo: 'VL-X2-01', descricao: 'Corpo da Válvula', qtd: 75, faltante: 0 },
            { codigo: 'VL-X2-02', descricao: 'Diafragma', qtd: 75, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-003', 
        product: 'Sensor de Pressão P5', 
        status: 'completed', 
        qty: 200, 
        operator: 'João Pereira',
        celula: 'Linha C - Estação 2',
        tipoEmbalagem: 'Montadora',
        dataInicio: '2024-04-02',
        horaInicio: '07:45',
        dataPrevista: '2024-04-04',
        separador: 'João Pereira',
        inicioSeparacao: '2024-04-02 07:45',
        fimSeparacao: '2024-04-02 18:30',
        tempoTotal: '10h 45min',
        observacoes: 'Grande volume, requeriu atenção especial na conferência.',
        volumes: 5,
        cliente: 'Indústria Petroquímica Ltda',
        destino: 'Rio de Janeiro - RJ',
        componentes: [
            { codigo: 'P5-MAIN', descricao: 'Sensor Pressão', qtd: 200, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-004', 
        product: 'Módulo Hidráulico V3', 
        status: 'pending', 
        qty: 50, 
        operator: 'Marcos Vieira',
        celula: 'Linha A - Estação 5',
        tipoEmbalagem: 'Montadora',
        dataInicio: null,
        horaInicio: null,
        dataPrevista: '2024-04-07',
        separador: null,
        inicioSeparacao: null,
        fimSeparacao: null,
        tempoTotal: null,
        observacoes: 'Aguardando liberação de material do almoxarifado.',
        volumes: 1,
        cliente: 'Metalúrgica Silva LTDA',
        destino: 'Curitiba - PR',
        componentes: [
            { codigo: 'HYD-V3', descricao: 'Módulo Hidráulico', qtd: 50, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-005', 
        product: 'Conjunto Pneumático A1', 
        status: 'progress', 
        qty: 25, 
        operator: 'Carlos Mendes',
        celula: 'Linha D - Estação 1',
        tipoEmbalagem: 'Reposição',
        reposicaoTipo: 'Caixa 34 - 144 Peças',
        dataInicio: '2024-04-03',
        horaInicio: '14:20',
        dataPrevista: '2024-04-05',
        separador: 'Carlos Mendes',
        inicioSeparacao: '2024-04-03 14:20',
        fimSeparacao: null,
        tempoTotal: 'Em andamento',
        observacoes: 'Separação iniciada, prevista conclusão em 2 horas.',
        volumes: 1,
        cliente: 'Automação Industrial ME',
        destino: 'Belo Horizonte - MG',
        componentes: [
            { codigo: 'PNEU-A1', descricao: 'Conjunto Pneumático', qtd: 25, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-006', 
        product: 'Atuador Linear L2', 
        status: 'delivered', 
        qty: 150, 
        operator: 'Ana Silva',
        celula: 'Linha B - Estação 3',
        tipoEmbalagem: 'Montadora',
        dataInicio: '2024-04-01',
        horaInicio: '08:00',
        dataPrevista: '2024-04-03',
        separador: 'Ana Silva',
        inicioSeparacao: '2024-04-01 08:00',
        fimSeparacao: '2024-04-01 15:30',
        tempoTotal: '7h 30min',
        dataEntrega: '2024-04-03 09:15',
        responsavelEntrega: 'Transportadora XYZ',
        observacoes: 'Entrega realizada com sucesso. Documentação assinada.',
        volumes: 3,
        cliente: 'Construções ABC S.A.',
        destino: 'São Paulo - SP',
        componentes: [
            { codigo: 'AT-L2', descricao: 'Atuador Linear', qtd: 150, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-007', 
        product: 'Válvula Solenoide S8', 
        status: 'pending', 
        qty: 80, 
        operator: 'João Pereira',
        celula: 'Linha C - Estação 4',
        tipoEmbalagem: 'Reposição',
        reposicaoTipo: 'Embalamento',
        dataInicio: null,
        horaInicio: null,
        dataPrevista: '2024-04-08',
        separador: null,
        inicioSeparacao: null,
        fimSeparacao: null,
        tempoTotal: null,
        observacoes: 'Aguardando aprovação do supervisor.',
        prioridade: true,
        volumes: 2,
        cliente: 'Indústria Petroquímica Ltda',
        destino: 'Rio de Janeiro - RJ',
        componentes: [
            { codigo: 'SOL-S8', descricao: 'Válvula Solenoide', qtd: 80, faltante: 0 }
        ]
    },
    { 
        id: 'ORD-2024-008', 
        product: 'Cilindro Pneumático C5', 
        status: 'progress', 
        qty: 120, 
        operator: 'Marcos Vieira',
        celula: 'Linha A - Estação 2',
        tipoEmbalagem: 'Montadora',
        dataInicio: '2024-04-03',
        horaInicio: '10:00',
        dataPrevista: '2024-04-06',
        separador: 'Marcos Vieira',
        inicioSeparacao: '2024-04-03 10:00',
        fimSeparacao: null,
        tempoTotal: 'Em andamento',
        observacoes: '50% concluído. Continuação no próximo turno.',
        volumes: 4,
        cliente: 'Automação Industrial ME',
        destino: 'Belo Horizonte - MG',
        componentes: [
            { codigo: 'CIL-C5', descricao: 'Cilindro Pneumático', qtd: 120, faltante: 0 }
        ]
    }
];

// Variáveis do Sistema de Finalização
let currentFinalizacaoOrdem = null;
let finalizacaoState = {
    ordemCompleta: null,
    embalagemSeparada: null,
    itensFaltantes: []
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { state, statusMap, ordensDetalhadas, currentFinalizacaoOrdem, finalizacaoState };
}
