import type {
  MudarStatusUnidadeDto,
  UnidadeEntregaCreateDto,
  UnidadeEntregaUpdateDto
} from "@/entities/unidadeEntrega.types";
import { unidadeEntregaQueryKey, useUnidadesEntregaQuery } from "@/queries/unidadeEntrega.queries";
import { UnidadeEntregaService } from "@/services/UnidadeEntregaService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

export function useUnidadeEntrega() {
  const queryClient = useQueryClient();
  const service = UnidadeEntregaService();
  const toast = useToastStore();

  const listQuery = useUnidadesEntregaQuery();
  const unidades = computed(() => listQuery.data.value ?? []);
  const loading = computed(() => listQuery.isLoading.value);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [unidadeEntregaQueryKey] });

  const createMutation = useMutation({
    mutationFn: async (payload: UnidadeEntregaCreateDto) =>
      await service.create(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Unidade criada com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao criar unidade", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UnidadeEntregaUpdateDto }) =>
      await service.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Unidade atualizada!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar.", "error");
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await service.remove(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Unidade removida.", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover.", "error");
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: MudarStatusUnidadeDto }) =>
      await service.mudarStatus(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Status alterado com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao alterar status", "error");
    }
  });

  return {
    unidades,
    loading,
    create: (payload: UnidadeEntregaCreateDto) => createMutation.mutateAsync(payload),
    update: (id: string, payload: UnidadeEntregaUpdateDto) =>
      updateMutation.mutateAsync({ id, payload }),
    remove: (id: string) => removeMutation.mutateAsync(id),
    mudarStatus: (id: string, status: MudarStatusUnidadeDto) =>
      statusMutation.mutateAsync({ id, payload: status }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isMudandoStatus: statusMutation.isPending
  };
}
