import { useQuery } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";

export function useMyReports(userId?: number) {
  return useQuery({
    queryKey: ["my-reports", userId], // Cache separado por usuário
    queryFn: () => occurrenceService.getByAuthor(userId!),
    enabled: !!userId, // Só busca se o ID existir (evita erro se não estiver logado)
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
  });
}