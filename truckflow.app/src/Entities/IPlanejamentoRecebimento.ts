import type EntidadeBase from "./IEntidadeBase.ts";
import type IFornecedor from "./IFornecedor.ts";
import type ItemPlanejamento from './ItemPlanejamento.ts'

export default interface IPlanejamentoRecebimento extends EntidadeBase {
    fornecedor: IFornecedor;
    fornecedorId: string;
    dataInicio: string;
    statusRecebimento: 'Indefinido' | 'Planejado' | 'EmAndamento' | 'Concluido'
    itemPlanejamentos: ItemPlanejamento[]
}