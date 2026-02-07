<template>
  <v-dialog v-model="internalValue" max-width="450">
    <v-card class="rounded-xl pa-4">
      <div class="text-center pt-4">
        <v-avatar color="red-lighten-5" size="64" class="mb-4">
          <v-icon color="error" size="32">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
          Tem certeza?
        </h3>
        <p class="text-body-2 text-grey-darken-1 px-6">
          {{ message || 'Esta ação não poderá ser desfeita.' }}
        </p>
      </div>

      <div class="d-flex gap-3 justify-center mt-6 pb-2">
        <v-btn
          variant="text"
          color="grey-darken-1"
          class="text-capitalize px-6"
          rounded="lg"
          @click="close"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="error"
          variant="flat"
          class="text-capitalize px-6"
          rounded="lg"
          :loading="loading"
          @click="confirm"
        >
          Sim, excluir
        </v-btn>
      </div>
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

function close() {
  internalValue.value = false;
}

function confirm() {
  emit('confirm');
}
</script>