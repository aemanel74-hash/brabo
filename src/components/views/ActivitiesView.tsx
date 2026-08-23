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
  Upload,
  Camera,
  Layers,
  Heart,
  User,
  Zap,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { ActivityItem, CitizenActivityPhoto } from '../../types';
import { compressImage, formatBytes, CompressionResult } from '../../utils/imageCompression';
import { isSupabaseConfigured, uploadBase64ToSupabaseStorage, SUPABASE_BUCKETS } from '../../lib/supabase';
import { SmartImage } from '../common/SmartImage';

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

type MainTab = 'agenda' | 'citizen_photos';

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ onOpenSource }) => {
  const { activities, citizenPhotos, addCitizenPhoto } = useVillageData();
  const [mainTab, setMainTab] = useState<MainTab>('agenda');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    uploaderName: '',
    uploaderHamlet: 'Dusun Krajan',
    uploaderPhone: '',
    activityTitle: '',
    category: 'Gotong Royong' as ActivityItem['category'],
    caption: '',
    takenDate: new Date().toISOString().split('T')[0],
  });

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState<{ 
    title: string; 
    images: string[]; 
    currentIndex: number;
    meta?: { uploader?: string; date?: string; category?: string };
  } | null>(null);

  const openLightbox = (
    title: string, 
    images: string[], 
    index = 0, 
    meta?: { uploader?: string; date?: string; category?: string }
  ) => {
    setActiveGallery({ title, images, currentIndex: index, meta });
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

  // Image Upload Handler with Automatic Compression
  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Auto compress image to WebP with max dimension 1280px & quality 0.8
      const result = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.8,
        format: 'image/webp',
      });
      setCompressionResult(result);
    } catch (err) {
      console.error('Compression failed:', err);
      alert('Gagal memproses gambar. Pastikan file berupa format gambar yang valid (JPG, PNG, WebP).');
    } finally {
      setIsCompressing(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compressionResult) {
      alert('Silakan pilih foto kegiatan terlebih dahulu.');
      return;
    }
    if (!formData.uploaderName.trim() || !formData.activityTitle.trim()) {
      alert('Mohon lengkapi Nama Anda dan Judul Kegiatan.');
      return;
    }

    setIsSubmitting(true);
    let finalPhotoUrl = compressionResult.dataUrl;

    // Check if Supabase Storage is configured
    if (isSupabaseConfigured()) {
      const uploadRes = await uploadBase64ToSupabaseStorage(
        compressionResult.dataUrl,
        SUPABASE_BUCKETS.CITIZEN_PHOTOS,
        `citizen_${formData.uploaderName.toLowerCase().replace(/\s+/g, '_')}.webp`
      );
      if (uploadRes.success && uploadRes.url) {
        finalPhotoUrl = uploadRes.url;
      }
    }

    addCitizenPhoto({
      activityTitle: formData.activityTitle,
      category: formData.category,
      uploaderName: formData.uploaderName,
      uploaderHamlet: formData.uploaderHamlet,
      uploaderPhone: formData.uploaderPhone,
      photoUrl: finalPhotoUrl,
      caption: formData.caption,
      takenDate: formData.takenDate,
      fileSizeKb: Math.round(compressionResult.compressedSize / 1024),
      status: 'APPROVED', // Langsung tampil di galeri
    });

    setIsSubmitting(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setCompressionResult(null);
      setFormData({
        uploaderName: '',
        uploaderHamlet: 'Dusun Krajan',
        uploaderPhone: '',
        activityTitle: '',
        category: 'Gotong Royong',
        caption: '',
        takenDate: new Date().toISOString().split('T')[0],
      });
      setMainTab('citizen_photos');
    }, 1200);
  };

  // Filtered lists
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

  const filteredCitizenPhotos = citizenPhotos.filter(photo => {
    const matchCategory = selectedCategory === 'Semua' || photo.category === selectedCategory;
    const matchSearch = searchQuery === '' ||
      photo.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.uploaderHamlet && photo.uploaderHamlet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
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
            Agenda & Dokumentasi Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menghimpun agenda resmi pemerintahan desa, kegiatan keagamaan pesantren, gotong royong warga, posyandu, dan galeri foto partisipasi masyarakat dengan fitur kompresi gambar otomatis agar hemat penyimpanan.
          </p>
        </div>
      </div>

      {/* Main Tab Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setMainTab('agenda')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'agenda'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Agenda & Kegiatan Desa</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${mainTab === 'agenda' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
              {activities.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab('citizen_photos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'citizen_photos'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Dokumentasi Partisipasi Warga</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${mainTab === 'citizen_photos' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
              {citizenPhotos.length}
            </span>
          </button>
        </div>

        {/* Upload Button for Citizens */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>+ Unggah Foto Dokumentasi Warga</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={mainTab === 'agenda' ? "Cari agenda, lokasi, peserta..." : "Cari judul foto, uploader, dusun..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Frequency Filter (Only for Agenda) */}
          {mainTab === 'agenda' && (
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
          )}

          {/* Info pill for Citizen Photos */}
          {mainTab === 'citizen_photos' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kompresi otomatis browser aktif (Format WebP)</span>
            </div>
          )}
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

      {/* TAB 1: AGENDA & KEGIATAN DESA */}
      {mainTab === 'agenda' && (
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
                        <SmartImage
                          src={allPhotos[0]}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={480}
                          height={280}
                          showHdBadge={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
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
                              <SmartImage src={photoUrl} alt="" className="w-full h-full object-cover" width={100} height={100} />
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
      )}

      {/* TAB 2: DOKUMENTASI PARTISIPASI WARGA */}
      {mainTab === 'citizen_photos' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-emerald-950">Galeri Foto Partisipasi Warga Desa Brabo</h3>
                <p className="text-xs text-emerald-800">
                  Warga umum dapat berpartisipasi mengunggah momen gotong royong, posyandu, pengajian, atau kegiatan dusun lainnya. Gambar otomatis dikompresi di browser sehingga hemat memori.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              + Unggah Foto Baru
            </button>
          </div>

          {filteredCitizenPhotos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-800">Belum Ada Foto Dokumentasi Warga</h4>
                <p className="text-xs text-slate-500">
                  Jadilah warga pertama yang mengunggah foto dokumentasi kegiatan desa atau dusun Anda.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Unggah Foto Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCitizenPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Image View */}
                    <div 
                      onClick={() => openLightbox(photo.activityTitle, [photo.photoUrl], 0, {
                        uploader: photo.uploaderName,
                        date: photo.takenDate || photo.uploadedAt,
                        category: photo.category
                      })}
                      className="w-full h-52 overflow-hidden relative cursor-pointer group bg-slate-100"
                    >
                      <SmartImage
                        src={photo.photoUrl}
                        alt={photo.activityTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={480}
                        height={300}
                        showHdBadge={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 pointer-events-none">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Perbesar Foto
                        </span>
                      </div>

                      {photo.fileSizeKb && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {photo.fileSizeKb} KB (WebP)
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="px-5 pt-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {photo.category}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {photo.takenDate || photo.uploadedAt}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {photo.activityTitle}
                      </h4>

                      {photo.caption && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Uploader Meta */}
                  <div className="px-5 py-3 mt-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                        {photo.uploaderName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{photo.uploaderName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{photo.uploaderHamlet || 'Warga Desa'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      Warga
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CITIZEN PHOTO UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Unggah Dokumentasi Kegiatan</h3>
                  <p className="text-xs text-slate-500">Partisipasi warga untuk dokumentasi Desa Brabo</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setCompressionResult(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Foto Berhasil Diunggah!</h4>
                <p className="text-xs text-slate-600">
                  Terima kasih atas partisipasi Anda. Foto telah ditambahkan ke galeri kegiatan Desa Brabo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPhoto} className="space-y-4">
                {/* Image Picker with Auto Compression */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Pilih Foto Kegiatan * <span className="font-normal text-slate-500">(Auto-Kompresi WebP Aktif)</span>
                  </label>

                  {!compressionResult ? (
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors relative cursor-pointer bg-slate-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelection}
                        disabled={isCompressing}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          {isCompressing ? <Zap className="w-6 h-6 animate-pulse" /> : <Upload className="w-6 h-6" />}
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          {isCompressing ? 'Sedang mengompresi gambar di browser...' : 'Klik atau seret foto ke sini'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Format JPG, PNG, atau WebP (Foto akan diperkecil & dioptimasi otomatis)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                      <div className="flex gap-4 items-center">
                        <img
                          src={compressionResult.dataUrl}
                          alt="Preview"
                          className="w-24 h-24 rounded-xl object-cover border border-slate-300"
                        />
                        <div className="flex-1 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Gambar Berhasil Dikompresi</span>
                          </div>
                          <p className="text-slate-600">
                            Ukuran Asli: <strong className="text-slate-800">{formatBytes(compressionResult.originalSize)}</strong>
                          </p>
                          <p className="text-slate-600">
                            Ukuran Baru: <strong className="text-emerald-700">{formatBytes(compressionResult.compressedSize)}</strong> ({compressionResult.format})
                          </p>
                          <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            Hemat {compressionResult.compressionRatio}% Ukuran Database!
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCompressionResult(null)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                      >
                        Ganti Foto Lain
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid Inputs: Nama & Dusun */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Pengunggah *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.uploaderName}
                      onChange={(e) => setFormData({ ...formData, uploaderName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Dusun / Asal *
                    </label>
                    <select
                      value={formData.uploaderHamlet}
                      onChange={(e) => setFormData({ ...formData, uploaderHamlet: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Dusun Krajan">Dusun Krajan</option>
                      <option value="Dusun Dukoh">Dusun Dukoh</option>
                      <option value="Dusun Cangkring">Dusun Cangkring</option>
                      <option value="Luar Desa Brabo">Luar Desa Brabo</option>
                    </select>
                  </div>
                </div>

                {/* Judul Kegiatan & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Kegiatan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kerja Bakti Saluran Dusun Dukoh"
                      value={formData.activityTitle}
                      onChange={(e) => setFormData({ ...formData, activityTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Kategori Kegiatan *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityItem['category'] })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Gotong Royong">Gotong Royong</option>
                      <option value="Keagamaan">Keagamaan</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Posyandu">Posyandu</option>
                      <option value="Pemuda">Pemuda / Karang Taruna</option>
                      <option value="Pertanian">Pertanian</option>
                      <option value="Pemerintahan">Pemerintahan</option>
                      <option value="Olahraga">Olahraga</option>
                    </select>
                  </div>
                </div>

                {/* Tanggal & No HP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Tanggal Kegiatan
                    </label>
                    <input
                      type="date"
                      value={formData.takenDate}
                      onChange={(e) => setFormData({ ...formData, takenDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nomor WhatsApp <span className="font-normal text-slate-500">(Opsional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxx"
                      value={formData.uploaderPhone}
                      onChange={(e) => setFormData({ ...formData, uploaderPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Cerita / Keterangan */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Keterangan Singkat / Cerita Foto
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ceritakan sedikit tentang kegiatan yang berlangsung..."
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setCompressionResult(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!compressionResult || isCompressing || isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
                    <span>{isSubmitting ? 'Menyimpan ke Storage...' : 'Unggah Dokumentasi'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Lightbox Modal */}
      {lightboxOpen && activeGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full flex flex-col items-center space-y-4">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white text-xs px-2">
              <div className="max-w-md">
                <p className="font-bold truncate">{activeGallery.title}</p>
                {activeGallery.meta && (
                  <p className="text-[11px] text-slate-400">
                    Oleh: {activeGallery.meta.uploader} • {activeGallery.meta.date}
                  </p>
                )}
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
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
                    className="absolute left-2 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all backdrop-blur-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 p-3 rounded-full bg-black/60 hover:bg-black text-white transition-all backdrop-blur-xs cursor-pointer"
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
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      idx === activeGallery.currentIndex ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <SmartImage src={imgUrl} alt="" className="w-full h-full object-cover" width={100} height={100} />
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
