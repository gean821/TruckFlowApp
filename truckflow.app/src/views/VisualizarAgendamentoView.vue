<template>
  <v-container fluid class="pa-6">
    <CrudTable 
      title="Agendamentos de Carga"
      icon="mdi-calendar-clock"
      subtitle="Gerencie os horários e recebimentos previstos"
      :headers="headers" 
      :items="agendamentos"
      :loading="loading" 
      @abrir-dialog="newAgendamento"
      @delete="deleteAgendamento"
    >
      <template #item.produto="{ value }">
        <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
          {{ value }}
        </v-chip>
      </template>

       <template #item.horario="{ value }">
         <span class="font-weight-medium text-grey-darken-3">{{ value }}</span>
       </template>

    </CrudTable>
  </v-container>
</template>

<script setup lang="ts">
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import router from '@/router';
import { useAgendamentoStore } from '@/stores/AgendamentoStore';
import { computed, ref, onMounted } from 'vue';

const loading = ref(false);

const headers : VDataTableHeader = [
    { title: "HORÁRIO", key: "horario", align: 'start', width: '150px' },
    { title: "PRODUTO", key: "produto" },
    { title: "FORNECEDOR", key: "fornecedor" },
    { title: "PLACA", key: "placa" },
    { title: "PESO (KG)", key: "peso", align: 'end' }, // Alinhamento numérico à direita
    { title: "AÇÕES", key: "actions", sortable: false, align: "center", width: '150px' },
];

const agendamentoStore = useAgendamentoStore();
const agendamentos = computed(() => agendamentoStore.agendamentos);

onMounted(async () => {
    loading.value = true;
    // Simular delay ou fetch real
    //await agendamentoStore.GetAll();
    setTimeout(() => loading.value = false, 800); 
});

async function deleteAgendamento(id: string) {
    await agendamentoStore.DeleteAgendamento(id);
}

function newAgendamento() {
    router.push('/programacao');
}
</script>