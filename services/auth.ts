import { api } from "@/lib/api"; // Aquele axios configurado que criamos antes
import { User } from "@/store/auth-store";

// Tipagem do que enviamos pro Java
interface LoginRequest {
  email: string;
  password?: string; // Se seu DTO espera "password" (Use o certo!)
}

// Tipagem do que o Java devolve
interface LoginResponse {
  token: string;
  usuario: User; // Ou 'user', verifique como está no seu UserDTO do Java
}

export const authService = {
  // Função de Login
  login: async (credentials: LoginRequest) => {
    // Post para /auth/login usando a instância 'api'
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  // Função de Registro (Já deixamos pronta)
  register: async (userData: any) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  }
};