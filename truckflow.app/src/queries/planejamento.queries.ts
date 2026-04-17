import { RecebimentoService } from "@/services/RecebimentoService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";
import type IPlanejamentoListQuery from "@/Dtos/Recebimento/IPlanejamentoListQuery";

const service = RecebimentoService();

export function usePlanejamentoQuery(params: MaybeRef<IPlanejamentoListQuery>) {
  return useQuery({
    queryKey: ["planejamentos", params],
    queryFn: async () => await service.getPaged(unref(params)),
    placeholderData: keepPreviousData
  });
}

export function usePlanejamentoByIdQuery(id: MaybeRef<string | undefined | null>) {
  return useQuery({
    queryKey: ["planejamento", id],
    queryFn: async () => await service.getById(unref(id)!),
    enabled: () => !!unref(id)
  });
}

export function usePlanejamentoDashboardQuery(
  id: MaybeRef<string | undefined | null>,
  data?: MaybeRef<string | undefined>
) {
  return useQuery({
    queryKey: ["planejamento-dashboard", id, data],
    queryFn: async () => await service.getDashboard(unref(id)!, unref(data)),
    enabled: () => !!unref(id),
    placeholderData: keepPreviousData
  });
}

export function usePlanejamentoRelatorioQuery(
  id: MaybeRef<string | undefined | null>,
  enabled: MaybeRef<boolean> = true
) {
  return useQuery({
    queryKey: ["planejamento-relatorio", id],
    queryFn: async () => await service.getRelatorio(unref(id)!),
    enabled: () => !!unref(id) && !!unref(enabled)
  });
}
