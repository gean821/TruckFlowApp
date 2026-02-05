import type IAdministrador from "./IAdministrador";
import type IAgendamento from "./IAgendamento";
import type EntidadeBase from "./IEntidadeBase";
import type IMotorista from "./IMotorista";


export default interface Usuario extends EntidadeBase {
    administrador?: IAdministrador;
    motorista?: IMotorista;
    agendamentos: IAgendamento[]
}