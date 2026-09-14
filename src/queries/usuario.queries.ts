import type { UsuarioListQueryDto } from "@/entities/usuario.types";
import { UsuarioService } from "@/services/UsuarioService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

const service = UsuarioService();

export const usuarioQueryKey = "usuarios";

export function useUsuariosQuery(params: MaybeRef<UsuarioListQueryDto>) {
  return useQuery({
    queryKey: [usuarioQueryKey, params],
    queryFn: async () => await service.getPaged(unref(params)),
    placeholderData: keepPreviousData
  });
}

export function useUsuarioByIdQuery(id: MaybeRef<string | undefined | null>) {
  return useQuery({
    queryKey: [usuarioQueryKey, id],
    queryFn: async () => await service.getById(unref(id)!),
    enabled: () => !!unref(id)
  });
}

export function useRolesQuery() {
  return useQuery({
    queryKey: [usuarioQueryKey, "roles"],
    queryFn: async () => await service.getRoles(),
    staleTime: 5 * 60 * 1000
  });
}
