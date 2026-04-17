<template>
  <div class="bg-grey-lighten-5 pa-4">
    <div v-if="isLoading" class="d-flex justify-center pa-4">
      <v-progress-circular indeterminate color="primary" size="32" />
    </div>

    <div v-else-if="!dashboard" class="pa-2 text-caption text-grey">
      Não foi possível carregar o dashboard.
    </div>

    <div v-else>
      <div class="d-flex gap-2 mb-3">
        <v-chip size="x-small" color="blue-lighten-5" variant="flat" class="font-weight-bold">
          Hoje: {{ toneladas(dashboard.totalDiarioRecebido) }} / {{ toneladas(dashboard.totalDiario) }}
        </v-chip>
        <v-chip size="x-small" color="green-lighten-5" variant="flat" class="font-weight-bold">
          Vigência: {{ toneladas(dashboard.totalRecebido) }} / {{ toneladas(dashboard.totalPlanejado) }}
        </v-chip>
      </div>

      <div class="text-overline text-grey mb-2 font-weight-bold">
        ITENS ({{ dashboard.itens.length }})
      </div>

      <div
        v-for="item in dashboard.itens"
        :key="item.id"
        class="mb-3 bg-white pa-3 rounded border"
      >
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 font-weight-bold text-grey-darken-3">
              {{ item.produto }}
            </span>
            <v-chip
              v-if="item.congelado"
              size="x-small"
              color="red-lighten-4"
              variant="flat"
              class="font-weight-bold"
            >
              <v-icon size="x-small" class="mr-1">mdi-snowflake</v-icon>
              Grade Congelada
            </v-chip>
            <v-chip
              v-else-if="!item.operaNoDia"
              size="x-small"
              color="grey-lighten-3"
              variant="flat"
            >
              Sem operação hoje
            </v-chip>
          </div>
          <v-chip
            v-if="item.faltaReceber === 0"
            size="x-small"
            color="success"
            variant="flat"
            class="font-weight-bold"
          >
            Meta Total Atingida
          </v-chip>
        </div>

        <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1">
          <span>
            Meta diária: <strong>{{ toneladas(item.cadenciaDiariaPlanejada) }}</strong>
            <span class="text-grey"> + {{ toneladas(item.toleranciaExtra) }} tol.</span>
          </span>
          <span>
            Hoje: <strong>{{ toneladas(item.recebidoNoDia) }}</strong>
          </span>
        </div>

        <v-progress-linear
          :model-value="percentualDia(item)"
          :color="item.congelado ? 'red-lighten-2' : 'blue'"
          height="4"
          rounded
          class="mb-2"
        />

        <div class="d-flex justify-space-between text-caption text-grey-darken-1">
          <span>Planejado: <strong>{{ toneladas(item.quantidadeTotalPlanejada) }}</strong></span>
          <span>Recebido: <strong>{{ toneladas(item.quantidadeTotalRecebida) }}</strong></span>
          <span>Falta: <strong>{{ toneladas(item.faltaReceber) }}</strong></span>
        </div>

        <v-progress-linear
          :model-value="percentualTotal(item)"
          color="success"
          height="4"
          rounded
          class="mt-1"
        />

        <div class="text-caption text-grey mt-2">
          <v-icon size="x-small" class="mr-1">mdi-calendar-week</v-icon>
          {{ formatDias(item.diasSemana) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { usePlanejamentoDashboardQuery } from "@/queries/planejamento.queries";
import type { IPlanejamentoDashboardItem } from "@/Dtos/Recebimento/IPlanejamentoDashboard";

const props = defineProps<{ planejamentoId: string }>();

const idRef = toRef(props, "planejamentoId");
const { data: dashboard, isLoading } = usePlanejamentoDashboardQuery(idRef);
void computed;

const diasLabel: Record<string, string> = {
  "0": "Dom",
  "1": "Seg",
  "2": "Ter",
  "3": "Qua",
  "4": "Qui",
  "5": "Sex",
  "6": "Sáb"
};

function toneladas(v: number | null | undefined) {
  if (v === null || v === undefined) return "0 T";
  return `${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} T`;
}

function percentualDia(item: IPlanejamentoDashboardItem) {
  const limite = item.cadenciaDiariaPlanejada + item.toleranciaExtra;
  if (limite <= 0) return 0;
  return Math.min(100, Math.round((item.recebidoNoDia / limite) * 100));
}

function percentualTotal(item: IPlanejamentoDashboardItem) {
  if (item.quantidadeTotalPlanejada <= 0) return 0;
  return Math.min(
    100,
    Math.round((item.quantidadeTotalRecebida / item.quantidadeTotalPlanejada) * 100)
  );
}

function formatDias(dias: string) {
  if (!dias) return "—";
  return dias
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => diasLabel[d] ?? d)
    .join(" · ");
}
</script>
