import type IProduto from "@/Entities/IProduto";
import http from "@/http/http";

export default class ProdutoService {

    static async GetAll():Promise<IProduto[]> {
        const produtos = await http.get('/Produto');
        return produtos.data; 
    }

     static async GetById(id: string): Promise<IProduto> {
        const local = await http.get(`/Produto/${id}`);
        return local.data;        
    }

    static async AddProduto(Produto: IProduto):Promise<IProduto> {
        const produto = await http.post('/Produto', Produto);
        return produto.data;
    }

    static async UpdateProduto(id: string, localAtualizado: IProduto): Promise<IProduto> {
        const produto = await http.put(`/Produto/${id}`, localAtualizado);
        return produto.data;
    }

    static async DeleteProduto(id: string) : Promise<void> {
        await http.delete(`/Produto/${id}`);
    }
}
