import type { NotificacaoListQueryDto } from "@/entities/notificacao.types";
import { NotificacaoService } from "@/services/NotificacaoService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

export const notificacaoQueryKey = "notificacoes";
export const notificacaoUnreadCountQueryKey = "notificacoes-unread-count";
export const notificacaoAgendamentoQueryKey = "notificacoes-agendamento";

const service = NotificacaoService();

export function useNotificacoesPagedQuery(params: MaybeRef<NotificacaoListQueryDto>) {
  return useQuery({
    queryKey: [notificacaoQueryKey, params],
    queryFn: async () => await service.getPaged(unref(params)),
    placeholderData: keepPreviousData,
  });
}

export function useNotificacoesUnreadCountQuery() {
  return useQuery({
    queryKey: [notificacaoUnreadCountQueryKey],
    queryFn: async () => await service.unreadCount(),
    refetchOnWindowFocus: true,
  });
}

export function useComunicacaoAgendamentoQuery(
  agendamentoId: MaybeRef<string | null>
) {
  return useQuery({
    queryKey: [notificacaoAgendamentoQueryKey, agendamentoId],
    queryFn: async () => {
      const id = unref(agendamentoId);

      if (!id) {
        return [];
      }

      return await service.listarPorAgendamento(id);
    },
    enabled: () => !!unref(agendamentoId),
    refetchOnWindowFocus: false,
  });
}