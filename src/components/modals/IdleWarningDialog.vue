<template>
  <v-dialog :model-value="modelValue" max-width="450" persistent>
    <v-card class="rounded-xl pa-2 shadow-lg">
      <v-card-text class="text-center pt-6">
        <v-avatar color="warning-lighten-5" size="80" class="mb-6">
          <v-icon color="warning" size="40">mdi-timer-sand</v-icon>
        </v-avatar>

        <h3 class="text-h5 font-weight-bold text-slate-900 mb-3">
          Sua sessão vai expirar
        </h3>

        <p class="text-body-1 text-medium-emphasis px-4">
          Por inatividade, você será desconectado em <strong>{{ segundos }}s</strong>.
        </p>
      </v-card-text>

      <v-card-actions class="justify-center pb-6 pt-4 px-6 ga-3">
        <v-btn variant="tonal" color="grey-darken-1" class="text-none px-6 flex-grow-1" rounded="lg" size="large"
          @click="emit('sair')">
          Sair agora
        </v-btn>

        <v-btn color="primary" variant="flat" class="text-none px-6 flex-grow-1" rounded="lg" size="large"
          @click="emit('continuar')">
          Continuar conectado
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  segundos: number;
}>();

const emit = defineEmits<{
  continuar: [];
  sair: [];
}>();
</script>