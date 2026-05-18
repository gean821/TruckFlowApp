export type NotaFiscalItemStatus = 'Matched' | 'PendenteRevisao';

export type OrigemMatchProduto =
  | 'EanAuto'
  | 'ProdFornecAuto'
  | 'HistoricoAuto'
  | 'AdminManual';

export interface ProdutoSugestaoDto {
  id: string;
  nome: string;
  score: number;
}

export interface ConferenciaItemDto {
  id: string;
  codigo: string;
  ean?: string;
  descricao: string;
  quantidade: number;
  unidade?: string;
  status: NotaFiscalItemStatus;
  origemMatch?: OrigemMatchProduto;
  produtoId?: string;
  produtoNome?: string;
  matchadoEm?: string;
  matchadoPor?: string;
  sugestoes?: ProdutoSugestaoDto[];
}

export interface ConferenciaResponseDto {
  agendamentoId: string;
  notaFiscalId?: string;
  chaveAcesso?: string;
  fornecedorId?: string;
  fornecedorNome?: string;
  itens: ConferenciaItemDto[];
  totalItens: number;
  pendentesCount: number;
  matchedCount: number;
}

export interface MatchItemDto {
  produtoId: string;
}
