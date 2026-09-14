import type EntidadeBase from "./IEntidadeBase";

export interface UnidadeEntregaResponse extends EntidadeBase {
    nome: string;
    localizacao: string;

    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;

    empresa?: string;

    latitude?: number;
    longitude?: number;
    ativa?: boolean;
}

export interface UnidadeEntregaCreateDto {
    nome: string;
    localizacao: string;

    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;

    latitude?: number;
    longitude?: number;
    ativa?: boolean;
}

export interface UnidadeEntregaUpdateDto {
    nome?: string;
    localizacao?: string;

    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;

    latitude?: number;
    longitude?: number;
    ativa?: boolean;

}

export interface MudarStatusUnidadeDto {
    status: boolean;
}