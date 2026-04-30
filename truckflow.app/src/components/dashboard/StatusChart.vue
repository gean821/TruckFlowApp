<template>
  <v-card elevation="0" class="rounded-xl pa-6 h-100 premium-card">
    <div class="d-flex justify-space-between align-center mb-5">
      <h3 class="text-h6 font-weight-bold">Agendamentos de Hoje</h3>
      <v-chip size="small" variant="tonal" color="primary">
        {{ stats.totalAgendamentos }} total
      </v-chip>
    </div>

    <div v-if="loading" class="d-flex justify-center align-center" style="height: 200px;">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else-if="hasData">
      <apexchart type="donut" height="230" :options="chartOptions" :series="series" />
    </template>

    <div v-else class="d-flex flex-column align-center justify-center py-8 text-grey">
      <v-avatar color="grey-lighten-4" size="52" class="mb-3">
        <v-icon icon="mdi-calendar-blank" size="26" color="grey-lighten-1" />
      </v-avatar>
      <p class="text-body-2 font-weight-medium text-grey-darken-1">Nenhum agendamento hoje</p>
    </div>

    <v-divider class="my-4" />

    <div class="d-flex justify-space-around">
      <div v-for="item in statusItems" :key="item.label" class="d-flex flex-column align-center">
        <v-avatar :color="item.bg" size="36" class="rounded-lg mb-1">
          <span class="text-body-2 font-weight-bold" :style="{ color: item.color }">{{ item.value }}</span>
        </v-avatar>
        <span class="text-center text-grey-darken-1" style="font-size: 10px;">{{ item.label }}</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DashboardStatsDto } from '@/Dtos/dashboard/Dashboard-responses';

const props = defineProps<{ stats: DashboardStatsDto; loading: boolean }>();

const agendados = computed(() => {
  const rest = props.stats.totalAgendamentos - props.stats.emAndamento - props.stats.finalizados - props.stats.atrasados - (props.stats.cancelados ?? 0);
  return Math.max(0, rest);
});

const hasData = computed(() => props.stats.totalAgendamentos > 0);

const chartOptions = computed(() => ({
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
  labels: ['Aguardando', 'Em Andamento', 'Finalizados', 'Atrasados', 'Cancelados'],
  colors: ['#7E57C2', '#195FA0', '#4CAF50', '#EF5350', '#9E9E9E'],
  legend: {
    position: 'bottom',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '12px',
    markers: { size: 8 },
    itemMargin: { horizontal: 8 },
  },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total hoje',
            fontSize: '11px',
            fontFamily: 'Roboto, sans-serif',
            color: '#9e9e9e',
            formatter: () => `${props.stats.totalAgendamentos}`,
          },
          value: {
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'Roboto, sans-serif',
            color: '#212121',
          },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: {
    y: { formatter: (val: number) => `${val} agendamento${val !== 1 ? 's' : ''}` },
  },
}));

const series = computed(() => [
  agendados.value,
  props.stats.emAndamento,
  props.stats.finalizados,
  props.stats.atrasados,
  props.stats.cancelados ?? 0,
]);

const statusItems = computed(() => [
  { label: 'Aguardando',   value: agendados.value,          color: '#7E57C2', bg: 'deep-purple-lighten-5' },
  { label: 'Em Andamento', value: props.stats.emAndamento,  color: '#195FA0', bg: 'blue-lighten-5' },
  { label: 'Finalizados',  value: props.stats.finalizados,  color: '#4CAF50', bg: 'green-lighten-5' },
  { label: 'Atrasados',    value: props.stats.atrasados,    color: '#EF5350', bg: 'red-lighten-5' },
  { label: 'Cancelados',   value: props.stats.cancelados ?? 0, color: '#9E9E9E', bg: 'grey-lighten-4' },
]);
</script>

<style scoped>
.premium-card {
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}
</style>
