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

export function useCapacidadeDocasQuery(filtro: MaybeRef<RelatorioBiFiltro>) {
  return useQuery({
    queryKey: computed(() => [relatorioBiQueryKey, "capacidade-docas", { ...unref(filtro), fornecedorId: null }]),
    queryFn: async () => await RelatorioBiService.capacidadeDocas(unref(filtro)),
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

export function useProdutividadeQuery(filtro: MaybeRef<RelatorioBiFiltro>, limiteEsperaMin: MaybeRef<number>) {
  return useQuery({
    queryKey: computed(() => [relatorioBiQueryKey, "produtividade", unref(filtro), unref(limiteEsperaMin)]),
    queryFn: async () => await RelatorioBiService.produtividade(unref(filtro), unref(limiteEsperaMin)),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function usePatioQuery(filtro: MaybeRef<RelatorioBiFiltro>, dia: MaybeRef<string>) {
  return useQuery({
    queryKey: computed(() => {
      const { inicio: _inicio, fim: _fim, ...semPeriodo } = unref(filtro);
      return [relatorioBiQueryKey, "patio", semPeriodo, unref(dia)];
    }),
    queryFn: async () => await RelatorioBiService.patio(unref(filtro), unref(dia)),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
