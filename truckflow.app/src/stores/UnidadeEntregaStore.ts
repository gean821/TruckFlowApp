import type UnidadeEntregaCreateDto from "@/Dtos/unidadeEntrega/unidadeEntregaCreateDto";
import type UnidadeEntregaUpdateDto from "@/Dtos/unidadeEntrega/UnidadeEntregaUpdateDto";
import type IUnidadeEntrega from "@/entities/IUnidadeEntrega"
import http from "@/http/http";
import UnidadeEntregaService from "@/services/UnidadeEntregaService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useUnidadeEntregaStore = defineStore('UnidadeEntrega', () => {
    const unidadeEntregas = ref<IUnidadeEntrega[]>([]);

    async function GetAll() {
        unidadeEntregas.value = await UnidadeEntregaService.GetAll();
    }

    async function GetById(id: string) {
        return await UnidadeEntregaService.GetById(id);
    }

    async function AddUnidadeEntrega(unidadeEntrega: UnidadeEntregaCreateDto) {
        const unidade = await UnidadeEntregaService.AddUnidadeEntrega(unidadeEntrega);
        unidadeEntregas.value.push(unidade);
        return unidade;
    }

    async function UpdateUnidadeEntrega(id: string, unidadeEntregaAtualizado: UnidadeEntregaUpdateDto) {
        const unidade = await UnidadeEntregaService.UpdateUnidadeEntrega(id, unidadeEntregaAtualizado);
        const index = unidadeEntregas.value.findIndex(x => x.id === id);

        if (index !== -1) {
            unidadeEntregas.value[index] = unidade;
        }

        return unidade;
    }

    async function DeleteUnidadeEntrega(id: string) {
        await UnidadeEntregaService.DeleteUnidadeEntrega(id);
        const index = unidadeEntregas.value.findIndex(x => x.id === id);

        if (index !== -1) {
            unidadeEntregas.value.splice(index, 1);
        }
    }

    return {
        unidadeEntregas,
        GetAll,
        GetById,
        UpdateUnidadeEntrega,
        DeleteUnidadeEntrega,
        AddUnidadeEntrega
    }
})


