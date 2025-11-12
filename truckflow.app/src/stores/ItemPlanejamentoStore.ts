import type ItemPlanejamento from "@/Entities/ItemPlanejamento";
import http from "@/http/http";
import ItemPlanejamentoService from "@/services/ItemPlanejamentoService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useItemPlanejamentoStore = defineStore('Item', () => {
    const itensPlanejamentos = ref<ItemPlanejamento[]>([]);

    async function GetAll() {
        itensPlanejamentos.value = await ItemPlanejamentoService.GetAll();
    }

    async function GetById(id: string) {
        return await ItemPlanejamentoService.GetById(id);
    }

    async function AddItem(item: ItemPlanejamento) {
        const itemAdicionado = await ItemPlanejamentoService.AddItemPlanejamento(item);
        itensPlanejamentos.value.push(itemAdicionado);
        return itemAdicionado;
    }

    async function UpdateItem(id: string, itemAtualizado: ItemPlanejamento) {
        const item = await ItemPlanejamentoService.UpdateItemPlanejamento(id, itemAtualizado);
        const index = itensPlanejamentos.value.findIndex(x => x.id === itemAtualizado.id);

        if (index !== -1) {
            itensPlanejamentos.value[index] = item;
        }
        
        return item;
    }

    async function Deleteitem(id: string) {
        await ItemPlanejamentoService.DeleteItemPlanejamento(id);
        const index = itensPlanejamentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            itensPlanejamentos.value.splice(index, 1);
        }
    }

    return {
        itensPlanejamentos,
        GetAll,
        GetById,
        UpdateItem,
        Deleteitem,
        AddItem
    }
})


