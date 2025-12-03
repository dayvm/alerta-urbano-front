"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Shield, Building, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MyDataPage() {
  const user = useAuthStore((state) => state.user);

  // Helper para traduzir o tipo de perfil
  const getProfileLabel = (type?: string) => {
    if (type === "MANAGER") return "Gestor Institucional";
    if (type === "ADMIN") return "Administrador";
    return "Cidadão Consciente";
  };

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;
  }

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">

      {/* 1. Header */}
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/perfil">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Meus Dados</h1>
      </header>

      {/* 2. Conteúdo */}
      <div className="flex-1 p-6 flex flex-col items-center gap-6">

        {/* Foto de Perfil Grande */}
        <div className="flex flex-col items-center gap-3 mt-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src="/fotoperfil.jpg" alt={`${user.name}`} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-gray-500 text-sm font-medium">
                ID de Usuário: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-700">#{user.id}</span>
            </p>
        </div>

        {/* Formulário (Somente Leitura) */}
        <div className="w-full space-y-5">

            {/* Nome */}
            <div className="space-y-2">
                <label className="text-brand-dark font-bold text-sm flex items-center gap-2">
                    <User size={16} /> Nome Completo
                </label>
                <Input 
                    value={user.name} 
                    readOnly 
                    className="bg-white border-0 h-12 rounded-xl shadow-sm text-gray-600 focus-visible:ring-0"
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-brand-dark font-bold text-sm flex items-center gap-2">
                    <Mail size={16} /> E-mail
                </label>
                <Input 
                    value={user.email} 
                    readOnly 
                    className="bg-white border-0 h-12 rounded-xl shadow-sm text-gray-600 focus-visible:ring-0"
                />
            </div>

            {/* Tipo de Perfil */}
            <div className="space-y-2">
                <label className="text-brand-dark font-bold text-sm flex items-center gap-2">
                    <Shield size={16} /> Tipo de Conta
                </label>
                <Input 
                    value={getProfileLabel(user.profileType)} 
                    readOnly 
                    className="bg-white border-0 h-12 rounded-xl shadow-sm text-gray-600 focus-visible:ring-0"
                />
            </div>

            {/* Instituição (Só aparece se for Gestor) */}
            {user.profileType === "MANAGER" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-brand-dark font-bold text-sm flex items-center gap-2">
                        <Building size={16} /> Instituição Vinculada
                    </label>
                    <div className="bg-white h-12 rounded-xl shadow-sm flex items-center px-3 gap-3 border-l-4 border-brand-dark">
                        <Briefcase className="text-gray-400" size={20} />
                        <span className="text-gray-700 font-medium">
                            {user.institutionName || "Instituição não identificada"}
                        </span>
                    </div>
                </div>
            )}

        </div>

        {/* Aviso de Rodapé */}
        <div className="mt-auto text-center text-xs text-gray-400 px-4 pb-4">
            Ailton, Arthur, David, Dayvson, Julia, Hallason, Paraizo, Wilson
        </div>

      </div>
    </main>
  );
}