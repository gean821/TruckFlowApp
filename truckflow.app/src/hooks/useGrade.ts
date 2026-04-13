import type { GradeCreateDto, GradeUpdateDto } from "@/entities/grade.types";
import { GradeService } from "@/services/GradeService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query"

export const useGrade = () => {
  const queryClient = useQueryClient();
  const service = GradeService();
  const queryKey = 'grades'
  const toast = useToastStore();


  const createMutation = useMutation({
    mutationFn: async (payload: GradeCreateDto) =>
      await service.addGrade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Grade criada com sucesso!", "success");
    },
    onError: () => {
      toast.notify("Erro ao criar grade.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: GradeUpdateDto }) =>
      await service.updateGrade(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      toast.notify("Grade atualizada!", "success");
    },
    onError: () => {
      toast.notify("Erro ao atualizar grade.", "error");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      await service.deleteGrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.notify("Grade removida.", "info");
    },
    onError: () => {
      toast.notify("Erro ao remover grade.", "error");
    }
  });

  return {
    deleteGrade: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateGrade: updateMutation.mutateAsync,
    createGrade: createMutation.mutateAsync,
    isCreating: createMutation.isPending
  }
}