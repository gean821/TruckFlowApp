import { DashboardService } from "@/services/Dashboard.service";
import { useQuery } from "@tanstack/vue-query";

export const dashboardQueryKey = 'dashboardSummary';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: [dashboardQueryKey],
    queryFn: async () => await DashboardService.getSummary()
  });
}
