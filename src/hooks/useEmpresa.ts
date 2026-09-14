import type { EmpresaUpdateDto } from "@/Dtos/empresa/empresaDto";
import { empresaQueryKey } from "@/queries/empresa.queries";
import { EmpresaService } from "@/services/EmpresaService";
import { resolveEmpresaId } from "@/utils/resolveEmpresaId";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useEmpresa() {
  const queryClient = useQueryClient();
  const service = EmpresaService();
  const toast = useToastStore();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [empresaQueryKey] });

  const updateMutation = useMutation({
    mutationFn: async (payload: EmpresaUpdateDto) => {
      const id = resolveEmpresaId();
      if (!id) throw new Error("empresaId não encontrado");
      return await service.update(id, payload);
    },
    onSuccess: () => {
      invalidate();
      toast.notify("Dados da empresa atualizados com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar dados da empresa.", "error");
    },
  });

  return {
    update: (payload: EmpresaUpdateDto) => updateMutation.mutateAsync(payload),
    isUpdating: updateMutation.isPending,
  };
}
