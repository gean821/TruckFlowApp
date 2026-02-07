<template>
  <v-app-bar color="white" elevation="1" height="64" class="border-b">
    <v-app-bar-nav-icon variant="text" @click="abrirNavegacao" color="grey-darken-2"></v-app-bar-nav-icon>

    <div class="ml-2 d-flex align-center">
      <v-img src="/Rectangle.svg" alt="Logo TruckFlow" width="140" max-height="40" contain
        class="d-inline-block"></v-img>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center ga-2 pr-4">
      <v-btn icon color="grey-darken-1">
        <v-badge dot color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-menu location="bottom end" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" class="text-capitalize pl-1 pr-2" rounded="xl" v-bind="props">
            <v-avatar color="#195FA0" size="32" class="mr-2">
              <span class="text-white text-caption font-weight-bold">
                {{ profile.name?.substring(0, 2).toUpperCase() }}
              </span>
            </v-avatar>
            <div class="d-flex flex-column align-start text-caption">
              <span class="font-weight-bold text-grey-darken-3">{{ profile.name }}</span>
              <span class="text-grey">{{ profile.role }}</span>
            </div>
            <v-icon icon="mdi-chevron-down" size="small" class="ml-2 text-grey-lighten-1"></v-icon>
          </v-btn>
        </template>

        <v-card min-width="200" elevation="2" class="rounded-lg mt-2">
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account-cog-outline" title="Minha Conta" to="/account-config"></v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Sair" color="error" @click="logout"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="ativo" color="#195FA0" width="280" border="none" class="sidebar-custom">
    <div class="pa-6 text-center">
      <v-avatar size="80" color="white" class="mb-3 elevation-2">
        <v-img src="/cat.jpg" alt="Profile" cover></v-img>
      </v-avatar>
      <div class="text-white font-weight-bold text-h6">{{ profile.name }}</div>
      <div class="text-white-darken-1 text-body-2 opacity-80">{{ profile.role }}</div>
    </div>

    <v-divider class="mb-2 border-opacity-25" color="white"></v-divider>

    <v-list density="compact" nav class="px-3">

      <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard-outline" title="Dashboard" rounded="lg"
        active-class="active-white" class="mb-1 text-body-2 font-weight-medium text-white"></v-list-item>

      <v-list-item to="/visualizar" prepend-icon="mdi-calendar-multiselect" title="Agendamentos" rounded="lg"
        active-class="active-white" class="mb-1 text-body-2 font-weight-medium text-white"></v-list-item>

      <v-list-item to="/recebimentos" prepend-icon="mdi-file-document-edit-outline" title="Planej. Recebimento"
        rounded="lg" active-class="active-white" class="mb-1 text-body-2 font-weight-medium text-white"></v-list-item>

      <div class="mt-4 mb-2 px-3 text-caption font-weight-bold text-blue-lighten-4 opacity-70">OPERAÇÃO</div>

      <v-list-group value="Programacao">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-clock-outline" title="Programação" rounded="lg"
            class="text-white"></v-list-item>
        </template>

        <v-list-item to="nova-grade" title="Nova Grade" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
        <v-list-item to="/visualizar-grades" title="Visualizar Grades" rounded="lg"
          class="pl-10 text-white mb-1 opacity-90" active-class="active-white-sub"></v-list-item>
      </v-list-group>

      <v-list-group value="Gerenciar">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-database-outline" title="Cadastros" rounded="lg"
            class="text-white"></v-list-item>
        </template>

        <v-list-item to="produtos" title="Produtos" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
        <v-list-item to="locais" title="Locais de Descarga" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
        <v-list-item to="fornecedores" title="Fornecedores" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
      </v-list-group>

      <div class="mt-4 mb-2 px-3 text-caption font-weight-bold text-blue-lighten-4 opacity-70">CONTROLE</div>

      <v-list-item to="/bloqueios" prepend-icon="mdi-shield-lock-outline" title="Bloqueios" rounded="lg"
        active-class="active-white" class="mb-1 text-white"></v-list-item>

      <v-list-group value="Notificacoes">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-bell-badge-outline" title="Notificações" rounded="lg"
            class="text-white"></v-list-item>
        </template>
        <v-list-item to="reagendamentos" title="Reagendamentos" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
        <v-list-item to="enviar-notificacao" title="Enviar Nova" rounded="lg" class="pl-10 text-white mb-1 opacity-90"
          active-class="active-white-sub"></v-list-item>
      </v-list-group>

      <v-list-item to="/relatorios" prepend-icon="mdi-chart-box-outline" title="Relatórios" rounded="lg"
        active-class="active-white" class="mt-2 text-white"></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const ativo = ref(true);
const authStore = useAuthStore();

const profile = {
  name: authStore.user?.unique_name || 'Usuário',
  role: authStore.user?.role || 'Visitante'
};

function abrirNavegacao() {
  ativo.value = !ativo.value;
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
/* =========================================
   ESTILO MODERNO PARA SIDEBAR AZUL (#195FA0)
   ========================================= */

.active-white {
  background-color: white !important;
  color: #195FA0 !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.active-white-sub {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: 700 !important;
}

:deep(.v-list-item:not(.active-white):not(.active-white-sub):hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.v-icon) {
  opacity: 1;
}

:deep(.v-list-group__header .v-list-item__append) {
  color: white;
  opacity: 0.8;
}
</style>