import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Tipagem do Usuário (Igual ao DTO do Java)
export interface User {
  id?: number;
  nome: string;
  email: string;
  role?: string; // "CIDADAO" | "GESTOR"
}

// 2. Tipagem do Estado
interface AuthState {
  token: string | null;
  user: User | null;
  
  // Ações
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 3. Criação da Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) => {
        set({ token, user });
      },

      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem("token"); // Limpeza extra por segurança
      },
    }),
    {
      name: "auth-storage", // Nome da chave que vai aparecer no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);