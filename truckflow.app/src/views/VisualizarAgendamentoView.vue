<template>
  <v-container fluid class="pa-6">
    <v-card elevation="0" class="border rounded-xl bg-white">

      <div class="pa-5 border-b bg-grey-lighten-5">
        <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-4">
          <div class="d-flex align-center">
            <v-avatar color="#195FA0" variant="flat" class="mr-3" rounded="lg" size="40">
              <v-icon color="white" size="20">mdi-calendar-clock</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="line-height: 1.2">
                Gestão de Agendamentos
              </h2>
              <div class="text-caption text-grey">
                Acompanhe a grade de horários e status de recebimento
              </div>
            </div>
          </div>

          <div class="d-flex align-center gap-2">
            <v-btn-toggle
              v-model="periodoPreset"
              density="compact"
              color="primary"
              variant="outlined"
              mandatory
              divided
            >
              <v-btn value="hoje" size="small">Hoje</v-btn>
              <v-btn value="semana" size="small">Semana</v-btn>
              <v-btn value="proxima" size="small">Próx. 7</v-btn>
              <v-btn value="custom" size="small">Custom</v-btn>
            </v-btn-toggle>

            <v-btn
              icon="mdi-refresh"
              variant="text"
              color="grey-darken-1"
              :loading="isFetching"
              @click="refetch()"
            />

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              height="40"
              class="text-capitalize px-5"
              elevation="0"
              rounded="lg"
              @click="criarAgendamento"
            >
              Agendamento Avulso
            </v-btn>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3">
          <v-text-field
            v-model="search"
            density="compact"
            variant="outlined"
            label="Buscar (placa, motorista, produto, fornecedor...)"
            prepend-inner-icon="mdi-magnify"
            hide-details
            bg-color="white"
            style="min-width: 260px; flex: 1 1 260px;"
            clearable
          />

          <v-text-field
            v-model="filtroDataInicio"
            type="date"
            label="Início"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 160px;"
            :disabled="periodoPreset !== 'custom'"
          />

          <v-text-field
            v-model="filtroDataFim"
            type="date"
            label="Fim"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 160px;"
            :disabled="periodoPreset !== 'custom'"
          />

          <v-autocomplete
            v-model="filtroFornecedor"
            :items="fornecedores"
            item-title="nome"
            item-value="id"
            label="Fornecedor"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 200px;"
            clearable
            placeholder="Todos"
          />

          <v-autocomplete
            v-model="filtroUnidade"
            :items="unidades"
            item-title="nome"
            item-value="id"
            label="Unidade Entrega"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 200px;"
            clearable
            placeholder="Todas"
          />

          <v-autocomplete
            v-model="filtroProduto"
            :items="produtos"
            item-title="nome"
            item-value="id"
            label="Produto"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 200px;"
            clearable
            placeholder="Todos"
          />

          <v-select
            v-model="filtroStatus"
            :items="statusOptions"
            label="Status"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 170px;"
            clearable
            placeholder="Todos"
          />

          <v-select
            v-model="filtroTipoVeiculo"
            :items="tipoVeiculoOptions"
            label="Tipo Veículo"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            style="max-width: 190px;"
            clearable
            placeholder="Todos"
          />
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="data?.items ?? []"
        :loading="isLoading"
        :page="page"
        :items-per-page="pageSize"
        :items-length="data?.totalCount ?? 0"
        item-value="id"
        hover
        density="comfortable"
        class="agendamento-table custom-typography"
        @update:page="page = $event"
        @update:items-per-page="pageSize = $event"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@6" />
        </template>

        <template v-slot:no-data>
          <div class="pa-8 text-center text-grey">
            <v-icon size="40" class="mb-2 opacity-50">mdi-calendar-remove-outline</v-icon>
            <p>Nenhum agendamento encontrado para os filtros selecionados.</p>
          </div>
        </template>

        <template #item.dataInicio="{ item }">
          <div class="d-flex flex-column py-2">
            <div class="d-flex align-center">
              <v-icon icon="mdi-clock-outline" size="small" class="mr-1 text-primary" />
              <span class="font-weight-bold text-body-2">
                {{ formatTime(item.dataInicio) }} - {{ formatTime(item.dataFim) }}
              </span>
            </div>
            <span class="text-caption text-grey ml-5">
              {{ formatDate(item.dataInicio) }}
            </span>
          </div>
        </template>

        <template #item.produto="{ value }">
          <v-chip size="small" color="blue-grey" variant="tonal" class="font-weight-bold">
            {{ value || "Carga Geral" }}
          </v-chip>
        </template>

        <template #item.fornecedorNome="{ value }">
          <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ value }}</span>
        </template>

        <template #item.motoristaNome="{ item }">
          <div v-if="item.motoristaNome" class="d-flex flex-column">
            <span class="text-body-2 font-weight-medium">{{ item.motoristaNome }}</span>
            <div class="d-flex align-center mt-1">
              <v-icon icon="mdi-truck-outline" size="x-small" class="mr-1 text-grey" />
              <span class="text-caption text-grey-darken-1">{{ item.placaVeiculo }}</span>
            </div>
          </div>
          <div v-else class="text-caption text-grey-lighten-1 font-italic">
            -- Aguardando --
          </div>
        </template>

        <template #item.tipoVeiculo="{ value }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-truck-cargo-container" size="small" class="mr-2 text-grey-darken-1" />
            <span class="text-body-2 text-grey-darken-3 text-capitalize">
              {{ formatTipoVeiculo(value) }}
            </span>
          </div>
        </template>

        <template #item.pesoCarga="{ value }">
          <span :class="value > 0 ? 'text-grey-darken-3' : 'text-grey-lighten-1'">
            {{ value > 0 ? value.toLocaleString("pt-BR") : "-" }}
            <small v-if="value > 0">kg</small>
          </span>
        </template>

        <template #item.status="{ value }">
          <v-chip
            size="small"
            :color="getStatusColor(value)"
            variant="flat"
            class="font-weight-bold text-uppercase"
          >
            {{ formatStatus(value) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center align-center ga-2">
            <v-tooltip
              text="Registrar Chegada (Check-in)"
              location="top"
              v-if="isStatus(item.status, 'Agendado') || isStatus(item.status, 'Confirmado')"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-login-variant"
                  color="blue-darken-2"
                  variant="tonal"
                  size="small"
                  v-bind="props"
                  @click="handleCheckIn(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip
              text="Finalizar Operação (Check-out)"
              location="top"
              v-if="isStatus(item.status, 'EmAndamento')"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-check-all"
                  color="green-darken-1"
                  variant="tonal"
                  size="small"
                  v-bind="props"
                  @click="handleCheckout(item)"
                />
              </template>
            </v-tooltip>

            <v-menu
              v-if="
                !isStatus(item.status, 'Finalizado') &&
                !isStatus(item.status, 'Concluido') &&
                !isStatus(item.status, 'Cancelado')
              "
            >
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
              </template>

              <v-list density="compact">
                <v-list-item @click="" prepend-icon="mdi-pencil">
                  <v-list-item-title>Editar Dados</v-list-item-title>
                </v-list-item>
                <v-divider class="my-1" />
                <v-list-item
                  @click="handleCancelar(item)"
                  prepend-icon="mdi-cancel"
                  base-color="red"
                >
                  <v-list-item-title class="text-red">Cancelar Agendamento</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <AgendamentoAvulsoModal @saved="refetch()" v-model="showDialogAvulso" />

    <ConfirmDialog
      v-model="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :color="confirmDialog.color"
      :icon="confirmDialog.icon"
      :confirm-text="confirmDialog.confirmText"
      :loading="loadingAction === 'dialog'"
      @confirm="executeConfirmAction"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { format, parseISO } from "date-fns";
import { useRoute, useRouter } from "vue-router";

import AgendamentoAvulsoModal from "@/components/modals/AgendamentoAvulsoModal.vue";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";

import type IAgendamentoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import { useAgendamentoQuery } from "@/queries/agendamento.queries";
import { useAgendamento } from "@/hooks/useAgendamento";
import { useFornecedor } from "@/hooks/useFornecedor";
import { useUnidadeEntrega } from "@/hooks/useUnidadeEntrega";
import { useProduto } from "@/hooks/useProdutos";

import { TipoVeiculoLabels } from "@/utils/tipoVeiculoLabels";

type PeriodoPreset = "hoje" | "semana" | "proxima" | "custom";

const route = useRoute();
const router = useRouter();

const { fornecedores } = useFornecedor();
const { unidades } = useUnidadeEntrega();
const { produtos } = useProduto();
const { checkIn, checkOut, cancelar } = useAgendamento();

const search = ref(route.query.search?.toString() || "");
const searchDebounced = ref(search.value);

const periodoPreset = ref<PeriodoPreset>(
  (route.query.periodo?.toString() as PeriodoPreset) || "semana"
);
const filtroDataInicio = ref(route.query.dataInicio?.toString() || "");
const filtroDataFim = ref(route.query.dataFim?.toString() || "");

const filtroFornecedor = ref(route.query.fornecedor?.toString() || null);
const filtroUnidade = ref(route.query.unidade?.toString() || null);
const filtroProduto = ref(route.query.produto?.toString() || null);
const filtroStatus = ref(route.query.status?.toString() || null);
const filtroTipoVeiculo = ref<number | null>(
  route.query.tipoVeiculo ? Number(route.query.tipoVeiculo) : null
);

const page = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.pageSize) || 20);

const showDialogAvulso = ref(false);
const loadingAction = ref<string | null>(null);

const confirmDialog = ref({
  show: false,
  title: "",
  message: "",
  color: "primary",
  icon: "mdi-help-circle-outline",
  confirmText: "Confirmar",
  action: null as (() => Promise<void>) | null,
});

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchDebounced.value = (val ?? "").toString();
  }, 350);
});

function applyPreset(preset: PeriodoPreset): { inicio: string; fim: string } {
  const hoje = new Date();
  const toIso = (d: Date) => format(d, "yyyy-MM-dd");

  if (preset === "hoje") {
    return { inicio: toIso(hoje), fim: toIso(hoje) };
  }

  if (preset === "semana") {
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    return { inicio: toIso(inicio), fim: toIso(fim) };
  }

  if (preset === "proxima") {
    const fim = new Date(hoje);
    fim.setDate(hoje.getDate() + 7);
    return { inicio: toIso(hoje), fim: toIso(fim) };
  }

  return { inicio: filtroDataInicio.value, fim: filtroDataFim.value };
}

watch(
  periodoPreset,
  (preset) => {
    if (preset !== "custom") {
      const { inicio, fim } = applyPreset(preset);
      filtroDataInicio.value = inicio;
      filtroDataFim.value = fim;
    }
  },
  { immediate: true }
);

watch(
  [
    searchDebounced,
    periodoPreset,
    filtroDataInicio,
    filtroDataFim,
    filtroFornecedor,
    filtroUnidade,
    filtroProduto,
    filtroStatus,
    filtroTipoVeiculo,
  ],
  () => {
    page.value = 1;
  }
);

const params = computed<IAgendamentoFilterDto>(() => ({
  search: searchDebounced.value || undefined,
  dataInicio: toStartOfDayIso(filtroDataInicio.value),
  dataFim: toEndOfDayIso(filtroDataFim.value),
  fornecedorId: filtroFornecedor.value || undefined,
  unidadeEntregaId: filtroUnidade.value || undefined,
  produtoId: filtroProduto.value || undefined,
  status: filtroStatus.value || undefined,
  tipoVeiculo:
    filtroTipoVeiculo.value !== null && filtroTipoVeiculo.value !== undefined
      ? Number(filtroTipoVeiculo.value)
      : undefined,
  pageNumber: page.value,
  pageSize: pageSize.value,
}));

const { data, isLoading, isFetching, refetch } = useAgendamentoQuery(params, {
  refetchInterval: 30_000,
});

watch(
  [
    searchDebounced,
    periodoPreset,
    filtroDataInicio,
    filtroDataFim,
    filtroFornecedor,
    filtroUnidade,
    filtroProduto,
    filtroStatus,
    filtroTipoVeiculo,
    page,
    pageSize,
  ],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        periodo: periodoPreset.value !== "semana" ? periodoPreset.value : undefined,
        dataInicio:
          periodoPreset.value === "custom" ? filtroDataInicio.value || undefined : undefined,
        dataFim:
          periodoPreset.value === "custom" ? filtroDataFim.value || undefined : undefined,
        fornecedor: filtroFornecedor.value || undefined,
        unidade: filtroUnidade.value || undefined,
        produto: filtroProduto.value || undefined,
        status: filtroStatus.value || undefined,
        tipoVeiculo:
          filtroTipoVeiculo.value !== null && filtroTipoVeiculo.value !== undefined
            ? String(filtroTipoVeiculo.value)
            : undefined,
        page: page.value !== 1 ? page.value : undefined,
        pageSize: pageSize.value !== 20 ? pageSize.value : undefined,
      },
    });
  }
);

const headers = [
  { title: "HORÁRIO / DATA", key: "dataInicio", width: "200px", align: "start" },
  { title: "PRODUTO", key: "produto", width: "150px" },
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "MOTORISTA / PLACA", key: "motoristaNome", width: "220px" },
  { title: "UNIDADE DE ENTREGA", key: "unidadeEntrega", width: "200px" },
  { title: "TIPO VEÍCULO", key: "tipoVeiculo", width: "180px" },
  { title: "PESO", key: "pesoCarga", align: "end", width: "120px" },
  { title: "STATUS", key: "status", align: "center", width: "140px" },
  { title: "AÇÕES", key: "actions", sortable: false, align: "center", width: "100px" },
] as const;

const statusOptions = [
  { title: "Disponível", value: "Disponivel" },
  { title: "Pendente", value: "Pendente" },
  { title: "Agendado", value: "Agendado" },
  { title: "Em Andamento", value: "EmAndamento" },
  { title: "Finalizado", value: "Finalizado" },
  { title: "Cancelado", value: "Cancelado" },
];

const tipoVeiculoOptions = computed(() =>
  Object.entries(TipoVeiculoLabels).map(([value, title]) => ({
    title,
    value: Number(value),
  }))
);

function askConfirmation(config: {
  title: string;
  message: string;
  color?: string;
  icon?: string;
  confirmText?: string;
  action: () => Promise<void>;
}) {
  confirmDialog.value = {
    show: true,
    title: config.title,
    message: config.message,
    color: config.color || "primary",
    icon: config.icon || "mdi-help-circle-outline",
    confirmText: config.confirmText || "Confirmar",
    action: config.action,
  };
}

async function handleCheckIn(item: any) {
  askConfirmation({
    title: "Confirmar Check-in",
    message: `Deseja registrar a entrada do veículo ${item.placaVeiculo || "sem placa"}?`,
    color: "blue-darken-2",
    icon: "mdi-login-variant",
    confirmText: "Confirmar Entrada",
    action: async () => {
      await checkIn(item.id);
      await refetch();
    },
  });
}

async function handleCheckout(item: any) {
  askConfirmation({
    title: "Finalizar Operação",
    message: "Confirmar liberação do veículo e conclusão da descarga?",
    color: "green-darken-1",
    icon: "mdi-check-all",
    confirmText: "Finalizar",
    action: async () => {
      await checkOut(item.id);
      await refetch();
    },
  });
}

async function handleCancelar(item: any) {
  askConfirmation({
    title: "Cancelar Agendamento",
    message: "Esta ação irá remover o agendamento da grade. Deseja continuar?",
    color: "error",
    icon: "mdi-cancel",
    confirmText: "Sim, Cancelar",
    action: async () => {
      await cancelar(item.id);
      await refetch();
    },
  });
}

async function executeConfirmAction() {
  if (!confirmDialog.value.action) {
    return;
  }

  loadingAction.value = "dialog";
  try {
    await confirmDialog.value.action();
    confirmDialog.value.show = false;
  } catch (e: any) {
    alert(e.response?.data?.message || "Erro na operação");
  } finally {
    loadingAction.value = null;
  }
}

function isStatus(atual: string, esperado: string) {
  return atual?.toLowerCase() === esperado?.toLowerCase();
}

function formatTime(dateStr: string) {
  if (!dateStr) return "--:--";
  return format(parseISO(dateStr), "HH:mm");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(parseISO(dateStr), "dd/MM/yyyy");
}

function formatTipoVeiculo(tipo: any) {
  if (tipo === null || tipo === undefined || tipo === "") return "-";

  if (typeof tipo === "string" && isNaN(Number(tipo))) {
    return tipo.replace(/([A-Z])/g, " $1").trim();
  }

  const key = Number(tipo);
  return TipoVeiculoLabels[key] || String(tipo);
}

function formatStatus(status: string) {
  if (!status) return "-";
  return status.replace(/([A-Z])/g, " $1").trim();
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "disponivel":
      return "green-lighten-1";
    case "agendado":
      return "blue-darken-1";
    case "confirmado":
      return "indigo-darken-1";
    case "emandamento":
      return "amber-darken-2";
    case "finalizado":
    case "concluido":
      return "grey-darken-2";
    case "cancelado":
      return "red-lighten-1";
    default:
      return "grey";
  }
}

function toStartOfDayIso(dateStr?: string | null) {
  if (!dateStr) return undefined;
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function toEndOfDayIso(dateStr?: string | null) {
  if (!dateStr) return undefined;
  const d = new Date(`${dateStr}T23:59:59.999`);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function criarAgendamento() {
  showDialogAvulso.value = true;
}
</script>

<style scoped>
:deep(.agendamento-table .v-data-table__th) {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #888 !important;
  font-weight: 600 !important;
  background-color: white !important;
  border-bottom: 1px solid #eee !important;
}

:deep(.agendamento-table .v-data-table__td) {
  font-size: 0.875rem !important;
  color: #333;
  height: 64px !important;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}
</style>
