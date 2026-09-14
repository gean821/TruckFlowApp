<template>
  <v-app>
    <Navbar v-if="router.currentRoute.value.meta.requiresAuth" />
    <v-main class="w-100">
      <RouterView />
    </v-main>
    <AppToast />
    <ComunicacaoAgendamentoDialog />
  </v-app>
</template>

<script setup lang="ts">
import AppToast from './components/common/AppToast.vue';
import Navbar from './components/navs/Navbar.vue';
import ComunicacaoAgendamentoDialog from './components/notifications/ComunicacaoAgendamentoDialog.vue';
import router from './router';
import { useRealtimeNotifications } from './composables/useRealtimeNotifications';

useRealtimeNotifications();
</script>