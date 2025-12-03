"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { useInstitutionReports } from "@/hooks/use-institution-reports"; // <--- HOOK NOVO
// --- HELPER: Cores baseadas no Status do Java ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case "RESOLVIDO": // Caso você tenha traduzido no front
    case "RESOLVED":  // Enum Java
      return "bg-green-100 text-green-700 border-green-200";
    case "EM_ANALISE":
    case "IN_PROGRESS": // Enum Java
      return "bg-blue-100 text-blue-700 border-blue-200";
    default: // OPEN
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
};

// --- HELPER: Texto amigável ---
const getStatusLabel = (status: string) => {
  switch (status) {
    case "RESOLVED": return "Resolvido";
    case "IN_PROGRESS": return "Em Análise";
    default: return "Aberto";
  }
};

// --- HELPER: Ícones ---
const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED": return <CheckCircle size={14} />;
      case "IN_PROGRESS": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
};

export default function InstitutionReportsPage() {
  const user = useAuthStore((state) => state.user);

  // USA O ID DA INSTITUIÇÃO DO GESTOR
  const { data: reports = [], isLoading } = useInstitutionReports(user?.institutionId);

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">
      
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/perfil"> {/* Volta pro Perfil */}
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        {/* TÍTULO DIFERENTE */}
        <h1 className="text-xl font-bold text-white">Reports da Instituição</h1>
      </header>

      {/* 2. Filtro (Visual por enquanto) */}
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
        
        {/* Loading State */}
        {isLoading && (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-brand-dark" />
            </div>
        )}

        {/* Lista Real */}
        {!isLoading && reports.map((report) => (
          <Link key={report.id} href={`/report/${report.id}`} className="block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-brand-dark/10 active:scale-[0.98] transition-all">
              
              {/* Topo do Card */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-brand-dark text-lg leading-tight w-[65%] line-clamp-2">
                   {report.title} {/* Campo da API */}
                </h3>
                
                {/* Badge de Status */}
                <div className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusStyles(report.currentStatus)}`}>
                  {getStatusIcon(report.currentStatus)}
                  {getStatusLabel(report.currentStatus)}
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start gap-2 text-gray-500 text-sm mb-3">
                 <MapPin size={16} className="mt-0.5 shrink-0" />
                <span className="leading-snug line-clamp-1">
                    {report.addressText || "Localização no mapa"}
                </span>
              </div>

              {/* Rodapé do Card */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-brand-dark bg-gray-100 px-2 py-1 rounded-md">
                    {report.categoryName}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Calendar size={12} />
                    {/* Formatação de Data */}
                    {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

            </div>
          </Link>
        ))}

        {/* Estado Vazio Diferente */}
       {!isLoading && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                <AlertCircle size={48} className="text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">Nenhuma ocorrência vinculada à sua instituição.</p>
            </div>
        )}

      </div>
    </main>
  );
}