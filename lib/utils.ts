import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Função padrão do Shadcn (mantém ela)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- NOSSA FUNÇÃO NOVA ---
export function getImageUrl(path?: string | null) {
  // 1. Se não tiver caminho (null/undefined), retorna o fallback local
  if (!path) return "/um-report-fallback.png";

  // 2. Se já for um link completo (Google, Unsplash, etc), retorna ele mesmo
  if (path.startsWith("http")) {
    return path;
  }

  // 3. Se for relativo (/uploads/...), cola o domínio do Backend na frente
  // Pega a URL do .env ou usa o padrão se não tiver
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://alerta-urbano-back.onrender.com";
  
  return `${baseUrl}${path}`;
}