import type IAgendamento from "./IAgendamento";
import type ItemPlanejamento from "./ItemPlanejamento";

export interface IRecebimentoEvento {
  itemPlanejamentoId: string;
  itemPlanejamento: ItemPlanejamento;
  agendamentoId?: string;
  agendamento?: IAgendamento
  quantidade: number;
  dataRecebimento: string;
  observacao?: string;
}