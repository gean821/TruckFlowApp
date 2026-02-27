import type EntidadeBase from "./IEntidadeBase";
import type IProduto from "./produto.types";
import type IPlanejamentoRecebimento from './IPlanejamentoRecebimento'

export default interface ItemPlanejamento extends EntidadeBase {
    produto: IProduto;
    produtoId: string;
    planejamentoRecebimento: IPlanejamentoRecebimento;
    quantidadeTotalPlanejada: number;
    cadenciaDiariaPlanejada: number;
    quantidadeTotalRecebida: number;
    faltaReceber: number;
}