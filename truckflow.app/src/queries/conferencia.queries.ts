import { useQuery } from "@tanstack/vue-query";
import { ConferenciaService } from "@/services/ConferenciaService";
import { computed, type MaybeRef, unref } from "vue";

export const conferenciaQueryKey = "conferencia";

export function useConferenciaQuery(agendamentoId: MaybeRef<string | null | undefined>) {
  return useQuery({
    queryKey: [conferenciaQueryKey, agendamentoId],
    queryFn: async () => {
      const id = unref(agendamentoId);
      if (!id) throw new Error("agendamentoId obrigatório");
      return await ConferenciaService.getByAgendamento(id);
    },
    enabled: computed(() => !!unref(agendamentoId)),
  });
}
