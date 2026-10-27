<template>
  <v-dialog :model-value="modelValue" max-width="1100" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5 pb-2">
        <div>
          <div class="text-h6 font-weight-bold">{{ titulo }}</div>
          <div class="text-caption text-grey-darken-1">
            {{ descreverPeriodo(filtro.dataInicio, filtro.dataFim) }} • {{ total }} agendamento{{ total === 1 ? "" : "s" }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" />
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table-server
          v-model:items-per-page="porPagina"
          v-model:page="pagina"
          :headers="colunas"
          :items="itens"
          :items-length="total"
          :loading="isFetching"
          density="comfortable"
          loading-text="Carregando agendamentos..."
          no-data-text="Nenhum agendamento encontrado"
          items-per-page-text="Por página"
          class="drill-tabela"
        >
          <template #item.dataInicio="{ item }">
            {{ formatarDataHora(item.dataInicio) }}
          </template>
          <template #item.motoristaNome="{ item }">
            {{ item.motoristaNome || "—" }}
          </template>
          <template #item.placaVeiculo="{ item }">
            <span class="font-weight-medium">{{ item.placaVeiculo || "—" }}</span>
          </template>
          <template #item.pesoCarga="{ item }">
            {{ item.pesoCarga ? formatarToneladas(item.pesoCarga) : "—" }}
          </template>
          <template #item.status="{ item }">
            <v-chip size="x-small" :color="corStatus(item.status)" variant="tonal" class="font-weight-medium">
              {{ rotuloStatus(item.status) }}
            </v-chip>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAgendamentoQuery } from "@/queries/agendamento.queries";
import { descreverPeriodo, formatarToneladas } from "@/utils/relatorioFormat";

export interface FiltroDrillDown {
  dataInicio: string;
  dataFim: string;
  status?: string;
  fornecedorId?: string | null;
  produtoId?: string | null;
  unidadeEntregaId?: string | null;
  localDescargaId?: string | null;
}

const props = defineProps<{ modelValue: boolean; titulo: string; filtro: FiltroDrillDown }>();
const emit = defineEmits<{ "update:modelValue": [valor: boolean] }>();

const pagina = ref(1);
const porPagina = ref(10);

watch(
  () => props.filtro,
  () => (pagina.value = 1),
  { deep: true },
);

const parametros = computed(() => ({
  dataInicio: props.filtro.dataInicio,
  dataFim: props.filtro.dataFim,
  status: props.filtro.status,
  fornecedorId: props.filtro.fornecedorId ?? undefined,
  produtoId: props.filtro.produtoId ?? undefined,
  unidadeEntregaId: props.filtro.unidadeEntregaId ?? undefined,
  localDescargaId: props.filtro.localDescargaId ?? undefined,
  ocultarVagasLivres: true,
  pageNumber: pagina.value,
  pageSize: porPagina.value,
}));

const habilitado = computed(() => props.modelValue);
const { data, isFetching } = useAgendamentoQuery(parametros, { enabled: habilitado });

const itens = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.totalCount ?? 0);

const colunas = [
  { title: "Data", key: "dataInicio", sortable: false },
  { title: "Motorista", key: "motoristaNome", sortable: false },
  { title: "Placa", key: "placaVeiculo", sortable: false },
  { title: "Fornecedor", key: "fornecedorNome", sortable: false },
  { title: "Produto", key: "produto", sortable: false },
  { title: "Unidade", key: "unidadeEntrega", sortable: false },
  { title: "Carga", key: "pesoCarga", sortable: false, align: "end" as const },
  { title: "Status", key: "status", sortable: false },
];

const STATUS: Record<string, { rotulo: string; cor: string }> = {
  Agendado: { rotulo: "Agendado", cor: "purple" },
  EmAndamento: { rotulo: "No pátio", cor: "blue" },
  Finalizado: { rotulo: "Concluído", cor: "success" },
  Cancelado: { rotulo: "Cancelado", cor: "grey" },
  Expirado: { rotulo: "Não compareceu", cor: "error" },
};

const rotuloStatus = (status: string) => STATUS[status]?.rotulo ?? status;
const corStatus = (status: string) => STATUS[status]?.cor ?? "grey";

const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
</script>

<style scoped>
.drill-tabela :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
}
</style>
