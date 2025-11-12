import type IRecebimentoUpdate from '@/Dtos/Recebimento/IRecebimentoUpdate';
import type IPlanejamentoRecebimento from '../Entities/IPlanejamentoRecebimento';
import http from "@/http/http";
import type IRecebimentoCreate from '@/Dtos/Recebimento/IRecebimentoCreate';

export default class RecebimentoService {
  static async GetAll(): Promise<IPlanejamentoRecebimento[]> {
    const { data } = await http.get('/PlanejamentoRecebimento');
    return data;
  }

  static async GetById(id: string): Promise<IPlanejamentoRecebimento> {
    const { data } = await http.get(`/PlanejamentoRecebimento/${id}`);
    return data;
  }

  static async AddRecebimento(recebimento: IRecebimentoCreate): Promise<IPlanejamentoRecebimento> {
    const { data } = await http.post('/PlanejamentoRecebimento', recebimento);
    return data;
  }

  static async UpdateRecebimento(id: string, recebimentoAtualizado: IRecebimentoUpdate): Promise<IPlanejamentoRecebimento> {
    const { data } = await http.put(`/PlanejamentoRecebimento/${id}`, recebimentoAtualizado);
    return data;
  }

  static async DeleteRecebimento(id: string): Promise<void> {
    await http.delete(`/PlanejamentoRecebimento/${id}`);
  }
}
