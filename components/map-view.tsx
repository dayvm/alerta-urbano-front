"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { useOccurrences } from "@/hooks/use-occurrences";
import Link from "next/link"; // <--- Importante

// --- CONFIGURAÇÃO DE ÍCONES (Mantém igual) ---
const iconDefault = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconNew = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  const { data: occurrences = [], isLoading } = useOccurrences();
  const [newReportLocation, setNewReportLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleCreateReport = () => {
    if (newReportLocation) {
      router.push(`/novo-report?lat=${newReportLocation.lat}&lng=${newReportLocation.lng}`);
    }
  };

  if (isLoading) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-sm">Carregando ocorrências...</span>
        </div>
    );
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={occurrences.length > 0 ? [occurrences[0].latitude, occurrences[0].longitude] : [-8.047562, -34.877014]} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={(lat, lng) => setNewReportLocation({ lat, lng })} />

        {/* PINOS EXISTENTES */}
        {occurrences.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]} 
            icon={iconDefault}
            // REMOVI O eventHandlers={{ click... }} DAQUI PARA NÃO REDIRECIONAR DIRETO
          >
             <Popup minWidth={200}>
                <div className="text-center font-sans p-1">
                    {/* Título */}
                    <strong className="text-brand-dark block text-sm mb-1 leading-tight">
                        {report.title}
                    </strong>
                    
                    {/* Categoria */}
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-200 inline-block mb-2">
                        {report.categoryName}
                    </span>

                    {/* Botão Ver Detalhes */}
                    <Link href={`/report/${report.id}`} className="block w-full">
                        <button className="w-full bg-brand-dark text-white text-xs py-1.5 px-3 rounded-md font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            Ver Detalhes <ExternalLink size={10} />
                        </button>
                    </Link>
                </div>
             </Popup>
          </Marker>
        ))}

        {/* PINO NOVO REPORT */}
        {newReportLocation && (
          <Marker position={[newReportLocation.lat, newReportLocation.lng]} icon={iconNew}>
            <Popup offset={[0, -30]} minWidth={200} closeButton={false} autoPan={true}>
              <div className="flex flex-col gap-2 p-1 text-center font-sans">
                <span className="font-bold text-brand-dark text-sm">Novo local selecionado</span>
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