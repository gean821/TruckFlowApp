
import type { MudarStatusUnidadeDto, UnidadeEntregaCreateDto, UnidadeEntregaResponse, UnidadeEntregaUpdateDto } from "@/entities/unidadeEntrega.types";
import http from "@/http/http";

export const UnidadeEntregaService = () => {

    const getById = async (id: string): Promise<UnidadeEntregaResponse> => {
        const { data } = await http.get<UnidadeEntregaResponse>(`/UnidadeEntrega/${id}`);
        return data;
    };

    const getAll = async (): Promise<UnidadeEntregaResponse[]> => {
        const { data } = await http.get<UnidadeEntregaResponse[]>(`/UnidadeEntrega`);
        return data;
    };

    const create = async (
        payload: UnidadeEntregaCreateDto
    ): Promise<UnidadeEntregaResponse> => {
        const { data } = await http.post<UnidadeEntregaResponse>(
            `/UnidadeEntrega`,
            payload
        );
        return data;
    };

    const update = async (
        id: string,
        payload: UnidadeEntregaUpdateDto
    ): Promise<UnidadeEntregaResponse> => {
        const { data } = await http.patch<UnidadeEntregaResponse>(
            `/UnidadeEntrega/${id}`,
            payload
        );
        return data;
    };

    const remove = async (id: string): Promise<void> => {
        await http.delete(`/UnidadeEntrega/${id}`);
    };

    const mudarStatus = async (
        id: string,
        status: MudarStatusUnidadeDto): Promise<UnidadeEntregaResponse> => {
        const {data} = await http.patch(`UnidadeEntrega/${id}/`, status);
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
};