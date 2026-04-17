import type { IGrade } from "./grade.types";
import type EntidadeBase from "./IEntidadeBase";
import type { ProdutoResponse } from "./produto.types";


export interface ILocalDescarga extends EntidadeBase {
    nome: string;
    produtos?: ProdutoResponse[]
    grades?: IGrade[];
    unidadeEntregaId: string;
    status?: boolean;
}

export type CreateLocalDescargaDto = {
    nome: string;
    unidadeEntregaId: string;
    status?: boolean;
}

export type UpdateLocalDescargaDto = {
    nome?: string;
    unidadeEntregaId?: string;
    status?: boolean;
}

export type LocalDescargaResponse = {
    id: string;
    nome: string;
    unidadeEntrega: string;
    status?: boolean;
}

export type MudarStatusLocalDto = {
    status?: boolean;
}