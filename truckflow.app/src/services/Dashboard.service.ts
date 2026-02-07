import type { DashboardResponseDto } from "@/Dtos/dashboard/Dashboard-responses";
import http from "@/http/http";

export const DashboardService = {
  async getSummary(): Promise<DashboardResponseDto> {
    const { data } = await http.get<DashboardResponseDto>('/Dashboard/summary');
    return data;
  }
}