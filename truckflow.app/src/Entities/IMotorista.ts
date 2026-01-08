import type EntidadeBase from "./IEntidadeBase";
import type Usuario from "./IUsuario";
import type Veiculo from "./IVeiculo";

export default interface IMotorista extends EntidadeBase {
    nome: string;
    telefone: string;
    veiculos?: Veiculo[];
    usuario: Usuario;
    usuarioId: string;
}