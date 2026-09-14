import http from "@/http/http";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import type {
  EnviarParaMotoristaDto,
  NotificacaoListItemDto,
  NotificacaoListQueryDto,
} from "@/entities/notificacao.types";

export const NotificacaoService = () => {
  const getPaged = async (
    query: NotificacaoListQueryDto
  ): Promise<PaginatedResponse<NotificacaoListItemDto>> => {
    const { data } = await http.get<PaginatedResponse<NotificacaoListItemDto>>(
      "/notifications",
      { params: query }
    );
    return data;
  };

  const unreadCount = async (): Promise<number> => {
    const { data } = await http.get<{ count: number }>("/notifications/unread-count");
    return data.count;
  };

  const markAsRead = async (id: string): Promise<void> => {
    await http.patch(`/notifications/${id}/read`);
  };

  const enviarParaMotorista = async (
    dto: EnviarParaMotoristaDto
  ): Promise<void> => {
    await http.post("/notifications/send-motorista", dto);
  };

  const listarPorAgendamento = async (
    agendamentoId: string
  ): Promise<NotificacaoListItemDto[]> => {
    const { data } = await http.get<NotificacaoListItemDto[]>(
      `/notifications/agendamento/${agendamentoId}`
    );
    return data;
  };

  return {
    getPaged,
    unreadCount,
    markAsRead,
    enviarParaMotorista,
    listarPorAgendamento,
  };
};
