<script setup lang="ts">
defineProps<{ docas: any; volume: any }>();
</script>

<template>
  <v-card elevation="0" class="border rounded-xl pa-5 h-100">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold">Status Operacional</h3>
      <v-chip size="small" color="success" variant="flat">Operação Normal</v-chip>
    </div>

    <div class="mb-6">
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 font-weight-medium">Ocupação das Docas</span>
        <span class="text-body-2 font-weight-bold">{{ docas.ocupacao }}%</span>
      </div>
      <v-progress-linear :model-value="docas.ocupacao" height="10" rounded color="#195FA0"
        bg-color="blue-grey-lighten-4"></v-progress-linear>
      <div class="d-flex gap-4 mt-2 text-caption text-grey">
        <span>🟢 {{ docas.livres }} Livres</span>
        <span>🔴 {{ docas.ocupadas }} Ocupadas</span>
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <div>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 font-weight-medium">Meta de Descarga Diária</span>
        <span class="text-body-2 font-weight-bold">{{ (volume.totalKg / 1000).toFixed(1) }} Ton</span>
      </div>
      <v-progress-linear :model-value="volume.progressoDiario" height="10" rounded color="teal"
        bg-color="teal-lighten-4"></v-progress-linear>
      <div class="text-caption text-grey mt-2">
        {{ volume.progressoDiario }}% da meta atingida hoje
      </div>
    </div>
  </v-card>
</template>