import { useQuery } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";

export function useInstitutionReports(institutionId?: number) {
  return useQuery({
    queryKey: ["institution-reports", institutionId],
    queryFn: () => occurrenceService.getByInstitution(institutionId!),
    enabled: !!institutionId, // Só busca se tiver ID da instituição
    staleTime: 1000 * 60 * 2, 
  });
}