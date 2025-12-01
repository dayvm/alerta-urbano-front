import axios from "axios";

// Cria uma instância do Axios com a URL base definida no .env
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// --- INTERCEPTADOR DE REQUISIÇÃO (O Pulo do Gato) ---
// Antes de qualquer requisição sair do front, esse código roda.
api.interceptors.request.use((config) => {
  // 1. Tenta pegar o token salvo no navegador
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 2. Se tiver token, adiciona o cabeçalho "Authorization: Bearer ..."
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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