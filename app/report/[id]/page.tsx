"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"; // <--- Adicione useRouter
import { ArrowLeft, Loader2, MapPin, Calendar, AlertCircle, Send, MessageSquare, Briefcase, CheckCircle, PlayCircle, Trash2 } from "lucide-react"; // <--- Adicione Trash2
import { useOccurrenceDetails } from "@/hooks/use-occurrence-details";
import { useComments } from "@/hooks/use-comments";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { occurrenceService } from "@/services/occurrence";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils"; // <--- Se você criou o helper, use aqui. Se não, use a lógica manual abaixo.
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Helper de Status
const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Em Aberto", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  IN_PROGRESS: { label: "Em Análise", color: "bg-blue-100 text-blue-800 border-blue-200" },
  RESOLVED: { label: "Resolvido", color: "bg-green-100 text-green-800 border-green-200" },
};

// Helper de Cores do Card
const cardStatusMap: Record<string, string> = {
  OPEN: "bg-amber-500",
  IN_PROGRESS: "bg-blue-500",
  RESOLVED: "bg-green-500",
};

export default function ReportDetailsPage() {
  const router = useRouter(); // <--- Inicializa o Router
  const params = useParams();
  const idString = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(idString);

  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // 1. Dados do Report
  const { data, isLoading, isError } = useOccurrenceDetails(id);
  
  // 2. Comentários
  const { data: comments = [], createComment } = useComments(id);
  const [newComment, setNewComment] = useState("");

  // 3. Mutation para trocar status (Gestor)
  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => occurrenceService.updateStatus(id, newStatus),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["occurrence", id] });
        queryClient.invalidateQueries({ queryKey: ["institution-reports"] });
        toast.success("Status atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar status.")
  });

  // 4. Mutation para EXCLUIR (Novo)
  const deleteMutation = useMutation({
    mutationFn: () => occurrenceService.delete(id),
    onSuccess: () => {
        // Limpa caches
        queryClient.invalidateQueries({ queryKey: ["occurrences"] });
        queryClient.invalidateQueries({ queryKey: ["my-reports"] });
        toast.success("Ocorrência excluída.");
        router.push("/home"); // Volta pra casa
    },
    onError: () => toast.error("Erro ao excluir ocorrência.")
  });

  // Lógica de Identificação
  const isManager = user?.profileType === "MANAGER";
  const isResponsible = isManager && data?.responsibleInstitutionId && (Number(user?.institutionId) === Number(data.responsibleInstitutionId));
  
  // VERIFICA SE É O AUTOR (Para mostrar o botão de deletar)
  const isAuthor = user?.id && data?.authorId && (Number(user.id) === Number(data.authorId));

  const handleSendComment = async () => {
    if (!newComment.trim() || !user?.id) return;
    try {
        await createComment.mutateAsync({ text: newComment, userId: user.id });
        setNewComment("");
    } catch (error) { console.error(error); toast.error("Erro ao enviar."); }
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja apagar este report? Essa ação não pode ser desfeita.")) {
        deleteMutation.mutate();
    }
  }

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;
  if (isError || !data) return <div>Erro ao carregar report.</div>;

  // URL da Imagem (Use o seu helper ou a lógica manual)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://alerta-urbano-back.onrender.com";
  const displayImage = data.photoUrl ? (data.photoUrl.startsWith('http') ? data.photoUrl : `${API_BASE_URL}${data.photoUrl}`) : "/um-report-fallback.png";
  
  const statusInfo = statusMap[data.currentStatus] || statusMap.OPEN;
  const cardColorClass = cardStatusMap[data.currentStatus] || "bg-[#1abeb3]";

  return (
    <main className="min-h-screen w-full bg-splash-bg flex flex-col pb-8">
      
      <header className="w-full bg-brand-dark p-6 flex items-center gap-4 shadow-md sticky top-0 z-10">
        <Link href="/home"><ArrowLeft className="h-6 w-6 text-white cursor-pointer" /></Link>
        <h1 className="text-xl font-bold text-white">Report #{data.id}</h1>
        
      </header>
      
      <div className="flex-1 p-6 flex flex-col gap-6">

        {/* Chips */}
        <div className="flex gap-2 flex-wrap">
             <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusInfo.color}`}>{statusInfo.label}</span>
             <span className="px-3 py-1 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200">{data.categoryName}</span>
        </div>

        <hr className="border-gray-400/30 w-full" />

        {/* Título e Data */}
        <div>
            <h2 className="text-2xl font-extrabold text-brand-dark leading-tight">{data.title}</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Calendar size={14} />
                <span>{new Date(data.createdAt).toLocaleDateString('pt-BR')} às {new Date(data.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        </div>

        {/* Imagem */}
        <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-sm border-2 border-white">
            <Image src={displayImage} alt="Foto" fill className="object-fill" />
        </div>

        {/* Detalhes Texto */}
        <div className="space-y-4 text-brand-dark bg-white/50 p-4 rounded-xl">
          <div className="flex gap-3">
            <MapPin className="text-gray-400 shrink-0 mt-1" />
            <div>
                <span className="font-bold block text-sm text-gray-500 uppercase">Local</span>
                <span className="font-medium">{data.addressText || "Local via Mapa"}</span>
            </div>
          </div>
          <div className="flex gap-3">
             <AlertCircle className="text-gray-400 shrink-0 mt-1" />
             <div>
                <span className="font-bold block text-sm text-gray-500 uppercase">Descrição</span>
                <p className="text-gray-800">{data.description || "Sem descrição."}</p>
             </div>
          </div>
        </div>

        {/* --- CARD DE STATUS --- */}
        <div className={`w-full rounded-2xl p-6 shadow-md text-white space-y-3 ${cardColorClass}`}>
          <h2 className="font-bold text-lg">Situação: {statusInfo.label}</h2>
          <p className="leading-tight text-sm opacity-90">
             Reportado por <strong>{data.authorName}</strong>. 
             {data.responsibleInstitutionName && <span> Responsável: <strong>{data.responsibleInstitutionName}</strong>.</span>}
          </p>
        </div>

        {/* --- PAINEL DO GESTOR --- */}
        {isResponsible && (
            <div className="bg-white border-2 border-brand-dark/10 p-4 rounded-2xl shadow-sm space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 text-brand-dark font-bold border-b border-gray-100 pb-2">
                    <Briefcase size={20} /> <span>Painel do Gestor</span>
                </div>
                <p className="text-sm text-gray-500">Você é responsável por esta ocorrência.</p>
                <div className="grid grid-cols-1 gap-3">
                    {data.currentStatus === "OPEN" && (
                        <Button onClick={() => statusMutation.mutate("IN_PROGRESS")} disabled={statusMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl">
                            {statusMutation.isPending ? <Loader2 className="animate-spin" /> : <><PlayCircle className="mr-2" /> Iniciar Atendimento</>}
                        </Button>
                    )}
                    {data.currentStatus === "IN_PROGRESS" && (
                        <Button onClick={() => statusMutation.mutate("RESOLVED")} disabled={statusMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl">
                             {statusMutation.isPending ? <Loader2 className="animate-spin" /> : <><CheckCircle className="mr-2" /> Finalizar Ocorrência</>}
                        </Button>
                    )}
                    {data.currentStatus === "RESOLVED" && (
                        <div className="text-center text-green-600 font-bold py-2 bg-green-50 rounded-lg">✅ Esta ocorrência já foi finalizada.</div>
                    )}
                </div>
            </div>
        )}

        {/* --- COMENTÁRIOS --- */}
        <div className="mt-2">
            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                <MessageSquare size={20} /> Comentários ({comments.length})
            </h3>
            <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6"><AvatarImage src={`https://ui-avatars.com/api/?name=${comment.userName}`} /><AvatarFallback>U</AvatarFallback></Avatar>
                                <span className="font-bold text-sm text-brand-dark">{comment.userName}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{new Date(comment.postedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <Textarea placeholder="Escreva uma atualização..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="mb-3 bg-gray-50 border-0 resize-none" />
                <Button onClick={handleSendComment} disabled={createComment.isPending || !newComment.trim()} className="w-full bg-brand-dark rounded-full font-bold">
                    Enviar <Send size={16} className="ml-2" />
                </Button>
            </div>
        </div>

        {/* --- BOTÃO EXCLUIR COM SHADCN ALERT --- */}
        {isAuthor && (
            <div className="mt-6 pt-6 border-t border-gray-200/50">
                <AlertDialog>
                    {/* O Gatilho (Botão Vermelho) */}
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <><Trash2 className="mr-2 h-4 w-4" /> Excluir meu report</>}
                        </Button>
                    </AlertDialogTrigger>

                    {/* O Modal de Confirmação */}
                    <AlertDialogContent className="w-[90%] rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente seu report, as fotos e os comentários associados.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => deleteMutation.mutate()} 
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                            >
                                Sim, excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )}

      </div>
    </main>
  );
}