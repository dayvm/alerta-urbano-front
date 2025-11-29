"use client";

import dynamic from "next/dynamic";
import { Menu, Search, Mic, Map as MapIcon, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Importação Dinâmica do Mapa (CRUCIAL: Evita erro "window is not defined")
const MapView = dynamic(() => import("@/components/map-view"), {
  loading: () => <div className="w-full h-full bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Carregando mapa...</div>,
  ssr: false, // Desabilita renderização no servidor para este componente
});

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col items-center">
      
      {/* 1. Header Escuro */}
      <header className="w-full bg-brand-dark rounded-b-[2rem] p-6 pb-8 shadow-lg z-10">
        <div className="flex items-center gap-3">
          
          {/* Botão Menu (Hambúrguer) */}
          <button className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform">
            <Menu className="h-6 w-6 text-brand-dark" />
          </button>

          {/* Barra de Pesquisa */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent border-r border-gray-300 pr-2">
               <Mic className="h-5 w-5 text-brand-dark" />
            </div>
            <Input 
              placeholder="Escolha um endereço" 
              className="h-12 w-full rounded-full pl-14 pr-10 bg-white border-0 text-gray-700 placeholder:text-gray-400 focus-visible:ring-offset-0"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-dark" />
          </div>

        </div>
      </header>

      {/* 2. Área do Conteúdo */}
      <div className="w-full max-w-sm px-6 -mt-4 z-0 flex flex-col gap-6 pb-8">
        
        {/* Container do Mapa */}
        <div className="relative w-full h-64 bg-white rounded-xl shadow-md p-1">
          {/* Componente do Mapa Leaflet */}
          <div className="w-full h-full rounded-lg overflow-hidden relative">
            <MapView />
            
            {/* Botão Flutuante sobre o Mapa (Ícone de Mapa) */}
            <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-md shadow-sm z-[400] cursor-pointer">
              <MapIcon className="h-5 w-5 text-brand-dark" />
            </div>
          </div>
        </div>

        {/* Título da Seção */}
        <h2 className="text-xl font-extrabold text-brand-dark text-center">
          Meus Reports
        </h2>

        {/* Lista de Reports (Card #1) */}
        <div className="w-full bg-brand-dark rounded-2xl p-4 flex items-center gap-4 shadow-md text-white">
          <div className="h-10 w-10 border-2 border-white rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
            {/* O ícone de exclamação pequeno seria um elemento extra, simplifiquei com o User por enquanto */}
          </div>
          <span className="text-lg font-medium">Report #1</span>
        </div>

        {/* Botão de Ação Principal (Turquesa) */}
        <Button 
          className="w-full h-14 rounded-full bg-[#1abeb3] hover:bg-[#17a299] text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-2"
        >
          {/* Nota: A cor #1abeb3 é aproximada do turquesa da imagem */}
          Abrir Novo Report
        </Button>

      </div>
    </main>
  );
}