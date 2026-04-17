import type { CreateLocalDescargaDto, LocalDescargaResponse, MudarStatusLocalDto, UpdateLocalDescargaDto } from "@/entities/localDescarga.types";
import type { MudarStatusUnidadeDto, UnidadeEntregaResponse } from "@/entities/unidadeEntrega.types";
import http from "@/http/http";

export const LocalDescargaService = () => {
    const getAll = async (): Promise<LocalDescargaResponse[]> => {
        const locais = await http.get('/LocalDescarga');
        return locais.data;
    }

    const getById = async (id: string): Promise<LocalDescargaResponse> => {
        const local = await http.get(`/LocalDescarga/${id}`);
        return local.data;
    }

    const create = async (localDescarga: CreateLocalDescargaDto): Promise<LocalDescargaResponse> => {
        const local = await http.post('/LocalDescarga', localDescarga);
        return local.data;
    }

    const update = async (
        id: string,
        localAtualizado: UpdateLocalDescargaDto): Promise<LocalDescargaResponse> => {
        const local = await http.patch(`/LocalDescarga/${id}`, localAtualizado);
        return local.data;
    }

    const remove = async (id: string): Promise<void> => {
        await http.delete(`/LocalDescarga/${id}`);
    }

    const mudarStatus = async (
        id: string,
        status: MudarStatusLocalDto): Promise<LocalDescargaResponse> => {
        const {data} = await http.patch(`/LocalDescarga/${id}/`, status);
        return data;
    }

    return {
        getById,
        getAll,
        create,
        update,
        remove,
        mudarStatus
    };
}
