import { ProdutoService } from "@/services/ProdutoService";
import { useQuery } from "@tanstack/vue-query";

const service = ProdutoService();

export const produtoQueryKey = 'produtos';

export function useProdutosQuery() {
  return useQuery({
    queryKey: [produtoQueryKey],
    queryFn: async () => await service.getAll()
  });
}

export function useProdutoByIdQuery(id: string) {
  return useQuery({
    queryKey: [produtoQueryKey, id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}
