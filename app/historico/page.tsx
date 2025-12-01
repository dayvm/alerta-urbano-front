"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// --- MOCK DE DADOS (Simulando GET /ocorrencias?usuario_id=1) ---
const myReports = [
  {
    id: 1,
    titulo: "Poste com risco de queda",
    endereco: "Rua das Flores, 725, Parque Santana",
    data: "30/11/2025",
    status: "EM_ANALISE", // Enum: ABERTO, EM_ANALISE, RESOLVIDO
    categoria: "Riscos",
  },
  {
    id: 2,
    titulo: "Buraco na via principal",
    endereco: "Av. Agamenon Magalhães, S/N",
    data: "28/11/2025",
    status: "ABERTO",
    categoria: "Buraco",
  },
  {
    id: 3,
    titulo: "Lixo acumulado na calçada",
    endereco: "Rua da Aurora, 100",
    data: "15/11/2025",
    status: "RESOLVIDO",
    categoria: "Lixo",
  },
];

// Função auxiliar para definir cores baseadas no status
const getStatusStyles = (status: string) => {
  switch (status) {
    case "RESOLVIDO":
      return "bg-green-100 text-green-700 border-green-200";
    case "EM_ANALISE":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default: // ABERTO
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "RESOLVIDO": return "Resolvido";
    case "EM_ANALISE": return "Em Análise";
    default: return "Aberto";
  }
};

const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVIDO": return <CheckCircle size={14} />;
      case "EM_ANALISE": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

export default function HistoryPage() {
  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">
      
      {/* 1. Header Escuro */}
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        {/* Link volta para o Perfil, pois foi de lá que viemos */}
        <Link href="/perfil">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Meus Reports</h1>
      </header>

      {/* 2. Filtro / Pesquisa (Opcional, mas útil) */}
      <div className="px-6 pt-6 pb-2">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Filtrar por título..." 
                className="h-10 pl-9 bg-white border-0 shadow-sm rounded-xl"
            />
        </div>
      </div>

      {/* 3. Lista de Cards */}
      <div className="flex-1 p-6 space-y-4">
        
        {myReports.map((report) => (
          <Link key={report.id} href={`/report/${report.id}`} className="block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-brand-dark/10 active:scale-[0.98] transition-all">
              
              {/* Topo do Card: Título e Status */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-brand-dark text-lg leading-tight w-[65%]">
                  {report.titulo}
                </h3>
                
                {/* Badge de Status */}
                <div className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusStyles(report.status)}`}>
                  {getStatusIcon(report.status)}
                  {getStatusLabel(report.status)}
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start gap-2 text-gray-500 text-sm mb-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span className="leading-snug line-clamp-2">{report.endereco}</span>
              </div>

              {/* Rodapé do Card: Categoria e Data */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-brand-dark bg-gray-100 px-2 py-1 rounded-md">
                    {report.categoria}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Calendar size={12} />
                    {report.data}
                </div>
              </div>

            </div>
          </Link>
        ))}

        {/* Estado Vazio (Caso não tenha reports) */}
        {myReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                <AlertCircle size={48} className="text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">Você ainda não fez nenhum report.</p>
            </div>
        )}

      </div>
    </main>
  );
}