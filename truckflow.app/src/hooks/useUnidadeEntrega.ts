import type UnidadeEntregaCreateDto from "@/Dtos/unidadeEntrega/unidadeEntregaCreateDto";
import type { MudarStatusUnidadeDto, UnidadeEntregaUpdateDto } from "@/entities/unidadeEntrega.types";
import { useToastStore } from "@/stores/ToastStore";
import { useUnidadeEntregaStore } from "@/stores/UnidadeEntregaStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

export function useUnidadeEntrega() {
  const store = useUnidadeEntregaStore();
  const toast = useToastStore();
  const { unidades, loading } = storeToRefs(store);

  onMounted(async () => {
    if (!store.unidades.length) {
      await store.fetchAll();
    }
  });

  const create = async (payload: UnidadeEntregaCreateDto) => {
    try {
      await store.create(payload);
      toast.notify('Unidade criada com sucesso!', 'success');
    } catch (e) {
      toast.notify('Erro ao criar unidade', 'error');
    }
  }

  const update = async (
    id: string,
    payload: UnidadeEntregaUpdateDto) => {
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

  const mudarStatus = async(
    id: string,
    status: MudarStatusUnidadeDto) => {
      try {
        await store.mudarStatus(id, status);
        toast.notify('Status alterado com sucesso!', 'success');
      }catch(e) {
        toast.notify('Erro ao alterar status', 'error');
      }
    }

  return {
    unidades,
    loading,
    fetchAll: store.fetchAll,
    create,
    update,
    remove,
    mudarStatus
  };
}