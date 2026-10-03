import { RelatorioService } from "@/services/RelatorioService";
import { useToastStore } from "@/stores/ToastStore";
import { useMutation } from "@tanstack/vue-query";
import type IRelatorioAgendamentoFilterDto from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { FormatoRelatorio } from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";

export const useRelatorio = () => {
    const service = RelatorioService();
    const toast = useToastStore();

    const gerarMutation = useMutation({
        mutationFn: async (payload: {
            filtros: IRelatorioAgendamentoFilterDto;
            formato: FormatoRelatorio;
        }) => await service.gerarRelatorioAgendamentos(payload.filtros, payload.formato),

        onSuccess: ({blob, fileName}) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        },

        onError: (error: any) => {
            toast.notify(error?.message ?? "Erro ao gerar relatório.", "error");
        }
    });

    return {
        gerarRelatorio: gerarMutation.mutateAsync,
    };
}