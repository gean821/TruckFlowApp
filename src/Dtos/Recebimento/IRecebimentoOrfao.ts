export interface IRecebimentoOrfao {
  id: string;
  agendamentoId?: string | null;
  produtoId?: string | null;
  produtoNome?: string | null;
  fornecedorId?: string | null;
  fornecedorNome?: string | null;
  quantidade: number;
  dataRecebimento: string;
  observacao?: string | null;
}

export interface IVincularOrfaoDto {
  itemPlanejamentoId: string;
}
