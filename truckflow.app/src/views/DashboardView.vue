<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SummaryCards from '@/components/dashboard/SummaryCards.vue';
import OccupancyChart from '@/components/dashboard/OccupancyChart.vue';
import RecentActivity from '@/components/dashboard/RecentActivity.vue';
import QuickActions from '@/components/dashboard/QuickActions.vue';

const loading = ref(false);
const dashboardData = ref({
  stats: {
    totalAgendamentos: 45,
    emAndamento: 12,
    finalizados: 28,
    atrasados: 5
  },
  volume: {
    totalKg: 450500,
    progressoDiario: 75
  },
  docas: {
    ocupacao: 68,
    livres: 4,
    ocupadas: 8
  }
});

onMounted(() => {
  loading.value = true;
  setTimeout(() => loading.value = false, 1000);
});
</script>

<template>
  <v-container fluid class="bg-grey-lighten-5 pa-6 pb-12">

    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Dashboard Operacional</h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Visão geral da operação logística • {{ new Date().toLocaleDateString('pt-BR') }}
      </p>
    </div>

    <SummaryCards :stats="dashboardData.stats" :loading="loading" />

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <OccupancyChart :docas="dashboardData.docas" :volume="dashboardData.volume" />
      </v-col>

      <v-col cols="12" md="4">
        <RecentActivity />
      </v-col>
    </v-row>

    <div class="mt-8">
      <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-4">Acesso Rápido</h3>
      <QuickActions />
    </div>

  </v-container>
</template>

<style scoped>
.v-container {
  background-color: #F8F9FC !important;
  min-height: 100vh;
  /* Garante que o fundo cubra tudo, mas deixa crescer */
}
</style>