import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id?: number;
  name: string;
  email: string;
  profileType: string; // "CITIZEN" | "MANAGER" | "ADMIN"
  institutionId?: number;
  institutionName?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) => {
        set({ token, user });
      },

      logout: () => {
        // 1. Limpa o estado interno
        set({ token: null, user: null });
        
        // 2. Limpa o localStorage forçadamente
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage");
            localStorage.removeItem("token"); // Caso tenha sobrado lixo antigo
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);