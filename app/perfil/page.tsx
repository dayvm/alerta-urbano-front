"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, Settings, LogOut, History, Shield, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { useMyReports } from "@/hooks/use-my-reports";
import { useInstitutionReports } from "@/hooks/use-institution-reports";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // 1. Buscamos as duas listas (O Tanstack Query gerencia o cache, então é leve)
  const { data: myReports = [] } = useMyReports(user?.id);
  const { data: instReports = [] } = useInstitutionReports(user?.institutionId);

  // 2. Decidimos qual lista usar baseado no perfil
  const isManager = user?.profileType === "MANAGER";

  // Se for Gestor, usa os dados da instituição. Se for Cidadão, usa os meus reports.
  const sourceReports = isManager ? instReports : myReports;

  // 3. Calculamos os totais usando a fonte correta
  const totalReports = sourceReports.length;
  const resolvedReports = sourceReports.filter(r =>
    r.currentStatus === "RESOLVED"
  ).length;

  // 4. Definimos os textos das etiquetas
  const labelTotal = isManager ? "Total da Instituição" : "Reports Criados";
  const labelResolved = isManager ? "Resolvidos" : "Resolvidos";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    // Proteção simples caso acesse sem logar
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">

      {/* 1. Header */}
      <div className="w-full bg-brand-dark pb-24 pt-6 px-6 rounded-b-[3rem] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <Link href="/home">
            <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
          </Link>
          <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
          <Settings className="h-6 w-6 text-white cursor-pointer opacity-50" />
        </div>

        {/* Info do Usuário */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarImage src="/fotoperfil.jpg" alt="@shadcn" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-white/70 text-sm">
              {user.profileType === "MANAGER" ? "Gestor Institucional" : "Cidadão Consciente"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Estatísticas Reais */}
      <div className="px-6 -mt-16 mb-6 grid grid-cols-2 gap-4 relative z-20">
        <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center border border-gray-100">
          <span className="text-3xl font-bold text-[#1abeb3]">{totalReports}</span>
          <span className="text-xs text-gray-500 font-medium uppercase mt-1">
            {labelTotal}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-center border border-gray-100">
          <span className="text-3xl font-bold text-brand-dark">{resolvedReports}</span>
          <span className="text-xs text-gray-500 font-medium uppercase mt-1">
            {labelResolved}
          </span>
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

        {/* Item: Meus Dados */}
        <Link href="/meus-dados" className="w-full block">
          <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-transparent hover:border-gray-200">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <span className="text-gray-700 font-bold flex-1 text-left">Meus Dados</span>
          </button>
        </Link>

        {/* Item: Histórico (SÓ PARA CIDADÃO) */}
        {user.profileType !== "MANAGER" && (
            <Link href="/historico" className="w-full block">
              <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-transparent hover:border-gray-200">
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <History className="h-5 w-5" />
                </div>
                <span className="text-gray-700 font-bold flex-1 text-left">Histórico de Reports</span>
              </button>
            </Link>
        )}

        {/* Item: Endereços Salvos */}
        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-transparent hover:border-gray-200">
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-gray-700 font-bold flex-1 text-left">Endereços Salvos</span>
        </button>

        {/* Item: Admin / Gestor (CONDICIONAL) */}
        {user.profileType === "MANAGER" && (
          <Link href="/reports-instituicao" className="w-full block">
            <button className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform border border-brand-dark/20 bg-gray-50">
              <div className="h-10 w-10 bg-brand-dark rounded-full flex items-center justify-center text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-left flex-1">
                <span className="text-gray-900 font-bold">Área do Gestor</span>
                <span className="text-xs text-gray-500">
                  {user.institutionName ? user.institutionName : "Acesso Restrito"}
                </span>
              </div>
            </button>
          </Link>
        )}

        <Separator className="my-4 opacity-50" />

        {/* Botão Sair */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold text-lg"
        >
          <LogOut className="h-5 w-5" />
          Sair da Conta
        </Button>

      </div>
    </main>
  );
}