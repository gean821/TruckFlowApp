import {
  notificacaoAgendamentoQueryKey,
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
import router from "@/router";
import { refreshSession } from "@/http/http";

// FatalError aborta reconexão; RetriableError força nova tentativa imediata.
// Erros não-anotados deixam a lib reconectar com backoff padrão (que já é exponencial).
class FatalSseError extends Error { }
class SessaoExpiradaSseError extends Error { }

export function useRealtimeNotifications() {
  const auth = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToastStore();

  let abortController: AbortController | null = null;
  let tokenRenovadoPeloSse: string | null = null;

  function invalidateNotificacaoQueries() {
    queryClient.invalidateQueries({ queryKey: [notificacaoQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoUnreadCountQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoAgendamentoQueryKey] });
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

  async function renovarSessao(tokenRecusado: string) {
    if (auth.token !== tokenRecusado) {
      return;
    }

    if (tokenRenovadoPeloSse === tokenRecusado) {
      console.warn("[realtime] SSE recusou o token recém-renovado; encerrando tempo real");
      return;
    }

    try {
      tokenRenovadoPeloSse = await refreshSession();
      console.info("[realtime] token renovado após 401 do SSE");
    } catch {
      auth.clearSession();
      router.push("/login");
    }
  }

  function connect() {
    if (!auth.token) {
      return;
    }

    disconnect();

    abortController = new AbortController();
    const baseUrl = import.meta.env.VITE_API_URL;
    const token = auth.token;
    const url = `${baseUrl}notifications/stream`;

    console.info("[realtime] conectando SSE em", url);

    fetchEventSource(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      credentials: "include",
      signal: abortController.signal,
      openWhenHidden: true,

      async onopen(response) {
        console.info("[realtime] SSE onopen status=", response.status);

        if (
          response.ok &&
          response.headers.get("content-type")?.includes(EventStreamContentType)
        ) {
          tokenRenovadoPeloSse = null;
          invalidateNotificacaoQueries();
          return;
        }

        if (response.status === 401) {
          throw new SessaoExpiradaSseError("SSE com token expirado");
        }

        if (response.status === 403) {
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
        if (err instanceof FatalSseError || err instanceof SessaoExpiradaSseError) {
          throw err;
        }
        console.warn("[realtime] erro SSE, reconectando", err);
      },
    }).catch((err) => {
      if (err instanceof SessaoExpiradaSseError) {
        void renovarSessao(token);
        return;
      }

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
    (newToken) => {
      if (newToken) {
        connect();
      } else {
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
