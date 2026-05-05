import { useQuery } from "@tanstack/vue-query";
import { EmpresaService } from "@/services/EmpresaService";
import { resolveEmpresaId } from "@/utils/resolveEmpresaId";
import { computed } from "vue";

const service = EmpresaService();
export const empresaQueryKey = "empresa";

export function useEmpresaQuery() {
  const empresaId = computed(() => resolveEmpresaId());

  return useQuery({
    queryKey: [empresaQueryKey],
    queryFn: async () => await service.get(empresaId.value!),
    enabled: () => !!empresaId.value,
  });
}
