<template>
  <v-container
    fluid
    class="pa-6 pb-12"
    style="min-height: 100vh; background-color: #EEF0F8; background-image: radial-gradient(#c8cde8 1px, transparent 1px); background-size: 24px 24px;"
  >

    <div
      class="mb-5 pa-6 rounded-xl"
      style="background: linear-gradient(135deg, #195FA0 0%, #0D3F6E 60%, #0A2E52 100%); box-shadow: 0 4px 24px rgba(25,95,160,0.35); position: relative; overflow: hidden;"
    >
      <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(255,255,255,0.05);border-radius:50%;pointer-events:none;" />
      <div style="position:absolute;bottom:-60px;right:120px;width:160px;height:160px;background:rgba(255,255,255,0.04);border-radius:50%;pointer-events:none;" />

      <div class="d-flex flex-wrap justify-space-between align-center gap-4">
        <div>
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon color="white" size="18" style="opacity:0.7;">mdi-calendar-clock</v-icon>
            <span class="text-caption text-white text-uppercase font-weight-medium" style="opacity:0.7; letter-spacing:0.08em;">Operação</span>
          </div>
          <h1 class="text-h5 font-weight-bold text-white">Gestão de Agendamentos</h1>
          <p class="text-body-2 mt-1" style="color: rgba(255,255,255,0.65);">
            Acompanhe a grade de horários e status de recebimento
          </p>
        </div>

        <div class="d-flex align-center" style="gap: 20px;">
          <v-btn
            icon="mdi-refresh"
            variant="tonal"
            color="white"
            size="small"
            :loading="isFetching"
            @click="refetch()"
          />
          <v-btn
            variant="tonal"
            color="white"
            prepend-icon="mdi-download"
            height="38"
            class="text-capitalize font-weight-medium px-4"
            rounded="lg"
            elevation="0"
            style="color: rgba(255,255,255,0.9);"
            @click="exportarCSV"
          >
            Exportar
          </v-btn>
          <v-btn
            color="white"
            prepend-icon="mdi-plus"
            height="38"
            class="text-capitalize font-weight-bold px-5"
            rounded="lg"
            elevation="0"
            style="color: #195FA0;"
            @click="criarAgendamento"
          >
            Agendamento Avulso
          </v-btn>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-3 mb-4">
      <div
        v-for="stat in resumoStats"
        :key="stat.key"
        class="d-flex align-center px-4 py-3 rounded-xl"
        style="min-width: 130px; flex: 1; transition: box-shadow 0.15s; gap: 16px;"
        :style="{
          background: 'white',
          cursor: stat.value ? 'pointer' : 'default',
          boxShadow: stat.value && filtroStatus === stat.value
            ? '0 0 0 2px ' + stat.borderColor + ', 0 4px 12px rgba(0,0,0,0.10)'
            : '0 0 0 1px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.06)',
        }"
        @click="toggleStatusFilter(stat.value)"
      >
        <v-avatar :color="stat.bg" size="40" rounded="lg">
          <v-icon :color="stat.color" size="20">{{ stat.icon }}</v-icon>
        </v-avatar>
        <div>
          <div class="text-h5 font-weight-bold text-grey-darken-3" style="line-height: 1.1;">{{ stat.count }}</div>
          <div class="text-caption text-grey">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ Filtros ═══ -->
    <v-card
      elevation="0"
      class="rounded-xl mb-4"
      style="box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);"
    >
      <div class="pa-4">

        <!-- Linha 1: período + busca + datas -->
        <div class="d-flex flex-wrap align-center gap-3 mb-3">
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

          <v-divider vertical style="height: 32px;" />

          <v-text-field
            v-model="search"
            density="compact"
            variant="outlined"
            placeholder="Buscar por placa, motorista, produto, fornecedor..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            bg-color="white"
            style="flex: 1 1 0; max-width: 420px;"
            clearable
          />

          <template v-if="periodoPreset === 'custom'">
            <v-text-field
              v-model="filtroDataInicio"
              type="date"
              label="Início"
              density="compact"
              variant="outlined"
              hide-details
              bg-color="white"
              style="width: 178px; flex: 0 0 auto;"
            />
            <v-icon size="small" color="grey-darken-1">mdi-arrow-right</v-icon>
            <v-text-field
              v-model="filtroDataFim"
              type="date"
              label="Fim"
              density="compact"
              variant="outlined"
              hide-details
              bg-color="white"
              style="width: 178px; flex: 0 0 auto;"
            />
          </template>
        </div>

        <v-divider class="mb-3" />

        <div class="d-flex flex-wrap gap-3">
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

        <!-- Filtros ativos -->
        <div
          v-if="filtrosAtivos.length > 0"
          class="d-flex flex-wrap align-center gap-2 mt-3 pt-3"
          style="border-top: 1px solid #f0f0f0;"
        >
          <span class="text-caption text-grey font-weight-medium">Filtros ativos:</span>
          <v-chip
            v-for="filtro in filtrosAtivos"
            :key="filtro.key"
            size="small"
            color="primary"
            variant="tonal"
            closable
            @click:close="filtro.clear()"
          >
            {{ filtro.label }}
          </v-chip>
          <v-btn
            v-if="filtrosAtivos.length > 1"
            size="x-small"
            variant="text"
            color="grey-darken-1"
            class="ml-1"
            @click="limparFiltros"
          >
            Limpar todos
          </v-btn>
        </div>
      </div>
    </v-card>

    <v-card
      elevation="0"
      class="rounded-xl"
      style="box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);"
    >
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
        class="agendamento-table"
        @update:page="page = $event"
        @update:items-per-page="pageSize = $event"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@6" />
        </template>

        <template #no-data>
          <div class="d-flex flex-column align-center justify-center py-12 text-grey">
            <v-avatar color="grey-lighten-4" size="64" class="mb-4">
              <v-icon icon="mdi-calendar-remove-outline" size="32" color="grey-lighten-1" />
            </v-avatar>
            <p class="text-body-1 font-weight-medium text-grey-darken-1">Nenhum agendamento encontrado</p>
            <p class="text-caption text-grey mt-1">Tente ajustar os filtros aplicados</p>
          </div>
        </template>

        <template #item.dataInicio="{ item }">
          <div class="d-flex flex-column py-1">
            <div class="d-flex align-center">
              <v-icon icon="mdi-clock-outline" size="14" class="mr-1" color="primary" />
              <span class="font-weight-bold text-body-2 text-grey-darken-3">
                {{ formatTime(item.dataInicio) }} — {{ formatTime(item.dataFim) }}
              </span>
            </div>
            <span class="text-caption text-grey mt-1" style="padding-left: 18px;">
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
            <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ item.motoristaNome }}</span>
            <div class="d-flex align-center mt-1">
              <v-icon icon="mdi-truck-outline" size="12" class="mr-1 text-grey" />
              <span class="text-caption text-grey">{{ item.placaVeiculo }}</span>
            </div>
          </div>
          <span v-else class="text-caption text-grey font-italic">— Aguardando —</span>
        </template>

        <template #item.tipoVeiculo="{ value }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-truck-cargo-container" size="16" class="mr-2 text-grey-darken-1" />
            <span class="text-body-2 text-grey-darken-2 text-capitalize">{{ formatTipoVeiculo(value) }}</span>
          </div>
        </template>

        <template #item.pesoCarga="{ value }">
          <div class="text-right">
            <span v-if="value > 0" class="text-body-2 font-weight-medium text-grey-darken-3">
              {{ value.toLocaleString("pt-BR") }}
              <small class="text-grey text-caption ml-1">kg</small>
            </span>
            <span v-else class="text-grey">—</span>
          </div>
        </template>

        <template #item.status="{ value }">
          <v-chip
            size="small"
            :color="getStatusConfig(value).color"
            variant="flat"
            class="font-weight-bold text-uppercase"
            :prepend-icon="getStatusConfig(value).icon"
          >
            {{ formatStatus(value) }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center align-center gap-1">
            <v-tooltip
              v-if="isStatus(item.status, 'Agendado') || isStatus(item.status, 'Confirmado')"
              text="Registrar Chegada (Check-in)"
              location="top"
            >
              <template #activator="{ props }">
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
              v-if="isStatus(item.status, 'EmAndamento')"
              text="Finalizar Operação (Check-out)"
              location="top"
            >
              <template #activator="{ props }">
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
              <template #activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="grey-darken-1" v-bind="props" />
              </template>
              <v-list density="compact" rounded="lg" elevation="2">
                <v-list-item prepend-icon="mdi-pencil-outline" rounded="lg" @click="">
                  <v-list-item-title class="text-body-2">Editar Dados</v-list-item-title>
                </v-list-item>
                <v-divider class="my-1" />
                <v-list-item
                  prepend-icon="mdi-close-circle-outline"
                  base-color="red"
                  rounded="lg"
                  @click="handleCancelar(item)"
                >
                  <v-list-item-title class="text-body-2 text-error">Cancelar Agendamento</v-list-item-title>
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
const filtroStatus = ref<string | null>(route.query.status?.toString() || null);
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

  if (preset === "hoje") return { inicio: toIso(hoje), fim: toIso(hoje) };

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
  [searchDebounced, periodoPreset, filtroDataInicio, filtroDataFim, filtroFornecedor, filtroUnidade, filtroProduto, filtroStatus, filtroTipoVeiculo],
  () => { page.value = 1; }
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
  [searchDebounced, periodoPreset, filtroDataInicio, filtroDataFim, filtroFornecedor, filtroUnidade, filtroProduto, filtroStatus, filtroTipoVeiculo, page, pageSize],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        periodo: periodoPreset.value !== "semana" ? periodoPreset.value : undefined,
        dataInicio: periodoPreset.value === "custom" ? filtroDataInicio.value || undefined : undefined,
        dataFim: periodoPreset.value === "custom" ? filtroDataFim.value || undefined : undefined,
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

const resumoStats = computed(() => {
  const items = data.value?.items ?? [];
  const count = (...statuses: string[]) => items.filter((i) => statuses.some((s) => isStatus(i.status, s))).length;
  return [
    {
      key: "total",
      label: "Total",
      value: null,
      count: items.length,
      icon: "mdi-calendar-month",
      color: "#37474F",
      bg: "blue-grey-lighten-5",
      borderColor: "#37474F",
    },
    {
      key: "agendados",
      label: "Agendados",
      value: "Agendado",
      count: count("Agendado"),
      icon: "mdi-calendar-check",
      color: "#1565C0",
      bg: "blue-lighten-5",
      borderColor: "#1565C0",
    },
    {
      key: "emAndamento",
      label: "Em Andamento",
      value: "EmAndamento",
      count: count("EmAndamento"),
      icon: "mdi-progress-clock",
      color: "#E65100",
      bg: "orange-lighten-5",
      borderColor: "#E65100",
    },
    {
      key: "finalizados",
      label: "Finalizados",
      value: "Finalizado",
      count: count("Finalizado", "Concluido"),
      icon: "mdi-check-all",
      color: "#2E7D32",
      bg: "green-lighten-5",
      borderColor: "#2E7D32",
    },
    {
      key: "cancelados",
      label: "Cancelados",
      value: "Cancelado",
      count: count("Cancelado"),
      icon: "mdi-close-circle-outline",
      color: "#B71C1C",
      bg: "red-lighten-5",
      borderColor: "#B71C1C",
    },
  ];
});

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

function toggleStatusFilter(value: string | null) {
  if (!value) return;
  filtroStatus.value = filtroStatus.value === value ? null : value;
}

const filtrosAtivos = computed(() => {
  const chips: Array<{ key: string; label: string; clear: () => void }> = [];

  function tryAddEntity(
    filterRef: { value: string | null },
    source: { value: any[] },
    prefix: string,
    clearFn: () => void
  ) {
    if (!filterRef.value) return;
    const found = source.value?.find((e: any) => e.id === filterRef.value);
    chips.push({ key: prefix, label: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}: ${found?.nome ?? filterRef.value}`, clear: clearFn });
  }

  tryAddEntity(filtroFornecedor, fornecedores as any, "fornecedor", () => { filtroFornecedor.value = null; });
  tryAddEntity(filtroUnidade, unidades as any, "unidade", () => { filtroUnidade.value = null; });
  tryAddEntity(filtroProduto, produtos as any, "produto", () => { filtroProduto.value = null; });

  if (filtroStatus.value) {
    const found = statusOptions.find((s) => s.value === filtroStatus.value);
    chips.push({ key: "status", label: `Status: ${found?.title ?? filtroStatus.value}`, clear: () => { filtroStatus.value = null; } });
  }
  if (filtroTipoVeiculo.value !== null && filtroTipoVeiculo.value !== undefined) {
    const found = tipoVeiculoOptions.value.find((t) => t.value === filtroTipoVeiculo.value);
    chips.push({ key: "tipoVeiculo", label: `Veículo: ${found?.title ?? filtroTipoVeiculo.value}`, clear: () => { filtroTipoVeiculo.value = null; } });
  }
  if (search.value) {
    chips.push({ key: "search", label: `Busca: "${search.value}"`, clear: () => { search.value = ""; } });
  }

  return chips;
});

function limparFiltros() {
  filtroFornecedor.value = null;
  filtroUnidade.value = null;
  filtroProduto.value = null;
  filtroStatus.value = null;
  filtroTipoVeiculo.value = null;
  search.value = "";
}

function exportarCSV() {
  const items = data.value?.items ?? [];
  const cabecalho = ["Horário", "Data", "Produto", "Fornecedor", "Motorista", "Placa", "Unidade Entrega", "Tipo Veículo", "Peso (kg)", "Status"];

  const linhas = items.map((item: any) => [
    `${formatTime(item.dataInicio)} - ${formatTime(item.dataFim)}`,
    formatDate(item.dataInicio),
    item.produto || "Carga Geral",
    item.fornecedorNome || "",
    item.motoristaNome || "",
    item.placaVeiculo || "",
    item.unidadeEntrega || "",
    formatTipoVeiculo(item.tipoVeiculo),
    item.pesoCarga > 0 ? item.pesoCarga : "",
    formatStatus(item.status),
  ]);

  const csv = [cabecalho, ...linhas]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agendamentos_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

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
    action: async () => { await checkIn(item.id); await refetch(); },
  });
}

async function handleCheckout(item: any) {
  askConfirmation({
    title: "Finalizar Operação",
    message: "Confirmar liberação do veículo e conclusão da descarga?",
    color: "green-darken-1",
    icon: "mdi-check-all",
    confirmText: "Finalizar",
    action: async () => { await checkOut(item.id); await refetch(); },
  });
}

async function handleCancelar(item: any) {
  askConfirmation({
    title: "Cancelar Agendamento",
    message: "Esta ação irá remover o agendamento da grade. Deseja continuar?",
    color: "error",
    icon: "mdi-cancel",
    confirmText: "Sim, Cancelar",
    action: async () => { await cancelar(item.id); await refetch(); },
  });
}

async function executeConfirmAction() {
  if (!confirmDialog.value.action) return;
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
  if (typeof tipo === "string" && isNaN(Number(tipo))) return tipo.replace(/([A-Z])/g, " $1").trim();
  const key = Number(tipo);
  return TipoVeiculoLabels[key] || String(tipo);
}

function formatStatus(status: string) {
  if (!status) return "-";
  return status.replace(/([A-Z])/g, " $1").trim();
}

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  disponivel:  { color: "green-lighten-1",  icon: "mdi-check-circle-outline" },
  agendado:    { color: "blue-darken-1",    icon: "mdi-calendar-check" },
  confirmado:  { color: "indigo-darken-1",  icon: "mdi-calendar-check" },
  emandamento: { color: "amber-darken-2",   icon: "mdi-progress-clock" },
  finalizado:  { color: "grey-darken-2",    icon: "mdi-check-all" },
  concluido:   { color: "grey-darken-2",    icon: "mdi-check-all" },
  cancelado:   { color: "red-lighten-1",    icon: "mdi-close-circle-outline" },
};
const STATUS_DEFAULT = { color: "grey", icon: "mdi-help-circle-outline" };

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_DEFAULT;
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
  font-size: 0.68rem !important;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #9e9e9e !important;
  font-weight: 700 !important;
  background-color: #fafafa !important;
  border-bottom: 2px solid #f0f0f0 !important;
}

:deep(.agendamento-table .v-data-table__td) {
  font-size: 0.875rem !important;
  color: #333;
  height: 68px !important;
  border-bottom: 1px solid #f5f5f5 !important;
}

:deep(.agendamento-table .v-data-table__tr:hover > td) {
  background-color: #f4f6ff !important;
}
</style>
