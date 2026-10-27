export type SituacaoChegada = "Adiantado" | "NoHorario" | "Atrasado" | "NaoCompareceu";

export type OrigemAgendamento = "Grade" | "Avulso";

export interface AgendamentoDetalhado {
  id: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  statusRotulo: string;
  origem: OrigemAgendamento;
  motoristaNome: string | null;
  motoristaTelefone: string | null;
  placaVeiculo: string | null;
  tipoVeiculo: string | null;
  fornecedorNome: string | null;
  produto: string;
  unidadeEntrega: string | null;
  localDescarga: string | null;
  pesoKg: number | null;
  notaFiscalNumero: number | null;
  chegouEm: string | null;
  inicioDescarga: string | null;
  inicioEstimado: boolean;
  fimDescargaEm: string | null;
  saida: string | null;
  saidaEstimada: boolean;
  esperaMin: number | null;
  descargaMin: number | null;
  permanenciaMin: number | null;
  atrasoChegadaMin: number | null;
  situacaoChegada: SituacaoChegada | null;
}

export interface RelatorioDetalhadoStatus {
  status: string;
  rotulo: string;
  quantidade: number;
}

export interface RelatorioDetalhadoResumo {
  total: number;
  pesoTotalKg: number;
  porStatus: RelatorioDetalhadoStatus[];
  chegaram: number;
  adiantados: number;
  noHorario: number;
  atrasados: number;
  naoCompareceram: number;
  pontualidadePct: number | null;
  atrasoMedioMin: number | null;
  esperaMediaMin: number | null;
  esperaP90Min: number | null;
  descargaMediaMin: number | null;
  permanenciaMediaMin: number | null;
  temposEstimados: boolean;
}
