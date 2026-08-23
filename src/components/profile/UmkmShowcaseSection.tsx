import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Search, 
  Plus, 
  Sparkles, 
  Store, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  User,
  ShieldCheck,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import { VillageUmkm } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { RegisterUmkmModal } from './RegisterUmkmModal';
import { SmartImage } from '../common/SmartImage';

interface UmkmShowcaseSectionProps {
  umkmList: VillageUmkm[];
  onAddUmkm: (data: Omit<VillageUmkm, 'id' | 'submittedAt' | 'status' | 'verificationStatus'>) => void;
  onOpenSource?: (sourceId: string) => void;
}

export const UmkmShowcaseSection: React.FC<UmkmShowcaseSectionProps> = ({
  umkmList,
  onAddUmkm,
  onOpenSource,
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedHamlet, setSelectedHamlet] = useState<string>('SEMUA');
  const [activePhotoIndices, setActivePhotoIndices] = useState<{ [key: string]: number }>({});
  const [expandedUmkm, setExpandedUmkm] = useState<VillageUmkm | null>(null);

  // Filter approved or active UMKM
  const filteredUmkm = umkmList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'SEMUA' || item.category === selectedCategory;
    const matchesHamlet = selectedHamlet === 'SEMUA' || item.hamlet.includes(selectedHamlet);

    return matchesSearch && matchesCategory && matchesHamlet;
  });

  const handleNextPhoto = (e: React.MouseEvent, umkmId: string, totalPhotos: number) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [umkmId]: ((prev[umkmId] || 0) + 1) % totalPhotos,
    }));
  };

  const handlePrevPhoto = (e: React.MouseEvent, umkmId: string, totalPhotos: number) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [umkmId]: ((prev[umkmId] || 0) - 1 + totalPhotos) % totalPhotos,
    }));
  };

  const categories = [
    'SEMUA',
    'Kuliner & Olahan',
    'Busana & Perlengkapan Santri',
    'Pertanian & Hasil Bumi',
    'Jasa & Percetakan',
    'Kerajinan & Seni',
    'Toko & Kelontong',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span>Etalase Potensi Usaha & Ekonomi Warga</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Direktori UMKM & Niaga Santri Desa Brabo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dukung kemandirian ekonomi desa dengan berbelanja produk lokal warga Brabo. Setiap usaha dilengkapi minimal 4 slide dokumentasi usaha, link rute Google Maps, serta kontak WhatsApp langsung ke pemilik usaha.
            </p>
          </div>

          {/* Add UMKM Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>+ Daftarkan Usaha Anda</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama usaha, produk, pemilik..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat === 'SEMUA' ? 'Semua Kategori Usaha' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Hamlet Dropdown */}
          <div>
            <select
              value={selectedHamlet}
              onChange={e => setSelectedHamlet(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="SEMUA">Semua Wilayah Dusun</option>
              <option value="Dukoh">Dusun I Dukoh</option>
              <option value="Krajan">Dusun II Krajan</option>
              <option value="Cangkring">Dusun III Cangkring</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* UMKM Cards Grid */}
      {filteredUmkm.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Store className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Tidak ada UMKM yang sesuai dengan pencarian
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci atau pilih kategori lain, atau daftarkan usaha Anda sekarang.
          </p>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftarkan Usaha Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUmkm.map((umkm) => {
            const currentPhotoIdx = activePhotoIndices[umkm.id] || 0;
            const totalPhotos = umkm.photos?.length || 0;
            const currentPhoto = umkm.photos?.[currentPhotoIdx] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={umkm.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Photo Carousel Slider (Minimal 4 Slide) */}
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden select-none">
                  <SmartImage
                    src={currentPhoto}
                    alt={`${umkm.name} - slide ${currentPhotoIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={480}
                    height={360}
                    showHdBadge={true}
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {umkm.category}
                  </div>

                  {/* Hamlet Tag */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{umkm.hamlet}</span>
                  </div>

                  {/* Slide Navigation Arrows */}
                  {totalPhotos > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevPhoto(e, umkm.id, totalPhotos)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                        aria-label="Slide sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextPhoto(e, umkm.id, totalPhotos)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                        aria-label="Slide selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Slide Indicators Dots & Counter */}
                  <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-between px-3">
                    <span className="bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {currentPhotoIdx + 1} / {totalPhotos} Foto
                    </span>
                    <div className="flex gap-1 bg-slate-950/60 p-1 rounded-full backdrop-blur-xs">
                      {Array.from({ length: totalPhotos }).map((_, pIdx) => (
                        <div
                          key={pIdx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            pIdx === currentPhotoIdx ? 'bg-emerald-400 w-3' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Owner & Name */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-emerald-700" />
                        <span>Pemilik: <strong>{umkm.ownerName}</strong></span>
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                        {umkm.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {umkm.description}
                    </p>

                    {/* Address Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{umkm.address}</span>
                      </div>
                      {umkm.openingHours && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-emerald-700" />
                          <span>{umkm.openingHours}</span>
                        </div>
                      )}
                      {umkm.priceRange && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                          <DollarSign className="w-3 h-3 text-emerald-700" />
                          <span>{umkm.priceRange}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: WhatsApp & Maps */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${umkm.whatsapp}?text=Halo%20${encodeURIComponent(umkm.ownerName)}%2C%20saya%20tertarik%20dengan%20produk%2Fjasa%20${encodeURIComponent(umkm.name)}%20di%20portal%20Desa%20Brabo.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>

                      {/* Google Maps Button */}
                      {umkm.mapsUrl ? (
                        <a
                          href={umkm.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>Buka Maps</span>
                        </a>
                      ) : (
                        <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium flex items-center justify-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{umkm.hamlet}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedUmkm(umkm)}
                      className="w-full text-center text-[11px] text-slate-500 hover:text-emerald-800 font-semibold py-1 transition-colors flex items-center justify-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Lihat Semua {totalPhotos} Foto & Detail Usaha</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded Modal Detail View */}
      {expandedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full">
                  {expandedUmkm.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  {expandedUmkm.name}
                </h3>
                <p className="text-xs text-slate-300">
                  Pemilik: {expandedUmkm.ownerName} • {expandedUmkm.hamlet}
                </p>
              </div>
              <button
                onClick={() => setExpandedUmkm(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Content & All Photos Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>Galeri {expandedUmkm.photos.length} Slide Foto Usaha</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {expandedUmkm.photos.map((photo, pIdx) => (
                    <a
                      key={pIdx}
                      href={photo}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-2xs block"
                    >
                      <SmartImage
                        src={photo}
                        alt={`Dokumentasi ${pIdx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        width={200}
                        height={150}
                      />
                      <span className="absolute bottom-1 left-1 bg-slate-950/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        #{pIdx + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Keterangan Lengkap Usaha:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {expandedUmkm.description}
                </p>
              </div>

              {/* Contact & Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800">Alamat & Lokasi</p>
                  <p className="text-slate-600">{expandedUmkm.address}</p>
                  <p className="text-slate-500 font-medium">{expandedUmkm.hamlet}, Desa Brabo</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800">Kontak & Pemesanan</p>
                  <p className="text-slate-600">WhatsApp: <strong>+{expandedUmkm.whatsapp}</strong></p>
                  {expandedUmkm.openingHours && <p className="text-slate-600">Jam Buka: {expandedUmkm.openingHours}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                {expandedUmkm.mapsUrl && (
                  <a
                    href={expandedUmkm.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Petunjuk Rute Google Maps</span>
                  </a>
                )}
                <a
                  href={`https://wa.me/${expandedUmkm.whatsapp}?text=Halo%20${encodeURIComponent(expandedUmkm.ownerName)}%2C%20saya%20menghubungi%20dari%20portal%20Desa%20Brabo.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Register UMKM */}
      <RegisterUmkmModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmitUmkm={onAddUmkm}
      />
    </div>
  );
};
