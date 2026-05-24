<template>
  <v-dialog v-model="open" max-width="640" scrollable>
    <v-card class="rounded-xl comunicacao-card">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon color="primary" class="mr-2">mdi-forum-outline</v-icon>
        <div class="d-flex flex-column">
          <span class="text-h6">Comunicação</span>
          <span v-if="motoristaNome" class="text-caption text-grey-darken-1">
            Motorista: {{ motoristaNome }}
          </span>
        </div>
        <v-spacer />
        <v-tooltip
          v-if="whatsappUrl"
          :text="`Falar com ${motoristaNome ?? 'motorista'} no WhatsApp`"
          location="bottom"
        >
          <template #activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              color="success"
              v-bind="props"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-btn icon variant="text" size="small" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0 timeline-container">
        <div v-if="isLoading" class="d-flex justify-center align-center py-8">
          <v-progress-circular indeterminate size="32" color="primary" />
        </div>

        <div
          v-else-if="!items?.length"
          class="d-flex flex-column align-center py-8 px-4"
        >
          <v-icon size="48" color="grey-lighten-1">mdi-forum-outline</v-icon>
          <span class="text-body-2 text-grey mt-3"
            >Nenhuma comunicação ainda neste agendamento.</span
          >
          <span v-if="canEnviar" class="text-caption text-grey-darken-1 mt-1">
            Use o campo abaixo para enviar a primeira mensagem ao motorista.
          </span>
        </div>

        <div v-else class="timeline-list">
          <div
            v-for="item in items"
            :key="item.id"
            :class="['timeline-item', alinhamentoClasse(item.tipo)]"
          >
            <div
              class="timeline-bubble"
              :style="{ background: bgPorTipo(item.tipo) }"
            >
              <div class="timeline-meta">
                <v-icon size="14" :color="iconColor(item.tipo)">{{
                  iconForTipo(item.tipo)
                }}</v-icon>
                <span class="timeline-usuario">{{ headerDaBubble(item) }}</span>
                <span class="timeline-time">{{
                  formatTime(item.criadaEm)
                }}</span>
              </div>
              <div class="timeline-corpo">{{ item.corpo }}</div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <div v-if="canEnviar" class="enviar-section pa-4">
        <v-textarea
          v-model="corpo"
          label="Nova mensagem ao motorista"
          density="comfortable"
          variant="outlined"
          rows="2"
          auto-grow
          maxlength="2000"
          counter
          hide-details="auto"
        />
        <div class="d-flex justify-end mt-3">
          <v-btn
            color="primary"
            variant="flat"
            :loading="isEnviando"
            :disabled="!canSubmit"
            @click="submit"
          >
            <v-icon size="16" class="mr-1">mdi-send</v-icon>
            Enviar
          </v-btn>
        </div>
      </div>

      <div v-else class="px-4 py-3 text-caption text-grey">
        <v-icon size="14" color="grey" class="mr-1"
          >mdi-information-outline</v-icon
        >
        Envio de mensagem disponível apenas para administradores.
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { format, parseISO } from "date-fns";
import { useComunicacaoDialogStore } from "@/stores/ComunicacaoDialogStore";
import { useComunicacaoAgendamentoQuery } from "@/queries/notificacao.queries";
import { useNotificacao } from "@/hooks/useNotificacao";
import { useAuthStore } from "@/stores/AuthStore";
import {
  TipoNotificacao,
  type NotificacaoListItemDto,
} from "@/entities/notificacao.types";

const store = useComunicacaoDialogStore();
const {
  open: storeOpen,
  agendamentoId,
  motoristaNome,
  motoristaTelefone,
} = storeToRefs(store);

const auth = useAuthStore();
const canEnviar = computed(() => auth.userRole === "Admin");

const whatsappUrl = computed(() => {
  if (!canEnviar.value) {
    return null;
  }

  const raw = motoristaTelefone.value;

  if (!raw) {
    return null;
  }

  const digits = raw.replace(/\D/g, "");

  if (digits.length < 10) {
    return null;
  }

  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  const greeting = motoristaNome.value
    ? `Olá ${motoristaNome.value.split(" ")[0]}, sobre seu agendamento: `
    : "Olá, sobre seu agendamento: ";

  return `https://wa.me/${withCountry}?text=${encodeURIComponent(greeting)}`;
});

const {
  data: items,
  isLoading,
  refetch,
} = useComunicacaoAgendamentoQuery(agendamentoId);
const { enviarParaMotorista, isEnviando } = useNotificacao();

const corpo = ref("");

const open = computed({
  get: () => storeOpen.value,
  set: (v) => {
    if (!v) store.fechar();
  },
});

const canSubmit = computed(
  () => !!agendamentoId.value && !!corpo.value?.trim() && !isEnviando.value,
);

watch(open, (v) => {
  if (v) {
    corpo.value = "";
  }
});

async function submit() {
  if (!canSubmit.value || !agendamentoId.value) {
    return;
  }

  await enviarParaMotorista({
    agendamentoId: agendamentoId.value,
    corpo: corpo.value.trim(),
  });

  corpo.value = "";
  await refetch();
}

function close() {
  store.fechar();
}

function alinhamentoClasse(tipo: TipoNotificacao): string {
  if (auth.userRole === "Admin" && tipo === TipoNotificacao.MensagemManualAdmin)
    return "align-right";
  if (
    auth.userRole === "Motorista" &&
    tipo === TipoNotificacao.MensagemManualMotorista
  )
    return "align-right";
  return "align-left";
}

function bgPorTipo(tipo: TipoNotificacao): string {
  if (tipo === TipoNotificacao.MensagemManualAdmin) {
    return "#e3f2fd";
  }

  if (tipo === TipoNotificacao.MensagemManualMotorista) {
    return "#f1f8e9";
  }

  if (
    tipo === TipoNotificacao.AgendamentoCancelado ||
    tipo === TipoNotificacao.AgendamentoExpirado
  ) {
    return "#ffebee";
  }

  if (
    tipo === TipoNotificacao.AgendamentoConfirmado ||
    tipo === TipoNotificacao.MotoristaChegou
  ) {
    return "#e8f5e9";
  }

  return "#f5f5f5";
}

function iconForTipo(tipo: TipoNotificacao): string {
  switch (tipo) {
    case TipoNotificacao.MensagemManualAdmin:
    case TipoNotificacao.MensagemManualMotorista:
      return "mdi-message-text-outline";
    case TipoNotificacao.AgendamentoCancelado:
      return "mdi-calendar-remove-outline";
    case TipoNotificacao.AgendamentoConfirmado:
      return "mdi-calendar-check-outline";
    case TipoNotificacao.AgendamentoReagendado:
      return "mdi-calendar-clock-outline";
    case TipoNotificacao.AgendamentoExpirado:
      return "mdi-calendar-alert-outline";
    default:
      return "mdi-bell-outline";
  }
}

function iconColor(tipo: TipoNotificacao): string {
  if (
    tipo === TipoNotificacao.AgendamentoCancelado ||
    tipo === TipoNotificacao.AgendamentoExpirado
  )
    return "error";

  if (tipo === TipoNotificacao.AgendamentoConfirmado) {
    return "success";
  }

  return "primary";
}

function headerDaBubble(item: NotificacaoListItemDto): string {
  const ehMensagemManual =
    item.tipo === TipoNotificacao.MensagemManualAdmin ||
    item.tipo === TipoNotificacao.MensagemManualMotorista;

  if (ehMensagemManual) {
    const autorNome = extrairAutorNome(item.payloadJson);
    if (autorNome) {
      return autorNome;
    }
  }

  return item.titulo;
}

function extrairAutorNome(
  payloadJson: string | null | undefined,
): string | null {
  if (!payloadJson) {
    return null;
  }
  
  try {
    const obj = JSON.parse(payloadJson);
    const nome = obj?.autorNome;
    return typeof nome === "string" && nome.trim() !== "" ? nome : null;
  } catch {
    return null;
  }
}

function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), "dd/MM HH:mm");
  } catch {
    return "";
  }
}
</script>

<style scoped>
.comunicacao-card {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.timeline-container {
  background: #fafbfc;
  min-height: 200px;
  max-height: 50vh;
  overflow-y: auto;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.timeline-item {
  display: flex;
  width: 100%;
}

.align-left {
  justify-content: flex-start;
}

.align-right {
  justify-content: flex-end;
}

.timeline-bubble {
  max-width: 75%;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.timeline-usuario {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-time {
  font-size: 10px;
  color: #9ca3af;
  white-space: nowrap;
}

.timeline-corpo {
  font-size: 13px;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
}

.enviar-section {
  background: white;
}
</style>
