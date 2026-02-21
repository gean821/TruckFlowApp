import { useFornecedorStore } from "@/stores/FornecedorStore";
import { useToastStore } from "@/stores/ToastStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

export function useFornecedor() {
  const store = useFornecedorStore();
  const toast = useToastStore();
  const { fornecedores, loading } = storeToRefs(store);

  onMounted(() => { if (!fornecedores.value.length) store.fetchAll(); });

  const create = async (p: any) => {
    try {
      await store.create(p);
      toast.notify("Fornecedor cadastrado!", "success");
    }
    catch {
      toast.notify("Erro ao cadastrar", "error");
    }
  };

  const update = async (id: string, p: any) => {
    try {
      await store.update(id, p);
      toast.notify("Fornecedor atualizado!", "success");
    }
    catch {
      toast.notify("Erro ao atualizar", "error");
    }
  };

  const remove = async (id: string) => {
    try {
      await store.remove(id);
      toast.notify("Fornecedor removido", "info");
    }
    catch { toast.notify("Erro ao remover", "error"); }
  };

  return {
    fornecedores, loading, create, update, remove,
    linkProduto: store.linkProduto, unlinkProduto: store.unlinkProduto
  };
}