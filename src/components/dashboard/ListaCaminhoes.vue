<template>
  <v-card elevation="0" class="rounded-xl pa-5 painel h-100 d-flex flex-column">
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">{{ titulo }}</h3>
        <div class="text-caption text-grey-darken-1">{{ subtitulo }}</div>
      </div>
      <v-chip size="small" :color="cor" variant="tonal" class="font-weight-bold">{{ caminhoes.length }}</v-chip>
    </div>

    <div v-if="caminhoes.length === 0" class="flex-grow-1 d-flex flex-column align-center justify-center text-grey py-6">
      <v-icon size="32" class="mb-2 text-grey-lighten-1">{{ iconeVazio }}</v-icon>
      <div class="text-body-2">{{ textoVazio }}</div>
    </div>

    <div v-else class="lista flex-grow-1">
      <div v-for="c in caminhoes" :key="c.agendamentoId" class="item d-flex align-center py-2">
        <div class="hora text-center mr-3">
          <div class="text-body-2 font-weight-bold text-grey-darken-4">{{ formatarHora(c.dataInicio) }}</div>
          <div class="text-caption" :class="`text-${cor}`">{{ rotuloMinutos(c.minutos) }}</div>
        </div>
        <div class="flex-grow-1 overflow-hidden">
          <div class="text-body-2 font-weight-bold text-truncate">
            {{ c.placa || "Sem placa" }}
            <span v-if="c.motorista" class="text-grey-darken-1 font-weight-regular">• {{ c.motorista }}</span>
          </div>
          <div class="text-caption text-grey-darken-1 text-truncate">
            {{ [c.fornecedor, c.produto, c.doca].filter(Boolean).join(" • ") || "—" }}
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { DashboardHojeCaminhao } from "@/entities/dashboardHoje.types";
import { formatarDuracao, formatarHora } from "@/utils/relatorioFormat";

const props = withDefaults(
  defineProps<{
    titulo: string;
    subtitulo: string;
    caminhoes: DashboardHojeCaminhao[];
    cor?: string;
    modo: "faltam" | "atraso";
    textoVazio: string;
    iconeVazio?: string;
  }>(),
  { cor: "primary", iconeVazio: "mdi-truck-outline" },
);

const rotuloMinutos = (minutos: number | null) =>
  props.modo === "faltam" ? `em ${formatarDuracao(minutos)}` : `${formatarDuracao(minutos)} atraso`;
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.lista {
  flex: 1 1 0;
  min-height: 320px;
  overflow-y: auto;
}
.item + .item {
  border-top: 1px solid #f1f5f9;
}
.hora {
  flex: 0 0 auto;
  min-width: 96px;
  white-space: nowrap;
}
</style>
