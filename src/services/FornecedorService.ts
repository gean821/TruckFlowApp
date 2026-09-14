import http from "@/http/http";
import type {
    FornecedorResponse,
    FornecedorCreateDto,
    FornecedorUpdateDto
} from "@/entities/fornecedor.types";

export const FornecedorService = () => {
    const getAll = async () => (await http.get<FornecedorResponse[]>('/Fornecedor')).data;

    const getById = async (id: string) =>
        (await http.get<FornecedorResponse>(`/Fornecedor/${id}`)).data;

    const create = async (payload: FornecedorCreateDto) =>
        (await http.post<FornecedorResponse>('/Fornecedor', payload)).data;

    const update = async (
        id: string,
        payload: FornecedorUpdateDto) =>
        (await http.patch<FornecedorResponse>(`/Fornecedor/${id}`, payload)).data;

    const remove = async (id: string) => await http.delete(`/Fornecedor/${id}`);

    const addProduto = async (
        fornecedorId: string,
        produtoId: string) =>
        (await http.post<FornecedorResponse>(`/Fornecedor/${fornecedorId}/produtos/${produtoId}`)).data;

    const removeProduto = async (
        fornecedorId: string,
        produtoId: string) =>
        (await http.delete<FornecedorResponse>(`/Fornecedor/${fornecedorId}/produtos/${produtoId}`)).data;

    return { getAll, getById, create, update, remove, addProduto, removeProduto };
};