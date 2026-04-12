import type { TipoCarga } from "@/enums/TipoCarga";
import type { TipoVeiculo } from "@/enums/TipoVeiculo";

export default interface CreateAgendamentoAdminDto {
    fornecedorId: string;
    produtoId: string;
    localDescargaId: string;
    dataInicio: string;
    dataFim: string;
    tipoCarga: TipoCarga;
    motoristaId: string | undefined;
    notaFiscalId: string | undefined;
    volumeCarga: number;
    placaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo | undefined;
}