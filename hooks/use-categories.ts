import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category"; // Importa do serviço que criamos acima

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 60, // Cache de 1 hora
  });
}