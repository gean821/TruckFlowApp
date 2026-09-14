export type AuditAction = 'Create' | 'Update' | 'Delete';

export type AuditLogResponseDto = {
  id: string;
  entityName: string;
  entityId: string;
  action: AuditAction;
  userId?: string | null;
  userName?: string | null;
  timestamp: string;
  changes?: Record<string, unknown> | null;
  /**
   * Mapeia campos *Id para nomes legíveis. Ex.: { EmpresaId: { "guid-1": "AURORA" } }.
   * Quando presente, o front renderiza o nome em vez do UUID.
   */
  labels?: Record<string, Record<string, string>> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type AuditLogListQueryDto = {
  pageNumber: number;
  pageSize: number;
  entityName?: string;
  entityId?: string;
  action?: AuditAction;
  userId?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
};
