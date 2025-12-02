import axios from "axios";

// Cria uma instância do Axios com a URL base definida no .env
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// --- INTERCEPTADOR DE REQUISIÇÃO (O Pulo do Gato) ---
// Antes de qualquer requisição sair do front, esse código roda.
api.interceptors.request.use((config) => {
  // 1. Tenta pegar o objeto completo do Zustand
  if (typeof window !== "undefined") {
    const storageData = localStorage.getItem("auth-storage"); // <--- CHAVE CORRETA

    if (storageData) {
      try {
        // 2. Faz o parse do JSON (porque o Zustand salva como string)
        const parsedData = JSON.parse(storageData);
        
        // 3. Pega o token de dentro do estado
        const token = parsedData.state?.token;

        // 4. Se o token existir, injeta no header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Erro ao ler token do storage:", error);
      }
    }
  }

  return config;
});

// --- INTERCEPTADOR DE RESPOSTA (Tratamento de Erro Global) ---
// Se a API devolver erro (ex: 401 Token Inválido), tratamos aqui.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Não autorizado), significa que o token venceu ou é inválido.
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Opcional: Forçar logout automático
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);