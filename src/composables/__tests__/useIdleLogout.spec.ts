import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/AuthStore";
import { useIdleLogout } from "../useIdleLogout";

vi.mock("@/router", () => ({ default: { push: vi.fn() } }));
vi.mock("@/http/http", () => ({ default: { post: vi.fn().mockResolvedValue({}) } }));

const MIN = 60_000;
let wrapper: VueWrapper;

function montar() {
  const pinia = createPinia();
  setActivePinia(pinia);

  const auth = useAuthStore();
  auth.token = "token-fake";
  const logout = vi.spyOn(auth, "logout").mockResolvedValue();

  let api!: ReturnType<typeof useIdleLogout>;
  const Harness = defineComponent({
    setup() {
      api = useIdleLogout();
      return () => null;
    },
  });

  wrapper = mount(Harness, { global: { plugins: [pinia, VueQueryPlugin] } });
  return { logout, api };
}

describe("useIdleLogout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    wrapper.unmount();
    vi.useRealTimers();
  });

  it("desloga após 20 min sem interação", () => {
    const { logout } = montar();

    vi.advanceTimersByTime(20 * MIN);

    expect(logout).toHaveBeenCalledWith("inatividade");
  });

  it("interação contínua não desloga", () => {
    const { logout } = montar();

    for (let i = 0; i < 60; i++) {
      vi.advanceTimersByTime(MIN);
      window.dispatchEvent(new Event("pointermove"));
    }

    expect(logout).not.toHaveBeenCalled();
  });

  it("não mostra aviso antes da hora", () => {
    const { api } = montar();

    vi.advanceTimersByTime(18 * MIN);

    expect(api.avisoAberto.value).toBe(false);
  });

  it("mostra aviso 60s antes e 'continuar' renova a sessão", () => {
    const { logout, api } = montar();

    vi.advanceTimersByTime(19 * MIN);
    expect(api.avisoAberto.value).toBe(true);
    expect(api.segundosRestantes.value).toBe(60);

    api.continuarConectado();
    expect(api.avisoAberto.value).toBe(false);

    vi.advanceTimersByTime(19 * MIN);
    expect(logout).not.toHaveBeenCalled();
  });

  it("com o aviso aberto, mexer o mouse não renova a sessão", () => {
    const { logout } = montar();

    vi.advanceTimersByTime(19 * MIN);
    window.dispatchEvent(new Event("pointermove"));
    vi.advanceTimersByTime(MIN);

    expect(logout).toHaveBeenCalledWith("inatividade");
  });
});
