import type { Agrupamento, CapacidadeDocasResponse, PatioResponse, ProdutividadeResponse, RecebimentosResponse, RelatorioBiFiltro, VisaoGeralResponse } from "@/entities/relatorioBi.types";
import http from "@/http/http";

const limparFiltro = (filtro: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(filtro).filter(([, valor]) => valor !== null && valor !== undefined && valor !== ""));

export const RelatorioBiService = {
  async visaoGeral(filtro: RelatorioBiFiltro): Promise<VisaoGeralResponse> {
    const { data } = await http.get<VisaoGeralResponse>("/Relatorio/visao-geral", {
      params: limparFiltro({ ...filtro }),
    });
    return data;
  },

  async recebimentos(filtro: RelatorioBiFiltro, agrupamento: Agrupamento | null): Promise<RecebimentosResponse> {
    const { data } = await http.get<RecebimentosResponse>("/Relatorio/recebimentos", {
      params: limparFiltro({ ...filtro, agrupamento }),
    });
    return data;
  },

  async capacidadeDocas(filtro: RelatorioBiFiltro): Promise<CapacidadeDocasResponse> {
    const { fornecedorId: _fornecedor, ...semFornecedor } = filtro;
    const { data } = await http.get<CapacidadeDocasResponse>("/Relatorio/capacidade-docas", {
      params: limparFiltro({ ...semFornecedor }),
    });
    return data;
  },

  async produtividade(filtro: RelatorioBiFiltro, limiteEsperaMin: number): Promise<ProdutividadeResponse> {
    const { data } = await http.get<ProdutividadeResponse>("/Relatorio/produtividade", {
      params: limparFiltro({ ...filtro, limiteEsperaMin }),
    });
    return data;
  },

  async patio(filtro: RelatorioBiFiltro, dia: string): Promise<PatioResponse> {
    const { inicio: _inicio, fim: _fim, ...semPeriodo } = filtro;
    const { data } = await http.get<PatioResponse>("/Relatorio/produtividade/patio", {
      params: limparFiltro({ ...semPeriodo, dia }),
    });
    return data;
  },
};
