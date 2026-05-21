import {
  notificacaoQueryKey,
  notificacaoUnreadCountQueryKey,
} from "@/queries/notificacao.queries";
import { useAuthStore } from "@/stores/AuthStore";
import { useToastStore, type ToastType } from "@/stores/ToastStore";
import {
  PrioridadeNotificacao,
  type NotificacaoEventDto,
} from "@/entities/notificacao.types";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/vue-query";
import { onUnmounted, watch } from "vue";

// FatalError aborta reconexão; RetriableError força nova tentativa imediata.
// Erros não-anotados deixam a lib reconectar com backoff padrão (que já é exponencial).
class FatalSseError extends Error { }

export function useRealtimeNotifications() {
  const auth = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToastStore();

  let abortController: AbortController | null = null;

  function invalidateNotificacaoQueries() {
    queryClient.invalidateQueries({ queryKey: [notificacaoQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoUnreadCountQueryKey] });
  }

  function toastTypeFor(prioridade: PrioridadeNotificacao): ToastType {
    if (prioridade === PrioridadeNotificacao.Critica) {
      return "error";
    }

    if (prioridade === PrioridadeNotificacao.Alta) {
      return "warning";
    }

    return "info";
  }

  function connect() {
    if (!auth.token) {
      return;
    }

    abortController = new AbortController();
    const baseUrl = import.meta.env.VITE_API_URL;
    const token = auth.token;

    fetchEventSource(`${baseUrl}notifications/stream`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: abortController.signal,
      openWhenHidden: true,

      async onopen(response) {
        if (
          response.ok &&
          response.headers.get("content-type")?.includes(EventStreamContentType)
        ) {
          invalidateNotificacaoQueries();
          return;
        }

        if (response.status === 401 || response.status === 403) {
          throw new FatalSseError("Unauthorized SSE");
        }
        throw new Error(`SSE openendpoint retornou ${response.status}`);
      },

      onmessage(msg) {
        if (msg.event !== "notification" || !msg.data) return;

        try {
          const evt: NotificacaoEventDto = JSON.parse(msg.data);
          invalidateNotificacaoQueries();
          toast.notify(evt.titulo, toastTypeFor(evt.prioridade), 5000);
        } catch (err) {
          console.error("[realtime] falha parseando evento SSE", err, msg);
        }
      },

      onerror(err) {
        if (err instanceof FatalSseError) {
          throw err;
        }
        console.warn("[realtime] erro SSE, reconectando", err);
      },
    }).catch((err) => {
      if (err instanceof FatalSseError) {
        console.warn("[realtime] SSE encerrado: auth inválido");
      }
    });
  }

  function disconnect() {
    abortController?.abort();
    abortController = null;
  }

  watch(
    () => auth.token,
    (newToken, oldToken) => {
      if (newToken && !oldToken) {
        connect();
      } else if (!newToken && oldToken) {
        disconnect();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    disconnect();
  });

  return { disconnect };
}