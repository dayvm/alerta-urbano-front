import { api } from "@/lib/api";

export interface Institution {
  id: number;
  name: string; // ou 'nome', verifique seu DTO Java
}

export const institutionService = {
  getAll: async () => {
    // Ajuste a rota se for diferente no seu Java (ex: /institutions)
    const { data } = await api.get<Institution[]>("/institutions");
    return data;
  }
};