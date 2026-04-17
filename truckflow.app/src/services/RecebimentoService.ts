import http from "@/http/http";
import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type IRecebimentoUpdate from "@/Dtos/Recebimento/IRecebimentoUpdate";
import type IRecebimentoResponse from "@/Dtos/Recebimento/IRecebimentoResponse";
import type IPlanejamentoListQuery from "@/Dtos/Recebimento/IPlanejamentoListQuery";
import type IPlanejamentoDashboard from "@/Dtos/Recebimento/IPlanejamentoDashboard";
import type IPlanejamentoRelatorio from "@/Dtos/Recebimento/IPlanejamentoRelatorio";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import type { RegistrarEntradaDto } from "@/Dtos/Recebimento/RegistrarEntrada.dto";

export const RecebimentoService = () => {

  const getPaged = async (
    query: IPlanejamentoListQuery
  ): Promise<PaginatedResponse<IRecebimentoResponse>> => {
    const { data } = await http.get("/PlanejamentoRecebimento", { params: query });
    return data;
  };

  const getAll = async (): Promise<IRecebimentoResponse[]> => {
    const { data } = await http.get<IRecebimentoResponse[]>("/PlanejamentoRecebimento/all");
    return data;
  };

  const getById = async (id: string): Promise<IRecebimentoResponse> => {
    const { data } = await http.get<IRecebimentoResponse>(`/PlanejamentoRecebimento/${id}`);
    return data;
  };

  const getDashboard = async (
    id: string,
    data?: string
  ): Promise<IPlanejamentoDashboard> => {
    const resp = await http.get<IPlanejamentoDashboard>(
      `/PlanejamentoRecebimento/${id}/dashboard`,
      { params: data ? { data } : undefined }
    );
    return resp.data;
  };

  const getRelatorio = async (id: string): Promise<IPlanejamentoRelatorio> => {
    const { data } = await http.get<IPlanejamentoRelatorio>(
      `/PlanejamentoRecebimento/${id}/relatorio`
    );
    return data;
  };

  const create = async (
    recebimento: IRecebimentoCreate
  ): Promise<IRecebimentoResponse> => {
    const { data } = await http.post<IRecebimentoResponse>(
      "/PlanejamentoRecebimento",
      recebimento
    );
    return data;
  };

  const update = async (
    id: string,
    payload: IRecebimentoUpdate
  ): Promise<IRecebimentoResponse> => {
    const { data } = await http.put<IRecebimentoResponse>(
      `/PlanejamentoRecebimento/${id}`,
      payload
    );
    return data;
  };

  const remove = async (id: string): Promise<void> => {
    await http.delete(`/PlanejamentoRecebimento/${id}`);
  };

  const encerrar = async (id: string): Promise<void> => {
    await http.post(`/PlanejamentoRecebimento/${id}/encerrar`);
  };

  const registrarEntrada = async (
    itemId: string,
    dto: Omit<RegistrarEntradaDto, "itemId">
  ): Promise<void> => {
    await http.post(`/recebimentos/registrar-entrada/${itemId}/`, {
      quantidade: dto.quantidade,
      observacao: dto.observacao
    });
  };

  return {
    getPaged,
    getAll,
    getById,
    getDashboard,
    getRelatorio,
    create,
    update,
    remove,
    encerrar,
    registrarEntrada
  };
};

export default RecebimentoService;
