import { api } from "@/lib/api";

export interface Comment {
  id: number;
  text: string;
  postedAt: string;
  userId: number;
  userName: string;
  userProfileType: string;
}

export const commentService = {
  // Busca comentários de uma ocorrência
  getByOccurrence: async (occurrenceId: number) => {
    const { data } = await api.get<Comment[]>(`/comments?occurrenceId=${occurrenceId}`);
    return data;
  },

  // Cria comentário (Payload igual ao que o Java pede)
  create: async (text: string, occurrenceId: number, userId: number) => {
    const payload = { text, occurrenceId, userId };
    const { data } = await api.post("/comments", payload);
    return data;
  }
};