export interface RelatorioBiFiltro {
  inicio: string;
  fim: string;
  unidadeEntregaId?: string | null;
  localDescargaId?: string | null;
  fornecedorId?: string | null;
  produtoId?: string | null;
}

export interface RelatorioBiPeriodo {
  inicio: string;
  fim: string;
  inicioAnterior: string;
  fimAnterior: string;
  dias: number;
}

export interface RelatorioBiIndicador {
  valor: number;
  anterior: number;
  variacaoPct: number | null;
  serie: number[];
}

export interface RelatorioBiRanking {
  id: string | null;
  nome: string;
  agendamentos: number;
  concluidos: number;
  pesoKg: number;
  percentual: number;
}

export interface VisaoGeralIndicadores {
  agendamentos: RelatorioBiIndicador;
  concluidos: RelatorioBiIndicador;
  pesoRecebidoKg: RelatorioBiIndicador;
  comparecimentoPct: RelatorioBiIndicador;
  cancelados: RelatorioBiIndicador;
  naoCompareceu: RelatorioBiIndicador;
  pesoMedioKg: RelatorioBiIndicador;
  atingimentoMetaPct: number | null;
}

export interface VisaoGeralDia {
  data: string;
  agendamentos: number;
  concluidos: number;
  cancelados: number;
  naoCompareceu: number;
  pesoKg: number;
}

export interface VisaoGeralStatus {
  agendado: number;
  emAndamento: number;
  finalizado: number;
  cancelado: number;
  expirado: number;
}

export interface VisaoGeralFunil {
  reservados: number;
  chegaram: number;
  concluidos: number;
}

export interface VisaoGeralOcupacaoHora {
  hora: number;
  ocupacaoPct: number;
  agendamentos: number;
}

export type TipoDestaque = "info" | "success" | "warning";

export interface VisaoGeralDestaque {
  tipo: TipoDestaque;
  titulo: string;
  descricao: string;
}

export interface VisaoGeralResponse {
  periodo: RelatorioBiPeriodo;
  indicadores: VisaoGeralIndicadores;
  serieDiaria: VisaoGeralDia[];
  serieDiariaAnterior: VisaoGeralDia[];
  metaDiariaKg: number | null;
  porStatus: VisaoGeralStatus;
  funil: VisaoGeralFunil;
  heatmapDiaHora: number[][];
  ocupacaoPorHora: VisaoGeralOcupacaoHora[];
  docasAtivas: number;
  topFornecedores: RelatorioBiRanking[];
  topProdutos: RelatorioBiRanking[];
  destaques: VisaoGeralDestaque[];
}

export type Agrupamento = "dia" | "semana" | "mes";

export interface RecebimentosIndicadores {
  pesoNotaKg: RelatorioBiIndicador;
  descargas: RelatorioBiIndicador;
  pesoMedioKg: RelatorioBiIndicador;
  pesoRecebidoKg: number | null;
  pesoNotaConferidoKg: number | null;
  divergenciaKg: number | null;
  divergenciaPct: number | null;
  coberturaConferenciaPct: number;
  cumprimentoPlanejamentoPct: number | null;
  orfaos: number;
  orfaosKg: number;
  metaPeriodoKg: number | null;
}

export interface RecebimentosBalde {
  inicio: string;
  fim: string;
  rotulo: string;
  totalKg: number;
  descargas: number;
  porProduto: Record<string, number>;
  metaKg: number | null;
}

export interface RecebimentosFluxo {
  nos: { id: string; nome: string; tipo: "fornecedor" | "produto" | "unidade" }[];
  ligacoes: { origem: string; destino: string; kg: number }[];
}

export interface RecebimentosPlanejamento {
  itemId: string;
  produto: string;
  fornecedor: string;
  planejadoKg: number;
  recebidoKg: number;
  cumprimentoPct: number | null;
  situacao: string;
}

export interface RecebimentosDivergencia {
  agendamentoId: string;
  dataInicio: string;
  placa: string | null;
  notaNumero: number | null;
  fornecedor: string | null;
  produto: string | null;
  pesoNotaKg: number;
  pesoRecebidoKg: number;
  diferencaKg: number;
  diferencaPct: number | null;
}

export interface RecebimentosMatriz {
  produtos: string[];
  linhas: { fornecedor: string; valores: Record<string, number>; total: number; descargas: number }[];
  totalPorProduto: Record<string, number>;
  totalGeral: number;
}

export interface RecebimentosResponse {
  periodo: RelatorioBiPeriodo;
  agrupamento: Agrupamento;
  indicadores: RecebimentosIndicadores;
  produtos: string[];
  serie: RecebimentosBalde[];
  porProduto: RelatorioBiRanking[];
  porFornecedor: RelatorioBiRanking[];
  porUnidade: RelatorioBiRanking[];
  fluxo: RecebimentosFluxo;
  planejamento: RecebimentosPlanejamento[];
  divergencias: RecebimentosDivergencia[];
  matriz: RecebimentosMatriz;
}
