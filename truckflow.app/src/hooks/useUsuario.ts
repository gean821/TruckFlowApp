import type { UsuarioCreateDto, UsuarioUpdateDto } from "@/entities/usuario.types";
import { usuarioQueryKey } from "@/queries/usuario.queries";
import { UsuarioService } from "@/services/UsuarioService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useUsuario() {
  const queryClient = useQueryClient();
  const service = UsuarioService();
  const toast = useToastStore();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [usuarioQueryKey] });

  const createMutation = useMutation({
    mutationFn: async (payload: UsuarioCreateDto) => await service.create(payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Usuário criado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao criar usuário.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UsuarioUpdateDto }) =>
      await service.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify("Usuário atualizado!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar usuário.", "error");
    }
  });

  const setStatusMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) =>
      await service.setStatus(id, ativo),
    onSuccess: (_data, variables) => {
      invalidate();
      toast.notify(
        variables.ativo ? "Usuário ativado!" : "Usuário inativado.",
        variables.ativo ? "success" : "info"
      );
    },
    onError: () => {
      toast.notify("Erro ao alterar status do usuário.", "error");
    }
  });

  return {
    create: (payload: UsuarioCreateDto) => createMutation.mutateAsync(payload),
    update: (id: string, payload: UsuarioUpdateDto) =>
      updateMutation.mutateAsync({ id, payload }),
    setStatus: (id: string, ativo: boolean) =>
      setStatusMutation.mutateAsync({ id, ativo }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isTogglingStatus: setStatusMutation.isPending
  };
}
