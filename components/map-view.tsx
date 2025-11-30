"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowRight } from "lucide-react";

// Configuração dos ícones (Mantenha isso para evitar bugs do Next.js)
const iconDefault = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Ícone vermelho para quando o usuário seleciona um ponto para criar report
const iconNew = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- MOCK DE DADOS (Ocorrências existentes) ---
const mockReports = [
  { id: 1, lat: -8.047562, lng: -34.877014, title: "Buraco na Via" },
  { id: 2, lat: -8.050000, lng: -34.880000, title: "Lixo Acumulado" },
  { id: 3, lat: -8.045000, lng: -34.875000, title: "Poste Apagado" },
];

// --- SUB-COMPONENTE PARA DETECTAR CLIQUES ---
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView() {
  const router = useRouter();
  
  // Estado para armazenar onde o usuário clicou para criar um novo report
  const [newReportLocation, setNewReportLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleCreateReport = () => {
    if (newReportLocation) {
      // Redireciona para a tela de novo report passando as coordenadas na URL
      router.push(`/novo-report?lat=${newReportLocation.lat}&lng=${newReportLocation.lng}`);
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-brand-dark/10 shadow-lg relative z-0">
      <MapContainer 
        center={[-8.047562, -34.877014]} 
        zoom={15} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Detector de Cliques */}
        <ClickHandler onMapClick={(lat, lng) => setNewReportLocation({ lat, lng })} />

        {/* 1. Renderiza os Reports Existentes (Mock) */}
        {mockReports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]} 
            icon={iconDefault}
            eventHandlers={{
              click: () => router.push(`/report/${report.id}`), // Clicar no pino existente leva aos detalhes

            }}
          />
        ))}

        {/* 2. Renderiza o "Novo Ponto" se o usuário clicou no mapa */}
        {newReportLocation && (
          <Marker position={[newReportLocation.lat, newReportLocation.lng]} icon={iconNew}>
            <Popup offset={[0, -30]} minWidth={200} closeButton={false} autoPan={true}>
              <div className="flex flex-col gap-2 p-1 text-center font-sans">
                <span className="font-bold text-brand-dark text-sm">Novo local selecionado</span>
                <span className="text-xs text-gray-500">
                  {newReportLocation.lat.toFixed(4)}, {newReportLocation.lng.toFixed(4)}
                </span>
                
                {/* Botão dentro do Popup */}
                <button 
                  onClick={handleCreateReport}
                  className="mt-2 bg-[#1abeb3] text-white px-3 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1"
                >
                  Criar Report Aqui <ArrowRight size={14} />
                </button>
              </div>
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
}