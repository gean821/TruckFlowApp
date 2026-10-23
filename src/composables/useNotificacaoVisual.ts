import {
  PrioridadeNotificacao,
  TipoNotificacao,
  type NotificacaoPayloadDto,
} from "@/entities/notificacao.types";


export function useNotificacaoVisual() {
  function iconForTipo(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.AgendamentoCancelado:
        return "mdi-calendar-remove-outline";
      case TipoNotificacao.AgendamentoConfirmado:
        return "mdi-calendar-check-outline";
      case TipoNotificacao.AgendamentoReagendado:
        return "mdi-calendar-clock-outline";
      case TipoNotificacao.AgendamentoExpirado:
        return "mdi-calendar-alert-outline";
      case TipoNotificacao.AgendamentoCriado:
        return "mdi-calendar-plus-outline";
      case TipoNotificacao.MotoristaAtrasoInformado:
        return "mdi-clock-alert-outline";
      case TipoNotificacao.MotoristaChegou:
        return "mdi-truck-check-outline";
      case TipoNotificacao.MotoristaSaiu:
        return "mdi-truck-delivery-outline";
      case TipoNotificacao.JanelaPropxima:
        return "mdi-timer-sand";
      case TipoNotificacao.MensagemManualAdmin:
      case TipoNotificacao.MensagemManualMotorista:
        return "mdi-message-text-outline";
      default:
        return "mdi-bell-outline";
    }
  }

  function iconColorForTipo(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.AgendamentoCancelado:
      case TipoNotificacao.AgendamentoExpirado:
        return "error";
      case TipoNotificacao.AgendamentoConfirmado:
      case TipoNotificacao.MotoristaChegou:
        return "success";
      case TipoNotificacao.AgendamentoReagendado:
      case TipoNotificacao.MotoristaAtrasoInformado:
      case TipoNotificacao.JanelaPropxima:
        return "warning";
      default:
        return "primary";
    }
  }

  function tipoLabel(tipo: TipoNotificacao): string {
    switch (tipo) {
      case TipoNotificacao.AgendamentoCriado:
        return "Agendamento criado";
      case TipoNotificacao.AgendamentoConfirmado:
        return "Agendamento confirmado";
      case TipoNotificacao.AgendamentoCancelado:
        return "Agendamento cancelado";
      case TipoNotificacao.AgendamentoReagendado:
        return "Agendamento reagendado";
      case TipoNotificacao.AgendamentoExpirado:
        return "Agendamento expirado";
      case TipoNotificacao.MotoristaAtrasoInformado:
        return "Atraso informado";
      case TipoNotificacao.MotoristaChegou:
        return "Motorista chegou";
      case TipoNotificacao.MotoristaSaiu:
        return "Motorista saiu";
      case TipoNotificacao.JanelaPropxima:
        return "Janela próxima";
      case TipoNotificacao.MensagemManualAdmin:
        return "Mensagem (admin)";
      case TipoNotificacao.MensagemManualMotorista:
        return "Mensagem (motorista)";
      default:
        return "Notificação";
    }
  }

  function prioridadeLabel(prioridade: PrioridadeNotificacao): string {
    switch (prioridade) {
      case PrioridadeNotificacao.Critica:
        return "Crítica";
      case PrioridadeNotificacao.Alta:
        return "Alta";
      default:
        return "Normal";
    }
  }

  function prioridadeColor(prioridade: PrioridadeNotificacao): string {
    switch (prioridade) {
      case PrioridadeNotificacao.Critica:
        return "error";
      case PrioridadeNotificacao.Alta:
        return "warning";
      default:
        return "grey";
    }
  }

  function parsePayload(payloadJson: string): NotificacaoPayloadDto {
    try {
      const parsed: unknown = JSON.parse(payloadJson);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as NotificacaoPayloadDto;
      }
    } catch {
    }
    return {};
  }

  function formatRelative(iso: string): string {
    const created = new Date(iso).getTime();
    const diffSec = Math.max(0, Math.floor((Date.now() - created) / 1000));
    if (diffSec < 60) return "agora";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d`;
  }

  function formatAbsolute(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatTimestamp(iso: string): string {
    const diffDias = Math.floor(
      (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDias < 7 ? formatRelative(iso) : formatAbsolute(iso);
  }

  function formatDataAgendamento(iso: string): string | null {
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) {
      return null;
    }

    const hoje = new Date();
    const mesmaData = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const hora = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (mesmaData(data, hoje)) return `hoje às ${hora}`;
    if (mesmaData(data, ontem)) return `ontem às ${hora}`;
    if (mesmaData(data, amanha)) return `amanhã às ${hora}`;

    return `${data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })} às ${hora}`;
  }

  function contextoPayload(payload: NotificacaoPayloadDto): string | null {
    const partes: string[] = [];

    if (payload.empresaNome?.trim()) {
      partes.push(payload.empresaNome.trim());
    }

    if (payload.unidadeEntregaNome?.trim()) {
      partes.push(`Unidade ${payload.unidadeEntregaNome.trim()}`);
    }

    if (payload.localDescargaNome?.trim()) {
      partes.push(payload.localDescargaNome.trim());
    }

    if (payload.dataAgendamentoIso) {
      const formatada = formatDataAgendamento(payload.dataAgendamentoIso);
      if (formatada) {
        partes.push(formatada);
      }
    }

    return partes.length > 0 ? partes.join(" · ") : null;
  }

  return {
    iconForTipo,
    iconColorForTipo,
    tipoLabel,
    prioridadeLabel,
    prioridadeColor,
    parsePayload,
    formatRelative,
    formatAbsolute,
    formatTimestamp,
    contextoPayload,
  };
}
