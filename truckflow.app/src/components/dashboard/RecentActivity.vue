<script setup lang="ts">
import { ref } from 'vue';

// Interface para tipar os eventos (depois virá do backend)
interface ActivityItem {
  id: number;
  type: 'checkin' | 'checkout' | 'delay' | 'schedule';
  title: string;
  subtitle: string;
  time: string;
  color: string;
  icon: string;
}

// Mock de dados para visualização
const activities = ref<ActivityItem[]>([
  { 
    id: 1, 
    type: 'checkin', 
    title: 'Entrada Registrada', 
    subtitle: 'Mot. Carlos Silva (ABC-1234)', 
    time: 'Há 2 min', 
    color: 'info', 
    icon: 'mdi-truck-check' 
  },
  { 
    id: 2, 
    type: 'delay', 
    title: 'Atraso Detectado', 
    subtitle: 'Doca 03 - Agendamento #4092', 
    time: 'Há 15 min', 
    color: 'error', 
    icon: 'mdi-clock-alert' 
  },
  { 
    id: 3, 
    type: 'checkout', 
    title: 'Descarga Finalizada', 
    subtitle: 'Mot. Roberto Alves (XYZ-9876)', 
    time: 'Há 32 min', 
    color: 'success', 
    icon: 'mdi-check-all' 
  },
  { 
    id: 4, 
    type: 'schedule', 
    title: 'Novo Agendamento', 
    subtitle: 'Fornecedor Grãos do Sul Ltda', 
    time: 'Há 1 hora', 
    color: 'primary', 
    icon: 'mdi-calendar-plus' 
  },
]);
</script>

<template>
  <v-card elevation="0" class="border rounded-xl h-100 d-flex flex-column">
    
    <div class="pa-5 pb-2 d-flex justify-space-between align-center">
      <h3 class="text-h6 font-weight-bold">Atividade Recente</h3>
      <v-btn variant="text" density="compact" color="primary" class="text-capitalize">
        Ver tudo
      </v-btn>
    </div>

    <v-divider class="mx-5 mb-2"></v-divider>

    <div class="pa-4 pt-0 flex-grow-1 overflow-y-auto" style="max-height: 400px;">
      <v-timeline density="compact" align="start" side="end" truncate-line="start">
        
        <v-timeline-item
          v-for="item in activities"
          :key="item.id"
          :dot-color="item.color"
          size="x-small"
          class="mb-2"
        >
          <template v-slot:icon>
            <v-icon size="10" color="white">{{ item.icon }}</v-icon>
          </template>

          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center w-100">
              <span class="text-body-2 font-weight-bold text-grey-darken-3">
                {{ item.title }}
              </span>
              <span class="text-caption text-grey text-no-wrap ml-2">
                {{ item.time }}
              </span>
            </div>
            
            <span class="text-caption text-grey-darken-1">
              {{ item.subtitle }}
            </span>
          </div>
        </v-timeline-item>
  
      </v-timeline>
      
      <div v-if="activities.length === 0" class="text-center py-10 text-grey">
        <v-icon icon="mdi-history" size="large" class="mb-2 opacity-50"></v-icon>
        <p class="text-caption">Nenhuma atividade recente</p>
      </div>

    </div>
  </v-card>
</template>

<style scoped>
/* Customização fina da scrollbar se desejar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 4px;
}
</style>