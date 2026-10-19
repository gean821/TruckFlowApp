<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    <div class="mb-6 d-flex justify-space-between align-end flex-wrap gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">
          Notificações
        </h1>
        <p class="text-body-1 text-grey">
          Histórico completo das notificações da sua conta.
        </p>
      </div>

      <div class="d-flex align-center flex-wrap gap-3">
        <v-chip color="grey-lighten-2" variant="flat" size="small">
          {{ data?.totalCount ?? 0 }} notificaç{{
            (data?.totalCount ?? 0) === 1 ? "ão" : "ões"
          }}
        </v-chip>
        <v-chip
          v-if="(unreadCount ?? 0) > 0"
          color="error"
          variant="flat"
          size="small"
        >
          {{ unreadCount }} não lida{{ (unreadCount ?? 0) === 1 ? "" : "s" }}
        </v-chip>
        <v-btn
          color="primary"
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-check-all"
          class="text-none"
          :disabled="!unreadCount"
          :loading="isMarkingAllAsRead"
          @click="confirmMarkAllOpen = true"
        >
          Marcar todas como lidas
        </v-btn>
      </div>
    </div>

    <v-card elevation="0" class="border rounded-xl bg-white pa-4 mb-6">
      <div class="d-flex flex-wrap gap-3 align-end">
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          label="Buscar por título ou mensagem"
          prepend-inner-icon="mdi-magnify"
          hide-details
          bg-color="white"
          style="min-width: 260px; flex: 1 1 260px"
          clearable
        />

        <v-select
          v-model="filtroTipo"
          :items="tipoOptions"
          label="Tipo"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 220px"
          clearable
          placeholder="Todos"
        />

        <v-select
          v-model="filtroPrioridade"
          :items="prioridadeOptions"
          label="Prioridade"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 170px"
          clearable
          placeholder="Todas"
        />

        <v-select
          v-model="filtroStatus"
          :items="statusOptions"
          label="Status"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 160px"
        />

        <v-text-field
          v-model="filtroDataInicio"
          type="date"
          label="Data início"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 170px"
          clearable
        />

        <v-text-field
          v-model="filtroDataFim"
          type="date"
          label="Data fim"
          density="compact"
          variant="outlined"
          hide-details
          bg-color="white"
          style="max-width: 170px"
          clearable
        />

        <v-btn
          variant="text"
          color="grey-darken-1"
          class="text-none"
          prepend-icon="mdi-filter-remove-outline"
          @click="limparFiltros"
        >
          Limpar filtros
        </v-btn>
      </div>
    </v-card>

    <v-card elevation="0" class="border rounded-xl bg-white">
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="data?.items ?? []"
        :items-length="data?.totalCount ?? 0"
        :loading="isLoading"
        :items-per-page-options="[10, 20, 50]"
        item-value="id"
        density="comfortable"
        no-data-text="Nenhuma notificação encontrada para os filtros selecionados."
        class="notificacoes-table"
        :row-props="rowProps"
        @click:row="onClickRow"
      >
        <template #item.tipo="{ item }">
          <v-icon :color="iconColorForTipo(item.tipo)" size="22">
            {{ iconForTipo(item.tipo) }}
          </v-icon>
        </template>

        <template #item.titulo="{ item }">
          <div class="py-2">
            <div class="d-flex align-center gap-2">
              <span
                v-if="!item.lidaEm"
                class="unread-dot"
                aria-hidden="true"
              />
              <span
                :class="[
                  'text-body-2',
                  !item.lidaEm
                    ? 'font-weight-bold text-grey-darken-3'
                    : 'font-weight-regular text-grey-darken-2',
                ]"
              >
                {{ item.titulo }}
              </span>
            </div>
            <div class="text-caption text-grey-darken-1 corpo-truncado">
              {{ item.corpo }}
            </div>
            <div
              v-if="contextoPayload(parsePayload(item.payloadJson))"
              class="text-caption text-grey mt-1 d-flex align-center"
            >
              <v-icon size="12" class="mr-1">mdi-map-marker-outline</v-icon>
              {{ contextoPayload(parsePayload(item.payloadJson)) }}
            </div>
          </div>
        </template>

        <template #item.prioridade="{ item }">
          <v-chip
            v-if="item.prioridade !== PrioridadeNotificacao.Normal"
            size="x-small"
            :color="prioridadeColor(item.prioridade)"
            variant="flat"
          >
            {{ prioridadeLabel(item.prioridade) }}
          </v-chip>
          <span v-else class="text-caption text-grey">—</span>
        </template>

        <template #item.lidaEm="{ item }">
          <v-chip
            size="x-small"
            :color="item.lidaEm ? 'grey-lighten-2' : 'primary'"
            :variant="item.lidaEm ? 'flat' : 'tonal'"
          >
            {{ item.lidaEm ? "Lida" : "Não lida" }}
          </v-chip>
        </template>

        <template #item.criadaEm="{ item }">
          <span class="text-caption text-grey-darken-1">
            {{ formatTimestamp(item.criadaEm) }}
          </span>
        </template>
      </v-data-table-server>
    </v-card>

    <ConfirmDialog
      v-model="confirmMarkAllOpen"
      title="Marcar todas como lidas"
      :message="`Marcar ${unreadCount ?? 0} notificação(ões) não lida(s) como lidas? Essa ação não pode ser desfeita.`"
      confirm-text="Marcar todas"
      icon="mdi-check-all"
      :loading="isMarkingAllAsRead"
      @confirm="handleMarkAllAsRead"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotificacoesPagedQuery, useNotificacoesUnreadCountQuery } from "@/queries/notificacao.queries";
import { useNotificacao } from "@/hooks/useNotificacao";
import { useComunicacaoDialogStore } from "@/stores/ComunicacaoDialogStore";
import { useNotificacaoVisual } from "@/composables/useNotificacaoVisual";
import {
  PrioridadeNotificacao,
  TipoNotificacao,
  type NotificacaoListItemDto,
  type NotificacaoListQueryDto,
} from "@/entities/notificacao.types";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";

const route = useRoute();
const router = useRouter();
const comunicacaoDialog = useComunicacaoDialogStore();

const {
  iconForTipo,
  iconColorForTipo,
  tipoLabel,
  prioridadeLabel,
  prioridadeColor,
  parsePayload,
  contextoPayload,
  formatTimestamp,
} = useNotificacaoVisual();

type StatusFiltro = "todas" | "naoLidas";
const STATUS_VALUES: StatusFiltro[] = ["todas", "naoLidas"];

function parseStatus(value: unknown): StatusFiltro {
  return STATUS_VALUES.includes(value as StatusFiltro)
    ? (value as StatusFiltro)
    : "todas";
}

function parseEnumParam<T extends number>(value: unknown): T | null {
  const n = Number(value);
  return value !== undefined && value !== null && !Number.isNaN(n)
    ? (n as T)
    : null;
}

const page = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.pageSize) || 20);
const search = ref(route.query.search?.toString() ?? "");
const searchDebounced = ref(search.value);
const filtroTipo = ref<TipoNotificacao | null>(
  parseEnumParam<TipoNotificacao>(route.query.tipo)
);
const filtroPrioridade = ref<PrioridadeNotificacao | null>(
  parseEnumParam<PrioridadeNotificacao>(route.query.prioridade)
);
const filtroStatus = ref<StatusFiltro>(parseStatus(route.query.status));
const filtroDataInicio = ref(route.query.dataInicio?.toString() ?? "");
const filtroDataFim = ref(route.query.dataFim?.toString() ?? "");

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (v) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchDebounced.value = (v ?? "").toString();
  }, 350);
});

watch(
  [
    searchDebounced,
    filtroTipo,
    filtroPrioridade,
    filtroStatus,
    filtroDataInicio,
    filtroDataFim,
  ],
  () => {
    page.value = 1;
  }
);

watch(
  [
    searchDebounced,
    filtroTipo,
    filtroPrioridade,
    filtroStatus,
    filtroDataInicio,
    filtroDataFim,
    page,
    pageSize,
  ],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        tipo: filtroTipo.value ?? undefined,
        prioridade: filtroPrioridade.value ?? undefined,
        status: filtroStatus.value === "todas" ? undefined : filtroStatus.value,
        dataInicio: filtroDataInicio.value || undefined,
        dataFim: filtroDataFim.value || undefined,
        page: page.value !== 1 ? String(page.value) : undefined,
        pageSize: pageSize.value !== 20 ? String(pageSize.value) : undefined,
      },
    });
  }
);

const params = computed<NotificacaoListQueryDto>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  tipo: filtroTipo.value ?? undefined,
  prioridade: filtroPrioridade.value ?? undefined,
  unreadOnly: filtroStatus.value === "naoLidas" ? true : undefined,
  dataInicio: filtroDataInicio.value || undefined,
  dataFim: filtroDataFim.value || undefined,
}));

const { data, isLoading } = useNotificacoesPagedQuery(params);
const { data: unreadCount } = useNotificacoesUnreadCountQuery();
const { markAsRead, markAllAsRead, isMarkingAllAsRead } = useNotificacao();

const tipoOptions = [
  { title: tipoLabel(TipoNotificacao.AgendamentoCriado), value: TipoNotificacao.AgendamentoCriado },
  { title: tipoLabel(TipoNotificacao.AgendamentoConfirmado), value: TipoNotificacao.AgendamentoConfirmado },
  { title: tipoLabel(TipoNotificacao.AgendamentoCancelado), value: TipoNotificacao.AgendamentoCancelado },
  { title: tipoLabel(TipoNotificacao.AgendamentoReagendado), value: TipoNotificacao.AgendamentoReagendado },
  { title: tipoLabel(TipoNotificacao.AgendamentoExpirado), value: TipoNotificacao.AgendamentoExpirado },
  { title: tipoLabel(TipoNotificacao.MotoristaAtrasoInformado), value: TipoNotificacao.MotoristaAtrasoInformado },
  { title: tipoLabel(TipoNotificacao.MotoristaChegou), value: TipoNotificacao.MotoristaChegou },
  { title: tipoLabel(TipoNotificacao.MotoristaSaiu), value: TipoNotificacao.MotoristaSaiu },
  { title: tipoLabel(TipoNotificacao.JanelaPropxima), value: TipoNotificacao.JanelaPropxima },
  { title: tipoLabel(TipoNotificacao.MensagemManualAdmin), value: TipoNotificacao.MensagemManualAdmin },
  { title: tipoLabel(TipoNotificacao.MensagemManualMotorista), value: TipoNotificacao.MensagemManualMotorista },
];

const prioridadeOptions = [
  { title: prioridadeLabel(PrioridadeNotificacao.Normal), value: PrioridadeNotificacao.Normal },
  { title: prioridadeLabel(PrioridadeNotificacao.Alta), value: PrioridadeNotificacao.Alta },
  { title: prioridadeLabel(PrioridadeNotificacao.Critica), value: PrioridadeNotificacao.Critica },
];

const statusOptions: { title: string; value: StatusFiltro }[] = [
  { title: "Todas", value: "todas" },
  { title: "Não lidas", value: "naoLidas" },
];

const headers = [
  { title: "", key: "tipo", sortable: false, width: 56 },
  { title: "Notificação", key: "titulo", sortable: false },
  { title: "Prioridade", key: "prioridade", sortable: false, align: "center" as const, width: 130 },
  { title: "Status", key: "lidaEm", sortable: false, align: "center" as const, width: 130 },
  { title: "Quando", key: "criadaEm", sortable: false, align: "end" as const, width: 170 },
];

const confirmMarkAllOpen = ref(false);

function limparFiltros() {
  search.value = "";
  searchDebounced.value = "";
  filtroTipo.value = null;
  filtroPrioridade.value = null;
  filtroStatus.value = "todas";
  filtroDataInicio.value = "";
  filtroDataFim.value = "";
  page.value = 1;
}

async function onClickRow(_event: Event, { item }: { item: NotificacaoListItemDto }) {
  if (!item.lidaEm) {
    try {
      await markAsRead(item.id);
    } catch {
      // toast de erro já é exibido pelo hook
    }
  }

  const payload = parsePayload(item.payloadJson);
  if (payload.agendamentoId) {
    comunicacaoDialog.abrir(payload.agendamentoId);
  }
}

function rowProps({ item }: { item: NotificacaoListItemDto }) {
  return {
    tabindex: 0,
    role: "button",
    "aria-label": `Notificação: ${item.titulo}${item.lidaEm ? "" : ", não lida"}`,
    onKeydown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClickRow(e, { item });
      }
    },
  };
}

async function handleMarkAllAsRead() {
  try {
    await markAllAsRead();
    confirmMarkAllOpen.value = false;
  } catch {
    // toast de erro já é exibido pelo hook
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background-color: #1976d2;
  display: inline-block;
}

.corpo-truncado {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notificacoes-table :deep(.v-data-table__tr) {
  cursor: pointer;
}

.notificacoes-table :deep(.v-data-table__tr:focus-visible) {
  outline: 2px solid #1976d2;
  outline-offset: -2px;
}
</style>
