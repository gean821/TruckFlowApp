<script setup lang="ts">
defineProps<{
  stats: any;
  loading: boolean;
}>();

const items = [
  { key: 'totalAgendamentos', label: 'Agendamentos Hoje', icon: 'mdi-calendar-check', color: 'primary', bg: 'blue-lighten-5' },
  { key: 'emAndamento', label: 'Veículos no Pátio', icon: 'mdi-truck-fast', color: 'info', bg: 'cyan-lighten-5' },
  { key: 'finalizados', label: 'Descargas Concluídas', icon: 'mdi-check-circle', color: 'success', bg: 'green-lighten-5' },
  { key: 'atrasados', label: 'Atrasos / Alertas', icon: 'mdi-alert-circle', color: 'error', bg: 'red-lighten-5' },
];
</script>

<template>
  <v-row>
    <v-col v-for="item in items" :key="item.key" cols="12" sm="6" lg="3">
      <v-card elevation="0" class="border rounded-xl pa-4 h-100 transition-swing">
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="text-caption text-grey-darken-1 font-weight-medium text-uppercase mb-1">
              {{ item.label }}
            </div>
            <div v-if="!loading" class="text-h4 font-weight-bold text-grey-darken-3">
              {{ stats[item.key] }}
            </div>
            <v-skeleton-loader v-else type="heading" width="50px" class="mt-1"></v-skeleton-loader>
          </div>

          <v-avatar :color="item.bg" size="48" class="rounded-lg">
            <v-icon :color="item.color" size="24">{{ item.icon }}</v-icon>
          </v-avatar>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}
</style>