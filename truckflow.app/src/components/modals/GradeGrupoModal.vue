<template>
  <v-dialog v-model="internalModel" max-width="900" scrollable>
    <v-card style="border-radius: 16px; overflow: hidden;">

      <div style="background: linear-gradient(135deg, #195FA0 0%, #1565C0 100%); padding: 20px 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: rgba(255,255,255,0.15); border-radius: 10px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <v-icon color="white" size="24">mdi-calendar-clock</v-icon>
            </div>
            <div>
              <div style="font-size: 1.05rem; font-weight: 700; color: white; line-height: 1.2;">
                {{ firstGrade?.produto ?? '—' }}
              </div>
              <div style="font-size: 0.78rem; color: rgba(255,255,255,0.72); margin-top: 3px;">
                Agendamentos da vigência
              </div>
            </div>
          </div>
          <v-btn icon variant="text" color="white" size="small" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <div
            v-if="firstGrade?.fornecedor"
            style="background: rgba(255,255,255,0.13); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;"
          >
            <v-icon size="11" color="white">mdi-domain</v-icon>
            {{ firstGrade.fornecedor }}
          </div>
          <div
            v-if="firstGrade?.localDescarga"
            style="background: rgba(255,255,255,0.13); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;"
          >
            <v-icon size="11" color="white">mdi-map-marker</v-icon>
            {{ firstGrade.localDescarga }}
          </div>
          <div
            v-if="firstGrade"
            style="background: rgba(255,255,255,0.13); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;"
          >
            <v-icon size="11" color="white">mdi-clock-outline</v-icon>
            {{ formatHora(firstGrade.horaInicial) }} → {{ formatHora(firstGrade.horaFinal) }}
          </div>
          <div
            v-if="firstGrade"
            style="background: rgba(255,255,255,0.13); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;"
          >
            <v-icon size="11" color="white">mdi-calendar-range</v-icon>
            {{ formatData(vigenciaInicio) }} → {{ formatData(vigenciaFim) }}
          </div>
          <div
            v-if="firstGrade"
            style="background: rgba(255,255,255,0.13); border-radius: 20px; padding: 5px 12px; font-size: 0.72rem; color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;"
          >
            <v-icon size="11" color="white">mdi-timer-sand</v-icon>
            {{ firstGrade.intervaloMinutos }} min/vaga
          </div>
        </div>
      </div>

      <div
        style="padding: 10px 20px; background: #f8f9fa; border-bottom: 1px solid #ebebeb; display: flex; align-items: center; justify-content: space-between;"
      >
        <span style="font-size: 0.82rem; color: #777; font-weight: 500;">Agendamentos</span>
        <span
          v-if="!isLoading && agendamentos.length > 0"
          style="font-size: 0.75rem; color: #aaa;"
        >
          {{ agendamentos.length }} agendamento{{ agendamentos.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <v-card-text style="padding: 0; max-height: 480px; overflow-y: auto;">
        <div v-if="isLoading" style="padding: 24px 20px;">
          <v-skeleton-loader type="list-item-two-line@6" />
        </div>

        <div
          v-else-if="agendamentos.length === 0"
          style="padding: 48px 20px; text-align: center; color: #bbb;"
        >
          <v-icon size="36" style="opacity: 0.35; display: block; margin: 0 auto 8px;">
            mdi-calendar-blank-outline
          </v-icon>
          <div style="font-size: 0.85rem;">Nenhum agendamento encontrado para esta vigência.</div>
        </div>

        <div v-else>
          <div
            style="padding: 7px 20px; background: #f8f9fa; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #ebebeb;"
          >
            <div style="flex: 1.1; font-size: 0.65rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px;">Data / Hora</div>
            <div style="flex: 1.2; font-size: 0.65rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px;">Fornecedor</div>
            <div style="flex: 0.7; font-size: 0.65rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px;">Placa</div>
            <div style="flex: 0.9; font-size: 0.65rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px;">Motorista</div>
            <div style="width: 100px; font-size: 0.65rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px; text-align: center;">Status</div>
          </div>

          <div
            v-for="(ag, idx) in agendamentos"
            :key="ag.id"
            style="padding: 11px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f2f2f2;"
            :style="idx % 2 === 0 ? 'background: white;' : 'background: #fafafa;'"
          >
            <div style="flex: 1.1; min-width: 0;">
              <div style="font-size: 0.84rem; font-weight: 600; color: #1a1a2e;">
                {{ formatDataHora(ag.dataInicio) }}
              </div>
              <div style="font-size: 0.71rem; color: #aaa; margin-top: 2px;">
                até {{ formatDataHora(ag.dataFim) }}
              </div>
            </div>
            <div style="flex: 1.2; min-width: 0; font-size: 0.82rem; color: #444; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ ag.fornecedorNome || '—' }}
            </div>
            <div style="flex: 0.7; font-size: 0.8rem; color: #555; font-family: monospace; letter-spacing: 0.5px;">
              {{ ag.placaVeiculo || '—' }}
            </div>
            <div style="flex: 0.9; font-size: 0.82rem; color: #555; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ ag.motoristaNome || '—' }}
            </div>
            <div style="width: 100px; display: flex; justify-content: center;">
              <span
                style="border-radius: 20px; padding: 3px 10px; font-size: 0.68rem; font-weight: 700; display: inline-block; white-space: nowrap;"
                :style="statusStyle(ag.status)"
              >
                {{ statusLabel(ag.status) }}
              </span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions style="padding: 12px 20px; border-top: 1px solid #eeeeee; background: #fafafa;">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" rounded="lg" @click="close">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import type { GradeResponseDto } from '@/entities/grade.types';
import { useAgendamentoQuery } from '@/queries/agendamento.queries';

const props = defineProps<{
  modelValue: boolean;
  grades: GradeResponseDto[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const internalModel = ref(props.modelValue);
watch(() => props.modelValue, (v) => (internalModel.value = v));
watch(internalModel, (v) => emit('update:modelValue', v));

const firstGrade = computed(() => props.grades[0] ?? null);

const vigenciaInicio = computed(() =>
  props.grades.reduce(
    (min, g) => (g.dataInicio < min ? g.dataInicio : min),
    props.grades[0]?.dataInicio ?? '',
  ),
);

const vigenciaFim = computed(() =>
  props.grades.reduce(
    (max, g) => (g.dataFim > max ? g.dataFim : max),
    props.grades[0]?.dataFim ?? '',
  ),
);

const queryParams = computed(() => ({
  fornecedorId: firstGrade.value?.fornecedorId ?? undefined,
  dataInicio: vigenciaInicio.value || undefined,
  dataFim: vigenciaFim.value || undefined,
  pageNumber: 1,
  pageSize: 100,
}));

const queryEnabled = computed(() => internalModel.value && props.grades.length > 0);

const { data, isLoading } = useAgendamentoQuery(queryParams, { enabled: queryEnabled });

const agendamentos = computed(() => data.value?.items ?? []);

function close() {
  internalModel.value = false;
}

function formatData(dateStr?: string | null) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd/MM/yyyy'); }
  catch { return '—'; }
}

function formatDataHora(dateStr?: string | null) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd/MM HH:mm'); }
  catch { return '—'; }
}

function formatHora(timeStr?: string | null) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  Disponivel: { label: 'Disponível', bg: '#e8f5e9', color: '#2e7d32' },
  Pendente: { label: 'Pendente', bg: '#fff8e1', color: '#f57f17' },
  Agendado: { label: 'Agendado', bg: '#e3f2fd', color: '#1565c0' },
  EmAndamento: { label: 'Em andamento', bg: '#fff3e0', color: '#e65100' },
  Finalizado: { label: 'Finalizado', bg: '#f3e5f5', color: '#6a1b9a' },
  Cancelado: { label: 'Cancelado', bg: '#fce4ec', color: '#b71c1c' },
  Expirado: { label: 'Expirado', bg: '#f5f5f5', color: '#757575' },
};

function statusStyle(status: string) {
  const s = STATUS_MAP[status] ?? { bg: '#f5f5f5', color: '#666' };
  return `background: ${s.bg}; color: ${s.color};`;
}

function statusLabel(status: string) {
  return STATUS_MAP[status]?.label ?? status;
}
</script>