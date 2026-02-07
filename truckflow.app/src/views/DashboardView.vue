<template>
  <v-container fluid class="bg-grey-lighten-5 pa-6 pb-12">

    <div class="mb-6 d-flex justify-space-between align-end">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Dashboard Operacional</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Visão geral da operação logística • {{ new Date().toLocaleDateString('pt-BR') }}
        </p>
      </div>

      <v-btn icon="mdi-refresh" variant="text" color="grey-darken-1" :loading="loading"
        @click="dashboardStore.fetchDashboardData()"></v-btn>
    </div>

    <SummaryCards :stats="dashboardData.stats" :loading="loading" />

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <OccupancyChart :docas="dashboardData.docas" :volume="dashboardData.volume" />
      </v-col>

      <v-col cols="12" md="4">
        <RecentActivity 
          :activities="dashboardData.recentActivity" 
          @view-all="handleViewAllActivity" 
        />
      </v-col>
    </v-row>

    <div class="mt-8">
      <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-4">Acesso Rápido</h3>
      <QuickActions />
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/DashboardStore';

// Componentes
import SummaryCards from '@/components/dashboard/SummaryCards.vue';
import OccupancyChart from '@/components/dashboard/OccupancyChart.vue';
import RecentActivity from '@/components/dashboard/RecentActivity.vue';
import QuickActions from '@/components/dashboard/QuickActions.vue';
import router from '@/router';

const dashboardStore = useDashboardStore();

const dashboardData = computed(() => dashboardStore.dashboardData);
const loading = computed(() => dashboardStore.loading);

onMounted(() => {
  dashboardStore.fetchDashboardData();
});

const handleViewAllActivity = () => {
  router.push('/atividades');
}
</script>




<style scoped>
.v-container {
  background-color: #F8F9FC !important;
  min-height: 100vh;
  /* Garante que o fundo cubra tudo, mas deixa crescer */
}
</style>