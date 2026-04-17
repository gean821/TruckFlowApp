export type StatusRecebimento =
    | 'Planejado'
    | 'EmAndamento'
    | 'Concluido'
    | 'Encerrado';

export default interface IPlanejamentoListQuery {
    pageNumber: number;
    pageSize: number;
    fornecedorId?: string;
    produtoId?: string;
    status?: StatusRecebimento;
    dataInicio?: string;
    dataFim?: string;
    search?: string;
}
