import type { GradeListQueryDto } from "@/entities/grade.types";
import { GradeService } from "@/services/GradeService";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { unref, type MaybeRef } from "vue";

const service = GradeService();

export function useGradeQuery(params: MaybeRef<GradeListQueryDto>) {
  return useQuery({
    queryKey: ['grades', params],
    queryFn: async () => await service.getAll(unref(params)),
    placeholderData: keepPreviousData
  });
}

export function useGradeByIdQuery(id: string) {
  return useQuery({
    queryKey: ['grade', id],
    queryFn: async () => await service.getById(id),
    enabled: !!id
  });
}
