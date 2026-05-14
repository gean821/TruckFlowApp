<template>
  <div>
    <v-card elevation="0" style="border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 14px;">
      <div style="padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
          <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #1a237e 0%, #195FA0 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <v-icon color="white" size="22">mdi-calendar-multiselect</v-icon>
          </div>
          <div>
            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">Grades Ativas</div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">Regras de recebimento em vigor</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; flex: 1; justify-content: flex-end; align-items: center;">
          <v-text-field
            v-model="search"
            density="compact"
            variant="outlined"
            placeholder="Buscar..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            bg-color="white"
            rounded="lg"
            style="min-width: 170px; max-width: 200px;"
          />
          <v-text-field
            v-model="filtroDataInicio"
            type="date"
            label="Início"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            rounded="lg"
            style="max-width: 148px;"
            clearable
          />
          <v-text-field
            v-model="filtroDataFim"
            type="date"
            label="Fim"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            rounded="lg"
            style="max-width: 148px;"
            clearable
          />
          <v-select
            v-model="filtroLocal"
            :items="locaisDisponiveis"
            label="Doca"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            rounded="lg"
            style="max-width: 148px;"
            clearable
            placeholder="Todas"
          />
          <v-select
            v-model="filtroFornecedor"
            :items="fornecedores"
            item-title="nome"
            item-value="id"
            label="Fornecedor"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            rounded="lg"
            style="max-width: 170px;"
            clearable
            placeholder="Todos"
          />
          <v-select
            v-model="filtroProduto"
            :items="produtos"
            item-title="nome"
            item-value="id"
            label="Produto"
            density="compact"
            variant="outlined"
            hide-details
            bg-color="white"
            rounded="lg"
            style="max-width: 170px;"
            clearable
            placeholder="Todos"
          />
        </div>
      </div>
      <div v-if="!isLoading && groups.length > 0" style="padding: 7px 22px; background: #f8faff; border-top: 1px solid #eef2f7; display: flex; align-items: center; gap: 6px;">
        <div style="width: 5px; height: 5px; background: #195FA0; border-radius: 50%;"></div>
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 500;">
          {{ groups.length }} vigência{{ groups.length !== 1 ? 's' : '' }} encontrada{{ groups.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </v-card>

    <div v-if="isLoading" style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px;">
      <v-skeleton-loader type="list-item-two-line@5" />
    </div>

    <div
      v-else-if="groups.length === 0"
      style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 72px 20px; text-align: center;"
    >
      <div style="width: 64px; height: 64px; background: #f1f5f9; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
        <v-icon size="30" color="#cbd5e1">mdi-text-box-search-outline</v-icon>
      </div>
      <div style="font-size: 0.98rem; font-weight: 700; color: #94a3b8; margin-bottom: 6px;">Nenhuma grade encontrada</div>
      <div style="font-size: 0.78rem; color: #cbd5e1;">Tente ajustar os filtros de pesquisa</div>
    </div>

    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
      <div v-for="group in groups" :key="group.key">
        <v-card
          elevation="0"
          style="border-radius: 14px; overflow: hidden; transition: box-shadow 0.2s, border-color 0.2s;"
          :style="expandedGroupKey === group.key
            ? 'border: 1.5px solid #195FA0; box-shadow: 0 0 0 3px rgba(25,95,160,0.08);'
            : 'border: 1px solid #e2e8f0;'"
        >
          <div style="display: flex; align-items: stretch;">
            <div
              style="width: 4px; flex-shrink: 0; background: linear-gradient(180deg, #195FA0 0%, #1565C0 100%);"
            ></div>

            <div style="flex: 1; padding: 18px 20px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
              <div style="flex: 1.8; min-width: 160px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; flex-wrap: wrap;">
                  <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">
                    {{ group.produto }}
                  </div>
                  <span
                    v-if="isExpired(group.dataFim)"
                    style="background: #f97316; color: white; font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; flex-shrink: 0;"
                  >
                    Expirado
                  </span>
                </div>
                <div style="font-size: 0.74rem; color: #64748b; display: flex; align-items: center; gap: 4px; margin-bottom: 3px;">
                  <v-icon size="11" color="#94a3b8">mdi-domain</v-icon>
                  {{ group.fornecedor || 'Qualquer fornecedor' }}
                </div>
                <div style="font-size: 0.74rem; color: #64748b; display: flex; align-items: center; gap: 4px;">
                  <v-icon size="11" color="#94a3b8">mdi-map-marker-outline</v-icon>
                  {{ group.localDescarga }}
                </div>
              </div>

              <div style="flex-shrink: 0;">
                <div style="background: linear-gradient(135deg, #1a237e 0%, #195FA0 100%); border-radius: 12px; padding: 10px 16px; text-align: center; min-width: 120px;">
                  <div style="font-size: 1.05rem; font-weight: 800; color: white; letter-spacing: 0.5px; line-height: 1.1;">
                    {{ formatHora(group.horaInicial) }} – {{ formatHora(group.horaFinal) }}
                  </div>
                  <div style="font-size: 0.62rem; color: rgba(255,255,255,0.6); margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    {{ group.intervaloMinutos }} min / vaga
                  </div>
                </div>
              </div>

              <div style="flex: 1; min-width: 130px;">
                <div style="font-size: 0.62rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 7px;">Dias de operação</div>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                  <div
                    v-for="val in group.allDias"
                    :key="val"
                    :title="diasNomes[val]"
                    style="width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;"
                    :style="val === 0 || val === 6 ? 'background: #fff3e0; color: #e65100;' : 'background: #eff6ff; color: #1d4ed8;'"
                  >
                    {{ diasSiglas[val] }}
                  </div>
                </div>
              </div>

              <div style="flex: 1; min-width: 130px;">
                <div style="font-size: 0.62rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px;">Período</div>
                <div style="font-size: 0.82rem; font-weight: 600; color: #0f172a;">
                  {{ formatData(group.dataInicio) }}
                  <span style="color: #cbd5e1; font-weight: 400; margin: 0 2px;">→</span>
                  {{ formatData(group.dataFim) }}
                </div>
                <div style="margin-top: 6px;">
                  <span style="background: #eff6ff; color: #1d4ed8; font-size: 0.67rem; font-weight: 700; padding: 2px 10px; border-radius: 20px;">
                    {{ groupSlots.get(group.key) ?? 0 }} agendamento{{ (groupSlots.get(group.key) ?? 0) !== 1 ? 's' : '' }}
                  </span>
                </div>
              </div>

              <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0; margin-left: auto;">
                <v-tooltip text="Editar vigência" location="top">
                  <template #activator="{ props: tip }">
                    <v-btn
                      v-bind="tip"
                      icon
                      size="small"
                      variant="tonal"
                      :color="expandedGroupKey === group.key ? 'primary' : 'grey-darken-1'"
                      style="border-radius: 8px;"
                      @click="expandedGroupKey === group.key ? cancelEditGroup() : startEditGroup(group)"
                    >
                      <v-icon size="17">{{ expandedGroupKey === group.key ? 'mdi-pencil-off-outline' : 'mdi-pencil-outline' }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Excluir vigência" location="top">
                  <template #activator="{ props: tip }">
                    <v-btn
                      v-bind="tip"
                      icon
                      size="small"
                      variant="tonal"
                      color="error"
                      style="border-radius: 8px;"
                      @click="cancelarVigencia(group)"
                    >
                      <v-icon size="17">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-btn
                  color="primary"
                  variant="flat"
                  size="small"
                  rounded="lg"
                  prepend-icon="mdi-calendar-clock"
                  @click="openModal(group)"
                >
                  Agendamentos
                </v-btn>
              </div>
            </div>
          </div>

          <div
            v-if="expandedGroupKey === group.key"
            style="border-top: 1px solid #dbeafe; background: #f0f6ff; padding: 20px 24px;"
          >
            <div style="font-size: 0.67rem; font-weight: 700; color: #195FA0; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px;">
              <v-icon size="13" color="#195FA0">mdi-pencil</v-icon>
              Editando vigência — {{ group.grades.length }} grade{{ group.grades.length !== 1 ? 's' : '' }} serão atualizadas
            </div>
            <v-row dense>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="editGroupForm.dataInicio"
                  type="date"
                  label="Início"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="editGroupForm.dataFim"
                  type="date"
                  label="Fim"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  :min="editGroupForm.dataInicio"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="editGroupForm.localDescargaId"
                  :items="locais"
                  item-title="nome"
                  item-value="id"
                  label="Local de Descarga"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  clearable
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="editGroupForm.horaInicial"
                  type="time"
                  label="Abertura"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="editGroupForm.horaFinal"
                  type="time"
                  label="Fechamento"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  rounded="lg"
                />
              </v-col>
              <v-col cols="6" md="1">
                <v-select
                  v-model="editGroupForm.intervaloMinutos"
                  :items="intervalos"
                  label="Intervalo"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12">
                <div style="background: white; border: 1px solid #dbeafe; border-radius: 10px; padding: 10px 14px; margin-top: 4px;">
                  <div style="font-size: 0.65rem; color: #94a3b8; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;">Dias de Operação</div>
                  <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <div
                      v-for="d in diasOpcoes"
                      :key="d.val"
                      :title="d.nome"
                      style="width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; cursor: pointer; border: 1.5px solid; transition: all 0.15s; user-select: none;"
                      :style="editGroupDias.includes(String(d.val))
                        ? (d.val === 0 || d.val === 6 ? 'background: #e65100; color: white; border-color: #e65100;' : 'background: #195FA0; color: white; border-color: #195FA0;')
                        : 'background: #f8fafc; color: #94a3b8; border-color: #e2e8f0;'"
                      @click="toggleDia(editGroupDias, String(d.val))"
                    >
                      {{ d.sigla }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <div style="display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end;">
              <v-btn size="small" variant="text" color="grey-darken-1" rounded="lg" @click="cancelEditGroup">Cancelar</v-btn>
              <v-btn size="small" variant="flat" color="primary" rounded="lg" :loading="isSavingGroup" @click="saveGroup(group)">
                <v-icon start size="14">mdi-check</v-icon>
                Salvar alterações
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <div v-if="totalPages > 1" style="margin-top: 14px; display: flex; justify-content: center;">
      <v-pagination v-model="page" :length="totalPages" density="compact" size="small" rounded="lg" />
    </div>
  </div>

  <GradeGrupoModal
    v-model="showModal"
    :grades="selectedGrades"
  />

  <ConfirmDeleteDialog
    v-model="showDeleteGroupDialog"
    :loading="isDeletingGroup"
    message="Tem certeza que deseja excluir esta vigência? Todos os agendamentos futuros não realizados serão cancelados automaticamente."
    @confirm="confirmDeleteGroup"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { GradeListQueryDto, GradeResponseDto, GradeUpdateDto } from '@/entities/grade.types';
import { useGradeQuery } from '@/queries/grade.queries';
import { useGrade } from '@/hooks/useGrade';
import { useRoute, useRouter } from 'vue-router';
import { useLocalDescarga } from '@/hooks/useLocalDescarga';
import { useFornecedor } from '@/hooks/useFornecedor';
import { useProduto } from '@/hooks/useProdutos';
import GradeGrupoModal from '@/components/modals/GradeGrupoModal.vue';
import ConfirmDeleteDialog from '@/components/modals/ConfirmDeleteDialog.vue';

type GradeGroup = {
  key: string;
  grades: GradeResponseDto[];
  fornecedor: string;
  produto: string;
  localDescarga: string;
  localDescargaId: string;
  horaInicial: string;
  horaFinal: string;
  intervaloMinutos: number;
  allDias: number[];
  dataInicio: string;
  dataFim: string;
};

const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref(route.query.search?.toString() || '');
const searchDebounced = ref('');
const filtroLocal = ref(route.query.local?.toString() || null);
const filtroFornecedor = ref(route.query.fornecedor?.toString() || null);
const filtroProduto = ref(route.query.produto?.toString() || null);
const filtroDataInicio = ref(route.query.dataInicio?.toString() || null);
const filtroDataFim = ref(route.query.dataFim?.toString() || null);
const pageSize = ref(10);

const { locais } = useLocalDescarga({ apenasAtivos: true });
const { fornecedores } = useFornecedor();
const { produtos } = useProduto();

let debounceTimer: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchDebounced.value = val;
  }, 400);
});

watch(
  [searchDebounced, filtroLocal, filtroFornecedor, filtroProduto, filtroDataInicio, filtroDataFim, page],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        local: filtroLocal.value || undefined,
        fornecedor: filtroFornecedor.value || undefined,
        produto: filtroProduto.value || undefined,
        dataInicio: filtroDataInicio.value || undefined,
        dataFim: filtroDataFim.value || undefined,
        page: page.value !== 1 ? page.value : undefined,
      },
    });
  },
);

const params = computed<GradeListQueryDto>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  localDescargaId: filtroLocal.value || undefined,
  fornecedorId: filtroFornecedor.value || undefined,
  produtoId: filtroProduto.value || undefined,
  dataInicio: filtroDataInicio.value || undefined,
  dataFim: filtroDataFim.value || undefined,
}));

const { data, isLoading } = useGradeQuery(params);

const totalPages = computed(() => Math.ceil((data.value?.totalCount ?? 0) / pageSize.value));

const { updateGrade, deleteGrade } = useGrade();

const diasSiglas = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const diasNomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const intervalos = [10, 15, 20, 30, 45, 60, 90, 120];
const diasOpcoes = [
  { val: 1, sigla: 'S', nome: 'Segunda-feira' },
  { val: 2, sigla: 'T', nome: 'Terça-feira' },
  { val: 3, sigla: 'Q', nome: 'Quarta-feira' },
  { val: 4, sigla: 'Q', nome: 'Quinta-feira' },
  { val: 5, sigla: 'S', nome: 'Sexta-feira' },
  { val: 6, sigla: 'S', nome: 'Sábado' },
  { val: 0, sigla: 'D', nome: 'Domingo' },
];

const expandedGroupKey = ref<string | null>(null);
const isSavingGroup = ref(false);
const editGroupForm = ref<Partial<GradeUpdateDto>>({});
const editGroupDias = ref<string[]>([]);

function startEditGroup(group: GradeGroup) {
  expandedGroupKey.value = group.key;
  editGroupForm.value = {
    dataInicio: group.dataInicio?.substring(0, 10) ?? '',
    dataFim: group.dataFim?.substring(0, 10) ?? '',
    localDescargaId: group.localDescargaId,
    horaInicial: group.horaInicial,
    horaFinal: group.horaFinal,
    intervaloMinutos: group.intervaloMinutos,
  };
  editGroupDias.value = group.allDias.map(String);
}

function cancelEditGroup() {
  expandedGroupKey.value = null;
  editGroupForm.value = {};
  editGroupDias.value = [];
}

async function saveGroup(group: GradeGroup) {
  isSavingGroup.value = true;
  const payload: GradeUpdateDto = { ...editGroupForm.value };
  if (payload.horaInicial?.length === 5) payload.horaInicial += ':00';
  if (payload.horaFinal?.length === 5) payload.horaFinal += ':00';
  if (editGroupDias.value.length > 0) {
    payload.diasSemana = editGroupDias.value.join(',');
  }
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as GradeUpdateDto;
  try {
    await Promise.all(group.grades.map((g) => updateGrade({ id: g.id, payload: clean })));
    expandedGroupKey.value = null;
  } catch {
  } finally {
    isSavingGroup.value = false;
  }
}

function toggleDia(list: string[], val: string) {
  const idx = list.indexOf(val);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(val);
}

const groups = computed<GradeGroup[]>(() => {
  const items = data.value?.items ?? [];
  const map = new Map<string, GradeGroup & { diasSet: Set<number> }>();

  for (const grade of items) {
    const key = `${grade.fornecedorId ?? '__'}|${grade.produto}|${grade.localDescargaId}|${grade.horaInicial}|${grade.horaFinal}|${grade.intervaloMinutos}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        grades: [],
        fornecedor: grade.fornecedor,
        produto: grade.produto,
        localDescarga: grade.localDescarga,
        localDescargaId: grade.localDescargaId,
        horaInicial: grade.horaInicial,
        horaFinal: grade.horaFinal,
        intervaloMinutos: grade.intervaloMinutos,
        allDias: [],
        diasSet: new Set(),
        dataInicio: grade.dataInicio,
        dataFim: grade.dataFim,
      });
    }

    const group = map.get(key)!;
    group.grades.push(grade);

    if (grade.dataInicio < group.dataInicio) group.dataInicio = grade.dataInicio;
    if (grade.dataFim > group.dataFim) group.dataFim = grade.dataFim;

    grade.diasSemana
      ?.split(',')
      .map(Number)
      .filter((n) => !isNaN(n))
      .forEach((d) => group.diasSet.add(d));
  }

  return Array.from(map.values()).map(({ diasSet, ...g }) => ({
    ...g,
    allDias: Array.from(diasSet).sort((a, b) => a - b),
  }));
});

const showModal = ref(false);
const selectedGroupKey = ref<string | null>(null);

const selectedGrades = computed(
  () => groups.value.find((g) => g.key === selectedGroupKey.value)?.grades ?? [],
);

watch(selectedGrades, (grades) => {
  if (grades.length === 0 && showModal.value) {
    showModal.value = false;
    selectedGroupKey.value = null;
  }
});

function openModal(group: GradeGroup) {
  selectedGroupKey.value = group.key;
  showModal.value = true;
}

const isDeletingGroup = ref(false);
const groupToDelete = ref<GradeGroup | null>(null);
const showDeleteGroupDialog = ref(false);

function cancelarVigencia(group: GradeGroup) {
  groupToDelete.value = group;
  showDeleteGroupDialog.value = true;
}

async function confirmDeleteGroup() {
  if (!groupToDelete.value) return;
  isDeletingGroup.value = true;
  try {
    await Promise.all(groupToDelete.value.grades.map((g: GradeResponseDto) => deleteGrade(g.id)));
    showDeleteGroupDialog.value = false;
    groupToDelete.value = null;
  } catch {
  } finally {
    isDeletingGroup.value = false;
  }
}

// --- Helpers ---
const locaisDisponiveis = computed(() =>
  (locais.value ?? []).map((l) => ({ title: l.nome, value: l.id })),
);

function formatData(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return '—';
  }
}

function formatHora(timeStr?: string | null) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
}

function isExpired(dataFim?: string | null) {
  if (!dataFim) return false;
  return dataFim.substring(0, 10) < new Date().toISOString().substring(0, 10);
}

function countWeekdayOccurrences(start: Date, end: Date, weekday: number): number {
  const days = differenceInDays(end, start) + 1;
  if (days <= 0) return 0;
  const offset = (weekday - start.getDay() + 7) % 7;
  if (offset >= days) return 0;
  return Math.floor((days - offset - 1) / 7) + 1;
}

function calcularTotalSlots(group: GradeGroup): number {
  let total = 0;
  for (const grade of group.grades) {
    const [hI = 0, mI = 0] = grade.horaInicial.split(':').map(Number);
    const [hF = 0, mF = 0] = grade.horaFinal.split(':').map(Number);
    const slotsPorDia = Math.max(0, Math.floor((hF * 60 + mF - hI * 60 - mI) / grade.intervaloMinutos));
    const dias = grade.diasSemana?.split(',').map(Number).filter((n) => !isNaN(n)) ?? [];
    const inicio = parseISO(grade.dataInicio);
    const fim = parseISO(grade.dataFim);
    for (const d of dias) {
      total += slotsPorDia * countWeekdayOccurrences(inicio, fim, d);
    }
  }
  return total;
}

const groupSlots = computed(() => {
  const map = new Map<string, number>();
  for (const group of groups.value) {
    map.set(group.key, calcularTotalSlots(group));
  }
  return map;
});

</script>