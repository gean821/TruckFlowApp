import type EntidadeBase from "./IEntidadeBase";
import type IFornecedor from "./fornecedor.types";
import type IProduto from "./produto.types";


export default interface IGrade extends EntidadeBase {
    produto: IProduto;
    produtoId: string;
    fornecedor: IFornecedor;
    fornecedorId: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    intervaloMinutos: number;
}