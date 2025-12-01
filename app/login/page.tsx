"use client";
import { useState } from "react"; // <--- ADICIONADO
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react"; // <--- ADICIONADO Loader2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth"; // <--- ADICIONADO
import { useAuthStore } from "@/store/auth-store"; // <--- ADICIONADO

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login); // Pega a ação da Store

    // --- ADICIONE ISTO PARA TESTE ---
    console.log("🔍 URL da API no Vercel:", process.env.NEXT_PUBLIC_API_URL);
    // -------------------------------

    // Estados locais
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            // Chama o serviço (Axios)
            const data = await authService.login({ email, password }); // (ou 'senha', confira seu DTO)

            // Salva no Zustand (Estado Global)
            login(data.token, data.usuario); // (ou 'data.user', confira o retorno da API)

            // Redireciona
            router.push("/home");
        } catch (err: any) {
            console.error(err);
            // Tratamento de erro simples
            setError("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-splash-bg flex flex-col items-center justify-center p-6 sm:p-8">

            {/* 1. Logo Superior */}
            <div className="mb-8 flex flex-col items-center">
                <Image
                    src="/alerta-urbano.png"
                    alt="Alerta Urbano"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-sm mb-2"
                />
                {/* O texto do logo já está na imagem, mas se precisar de reforço visual: */}
                {/* <h1 className="text-2xl font-bold text-brand-dark">Alerta Urbano</h1> */}
            </div>

            {/* 2. Textos de Boas-vindas */}
            <div className="text-center mb-8 space-y-1">
                <h2 className="text-xl font-bold text-brand-dark">Bem-vindo de volta!</h2>
                <h3 className="text-lg font-medium text-brand-dark/80">Faça seu login</h3>
            </div>

            {/* 3. Formulário */}
            <div className="w-full max-w-sm space-y-4">

                {/* Input E-mail */}
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
                    <Input
                        type="email"
                        placeholder="Digite seu E-mail"
                        value={email} // <--- ADICIONADO
                        onChange={(e) => setEmail(e.target.value)} // <--- ADICIONADO
                        className="pl-12 h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20"
                    />
                </div>

                {/* Input Senha */}
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
                    <Input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password} // <--- ADICIONADO
                        onChange={(e) => setPassword(e.target.value)} // <--- ADICIONADO
                        className="pl-12 h-12 rounded-full bg-white border-0 shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-brand-dark/20"
                    />
                </div>

                {/* Link Esqueceu a Senha */}
                <div className="flex justify-end">
                    <Link
                        href="#"
                        className="text-sm font-medium text-brand-dark hover:underline"
                    >
                        Esqueceu a senha?
                    </Link>
                </div>

                {/* Botão Entrar */}
                <Button
                    onClick={handleLogin}
                    disabled={loading} // <--- ADICIONADO
                    className="w-full h-12 rounded-full bg-brand-dark hover:bg-slate-800 text-white font-bold text-lg shadow-md mt-4 transition-all active:scale-95"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                        </>
                    ) : (
                        "Entrar"
                    )}
                </Button>
            </div>

            {/* 4. Divisor "Ou entre com" */}
            <div className="relative w-full max-w-sm my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-400/50"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-splash-bg px-2 text-brand-dark font-medium">
                        Ou entre com
                    </span>
                </div>
            </div>

            {/* 5. Botões Sociais */}
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

            {/* 6. Footer Cadastro */}
            <div className="text-center text-sm text-brand-dark">
                <p>Ainda não tem uma conta?</p>
                <Link href="/cadastro" className="font-bold hover:underline">
                    Faça seu cadastro
                </Link>
            </div>

        </main>
    );
}