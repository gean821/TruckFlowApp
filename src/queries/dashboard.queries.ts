import { DashboardService } from "@/services/Dashboard.service";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";

export const dashboardQueryKey = "dashboard";

const ATUALIZACAO_MS = 30_000;

export function useDashboardHojeQuery() {
  return useQuery({
    queryKey: [dashboardQueryKey, "hoje"],
    queryFn: async () => await DashboardService.getHoje(),
    placeholderData: keepPreviousData,
    refetchInterval: ATUALIZACAO_MS,
    refetchOnWindowFocus: true,
  });
}
