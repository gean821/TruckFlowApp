import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type IRecebimentoUpdate from "@/Dtos/Recebimento/IRecebimentoUpdate";
import type IPlanejamentoRecebimento from "@/entities/IPlanejamentoRecebimento";
import RecebimentoService from "@/services/RecebimentoService";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { useToastStore } from "./ToastStore";
import type IRecebimentoResponse from "@/Dtos/Recebimento/IRecebimentoResponse";

export const useRecebimentoStore = defineStore('Recebimento', () => {
    const recebimentos = ref<IRecebimentoResponse[]>([]);
    const loading = ref(false);
    const toast = useToastStore();

    async function GetAll() {
        loading.value = true;
        try {
            recebimentos.value = await RecebimentoService.GetAll();
        } catch (error) {
            toast.notify("Erro ao carregar recebimentos.", "error");
        } finally {
            loading.value = false;
        }
    }

    async function GetById(id: string) {
        try {
            return await RecebimentoService.GetById(id);
        } catch (error) {
            toast.notify("Erro ao buscar detalhes do recebimento.", "error");
            throw error;
        }
    }

    async function AddRecebimento(recebimento: IRecebimentoCreate) {
        loading.value = true;
        try {
            const novo = await RecebimentoService.AddRecebimento(recebimento);
            // O backend retorna o objeto criado, idealmente já no formato de resposta
            // Se o formato bater, adiciona na lista:
            // recebimentos.value.unshift(novo); // Adiciona no topo

            // Se o backend retorna diferente do ResponseDTO da lista, recarrega tudo:
            await GetAll();

            toast.notify("Planejamento criado com sucesso!", "success");
            return novo;
        } catch (error) {
            toast.notify("Erro ao criar recebimento. Verifique os dados.", "error");
            throw error;
        } finally {
            loading.value = false;
        }
    }


    async function UpdateRecebimento(id: string, recebimentoAtualizado: IRecebimentoUpdate) {
        loading.value = true;
        try {
            await RecebimentoService.UpdateRecebimento(id, recebimentoAtualizado);
            await GetAll(); // Recarrega para garantir dados frescos
            toast.notify("Recebimento atualizado.", "success");
        } catch (error) {
            toast.notify("Erro ao atualizar.", "error");
            throw error;
        } finally {
            loading.value = false;
        }
    }


    async function DeleteRecebimento(id: string) {
        loading.value = true;
        try {
            await RecebimentoService.DeleteRecebimento(id);
            recebimentos.value = recebimentos.value.filter(x => x.id !== id);
            toast.notify("Recebimento removido.", "info");
        } catch (error) {
            toast.notify("Erro ao excluir.", "error");
        } finally {
            loading.value = false;
        }
    }

    return {
        recebimentos,
        loading,
        GetAll,
        GetById,
        UpdateRecebimento,
        DeleteRecebimento,
        AddRecebimento
    }
})


