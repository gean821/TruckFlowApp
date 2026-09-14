import type { ProdutoCreateDto, ProdutoUpdateDto } from "@/entities/produto.types";
import { produtoQueryKey, useProdutosQuery } from "@/queries/produto.queries";
import { ProdutoService } from "@/services/ProdutoService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

export function useProduto() {
  const queryClient = useQueryClient();
  const service = ProdutoService();
  const toast = useToastStore();

  const listQuery = useProdutosQuery();
  const produtos = computed(() => listQuery.data.value ?? []);
  const loading = computed(() => listQuery.isLoading.value);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [produtoQueryKey] });

  const createMutation = useMutation({
    mutationFn: async (payload: ProdutoCreateDto) =>
      await service.addProduto(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Produto criado com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao criar produto", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProdutoUpdateDto }) =>
      await service.updateProduto(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Produto atualizado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar.", "error");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await service.remove(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Produto removido.", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover.", "error");
    }
  });

  return {
    produtos,
    loading,
    create: (payload: ProdutoCreateDto) => createMutation.mutateAsync(payload),
    update: (id: string, payload: ProdutoUpdateDto) =>
      updateMutation.mutateAsync({ id, payload }),
    remove: (id: string) => removeMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending
  };
}
