<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">

    <div class="mb-6 d-flex justify-space-between align-end flex-wrap gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Planejamentos</h1>
        <p class="text-body-1 text-grey">
          Contratos semanais, metas diárias e status de recebimento em tempo real.
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        class="text-capitalize elevation-2"
        @click="router.push('/novo-recebimento')"
      >
        Novo Planejamento
      </v-btn>
    </div>

    <v-card elevation="0" class="border rounded-xl bg-white pa-4 mb-6">
      <div class="d-flex flex-wrap gap-3">
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          label="Buscar (fornecedor, produto...)"
          prepend-inner-icon="mdi-magnify"
          hide-details
          bg-color="white"
          style="min-width: 260px; flex: 1 1 260px"
          clearable
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
          style="max-width: 220px"
          clearable
          placeholder="Todos"
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
          style="max-width: 220px"
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
          style="max-width: 170px"
          clearable
          placeholder="Todos"
        />

        <v-text-field
          v-model="filtroDataInicio"
          type="date"
          label="Início ≥"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 160px"
          clearable
        />

        <v-text-field
          v-model="filtroDataFim"
          type="date"
          label="Fim ≤"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 160px"
          clearable
        />
      </div>
    </v-card>

    <div v-if="isLoading && !data" class="d-flex justify-center mt-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <div
      v-else-if="(data?.items ?? []).length === 0"
      class="text-center mt-12 text-grey"
    >
      <v-icon size="64" class="mb-2 opacity-50">mdi-clipboard-text-off-outline</v-icon>
      <h3 class="text-h6">Nenhum planejamento encontrado</h3>
    </div>

    <v-row v-else>
      <v-col
        v-for="item in data?.items ?? []"
        :key="item.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <v-card class="rounded-xl border hover-card d-flex flex-column h-100" elevation="1">

          <div class="pa-4 pb-2">
            <div class="d-flex justify-space-between align-start mb-2">
              <div class="d-flex align-center">
                <v-avatar
                  color="blue-lighten-5"
                  class="mr-3 text-blue-darken-3 rounded-lg"
                >
                  <span class="text-h6 font-weight-bold">
                    {{ item.fornecedorNome.charAt(0) }}
                  </span>
                </v-avatar>
                <div>
                  <div
                    class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate"
                    style="max-width: 200px"
                  >
                    {{ item.fornecedorNome }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ formatDate(item.dataInicio) }} → {{ formatDate(item.dataFim) }}
                  </div>
                </div>
              </div>

              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                    color="grey"
                  />
                </template>
                <v-list density="compact" class="rounded-lg elevation-3">
                  <v-list-item
                    prepend-icon="mdi-chart-box-outline"
                    title="Ver relatório"
                    @click="abrirRelatorio(item.id)"
                  />
                  <v-list-item
                    v-if="item.status !== 'Encerrado'"
                    prepend-icon="mdi-lock-outline"
                    title="Encerrar"
                    @click="confirmarEncerrar(item.id)"
                  />
                  <v-divider class="my-1" />
                  <v-list-item
                    prepend-icon="mdi-trash-can-outline"
                    title="Excluir"
                    base-color="error"
                    @click="openDelete(item.id)"
                  />
                </v-list>
              </v-menu>
            </div>

            <div class="d-flex align-center gap-2 mb-2">
              <v-chip size="x-small" :color="statusColor(item.status)" variant="flat">
                {{ formatStatus(item.status) }}
              </v-chip>
              <v-chip size="x-small" color="grey-lighten-2" variant="flat">
                {{ item.totalItens }} item(ns)
              </v-chip>
            </div>

            <div class="mt-2 mb-2">
              <div
                class="d-flex justify-space-between text-caption mb-1 font-weight-bold text-grey-darken-2"
              >
                <span>Progresso Total</span>
                <span>{{ calcularProgresso(item) }}%</span>
              </div>
              <v-progress-linear
                :model-value="calcularProgresso(item)"
                color="success"
                height="6"
                rounded
                bg-color="grey-lighten-3"
              />
            </div>
          </div>

          <v-divider />

          <v-expand-transition>
            <div v-if="expandedCards.includes(item.id)">
              <RecebimentoDashboardPanel :planejamento-id="item.id" />
            </div>
          </v-expand-transition>

          <div class="pa-2 text-center bg-white rounded-b-xl mt-auto">
            <v-btn
              variant="text"
              size="small"
              color="grey-darken-1"
              class="text-caption"
              :prepend-icon="
                expandedCards.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'
              "
              @click="toggleExpand(item.id)"
            >
              {{ expandedCards.includes(item.id) ? "Recolher" : "Ver Dashboard" }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-center mt-6" v-if="(data?.totalPages ?? 0) > 1">
      <v-pagination
        v-model="page"
        :length="data?.totalPages ?? 1"
        :total-visible="7"
        color="primary"
        rounded="circle"
      />
    </div>

    <ConfirmDeleteDialog
      v-model="showDelete"
      :loading="isDeleting"
      message="Deseja realmente excluir este planejamento?"
      @confirm="confirmDelete"
    />

    <ConfirmDialog
      v-model="confirmEncerrar.show"
      title="Encerrar planejamento"
      message="A vigência será fechada. Você ainda poderá consultar o relatório. Deseja continuar?"
      confirm-text="Encerrar"
      color="warning"
      icon="mdi-lock-outline"
      :loading="isEncerrando"
      @confirm="executeEncerrar"
    />

    <RelatorioDialog
      v-model="relatorio.show"
      :planejamento-id="relatorio.id"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { format, parseISO } from "date-fns";
import { usePlanejamentoQuery } from "@/queries/planejamento.queries";
import { usePlanejamento } from "@/hooks/usePlanejamento";
import { useFornecedor } from "@/hooks/useFornecedor";
import { useProduto } from "@/hooks/useProdutos";
import type IPlanejamentoListQuery from "@/Dtos/Recebimento/IPlanejamentoListQuery";
import type IRecebimentoResponse from "@/Dtos/Recebimento/IRecebimentoResponse";
import ConfirmDeleteDialog from "@/components/modals/ConfirmDeleteDialog.vue";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";
import RecebimentoDashboardPanel from "@/components/Forms/RecebimentoDashboardPanel.vue";

const router = useRouter();
const route = useRoute();

const { fornecedores } = useFornecedor();
const { produtos } = useProduto();
const { deletePlanejamento, encerrarPlanejamento, isDeleting, isEncerrando } = usePlanejamento();

const page = ref(Number(route.query.page) || 1);
const pageSize = ref(12);
const search = ref(route.query.search?.toString() || "");
const searchDebounced = ref(search.value);
const filtroFornecedor = ref(route.query.fornecedor?.toString() || null);
const filtroProduto = ref(route.query.produto?.toString() || null);
const filtroStatus = ref(route.query.status?.toString() || null);
const filtroDataInicio = ref(route.query.dataInicio?.toString() || "");
const filtroDataFim = ref(route.query.dataFim?.toString() || "");

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (v) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchDebounced.value = (v ?? "").toString();
  }, 350);
});

watch(
  [searchDebounced, filtroFornecedor, filtroProduto, filtroStatus, filtroDataInicio, filtroDataFim],
  () => { page.value = 1; }
);

const params = computed<IPlanejamentoListQuery>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  fornecedorId: filtroFornecedor.value || undefined,
  produtoId: filtroProduto.value || undefined,
  status: (filtroStatus.value as any) || undefined,
  dataInicio: filtroDataInicio.value || undefined,
  dataFim: filtroDataFim.value || undefined
}));

const { data, isLoading } = usePlanejamentoQuery(params);

watch(
  [
    searchDebounced,
    filtroFornecedor,
    filtroProduto,
    filtroStatus,
    filtroDataInicio,
    filtroDataFim,
    page
  ],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        fornecedor: filtroFornecedor.value || undefined,
        produto: filtroProduto.value || undefined,
        status: filtroStatus.value || undefined,
        dataInicio: filtroDataInicio.value || undefined,
        dataFim: filtroDataFim.value || undefined,
        page: page.value !== 1 ? String(page.value) : undefined
      }
    });
  }
);

const expandedCards = ref<string[]>([]);
const showDelete = ref(false);
const itemToDelete = ref<string | null>(null);

const confirmEncerrar = ref<{ show: boolean; id: string | null }>({ show: false, id: null });
const relatorio = ref<{ show: boolean; id: string | null }>({ show: false, id: null });

const statusOptions = [
  { title: "Planejado", value: "Planejado" },
  { title: "Em Andamento", value: "EmAndamento" },
  { title: "Concluído", value: "Concluido" },
  { title: "Encerrado", value: "Encerrado" }
];

function toggleExpand(id: string) {
  if (expandedCards.value.includes(id)) {
    expandedCards.value = expandedCards.value.filter((x) => x !== id);
  } else {
    expandedCards.value.push(id);
  }
}

function openDelete(id: string) {
  itemToDelete.value = id;
  showDelete.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;
  try {
    await deletePlanejamento(itemToDelete.value);
    showDelete.value = false;
  } finally {
    itemToDelete.value = null;
  }
}

function confirmarEncerrar(id: string) {
  confirmEncerrar.value = { show: true, id };
}

async function executeEncerrar() {
  if (!confirmEncerrar.value.id) return;
  try {
    await encerrarPlanejamento(confirmEncerrar.value.id);
    confirmEncerrar.value.show = false;
  } finally {
    confirmEncerrar.value.id = null;
  }
}

function abrirRelatorio(id: string) {
  relatorio.value = { show: true, id };
}

function formatDate(date: string) {
  if (!date) return "-";
  return format(parseISO(date), "dd/MM/yyyy");
}

function formatStatus(status: string) {
  if (!status) return "-";
  return status.replace(/([A-Z])/g, " $1").trim();
}

function statusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "planejado": return "blue-lighten-4";
    case "emandamento": return "amber-lighten-3";
    case "concluido": return "green-lighten-3";
    case "encerrado": return "grey-lighten-2";
    default: return "grey-lighten-3";
  }
}

function calcularProgresso(item: IRecebimentoResponse): number {
  if (!item.itens || item.itens.length === 0) return 0;
  const total = item.itens.reduce((acc, c) => acc + c.quantidadeTotalPlanejada, 0);
  const received = item.itens.reduce((acc, c) => acc + c.quantidadeTotalRecebida, 0);
  if (total === 0) return 0;
  return Math.min(Math.round((received / total) * 100), 100);
}
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #195fa0 !important;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
</style>
