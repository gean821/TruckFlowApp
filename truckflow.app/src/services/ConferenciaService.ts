import http from "@/http/http";
import type {
  ConferenciaResponseDto,
  ConferenciaItemDto,
  MatchItemDto,
} from "@/Dtos/conferencia/conferenciaDto";

export const ConferenciaService = {
  async getByAgendamento(agendamentoId: string): Promise<ConferenciaResponseDto> {
    const { data } = await http.get<ConferenciaResponseDto>(
      `/Conferencia/agendamento/${agendamentoId}`,
    );
    return data;
  },

  async matchItem(itemId: string, produtoId: string): Promise<ConferenciaItemDto> {
    const body: MatchItemDto = { produtoId };
    const { data } = await http.post<ConferenciaItemDto>(
      `/Conferencia/item/${itemId}/match`,
      body,
    );
    return data;
  },
};
