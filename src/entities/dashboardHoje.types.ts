export interface DashboardHojeIndicador {
  valor: number;
  referencia: number | null;
  variacaoPct: number | null;
}

export interface DashboardHojeIndicadores {
  agendadosHoje: DashboardHojeIndicador;
  concluidos: DashboardHojeIndicador;
  noPatio: DashboardHojeIndicador;
  atrasados: DashboardHojeIndicador;
  naoCompareceu: DashboardHojeIndicador;
  pesoRecebidoKg: DashboardHojeIndicador;
  aindaPorVir: number;
  atingimentoMetaPct: number | null;
}

export interface DashboardHojeHora {
  hora: number;
  agendados: number;
  chegadas: number;
  concluidos: number;
  mediaAgendados: number;
}

export interface DashboardHojeCaminhao {
  agendamentoId: string;
  dataInicio: string;
  placa: string | null;
  motorista: string | null;
  fornecedor: string | null;
  produto: string | null;
  doca: string | null;
  pesoKg: number;
  minutos: number | null;
}

export interface DashboardHojeDoca {
  id: string;
  nome: string;
  unidade: string | null;
  ocupada: boolean;
  atual: DashboardHojeCaminhao | null;
  proximo: DashboardHojeCaminhao | null;
  concluidosHoje: number;
}

export interface DashboardHojePatio {
  noPatio: number;
  permanenciaMediaMin: number | null;
  descargaMediaMin: number | null;
  esperaMediaMin: number | null;
  maisAntigo: DashboardHojeCaminhao | null;
}

export interface DashboardHojeResponse {
  agoraUtc: string;
  dia: string;
  horaAtual: number;
  diaSemana: string;
  indicadores: DashboardHojeIndicadores;
  metaDiariaKg: number | null;
  porHora: DashboardHojeHora[];
  docas: DashboardHojeDoca[];
  patio: DashboardHojePatio;
  proximasChegadas: DashboardHojeCaminhao[];
  atrasados: DashboardHojeCaminhao[];
}
