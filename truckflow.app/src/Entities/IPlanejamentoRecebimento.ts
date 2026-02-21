import type EntidadeBase from "./IEntidadeBase.ts";
import type IFornecedor from "./fornecedor.types.ts";
import type ItemPlanejamento from "./ItemPlanejamento.ts";

export default interface IPlanejamentoRecebimento extends EntidadeBase {
    fornecedor: IFornecedor;
    fornecedorId: string;
    dataInicio: string;
    statusRecebimento: 'Planejado' | 'EmAndamento' | 'Concluido'
    itemPlanejamentos: ItemPlanejamento[]
}