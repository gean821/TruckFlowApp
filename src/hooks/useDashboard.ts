import { computed, onScopeDispose, ref } from "vue";
import type AgendamentoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import { useAgendamentoQuery } from "@/queries/agendamento.queries";
import { useDashboardHojeQuery } from "@/queries/dashboard.queries";

export function useDashboardHoje() {
  const query = useDashboardHojeQuery();

  return {
    dados: query.data,
    carregando: computed(() => query.isLoading.value),
    atualizando: computed(() => query.isFetching.value),
    erro: computed(() => query.isError.value),
    atualizadoEm: computed(() => (query.dataUpdatedAt.value ? new Date(query.dataUpdatedAt.value) : null)),
    recarregar: () => query.refetch(),
  };
}

const AGENDA_DO_DIA_REFRESH_MS = 2 * 60 * 1000;

const diaOperacional = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

export function useAgendamentosDoDia(limite = 8) {
  const dia = ref(diaOperacional());
  const timer = setInterval(() => (dia.value = diaOperacional()), 60 * 1000);
  onScopeDispose(() => clearInterval(timer));

  const filtros = computed<AgendamentoFilterDto>(() => ({
    dataInicio: dia.value,
    dataFim: dia.value,
    ocultarVagasLivres: true,
    pageNumber: 1,
    pageSize: limite,
  }));

  const query = useAgendamentoQuery(filtros, { refetchInterval: AGENDA_DO_DIA_REFRESH_MS });

  return {
    agendamentos: computed(() => query.data.value?.items ?? []),
    total: computed(() => query.data.value?.totalCount ?? 0),
    loading: computed(() => query.isLoading.value),
    refreshing: computed(() => query.isFetching.value && !query.isLoading.value),
  };
}
