import { defineStore } from "pinia";
import { ref } from "vue";

export const useComunicacaoDialogStore = defineStore("comunicacao-dialog", () => {
  const open = ref(false);
  const agendamentoId = ref<string | null>(null);
  const motoristaNome = ref<string | null>(null);

  function abrir(
    id: string,
    motorista?: string | null) {
    agendamentoId.value = id;
    motoristaNome.value = motorista ?? null;
    open.value = true;
  }

  function fechar() {
    open.value = false;
    agendamentoId.value = null;
    motoristaNome.value = null;
  }

  return { open, agendamentoId, motoristaNome, abrir, fechar };
});