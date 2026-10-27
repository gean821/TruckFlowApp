import type { Agrupamento, RecebimentosResponse, RelatorioBiFiltro, VisaoGeralResponse } from "@/entities/relatorioBi.types";
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
};
