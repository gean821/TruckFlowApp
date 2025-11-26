import type IBloqueio from "@/Entities/IBloqueio";
import http from "@/http/http";

export default class BloqueioService {
     static async GetAll(): Promise<IBloqueio[]> {
        const bloqueio = await http.get('/bloqueio');
        return bloqueio.data;
    }

    static async GetById(id: string): Promise<IBloqueio> {
        const bloqueio = await http.get(`/bloqueio/${id}`);
        return bloqueio.data;
    }

    static async AddBloqueio(bloqueio: IBloqueio): Promise<IBloqueio> {
        const bloqueioAdicionado = await http.post('/bloqueio', bloqueio);
        return bloqueioAdicionado.data;
    }

    static async UpdateBloqueio(id: string, bloqueioAtualizado: IBloqueio): Promise<IBloqueio> {
        const bloqueio = await http.put(`/bloqueio/${id}`, bloqueioAtualizado);
        return bloqueio.data;
    }
    
    static async DeleteBloqueio(id: string): Promise<void> {
        await http.delete(`/bloqueio/${id}`);
    }
    
}
