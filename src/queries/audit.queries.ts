import type { AuditLogListQueryDto } from "@/entities/audit.types";
import { AuditService } from "@/services/AuditService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

const service = AuditService();

export const auditQueryKey = 'audit';

export function useAuditLogQuery(params: MaybeRef<AuditLogListQueryDto>) {
  return useQuery({
    queryKey: [auditQueryKey, params],
    queryFn: async () => await service.getPaged(unref(params)),
    placeholderData: keepPreviousData
  });
}
