import type { DashboardResponseDto } from "@/Dtos/dashboard/Dashboard-responses";
import { useDashboardSummaryQuery } from "@/queries/dashboard.queries";
import { computed } from "vue";

const emptyDashboard: DashboardResponseDto = {
  stats: { totalAgendamentos: 0, emAndamento: 0, finalizados: 0, atrasados: 0, cancelados: 0 },
  volume: { totalKg: 0, progressoDiario: 0 },
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
