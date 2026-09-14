<template>
  <v-dialog v-model="internalValue" max-width="450" persistent>
    <v-card class="rounded-xl pa-2 shadow-lg">
      <v-card-text class="text-center pt-6">
        <v-avatar :color="`${color}-lighten-5`" size="80" class="mb-6">
          <v-icon :color="color" size="40">{{ icon }}</v-icon>
        </v-avatar>

        <h3 class="text-h5 font-weight-bold text-slate-900 mb-3">
          {{ title }}
        </h3>

        <p class="text-body-1 text-medium-emphasis px-4">
          {{ message }}
        </p>
      </v-card-text>

      <v-card-actions class="justify-center pb-6 pt-4 px-6 ga-3">
        <v-btn variant="tonal" color="grey-darken-1" class="text-none px-6 flex-grow-1" rounded="lg" size="large"
          :disabled="loading" @click="close">
          Cancelar
        </v-btn>

        <v-btn :color="color" variant="flat" class="text-none px-6 flex-grow-1" rounded="lg" size="large"
          :loading="loading" @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  icon?: string;
  color?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  icon: 'mdi-alert-circle-outline',
  color: 'primary',
  loading: false
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const close = () => { internalValue.value = false; };
const confirm = () => { emit('confirm'); };
</script>