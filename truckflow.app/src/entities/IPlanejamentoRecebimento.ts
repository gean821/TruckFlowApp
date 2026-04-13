import type { FornecedorResponse } from "./fornecedor.types.ts";
import type EntidadeBase from "./IEntidadeBase.ts";
import type ItemPlanejamento from "./ItemPlanejamento.ts";

export default interface IPlanejamentoRecebimento extends EntidadeBase {
    fornecedor: FornecedorResponse;
    fornecedorId: string;
    dataInicio: string;
    statusRecebimento: 'Planejado' | 'EmAndamento' | 'Concluido'
    itemPlanejamentos: ItemPlanejamento[]
}