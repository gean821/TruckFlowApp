import type IAgendamento from "./IAgendamento";

export default interface INotificacoes {
    descricao: string;
    agendamento: IAgendamento;
    agendamentoId: string;
}