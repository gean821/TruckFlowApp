import type EntidadeBase from "./IEntidadeBase";
import type Usuario from "./IUsuario";

export default interface IAdministrador extends EntidadeBase {
    nome: string;
    usuario: Usuario;
    usuarioId: string;
}