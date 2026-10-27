<template>
  <v-card elevation="0" class="rounded-xl pa-5 painel">
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Fornecedor × produto</h3>
        <div class="text-caption text-grey-darken-1">Toneladas pela nota fiscal, com totais por linha e coluna</div>
      </div>
      <v-btn variant="text" size="small" prepend-icon="mdi-file-delimited-outline" :disabled="!matriz.linhas.length" @click="exportar">CSV</v-btn>
    </div>

    <div v-if="!matriz.linhas.length" class="text-center text-grey py-8">Sem recebimentos no período</div>

    <div v-else class="tabela-scroll">
      <table class="matriz">
        <thead>
          <tr>
            <th class="text-left">Fornecedor</th>
            <th v-for="produto in matriz.produtos" :key="produto" class="text-right">{{ produto }}</th>
            <th class="text-right">Total</th>
            <th class="text-right">Descargas</th>
            <th class="text-right">% do total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="linha in matriz.linhas" :key="linha.fornecedor">
            <td class="font-weight-medium">{{ linha.fornecedor }}</td>
            <td
              v-for="produto in matriz.produtos"
              :key="produto"
              class="text-right celula"
              :style="{ background: fundo(linha.valores[produto] ?? 0) }"
            >
              {{ linha.valores[produto] ? formatarNumero(linha.valores[produto]! / 1000, 1) : "—" }}
            </td>
            <td class="text-right font-weight-bold">{{ formatarNumero(linha.total / 1000, 1) }}</td>
            <td class="text-right">{{ linha.descargas }}</td>
            <td class="text-right text-grey-darken-1">{{ formatarPct((linha.total * 100) / (matriz.totalGeral || 1)) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td v-for="produto in matriz.produtos" :key="produto" class="text-right">
              {{ formatarNumero((matriz.totalPorProduto[produto] ?? 0) / 1000, 1) }}
            </td>
            <td class="text-right">{{ formatarNumero(matriz.totalGeral / 1000, 1) }}</td>
            <td class="text-right">{{ matriz.linhas.reduce((s, l) => s + l.descargas, 0) }}</td>
            <td class="text-right">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { RecebimentosMatriz } from "@/entities/relatorioBi.types";
import { formatarNumero, formatarPct } from "@/utils/relatorioFormat";

const props = defineProps<{ matriz: RecebimentosMatriz; nomeArquivo: string }>();

const maximo = computed(() =>
  Math.max(1, ...props.matriz.linhas.flatMap((l) => props.matriz.produtos.map((p) => l.valores[p] ?? 0))),
);

const fundo = (valor: number) => (valor > 0 ? `rgba(25, 95, 160, ${0.06 + (valor / maximo.value) * 0.32})` : "transparent");

const exportar = () => {
  const m = props.matriz;
  const numero = (kg: number) => String(Math.round(kg) / 1000).replace(".", ",");
  const linhas = [
    ["Fornecedor", ...m.produtos, "Total (t)", "Descargas"],
    ...m.linhas.map((l) => [l.fornecedor, ...m.produtos.map((p) => numero(l.valores[p] ?? 0)), numero(l.total), String(l.descargas)]),
    ["Total", ...m.produtos.map((p) => numero(m.totalPorProduto[p] ?? 0)), numero(m.totalGeral), String(m.linhas.reduce((s, l) => s + l.descargas, 0))],
  ];
  const csv = linhas.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
  link.download = `${props.nomeArquivo}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.tabela-scroll {
  overflow-x: auto;
}
.matriz {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}
.matriz th {
  font-weight: 700;
  color: #475569;
  padding: 10px 12px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.matriz td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.matriz tbody tr:hover td {
  filter: brightness(0.97);
}
.celula {
  font-variant-numeric: tabular-nums;
}
.matriz tfoot td {
  font-weight: 800;
  color: #0f172a;
  border-top: 2px solid #e2e8f0;
  border-bottom: none;
  background: #f8fafc;
}
</style>
