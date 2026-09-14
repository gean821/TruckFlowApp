import type { LocalDescargaListQueryDto } from "@/entities/localDescarga.types";
import { LocalDescargaService } from "@/services/LocalDescargaService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

const service = LocalDescargaService();

export const localDescargaQueryKey = 'locaisDescarga';

export function useLocalDescargaListQuery(
  params?: MaybeRef<LocalDescargaListQueryDto | undefined>
) {
  return useQuery({
    queryKey: [localDescargaQueryKey, params],
    queryFn: async () => await service.getAll(unref(params)),
    placeholderData: keepPreviousData
  });
}

export function useLocalDescargaByIdQuery(id: string) {
  return useQuery({
    queryKey: [localDescargaQueryKey, id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}
