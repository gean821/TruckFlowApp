
import type UnidadeEntregaCreateDto from "@/Dtos/unidadeEntrega/unidadeEntregaCreateDto";
import type UnidadeEntregaUpdateDto from "@/Dtos/unidadeEntrega/UnidadeEntregaUpdateDto";
import type IUnidadeEntrega from "@/entities/IUnidadeEntrega";
import http from "@/http/http";

export default class UnidadeEntregaService {
    static async GetById(id: string): Promise<IUnidadeEntrega> {
        const { data } = await http.get(`/UnidadeEntrega/${id}`);
        return data;
    }

    static async GetAll(): Promise<IUnidadeEntrega[]> {
        const { data } = await http.get('/UnidadeEntrega');
        return data;
    }

    static async AddUnidadeEntrega(UnidadeEntrega: UnidadeEntregaCreateDto): Promise<IUnidadeEntrega> {
        const { data } = await http.post('/UnidadeEntrega', UnidadeEntrega);
        return data;
    }

    static async UpdateUnidadeEntrega(id: string, UnidadeEntregaAtualizado: UnidadeEntregaUpdateDto): Promise<IUnidadeEntrega> {
        const { data } = await http.put(`/UnidadeEntrega/${id}`, UnidadeEntregaAtualizado);
        return data;
    }

    static async DeleteUnidadeEntrega(id: string): Promise<void> {
        await http.delete(`/UnidadeEntrega/${id}`);
    }
}
