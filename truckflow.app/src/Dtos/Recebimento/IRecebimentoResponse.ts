import type ItemPlanejamentoResponse from "../Item/ItemResponseDto";

export default interface IRecebimentoResponse {
    id: string;
    fornecedorNome: string;
    dataInicio: string;
    status: string;
    totalItens: number;
    itens: ItemPlanejamentoResponse[];
    createdAt: string;
}
