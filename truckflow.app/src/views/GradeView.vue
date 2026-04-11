<template>
  <v-card elevation="0" class="border rounded-xl mt-6 bg-white">

    <div class="pa-5 border-b bg-grey-lighten-5">
      <div class="d-flex flex-wrap align-center justify-space-between gap-4">

        <div class="d-flex align-center">
          <v-avatar color="#195FA0" variant="flat" class="mr-3" rounded="lg" size="40">
            <v-icon color="white" size="20">mdi-calendar-multiselect</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-subtitle-1 font-weight-bold text-grey-darken-3" style="line-height: 1.2">
              Grades Ativas
            </h2>
            <div class="text-caption text-grey">Regras de recebimento</div>
          </div>
        </div>

        <div class="d-flex gap-3 flex-wrap flex-grow-1 justify-end" style="max-width: 1100px;">
          <v-text-field v-model="search" density="compact" variant="outlined" label="Buscar..."
            prepend-inner-icon="mdi-magnify" hide-details bg-color="white" style="min-width: 200px;" flex-grow-1 />

          <v-text-field v-model="filtroDataInicio" type="date" label="Início" density="compact" variant="outlined"
            hide-details bg-color="white" style="max-width: 160px;" clearable />

          <v-text-field v-model="filtroDataFim" type="date" label="Fim" density="compact" variant="outlined"
            hide-details bg-color="white" style="max-width: 160px;" clearable />

          <v-select v-model="filtroLocal" :items="locaisDisponiveis" label="Doca" density="compact" variant="outlined"
            hide-details bg-color="white" style="max-width: 150px;" clearable placeholder="Todas" />

          <v-select v-model="filtroFornecedor" :items="fornecedores" item-title="nome" item-value="id"
            label="Fornecedor" density="compact" variant="outlined" hide-details bg-color="white"
            style="max-width: 180px;" clearable placeholder="Todos" />

          <v-select v-model="filtroProduto" :items="produtos" item-title="nome" item-value="id" label="Produto"
            density="compact" variant="outlined" hide-details bg-color="white" style="max-width: 180px;" clearable
            placeholder="Todos" />
        </div>
      </div>
    </div>

    <v-data-table :headers="headers" :items="data?.items ?? []" :loading="isLoading" :page="page"
      :items-per-page="pageSize" :items-length="data?.totalCount ?? 0" @update:page="page = $event" hover
      class="grade-table custom-typography">

      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
      </template>

      <template v-slot:no-data>
        <div class="pa-8 text-center text-grey">
          <v-icon size="40" class="mb-2 opacity-50">mdi-text-box-search-outline</v-icon>
          <p>Nenhuma grade encontrada.</p>
        </div>
      </template>

      <template #item.fornecedor="{ item }">
        <div class="py-3">
          <div class="font-weight-medium text-grey-darken-3" style="font-size: 0.9rem;">
            {{ item.fornecedor }}
          </div>
          <div class="d-flex align-center mt-1">
            <v-icon size="12" color="grey" class="mr-1">mdi-package-variant-closed</v-icon>
            <span class="text-caption text-grey-darken-1 font-weight-medium text-uppercase">
              {{ item.produto }}
            </span>
          </div>
        </div>
      </template>

      <template #item.localDescarga="{ item }">
        <div class="d-flex align-center text-grey-darken-2">
          <v-icon size="small" class="mr-2 text-grey-lighten-1">mdi-map-marker</v-icon>
          <span class="text-body-2 font-weight-medium">{{ item.localDescarga }}</span>
        </div>
      </template>

      <template #item.periodo="{ item }">
        <div class="d-flex align-center gap-2 text-caption">
          <span class="font-weight-bold text-grey-darken-2">{{ formatData(item.dataInicio) }}</span>
          <v-icon size="10" color="grey-lighten-1">mdi-arrow-right</v-icon>
          <span class="font-weight-bold text-grey-darken-2">{{ formatData(item.dataFim) }}</span>
        </div>
      </template>

      <template #item.diasSemana="{ item }">
        <div class="d-flex gap-1 flex-wrap" style="max-width: 180px">
          <v-tooltip v-for="dia in parseDias(item.diasSemana)" :key="dia.val" location="top"
            content-class="bg-grey-darken-4 text-caption">
            <template #activator="{ props }">
              <div v-bind="props" class="day-badge" :class="{ 'is-weekend': dia.val === 0 || dia.val === 6 }">
                {{ dia.sigla }}
              </div>
            </template>
            <span>{{ dia.nomeCompleto }}</span>
          </v-tooltip>
        </div>
      </template>

      <template #item.horario="{ item }">
        <div class="d-flex flex-column align-center">
          <div class="text-body-2 font-weight-bold text-primary">
            {{ formatHora(item.horaInicial) }} - {{ formatHora(item.horaFinal) }}
          </div>
          <div class="text-caption text-grey mt-0">
            {{ item.intervaloMinutos }} min / vaga
          </div>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-end gap-1">
          <v-btn icon size="small" variant="text" color="grey-darken-1" @click="$emit('edit', item)">
            <v-icon size="18">mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" color="error" class="opacity-80" @click="$emit('delete', item.id)">
            <v-icon size="18">mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import type { GradeListQueryDto } from '@/entities/grade.types';
import { useGradeQuery } from '@/queries/grade.queries';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useLocalDescarga } from '@/hooks/useLocalDescarga';
import { useFornecedor } from '@/hooks/useFornecedor';
import { useProduto } from '@/hooks/useProdutos';

const route = useRoute();
const router = useRouter();
const page = ref(Number(route.query.page) || 1)
const searchDebounced = ref('')

const search = ref(route.query.search?.toString() || '')

const filtroLocal = ref(route.query.local?.toString() || null)
const filtroFornecedor = ref(route.query.fornecedor?.toString() || null)
const filtroProduto = ref(route.query.produto?.toString() || null)
const filtroDataInicio = ref(route.query.dataInicio?.toString() || null)
const filtroDataFim = ref(route.query.dataFim?.toString() || null)

const { locais } = useLocalDescarga();
const { fornecedores } = useFornecedor();
const { produtos } = useProduto();

let timeout: ReturnType<typeof setTimeout>

watch(search, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    searchDebounced.value = val
  }, 400)
})

const pageSize = ref(10)

watch([
  searchDebounced,
  filtroLocal,
  filtroFornecedor,
  filtroProduto,
  filtroDataInicio,
  filtroDataFim,
  page], () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        local: filtroLocal.value || undefined,
        fornecedor: filtroFornecedor.value || undefined,
        produto: filtroProduto.value || undefined,
        dataInicio: filtroDataInicio.value || undefined,
        dataFim: filtroDataFim.value || undefined,
        page: page.value !== 1 ? page.value : undefined
      }
    })
  })

const params = computed<GradeListQueryDto>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  localDescargaId: filtroLocal.value || undefined,
  fornecedorId: filtroFornecedor.value || undefined,
  produtoId: filtroProduto.value || undefined,
  dataInicio: filtroDataInicio.value || undefined,
  dataFim: filtroDataFim.value || undefined,
}))

const { data, isLoading } = useGradeQuery(params)

const emit = defineEmits(['edit', 'delete']);

const locaisDisponiveis = computed(() => {
  return (locais.value ?? []).map(l => ({
    title: l.nome,
    value: l.id
  }));
});

const headers = [
  { title: 'FORNECEDOR & PRODUTO', key: 'fornecedor', align: 'start', width: '30%' },
  { title: 'LOCAL', key: 'localDescarga' },
  { title: 'VIGÊNCIA', key: 'periodo', sortable: false, width: '15%' },
  { title: 'DIAS', key: 'diasSemana', sortable: false, width: '15%' },
  { title: 'HORÁRIO', key: 'horario', align: 'center', sortable: false, width: '15%' },
  { title: '', key: 'actions', align: 'end', sortable: false },
] as const;

function formatData(dateStr: string) {
  if (!dateStr) return '-';
  return format(parseISO(dateStr), 'dd/MM/yyyy');
}

function formatHora(timeStr: string) {
  if (!timeStr) {
    return '-';
  }

  return timeStr.substring(0, 5);
}

function parseDias(diasStr: string) {
  if (!diasStr) {
    return [];
  }

  const mapDias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const mapNomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return diasStr
    .split(',')
    .map(d => parseInt(d))
    .sort((a, b) => a - b)
    .map(d => ({
      val: d,
      sigla: mapDias[d],
      nomeCompleto: mapNomes[d]
    }));
}
</script>

<style scoped>
:deep(.v-data-table__th) {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #888 !important;
  font-weight: 600 !important;
  background-color: white !important;
  border-bottom: 1px solid #eee !important;
}

:deep(.v-data-table__td) {
  font-size: 0.875rem !important;
  color: #333;
  height: 64px !important;
}

.day-badge {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  cursor: help;
  background-color: #E3F2FD;
  color: #1565C0;
  transition: all 0.2s;
}

.day-badge.is-weekend {
  background-color: #FFF3E0;
  color: #E65100;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}
</style>