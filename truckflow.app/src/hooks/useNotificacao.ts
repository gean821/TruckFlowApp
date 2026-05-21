import {
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
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => await service.markAsRead(id),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      toast.notify("Erro ao marcar notificação como lida.", "error");
    },
  });

  return {
    markAsRead: (id: string) => markAsReadMutation.mutateAsync(id),
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}