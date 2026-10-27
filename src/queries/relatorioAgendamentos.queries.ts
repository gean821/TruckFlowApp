import type IRelatorioAgendamentoFilterDto from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import { RelatorioService } from "@/services/RelatorioService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type MaybeRef, unref } from "vue";

const chave = "relatorioAgendamentos";
const service = RelatorioService();

export function useAgendamentosDetalhadoQuery(
  filtros: MaybeRef<IRelatorioAgendamentoFilterDto>,
  pagina: MaybeRef<number>,
  porPagina: MaybeRef<number>,
) {
  return useQuery({
    queryKey: computed(() => [chave, "detalhado", unref(filtros), unref(pagina), unref(porPagina)]),
    queryFn: async () => await service.listarDetalhado(unref(filtros), unref(pagina), unref(porPagina)),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useAgendamentosResumoQuery(filtros: MaybeRef<IRelatorioAgendamentoFilterDto>) {
  return useQuery({
    queryKey: computed(() => {
      const { ordenarPor: _ordenar, desc: _desc, ...semOrdenacao } = unref(filtros);
      return [chave, "resumo", semOrdenacao];
    }),
    queryFn: async () => await service.resumo(unref(filtros)),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
