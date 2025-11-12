import type ItemPlanejamentoCreate from "../Item/ItemPlanejamentoCreate";

export default interface IRecebimentoCreate {
    fornecedorId: string;
    dataInicio: Date | null;
    itensPlanejamento: ItemPlanejamentoCreate[];
}