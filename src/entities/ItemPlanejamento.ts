import type EntidadeBase from "./IEntidadeBase";
import type IPlanejamentoRecebimento from './IPlanejamentoRecebimento'
import type { ProdutoResponse } from "./produto.types";

export default interface ItemPlanejamento extends EntidadeBase {
    produto: ProdutoResponse;
    produtoId: string;
    planejamentoRecebimento: IPlanejamentoRecebimento;
    quantidadeTotalPlanejada: number;
    cadenciaDiariaPlanejada: number;
    quantidadeTotalRecebida: number;
    faltaReceber: number;
}