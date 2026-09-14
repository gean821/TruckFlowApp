import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { AuthService } from "@/services/AuthService";
import { useToastStore } from "@/stores/ToastStore";
import type EnviarCodigoEmailDto from "@/Dtos/auth/EnviarCodigoEmailDto";
import type VerificarCodigoEmailDto from "@/Dtos/auth/VerificarCodigoEmailDto";
import type AlterarSenhaComCodigoDto from "@/Dtos/auth/AlterarSenhaComCodigoDto";
import type AlterarEmailComCodigoDto from "@/Dtos/auth/AlterarEmailComCodigoDto";

export function useVerificacaoEmail() {
  const toast = useToastStore();
  const codigoToken = ref<string | null>(null);

  const enviarMutation = useMutation({
    mutationFn: (dto: EnviarCodigoEmailDto) => AuthService.enviarCodigo(dto),
    onError: () => toast.notify("Erro ao enviar código. Tente novamente.", "error")
  });

  const verificarMutation = useMutation({
    mutationFn: (dto: VerificarCodigoEmailDto) => AuthService.verificarCodigo(dto),
    onSuccess: (data) => { codigoToken.value = data.codigoToken; },
    onError: () => toast.notify("Código inválido ou expirado.", "error")
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: (dto: AlterarSenhaComCodigoDto) => AuthService.alterarSenha(dto),
    onSuccess: () => toast.notify("Senha alterada com sucesso!", "success"),
    onError: () => toast.notify("Erro ao alterar senha.", "error")
  });

  const alterarEmailMutation = useMutation({
    mutationFn: (dto: AlterarEmailComCodigoDto) => AuthService.alterarEmail(dto),
    onSuccess: () => toast.notify("E-mail alterado com sucesso!", "success"),
    onError: () => toast.notify("Erro ao alterar e-mail.", "error")
  });

  function reset() {
    codigoToken.value = null;
  }

  return {
    codigoToken,
    reset,
    enviarCodigo: (dto: EnviarCodigoEmailDto) => enviarMutation.mutateAsync(dto),
    verificarCodigo: (dto: VerificarCodigoEmailDto) => verificarMutation.mutateAsync(dto),
    alterarSenha: (dto: AlterarSenhaComCodigoDto) => alterarSenhaMutation.mutateAsync(dto),
    alterarEmail: (dto: AlterarEmailComCodigoDto) => alterarEmailMutation.mutateAsync(dto),
    isEnviando: enviarMutation.isPending,
    isVerificando: verificarMutation.isPending,
    isAlterandoSenha: alterarSenhaMutation.isPending,
    isAlterandoEmail: alterarEmailMutation.isPending,
  };
}
