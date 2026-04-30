<template>
  <v-container fluid class="dashboard-bg pa-6 pb-12">

    <div class="dashboard-header mb-8 pa-6 rounded-xl">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon color="white" size="20" class="opacity-70">mdi-view-dashboard</v-icon>
            <span class="text-caption text-white opacity-70 text-uppercase font-weight-medium" style="letter-spacing: 0.08em;">
              Painel de Controle
            </span>
          </div>
          <h1 class="text-h4 font-weight-bold text-white">Dashboard Operacional</h1>
          <p class="text-body-2 mt-1" style="color: rgba(255,255,255,0.65);">
            Visão geral da operação logística • {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) }}
          </p>
        </div>

        <v-btn
          icon="mdi-refresh"
          variant="tonal"
          color="white"
          :loading="loading"
          size="small"
          @click="dashboardStore.fetchDashboardData()"
        />
      </div>
    </div>

    <SummaryCards :stats="dashboardData.stats" :loading="loading" />

    <v-row class="mt-5">
      <v-col cols="12" md="7" class="d-flex flex-column gap-4">
        <OccupancyChart :docas="dashboardData.docas" :volume="dashboardData.volume" />
        <StatusChart :stats="dashboardData.stats" :loading="loading" />
      </v-col>

      <v-col cols="12" md="5">
        <UpcomingAppointments />
      </v-col>
    </v-row>

    <div class="mt-6">
      <div class="d-flex align-center gap-3 mb-4">
        <div class="section-accent-bar"></div>
        <h3 class="text-h6 font-weight-bold text-grey-darken-3">Acesso Rápido</h3>
      </div>
      <QuickActions />
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/DashboardStore';

import SummaryCards from '@/components/dashboard/SummaryCards.vue';
import OccupancyChart from '@/components/dashboard/OccupancyChart.vue';
import StatusChart from '@/components/dashboard/StatusChart.vue';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments.vue';
import QuickActions from '@/components/dashboard/QuickActions.vue';

const dashboardStore = useDashboardStore();

const dashboardData = computed(() => dashboardStore.dashboardData);
const loading = computed(() => dashboardStore.loading);

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background-color: #EEF0F8;
  background-image: radial-gradient(#c8cde8 1px, transparent 1px);
  background-size: 24px 24px;
}

.dashboard-header {
  background: linear-gradient(135deg, #195FA0 0%, #0D3F6E 60%, #0A2E52 100%);
  box-shadow: 0 4px 24px rgba(25, 95, 160, 0.35);
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.dashboard-header::after {
  content: '';
  position: absolute;
  bottom: -60px;
  right: 120px;
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
}

.section-accent-bar {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #195FA0, #0D3F6E);
  border-radius: 4px;
}
</style>
