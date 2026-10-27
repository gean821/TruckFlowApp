import type { RelatorioBiFiltro, VisaoGeralResponse } from "@/entities/relatorioBi.types";
import http from "@/http/http";

const limparFiltro = (filtro: RelatorioBiFiltro) =>
  Object.fromEntries(Object.entries(filtro).filter(([, valor]) => valor !== null && valor !== undefined && valor !== ""));

export const RelatorioBiService = {
  async visaoGeral(filtro: RelatorioBiFiltro): Promise<VisaoGeralResponse> {
    const { data } = await http.get<VisaoGeralResponse>("/Relatorio/visao-geral", {
      params: limparFiltro(filtro),
    });
    return data;
  },
};
