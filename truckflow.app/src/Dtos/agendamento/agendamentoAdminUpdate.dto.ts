import type { TipoCarga } from "@/enums/TipoCarga";

export default interface AgendamentoAdminUpdateDto {
    fornecedorId: string;
    unidadeEntregaId: string;
    dataInicio: string;
    tipoCarga: TipoCarga;
    motoristaId: string;
    notaFiscalId: string;
    volumeCarga: number;
    status?: string;   
}