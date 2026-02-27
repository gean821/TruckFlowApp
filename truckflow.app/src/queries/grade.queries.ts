import { GradeService } from "@/services/GradeService";
import { useQuery } from "@tanstack/vue-query";

export function useGradeQuery() {
  const service = GradeService();
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => await service.getAll(),
    enabled: true
  });

}