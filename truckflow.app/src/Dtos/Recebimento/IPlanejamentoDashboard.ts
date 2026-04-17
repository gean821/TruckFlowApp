export interface IPlanejamentoDashboardItem {
    id: string;
    produtoId: string;
    produto: string;
    cadenciaDiariaPlanejada: number;
    toleranciaExtra: number;
    quantidadeTotalPlanejada: number;
    quantidadeTotalRecebida: number;
    faltaReceber: number;
    recebidoNoDia: number;
    faltaNoDia: number;
    operaNoDia: boolean;
    congelado: boolean;
    diasSemana: string;
}

export default interface IPlanejamentoDashboard {
    id: string;
    fornecedorId: string;
    fornecedorNome: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    dataReferencia: string;

    totalDiario: number;
    totalDiarioRecebido: number;
    totalDiarioRestante: number;

    totalPlanejado: number;
    totalRecebido: number;
    totalRestante: number;

    itens: IPlanejamentoDashboardItem[];
}
