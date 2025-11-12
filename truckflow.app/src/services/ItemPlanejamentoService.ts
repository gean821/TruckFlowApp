import type ItemPlanejamento from "@/Entities/ItemPlanejamento";
import http from "@/http/http";

export default class ItemPlanejamentoService {
    static async GetAll(): Promise<ItemPlanejamento[]> {
        const ItemPlanejamentos = await http.get('/ItemPlanejamento');
        return ItemPlanejamentos.data;
    }

    static async GetById(id: string): Promise<ItemPlanejamento> {
        const item = await http.get(`/ItemPlanejamento/${id}`);
        return item.data;
    }

    static async AddItemPlanejamento(itemPlanejamento: ItemPlanejamento): Promise<ItemPlanejamento> {
        const item = await http.post('/ItemPlanejamento', itemPlanejamento);
        return item.data;
    }

    static async UpdateItemPlanejamento(id: string, itemPlanejamentoAtualizado: ItemPlanejamento): Promise<ItemPlanejamento> {
        const item = await http.put(`/ItemPlanejamento/${id}`, itemPlanejamentoAtualizado);
        return item.data;
    }

    static async DeleteItemPlanejamento(id: string): Promise<void> {
        await http.delete(`/ItemPlanejamento/${id}`);
    }
}
