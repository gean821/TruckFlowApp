import { useAuthStore } from "@/stores/AuthStore";
import { useQueryClient } from "@tanstack/vue-query";
import { onUnmounted, ref, watch } from "vue";

const MINUTO_MS = 60_000;
const TIMEOUT_MS = (Number(import.meta.env.VITE_IDLE_TIMEOUT_MIN) || 20) * MINUTO_MS;
const AVISO_MS = Math.min(MINUTO_MS, TIMEOUT_MS / 2);
const THROTTLE_ESCRITA_MS = 5_000;
const STORAGE_KEY = "tf_last_activity";
const CANAL_AUTH = "tf-auth";
const MSG_LOGOUT_INATIVIDADE = "logout-inatividade";
const EVENTOS_ATIVIDADE = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;
const OPCOES_LISTENER: AddEventListenerOptions = { capture: true, passive: true };

let lerUltimaAtividadeMemoria = 0;

function lerUltimaAtividade(): number {
    try{
        return Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
        return lerUltimaAtividadeMemoria
    }
}

function gravarUltimaAtividade(agora = Date.now()) {
    lerUltimaAtividadeMemoria = agora;
    try {
        localStorage.setItem(STORAGE_KEY, String(agora));
    } catch {}
}

export function registrarAtividade() {
    gravarUltimaAtividade();
}

export function useIdleLogout() {
    const auth = useAuthStore();
    const queryClient = useQueryClient();

    const avisoAberto = ref(false);
    const segundosRestantes = ref(0);

    let timer: ReturnType<typeof setTimeout> | undefined;
    let ultimaEscrita = 0;
    let canal: BroadcastChannel | null = null;

    function onAtividade() {
        if (avisoAberto.value) return;

        const agora = Date.now();
        if (agora - ultimaEscrita < THROTTLE_ESCRITA_MS) return;

        ultimaEscrita = agora;
        gravarUltimaAtividade(agora);
    }

    function agendar(delayMs: number) {
        clearTimeout(timer);
        timer = setTimeout(verificar, delayMs);
    }

    function verificar() {
        const restante = TIMEOUT_MS - (Date.now() - lerUltimaAtividade());

        if (restante <= 0) {
            void expirar();
            return;
        }

        if (restante > AVISO_MS) {
            avisoAberto.value = false;
            agendar(restante - AVISO_MS);
            return;
        }

        avisoAberto.value = true;
        segundosRestantes.value = Math.ceil(restante / 1000);
        agendar(Math.min(1000, restante));
    }

function onVisibilidade() {
    if (document.visibilityState === "visible") verificar();
  }

  async function onMensagemCanal(event: MessageEvent) {
    if (event.data !== MSG_LOGOUT_INATIVIDADE) return;

    parar();
    await auth.encerrarSessaoLocal("inatividade");
    queryClient.clear();
  }

  function iniciar(origem: "boot" | "login") {
    if (origem === "login" || !lerUltimaAtividade()) {
      gravarUltimaAtividade();
    }

    EVENTOS_ATIVIDADE.forEach((evento) => window.addEventListener(evento, onAtividade, OPCOES_LISTENER));
    document.addEventListener("visibilitychange", onVisibilidade);

    if ("BroadcastChannel" in window) {
      canal = new BroadcastChannel(CANAL_AUTH);
      canal.onmessage = onMensagemCanal;
    }

    verificar();
  }

  function parar() {
    clearTimeout(timer);
    timer = undefined;
    EVENTOS_ATIVIDADE.forEach((evento) => window.removeEventListener(evento, onAtividade, OPCOES_LISTENER));
    document.removeEventListener("visibilitychange", onVisibilidade);
    canal?.close();
    canal = null;
    avisoAberto.value = false;
  }

  async function expirar() {
    canal?.postMessage(MSG_LOGOUT_INATIVIDADE);
    parar();
    await auth.logout("inatividade");
    queryClient.clear();
  }

  function continuarConectado() {
    ultimaEscrita = Date.now();
    gravarUltimaAtividade(ultimaEscrita);
    verificar();
  }

  async function sairAgora() {
    parar();
    await auth.logout();
    queryClient.clear();
  }

  watch(
    () => auth.isAuthenticated,
    (autenticado, anterior) => {
      if (autenticado) {
        iniciar(anterior === undefined ? "boot" : "login");
      } else {
        parar();
      }
    },
    { immediate: true },
  );

  onUnmounted(parar);

  return { avisoAberto, segundosRestantes, continuarConectado, sairAgora };
}