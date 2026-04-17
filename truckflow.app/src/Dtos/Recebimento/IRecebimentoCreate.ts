import type ItemPlanejamentoCreate from "../Item/ItemPlanejamentoCreate";

export default interface IRecebimentoCreate {
    fornecedorId: string;
    dataInicio: string | null;
    dataFim: string | null;
    itensPlanejamento: ItemPlanejamentoCreate[];
}
