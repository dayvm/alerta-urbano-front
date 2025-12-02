import { api } from "@/lib/api";

export interface Category {
  id: number;
  name: string;
}

export const categoryService = {
  getAll: async () => {
    // Busca no endpoint /categories
    const { data } = await api.get<Category[]>("/categories");
    return data;
  }
};