import type { FuncaoAdm } from "@/enums/FuncaoAdm";
import type EntidadeBase from "./IEntidadeBase";
import type Usuario from "./IUsuario";

export default interface IAdministrador extends EntidadeBase {
    nome: string;
    funcaoAdm: FuncaoAdm;
    usuario: Usuario;
    usuarioId: string;
}