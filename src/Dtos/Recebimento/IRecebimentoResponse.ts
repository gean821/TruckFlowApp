import type ItemPlanejamentoResponse from "../Item/ItemResponseDto";

export default interface IRecebimentoResponse {
    id: string;
    fornecedorId: string;
    fornecedorNome: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    totalItens: number;
    itens: ItemPlanejamentoResponse[];
    createdAt: string;
}
