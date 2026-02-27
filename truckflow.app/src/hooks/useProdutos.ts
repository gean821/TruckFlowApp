import type { ProdutoCreateDto, ProdutoUpdateDto } from "@/Entities/produto.types";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { useToastStore } from "@/stores/ToastStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

export function useProduto() {
  const store = useProdutoStore();
  const toast = useToastStore();
  const { produtos, loading } = storeToRefs(store);

  onMounted(async () => {
    if (!store.produtos.length) {
      await store.getAll();
    }
  });

  const create = async (payload: ProdutoCreateDto) => {
    try {
      await store.addProduto(payload);
      toast.notify('produto criado com sucesso!', 'success');
    } catch (e) {
      toast.notify('Erro ao criar unidade', 'error');
    }
  }

  const update = async (
    id: string,
    payload: ProdutoUpdateDto) => {
    try {
      await store.update(id, payload);
      toast.notify("produto atualizado!", 'success');
    } catch (e) {
      toast.notify("Erro ao atualizar.", 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await store.deleteProduto(id);
      toast.notify("produto removida.", 'info');
    } catch (e) {
      toast.notify("Erro ao remover.", 'error');
    }
  };

  return {
    produtos,
    loading,
    fetchAll: store.getAll,
    create,
    update,
    remove,
  };
}
