import { useToastStore } from "@/stores/ToastStore";
import { useLocalDescargaStore } from "@/stores/LocalDescargaStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import type { CreateLocalDescargaDto, MudarStatusLocalDto, UpdateLocalDescargaDto } from "@/Entities/localDescarga.types";

export function useLocalDescarga() {
  const store = useLocalDescargaStore();
  const toast = useToastStore();
  const { locais, loading } = storeToRefs(store);

  onMounted(async () => {
    if (!store.locais.length) {
      await store.fetchAll();
    }
  });

  const create = async (payload: CreateLocalDescargaDto) => {
    try {
      await store.create(payload);
      toast.notify('Unidade criada com sucesso!', 'success');
    } catch (e) {
      toast.notify('Erro ao criar unidade', 'error');
    }
  }

  const update = async (
    id: string,
    payload: UpdateLocalDescargaDto) => {
    try {
      await store.update(id, payload);
      toast.notify("Unidade atualizada!", 'success');
    } catch (e) {
      toast.notify("Erro ao atualizar.", 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await store.remove(id);
      toast.notify("Unidade removida.", 'info');
    } catch (e) {
      toast.notify("Erro ao remover.", 'error');
    }
  };

  const mudarStatus = async (
    id: string,
    dto: MudarStatusLocalDto) => {
    try {
      await store.mudarStatus(id, dto);
      toast.notify('Sucesso ao mudar Status', 'success');
    } catch (e) {
      toast.notify('Erro ao mudar Status', 'error');
    }
  }

  return {
    locais,
    loading,
    fetchAll: store.fetchAll,
    create,
    update,
    remove,
    mudarStatus
  };
}