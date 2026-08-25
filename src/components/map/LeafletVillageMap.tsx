import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapLocation, VillageBoundary, MapLocationCategory } from '../../types';
import { HAMLET_BOUNDARIES, HamletBoundary } from '../../data/research/mapLocations';
import { 
  Compass, 
  Locate, 
  Layers
} from 'lucide-react';

export type BaseMapType = 'street' | 'satellite' | 'terrain';

interface LeafletVillageMapProps {
  locations: MapLocation[];
  boundary: VillageBoundary;
  activeLocation: MapLocation | null;
  onSelectLocation: (location: MapLocation) => void;
  showBoundary: boolean;
  showHamletPolygons: boolean;
  baseMap: BaseMapType;
  onOpenSource: (sourceId: string) => void;
}

// Category Icons SVG
const getCategorySvg = (category: MapLocationCategory) => {
  switch (category) {
    case 'Kantor Desa':
      return {
        bg: '#047857',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`
      };
    case 'Dusun':
      return {
        bg: '#4f46e5',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
      };
    case 'Tempat Ibadah':
      return {
        bg: '#0f766e',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`
      };
    case 'Sekolah':
      return {
        bg: '#2563eb',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>`
      };
    case 'Kesehatan':
      return {
        bg: '#e11d48',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`
      };
    case 'Pertanian':
      return {
        bg: '#16a34a',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`
      };
    case 'UMKM':
      return {
        bg: '#d97706',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`
      };
    default:
      return {
        bg: '#059669',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
      };
  }
};

const createMarkerIcon = (category: MapLocationCategory, isSelected: boolean) => {
  const { bg, svg } = getCategorySvg(category);
  const size = isSelected ? 42 : 34;
  const pulseHtml = isSelected 
    ? `<span class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${bg};"></span>`
    : '';

  return L.divIcon({
    className: 'custom-village-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-110' : 'hover:scale-105'}">
        ${pulseHtml}
        <div style="background-color: ${bg}; width: ${size}px; height: ${size}px;" class="relative z-10 rounded-2xl flex items-center justify-center text-white shadow-md border-2 border-white ring-2 ${isSelected ? 'ring-emerald-400 ring-offset-2' : 'ring-black/10'}">
          ${svg}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${bg};"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size + 4],
    popupAnchor: [0, -size - 4]
  });
};

export const LeafletVillageMap: React.FC<LeafletVillageMapProps> = ({
  locations,
  boundary,
  activeLocation,
  onSelectLocation,
  showBoundary,
  showHamletPolygons,
  baseMap,
  onOpenSource
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.Polygon | null>(null);
  const hamletsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const defaultCenter: [number, number] = [-7.090589, 110.577245];
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true
    });

    mapRef.current = map;

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setLiveCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5))
      });
    });

    // Create Layer Groups
    hamletsLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer when baseMap changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    let maxZoom = 19;

    if (baseMap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community';
      maxZoom = 19;
    } else if (baseMap === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap';
      maxZoom = 17;
    }

    const newTileLayer = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [baseMap]);

  // Update Village Boundary Polygon
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (showBoundary && boundary.coordinates.length > 0) {
      // Outer polygon with red-white dashed border matching official GIS map
      const polygon = L.polygon(boundary.coordinates as [number, number][], {
        color: '#dc2626', // Red border line
        weight: 3.5,
        dashArray: '8, 6',
        fillColor: '#ef4444',
        fillOpacity: baseMap === 'satellite' ? 0.12 : 0.06,
      }).addTo(map);

      polygon.bindTooltip(
        '<div class="text-xs font-bold text-slate-900 p-1">🏛️ Batas Wilayah Administrasi Desa Brabo (BIG & Citra Satelit)</div>',
        { sticky: true }
      );

      boundaryLayerRef.current = polygon;
    }
  }, [showBoundary, boundary, baseMap]);

  // Update Hamlet Polygons
  useEffect(() => {
    const group = hamletsLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    if (showHamletPolygons) {
      HAMLET_BOUNDARIES.forEach((hamlet) => {
        const polygon = L.polygon(hamlet.coordinates, {
          color: hamlet.color,
          weight: 2,
          fillColor: hamlet.fillColor,
          fillOpacity: baseMap === 'satellite' ? 0.22 : 0.14,
        });

        polygon.bindTooltip(
          `<div class="p-1 space-y-0.5"><p class="text-xs font-extrabold text-slate-900">${hamlet.name}</p><p class="text-[10px] text-slate-500 font-medium">Klik untuk jelajahi titik fasilitas dusun</p></div>`,
          { sticky: true }
        );

        polygon.on('click', () => {
          const hamletLoc = locations.find(l => l.name.toLowerCase().includes(hamlet.name.toLowerCase().split(' ')[1]));
          if (hamletLoc) {
            onSelectLocation(hamletLoc);
          }
        });

        group.addLayer(polygon);
      });
    }
  }, [showHamletPolygons, baseMap, locations, onSelectLocation]);

  // Update Markers
  useEffect(() => {
    const group = markersLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    locations.forEach((loc) => {
      const isSelected = activeLocation?.id === loc.id;
      const icon = createMarkerIcon(loc.category, isSelected);

      const marker = L.marker([loc.lat, loc.lng], { icon });

      // Build popup HTML
      const photoHtml = loc.photoUrl 
        ? `<div class="w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-100"><img src="${loc.photoUrl}" alt="${loc.name}" class="w-full h-full object-cover" /></div>` 
        : '';

      const popupHtml = `
        <div class="p-1 space-y-2 text-slate-800 font-sans" style="min-width: 220px; max-width: 280px;">
          ${photoHtml}
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md inline-block mb-1">
              ${loc.category}
            </span>
            <h4 class="text-sm font-extrabold text-slate-900 leading-snug">
              ${loc.name}
            </h4>
            <p class="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              ${loc.description}
            </p>
            <p class="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              📍 <span class="truncate">${loc.address}</span>
            </p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="text-[10px] font-mono text-slate-400">${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] font-bold inline-flex items-center gap-1 text-decoration-none">
              🧭 Rute Google Maps
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      group.addLayer(marker);
    });
  }, [locations, activeLocation, onSelectLocation]);

  // FlyTo on activeLocation change
  useEffect(() => {
    const map = mapRef.current;
    if (map && activeLocation) {
      map.flyTo([activeLocation.lat, activeLocation.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [activeLocation]);

  const handleResetCenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(defaultCenter, 15, { duration: 1.2 });
    }
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { duration: 1.5 });
        },
        () => {
          alert('Tidak dapat mendeteksi lokasi GPS Anda. Pastikan izin lokasi diaktifkan.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[560px] rounded-3xl overflow-hidden shadow-inner border border-slate-800 bg-slate-950">
      {/* Map DOM Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[500px] sm:min-h-[560px] z-0"
      />

      {/* Live Coordinate Tracker */}
      {liveCoords && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] font-mono text-emerald-400 pointer-events-none flex items-center gap-2 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Lat: {liveCoords.lat}</span>
          <span>•</span>
          <span>Lng: {liveCoords.lng}</span>
        </div>
      )}

      {/* Floating Action Controls on Top Right */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleResetCenter}
          title="Pusatkan ke Desa Brabo"
          className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 shadow-md border border-slate-200/90 backdrop-blur-md transition-all cursor-pointer group"
        >
          <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </button>

        <button
          onClick={handleLocateMe}
          title="Lokasi GPS Saya"
          className="p-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 hover:text-blue-700 shadow-md border border-slate-200/90 backdrop-blur-md transition-all cursor-pointer"
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
