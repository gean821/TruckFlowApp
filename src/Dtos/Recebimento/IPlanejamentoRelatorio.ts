export interface IPlanejamentoRelatorioItem {
    id: string;
    produto: string;
    quantidadeTotalPlanejada: number;
    quantidadeTotalRecebida: number;
    faltaReceber: number;
    percentualAtingido: number;
    diasSemana: string;
}

export interface IPlanejamentoRelatorioEvento {
    id: string;
    agendamentoId: string | null;
    produto: string;
    dataRecebimento: string;
    quantidade: number;
    observacao: string | null;
}

export default interface IPlanejamentoRelatorio {
    id: string;
    fornecedorNome: string;
    dataInicio: string;
    dataFim: string;
    status: string;

    totalPlanejado: number;
    totalRecebido: number;
    totalRestante: number;
    percentualAtingido: number;

    itens: IPlanejamentoRelatorioItem[];
    eventos: IPlanejamentoRelatorioEvento[];
}
