import type EntidadeBase from "./IEntidadeBase";
import type IProduto from "./IProduto";

export default interface IFornecedor extends EntidadeBase {
    nome: string;
    produtos?: IProduto[];
}