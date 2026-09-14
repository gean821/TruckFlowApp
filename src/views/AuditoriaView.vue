<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Auditoria</h1>
        <p class="text-body-1 text-medium-emphasis">
          Histórico de todas as ações realizadas no sistema.
        </p>
      </div>
      <v-chip color="primary" variant="tonal" size="large" class="font-weight-bold">
        {{ data?.totalCount ?? 0 }} eventos
      </v-chip>
    </div>

    <v-card elevation="0" class="border rounded-xl bg-white mb-6">
      <div class="pa-5 border-b bg-grey-lighten-5 d-flex align-center">
        <v-avatar color="#195FA0" variant="flat" class="mr-3" rounded="lg" size="40">
          <v-icon color="white" size="20">mdi-filter-variant</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="line-height: 1.2">
            Filtros
          </h2>
          <div class="text-caption text-grey">Refine a consulta de eventos</div>
        </div>
      </div>

      <div class="pa-5">
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              label="Buscar (entidade ou ID)"
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filtroEntidade"
              :items="entidadeOptions"
              label="Entidade"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              placeholder="Todas"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filtroAcao"
              :items="acaoOptions"
              label="Ação"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              placeholder="Todas"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="filtroDataInicio"
              type="date"
              label="Início"
              density="compact"
              variant="outlined"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="filtroDataFim"
              type="date"
              label="Fim"
              density="compact"
              variant="outlined"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <v-card elevation="0" class="border rounded-xl bg-white">
      <v-data-table
        :headers="headers"
        :items="data?.items ?? []"
        :loading="isLoading"
        :page="page"
        :items-per-page="pageSize"
        :items-length="data?.totalCount ?? 0"
        @update:page="page = $event"
        hover
        class="audit-table"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <template v-slot:no-data>
          <div class="pa-8 text-center text-grey">
            <v-icon size="40" class="mb-2 opacity-50">mdi-history</v-icon>
            <p>Nenhum evento encontrado.</p>
          </div>
        </template>

        <template #item.timestamp="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-bold text-grey-darken-3">{{ formatData(item.timestamp) }}</span>
            <span class="text-caption text-grey">{{ formatHora(item.timestamp) }}</span>
          </div>
        </template>

        <template #item.userName="{ item }">
          <div class="d-flex align-center">
            <v-icon size="14" class="mr-2 text-grey-lighten-1">mdi-account-circle-outline</v-icon>
            <span class="text-body-2">{{ item.userName ?? 'Sistema' }}</span>
          </div>
        </template>

        <template #item.action="{ item }">
          <v-chip
            :color="ACTION_META[item.action]?.color ?? 'grey'"
            size="small"
            variant="flat"
            class="font-weight-bold"
          >
            <v-icon start size="14">{{ ACTION_META[item.action]?.icon ?? 'mdi-help' }}</v-icon>
            {{ ACTION_META[item.action]?.label ?? item.action }}
          </v-chip>
        </template>

        <template #item.entityName="{ item }">
          <span class="text-body-2 font-weight-medium">
            {{ ENTITY_LABELS[item.entityName] ?? item.entityName }}
          </span>
        </template>

        <template #item.entityId="{ item }">
          <span class="text-caption text-grey-darken-1" style="font-family: monospace">
            {{ shortenId(item.entityId) }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="mdi-eye-outline"
            class="text-capitalize"
            @click="abrirDetalhes(item)"
          >
            Detalhes
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="detalhesAbertos" max-width="720">
      <v-card v-if="eventoSelecionado" class="rounded-xl">
        <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
          <v-icon class="mr-3">mdi-history</v-icon>
          <div>
            <div class="text-h6 font-weight-bold">
              {{ ACTION_META[eventoSelecionado.action]?.label }} —
              {{ ENTITY_LABELS[eventoSelecionado.entityName] ?? eventoSelecionado.entityName }}
            </div>
            <div class="text-caption opacity-75">
              {{ formatDataHora(eventoSelecionado.timestamp) }}
            </div>
          </div>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" color="white" @click="detalhesAbertos = false" />
        </v-card-title>

        <v-card-text class="pa-5">
          <div class="text-overline text-grey-darken-1 mb-2">METADADOS</div>
          <v-table density="compact" class="mb-5">
            <tbody>
              <tr>
                <td class="text-caption text-grey font-weight-bold">Quem</td>
                <td>{{ eventoSelecionado.userName ?? 'Sistema' }}</td>
              </tr>
              <tr>
                <td class="text-caption text-grey font-weight-bold">ID da entidade</td>
                <td style="font-family: monospace">{{ eventoSelecionado.entityId }}</td>
              </tr>
              <tr v-if="eventoSelecionado.ipAddress">
                <td class="text-caption text-grey font-weight-bold">IP</td>
                <td>{{ eventoSelecionado.ipAddress }}</td>
              </tr>
              <tr v-if="eventoSelecionado.userAgent">
                <td class="text-caption text-grey font-weight-bold">User-Agent</td>
                <td class="text-truncate" style="max-width: 480px">{{ eventoSelecionado.userAgent }}</td>
              </tr>
            </tbody>
          </v-table>

          <div class="text-overline text-grey-darken-1 mb-2">ALTERAÇÕES</div>
          <div v-if="!eventoSelecionado.changes" class="text-caption text-grey pa-4 text-center">
            Sem detalhes de alteração registrados.
          </div>
          <v-table v-else density="compact" class="changes-table">
            <thead>
              <tr>
                <th class="text-left text-caption font-weight-bold">Campo</th>
                <th class="text-left text-caption font-weight-bold">
                  {{ eventoSelecionado.action === 'Update' ? 'Antes' : 'Valor' }}
                </th>
                <th v-if="eventoSelecionado.action === 'Update'" class="text-left text-caption font-weight-bold">
                  Depois
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[campo, valor] in changesFormatados" :key="campo">
                <td class="font-weight-medium">{{ campo }}</td>
                <td><code class="text-caption">{{ formatAuditValueLabeled(campo, valor.from, eventoSelecionado.labels) }}</code></td>
                <td v-if="eventoSelecionado.action === 'Update'">
                  <code class="text-caption">{{ formatAuditValueLabeled(campo, valor.to, eventoSelecionado.labels) }}</code>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import type { AuditAction, AuditLogListQueryDto, AuditLogResponseDto } from '@/entities/audit.types';
import { useAuditLogQuery } from '@/queries/audit.queries';
import { ENTITY_LABELS, ACTION_META, formatAuditValueLabeled, shortenId, formatChanges } from '@/utils/audit';

const entidadeOptions = Object.entries(ENTITY_LABELS).map(([value, title]) => ({ title, value }));
const acaoOptions: { title: string; value: AuditAction }[] = [
  { title: 'Criação', value: 'Create' },
  { title: 'Atualização', value: 'Update' },
  { title: 'Exclusão', value: 'Delete' },
];

const page = ref(1);
const pageSize = ref(20);
const search = ref('');
const searchDebounced = ref('');
const filtroEntidade = ref<string | null>(null);
const filtroAcao = ref<AuditAction | null>(null);
const filtroDataInicio = ref<string | null>(null);
const filtroDataFim = ref<string | null>(null);

let timeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchDebounced.value = val ?? '';
    page.value = 1;
  }, 400);
});

watch([filtroEntidade, filtroAcao, filtroDataInicio, filtroDataFim], () => {
  page.value = 1;
});

const params = computed<AuditLogListQueryDto>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  entityName: filtroEntidade.value || undefined,
  action: filtroAcao.value || undefined,
  dataInicio: filtroDataInicio.value || undefined,
  dataFim: filtroDataFim.value ? `${filtroDataFim.value}T23:59:59` : undefined,
}));

const { data, isLoading } = useAuditLogQuery(params);

const headers = [
  { title: 'QUANDO', key: 'timestamp', sortable: false, width: '15%' },
  { title: 'QUEM', key: 'userName', sortable: false, width: '20%' },
  { title: 'AÇÃO', key: 'action', sortable: false, width: '12%' },
  { title: 'ENTIDADE', key: 'entityName', sortable: false, width: '18%' },
  { title: 'ID', key: 'entityId', sortable: false, width: '20%' },
  { title: '', key: 'actions', align: 'end', sortable: false },
] as const;

const detalhesAbertos = ref(false);
const eventoSelecionado = ref<AuditLogResponseDto | null>(null);

function abrirDetalhes(item: AuditLogResponseDto) {
  eventoSelecionado.value = item;
  detalhesAbertos.value = true;
}

const changesFormatados = computed(() =>
  eventoSelecionado.value ? formatChanges(eventoSelecionado.value) : []
);

function formatData(iso: string) {
  return format(parseISO(iso), 'dd/MM/yyyy');
}

function formatHora(iso: string) {
  return format(parseISO(iso), 'HH:mm:ss');
}

function formatDataHora(iso: string) {
  return format(parseISO(iso), 'dd/MM/yyyy HH:mm:ss');
}
</script>

<style scoped>
:deep(.audit-table .v-data-table__th) {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #888 !important;
  font-weight: 600 !important;
  background-color: white !important;
  border-bottom: 1px solid #eee !important;
}

:deep(.audit-table .v-data-table__td) {
  font-size: 0.875rem !important;
  color: #333;
  height: 56px !important;
}

.changes-table code {
  background: #f4f5f7;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  word-break: break-all;
}
</style>
