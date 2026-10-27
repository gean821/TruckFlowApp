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

export interface CapacidadeIndicadores {
  taxaReservaPct: RelatorioBiIndicador;
  utilizacaoRealPct: RelatorioBiIndicador;
  horasOfertadas: RelatorioBiIndicador;
  horasOciosas: RelatorioBiIndicador;
  horasNaoComparecimento: RelatorioBiIndicador;
  foraDaGrade: RelatorioBiIndicador;
  vagasOfertadas: number;
  vagasReservadas: number;
  janelasEsgotadas: number;
  janelasComOferta: number;
  vagaMediaMin: number | null;
  descargaMediaMin: number | null;
  aproveitamentoVagaPct: number | null;
}

export interface CapacidadeDia {
  data: string;
  horasOfertadas: number;
  horasReservadas: number;
  horasUtilizadas: number;
  horasNaoComparecimento: number;
  taxaReservaPct: number | null;
  utilizacaoRealPct: number | null;
}

export interface CapacidadeCelula {
  diaSemana: number;
  hora: number;
  ofertadas: number;
  reservadas: number;
  realizadas: number;
  naoCompareceu: number;
  foraDaGrade: number;
  taxaReservaPct: number | null;
  utilizacaoRealPct: number | null;
  diasComOferta: number;
  diasEsgotados: number;
}

export interface CapacidadeDocaHora {
  docaId: string;
  hora: number;
  ofertadas: number;
  reservadas: number;
  taxaReservaPct: number | null;
  utilizacaoRealPct: number | null;
}

export interface CapacidadeDoca {
  id: string;
  nome: string;
  unidade: string | null;
  vagasOfertadas: number;
  vagasReservadas: number;
  descargas: number;
  naoCompareceu: number;
  foraDaGrade: number;
  horasOfertadas: number;
  horasReservadas: number;
  horasUtilizadas: number;
  horasOciosas: number;
  taxaReservaPct: number | null;
  utilizacaoRealPct: number | null;
  descargaMediaMin: number | null;
  horaPico: number | null;
  serieTaxaReserva: (number | null)[];
}

export interface CapacidadeJanela {
  diaSemana: number;
  hora: number;
  rotulo: string;
  ofertadas: number;
  reservadas: number;
  foraDaGrade: number;
  taxaReservaPct: number | null;
  diasComOferta: number;
  diasEsgotados: number;
  vagasLivres: number;
}

export interface CapacidadeHora {
  hora: number;
  horasOfertadas: number;
  horasReservadas: number;
  horasUtilizadas: number;
  taxaReservaPct: number | null;
  utilizacaoRealPct: number | null;
}

export interface CapacidadeDocasResponse {
  periodo: RelatorioBiPeriodo;
  indicadores: CapacidadeIndicadores;
  serieDiaria: CapacidadeDia[];
  heatmapSemana: CapacidadeCelula[];
  heatmapDocas: CapacidadeDocaHora[];
  docas: CapacidadeDoca[];
  excessoDemanda: CapacidadeJanela[];
  ociosas: CapacidadeJanela[];
  porHora: CapacidadeHora[];
  recomendacoes: VisaoGeralDestaque[];
}

export interface ProdutividadeIndicadores {
  ciclos: RelatorioBiIndicador;
  esperaMediaMin: RelatorioBiIndicador;
  esperaP90Min: RelatorioBiIndicador;
  descargaMediaMin: RelatorioBiIndicador;
  permanenciaMediaMin: RelatorioBiIndicador;
  horasEspera: RelatorioBiIndicador;
  acimaDoLimitePct: RelatorioBiIndicador;
  esperaMedianaMin: number | null;
  descargaMedianaMin: number | null;
  descargaP90Min: number | null;
  permanenciaP90Min: number | null;
  acimaDoLimite: number;
  descargasPorDia: number;
  estimadosPct: number;
}

export interface ProdutividadeDia {
  dia: string;
  ciclos: number;
  esperaMediaMin: number | null;
  esperaP90Min: number | null;
  descargaMediaMin: number | null;
  permanenciaMediaMin: number | null;
}

export interface ProdutividadeFaixa {
  rotulo: string;
  deMin: number;
  ateMin: number | null;
  espera: number;
  descarga: number;
}

export interface ProdutividadeCelula {
  diaSemana: number;
  hora: number;
  chegadas: number;
  esperaMediaMin: number | null;
  esperaP90Min: number | null;
}

export interface ProdutividadeHora {
  hora: number;
  chegadas: number;
  esperaMediaMin: number | null;
  descargaMediaMin: number | null;
}

export interface ProdutividadeCaixa {
  min: number;
  q1: number;
  mediana: number;
  q3: number;
  max: number;
}

export interface ProdutividadeGrupo {
  id: string | null;
  nome: string;
  ciclos: number;
  esperaMediaMin: number | null;
  esperaP90Min: number | null;
  descargaMediaMin: number | null;
  descargaMedianaMin: number | null;
  permanenciaMediaMin: number | null;
  acimaDoLimite: number;
  caixaEspera: ProdutividadeCaixa | null;
  caixaDescarga: ProdutividadeCaixa | null;
}

export interface ProdutividadeResponse {
  periodo: RelatorioBiPeriodo;
  limiteEsperaMin: number;
  indicadores: ProdutividadeIndicadores;
  serieDiaria: ProdutividadeDia[];
  distribuicao: ProdutividadeFaixa[];
  heatmap: ProdutividadeCelula[];
  porHora: ProdutividadeHora[];
  porDoca: ProdutividadeGrupo[];
  porProduto: ProdutividadeGrupo[];
  porUnidade: ProdutividadeGrupo[];
  porFornecedor: ProdutividadeGrupo[];
  destaques: VisaoGeralDestaque[];
}

export interface PatioCaminhao {
  agendamentoId: string;
  placa: string | null;
  motorista: string | null;
  fornecedor: string | null;
  produto: string | null;
  status: string;
  janelaInicio: string;
  janelaFim: string;
  chegouEm: string;
  inicioDescarga: string | null;
  inicioEstimado: boolean;
  fimDescarga: string | null;
  saida: string | null;
  saidaEstimada: boolean;
  esperaMin: number | null;
  descargaMin: number | null;
}

export interface PatioDoca {
  id: string | null;
  nome: string;
  unidade: string | null;
  descargaMediaMin: number | null;
  caminhoes: PatioCaminhao[];
}

export interface PatioResponse {
  dia: string;
  agoraUtc: string | null;
  inicioEixo: string | null;
  fimEixo: string | null;
  caminhoes: number;
  esperaMediaMin: number | null;
  descargaMediaMin: number | null;
  picoSimultaneos: number;
  picoEm: string | null;
  docas: PatioDoca[];
}
