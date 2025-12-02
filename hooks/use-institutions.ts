import { useQuery } from "@tanstack/react-query";
import { institutionService } from "@/services/institution";

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"], // A chave única do cache
    queryFn: institutionService.getAll, // A função que busca os dados
    staleTime: 1000 * 60 * 60, // 1 hora (Instituições mudam pouco, não precisa buscar toda hora)
  });
}