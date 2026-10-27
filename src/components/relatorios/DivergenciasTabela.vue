<template>
  <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
    <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Maiores divergências nota × recebido</h3>
    <div class="text-caption text-grey-darken-1 mb-3">Descargas em que a quantidade lançada diferiu do peso da nota</div>

    <div v-if="!divergencias.length" class="d-flex flex-column align-center justify-center text-grey py-8">
      <v-icon size="32" class="mb-2 text-grey-lighten-1">mdi-scale-balance</v-icon>
      <div class="text-body-2 text-center">{{ semConferencia ? "Nenhuma descarga teve a quantidade recebida lançada no período" : "Nenhuma divergência no período" }}</div>
    </div>

    <v-table v-else density="comfortable" class="tabela">
      <thead>
        <tr>
          <th>Data</th>
          <th>Placa / NF</th>
          <th>Fornecedor</th>
          <th class="text-right">Nota</th>
          <th class="text-right">Recebido</th>
          <th class="text-right">Diferença</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in divergencias" :key="d.agendamentoId">
          <td>{{ formatarDataHora(d.dataInicio) }}</td>
          <td>
            <div class="font-weight-bold">{{ d.placa || "—" }}</div>
            <div class="text-caption text-grey-darken-1">NF {{ d.notaNumero ?? "—" }}</div>
          </td>
          <td>
            <div>{{ d.fornecedor || "—" }}</div>
            <div class="text-caption text-grey-darken-1">{{ d.produto || "" }}</div>
          </td>
          <td class="text-right">{{ formatarToneladas(d.pesoNotaKg) }}</td>
          <td class="text-right">{{ formatarToneladas(d.pesoRecebidoKg) }}</td>
          <td class="text-right">
            <v-chip size="small" :color="d.diferencaKg < 0 ? 'error' : 'success'" variant="tonal" class="font-weight-bold">
              {{ d.diferencaKg > 0 ? "+" : "" }}{{ formatarNumero(d.diferencaKg) }} kg
              <span class="ml-1 font-weight-regular">({{ d.diferencaKg > 0 ? "+" : "" }}{{ formatarPct(d.diferencaPct, 2) }})</span>
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import type { RecebimentosDivergencia } from "@/entities/relatorioBi.types";
import { formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

defineProps<{ divergencias: RecebimentosDivergencia[]; semConferencia: boolean }>();

const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.tabela :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
}
</style>
