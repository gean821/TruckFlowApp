import type { DashboardResponseDto } from "@/Dtos/dashboard/Dashboard-responses";
import { useDashboardSummaryQuery } from "@/queries/dashboard.queries";
import { computed, onScopeDispose, ref } from "vue";
import type AgendamentoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import { useAgendamentoQuery } from "@/queries/agendamento.queries";

const emptyDashboard: DashboardResponseDto = {
  stats: { totalAgendamentos: 0, emAndamento: 0, finalizados: 0, atrasados: 0, cancelados: 0, expirados: 0 },
  volume: { totalKg: 0, metaDiariaKg: null, progressoDiario: 0 },
  docas: { ocupacaoPorcentagem: 0, livres: 0, ocupadas: 0, total: 0 },
  recentActivity: []
};

export function useDashboard() {
  const summaryQuery = useDashboardSummaryQuery();

  const dashboardData = computed<DashboardResponseDto>(
    () => summaryQuery.data.value ?? emptyDashboard
  );
  const loading = computed(() => summaryQuery.isLoading.value);

  return {
    dashboardData,
    loading,
    refetch: () => summaryQuery.refetch()
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
