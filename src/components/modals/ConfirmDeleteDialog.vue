<template>
  <v-dialog v-model="internalValue" max-width="400" persistent>
    <v-card class="rounded-xl pa-4 shadow-lg">
      <v-card-text class="text-center pt-6">
        <v-avatar color="error-lighten-5" size="72" class="mb-6">
          <v-icon color="error" size="36">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        
        <h3 class="text-h5 font-weight-bold text-slate-900 mb-3">
          Confirmar Exclusão
        </h3>
        
        <p class="text-body-1 text-medium-emphasis px-2">
          {{ message || 'Tem certeza que deseja excluir este registro? Esta ação não poderá ser revertida.' }}
        </p>
      </v-card-text>

      <v-card-actions class="justify-center pb-6 pt-4 px-6">
        <v-btn
          variant="tonal"
          color="grey-darken-1"
          class="text-none px-6 py-2 flex-grow-1"
          rounded="lg"
          size="large"
          :disabled="loading"
          @click="close"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="error"
          variant="flat"
          class="text-none px-6 py-2 flex-grow-1"
          rounded="lg"
          size="large"
          :loading="loading"
          @click="confirm"
        >
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const close = () => { internalValue.value = false; };
const confirm = () => { emit('confirm'); };
</script>