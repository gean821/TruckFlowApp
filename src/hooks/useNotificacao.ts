import type { EnviarParaMotoristaDto } from "@/entities/notificacao.types";
import {
  notificacaoAgendamentoQueryKey,
  notificacaoQueryKey,
  notificacaoUnreadCountQueryKey,
} from "@/queries/notificacao.queries";
import { NotificacaoService } from "@/services/NotificacaoService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useNotificacao() {
  const queryClient = useQueryClient();
  const service = NotificacaoService();
  const toast = useToastStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [notificacaoQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoUnreadCountQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoAgendamentoQueryKey] });
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => await service.markAsRead(id),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: any) => {
      const msg = error.response.data.message ?? "Erro ao marcar notificação como lida.";
      toast.notify(msg, "error");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => await service.markAllAsRead(),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ??
        "Erro ao marcar notificações como lidas.";
      toast.notify(msg, "error");
    },
  });

  const enviarParaMotoristaMutation = useMutation({
    mutationFn: async (dto: EnviarParaMotoristaDto) =>
      await service.enviarParaMotorista(dto),
    onSuccess: () => {
      toast.notify("Mensagem enviada ao motorista!", "success");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Erro ao enviar mensagem.";
      toast.notify(msg, "error");
    },
  });

  return {
    markAsRead: (id: string) => markAsReadMutation.mutateAsync(id),
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: () => markAllAsReadMutation.mutateAsync(),
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    enviarParaMotorista: (dto: EnviarParaMotoristaDto) =>
      enviarParaMotoristaMutation.mutateAsync(dto),
    isEnviando: enviarParaMotoristaMutation.isPending,
  };
}