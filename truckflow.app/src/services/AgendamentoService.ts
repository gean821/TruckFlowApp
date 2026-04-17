import http from "@/http/http";
import type CreateAgendamentoAdminDto from "@/Dtos/agendamento/agendamentoAdminCreate.dto";
import type AgendamentoAdminUpdateDto from "@/Dtos/agendamento/agendamentoAdminUpdate.dto";
import type AgendamentoAdminResponseDtoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import type AgendamentoAdminResponse from "@/Dtos/agendamento/agendamentoAdminResponse.dto";
import type { PaginatedResponse } from "@/entities/paginatedResponse";

export const AgendamentoService = () => {

  const getById = async (id: string): Promise<AgendamentoAdminResponse> => {
    const { data } = await http.get(`/AgendamentoAdmin/${id}`);
    return data;
  };

  const getByFilters = async (
    filters: AgendamentoAdminResponseDtoFilterDto
  ): Promise<PaginatedResponse<AgendamentoAdminResponse>> => {

    const { data } = await http.get("/AgendamentoAdmin", {
      params: filters
    });

    return data;
  };

  const create = async (
    payload: CreateAgendamentoAdminDto
  ): Promise<AgendamentoAdminResponse> => {

    const { data } = await http.post("/AgendamentoAdmin", payload);
    return data;
  };

  const update = async (
    id: string,
    payload: AgendamentoAdminUpdateDto
  ): Promise<AgendamentoAdminResponse> => {

    const { data } = await http.put(`/AgendamentoAdmin/${id}`, payload);
    return data;
  };

  const remove = async (id: string): Promise<void> => {
    await http.delete(`/AgendamentoAdmin/${id}`);
  };

  const checkIn = async (id: string): Promise<void> => {
    await http.patch(`/AgendamentoAdmin/${id}/check-in`);
  };

  const checkOut = async (id: string): Promise<void> => {
    await http.patch(`/AgendamentoAdmin/${id}/check-out`);
  };

  const cancelar = async (id: string): Promise<void> => {
    await http.patch(`/AgendamentoAdmin/${id}/cancelar`);
  };

  return {
    getById,
    getByFilters,
    create,
    update,
    remove,
    checkIn,
    checkOut,
    cancelar
  };
};