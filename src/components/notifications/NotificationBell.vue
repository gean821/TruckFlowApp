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

      <div class="bell-filters">
        <v-chip
          v-for="opcao in FILTROS"
          :key="opcao.value"
          :color="filtroAtivo === opcao.value ? 'primary' : undefined"
          :variant="filtroAtivo === opcao.value ? 'flat' : 'outlined'"
          size="x-small"
          class="bell-filter-chip"
          @click="filtroAtivo = opcao.value"
        >
          {{ opcao.label }}
        </v-chip>
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
        v-else-if="notificacoesFiltradas.length === 0"
        class="bell-state bell-empty"
      >
        <v-icon size="32" color="grey-lighten-1">mdi-bell-off-outline</v-icon>
        <span class="bell-empty-text">{{
          notificacoes.length === 0
            ? "Nenhuma notificação ainda"
            : "Nada por aqui para esse filtro"
        }}</span>
      </div>

      <v-list v-else density="compact" class="bell-list py-0" lines="three">
        <v-list-item
          v-for="item in notificacoesFiltradas"
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
          <div
            v-if="contextoPayload(parsePayload(item.payloadJson))"
            class="bell-item-context"
          >
            <v-icon size="11" class="mr-1">mdi-map-marker-outline</v-icon
            >{{ contextoPayload(parsePayload(item.payloadJson)) }}
          </div>
          <template #append>
            <span class="bell-item-time">{{
              formatRelative(item.criadaEm)
            }}</span>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />
      <div class="bell-footer">
        <router-link to="/notificacoes" class="bell-footer-link"
          >Ver histórico completo</router-link
        >
      </div>
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
import { useNotificacaoVisual } from "@/composables/useNotificacaoVisual";
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
const {
  iconForTipo,
  iconColorForTipo,
  parsePayload,
  formatRelative,
  contextoPayload,
} = useNotificacaoVisual();

const badgeText = computed(() => {
  const n = unreadCount.value ?? 0;
  return n > 99 ? "99+" : String(n);
});

type FiltroBell = "todas" | "naoLidas" | "mensagens" | "agendamentos";

const FILTROS: { value: FiltroBell; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "naoLidas", label: "Não lidas" },
  { value: "mensagens", label: "Mensagens" },
  { value: "agendamentos", label: "Agendamentos" },
];

const TIPOS_MENSAGEM = new Set<TipoNotificacao>([
  TipoNotificacao.MensagemManualAdmin,
  TipoNotificacao.MensagemManualMotorista,
]);

const TIPOS_AGENDAMENTO = new Set<TipoNotificacao>([
  TipoNotificacao.AgendamentoCriado,
  TipoNotificacao.AgendamentoConfirmado,
  TipoNotificacao.AgendamentoCancelado,
  TipoNotificacao.AgendamentoReagendado,
  TipoNotificacao.AgendamentoExpirado,
  TipoNotificacao.MotoristaAtrasoInformado,
  TipoNotificacao.MotoristaChegou,
  TipoNotificacao.MotoristaSaiu,
  TipoNotificacao.JanelaPropxima,
]);

const filtroAtivo = ref<FiltroBell>("todas");

const notificacoesFiltradas = computed(() => {
  switch (filtroAtivo.value) {
    case "naoLidas":
      return notificacoes.value.filter((n) => !n.lidaEm);
    case "mensagens":
      return notificacoes.value.filter((n) => TIPOS_MENSAGEM.has(n.tipo));
    case "agendamentos":
      return notificacoes.value.filter((n) => TIPOS_AGENDAMENTO.has(n.tipo));
    default:
      return notificacoes.value;
  }
});

async function onClickItem(item: NotificacaoListItemDto) {
  if (!item.lidaEm) {
    await markAsRead(item.id);
  }
  const payload = parsePayload(item.payloadJson);
  if (payload.agendamentoId) {
    comunicacaoDialog.abrir(payload.agendamentoId);
  }
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

.bell-filters {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  flex-wrap: wrap;
}

.bell-filter-chip {
  cursor: pointer;
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

.bell-item-context {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #8a97a3;
  margin-top: 2px;
}

.bell-footer {
  padding: 8px 16px;
  text-align: center;
}

.bell-footer-link {
  font-size: 12px;
  font-weight: 600;
  color: #195fa0;
  text-decoration: none;
}

.bell-footer-link:hover {
  text-decoration: underline;
}
</style>
