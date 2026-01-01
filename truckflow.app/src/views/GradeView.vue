<template>
  <v-card elevation="3" class="rounded-lg">
    <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
      <div class="d-flex align-center">
        <v-icon color="primary" class="mr-3" size="32">mdi-calendar-multiselect</v-icon>
        <div>
          <h2 class="text-h6 font-weight-bold">Grades Ativas</h2>
          <span class="text-caption text-grey-darken-1">
            Visualização das regras de recebimento
          </span>
        </div>
      </div>
      
      </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      class="grade-table"
    >
      <template #item.fornecedor="{ item }">
        <div class="py-2">
          <div class="font-weight-bold text-body-2">{{ item.fornecedor }}</div>
          <div class="text-caption text-primary font-weight-bold">{{ item.produto }}</div>
        </div>
      </template>

       <template #item.unidade="{ item }">
         <span class="text-body-2">{{ item.unidadeEntrega }}</span>
      </template>

      <template #item.periodo="{ item }">
        <div class="d-flex flex-column">
          <span class="text-body-2">{{ formatData(item.dataInicio) }}</span>
          <span class="text-caption text-grey">até</span>
          <span class="text-body-2">{{ formatData(item.dataFim) }}</span>
        </div>
      </template>

      <template #item.diasSemana="{ item }">
        <div class="d-flex gap-1 flex-wrap" style="max-width: 140px">
          <v-tooltip 
            v-for="dia in parseDias(item.diasSemana)" 
            :key="dia.val" 
            location="top"
          >
            <template #activator="{ props }">
              <v-avatar
                v-bind="props"
                color="primary"
                variant="tonal"
                size="24"
                class="text-caption font-weight-bold cursor-help mb-1"
              >
                {{ dia.sigla }}
              </v-avatar>
            </template>
            <span>{{ dia.nomeCompleto }}</span>
          </v-tooltip>
        </div>
      </template>

      <template #item.horario="{ item }">
        <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
          {{ formatHora(item.horaInicial) }} - {{ formatHora(item.horaFinal) }}
        </v-chip>
        <div class="text-caption mt-1 text-grey-darken-1">
          <v-icon size="small" class="mr-1">mdi-timer-sand</v-icon>
          {{ item.intervaloMinutos }} min
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-tooltip text="Editar Grade" location="top">
            <template #activator="{ props }">
              <v-btn 
                v-bind="props" 
                icon="mdi-pencil" 
                size="small" 
                variant="text" 
                color="blue-grey"
                @click="$emit('edit', item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Excluir Grade" location="top">
            <template #activator="{ props }">
              <v-btn 
                v-bind="props" 
                icon="mdi-delete" 
                size="small" 
                variant="text" 
                color="error"
                @click="$emit('delete', item.id)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import type GradeResponseDto from '@/Dtos/grade/gradeResponseDto';
import { format, parseISO } from 'date-fns'; 

defineProps<{
  items: GradeResponseDto[];
  loading: boolean;
}>();

defineEmits(['edit', 'delete']);

const headers = [
  { title: 'Fornecedor / Produto', key: 'fornecedor', align: 'start' },
  { title: 'Unidade', key: 'unidadeEntrega', align: 'start' },
  { title: 'Vigência', key: 'periodo', sortable: false },
  { title: 'Dias Operação', key: 'diasSemana', sortable: false },
  { title: 'Horário / Intervalo', key: 'horario', align: 'center', sortable: false },
  { title: 'Ações', key: 'actions', align: 'end', sortable: false },
] as const;

function formatData(dateStr: string) {
  if (!dateStr) {
    return '-';
  } 

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
  
  const mapDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const mapNomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  
  return diasStr.split(',')
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
.gap-1 { gap: 4px; }
.cursor-help { cursor: help; }
</style>