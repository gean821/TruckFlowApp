<template>
  <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
    <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Pátio agora</h3>
    <div class="text-caption text-grey-darken-1 mb-4">Tempos das descargas concluídas hoje</div>

    <div class="d-flex align-end mb-4" style="gap: 8px">
      <span class="text-h3 font-weight-bold text-grey-darken-4">{{ patio.noPatio }}</span>
      <span class="text-body-2 text-grey-darken-1 mb-2">{{ patio.noPatio === 1 ? "caminhão" : "caminhões" }} no pátio</span>
    </div>

    <v-row dense class="mb-3">
      <v-col v-for="m in metricas" :key="m.rotulo" cols="4">
        <div class="metrica pa-2 rounded-lg text-center">
          <div class="text-body-1 font-weight-bold text-grey-darken-4">{{ formatarDuracao(m.valor) }}</div>
          <div class="text-caption text-grey-darken-1">{{ m.rotulo }}</div>
        </div>
      </v-col>
    </v-row>

    <div v-if="patio.maisAntigo" class="mais-antigo pa-3 rounded-lg d-flex align-center">
      <v-icon color="warning" class="mr-3">mdi-clock-alert-outline</v-icon>
      <div class="flex-grow-1">
        <div class="text-caption text-grey-darken-1">Há mais tempo no pátio</div>
        <div class="text-body-2 font-weight-bold">
          {{ patio.maisAntigo.placa || "Sem placa" }}
          <span class="text-grey-darken-1 font-weight-regular">• {{ patio.maisAntigo.doca || "—" }}</span>
        </div>
      </div>
      <div class="text-body-2 font-weight-bold" :class="(patio.maisAntigo.minutos ?? 0) > 90 ? 'text-error' : 'text-warning'">
        {{ formatarDuracao(patio.maisAntigo.minutos) }}
      </div>
    </div>
    <div v-else class="text-caption text-grey">Nenhum caminhão no pátio agora.</div>

    <div class="text-caption text-grey mt-3">
      <v-icon size="12" class="mr-1">mdi-information-outline</v-icon>
      Início da descarga estimado pela fila da doca até haver registro real.
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DashboardHojePatio } from "@/entities/dashboardHoje.types";
import { formatarDuracao } from "@/utils/relatorioFormat";

const props = defineProps<{ patio: DashboardHojePatio }>();

const metricas = computed(() => [
  { rotulo: "Espera", valor: props.patio.esperaMediaMin },
  { rotulo: "Descarga", valor: props.patio.descargaMediaMin },
  { rotulo: "Permanência", valor: props.patio.permanenciaMediaMin },
]);
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.metrica {
  background: #f8fafc;
  border: 1px solid #eef2f7;
}
.mais-antigo {
  background: #fffbeb;
  border: 1px solid #fef3c7;
}
</style>
