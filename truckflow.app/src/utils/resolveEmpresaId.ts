import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/AuthStore";

export function resolveEmpresaId(): string | null {
  const auth = useAuthStore();
  if (auth.empresaId) return auth.empresaId;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    return (
      decoded.empresaId ??
      decoded.EmpresaId ??
      decoded.empresa_id ??
      null
    );
  } catch {
    return null;
  }
}
