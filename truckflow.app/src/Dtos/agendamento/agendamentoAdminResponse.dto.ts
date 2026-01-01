export default interface AgendamentoAdminResponse {
    id: string;
    fornecedorNome: string;
    motoristaNome?: string;
    produto: string;
    unidadeEntrega: string;
    status: string;
    dataInicio: string;
    dataFim: string,
    placaVeiculo?: string;
    pesoCarga?: number;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}