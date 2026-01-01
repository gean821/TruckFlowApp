import http from "@/http/http";
import type CreateAgendamentoAdminDto from "@/Dtos/agendamento/agendamentoAdminCreate.dto";
import type AgendamentoAdminUpdateDto from "@/Dtos/agendamento/agendamentoAdminUpdate.dto";
import type AgendamentoAdminResponseDtoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import type AgendamentoAdminResponse from "@/Dtos/agendamento/agendamentoAdminResponse.dto";

export default class AgendamentoService {

  static async GetById(id: string): Promise<AgendamentoAdminResponse> {
    const { data } = await http.get(`/AgendamentoAdmin/${id}`);
    return data;
  }

  static async getByFilters(
    filters: AgendamentoAdminResponseDtoFilterDto
  ): Promise<AgendamentoAdminResponse[]> {
    const { data } = await http.get('/AgendamentoAdmin', {
      params: filters
    });

    return data;
  }

  static async AddAgendamento(agendamento: CreateAgendamentoAdminDto): Promise<AgendamentoAdminResponse> {
    const { data } = await http.post('/AgendamentoAdmin', agendamento);
    return data;
  }

  static async UpdateAgendamento(id: string, agendamentoAtualizado: AgendamentoAdminUpdateDto): Promise<AgendamentoAdminResponse> {
    const { data } = await http.put(`/AgendamentoAdmin/${id}`, agendamentoAtualizado);
    return data;
  }

  static async DeleteAgendamento(id: string): Promise<void> {
    await http.delete(`/AgendamentoAdmin/${id}`);
  }
}
