import type { AuditAction, AuditLogResponseDto } from '@/entities/audit.types';

export const ENTITY_LABELS: Record<string, string> = {
  LocalDescarga: 'Local de Descarga',
  UnidadeEntrega: 'Unidade de Entrega',
  Grade: 'Grade',
  Agendamento: 'Agendamento',
  Empresa: 'Empresa',
  Fornecedor: 'Fornecedor',
  Produto: 'Produto',
  ItemPlanejamento: 'Item de Planejamento',
  PlanejamentoRecebimento: 'Planejamento',
  RecebimentoEvento: 'Recebimento',
  NotaFiscal: 'Nota Fiscal',
  NotaFiscalItem: 'Item NF',
  Motorista: 'Motorista',
  Veiculo: 'Veículo',
  Carga: 'Carga',
  Administrador: 'Administrador',
  Notificacao: 'Notificação',
};

export const ACTION_META: Record<AuditAction, { label: string; color: string; icon: string }> = {
  Create: { label: 'Criação', color: 'success', icon: 'mdi-plus-circle-outline' },
  Update: { label: 'Atualização', color: 'warning', icon: 'mdi-pencil-outline' },
  Delete: { label: 'Exclusão', color: 'error', icon: 'mdi-trash-can-outline' },
};

export function formatAuditValue(v: unknown): string {
  if (v === null || v === undefined) {
    return '—';
  }

  if (typeof v === 'object') {
    return JSON.stringify(v);
  }

  if (typeof v === 'boolean') {
    return v ? 'sim' : 'não';
  }

  return String(v);
}

/**
 * Renderiza valor preferindo o label registrado em `labels[field][valor]` (ex: nome da Empresa
 * em vez do UUID). Cai no formato cru se não houver label correspondente.
 */
export function formatAuditValueLabeled(
  field: string,
  value: unknown,
  labels?: Record<string, Record<string, string>> | null
): string {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'sim' : 'não';
  }

  const stringValue = String(value);
  const fieldLabels = labels?.[field];
  if (fieldLabels && fieldLabels[stringValue]) {
    return fieldLabels[stringValue];
  }

  return stringValue;
}

export function shortenId(id: string): string {
  if (!id) return '-';
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

type ChangePair = { from: unknown; to: unknown };

export function formatChanges(evt: AuditLogResponseDto): readonly (readonly [string, ChangePair])[] {
  if (!evt.changes) {
    return [];
  }

  return Object.entries(evt.changes).map(([campo, valor]) => {
    const v = valor as { from?: unknown; to?: unknown } | unknown;
    
    if (v && typeof v === 'object' && 'from' in v && 'to' in v) {
      return [campo, { from: (v as any).from, to: (v as any).to }] as const;
    }
    
    return [campo, { from: v, to: v }] as const;
  });
}
