import type { StatusAgendamento } from "@/enums/StatusAgendamento";
import type NotaFiscal from "./INotaFiscal";
import type INotificacoes from "./INotificacoes";
import type Usuario from "./IUsuario";
import type { TipoCarga } from "@/enums/TipoCarga";
import type EntidadeBase from "./IEntidadeBase";
import type { TipoVeiculo } from "@/enums/TipoVeiculo";
import type { IGrade } from "./grade.types";
import type { FornecedorResponse } from "./fornecedor.types";
import type { UnidadeEntregaResponse } from "./unidadeEntrega.types";

export default interface IAgendamento extends EntidadeBase{
    grade: IGrade;
    gradeId: string;
    usuario: Usuario;
    usuarioId: string;
    fornecedor: FornecedorResponse;
    fornecedorId: string;
    tipoCarga: TipoCarga;
    volumeCarga: number;
    dataInicio: string;
    dataFim: string;
    statusAgendamento: StatusAgendamento;
    unidadeEntrega: UnidadeEntregaResponse;
    unidadeEntregaId: string;
    notaFiscal: NotaFiscal;
    notaFiscalId: string;
    notificacoes: INotificacoes[];
    PlacaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo;
}