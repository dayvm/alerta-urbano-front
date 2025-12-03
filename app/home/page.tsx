"use client";

import dynamic from "next/dynamic";
import { useState } from "react"; // <--- useState para controlar a busca
import { Menu, Search, Mic, MapPin, Shield, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner"; // <--- Para avisar se não achar

// Importação Dinâmica do Mapa
const MapView = dynamic(() => import("@/components/map-view"), {
  loading: () => <div className="w-full h-full bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Carregando mapa...</div>,
  ssr: false,
});

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  // Estados da Busca
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [flyToLocation, setFlyToLocation] = useState<{lat: number, lng: number} | null>(null);

  // Função de Busca (Nominatim API)
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    try {
        // Busca OpenStreetMap (Grátis)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            
            // Manda o mapa voar para lá
            setFlyToLocation({ lat, lng });
        } else {
            toast.error("Endereço não encontrado.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro na busca.");
    } finally {
        setIsSearching(false);
    }
  };

  // Busca ao apertar ENTER
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        handleSearch();
    }
  };

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col items-center overflow-hidden">

      {/* 1. Header Escuro */}
      <header className="w-full bg-brand-dark rounded-b-[2rem] p-6 pb-8 shadow-lg z-20">
        <div className="flex items-center gap-3">
          
          <Link href="/perfil">
            <button className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform">
              <Menu className="h-6 w-6 text-brand-dark" />
            </button>
          </Link>

          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-r border-gray-300 pr-2">
              <Mic className="h-5 w-5 text-brand-dark opacity-50" />
            </div>
            
            {/* Input de Busca Funcional */}
            <Input 
              placeholder="Buscar endereço (ex: Marco Zero)..." 
              className="h-12 w-full rounded-full pl-14 pr-12 bg-white border-0 text-gray-700 placeholder:text-gray-400 focus-visible:ring-offset-0 shadow-inner"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
            />

            {/* Ícone de Busca (Clicável ou Spinner) */}
            <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
                {isSearching ? <Loader2 className="h-5 w-5 text-brand-dark animate-spin" /> : <Search className="h-5 w-5 text-brand-dark" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Área do Conteúdo */}
      <div className="w-full flex-1 px-4 mt-4 pb-4 z-10 flex flex-col relative">
        
        {/* Container do Mapa */}
        <div className="w-full h-[70vh] bg-white rounded-2xl shadow-xl p-1 relative overflow-hidden">
          {/* Passamos o flyToLocation para o mapa */}
          <MapView flyToLocation={flyToLocation} />
        </div>

        {/* 3. Card Flutuante (Condicional) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm pointer-events-none z-[400]">
          {user?.profileType === "MANAGER" ? (
            <div className="bg-brand-dark text-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-700">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">Modo Gestão</h3>
                <p className="text-sm text-white/90 leading-tight mt-1">
                  Visualizando ocorrências vinculadas à <strong>{user.institutionName || "sua instituição"}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#1abeb3] text-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-700">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                <MapPin className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">Vamos começar?</h3>
                <p className="text-sm text-white/90 leading-tight mt-1">
                  Toque em qualquer lugar do mapa para criar um report.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}