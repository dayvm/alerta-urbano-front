import { useQuery } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";

// Aceita um ID opcional
export function useOccurrences(institutionId?: number) {
  return useQuery({
    // A chave do cache muda se tiver filtro (ex: ["occurrences", 1])
    queryKey: ["occurrences", institutionId], 
    
    queryFn: () => {
      // Se tiver ID, usa o serviço de filtro. Se não, busca tudo.
      if (institutionId) {
        return occurrenceService.getByInstitution(institutionId);
      }
      return occurrenceService.getAll();
    },
    
    staleTime: 1000 * 60, // 1 minuto de cache
  });
}