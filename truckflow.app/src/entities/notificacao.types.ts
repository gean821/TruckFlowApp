export enum TipoNotificacao {
  AgendamentoCriado = 1,
  AgendamentoConfirmado = 2,
  AgendamentoCancelado = 3,
  AgendamentoReagendado = 4,
  AgendamentoExpirado = 5,
  MotoristaAtrasoInformado = 10,
  MotoristaChegou = 11,
  MotoristaSaiu = 12,
  JanelaPropxima = 20,
}

export enum PrioridadeNotificacao {
  Normal = 0,
  Alta = 1,
  Critica = 2,
}

export type NotificacaoListItemDto = {
  id: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  corpo: string;
  criadaEm: string;
  lidaEm: string | null;
  payloadJson: string;
};

export type NotificacaoListQueryDto = {
  pageNumber: number;
  pageSize: number;
  unreadOnly?: boolean | null;
  tipo?: TipoNotificacao | null;
  prioridade?: PrioridadeNotificacao | null;
};

export type NotificacaoEventDto = {
  empresaId: string;
  usuarioId: string;
  notificacaoId: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  corpo: string;
  criadaEm: string;
};
