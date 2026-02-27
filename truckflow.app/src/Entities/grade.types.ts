import type { FornecedorResponse } from "./fornecedor.types";
import type EntidadeBase from "./IEntidadeBase";
import type IProduto from "./produto.types";

export interface IGrade extends EntidadeBase {
    produto: IProduto;
    produtoId: string;
    fornecedor: FornecedorResponse;
    fornecedorId: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    intervaloMinutos: number;
}

export type GradeCreateDto = {
    fornecedorId: string;
    produtoId: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    diasSemana: string;
    intervaloMinutos: number;
    localDescargaId: string;
}

export type GradeResponseDto = {
    id: string;
    fornecedorId: string;
    fornecedor: string;
    produto: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    unidadeEntrega: string;
    localDescarga: string;
    diasSemana: string;
    tempoDuracao: string;
    createdAt: string;
    UpdatedAt?: string | null;
    intervaloMinutos: number;
}

export type GradeUpdateDto = {
    fornecedorId?: string;
    produtoId?: string;
    localDescargaId?: string;
    dataInicio?: string;
    dataFim?: string;
    horaInicial?: string;
    horaFinal?: string;
    intervaloMinutos?: number;
    diasSemana?: string;
}