<template>
  <v-app>
    <Navbar v-if="router.currentRoute.value.meta.requiresAuth" />
    <v-main class="w-100">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Navbar from './components/navs/Navbar.vue';
import router from './router';

</script>