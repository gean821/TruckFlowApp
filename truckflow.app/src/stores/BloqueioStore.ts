import type IBloqueio from "@/Entities/IBloqueio";
import http from "@/http/http";
import BloqueioService from "@/services/BloqueioService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useBloqueioStore = defineStore('Item', () => {
    const bloqueios = ref<IBloqueio[]>([]);

    async function GetAll() {
        bloqueios.value = await BloqueioService.GetAll();
    }

    async function GetById(id: string) {
        return await BloqueioService.GetById(id);
    }

    async function AddItem(item: IBloqueio) {
        const itemAdicionado = await BloqueioService.AddBloqueio(item);
        bloqueios.value.push(itemAdicionado);
        return itemAdicionado;
    }

    async function UpdateItem(id: string, itemAtualizado: IBloqueio) {
        const item = await BloqueioService.UpdateBloqueio(id, itemAtualizado);
        const index = bloqueios.value.findIndex(x => x.id === itemAtualizado.id);

        if (index !== -1) {
            bloqueios.value[index] = item;
        }
        
        return item;
    }

    async function Deleteitem(id: string) {
        await BloqueioService.DeleteBloqueio(id);
        const index = bloqueios.value.findIndex(x => x.id === id);

        if (index !== -1) {
            bloqueios.value.splice(index, 1);
        }
    }

    return {
        bloqueios,
        GetAll,
        GetById,
        UpdateItem,
        Deleteitem,
        AddItem
    }
})


