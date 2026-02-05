<template>
  <v-container fluid class="pa-6">
    <CrudTable :key="agendamentos.length + '-' + agendamentos[0]?.updatedAt" title="Gestão de Agendamentos"
      icon="mdi-calendar-clock" subtitle="Acompanhe a grade de horários e status de recebimento" :headers="headers"
      :items="agendamentos" :loading="loading" @abrir-dialog="newAgendamento" @delete="deleteAgendamento"
      @refresh="refresh">

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
          {{ value || 'Carga Geral' }}
        </v-chip>
      </template>

      <template #item.fornecedorNome="{ value }">
        <span class="text-body-2 font-weight-medium text-grey-darken-3">
          {{ value }}
        </span>
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
          {{ value > 0 ? value.toLocaleString('pt-BR') : '-' }} <small v-if="value > 0">kg</small>
        </span>
      </template>

      <template #item.status="{ value }">
        <v-chip size="small" :color="getStatusColor(value)" variant="flat" class="font-weight-bold text-uppercase">
          {{ value }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center align-center ga-2">

          <v-tooltip text="Registrar Chegada (Check-in)" location="top"
            v-if="isStatus(item.status, 'Agendado') || isStatus(item.status, 'Confirmado')">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-login-variant" color="blue-darken-2" variant="tonal" size="small" v-bind="props"
                @click="handleCheckIn(item)" :loading="loadingAction === item.id" />
            </template>
          </v-tooltip>

          <v-tooltip text="Finalizar Operação (Check-out)" location="top" v-if="isStatus(item.status, 'EmAndamento')">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-check-all" color="green-darken-1" variant="tonal" size="small" v-bind="props"
                @click="handleCheckOut(item)" :loading="loadingAction === item.id" />
            </template>
          </v-tooltip>

          <v-menu
            v-if="!isStatus(item.status, 'Finalizado') && !isStatus(item.status, 'Concluido') && !isStatus(item.status, 'Cancelado')">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click="newAgendamento" prepend-icon="mdi-pencil">
                <v-list-item-title>Editar Dados</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1"></v-divider>
              <v-list-item @click="handleCancelar(item)" prepend-icon="mdi-cancel" base-color="red">
                <v-list-item-title class="text-red">Cancelar Agendamento</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>
      </template>

    </CrudTable>
  </v-container>
</template>

<script setup lang="ts">
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import router from '@/router';
import { useAgendamentoStore } from '@/stores/AgendamentoStore';
import { computed, ref, onMounted } from 'vue';
import { format, parseISO } from 'date-fns';
import { TipoVeiculoLabels } from '@/utils/tipoVeiculoLabels';

const loading = ref(false);
const agendamentoStore = useAgendamentoStore();
const agendamentos = computed(() => agendamentoStore.agendamentos);
const loadingAction = ref<string | null>(null);

const headers: VDataTableHeader = [
  { title: "HORÁRIO / DATA", key: "dataInicio", width: "200px", align: 'start' },
  { title: "PRODUTO", key: "produto", width: "150px" },
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "MOTORISTA / PLACA", key: "motoristaNome", width: "220px" },
  { title: "Unidade De Entrega", key: "unidadeEntrega", width: "220px" },
  { title: "TIPO VEICULO", key: "tipoVeiculo", width: "220px" },
  { title: "PESO", key: "pesoCarga", align: "end", width: "120px" },
  { title: "STATUS", key: "status", align: "center", width: "140px" },
  { title: "AÇÕES", key: "actions", sortable: false, align: "center", width: "100px" }
];

onMounted(async () => {
  await fetchAgendamentos();

  setInterval(() => {
    fetchAgendamentos();
  }, 30000);

});

async function fetchAgendamentos() {
  loading.value = true;
  try {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);

    await agendamentoStore.getByFilters({
      dataInicio: hoje.toISOString().split('T')[0],
      dataFim: proximaSemana.toISOString().split('T')[0]
    });

  } finally {
    loading.value = false;
  }
}

function isStatus(atual: string, esperado: string) {
  return atual?.toLowerCase() === esperado?.toLowerCase();
}

async function refresh() {
  await fetchAgendamentos();
}

function formatTime(dateStr: string) {
  if (!dateStr) return '--:--';
  return format(parseISO(dateStr), 'HH:mm');
}

function formatDate(dateStr: string) {
  if (!dateStr) {
    return '-';
  }

  return format(parseISO(dateStr), 'dd/MM/yyyy');
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'disponivel': return 'green-lighten-1';
    case 'agendado': return 'blue-darken-1';
    case 'confirmado': return 'indigo-darken-1';
    case 'concluido': return 'grey-darken-2';
    case 'cancelado': return 'red-lighten-1';
    default: return 'grey';
  }
}

async function handleCheckIn(item: any) {
  const placa = item.placaVeiculo || 'sem placa cadastrada';

  if (!confirm(`Confirmar entrada do veículo ${placa}?`)) {
    return;
  }

  loadingAction.value = item.id;
  try {
    await agendamentoStore.realizarCheckIn(item.id);
    await fetchAgendamentos();

  } catch (e: any) {
    alert(e.response?.data?.message || "Erro ao realizar check-in.");
  } finally {
    loadingAction.value = null;
  }
}

async function handleCheckOut(item: any) {
  if (!confirm("Confirmar finalização da descarga e liberação do veículo?")) {
    return;
  }

  loadingAction.value = item.id;
  try {
    await agendamentoStore.realizarCheckOut(item.id);
    await fetchAgendamentos();
  } catch (e: any) {
    alert(e.response?.data?.message || "Erro ao realizar check-out.");
  } finally {
    loadingAction.value = null;
  }
}

async function handleCancelar(item: any) {
  if (!confirm("ATENÇÃO: Deseja realmente CANCELAR este agendamento?")) {
    return;
  }

  loadingAction.value = item.id;
  try {
    await agendamentoStore.cancelarAgendamento(item.id);
    await fetchAgendamentos();

  } catch (e: any) {
    alert(e.response?.data?.message || "Erro ao cancelar.");
  } finally {
    loadingAction.value = null;
  }
}

async function deleteAgendamento(id: string) {
  if (confirm("Deseja realmente cancelar este horário?")) {
    await agendamentoStore.DeleteAgendamento(id);
  }
}

function formatTipoVeiculo(tipo: any) {
  if (!tipo) {
    return '-';
  }

  return TipoVeiculoLabels[tipo.toString()] || tipo;
}

function newAgendamento() {
  router.push('/programacao');
}
</script>