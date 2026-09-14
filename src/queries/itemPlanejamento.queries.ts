import ItemPlanejamentoService from "@/services/ItemPlanejamentoService";
import { useQuery } from "@tanstack/vue-query";

export const itemPlanejamentoQueryKey = "itensPlanejamento";

export function useItensPlanejamentoQuery() {
  return useQuery({
    queryKey: [itemPlanejamentoQueryKey],
    queryFn: async () => await ItemPlanejamentoService.GetAll()
  });
}

export function useItemPlanejamentoByIdQuery(id: string) {
  return useQuery({
    queryKey: [itemPlanejamentoQueryKey, id],
    queryFn: async () => await ItemPlanejamentoService.GetById(id),
    enabled: !!id
  });
}
