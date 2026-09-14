import type {
  CreateLocalDescargaDto,
  MudarStatusLocalDto,
  UpdateLocalDescargaDto
} from "@/entities/localDescarga.types";
import { LocalDescargaService } from "@/services/LocalDescargaService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import { localDescargaQueryKey, useLocalDescargaListQuery } from "@/queries/localDescarga.queries";

type UseLocalDescargaOptions = {
  apenasAtivos?: boolean;
};

export function useLocalDescarga(opts: UseLocalDescargaOptions = {}) {
  const queryClient = useQueryClient();
  const service = LocalDescargaService();
  const toast = useToastStore();

  const params = opts.apenasAtivos === true ? { ativa: true } : undefined;
  const listQuery = useLocalDescargaListQuery(params);

  const locais = computed(() => listQuery.data.value ?? []);
  const loading = computed(() => listQuery.isLoading.value);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [localDescargaQueryKey] });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateLocalDescargaDto) =>
      await service.create(payload),
    onSuccess: () => {
      invalidate();
      toast.notify('Unidade criada com sucesso!', 'success');
    },
    onError: () => {
      toast.notify('Erro ao criar unidade', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateLocalDescargaDto }) =>
      await service.update(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify('Unidade atualizada!', 'success');
    },
    onError: () => {
      toast.notify('Erro ao atualizar.', 'error');
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => await service.remove(id),
    onSuccess: () => {
      invalidate();
      toast.notify('Unidade removida.', 'info');
    },
    onError: () => {
      toast.notify('Erro ao remover.', 'error');
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: MudarStatusLocalDto }) =>
      await service.mudarStatus(id, payload),
    onSuccess: () => {
      invalidate();
      toast.notify('Sucesso ao mudar Status', 'success');
    },
    onError: () => {
      toast.notify('Erro ao mudar Status', 'error');
    }
  });

  return {
    locais,
    loading,
    create: (payload: CreateLocalDescargaDto) => createMutation.mutateAsync(payload),
    update: (id: string, payload: UpdateLocalDescargaDto) =>
      updateMutation.mutateAsync({ id, payload }),
    remove: (id: string) => removeMutation.mutateAsync(id),
    mudarStatus: (id: string, payload: MudarStatusLocalDto) =>
      statusMutation.mutateAsync({ id, payload }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isMudandoStatus: statusMutation.isPending
  };
}