import type CreateAgendamentoAdminDto from "@/Dtos/agendamento/agendamentoAdminCreate.dto";
import type AgendamentoAdminUpdateDto from "@/Dtos/agendamento/agendamentoAdminUpdate.dto";
import { AgendamentoService } from "@/services/AgendamentoService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export const useAgendamento = () => {

  const queryClient = useQueryClient();
  const service = AgendamentoService();
  const toast = useToastStore();
  const queryKey = "agendamentos";

  const createMutation = useMutation({
    mutationFn: async (payload: CreateAgendamentoAdminDto) =>
      await service.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Agendamento criado com sucesso!", "success");
    },

    onError: () => {
      toast.notify("Erro ao criar agendamento.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: AgendamentoAdminUpdateDto }) =>
      await service.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Agendamento atualizado!", "success");
    },

    onError: () => {
      toast.notify("Erro ao atualizar agendamento.", "error");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      await service.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Agendamento removido.", "info");
    },

    onError: () => {
      toast.notify("Erro ao remover agendamento.", "error");
    }
  });

  const checkInMutation = useMutation({
    mutationFn: async (id: string) =>
      await service.checkIn(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Check-in realizado!", "success");
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: async (id: string) =>
      await service.checkOut(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Check-out realizado!", "success");
    }
  });

  const cancelarMutation = useMutation({
    mutationFn: async (id: string) =>
      await service.cancelar(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Agendamento cancelado.", "info");
    }
  });

  return {

    createAgendamento: createMutation.mutateAsync,
    updateAgendamento: updateMutation.mutateAsync,
    deleteAgendamento: deleteMutation.mutateAsync,

    checkIn: checkInMutation.mutateAsync,
    checkOut: checkOutMutation.mutateAsync,
    cancelar: cancelarMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};