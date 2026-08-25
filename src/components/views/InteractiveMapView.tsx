import React, { useState, useMemo } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Info, 
  Compass, 
  Eye, 
  CheckCircle2, 
  School, 
  Cross, 
  Landmark, 
  Store, 
  Sprout, 
  ChevronRight,
  Maximize2,
  Copy,
  Check,
  Globe,
  Satellite,
  Mountain,
  Share2,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MapLocation, MapLocationCategory } from '../../types';
import { SmartImage } from '../common/SmartImage';
import { LeafletVillageMap, BaseMapType } from '../map/LeafletVillageMap';
import { HAMLET_BOUNDARIES } from '../../data/research/mapLocations';

interface InteractiveMapViewProps {
  onOpenSource: (sourceId: string) => void;
}

const CATEGORIES: ('Semua' | MapLocationCategory)[] = [
  'Semua',
  'Kantor Desa',
  'Dusun',
  'Tempat Ibadah',
  'Sekolah',
  'Kesehatan',
  'Pertanian',
  'UMKM',
  'Fasilitas Umum',
  'Potensi Desa',
  'Lainnya',
];

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({ onOpenSource }) => {
  const { mapLocations, villageBoundary } = useVillageData();

  const [selectedCategory, setSelectedCategory] = useState<'Semua' | MapLocationCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState<string | null>(mapLocations[0]?.id || null);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showHamletPolygons, setShowHamletPolygons] = useState(true);
  const [baseMap, setBaseMap] = useState<BaseMapType>('street');
  const [copiedCoords, setCopiedCoords] = useState<string | null>(null);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return mapLocations.filter(loc => {
      if (loc.status !== 'ACTIVE') return false;
      const matchCat = selectedCategory === 'Semua' || loc.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [mapLocations, selectedCategory, searchQuery]);

  const activeLocation = useMemo(() => {
    return mapLocations.find(l => l.id === activeLocationId) || filteredLocations[0] || mapLocations[0];
  }, [mapLocations, activeLocationId, filteredLocations]);

  const handleCopyCoords = (lat: number, lng: number, id: string) => {
    const text = `${lat}, ${lng}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(id);
    setTimeout(() => setCopiedCoords(null), 2000);
  };

  const handleSelectLocation = (loc: MapLocation) => {
    setActiveLocationId(loc.id);
  };

  const handleFlyToHamlet = (hamletName: string) => {
    const matched = mapLocations.find(l => 
      l.category === 'Dusun' && l.name.toLowerCase().includes(hamletName.toLowerCase())
    );
    if (matched) {
      setActiveLocationId(matched.id);
    }
  };

  const getCategoryIcon = (cat: MapLocationCategory) => {
    switch (cat) {
      case 'Kantor Desa': return <Landmark className="w-4 h-4" />;
      case 'Dusun': return <Compass className="w-4 h-4" />;
      case 'Sekolah': return <School className="w-4 h-4" />;
      case 'Kesehatan': return <Cross className="w-4 h-4" />;
      case 'Tempat Ibadah': return <Landmark className="w-4 h-4" />;
      case 'UMKM': return <Store className="w-4 h-4" />;
      case 'Pertanian': return <Sprout className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              WebGIS Desa Brabo
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Kec. Tanggungharjo, Kab. Grobogan
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Peta Geospasial & Wilayah Desa Brabo
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            Eksplorasi persebaran titik fasilitas pemerintahan, kompleks pondok pesantren, sekolah, pos kesehatan, wilayah 3 dusun, dan batas administrasi resmi berbasis peta interaktif satelit & jalan.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Basemap Switcher, Layer Toggles, Dusun Shortcuts */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        {/* Row 1: Search & Basemap Switcher & Dusun Shortcuts */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari fasilitas, pesantren, sekolah, kantor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>

          {/* Basemap Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start lg:self-center">
            <button
              onClick={() => setBaseMap('street')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                baseMap === 'street'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Peta Jalan</span>
            </button>

            <button
              onClick={() => setBaseMap('satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                baseMap === 'satellite'
                  ? 'bg-slate-900 text-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
              <span>Satelit HD</span>
            </button>

            <button
              onClick={() => setBaseMap('terrain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                baseMap === 'terrain'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-700" />
              <span>Topografi</span>
            </button>
          </div>

          {/* Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowHamletPolygons(!showHamletPolygons)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                showHamletPolygons
                  ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Poligon 3 Dusun: {showHamletPolygons ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowBoundary(!showBoundary)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                showBoundary
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Batas Luar Desa: {showBoundary ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Row 2: Dusun Shortcuts Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              Fokus Dusun:
            </span>
            <button
              onClick={() => handleFlyToHamlet('Krajan')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
            >
              🏛️ Dusun II Krajan (Pusat)
            </button>
            <button
              onClick={() => handleFlyToHamlet('Dukoh')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            >
              🌳 Dusun I Dukoh (Barat)
            </button>
            <button
              onClick={() => handleFlyToHamlet('Cangkring')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
            >
              🌾 Dusun III Cangkring (Selatan)
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {filteredLocations.length} Titik Lokasi
          </span>
        </div>

        {/* Row 3: Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Interactive Location Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Real Leaflet Map Container */}
        <div className="lg:col-span-8 space-y-4">
          <LeafletVillageMap
            locations={filteredLocations}
            boundary={villageBoundary}
            activeLocation={activeLocation}
            onSelectLocation={handleSelectLocation}
            showBoundary={showBoundary}
            showHamletPolygons={showHamletPolygons}
            baseMap={baseMap}
            onOpenSource={onOpenSource}
          />

          {/* Quick Info Bar below map */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Data spasial resmi berkoordinat: <strong>-7.0673° S, 110.6358° E</strong> (Kec. Tanggungharjo, Grobogan).
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Peta interaktif Leaflet + Esri HD</span>
            </div>
          </div>
        </div>

        {/* Right: Active Location Detail & Complete Directory */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Location Detail Card */}
          {activeLocation ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              {activeLocation.photoUrl && (
                <div className="w-full h-44 rounded-2xl overflow-hidden relative group bg-slate-100 shadow-2xs">
                  <SmartImage
                    src={activeLocation.photoUrl}
                    alt={activeLocation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={220}
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20">
                      {activeLocation.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    {activeLocation.category}
                  </span>
                  <VerificationBadge status={activeLocation.verificationStatus} sourceId={activeLocation.sourceId} onOpenSource={onOpenSource} />
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {activeLocation.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeLocation.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{activeLocation.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-mono text-[11px] text-slate-600">
                      {activeLocation.lat}, {activeLocation.lng}
                    </span>
                    <button
                      onClick={() => handleCopyCoords(activeLocation.lat, activeLocation.lng, activeLocation.id)}
                      className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCoords === activeLocation.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCoords === activeLocation.id ? 'Tersalin' : 'Salin Koordinat'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.lat},${activeLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 hover:from-emerald-800 hover:to-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 text-slate-500 text-xs">
              Pilih salah satu titik fasilitas pada peta untuk melihat detail.
            </div>
          )}

          {/* Locations Directory Scroll List */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Direktori Fasilitas Desa ({filteredLocations.length})
              </h4>
              <span className="text-[10px] text-slate-400">Klik untuk zoom</span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = loc.id === activeLocation?.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-emerald-700'
                      }`}>
                        {getCategoryIcon(loc.category)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 leading-snug truncate">
                          {loc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {loc.category} • {loc.address}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
