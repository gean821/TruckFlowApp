import http from "@/http/http";
import type IRecebimentoCreate from '@/Dtos/Recebimento/IRecebimentoCreate';
import type IRecebimentoUpdate from '@/Dtos/Recebimento/IRecebimentoUpdate';
import type IRecebimentoResponse from '@/Dtos/Recebimento/IRecebimentoResponse';

export default class RecebimentoService {

  static async GetAll(): Promise<IRecebimentoResponse[]> {
    const { data } = await http.get<IRecebimentoResponse[]>('/PlanejamentoRecebimento');
    return data;
  }


  static async GetById(id: string): Promise<IRecebimentoResponse> {
    const { data } = await http.get<IRecebimentoResponse>(`/PlanejamentoRecebimento/${id}`);
    return data;
  }
  static async AddRecebimento(recebimento: IRecebimentoCreate): Promise<IRecebimentoResponse> {
    const { data } = await http.post<IRecebimentoResponse>('/PlanejamentoRecebimento', recebimento);
    return data;
  }

  static async UpdateRecebimento(id: string, recebimentoAtualizado: IRecebimentoUpdate): Promise<IRecebimentoResponse> {
    const { data } = await http.put<IRecebimentoResponse>(`/PlanejamentoRecebimento/${id}`, recebimentoAtualizado);
    return data;
  }

  static async DeleteRecebimento(id: string): Promise<void> {
    await http.delete(`/PlanejamentoRecebimento/${id}`);
  }
}