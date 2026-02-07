export interface DashboardStatsDto {
  totalAgendamentos: number;
  emAndamento: number;
  finalizados: number;
  atrasados: number;
}

export interface DashboardVolumeDto {
  totalKg: number;
  progressoDiario: number;
}

export interface DashboardDocasDto {
  ocupacaoPorcentagem: number;
  livres: number;
  ocupadas: number;
  total: number;
}

export interface DashboardActivityDto {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: string; // 'checkin' | 'checkout' | 'schedule' | 'delay'
  color: string;
  icon: string;
}

export interface DashboardResponseDto {
  stats: DashboardStatsDto;
  volume: DashboardVolumeDto;
  docas: DashboardDocasDto;
  recentActivity: DashboardActivityDto[];
}