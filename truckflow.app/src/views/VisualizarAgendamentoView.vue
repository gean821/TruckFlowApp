<template>
  <v-container fluid class="pa-6">
    <CrudTable
      :key="agendamentos.length + '-' + agendamentos[0]?.updatedAt"
      title="Gestão de Agendamentos"
      icon="mdi-calendar-clock"
      subtitle="Acompanhe a grade de horários e status de recebimento"
      :headers="headers" 
      :items="agendamentos"
      :loading="loading" 
      @abrir-dialog="newAgendamento"
      @delete="deleteAgendamento"
      @refresh="refresh"
    >
      
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
        <v-chip 
          size="small" 
          color="blue-grey" 
          variant="tonal" 
          class="font-weight-bold"
        >
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

      <template #item.pesoCarga="{ value }">
        <span :class="value > 0 ? 'text-grey-darken-3' : 'text-grey-lighten-1'">
          {{ value > 0 ? value.toLocaleString('pt-BR') : '-' }} <small v-if="value > 0">kg</small>
        </span>
      </template>

      <template #item.status="{ value }">
        <v-chip 
          size="small" 
          :color="getStatusColor(value)" 
          variant="flat"
          class="font-weight-bold text-uppercase"
        >
          {{ value }}
        </v-chip>
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

const loading = ref(false);
const agendamentoStore = useAgendamentoStore();
const agendamentos = computed(() => agendamentoStore.agendamentos);

const headers: VDataTableHeader = [
  { title: "HORÁRIO / DATA", key: "dataInicio", width: "200px", align: 'start' },
  { title: "PRODUTO", key: "produto", width: "150px" },
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "MOTORISTA / PLACA", key: "motoristaNome", width: "220px" },
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
    case 'disponível': return 'green-lighten-1';
    case 'agendado': return 'blue-darken-1';
    case 'confirmado': return 'indigo-darken-1';
    case 'concluido': return 'grey-darken-2';
    case 'cancelado': return 'red-lighten-1';
    default: return 'grey';
  }
}

async function deleteAgendamento(id: string) {
  if(confirm("Deseja realmente cancelar este horário?")) {
    await agendamentoStore.DeleteAgendamento(id);
  }
}

function newAgendamento() {
  router.push('/programacao');
}
</script>