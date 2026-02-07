import type { DashboardResponseDto } from '@/Dtos/dashboard/Dashboard-responses';
import { DashboardService } from '@/services/Dashboard.service';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDashboardStore = defineStore('Dashboard', () => {  
  const dashboardData = ref<DashboardResponseDto>({
    stats: { totalAgendamentos: 0, emAndamento: 0, finalizados: 0, atrasados: 0 },
    volume: { totalKg: 0, progressoDiario: 0 },
    docas: { ocupacaoPorcentagem: 0, livres: 0, ocupadas: 0, total: 0 },
    recentActivity: []
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDashboardData() {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await DashboardService.getSummary();
      dashboardData.value = data;
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      error.value = 'Não foi possível carregar os dados do painel.';
    } finally {
      loading.value = false;
    }
  }

  return {
    dashboardData,
    loading,
    error,
    fetchDashboardData
  };
});