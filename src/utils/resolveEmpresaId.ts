import { useAuthStore } from "@/stores/AuthStore";

export function resolveEmpresaId(): string | null {
  const auth = useAuthStore();
  return auth.empresaId ?? null;
}
