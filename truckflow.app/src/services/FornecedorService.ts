import type IFornecedor from "@/Entities/IFornecedor";
import http from "@/http/http";

export default class FornecedorService {
    static async GetAll(): Promise<IFornecedor[]> {
        const fornecedores = await http.get('/Fornecedor');
        return fornecedores.data;
    }

    static async GetById(id: string): Promise<IFornecedor> {
        const fornecedor = await http.get(`/Fornecedor/${id}`);
        return fornecedor.data;
    }

    static async AddFornecedor(Fornecedor: IFornecedor): Promise<IFornecedor> {
        const fornecedor = await http.post('/Fornecedor', Fornecedor);
        return fornecedor.data;
    }

    static async UpdateFornecedor(id: string, fornecedorAtualizado: IFornecedor): Promise<IFornecedor> {
        const fornecedor = await http.put(`/Fornecedor/${id}`, fornecedorAtualizado);
        return fornecedor.data;
    }
    
    static async DeleteFornecedor(id: string): Promise<void> {
        await http.delete(`/Fornecedor/${id}`);
    }
    
    static async addProdutoToFornecedor(fornecedorId: string, produtoId: string): Promise<IFornecedor> {
        const produtoAdicionado = await http.post(`/Fornecedor/${fornecedorId}/produtos/${produtoId}`)
        return produtoAdicionado.data;
    }

    static async deleteProdutoFromFornecedor(fornecedorId: string, produtoId: string) : Promise<void> {
        await http.delete(`/Fornecedor/${fornecedorId}/produtos/${produtoId}`);
    }
}


