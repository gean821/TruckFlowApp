import { UnidadeEntregaService } from "@/services/UnidadeEntregaService";
import { useQuery } from "@tanstack/vue-query";

const service = UnidadeEntregaService();

export const unidadeEntregaQueryKey = 'unidadesEntrega';

export function useUnidadesEntregaQuery() {
  return useQuery({
    queryKey: [unidadeEntregaQueryKey],
    queryFn: async () => await service.getAll()
  });
}

export function useUnidadeEntregaByIdQuery(id: string) {
  return useQuery({
    queryKey: [unidadeEntregaQueryKey, id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}
