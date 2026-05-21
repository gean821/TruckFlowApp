import http from "@/http/http";
import type { NotificacaoListItemDto } from "@/entities/notificacao.types";

export const NotificacaoService = () => {
  const list = async (
    skip: number = 0,
    take: number = 20
  ): Promise<NotificacaoListItemDto[]> => {
    const { data } = await http.get<NotificacaoListItemDto[]>("/notifications", {
      params: { skip, take },
    });
    
    return data;
  };

  const unreadCount = async (): Promise<number> => {
    const { data } = await http.get<{ count: number }>("/notifications/unread-count");
    return data.count;
  };

  const markAsRead = async (id: string): Promise<void> => {
    await http.patch(`/notifications/${id}/read`);
  };

  return { list, unreadCount, markAsRead };
};