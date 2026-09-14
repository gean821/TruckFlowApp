import type { ProdutoCreateDto, ProdutoResponse, ProdutoUpdateDto } from "@/entities/produto.types";
import http from "@/http/http";

export const ProdutoService = () => {
    const getAll = async (): Promise<ProdutoResponse[]> => {
        const produtos = await http.get('/Produto');
        return produtos.data;
    }

    const getById = async (id: string): Promise<ProdutoResponse> => {
        const local = await http.get(`/Produto/${id}`);
        return local.data;
    }

    const addProduto = async (dto: ProdutoCreateDto): Promise<ProdutoResponse> => {
        const produto = await http.post('/Produto', dto);
        return produto.data;
    }

    const updateProduto = async (
        id: string,
        dto: ProdutoUpdateDto
    ): Promise<ProdutoResponse> => {
        const produto = await http.patch(`/Produto/${id}`, dto);
        return produto.data;
    }

    const remove = async (id: string): Promise<void> => {
        await http.delete(`/Produto/${id}`);
    }

    return {
        addProduto,
        getAll,
        getById,
        remove,
        updateProduto
    }
}
