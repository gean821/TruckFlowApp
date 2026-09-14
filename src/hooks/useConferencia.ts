import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ConferenciaService } from "@/services/ConferenciaService";
import { conferenciaQueryKey } from "@/queries/conferencia.queries";
import { useToastStore } from "@/stores/ToastStore";

export function useConferencia() {
  const queryClient = useQueryClient();
  const toast = useToastStore();

  const matchMutation = useMutation({
    mutationFn: ({ itemId, produtoId }: { itemId: string; produtoId: string }) =>
      ConferenciaService.matchItem(itemId, produtoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [conferenciaQueryKey] });
      toast.notify("Item vinculado. Sistema vai lembrar pra próxima nota.", "success");
    },
    onError: () => {
      toast.notify("Não foi possível vincular o item. Tente novamente.", "error");
    },
  });

  return {
    matchItem: (itemId: string, produtoId: string) =>
      matchMutation.mutateAsync({ itemId, produtoId }),
    isMatching: matchMutation.isPending,
  };
}
