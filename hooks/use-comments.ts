import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/comment";

export function useComments(occurrenceId: number) {
  const queryClient = useQueryClient();

  // 1. Busca os comentários
  const query = useQuery({
    queryKey: ["comments", occurrenceId],
    queryFn: () => commentService.getByOccurrence(occurrenceId),
    enabled: !!occurrenceId,
    staleTime: 1000 * 30, // 30 segundos de cache
  });

  // 2. Função para criar (Mutation)
  const mutation = useMutation({
    mutationFn: (data: { text: string; userId: number }) => 
      commentService.create(data.text, occurrenceId, data.userId),
    
    onSuccess: () => {
      // Quando criar, atualiza a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ["comments", occurrenceId] });
    },
  });

  return { ...query, createComment: mutation };
}