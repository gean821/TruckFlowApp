import { FornecedorService } from "@/services/FornecedorService";
import { useQuery } from "@tanstack/vue-query";

const service = FornecedorService();

export const fornecedorQueryKey = 'fornecedores';

export function useFornecedoresQuery() {
  return useQuery({
    queryKey: [fornecedorQueryKey],
    queryFn: async () => await service.getAll()
  });
}

export function useFornecedorByIdQuery(id: string) {
  return useQuery({
    queryKey: [fornecedorQueryKey, id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}
