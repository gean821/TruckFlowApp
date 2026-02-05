<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const actions = [
  { title: 'Nova Grade', icon: 'mdi-calendar-plus', route: '/nova-grade', color: '#195FA0' },
  { title: 'Gerenciar Usuários', icon: 'mdi-account-group', route: '/usuarios', color: '#E65100' },
  { title: 'Cadastrar Produto', icon: 'mdi-package-variant-closed', route: '/produtos', color: '#2E7D32' },
  { title: 'Relatório Diário', icon: 'mdi-file-chart', route: '/relatorios', color: '#455A64' },
];
</script>

<template>
  <v-row>
    <v-col v-for="action in actions" :key="action.title" cols="12" sm="6" md="6" lg="3">
      <v-card elevation="0" class="border rounded-xl pa-4 cursor-pointer action-card h-100"
        @click="router.push(action.route)">
        <div class="d-flex align-center">
          <v-avatar :color="action.color + '15'" rounded="lg" size="52" class="mr-4">
            <v-icon :color="action.color" size="28">{{ action.icon }}</v-icon>
          </v-avatar>

          <div style="min-width: 0; flex: 1;">
            <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate">
              {{ action.title }}
            </div>
            <div class="text-caption text-grey text-truncate">Acessar módulo</div>
          </div>

          <v-icon color="grey-lighten-2" icon="mdi-chevron-right"></v-icon>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.action-card {
  transition: all 0.2s ease-in-out;
}

.action-card:hover {
  background-color: white;
  border-color: #195FA0 !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
}
</style>