import type { TipoVeiculo } from "@/enums/TipoVeiculo";

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
    tipoVeiculo?: TipoVeiculo;
    pesoCarga?: number;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}