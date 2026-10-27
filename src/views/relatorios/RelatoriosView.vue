<template>
  <v-container fluid class="pa-6 relatorios-shell">
    <div class="d-flex align-center justify-space-between flex-wrap mb-4" style="gap: 12px">
      <div>
        <div class="text-overline text-primary font-weight-bold">Inteligência operacional</div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">Relatórios</h1>
      </div>
      <div id="relatorio-acoes" class="d-flex align-center" style="gap: 8px" />
    </div>

    <v-tabs color="primary" density="comfortable" class="mb-5 abas" show-arrows>
      <v-tab v-for="aba in abas" :key="aba.rota" :to="{ name: aba.rota, query: route.query }" :prepend-icon="aba.icone" class="text-none font-weight-medium">
        {{ aba.titulo }}
      </v-tab>
    </v-tabs>

    <router-view />
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const abas = [
  { rota: "relatorios-visao-geral", titulo: "Visão geral", icone: "mdi-view-dashboard-outline" },
  { rota: "relatorios-recebimentos", titulo: "Recebimentos", icone: "mdi-package-variant-closed-check" },
  { rota: "relatorios-exportar", titulo: "Exportar dados", icone: "mdi-file-download-outline" },
];
</script>

<style scoped>
.abas {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
@media print {
  .abas {
    display: none;
  }
}
</style>
