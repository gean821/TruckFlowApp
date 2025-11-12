import type ItemPlanejamento from "@/Entities/ItemPlanejamento";
import type ItemPlanejamentoCreate from "../Item/ItemPlanejamentoCreate";

export default interface IRecebimentoUpdate {
    fornecedorId: string;
    dataInicio: Date | null;
    itensPlanejamento: ItemPlanejamentoCreate[];
}