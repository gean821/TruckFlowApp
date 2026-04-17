import { AgendamentoService } from "@/services/AgendamentoService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";
import type AgendamentoAdminResponseDtoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";

const service = AgendamentoService();

export function useAgendamentoQuery(
  params: MaybeRef<AgendamentoAdminResponseDtoFilterDto>,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: ["agendamentos", params],
    queryFn: async () => await service.getByFilters(unref(params)),
    placeholderData: keepPreviousData,
    refetchInterval: options?.refetchInterval
  });
}

export function useAgendamentoByIdQuery(id: string) {
  return useQuery({
    queryKey: ["agendamento", id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}