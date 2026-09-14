import type ItemPlanejamentoUpdate from "../Item/ItemPlanejamentoUpdate";

export default interface IRecebimentoUpdate {
    fornecedorId: string;
    dataInicio: string | null;
    dataFim: string | null;
    itensPlanejamento: ItemPlanejamentoUpdate[];
}
