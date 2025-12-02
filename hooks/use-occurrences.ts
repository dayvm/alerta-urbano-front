import { useQuery } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";

export function useOccurrences() {
  return useQuery({
    queryKey: ["occurrences"], // Chave única do cache
    queryFn: occurrenceService.getAll,
    staleTime: 1000 * 60, // 1 minuto de cache (Ocorrências mudam com frequência moderada)
  });
}