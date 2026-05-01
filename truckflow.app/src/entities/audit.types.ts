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
