import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type IRecebimentoUpdate from "@/Dtos/Recebimento/IRecebimentoUpdate";
import { RecebimentoService } from "@/services/RecebimentoService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "./ToastStore";
import type IRecebimentoResponse from "@/Dtos/Recebimento/IRecebimentoResponse";
import type { RegistrarEntradaDto } from "@/Dtos/Recebimento/RegistrarEntrada.dto";

export const useRecebimentoStore = defineStore("Recebimento", () => {
    const recebimentos = ref<IRecebimentoResponse[]>([]);
    const loading = ref(false);
    const toast = useToastStore();
    const service = RecebimentoService();

    async function GetAll() {
        loading.value = true;
        try {
            recebimentos.value = await service.getAll();
        } catch {
            toast.notify("Erro ao carregar recebimentos.", "error");
        } finally {
            loading.value = false;
        }
    }

    async function GetById(id: string) {
        try {
            return await service.getById(id);
        } catch (error) {
            toast.notify("Erro ao buscar detalhes do recebimento.", "error");
            throw error;
        }
    }

    async function AddRecebimento(recebimento: IRecebimentoCreate) {
        loading.value = true;
        try {
            const novo = await service.create(recebimento);
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
            await service.update(id, recebimentoAtualizado);
            await GetAll();
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
            await service.remove(id);
            recebimentos.value = recebimentos.value.filter((x) => x.id !== id);
            toast.notify("Recebimento removido.", "info");
        } catch {
            toast.notify("Erro ao excluir.", "error");
        } finally {
            loading.value = false;
        }
    }

    async function RegistrarEntrada(payload: RegistrarEntradaDto) {
        loading.value = true;
        try {
            const { itemId, ...dto } = payload;
            await service.registrarEntrada(itemId, dto);
            await GetAll();
            toast.notify("Entrada registrada com sucesso!", "success");
        } catch (error) {
            console.error(error);
            toast.notify("Erro ao registrar entrada.", "error");
            throw error;
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
        AddRecebimento,
        RegistrarEntrada,
    };
});
