import http from "@/http/http";
import type IRelatorioAgendamentoFilterDto from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { FormatoRelatorio } from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import type { AgendamentoDetalhado, RelatorioDetalhadoResumo } from "@/entities/relatorioAgendamentos.types";

export interface RelatorioArquivo {
    blob: Blob;
    fileName: string;
}

export function paramsRelatorio(filtros: IRelatorioAgendamentoFilterDto, extras: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams();

  for (const [chave, valor] of Object.entries({ ...filtros, ...extras })) {
    if (valor === undefined || valor === null || valor === "" || valor === false) continue;
    if (Array.isArray(valor)) {
      valor.forEach((item) => params.append(chave, String(item)));
    } else {
      params.append(chave, String(valor));
    }
  }

  return params;
}

export const RelatorioService = () => {
  const gerarRelatorioAgendamentos = async (
    filtros: IRelatorioAgendamentoFilterDto,
    formato: FormatoRelatorio
  ): Promise<RelatorioArquivo> => {
    try {
      const { data, headers } = await http.get<Blob>("/Relatorio/agendamentos", {
        params: paramsRelatorio(filtros, { formato }),
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

  const listarDetalhado = async (
    filtros: IRelatorioAgendamentoFilterDto,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<AgendamentoDetalhado>> => {
    const { data } = await http.get<PaginatedResponse<AgendamentoDetalhado>>("/Relatorio/agendamentos/detalhado", {
      params: paramsRelatorio(filtros, { pageNumber, pageSize }),
    });
    return data;
  };

  const resumo = async (filtros: IRelatorioAgendamentoFilterDto): Promise<RelatorioDetalhadoResumo> => {
    const { ordenarPor: _ordenar, desc: _desc, ...semOrdenacao } = filtros;
    const { data } = await http.get<RelatorioDetalhadoResumo>("/Relatorio/agendamentos/resumo", {
      params: paramsRelatorio(semOrdenacao),
    });
    return data;
  };

  return { gerarRelatorioAgendamentos, listarDetalhado, resumo };
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
