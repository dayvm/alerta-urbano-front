"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, MapPin, Calendar, User, AlertCircle } from "lucide-react";
import { useOccurrenceDetails } from "@/hooks/use-occurrence-details";

// Helper para traduzir o status do Java para Português
const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Em Aberto", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  IN_PROGRESS: { label: "Em Análise", color: "bg-blue-100 text-blue-800 border-blue-200" },
  RESOLVED: { label: "Resolvido", color: "bg-green-100 text-green-800 border-green-200" },
};

export default function ReportDetailsPage() {
  // 1. Pega o ID da URL
  const params = useParams();
  const idString = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(idString); // Converte para number para o Hook

  // 2. Busca os dados reais com Tanstack Query
  const { data, isLoading, isError } = useOccurrenceDetails(id);

  // Fallback visual enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-splash-bg text-brand-dark">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p>Carregando detalhes do report...</p>
      </div>
    );
  }

  // Fallback se der erro ou não achar
  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-splash-bg text-brand-dark p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Report não encontrado</h2>
        <p className="mb-6">Não conseguimos carregar os dados deste report.</p>
        <Link href="/home">
            <button className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold">Voltar ao Mapa</button>
        </Link>
      </div>
    );
  }

  // Define a imagem final (Real ou Fallback)
  // Nota: Se 'photoUrl' vier null do Java, usa o fallback.
  const displayImage = data.photoUrl && data.photoUrl.trim() !== "" 
    ? data.photoUrl 
    : "/um-report-fallback.png";

  const statusInfo = statusMap[data.currentStatus] || statusMap.OPEN;

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col pb-8">
      
      {/* 1. Header Escuro */}
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/home">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Report #{data.id}</h1>
      </header>
      
      <div className="flex-1 p-6 flex flex-col gap-6">

        {/* 2. Card de Notificação (Turquesa) */}
        <div className="w-full bg-[#1abeb3] rounded-2xl p-6 shadow-md text-white space-y-3">
          <h2 className="font-bold text-lg">
            Situação: {statusInfo.label}
          </h2>
          <p className="leading-tight text-sm opacity-90">
             O report criado por <strong>{data.authorName}</strong> está registrado no nosso sistema. 
             {data.responsibleInstitutionName && (
                <span> A instituição responsável é <strong>{data.responsibleInstitutionName}</strong>.</span>
             )}
          </p>
        </div>

        {/* 3. Status e Categoria (Chips) */}
        <div className="flex gap-2 flex-wrap">
             <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                {statusInfo.label}
             </span>
             <span className="px-3 py-1 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200">
                {data.categoryName}
             </span>
        </div>

        {/* 4. Divisor */}
        <hr className="border-gray-400/30 w-full" />

        {/* 5. Título do Report */}
        <div>
                <h2 className="text-2xl font-extrabold text-brand-dark leading-tight">
                {data.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Calendar size={14} />
                    
                    {/* --- CORREÇÃO: DATA REAL --- */}
                    <span>
                        {new Date(data.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit'
                        })}
                    </span>
                    {/* --------------------------- */}
                    
                </div>
            </div>

        {/* 6. Imagem (Com Fallback) */}
        <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-sm border-2 border-white">
            <Image 
                src={displayImage}
                alt="Foto do problema"
                fill
                className="object-cover"
            />
        </div>

        {/* 7. Dados Detalhados */}
        <div className="space-y-6 text-brand-dark bg-white/50 p-4 rounded-xl">
          
          {/* Endereço */}
          <div className="flex gap-3">
            <MapPin className="text-gray-400 shrink-0 mt-1" />
            <div>
                <span className="font-bold block text-sm text-gray-500 uppercase">Localização</span>
                <span className="text-lg leading-snug block font-medium">
                {data.addressText || "Localização via Mapa"}
                </span>
            </div>
          </div>

          {/* Descrição */}
          <div className="flex gap-3">
             <AlertCircle className="text-gray-400 shrink-0 mt-1" />
             <div>
                <span className="font-bold block text-sm text-gray-500 uppercase">Detalhes</span>
                <p className="text-lg leading-relaxed text-gray-800">
                {data.description || "Sem descrição adicional fornecida."}
                </p>
             </div>
          </div>

          {/* Autor */}
          <div className="flex gap-3">
             <User className="text-gray-400 shrink-0 mt-1" />
             <div>
                <span className="font-bold block text-sm text-gray-500 uppercase">Reportado por</span>
                <p className="text-lg font-medium">
                {data.authorName}
                </p>
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}