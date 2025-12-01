"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Cria o cliente apenas uma vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações globais:
        // refetchOnWindowFocus: false, // Evita recarregar a tela só de trocar de aba (opcional)
        staleTime: 1000 * 60 * 5, // Dados ficam "frescos" por 5 minutos (cache)
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}