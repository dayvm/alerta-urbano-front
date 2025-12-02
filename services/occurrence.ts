import { api } from "@/lib/api";

export interface Occurrence {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  addressText: string;
  currentStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string; // <--- ADICIONE ESTA LINHA
  categoryName: string;
  authorName: string;            // Adicionei baseado no seu JSON
  responsibleInstitutionName?: string; // Adicionei (pode ser null)
  photoUrl?: string;
}

export const occurrenceService = {
  getAll: async () => {
    const { data } = await api.get<Occurrence[]>("/occurrences");
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Occurrence>(`/occurrences/${id}`);
    return data;
  },
};