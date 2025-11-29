import Image from "next/image";

export default function SplashScreen() {
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