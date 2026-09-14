import type ItemPlanejamento from "@/entities/ItemPlanejamento";
import { itemPlanejamentoQueryKey } from "@/queries/itemPlanejamento.queries";
import ItemPlanejamentoService from "@/services/ItemPlanejamentoService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useItemPlanejamento() {
  const queryClient = useQueryClient();
  const toast = useToastStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [itemPlanejamentoQueryKey] });
    queryClient.invalidateQueries({ queryKey: ["planejamentos"] });
    queryClient.invalidateQueries({ queryKey: ["planejamento"] });
    queryClient.invalidateQueries({ queryKey: ["planejamento-dashboard"] });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: ItemPlanejamento) =>
      await ItemPlanejamentoService.AddItemPlanejamento(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Item adicionado.", "success");
    },
    onError: () => {
      toast.notify("Erro ao adicionar item.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ItemPlanejamento }) =>
      await ItemPlanejamentoService.UpdateItemPlanejamento(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Item atualizado.", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar item.", "error");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await ItemPlanejamentoService.DeleteItemPlanejamento(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Item removido.", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover item.", "error");
    }
  });

  return {
    create: (payload: ItemPlanejamento) => createMutation.mutateAsync(payload),
    update: (id: string, payload: ItemPlanejamento) =>
      updateMutation.mutateAsync({ id, payload }),
    remove: (id: string) => removeMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending
  };
}
