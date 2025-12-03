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
  responsibleInstitutionId: number;
  responsibleInstitutionName?: string; // Adicionei (pode ser null)
  photoUrl?: string;
}

export interface CreateOccurrencePayload {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  addressText: string;
  categoryId: number;
  authorId: number;
  responsibleInstitutionId: number | null; // <--- ADICIONE ISSO
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
  getByInstitution: async (institutionId: number) => {
    const { data } = await api.get<Occurrence[]>(`/occurrences?institutionId=${institutionId}`);
    return data;
  },
  create: async (payload: CreateOccurrencePayload) => {
    const { data } = await api.post("/occurrences", payload);
    return data;
  },
  getByAuthor: async (userId: number) => {
    // O Java espera o parâmetro como query param: ?userId=1
    const { data } = await api.get<Occurrence[]>(`/occurrences?userId=${userId}`);
    return data;
  },
  updateStatus: async (id: number, newStatus: string) => {
    // O Java espera um Map<String, String> no body: { "currentStatus": "IN_PROGRESS" }
    const { data } = await api.patch(`/occurrences/${id}/status`, { currentStatus: newStatus });
    return data;
  }
};