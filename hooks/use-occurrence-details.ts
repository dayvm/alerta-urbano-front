import { useQuery } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";

export function useOccurrenceDetails(id: number) {
  return useQuery({
    queryKey: ["occurrence", id], // Chave única por ID (ex: ['occurrence', 5])
    queryFn: () => occurrenceService.getById(id),
    enabled: !!id, // Só tenta buscar se o ID existir (evita erro de chamada nula)
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
}