"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation"; // Para pegar o ID da URL
import { ArrowLeft } from "lucide-react";

// Simulando dados vindos de uma API baseados no ID
// Em um app real, você faria um fetch(api/reports/${id})
const getMockData = (id: string) => {
  return {
    id: id,
    user: "Alex",
    status: "pending_analysis", // status interno
    type: "Riscos",
    title: "Poste quebrado.",
    address: "Rua das Flores, 725, parque santana - 12345-678",
    description: "Poste quebrado na rua prejudicando a segurança dos cidadãos.",
    // Coloquei uma imagem de placeholder genérica. 
    // Se tiver a foto real do poste, coloque em /public e mude este caminho.
    imageUrl: "https://placehold.co/600x600/png?text=Foto+do+Local", 
  };
};

export default function ReportDetailsPage() {
  // Pega o ID da URL (ex: /report/2 -> id = "2")
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Carrega os dados (Simulação de API)
  // Se não tiver ID (loading), retorna nulo ou dados vazios
  const data = id ? getMockData(id) : null;

  // Fallback visual enquanto carrega ou se der erro
  if (!data) return <div className="p-8 text-center">Carregando detalhes...</div>;

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col pb-8">
      
      {/* 1. Header Escuro */}
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/home">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Report: nº {data.id}</h1>
      </header>

      <div className="flex-1 p-6 flex flex-col gap-6">

        {/* 2. Card de Notificação (Turquesa) */}
        <div className="w-full bg-[#1abeb3] rounded-2xl p-6 shadow-md text-white space-y-4">
          <p className="font-bold leading-tight">
            Olá, {data.user || "Usuário"}! Seu report foi criado com sucesso!
          </p>
          <p className="leading-tight">
            Agradecemos por contribuir. Cada novo report faz diferença na nossa cidade.
          </p>
          <p className="leading-tight">
            O report de número {data.id} foi registrado recentemente e agora está em análise pela nossa equipe.
          </p>
          <p className="leading-tight">
            Assim que for aprovado, você poderá acompanhar todo o andamento por esta página.
          </p>
        </div>

        {/* 3. Divisor */}
        <hr className="border-gray-400/50 w-full" />

        {/* 4. Título da Seção */}
        <h2 className="text-xl font-extrabold text-brand-dark text-center">
          Descrição do Report
        </h2>

        {/* 5. Lista de Dados (Simulando API) */}
        <div className="space-y-4 text-brand-dark">
          
          {/* Tipo */}
          <div>
            <span className="font-bold block text-lg">Tipo de problema:</span>
            <span className="text-lg">{data.type || "Não informado"}</span>
          </div>

          {/* Título */}
          <div>
            <span className="font-bold block text-lg">Título:</span>
            <span className="text-lg">{data.title || "Sem título"}</span>
          </div>

          {/* Endereço */}
          <div>
            <span className="font-bold block text-lg">Endereço:</span>
            <span className="text-lg leading-snug block">
              {data.address || "Endereço não localizado"}
            </span>
          </div>

          {/* Fotos */}
          <div>
            <span className="font-bold block text-lg mb-2">Fotos:</span>
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-brand-dark shadow-sm">
              <Image 
                src={data.imageUrl}
                alt="Foto do problema"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <span className="font-bold block text-lg">Descrição do problema:</span>
            <p className="text-lg leading-snug">
              {data.description || "Sem descrição fornecida."}
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}