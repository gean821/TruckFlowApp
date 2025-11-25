export default interface ItemPlanejamentoResponse {
    id: string;
    produto: string;
    fornecedor: string;
    quantidadeTotalPlanejada: number;
    cadenciaDiariaPlanejada: number;
    quantidadeTotalRecebida: number;
    faltaReceber: number;
    createdAt: string;
}
