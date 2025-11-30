"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Camera, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewReportPage() {
  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col">
      
      {/* 1. Header Escuro com Botão Voltar */}
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/home">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Criar report</h1>
      </header>

      {/* 2. Formulário */}
      <div className="flex-1 p-6 space-y-5 pb-10">
        
        {/* Tipo de Problema (Select Shadcn) */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Tipo de problema</label>
          <Select>
            <SelectTrigger className="h-12 w-full rounded-xl bg-white border-0 shadow-sm text-gray-700 focus:ring-brand-dark/20">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buraco">Buraco na via</SelectItem>
              <SelectItem value="iluminacao">Iluminação Pública</SelectItem>
              <SelectItem value="lixo">Acúmulo de Lixo</SelectItem>
              <SelectItem value="vazamento">Vazamento de Água</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Título</label>
          <Input 
            className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Endereço</label>
          <Input 
            className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Linha CEP e Número + Botão Localização */}
        <div className="grid grid-cols-[1.5fr_1fr_auto] gap-3 items-end">
          
          <div className="space-y-2">
            <label className="text-brand-dark font-bold text-lg">CEP</label>
            <Input className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700" />
          </div>

          <div className="space-y-2">
            <label className="text-brand-dark font-bold text-lg">Número</label>
            <Input className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700" />
          </div>

          {/* Botão de Pino de Mapa */}
          <button className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center active:scale-95 transition-transform">
             <MapPin className="h-6 w-6 text-brand-dark" />
          </button>

        </div>

        {/* Fotos */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Fotos</label>
          <div className="flex gap-4">
            {/* Botão Câmera */}
            <button className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center border-2 border-transparent hover:border-brand-dark/10 active:scale-95 transition-all">
              <Camera className="h-8 w-8 text-brand-dark" />
            </button>
            {/* Botão Adicionar */}
            <button className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center border-2 border-transparent hover:border-brand-dark/10 active:scale-95 transition-all">
              <Plus className="h-8 w-8 text-brand-dark" />
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Descrição do problema</label>
          <Textarea 
            className="min-h-[120px] rounded-xl bg-white border-0 shadow-sm text-gray-700 resize-none p-4 text-base"
          />
        </div>

        {/* Botão de Ação */}
        <div className="pt-4">
           <Button 
            className="w-full h-14 rounded-full bg-[#1abeb3] hover:bg-[#17a299] text-white font-bold text-lg shadow-lg active:scale-95 transition-all"
          >
            Abrir Report
          </Button>
        </div>

      </div>
    </main>
  );
}