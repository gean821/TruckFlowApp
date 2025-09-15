<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
 <v-app>
    <Navbar />
   <v-main class="w-100">
     <RouterView />
   </v-main>
 </v-app>
</template>