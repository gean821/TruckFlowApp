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
