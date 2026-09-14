import type { TipoVeiculo } from "@/enums/TipoVeiculo";

export default interface IAgendamentoFilterDto {
    dataInicio?: string;
    dataFim?: string;
    fornecedorId?: string;
    unidadeEntregaId?: string;
    produtoId?: string;
    status?: string;
    tipoVeiculo?: TipoVeiculo | number;
    search?: string;
    pageNumber?: number;
    pageSize?: number;
}
