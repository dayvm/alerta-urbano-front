"use client";

import { useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, Camera, Plus, Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth-store";
import { useCategories } from "@/hooks/use-categories";
import { useInstitutions } from "@/hooks/use-institutions";
import { occurrenceService } from "@/services/occurrence";
import { attachmentService } from "@/services/attachment"; // <--- NOVO
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function NewReportForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  
  // Refs e Params
  const fileInputRef = useRef<HTMLInputElement>(null); // <--- Ref para o input invisível
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  // Dados do Banco
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: institutions = [], isLoading: loadingInst } = useInstitutions();

  // Estados
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    categoryId: "",
    institutionId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // <--- Estado da Foto
  const [loading, setLoading] = useState(false);

  // Handler para selecionar arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validação básica de tamanho (ex: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }
      setSelectedFile(file);
      toast.info("Foto selecionada!");
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return toast.error("Erro: Usuário não identificado.");
    if (!latParam || !lngParam) return toast.error("Localização não detectada.");
    if (!formData.title || !formData.categoryId) return toast.error("Preencha título e categoria.");

    setLoading(true);

    try {
      // 1. CRIA O REPORT PRIMEIRO
      const payload = {
        title: formData.title,
        description: formData.description,
        latitude: parseFloat(latParam),
        longitude: parseFloat(lngParam),
        addressText: formData.address || "Localização selecionada no mapa",
        categoryId: Number(formData.categoryId),
        authorId: Number(user.id),
        responsibleInstitutionId: formData.institutionId ? Number(formData.institutionId) : null
      };

      // Atenção: O create retorna o objeto criado (precisamos do ID dele)
      const newOccurrence = await occurrenceService.create(payload);
      console.log("Report criado, ID:", newOccurrence.id);

      // 2. SE TIVER FOTO, FAZ O UPLOAD VINCULANDO AO ID DO REPORT
      if (selectedFile && newOccurrence.id) {
        try {
            await attachmentService.upload(selectedFile, newOccurrence.id);
            toast.success("Foto enviada com sucesso!");
        } catch (uploadError) {
            console.error("Erro no upload da imagem:", uploadError);
            toast.warning("O report foi criado, mas houve erro ao enviar a foto.");
        }
      } else {
        toast.success("Report criado com sucesso!");
      }

      // 3. Atualiza caches e redireciona
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
      queryClient.invalidateQueries({ queryKey: ["institution-reports"] });

      router.push("/home");

    } catch (error) {
      console.error("Erro ao criar:", error);
      toast.error("Erro ao enviar report.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex-1 p-6 space-y-5 pb-10">
        
        {/* Input Invisível para Arquivo */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
        />

        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-2 text-sm text-blue-800">
            <MapPin size={16} />
            <span>Coordenadas: {parseFloat(latParam || "0").toFixed(4)}, {parseFloat(lngParam || "0").toFixed(4)}</span>
        </div>

        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Tipo de problema</label>
          <Select onValueChange={(val) => setFormData({...formData, categoryId: val})}>
            <SelectTrigger className="h-12 w-full rounded-xl bg-white border-0 shadow-sm text-gray-700">
              <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Instituição (Opcional)</label>
          <Select onValueChange={(val) => setFormData({...formData, institutionId: val})}>
            <SelectTrigger className="h-12 w-full rounded-xl bg-white border-0 shadow-sm text-gray-700">
              <SelectValue placeholder="Selecione quem resolve" />
            </SelectTrigger>
            <SelectContent>
              {institutions.map((inst) => <SelectItem key={inst.id} value={String(inst.id)}>{inst.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Título</label>
          <Input 
            className="h-12 rounded-xl bg-white border-0 shadow-sm"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Endereço (Ref)</label>
          <Input 
            className="h-12 rounded-xl bg-white border-0 shadow-sm"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Descrição</label>
          <Textarea 
            className="min-h-[100px] rounded-xl bg-white border-0 shadow-sm resize-none p-4 text-base"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* FOTOS - IMPLEMENTADO */}
        <div className="space-y-2">
          <label className="text-brand-dark font-bold text-lg">Foto da Ocorrência</label>
          
          <div className="flex gap-4 items-center">
            {/* Botão Câmera / Galeria */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                className={`h-16 w-16 rounded-xl shadow-sm flex items-center justify-center border-2 transition-all ${selectedFile ? 'bg-green-50 border-green-500' : 'bg-white border-transparent'}`}
            >
               {selectedFile ? <Check className="h-8 w-8 text-green-600" /> : <Camera className="h-8 w-8 text-brand-dark" />}
            </button>

            {/* Visualização do Nome do Arquivo */}
            {selectedFile ? (
                <div className="flex-1 bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate max-w-[150px]">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="text-red-500 p-1"><X size={16} /></button>
                </div>
            ) : (
                <span className="text-sm text-gray-400 italic">Nenhuma foto selecionada</span>
            )}
          </div>
        </div>

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
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/home">
          <ArrowLeft className="h-6 w-6 text-white cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold text-white">Criar report</h1>
      </header>
      <Suspense fallback={<div className="p-10 text-center">Carregando formulário...</div>}>
         <NewReportForm />
      </Suspense>
    </main>
  );
}