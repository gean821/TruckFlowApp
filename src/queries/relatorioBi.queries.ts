import type { Agrupamento, RelatorioBiFiltro } from "@/entities/relatorioBi.types";
import { RelatorioBiService } from "@/services/RelatorioBiService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRef, unref } from "vue";

export const relatorioBiQueryKey = "relatorioBi";

export function useVisaoGeralQuery(filtro: MaybeRef<RelatorioBiFiltro>) {
  return useQuery({
    queryKey: computed(() => [relatorioBiQueryKey, "visao-geral", unref(filtro)]),
    queryFn: async () => await RelatorioBiService.visaoGeral(unref(filtro)),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useRecebimentosQuery(filtro: MaybeRef<RelatorioBiFiltro>, agrupamento: MaybeRef<Agrupamento | null>) {
  return useQuery({
    queryKey: computed(() => [relatorioBiQueryKey, "recebimentos", unref(filtro), unref(agrupamento)]),
    queryFn: async () => await RelatorioBiService.recebimentos(unref(filtro), unref(agrupamento)),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
