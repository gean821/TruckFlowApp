import type { ExcluirContaMotoristaDto } from "@/entities/contaMotorista.types";
import { ContaMotoristaService } from "@/services/ContaMotoristaService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation } from "@tanstack/vue-query";
import type { AxiosError } from "axios";

export function useContaMotorista() {
  const service = ContaMotoristaService();
  const toast = useToastStore();

  const msg = (e: unknown) => {
    const resposta = (e as AxiosError<{ message?: string }>)?.response;
    if (resposta?.status === 429) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
    if (resposta?.status === 401) return "Usuário ou senha inválidos.";
    return resposta?.data?.message ?? "Não foi possível excluir agora. Tente novamente.";
  };

  const excluirMutation = useMutation({
    mutationFn: async (dto: ExcluirContaMotoristaDto) => await service.excluir(dto),
    onSuccess: () => {
      toast.notify("Conta excluída. Seus dados pessoais foram removidos.", "success", 6000);
    },
    onError: (e) => {
      toast.notify(msg(e), "error", 6000);
    },
  });

  return {
    excluirConta: excluirMutation.mutateAsync,
    excluindo: excluirMutation.isPending,
    excluida: excluirMutation.isSuccess,
  };
}
