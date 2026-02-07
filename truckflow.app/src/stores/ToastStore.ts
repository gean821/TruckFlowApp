import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToastStore = defineStore('toast', () => {
  const show = ref(false);
  const message = ref('');
  const type = ref<ToastType>('success');
  const timeout = ref(3000);

  function notify(msg: string, toastType: ToastType = 'success', duration = 3000) {
    message.value = msg;
    type.value = toastType;
    timeout.value = duration;
    show.value = true;
  }

  return { show, message, type, timeout, notify };
});