<template>
  <v-row>
    <v-col v-for="action in actions" :key="action.title" cols="12" sm="6" md="6" lg="3">
      <v-card
        elevation="0"
        class="rounded-xl pa-4 cursor-pointer action-card h-100"
        @click="router.push(action.route)"
      >
        <div class="d-flex align-center">
          <v-avatar :style="{ background: action.color + '18' }" rounded="lg" size="52" class="mr-4 flex-shrink-0">
            <v-icon :color="action.color" size="28">{{ action.icon }}</v-icon>
          </v-avatar>

          <div style="min-width: 0; flex: 1;">
            <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate">
              {{ action.title }}
            </div>
            <div class="text-caption text-grey-darken-1 text-truncate">{{ action.description }}</div>
          </div>

          <v-icon icon="mdi-chevron-right" class="flex-shrink-0 ml-2 chevron-icon" />
        </div>

        <div class="action-glow" :style="{ background: `radial-gradient(ellipse at bottom right, ${action.color}18 0%, transparent 70%)` }"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const actions = [
  { title: 'Nova Grade', description: 'Criar novo agendamento de grade', icon: 'mdi-calendar-plus', route: '/nova-grade', color: '#195FA0' },
  { title: 'Gerenciar Usuários', description: 'Visualizar e editar usuários', icon: 'mdi-account-group', route: '/usuarios', color: '#E65100' },
  { title: 'Cadastrar Produto', description: 'Adicionar produto ao sistema', icon: 'mdi-package-variant-closed', route: '/produtos', color: '#2E7D32' },
  { title: 'Relatório Diário', description: 'Exportar relatório de operações', icon: 'mdi-file-chart', route: '/relatorios', color: '#455A64' },
];
</script>

<style scoped>
.action-card {
  position: relative;
  overflow: hidden;
  border: none !important;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
  background: #ffffff;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 1px rgba(25,95,160,.12), 0 4px 8px rgba(25,95,160,.08), 0 16px 32px rgba(25,95,160,.12) !important;
}

.action-card:hover .chevron-icon {
  color: #195FA0 !important;
  transform: translateX(3px);
}

.chevron-icon {
  color: #CFD8DC;
  transition: transform 0.2s ease, color 0.2s ease;
}

.action-glow {
  position: absolute;
  bottom: 0; right: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.action-card:hover .action-glow {
  opacity: 1;
}
</style>
