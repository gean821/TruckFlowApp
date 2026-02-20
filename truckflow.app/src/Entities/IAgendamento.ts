import type { StatusAgendamento } from "@/enums/StatusAgendamento";
import type IFornecedor from "./IFornecedor";
import type IGrade from "./IGrade";
import type NotaFiscal from "./INotaFiscal";
import type INotificacoes from "./INotificacoes";
import type UnidadeEntrega from "./unidadeEntrega.types";
import type Usuario from "./IUsuario";
import type { TipoCarga } from "@/enums/TipoCarga";
import type EntidadeBase from "./IEntidadeBase";
import type { TipoVeiculo } from "@/enums/TipoVeiculo";


export default interface IAgendamento extends EntidadeBase{
    grade: IGrade;
    gradeId: string;
    usuario: Usuario;
    usuarioId: string;
    fornecedor: IFornecedor;
    fornecedorId: string;
    tipoCarga: TipoCarga;
    volumeCarga: number;
    dataInicio: string;
    dataFim: string;
    statusAgendamento: StatusAgendamento;
    unidadeEntrega: UnidadeEntrega;
    unidadeEntregaId: string;
    notaFiscal: NotaFiscal;
    notaFiscalId: string;
    notificacoes: INotificacoes[];
    PlacaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo;
}