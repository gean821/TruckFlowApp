<template>
  <v-card elevation="0" class="rounded-xl pa-6 h-100 premium-card">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold">Status Operacional</h3>
      <v-chip size="small" color="success" variant="flat" prepend-icon="mdi-check-circle">
        Operação Normal
      </v-chip>
    </div>

    <v-row align="center" justify="center">

      <v-col cols="12" sm="5" class="d-flex flex-column align-center">
        <span class="text-overline text-grey-darken-1 mb-2">Locais de Descarga</span>

        <apexchart
          type="donut"
          height="190"
          width="190"
          :options="dockChartOptions"
          :series="dockSeries"
        />

        <div class="d-flex gap-5 mt-4">
          <div class="d-flex flex-column align-center">
            <div class="d-flex align-center gap-1 mb-1">
              <span class="dot dot-green"></span>
              <span class="text-caption text-grey-darken-1 ml-2">Livres</span>
            </div>
            <span class="text-h6 font-weight-bold" style="color: #4CAF50">{{ docas.livres ?? 0 }}</span>
          </div>

          <v-divider vertical class="mx-1" />

          <div class="d-flex flex-column align-center">
            <div class="d-flex align-center gap-1 mb-1">
              <span class="dot dot-red"></span>
              <span class="text-caption text-grey-darken-1 ml-2">Desativadas</span>
            </div>
            <span class="text-h6 font-weight-bold" style="color: #EF5350">{{ docas.ocupadas ?? 0 }}</span>
          </div>

          <v-divider vertical class="mx-1" />

          <div class="d-flex flex-column align-center">
            <div class="d-flex align-center gap-1 mb-1">
              <span class="dot dot-grey"></span>
              <span class="text-caption text-grey-darken-1 ml-2">Total</span>
            </div>
            <span class="text-h6 font-weight-bold text-grey-darken-3">{{ docas.total ?? 0 }}</span>
          </div>
        </div>
      </v-col>

      <v-divider vertical class="d-none d-sm-flex mx-3" style="min-height: 160px;" />

      <v-col cols="12" sm="6" class="d-flex flex-column justify-center px-5">
        <span class="text-overline text-grey-darken-1 mb-3">Meta de Descarga Diária</span>

        <div class="d-flex align-center justify-space-between mb-1">
          <div>
            <span class="text-h3 font-weight-bold text-grey-darken-3">{{ totalTon }}</span>
            <span class="text-body-1 text-grey ml-1">Ton</span>
          </div>
          <v-chip
            size="small"
            :color="progressColor"
            variant="tonal"
            class="font-weight-bold text-body-1 px-3"
          >
            {{ volumeProgress }}%
          </v-chip>
        </div>

        <v-progress-linear
          :model-value="volumeProgress"
          height="8"
          rounded
          :color="progressColor"
          bg-color="grey-lighten-3"
          class="mb-2"
        />

        <span class="text-caption text-grey">{{ volumeProgress }}% da meta atingida hoje</span>
      </v-col>

    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ docas: any; volume: any }>();

const dockChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
  },
  labels: ['Livres', 'Desativadas'],
  colors: ['#4CAF50', '#EF5350'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
            color: '#9e9e9e',
            formatter: () => `${props.docas.total ?? 0}`,
          },
          value: {
            fontSize: '24px',
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
    y: { formatter: (val: number) => `${val} doca${val !== 1 ? 's' : ''}` },
  },
}));

const dockSeries = computed(() => {
  const livres = props.docas?.livres ?? 0;
  const desativadas = props.docas?.ocupadas ?? 0;
  return livres === 0 && desativadas === 0 ? [1, 0] : [livres, desativadas];
});

const volumeProgress = computed(() => props.volume?.progressoDiario ?? 0);
const totalTon = computed(() => ((props.volume?.totalKg ?? 0) / 1000).toFixed(1));

const progressColor = computed(() => {
  if (volumeProgress.value >= 80) return '#4CAF50';
  if (volumeProgress.value >= 50) return '#FF9800';
  return '#195FA0';
});
</script>

<style scoped>
.premium-card {
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.dot-green { background-color: #4CAF50; }
.dot-red   { background-color: #EF5350; }
.dot-grey  { background-color: #9E9E9E; }
</style>
