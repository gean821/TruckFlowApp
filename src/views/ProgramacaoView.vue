<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Grades</h1>
      <p class="text-body-1 text-grey">Gerencie a disponibilidade de recebimento de cargas da fábrica.</p>
    </div>

    <v-row>
      <v-col cols="12">
        <GradeView />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import GradeView from './GradeView.vue';
</script>