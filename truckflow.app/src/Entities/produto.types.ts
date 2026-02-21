import type EntidadeBase from "./IEntidadeBase";

export default interface IProduto extends EntidadeBase {
    nome: string,
    localDescargaId?: string;
}

export type ProdutoCreateDto = {
    nome: string;
    localDescargaId: string;
}

export type ProdutoUpdateDto = {
    nome?: string;
    localDescargaId?: string;
}

export type ProdutoResponse = {
    id: string;
    nome: string;
    localDescarga: string;
    codigoEan?: string;
}

