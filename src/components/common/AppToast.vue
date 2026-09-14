<script setup lang="ts">
import { useToastStore } from '@/stores/ToastStore';
import { storeToRefs } from 'pinia';

const store = useToastStore();
const { show, message, type, timeout } = storeToRefs(store);

const toastConfig = {
  success: { color: 'success', icon: 'mdi-check-circle' },
  error: { color: 'error', icon: 'mdi-alert-circle' },
  info: { color: 'info', icon: 'mdi-information' },
  warning: { color: 'warning', icon: 'mdi-alert' }
};
</script>

<template>
  <v-snackbar v-model="show" :color="toastConfig[type].color" :timeout="timeout" location="top right" elevation="4"
    rounded="lg" variant="flat">
    <div class="d-flex align-center gap-2">
      <v-icon :icon="toastConfig[type].icon" class="mr-2" />
      <span class="font-weight-medium text-body-2">{{ message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn icon="mdi-close" variant="text" size="small" @click="show = false"></v-btn>
    </template>
  </v-snackbar>
</template>