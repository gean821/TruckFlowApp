import type { AuditLogListQueryDto, AuditLogResponseDto } from "@/entities/audit.types";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import http from "@/http/http";

export const AuditService = () => {
    const getPaged = async (
        query: AuditLogListQueryDto
    ): Promise<PaginatedResponse<AuditLogResponseDto>> => {
        const { data } = await http.get('/audit', { params: query });
        return data;
    }

    return {
        getPaged
    };
}
