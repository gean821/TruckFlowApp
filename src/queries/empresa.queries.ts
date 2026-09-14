import { useQuery } from "@tanstack/vue-query";
import { EmpresaService } from "@/services/EmpresaService";
import { resolveEmpresaId } from "@/utils/resolveEmpresaId";
import { computed } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const service = EmpresaService();
export const empresaQueryKey = "empresaId";

export function useEmpresaQuery() {
  const auth = useAuthStore();
  const empresaId = computed(() => auth.empresaId ?? null);

  return useQuery({
    queryKey: [empresaQueryKey, empresaId.value],
    queryFn: async () => {
      if (!empresaId.value) {
        throw new Error("ID da empresa não disponível");
      }
      return await service.get(empresaId.value);
    },
    enabled: () => !!empresaId.value
  })
};
