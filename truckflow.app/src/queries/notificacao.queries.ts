import type { NotificacaoListQueryDto } from "@/entities/notificacao.types";
import { NotificacaoService } from "@/services/NotificacaoService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

export const notificacaoQueryKey = "notificacoes";
export const notificacaoUnreadCountQueryKey = "notificacoes-unread-count";

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