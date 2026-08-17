import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  Activity, 
  Calendar, 
  MapPin, 
  Users, 
  Filter, 
  Tag, 
  CheckCircle2, 
  Search, 
  Clock, 
  Sparkles,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ActivityItem } from '../../types';

interface ActivitiesViewProps {
  onOpenSource: (sourceId: string) => void;
}

const CATEGORIES = [
  'Semua',
  'Pemerintahan',
  'Keagamaan',
  'Sosial',
  'Posyandu',
  'Pemuda',
  'Pertanian',
  'Gotong Royong',
  'Olahraga',
];

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ onOpenSource }) => {
  const { activities } = useVillageData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState<{ title: string; images: string[]; currentIndex: number } | null>(null);

  const openLightbox = (title: string, images: string[], index = 0) => {
    setActiveGallery({ title, images, currentIndex: index });
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (!activeGallery) return;
    const nextIdx = (activeGallery.currentIndex + 1) % activeGallery.images.length;
    setActiveGallery({ ...activeGallery, currentIndex: nextIdx });
  };

  const prevImage = () => {
    if (!activeGallery) return;
    const prevIdx = (activeGallery.currentIndex - 1 + activeGallery.images.length) % activeGallery.images.length;
    setActiveGallery({ ...activeGallery, currentIndex: prevIdx });
  };

  const filteredActivities = activities.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchFrequency = selectedFrequency === 'Semua' || item.frequency === selectedFrequency;
    const matchSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.participants.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchFrequency && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Agenda & Galeri Dokumentasi Kegiatan
            </span>
            <VerificationBadge status="SUPPORTED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Kegiatan & Dokumentasi Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menghimpun kegiatan rutin, berkala, dan insidental di bidang keagamaan pesantren, pelayanan pemerintahan desa, posyandu balita & lansia, gotong royong irigasi pertanian, dan pembinaan kepemudaan yang terdokumentasi rapi.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari kegiatan, lokasi, partisipan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Frequency Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
            <span className="text-slate-500 font-semibold shrink-0">Frekuensi:</span>
            {['Semua', 'KEGIATAN RUTIN', 'KEGIATAN BERKALA', 'KEGIATAN INSIDENTAL'].map((freq) => (
              <button
                key={freq}
                onClick={() => setSelectedFrequency(freq)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                  selectedFrequency === freq
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {freq === 'Semua' ? 'Semua Frekuensi' : freq}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActivities.map((activity) => {
          const allPhotos = [
            ...(activity.imageUrl ? [activity.imageUrl] : []),
            ...(activity.coverImage && activity.coverImage !== activity.imageUrl ? [activity.coverImage] : []),
            ...(activity.galleryImages || [])
          ];

          return (
            <div
              key={activity.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Photo Header or Gallery */}
                {allPhotos.length > 0 && (
                  <div className="space-y-2">
                    <div 
                      onClick={() => openLightbox(activity.title, allPhotos, 0)}
                      className="w-full h-48 rounded-2xl overflow-hidden relative cursor-pointer group"
                    >
                      <img
                        src={allPhotos[0]}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Lihat Galeri ({allPhotos.length} Foto)
                        </span>
                      </div>
                    </div>

                    {/* Small Thumbnails strip */}
                    {allPhotos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {allPhotos.slice(0, 4).map((photoUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => openLightbox(activity.title, allPhotos, idx)}
                            className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {allPhotos.length > 4 && (
                          <button
                            onClick={() => openLightbox(activity.title, allPhotos, 4)}
                            className="w-14 h-14 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                          >
                            +{allPhotos.length - 4}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activity.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {activity.frequency}
                    </span>
                  </div>
                  <VerificationBadge status={activity.status} sourceId={activity.sourceId} onOpenSource={onOpenSource} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {activity.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-800">Jadwal:</span>
                  <span>{activity.scheduleOrDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-800">Lokasi:</span>
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-800">Partisipan:</span>
                  <span>{activity.participants}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lightbox Modal */}
      {lightboxOpen && activeGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full flex flex-col items-center space-y-4">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white text-xs px-2">
              <span className="font-bold truncate max-w-md">
                {activeGallery.title} ({activeGallery.currentIndex + 1} / {activeGallery.images.length})
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative w-full max-h-[70vh] flex items-center justify-center">
              <img
                src={activeGallery.images[activeGallery.currentIndex]}
                alt=""
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />

              {activeGallery.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all backdrop-blur-xs"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all backdrop-blur-xs"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails */}
            {activeGallery.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-full p-2">
                {activeGallery.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGallery({ ...activeGallery, currentIndex: idx })}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === activeGallery.currentIndex ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
