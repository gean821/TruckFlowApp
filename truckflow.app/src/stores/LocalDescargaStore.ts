import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CreateLocalDescargaDto, LocalDescargaResponse, MudarStatusLocalDto, UpdateLocalDescargaDto } from '@/entities/localDescarga.types';
import { LocalDescargaService } from '@/services/LocalDescargaService';

export const useLocalDescargaStore = defineStore('localDescarga', () => {
  const service = LocalDescargaService();

  const locais = ref<LocalDescargaResponse[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      locais.value = await service.getAll();
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateLocalDescargaDto): Promise<LocalDescargaResponse> {
    const nova = await service.create(payload);
    locais.value.push(nova);
    return nova;
  }

  async function update(
    id: string,
    payload: UpdateLocalDescargaDto): Promise<LocalDescargaResponse> {
    const atualizada = await service.update(id, payload);

    const index = locais.value.findIndex(u => u.id === id);
    if (index !== -1) {
      locais.value[index] = atualizada;
    }

    return atualizada;
  }

  async function remove(id: string) {
    await service.remove(id);
    locais.value = locais.value.filter(u => u.id !== id);
  }

  async function mudarStatus(id: string, payload: MudarStatusLocalDto) {
    const atualizada = await service.mudarStatus(id, payload);
    const index = locais.value.findIndex(u => u.id === id);

    if (index !== -1) {
      locais.value[index] = atualizada;
    }

    return atualizada;
  }


  return {
    locais,
    fetchAll,
    loading,
    remove,
    create,
    update,
    mudarStatus
  }
})


