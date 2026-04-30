<template>
  <v-card elevation="0" class="rounded-xl h-100 d-flex flex-column premium-card">
    <div class="pa-6 pb-3 d-flex justify-space-between align-center">
      <div class="d-flex align-center gap-2">
        <h3 class="text-h6 font-weight-bold">Agendamentos do Dia</h3>
        <v-progress-circular v-if="refreshing" indeterminate color="primary" size="16" width="2" />
      </div>
      <v-chip v-if="hasData" size="small" variant="tonal" color="primary">
        {{ appointments.length }} resultado{{ appointments.length !== 1 ? 's' : '' }}
      </v-chip>
    </div>

    <v-divider class="mx-6" />

    <div class="flex-grow-1 overflow-y-auto apt-scroll d-flex flex-column">

      <div v-if="loading" class="d-flex justify-center align-center py-10 flex-grow-1">
        <v-progress-circular indeterminate color="primary" size="32" />
      </div>

      <div v-else-if="!hasData" class="d-flex flex-column align-center justify-center flex-grow-1 text-grey">
        <v-avatar color="grey-lighten-4" size="52" class="mb-3">
          <v-icon icon="mdi-calendar-check" size="26" color="grey-lighten-1" />
        </v-avatar>
        <p class="text-body-2 font-weight-medium text-grey-darken-1">Nenhum agendamento para hoje</p>
      </div>

      <v-list v-else lines="two" class="py-0 flex-grow-1 d-flex flex-column">
        <template v-for="(apt, i) in appointments" :key="apt.id">
          <v-list-item class="px-6 flex-grow-1" style="align-items: center;">
            <template #prepend>
              <v-avatar color="blue-lighten-5" size="40" class="rounded-lg mr-3">
                <v-icon color="primary" size="20">mdi-truck</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="text-body-2 font-weight-bold text-grey-darken-3 mb-1">
              {{ apt.fornecedorNome }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption text-grey-darken-1">
              {{ apt.produto }} • {{ apt.unidadeEntrega }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end gap-1">
                <v-chip
                  size="x-small"
                  :color="getStatusConfig(apt.status).color"
                  variant="tonal"
                  class="font-weight-medium"
                >
                  {{ getStatusConfig(apt.status).label }}
                </v-chip>
                <span class="text-caption text-grey">{{ formatHora(apt.dataInicio) }}</span>
              </div>
            </template>
          </v-list-item>

          <v-divider v-if="i < appointments.length - 1" class="mx-6" />
        </template>
      </v-list>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { AgendamentoService } from '@/services/AgendamentoService';
import type AgendamentoAdminResponse from '@/Dtos/agendamento/agendamentoAdminResponse.dto';
import { StatusAgendamento } from '@/enums/StatusAgendamento';

const REFRESH_INTERVAL_MS = 2 * 60 * 1000;

const service = AgendamentoService();
const appointments = ref<AgendamentoAdminResponse[]>([]);
const loading = ref(true);
const refreshing = ref(false);

const statusConfig: Record<number, { label: string; color: string }> = {
  [StatusAgendamento.Agendado]:    { label: 'Agendado',     color: 'purple'  },
  [StatusAgendamento.EmAndamento]: { label: 'Em Andamento', color: 'blue'    },
  [StatusAgendamento.Finalizado]:  { label: 'Finalizado',   color: 'success' },
  [StatusAgendamento.Cancelado]:   { label: 'Cancelado',    color: 'error'   },
  [StatusAgendamento.Pendente]:    { label: 'Pendente',     color: 'warning' },
  [StatusAgendamento.Disponivel]:  { label: 'Disponível',   color: 'grey'    },
};

function getStatusConfig(status: string) {
  const asNum = Number(status);
  return statusConfig[asNum] ?? { label: status, color: 'grey' };
}

function formatHora(dateStr: string) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const hasData = computed(() => appointments.value.length > 0);

async function fetchAppointments(isRefresh = false) {
  if (isRefresh) refreshing.value = true;

  try {
    const hoje = new Date();
    const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0).toISOString();
    const dataFim    = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59).toISOString();

    const result = await service.getByFilters({ dataInicio, dataFim, pageSize: 8, pageNumber: 1 });

    appointments.value = result.items ?? (result as any).data ?? [];
  } catch {
    appointments.value = [];
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}

let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  fetchAppointments();
  intervalId = setInterval(() => fetchAppointments(true), REFRESH_INTERVAL_MS);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.premium-card {
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}

.apt-scroll::-webkit-scrollbar { width: 4px; }
.apt-scroll::-webkit-scrollbar-track { background: transparent; }
.apt-scroll::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
</style>
