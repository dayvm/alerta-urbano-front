import { api } from "@/lib/api";

export interface Occurrence {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  addressText: string;
  currentStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  categoryName: string;
  authorName: string;            // Adicionei baseado no seu JSON
  responsibleInstitutionName?: string; // Adicionei (pode ser null)
}

export const occurrenceService = {
  getAll: async () => {
    const { data } = await api.get<Occurrence[]>("/occurrences");
    return data;
  }
};