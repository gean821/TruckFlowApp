<template>
  <v-dialog v-model="open" max-width="500" persistent>
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="primary" class="mr-2">mdi-message-text-outline</v-icon>
        <span class="text-h6">Avisar motorista</span>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <p v-if="motoristaNome" class="text-body-2 text-grey-darken-1 mb-4">
          Destinatário: <strong>{{ motoristaNome }}</strong>
        </p>
        <p v-else class="text-body-2 text-warning mb-4">
          <v-icon size="14" color="warning" class="mr-1"
            >mdi-alert-outline</v-icon
          >
          Atenção: agendamento sem motorista reservado. Mensagem não pode ser
          enviada.
        </p>

        <v-textarea
          v-model="corpo"
          label="Mensagem"
          variant="outlined"
          density="comfortable"
          rows="4"
          maxlength="2000"
          counter
          :disabled="!motoristaNome"
          :rules="[(v: string) => !!v?.trim() || 'Mensagem obrigatória']"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          color="grey-darken-1"
          :disabled="isEnviando"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isEnviando"
          :disabled="!canSubmit"
          @click="submit"
        >
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useNotificacao } from "@/hooks/useNotificacao";

const props = defineProps<{
  modelValue: boolean;
  agendamentoId: string;
  motoristaNome?: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { enviarParaMotorista, isEnviando } = useNotificacao();

const corpo = ref("");

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const canSubmit = computed(
  () =>
    !!props.motoristaNome &&
    !!corpo.value?.trim() &&
    !isEnviando.value,
);

watch(open, (v) => {
  if (v) {
    corpo.value = "";
  }
});

async function submit() {
  if (!canSubmit.value) {
    return;
  }

  await enviarParaMotorista({
    agendamentoId: props.agendamentoId,
    corpo: corpo.value.trim(),
  });

  close();
}

function close() {
  open.value = false;
}
</script>