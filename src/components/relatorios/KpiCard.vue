<template>
  <v-card
    elevation="0"
    class="rounded-xl pa-4 kpi-card h-100"
    :class="{ 'kpi-clicavel': clicavel }"
    @click="clicavel ? emit('clique') : undefined"
  >
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-caption font-weight-medium text-grey-darken-1 text-uppercase kpi-titulo">{{ titulo }}</span>
      <v-avatar :color="`${cor}-lighten-5`" size="32" rounded="lg">
        <v-icon :color="cor" size="18">{{ icone }}</v-icon>
      </v-avatar>
    </div>

    <div class="d-flex align-end justify-space-between" style="gap: 8px">
      <div>
        <div class="text-h5 font-weight-bold text-grey-darken-4 kpi-valor">{{ valor }}</div>
        <div class="d-flex align-center mt-1" style="gap: 6px">
          <v-chip v-if="variacao !== null" size="x-small" :color="corVariacao" variant="tonal" class="font-weight-bold px-2 flex-shrink-0">
            <v-icon start size="12">{{ variacao >= 0 ? "mdi-trending-up" : "mdi-trending-down" }}</v-icon>
            {{ variacao >= 0 ? "+" : "" }}{{ formatarPct(variacao) }}
          </v-chip>
          <span class="text-caption text-grey" :class="{ 'text-no-wrap': variacao !== null }">{{ variacao !== null ? textoComparacao : detalhe ?? "sem comparação" }}</span>
        </div>
      </div>
      <v-chart v-if="serie.length > 1" :option="sparkline" :theme="TEMA" autoresize class="sparkline" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";
import { formatarPct } from "@/utils/relatorioFormat";
import { CORES, TEMA } from "./charts/echarts";

const props = withDefaults(
  defineProps<{
    titulo: string;
    valor: string;
    icone: string;
    cor?: string;
    variacao?: number | null;
    serie?: number[];
    inverter?: boolean;
    detalhe?: string;
    clicavel?: boolean;
    textoComparacao?: string;
  }>(),
  { cor: "primary", variacao: null, serie: () => [], inverter: false, clicavel: false, textoComparacao: "vs anterior" },
);

const emit = defineEmits<{ clique: [] }>();

const corVariacao = computed(() => {
  if (props.variacao === null) return "grey";
  const melhorou = props.inverter ? props.variacao <= 0 : props.variacao >= 0;
  return melhorou ? "success" : "error";
});

const corLinha = computed(() => (corVariacao.value === "error" ? CORES.perigo : corVariacao.value === "success" ? CORES.sucesso : CORES.primaria));

const sparkline = computed<EChartsOption>(() => ({
  animationDuration: 600,
  grid: { left: 0, right: 0, top: 4, bottom: 2 },
  xAxis: { type: "category", show: false, boundaryGap: false, data: props.serie.map((_, i) => i) },
  yAxis: { type: "value", show: false, min: "dataMin" },
  series: [
    {
      type: "line",
      data: props.serie,
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2, color: corLinha.value },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${corLinha.value}55` },
            { offset: 1, color: `${corLinha.value}00` },
          ],
        },
      },
    },
  ],
}));
</script>

<style scoped>
.kpi-card {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.kpi-clicavel {
  cursor: pointer;
}
.kpi-clicavel:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px rgba(25, 95, 160, 0.15), 0 12px 32px rgba(15, 23, 42, 0.1);
}
.kpi-titulo {
  letter-spacing: 0.04em;
}
.kpi-valor {
  line-height: 1.1;
}
.sparkline {
  flex: 0 1 92px;
  min-width: 48px;
  width: 92px;
  height: 40px;
}
</style>
