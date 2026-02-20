import type UnidadeEntregaCreateDto from "@/Dtos/unidadeEntrega/unidadeEntregaCreateDto";
import type { MudarStatusUnidadeDto, UnidadeEntregaResponse, UnidadeEntregaUpdateDto } from "@/entities/unidadeEntrega.types";
import { UnidadeEntregaService } from "@/services/UnidadeEntregaService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUnidadeEntregaStore = defineStore("unidadeEntrega", () => {
    const service = UnidadeEntregaService();

    const unidades = ref<UnidadeEntregaResponse[]>([]);
    const loading = ref(false);

    async function fetchAll() {
        loading.value = true;
        try {
            unidades.value = await service.getAll();
        } finally {
            loading.value = false;
        }
    }

    async function create(payload: UnidadeEntregaCreateDto): Promise<UnidadeEntregaResponse> {
        const nova = await service.create(payload);
        unidades.value.push(nova);
        return nova;
    }

    async function update(
        id: string,
        payload: UnidadeEntregaUpdateDto): Promise<UnidadeEntregaResponse> {
        const atualizada = await service.update(id, payload);

        const index = unidades.value.findIndex(u => u.id === id);
        if (index !== -1) {
            unidades.value[index] = atualizada;
        }

        return atualizada;
    }

    async function remove(id: string) {
        await service.remove(id);
        unidades.value = unidades.value.filter(u => u.id !== id);
    }

    async function mudarStatus(id: string, payload: MudarStatusUnidadeDto) {
        const atualizada = await service.mudarStatus(id, payload);
        const index = unidades.value.findIndex(u => u.id === id);

        if (index !== -1) {
            unidades.value[index] = atualizada;
        }

        return atualizada;
    }

    return {
        unidades,
        loading,
        fetchAll,
        create,
        update,
        remove,
        mudarStatus
    };
});