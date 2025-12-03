"use client";

import Link from "next/link";
import { ArrowLeft, User, MapPin, Settings, LogOut, History, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">
      
      {/* 1. Header (Aumentei o padding-bottom para dar mais espaço) */}
      <div className="w-full bg-brand-dark pb-24 pt-6 px-6 rounded-b-[3rem] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <Link href="/home">
            <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
          </Link>
          <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
          <Settings className="h-6 w-6 text-white cursor-pointer" />
        </div>

        {/* Info do Usuário Centralizada */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Avatar className="h-34 w-34 border-4 border-white shadow-xl">
            {/* Foto mockada - troque pela URL real depois */}
            <AvatarImage src="/fotoperfil.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Alex Silva</h2>
            <p className="text-white/70 text-sm">Cidadão Consciente</p>
          </div>
        </div>
      </div>

      {/* 2. Estatísticas (Cards flutuantes reposicionados) */}
      <div className="px-6 -mt-16 mb-6 grid grid-cols-2 gap-4 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-[#1abeb3]">12</span>
          <span className="text-xs text-gray-500 font-medium uppercase mt-1">Reports Criados</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-brand-dark">05</span>
          <span className="text-xs text-gray-500 font-medium uppercase mt-1">Resolvidos</span>
        </div>
      </div>

      {/* 3. Menu de Opções */}
      <div className="flex-1 px-6 pb-8 space-y-2">
        
        {/* Item: Meus Dados */}
        <Link href="/meus-dados" className="w-full block">
          <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-transparent hover:border-gray-200">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <span className="text-gray-700 font-bold flex-1 text-left">Meus Dados</span>
          </button>
        </Link>

        {/* Item: Histórico */}
        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform">
          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <History className="h-5 w-5" />
          </div>
          <span className="text-gray-700 font-bold flex-1 text-left">Histórico de Reports</span>
        </button>

        {/* Item: Endereços Salvos */}
        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform">
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-gray-700 font-bold flex-1 text-left">Endereços Salvos</span>
        </button>

        {/* Item: Admin (Só aparece se for admin/gestor - Exemplo visual) */}
        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-brand-dark/10">
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left flex-1">
             <span className="text-gray-700 font-bold">Área do Gestor</span>
             <span className="text-xs text-gray-400">Acesso restrito</span>
          </div>
        </button>

        <Separator className="my-4" />

        {/* Botão Sair */}
        <Link href="/login" className="block w-full">
          <Button variant="ghost" className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold text-lg">
            <LogOut className="h-5 w-5" />
            Sair da Conta
          </Button>
        </Link>

      </div>
    </main>
  );
}
