"use client"; // Obrigatório para usar useEffect
import Image from "next/image";
import { useRouter } from "next/navigation"; // Note que é next/navigation, não next/router
import { useEffect } from "react";

export default function SplashScreen() {
  const router = useRouter();
  
  useEffect(() => {
    // Redireciona para /login após 3 segundos (3000ms)
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    // Limpa o timer se o usuário sair da tela antes (boa prática)
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    // 'bg-splash-bg' funciona porque definimos --color-splash-bg no globals.css
    <main className="min-h-screen w-full bg-splash-bg flex items-center justify-center p-4">
      
      {/* Container da Logo */}
      <div className="relative w-48 h-auto sm:w-64 animate-in fade-in zoom-in duration-700">
        
        {/* IMPORTANTE: Certifique-se de que o arquivo 'logo-alerta-urbano.png' 
            está na pasta 'public' do seu projeto. 
        */}
        <Image
          src="/alerta-urbano.png" 
          alt="Logo Alerta Urbano"
          width={300} 
          height={300} 
          priority // Carregamento instantâneo
          className="w-full h-auto object-contain drop-shadow-sm"
        />
        
      </div>
    </main>
  );
}