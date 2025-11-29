"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção para o ícone padrão do Leaflet que buga no Next.js
const icon = L.icon({
//   iconUrl: "/marker-icon.png", // Vamos usar um placeholder ou o padrão se o navegador resolver
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  // Usando URLs CDN direto para garantir que o ícone apareça sem configurar assets agora
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

export default function MapView() {
  // Coordenadas fictícias (Centro de Recife, baseado no seu contexto, ou genérico)
  const position: [number, number] = [-8.047562, -34.877014]; 

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-brand-dark/10 shadow-lg">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        zoomControl={false} // Removemos botões de zoom para limpar visual (igual design)
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            Você está aqui!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}