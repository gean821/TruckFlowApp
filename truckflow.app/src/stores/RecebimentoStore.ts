import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type IRecebimentoUpdate from "@/Dtos/Recebimento/IRecebimentoUpdate";
import type IPlanejamentoRecebimento from "@/Entities/IPlanejamentoRecebimento";
import http from "@/http/http";
import RecebimentoService from "@/services/RecebimentoService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useRecebimentoStore = defineStore('Recebimento', () => {
    const recebimentos = ref<IPlanejamentoRecebimento[]>([]);

    async function GetAll() {
        recebimentos.value = await RecebimentoService.GetAll();
    }

    async function GetById(id: string) {
        return await RecebimentoService.GetById(id);
    }

    async function AddRecebimento(recebimento: IRecebimentoCreate) {
        const receb = await RecebimentoService.AddRecebimento(recebimento);
        recebimentos.value.push(receb);
        return receb;
    }

    async function UpdateRecebimento(id: string, recebimentoAtualizado: IRecebimentoUpdate ) {
        const recebimento = await RecebimentoService.UpdateRecebimento(id, recebimentoAtualizado);
        const index = recebimentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            recebimentos.value[index] = recebimento;
        }
        
        return recebimento;
    }

    async function DeleteRecebimento(id: string) {
        await RecebimentoService.DeleteRecebimento(id);
        const index = recebimentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            recebimentos.value.splice(index, 1);
        }
    }

    return {
        recebimentos,
        GetAll,
        GetById,
        UpdateRecebimento,
        DeleteRecebimento,
        AddRecebimento
    }
})


