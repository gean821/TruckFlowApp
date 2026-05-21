<template>
  <v-menu
    location="bottom end"
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        icon
        variant="text"
        size="small"
        class="appbar-icon-btn"
        v-bind="props"
      >
        <v-badge
          :content="badgeText"
          :model-value="(unreadCount ?? 0) > 0"
          color="#FF5252"
          offset-x="-1"
          offset-y="-1"
        >
          <v-icon color="rgba(255,255,255,0.85)" size="20"
            >mdi-bell-outline</v-icon
          >
        </v-badge>
      </v-btn>
    </template>

    <v-card
      min-width="360"
      max-width="400"
      elevation="0"
      class="rounded-xl mt-2 bell-card"
    >
      <div class="bell-header">
        <span class="bell-title">Notificações</span>
        <span v-if="(unreadCount ?? 0) > 0" class="bell-counter"
          >{{ unreadCount }} não lida(s)</span
        >
      </div>
      <v-divider />

      <div v-if="isLoading" class="bell-state">
        <v-progress-circular
          indeterminate
          size="22"
          width="2"
          color="primary"
        />
      </div>

      <div
        v-else-if="!notificacoes || notificacoes.length === 0"
        class="bell-state bell-empty"
      >
        <v-icon size="32" color="grey-lighten-1">mdi-bell-off-outline</v-icon>
        <span class="bell-empty-text">Nenhuma notificação ainda</span>
      </div>

      <v-list v-else density="compact" class="bell-list py-0" lines="three">
        <v-list-item
          v-for="item in notificacoes"
          :key="item.id"
          :class="['bell-item', { 'bell-item-unread': !item.lidaEm }]"
          @click="onClickItem(item)"
        >
          <template #prepend>
            <v-icon :color="iconColorForTipo(item.tipo)" size="20">{{
              iconForTipo(item.tipo)
            }}</v-icon>
          </template>
          <v-list-item-title class="bell-item-title">{{
            item.titulo
          }}</v-list-item-title>
          <v-list-item-subtitle class="bell-item-corpo">{{
            item.corpo
          }}</v-list-item-subtitle>
          <template #append>
            <span class="bell-item-time">{{
              formatRelative(item.criadaEm)
            }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  useNotificacoesPagedQuery,
  useNotificacoesUnreadCountQuery,
} from "@/queries/notificacao.queries";
import { useNotificacao } from "@/hooks/useNotificacao";
import { useComunicacaoDialogStore } from "@/stores/ComunicacaoDialogStore";
import {
  TipoNotificacao,
  type NotificacaoListItemDto,
  type NotificacaoListQueryDto,
} from "@/entities/notificacao.types";

const comunicacaoDialog = useComunicacaoDialogStore();

const bellQuery = ref<NotificacaoListQueryDto>({
  pageNumber: 1,
  pageSize: 10,
});

const { data: page, isLoading } = useNotificacoesPagedQuery(bellQuery);
const notificacoes = computed(() => page.value?.items ?? []);
const { data: unreadCount } = useNotificacoesUnreadCountQuery();
const { markAsRead } = useNotificacao();

const badgeText = computed(() => {
  const n = unreadCount.value ?? 0;
  return n > 99 ? "99+" : String(n);
});

function iconForTipo(tipo: TipoNotificacao): string {
  switch (tipo) {
    case TipoNotificacao.AgendamentoCancelado:
      return "mdi-calendar-remove-outline";
    case TipoNotificacao.AgendamentoConfirmado:
      return "mdi-calendar-check-outline";
    case TipoNotificacao.AgendamentoReagendado:
      return "mdi-calendar-clock-outline";
    case TipoNotificacao.AgendamentoExpirado:
      return "mdi-calendar-alert-outline";
    case TipoNotificacao.AgendamentoCriado:
      return "mdi-calendar-plus-outline";
    case TipoNotificacao.MotoristaAtrasoInformado:
      return "mdi-clock-alert-outline";
    case TipoNotificacao.MotoristaChegou:
      return "mdi-truck-check-outline";
    case TipoNotificacao.MotoristaSaiu:
      return "mdi-truck-delivery-outline";
    case TipoNotificacao.JanelaPropxima:
      return "mdi-timer-sand";
    default:
      return "mdi-bell-outline";
  }
}

function iconColorForTipo(tipo: TipoNotificacao): string {
  switch (tipo) {
    case TipoNotificacao.AgendamentoCancelado:
    case TipoNotificacao.AgendamentoExpirado:
      return "error";
    case TipoNotificacao.AgendamentoConfirmado:
    case TipoNotificacao.MotoristaChegou:
      return "success";
    case TipoNotificacao.AgendamentoReagendado:
    case TipoNotificacao.MotoristaAtrasoInformado:
    case TipoNotificacao.JanelaPropxima:
      return "warning";
    default:
      return "primary";
  }
}

function formatRelative(iso: string): string {
  const created = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - created) / 1000));
  if (diffSec < 60) return "agora";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}

async function onClickItem(item: NotificacaoListItemDto) {
  if (!item.lidaEm) {
    await markAsRead(item.id);
  }
  try {
    const payload = JSON.parse(item.payloadJson) as { agendamentoId?: string };
    if (payload?.agendamentoId) {
      comunicacaoDialog.abrir(payload.agendamentoId);
    }
  } catch {}
}
</script>

<style scoped>
.bell-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14) !important;
}

.bell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fc;
}

.bell-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.bell-counter {
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
}

.bell-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.bell-empty {
  flex-direction: column;
  gap: 8px;
}

.bell-empty-text {
  font-size: 12px;
  color: #9ca3af;
}

.bell-list {
  max-height: 420px;
  overflow-y: auto;
}

.bell-item {
  cursor: pointer;
  transition: background 0.12s;
  border-left: 3px solid transparent;
}

.bell-item:hover {
  background: #f8f9fc;
}

.bell-item-unread {
  background: rgba(100, 181, 246, 0.06);
  border-left-color: #64b5f6;
}

.bell-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.bell-item-corpo {
  font-size: 12px;
  color: #6b7280;
}

.bell-item-time {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
}
</style>
