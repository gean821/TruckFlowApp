import type { DashboardHojeResponse } from "@/entities/dashboardHoje.types";
import http from "@/http/http";

export const DashboardService = {
  async getHoje(): Promise<DashboardHojeResponse> {
    const { data } = await http.get<DashboardHojeResponse>("/Dashboard/hoje");
    return data;
  },
};
