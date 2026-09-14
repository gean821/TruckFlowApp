import { defineStore } from "pinia";
import { ref } from "vue";

export const useComunicacaoDialogStore = defineStore("comunicacao-dialog", () => {
  const open = ref(false);
  const agendamentoId = ref<string | null>(null);
  const motoristaNome = ref<string | null>(null);
  const motoristaTelefone = ref<string | null>(null);

  function abrir(
    id: string,
    motorista?: string | null,
    telefone?: string | null) {
    agendamentoId.value = id;
    motoristaNome.value = motorista ?? null;
    motoristaTelefone.value = telefone ?? null;
    open.value = true;
  }

  function fechar() {
    open.value = false;
    agendamentoId.value = null;
    motoristaNome.value = null;
    motoristaTelefone.value = null;
  }

  return { open, agendamentoId, motoristaNome, motoristaTelefone, abrir, fechar };
});