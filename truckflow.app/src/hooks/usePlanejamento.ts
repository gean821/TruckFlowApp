import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type IRecebimentoUpdate from "@/Dtos/Recebimento/IRecebimentoUpdate";
import type { RegistrarEntradaDto } from "@/Dtos/Recebimento/RegistrarEntrada.dto";
import { RecebimentoService } from "@/services/RecebimentoService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export const usePlanejamento = () => {
  const queryClient = useQueryClient();
  const service = RecebimentoService();
  const toast = useToastStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["planejamentos"] });
    queryClient.invalidateQueries({ queryKey: ["planejamento"] });
    queryClient.invalidateQueries({ queryKey: ["planejamento-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["planejamento-relatorio"] });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: IRecebimentoCreate) => await service.create(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Planejamento criado com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao criar planejamento.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: IRecebimentoUpdate }) =>
      await service.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Planejamento atualizado.", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar planejamento.", "error");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await service.remove(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Planejamento removido.", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover planejamento.", "error");
    }
  });

  const encerrarMutation = useMutation({
    mutationFn: async (id: string) => await service.encerrar(id),
    onSuccess: () => {
      invalidate();
      toast.notify("Planejamento encerrado.", "info");
    },
    onError: () => {
      toast.notify("Erro ao encerrar planejamento.", "error");
    }
  });

  const registrarEntradaMutation = useMutation({
    mutationFn: async (payload: RegistrarEntradaDto) => {
      const { itemId, ...dto } = payload;
      await service.registrarEntrada(itemId, dto);
    },
    onSuccess: () => {
      invalidate();
      toast.notify("Entrada registrada com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao registrar entrada.", "error");
    }
  });

  return {
    createPlanejamento: createMutation.mutateAsync,
    updatePlanejamento: updateMutation.mutateAsync,
    deletePlanejamento: deleteMutation.mutateAsync,
    encerrarPlanejamento: encerrarMutation.mutateAsync,
    registrarEntrada: registrarEntradaMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isEncerrando: encerrarMutation.isPending
  };
};
