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
  Check
} from 'lucide-react';
import { MapLocation, MapLocationCategory } from '../../types';

interface InteractiveMapViewProps {
  onOpenSource: (sourceId: string) => void;
}

const CATEGORIES: ('Semua' | MapLocationCategory)[] = [
  'Semua',
  'Kantor Desa',
  'Dusun',
  'Sekolah',
  'Kesehatan',
  'Tempat Ibadah',
  'Fasilitas Umum',
  'Pertanian',
  'UMKM',
  'Potensi Desa',
  'Olahraga',
  'Lainnya',
];

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({ onOpenSource }) => {
  const { mapLocations, villageBoundary } = useVillageData();

  const [selectedCategory, setSelectedCategory] = useState<'Semua' | MapLocationCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState<string | null>(mapLocations[0]?.id || null);
  const [showBoundary, setShowBoundary] = useState(true);
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

  const activeLocation = mapLocations.find(l => l.id === activeLocationId) || filteredLocations[0] || mapLocations[0];

  const handleCopyCoords = (lat: number, lng: number, id: string) => {
    const text = `${lat}, ${lng}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(id);
    setTimeout(() => setCopiedCoords(null), 2000);
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

  // Center coordinate calculation for visual display
  const defaultCenter = { lat: -7.0673, lng: 110.6358 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Sistem Informasi Geospasial Desa
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Peta Digital & Wilayah Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eksplorasi persebaran titik fasilitas pemerintahan, lembaga madrasah/pesantren, pos kesehatan, kewilayahan tiga dusun, dan batas administrasi resmi Desa Brabo yang terkelola secara dinamis oleh pemerintah desa.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama lokasi, fasilitas, alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Boundary Layer Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Batas Desa (BIG):</span>
              <button
                onClick={() => setShowBoundary(!showBoundary)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  showBoundary
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {showBoundary ? 'Aktif (Ditampilkan)' : 'Sembunyi'}
              </button>
            </div>

            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              Total: {filteredLocations.length} Titik Lokasi
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Map Top Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  Radar Geospasial Desa Brabo
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Lat: {activeLocation?.lat || defaultCenter.lat}</span>
                <span>•</span>
                <span>Lng: {activeLocation?.lng || defaultCenter.lng}</span>
              </div>
            </div>

            {/* Simulated Geospatial Grid with interactive points */}
            <div className="relative my-8 py-12 flex items-center justify-center min-h-[280px]">
              {/* Boundary Polygon Outline representation */}
              {showBoundary && (
                <div className="absolute inset-4 border-2 border-dashed border-emerald-500/40 rounded-3xl bg-emerald-950/20 pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400/60 tracking-widest font-mono">
                    Polygon Batas Administrasi Desa Brabo (BIG Verified)
                  </span>
                </div>
              )}

              {/* Central Map Points Visualizer */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-2xl z-10 px-2">
                {filteredLocations.slice(0, 8).map((loc) => {
                  const isSelected = loc.id === activeLocation?.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocationId(loc.id)}
                      className={`p-3 rounded-2xl text-left transition-all backdrop-blur-sm border flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-105 ring-2 ring-emerald-300'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-700' : 'bg-slate-800 text-emerald-400'}`}>
                          {getCategoryIcon(loc.category)}
                        </span>
                        <span className="text-[9px] font-mono opacity-70">
                          {loc.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold line-clamp-2 leading-tight">
                        {loc.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map Bottom Controls & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">
                  Sumber: {villageBoundary.sourceName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeLocation?.lat || defaultCenter.lat},${activeLocation?.lng || defaultCenter.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>

          {/* Boundary Information Card */}
          {showBoundary && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  {villageBoundary.name}
                </span>
                <VerificationBadge status={villageBoundary.verificationStatus} sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
              </div>
              <p className="text-slate-600 leading-relaxed">
                Batas wilayah mengacu pada penetapan batas desa Badan Informasi Geospasial (BIG) dan Dinas Pemberdayaan Masyarakat dan Desa (Dispermasdes) Kabupaten Grobogan. Total {villageBoundary.coordinates.length} titik koordinat poligon terdata.
              </p>
            </div>
          )}
        </div>

        {/* Right Active Location Details & List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Location Detail Card */}
          {activeLocation && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              {activeLocation.photoUrl && (
                <div className="w-full h-40 rounded-2xl overflow-hidden relative group">
                  <img
                    src={activeLocation.photoUrl}
                    alt={activeLocation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                      {activeLocation.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {activeLocation.category}
                  </span>
                  <VerificationBadge status={activeLocation.verificationStatus} sourceId={activeLocation.sourceId} onOpenSource={onOpenSource} />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {activeLocation.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeLocation.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{activeLocation.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[11px] text-slate-500">
                      {activeLocation.lat}, {activeLocation.lng}
                    </span>
                    <button
                      onClick={() => handleCopyCoords(activeLocation.lat, activeLocation.lng, activeLocation.id)}
                      className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
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
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Petunjuk Arah Rute Jalan</span>
              </a>
            </div>
          )}

          {/* Locations Scroll List */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Daftar Titik Lokasi Terverifikasi ({filteredLocations.length})
            </h4>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                    loc.id === activeLocation?.id
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {loc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {loc.category} • {loc.address}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
