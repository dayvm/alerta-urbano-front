"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, Camera, Plus, Loader2 } from "lucide-react";
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
import { useAuthStore } from "@/store/auth-store";
import { useCategories } from "@/hooks/use-categories";
import { occurrenceService } from "@/services/occurrence";
import { useQueryClient } from "@tanstack/react-query"; // <--- ADICIONE ISSO

// Componente interno para ler URL (Regra do Next.js)
function NewReportForm() {
  const router = useRouter();
  const queryClient = useQueryClient(); // <--- ADICIONE ISSO
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user); // Pega o usuário logado

  // Lê coordenadas da URL
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  // Busca categorias do banco
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Estados do Formulário
  const [formData, setFormData] = useState({
    title: "",
    address: "", // O Java pede addressText
    description: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validações
    if (!user?.id) {
      alert("Erro: Usuário não identificado. Faça login novamente.");
      return;
    }
    if (!latParam || !lngParam) {
      alert("Erro: Localização não detectada. Volte ao mapa e selecione um local.");
      return;
    }
    if (!formData.title || !formData.categoryId) {
      alert("Preencha o título e o tipo de problema.");
      return;
    }

    setLoading(true);

    try {
      // Monta o payload exato que o Java pediu
      const payload = {
        title: formData.title,
        description: formData.description,
        latitude: parseFloat(latParam),
        longitude: parseFloat(lngParam),
        addressText: formData.address || "Localização selecionada no mapa",
        categoryId: Number(formData.categoryId),
        authorId: Number(user.id) // O Java pediu isso no body
      };

      console.log("Enviando:", payload);

      await occurrenceService.create(payload);

      // --- LINHA MÁGICA: Força o mapa a atualizar ---
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
      // ----------------------------------------------

      alert("Report criado com sucesso!");
      router.push("/home"); // Volta pro mapa

    } catch (error) {
      console.error("Erro ao criar:", error);
      alert("Erro ao enviar report. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-5 pb-10">

      {/* Aviso de Local (Visual Feedback) */}
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-blue-800">
        <MapPin size={16} />
        <span>
          Coordenadas: {parseFloat(latParam || "0").toFixed(5)}, {parseFloat(lngParam || "0").toFixed(5)}
        </span>
      </div>

      {/* Tipo de Problema (Select Dinâmico) */}
      <div className="space-y-2">
        <label className="text-brand-dark font-bold text-lg">Tipo de problema</label>
        <Select onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
          <SelectTrigger className="h-12 w-full rounded-xl bg-white border-0 shadow-sm text-gray-700 focus:ring-brand-dark/20">
            <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <label className="text-brand-dark font-bold text-lg">Título</label>
        <Input
          placeholder="Ex: Buraco perigoso"
          className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* Endereço Manual */}
      <div className="space-y-2">
        <label className="text-brand-dark font-bold text-lg">Endereço (Opcional)</label>
        <Input
          placeholder="Ex: Rua da Aurora, perto do nº 500"
          className="h-12 rounded-xl bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label className="text-brand-dark font-bold text-lg">Descrição do problema</label>
        <Textarea
          placeholder="Descreva detalhes..."
          className="min-h-[120px] rounded-xl bg-white border-0 shadow-sm text-gray-700 resize-none p-4 text-base"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Fotos (VISUAL APENAS - SEM LÓGICA POR ENQUANTO) */}
      <div className="space-y-2 opacity-50 pointer-events-none">
        <label className="text-brand-dark font-bold text-lg">Fotos (Desativado Demo)</label>
        <div className="flex gap-4">
          <button className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center border-2 border-transparent">
            <Camera className="h-8 w-8 text-brand-dark" />
          </button>
          <button className="h-16 w-16 bg-white rounded-xl shadow-sm flex items-center justify-center border-2 border-transparent">
            <Plus className="h-8 w-8 text-brand-dark" />
          </button>
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 rounded-full bg-[#1abeb3] hover:bg-[#17a299] text-white font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Abrir Report"}
        </Button>
      </div>

    </div>
  );
}

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

      {/* Conteúdo com Suspense para carregar parâmetros da URL */}
      <Suspense fallback={<div className="p-10 text-center">Carregando formulário...</div>}>
        <NewReportForm />
      </Suspense>
    </main>
  );
}