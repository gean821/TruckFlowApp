import type EntidadeBase from "./IEntidadeBase";
import type { ProdutoResponse } from "./produto.types";

export interface FornecedorResponse extends EntidadeBase {
    nome: string;
    cnpj: string;
    produtos?: ProdutoResponse[];
}

export interface FornecedorCreateDto {
    nome: string;
    cnpj: string;
    produtoIds?: string[];
}

export interface FornecedorUpdateDto {
    nome: string;
    cnpj: string;
    produtoId?: string;
}

export interface MudarStatusFornecedorDto {
    status: boolean;
}