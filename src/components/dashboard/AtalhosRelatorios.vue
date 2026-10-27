<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-3">
      <h3 class="text-h6 font-weight-bold text-grey-darken-3">Relatórios</h3>
      <v-btn variant="text" color="primary" size="small" append-icon="mdi-arrow-right" to="/relatorios">Ver todos</v-btn>
    </div>
    <v-row dense>
      <v-col v-for="atalho in atalhos" :key="atalho.to" cols="12" sm="6" lg="3">
        <v-card :to="atalho.to" elevation="0" class="rounded-xl pa-4 atalho h-100 d-flex align-center">
          <v-avatar :color="`${atalho.cor}-lighten-5`" size="44" rounded="lg" class="mr-3">
            <v-icon :color="atalho.cor">{{ atalho.icone }}</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-1 font-weight-bold text-grey-darken-4">{{ atalho.titulo }}</div>
            <div class="text-caption text-grey-darken-1">{{ atalho.descricao }}</div>
          </div>
          <v-icon class="text-grey">mdi-chevron-right</v-icon>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const atalhos = [
  { to: "/relatorios/visao-geral", titulo: "Visão geral", descricao: "KPIs, tendências e horários de pico", icone: "mdi-view-dashboard-outline", cor: "primary" },
  { to: "/relatorios/visao-geral?periodo=30d", titulo: "Últimos 30 dias", descricao: "Como foi o mês da operação", icone: "mdi-chart-timeline-variant", cor: "indigo" },
  { to: "/relatorios/visao-geral?periodo=7d", titulo: "Última semana", descricao: "Comparada com a semana anterior", icone: "mdi-calendar-week", cor: "teal" },
  { to: "/relatorios/exportar", titulo: "Exportar dados", descricao: "CSV e PDF dos agendamentos", icone: "mdi-file-download-outline", cor: "deep-purple" },
];
</script>

<style scoped>
.atalho {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.atalho:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px rgba(25, 95, 160, 0.15), 0 12px 32px rgba(15, 23, 42, 0.1);
}
</style>
