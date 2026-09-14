import type {
  FornecedorCreateDto,
  FornecedorUpdateDto
} from "@/entities/fornecedor.types";
import { fornecedorQueryKey, useFornecedoresQuery } from "@/queries/fornecedor.queries";
import { FornecedorService } from "@/services/FornecedorService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

export function useFornecedor() {
  const queryClient = useQueryClient();
  const service = FornecedorService();
  const toast = useToastStore();

  const listQuery = useFornecedoresQuery();
  const fornecedores = computed(() => listQuery.data.value ?? []);
  const loading = computed(() => listQuery.isLoading.value);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [fornecedorQueryKey] });

  const createMutation = useMutation({
    mutationFn: async (payload: FornecedorCreateDto) =>
      await service.create(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Fornecedor cadastrado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao cadastrar", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FornecedorUpdateDto }) =>
      await service.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Fornecedor atualizado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar", "error");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await service.remove(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Fornecedor removido", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover", "error");
    }
  });

  const linkProdutoMutation = useMutation({
    mutationFn: async ({ fornecedorId, produtoId }: { fornecedorId: string; produtoId: string }) =>
      await service.addProduto(fornecedorId, produtoId),
    onSuccess: () => {
      invalidate();
      toast.notify("Produto vinculado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao vincular produto", "error");
    }
  });

  const unlinkProdutoMutation = useMutation({
    mutationFn: async ({ fornecedorId, produtoId }: { fornecedorId: string; produtoId: string }) =>
      await service.removeProduto(fornecedorId, produtoId),
    onSuccess: () => {
      invalidate();
      toast.notify("Produto desvinculado", "info");
    },
    onError: () => {
      toast.notify("Erro ao desvincular produto", "error");
    }
  });

  return {
    fornecedores,
    loading,
    create: (payload: FornecedorCreateDto) => createMutation.mutateAsync(payload),
    update: (id: string, payload: FornecedorUpdateDto) =>
      updateMutation.mutateAsync({ id, payload }),
    remove: (id: string) => removeMutation.mutateAsync(id),
    linkProduto: (fornecedorId: string, produtoId: string) =>
      linkProdutoMutation.mutateAsync({ fornecedorId, produtoId }),
    unlinkProduto: (fornecedorId: string, produtoId: string) =>
      unlinkProdutoMutation.mutateAsync({ fornecedorId, produtoId }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending
  };
}
