import http from "@/http/http";
import type IRelatorioAgendamentoFilterDto from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { FormatoRelatorio } from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";

export interface RelatorioArquivo {
    blob: Blob;
    fileName: string;
}

export const RelatorioService = () => {
  const gerarRelatorioAgendamentos = async (
    filtros: IRelatorioAgendamentoFilterDto,
    formato: FormatoRelatorio
  ): Promise<RelatorioArquivo> => {
    try {
      const { data, headers } = await http.get<Blob>("/Relatorio/agendamentos", {
        params: { ...filtros, formato },
        responseType: "blob",
      });

      const disposition = headers["content-disposition"] as string | undefined;
      const match = disposition?.match(/filename="?([^";]+)"?/i);
      const fileName = match?.[1] ?? `relatorio-agendamentos.${formato}`;

      return { blob: data, fileName };
    } catch (error: any) {
      throw await parseErro(error);
    }
  };

  return { gerarRelatorioAgendamentos };
};

async function parseErro(error: any): Promise<Error> {
  const respData = error?.response?.data;

  if (respData instanceof Blob) {
    try {
      const texto = await respData.text();
      const parsed = JSON.parse(texto);
      return new Error(parsed?.message ?? "Erro ao gerar relatório.");
    } catch {
      return new Error("Erro ao gerar relatório.");
    }
  }

  return new Error(error?.response?.data?.message ?? "Erro ao gerar relatório.");
}