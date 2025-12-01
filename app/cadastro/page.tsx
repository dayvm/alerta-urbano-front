"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth";
// --- ADICIONE ESTES IMPORTS ---
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        profileType: "CITIZEN" // Valor padrão
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Função específica para o Select do Shadcn
    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, profileType: value });
    };

    const handleRegister = async () => {
        setError("");
        setLoading(true);

        if (formData.senha !== formData.confirmarSenha) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: formData.nome,
                email: formData.email,
                password: formData.senha,
                profileType: formData.profileType // <--- AGORA É DINÂMICO
            };

            console.log("Cadastrando como:", payload.profileType);

            await authService.register(payload);

            alert(`Cadastro de ${payload.profileType} realizado!`);
            router.push("/login");
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data || "Erro ao realizar cadastro.";
            setError(typeof msg === 'string' ? msg : "Erro ao conectar com servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-splash-bg flex flex-col items-center justify-center p-6 sm:p-8">

            {/* 1. Logo Superior */}
            <div className="mb-6 flex flex-col items-center">
                <Image
                    src="/alerta-urbano.png"
                    alt="Alerta Urbano"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-sm mb-2"
                />
            </div>

            {/* 2. Textos de Boas-vindas */}
            <div className="text-center mb-8 space-y-1">
                <h2 className="text-xl font-bold text-brand-dark">Olá!</h2>
                <h3 className="text-lg font-bold text-brand-dark">Vamos começar?</h3>
            </div>

            {/* --- BLOCO DE ERRO --- */}
            {error && (
                <div className="mb-4 p-3 w-full max-w-sm bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            {/* 3. Formulário de Cadastro */}
            <div className="w-full max-w-sm space-y-4">

                {/* Input Nome */}
                <Input
                    name="nome" // Importante para o handleChange
                    value={formData.nome}
                    onChange={handleChange}
                    type="text"
                    placeholder="Nome"
                    className="h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20 px-6"
                />

                {/* Input E-mail */}
                <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="E-mail"
                    className="h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20 px-6"
                />

                {/* Input Senha */}
                <Input
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    type="password"
                    placeholder="Senha"
                    className="h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20 px-6"
                />

                {/* Input Confirmar Senha */}
                <Input
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirmar senha"
                    className="h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20 px-6"
                />

                {/* --- NOVO CAMPO DE SELEÇÃO DE PERFIL --- */}
                <div className="pt-2">
                    <label className="text-xs text-gray-500 ml-4 font-bold uppercase">Tipo de Perfil (Demo)</label>
                    <Select onValueChange={handleSelectChange} defaultValue="CITIZEN">
                        <SelectTrigger className="h-12 w-full rounded-full bg-white border-0 shadow-sm text-gray-700 px-6 focus:ring-brand-dark/20">
                            <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CITIZEN">Cidadão (Padrão)</SelectItem>
                            <SelectItem value="MANAGER">Gestor (Empresa/Órgão)</SelectItem>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* --------------------------------------- */}

                {/* Botão Cadastrar */}
                <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-brand-dark hover:bg-slate-800 text-white font-bold text-lg shadow-md mt-6 transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Cadastrar"}
                </Button>
            </div>

            {/* 4. Divisor "Ou cadastre-se com" */}
            <div className="relative w-full max-w-sm my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-400/50"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-splash-bg px-2 text-brand-dark font-medium">
                        Ou cadastre-se com
                    </span>
                </div>
            </div>

            {/* 5. Botões Sociais (Reutilizados para manter padrão) */}
            <div className="flex gap-4 w-full max-w-sm justify-center mb-8">
                {/* Facebook */}
                <button className="h-14 w-20 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>

                {/* Google */}
                <button className="h-14 w-20 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                </button>

                {/* Apple */}
                <button className="h-14 w-20 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 3.87-.74c1.61.15 2.67.66 3.42 1.54-3.09 1.68-2.52 6.22.48 7.78-.65 1.72-1.57 3.33-2.85 4.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                </button>
            </div>

            {/* 6. Footer Login */}
            <div className="text-center text-sm text-brand-dark">
                <p>Já tem uma conta?</p>
                <Link href="/login" className="font-bold hover:underline">
                    Faça seu login
                </Link>
            </div>

        </main>
    );
}