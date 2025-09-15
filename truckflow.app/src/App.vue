<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/icons/Navbar.vue';
</script>

<template>
 <v-app>
    <Navbar />
   <v-main class="w-100">
     <RouterView />
   </v-main>
 </v-app>
</template>