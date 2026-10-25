<template>
  <v-app>
    <Navbar v-if="router.currentRoute.value.meta.requiresAuth" />
    <v-main class="w-100">
      <RouterView />
    </v-main>
    <AppToast />
    <ComunicacaoAgendamentoDialog />
    <IdleWarningDialog
      :model-value="avisoAberto"
      :segundos="segundosRestantes"
      @continuar="continuarConectado"
      @sair="sairAgora"
    />
  </v-app>
</template>

<script setup lang="ts">
import AppToast from './components/common/AppToast.vue';
import Navbar from './components/navs/Navbar.vue';
import ComunicacaoAgendamentoDialog from './components/notifications/ComunicacaoAgendamentoDialog.vue';
import router from './router';
import { useRealtimeNotifications } from './composables/useRealtimeNotifications';
import IdleWarningDialog from './components/modals/IdleWarningDialog.vue';
import { useIdleLogout } from './composables/useIdleLogout';

useRealtimeNotifications();
const { avisoAberto, segundosRestantes, continuarConectado, sairAgora } = useIdleLogout();
</script>