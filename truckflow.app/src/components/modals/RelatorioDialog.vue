<template>
  <v-dialog v-model="open" max-width="920" scrollable>
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center bg-primary text-white pa-4">
        <v-icon class="mr-2">mdi-chart-box-outline</v-icon>
        <span class="text-h6 font-weight-bold">Relatório do Planejamento</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="white" @click="open = false" />
      </v-card-title>

      <v-card-text class="pa-5">
        <div v-if="isLoading" class="d-flex justify-center pa-6">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>

        <div v-else-if="!relatorio" class="text-center text-grey pa-6">
          Nenhum dado disponível.
        </div>

        <div v-else>
          <div class="mb-4">
            <div class="d-flex justify-space-between flex-wrap gap-2">
              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ relatorio.fornecedorNome }}
                </div>
                <div class="text-caption text-grey">
                  {{ formatDate(relatorio.dataInicio) }} → {{ formatDate(relatorio.dataFim) }}
                </div>
              </div>
              <v-chip size="small" variant="flat" :color="statusColor(relatorio.status)">
                {{ formatStatus(relatorio.status) }}
              </v-chip>
            </div>
          </div>

          <v-row dense class="mb-4">
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="primary" class="pa-3">
                <div class="text-caption text-grey-darken-1">Total Planejado</div>
                <div class="text-h6 font-weight-bold">
                  {{ toneladas(relatorio.totalPlanejado) }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="success" class="pa-3">
                <div class="text-caption text-grey-darken-1">Total Recebido</div>
                <div class="text-h6 font-weight-bold">
                  {{ toneladas(relatorio.totalRecebido) }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="tonal" color="grey" class="pa-3">
                <div class="text-caption text-grey-darken-1">Restante</div>
                <div class="text-h6 font-weight-bold">
                  {{ toneladas(relatorio.totalRestante) }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-caption font-weight-bold text-grey-darken-2">
              Percentual atingido
            </div>
            <div class="text-caption font-weight-bold">{{ relatorio.percentualAtingido }}%</div>
          </div>
          <v-progress-linear
            :model-value="relatorio.percentualAtingido"
            color="success"
            height="8"
            rounded
            class="mb-5"
          />

          <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">
            ITENS ({{ relatorio.itens.length }})
          </div>

          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th>Produto</th>
                <th class="text-right">Planejado</th>
                <th class="text-right">Recebido</th>
                <th class="text-right">Falta</th>
                <th class="text-right">%</th>
                <th>Dias</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in relatorio.itens" :key="item.id">
                <td class="font-weight-medium">{{ item.produto }}</td>
                <td class="text-right">{{ toneladas(item.quantidadeTotalPlanejada) }}</td>
                <td class="text-right">{{ toneladas(item.quantidadeTotalRecebida) }}</td>
                <td class="text-right">{{ toneladas(item.faltaReceber) }}</td>
                <td class="text-right">{{ item.percentualAtingido }}%</td>
                <td class="text-caption">{{ formatDias(item.diasSemana) }}</td>
              </tr>
            </tbody>
          </v-table>

          <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">
            HISTÓRICO DE RECEBIMENTOS ({{ relatorio.eventos.length }})
          </div>

          <div v-if="relatorio.eventos.length === 0" class="text-caption text-grey pa-2">
            Nenhum recebimento registrado.
          </div>

          <v-table v-else density="compact">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th class="text-right">Quantidade</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in relatorio.eventos" :key="e.id">
                <td>{{ formatDateTime(e.dataRecebimento) }}</td>
                <td>{{ e.produto }}</td>
                <td class="text-right">{{ toneladas(e.quantidade) }}</td>
                <td class="text-caption">{{ e.observacao || "—" }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="open = false">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { format, parseISO } from "date-fns";
import { usePlanejamentoRelatorioQuery } from "@/queries/planejamento.queries";

const props = defineProps<{
  modelValue: boolean;
  planejamentoId: string | null;
}>();

const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v)
});

const idRef = toRef(props, "planejamentoId");
const enabled = computed(() => props.modelValue && !!props.planejamentoId);
const { data: relatorio, isLoading } = usePlanejamentoRelatorioQuery(idRef, enabled);

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

function formatDate(d: string) {
  if (!d) return "-";
  return format(parseISO(d), "dd/MM/yyyy");
}

function formatDateTime(d: string) {
  if (!d) return "-";
  return format(parseISO(d), "dd/MM/yyyy HH:mm");
}

function formatStatus(s: string) {
  if (!s) return "-";
  return s.replace(/([A-Z])/g, " $1").trim();
}

function statusColor(s: string) {
  switch (s?.toLowerCase()) {
    case "planejado": return "primary";
    case "emandamento": return "warning";
    case "concluido": return "success";
    case "encerrado": return "grey";
    default: return "grey";
  }
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
