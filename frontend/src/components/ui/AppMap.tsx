import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ExternalLink, Navigation } from "lucide-react";
import {
  MAP_TILE_ATTRIBUTION_URL,
  MAP_TILE_MAX_NATIVE_ZOOM,
  MAP_TILE_URL,
} from "@/lib/mapTiles";

interface AppMapProps {
  /** Latitud (rango: -90 a 90) */
  lat: number;
  /** Longitud (rango: -180 a 180) */
  lng: number;
  /** Nivel de zoom (default: 15 = vista de calle) */
  zoom?: number;
  /** Altura del mapa (default: 300px) */
  height?: string;
  /** Ancho del mapa (default: 100%) */
  width?: string;
  /** Label del marcador (mostrado en popup) */
  label?: string;
}

/**
 * Fix para iconos de Leaflet en producción
 * 
 * Leaflet requiere URLs absolutas para iconos (marker-icon.png).
 * Usamos unpkg CDN para evitar problemas de bundling con Vite.
 * 
 * @see https://github.com/PaulLeCam/react-leaflet/issues/808
 */
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function AppMap({
  lat,
  lng,
  zoom = 15,
  height = "300px",
  width = "100%",
  label = "Ubicación",
}: AppMapProps) {
  const handleOpenMaps = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const appleMapsUrl = `maps://maps.apple.com/?q=${lat},${lng}`;
      window.location.href = appleMapsUrl;
    } else {
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm relative">
      {/* Botón "Ver en mapas" - Visible en todas las pantallas */}
      <button
        type="button"
        onClick={handleOpenMaps}
        className="absolute top-4 right-4 z-20 bg-card hover:bg-muted text-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors border border-border"
        aria-label="Abrir ubicación en mapas"
      >
        <Navigation className="h-4 w-4" />
        <span className="hidden sm:inline">Ver en mapas</span>
        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
      </button>

      {/* Mapa estático (solo visualización) */}
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height, width }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        className="z-0 map-warm"
        attributionControl={false}
      >
        <TileLayer
          url={MAP_TILE_URL}
          maxNativeZoom={MAP_TILE_MAX_NATIVE_ZOOM}
          maxZoom={MAP_TILE_MAX_NATIVE_ZOOM}
        />

        <Marker position={[lat, lng]} icon={defaultIcon}>
          <Popup>
            <span className="font-medium">{label}</span>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Attribution footer (OWASP compliance - mantener créditos OSM) */}
      <div className="absolute bottom-0 right-0 z-10 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs text-muted-foreground">
        © <a href={MAP_TILE_ATTRIBUTION_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
      </div>
    </div>
  );
}
