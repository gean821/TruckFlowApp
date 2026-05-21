import { NotificacaoService } from "@/services/NotificacaoService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

export const notificacaoQueryKey = "notificacoes";
export const notificacaoUnreadCountQueryKey = "notificacoes-unread-count";

const service = NotificacaoService();

export function useNotificacoesQuery(
  params?: MaybeRef<{ skip?: number; take?: number }>
) {
  return useQuery({
    queryKey: [notificacaoQueryKey, params],
    queryFn: async () => {
      const { skip = 0, take = 20 } = unref(params) ?? {};
      return await service.list(skip, take);
    },
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