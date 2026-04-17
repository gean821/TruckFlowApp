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
    localDescargaId: string;
    codigoEan?: string;
}

