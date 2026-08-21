import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Phone, 
  Store, 
  User, 
  Tag, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { VillageUmkm } from '../../types';
import { compressImage } from '../../utils/imageCompression';

interface RegisterUmkmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUmkm: (data: Omit<VillageUmkm, 'id' | 'submittedAt' | 'status' | 'verificationStatus'>) => void;
}

export const RegisterUmkmModal: React.FC<RegisterUmkmModalProps> = ({
  isOpen,
  onClose,
  onSubmitUmkm,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    category: 'Kuliner & Olahan' as VillageUmkm['category'],
    hamlet: 'Dusun II Krajan' as VillageUmkm['hamlet'],
    address: '',
    description: '',
    whatsapp: '',
    mapsUrl: '',
    priceRange: '',
    openingHours: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFilesNames, setPhotoFilesNames] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setIsCompressing(true);

    try {
      const newPhotoUrls: string[] = [];
      const newNames: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // Compress image using lightweight WebP / Canvas compression
        const compressed = await compressImage(file, {
          maxWidth: 1280,
          maxHeight: 960,
          quality: 0.82,
          format: 'image/webp',
        });

        newPhotoUrls.push(compressed.dataUrl);
        newNames.push(file.name);
      }

      setPhotos(prev => [...prev, ...newPhotoUrls]);
      setPhotoFilesNames(prev => [...prev, ...newNames]);
    } catch (err) {
      console.error('Error compressing photos:', err);
      setErrorMsg('Gagal memproses beberapa foto. Pastikan format file berupa JPG/PNG/WEBP.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
    setPhotoFilesNames(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Nama usaha / produk wajib diisi.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMsg('Nama pemilik usaha wajib diisi.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      setErrorMsg('Keterangan usaha minimal 20 karakter agar pengunjung mendapat informasi lengkap.');
      return;
    }
    if (!formData.whatsapp.trim()) {
      setErrorMsg('Nomor WhatsApp aktif wajib diisi.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Alamat / patokan lokasi usaha wajib diisi.');
      return;
    }

    // MANDATORY REQUIREMENT: Minimal 4 slide foto
    if (photos.length < 4) {
      setErrorMsg(`Wajib mengunggah minimal 4 slide foto jenis usaha (saat ini baru ${photos.length} foto). Silakan tambahkan ${4 - photos.length} foto lagi.`);
      return;
    }

    // Clean phone number format for WhatsApp
    let cleanWa = formData.whatsapp.replace(/\D/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1);
    } else if (!cleanWa.startsWith('62')) {
      cleanWa = '62' + cleanWa;
    }

    onSubmitUmkm({
      name: formData.name.trim(),
      ownerName: formData.ownerName.trim(),
      category: formData.category,
      hamlet: formData.hamlet,
      address: formData.address.trim(),
      description: formData.description.trim(),
      whatsapp: cleanWa,
      mapsUrl: formData.mapsUrl.trim() || undefined,
      photos: photos,
      priceRange: formData.priceRange.trim() || undefined,
      openingHours: formData.openingHours.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Direktori Ekonomi Desa
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Daftarkan Usaha / UMKM Warga Brabo
            </h2>
            <p className="text-xs text-emerald-100/80">
              Tampilkan produk & jasa Anda di portal resmi desa untuk menjangkau warga dan santri.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Tutup formulir"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pendaftaran UMKM Berhasil Tersimpan!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Profil usaha Anda telah berhasil dimasukkan ke dalam database direktori UMKM Desa Brabo dan langsung tayang di portal resmi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Basic Usaha Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nama Usaha / Merk Dagang <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Warung Berkah Santri / UD Tani Makmur"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nama Pemilik Usaha <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap pemilik / pengelola"
                    value={formData.ownerName}
                    onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Kategori Usaha <strong className="text-red-500">*</strong></span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  >
                    <option value="Kuliner & Olahan">Kuliner & Olahan Makanan/Minuman</option>
                    <option value="Busana & Perlengkapan Santri">Busana & Perlengkapan Santri</option>
                    <option value="Pertanian & Hasil Bumi">Pertanian & Hasil Bumi / Saprodi</option>
                    <option value="Jasa & Percetakan">Jasa, Laundry & Percetakan</option>
                    <option value="Kerajinan & Seni">Kerajinan, Souvenir & Seni</option>
                    <option value="Toko & Kelontong">Toko Sembako & Kelontong</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Wilayah Dusun <strong className="text-red-500">*</strong></span>
                  </label>
                  <select
                    value={formData.hamlet}
                    onChange={e => setFormData({ ...formData, hamlet: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  >
                    <option value="Dusun I Dukoh">Dusun I Dukoh</option>
                    <option value="Dusun II Krajan">Dusun II Krajan</option>
                    <option value="Dusun III Cangkring">Dusun III Cangkring</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nomor WhatsApp Aktif <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <p className="text-[10px] text-slate-500">Akan terhubung langsung untuk pesanan / chat warga.</p>
                </div>
              </div>

              {/* Alamat & Link Maps */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Alamat Lengkap / Patokan Lokasi <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Pesantren Krajan RT 02 / RW 01, Samping Masjid Jami"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tautan / Link Google Maps (Opsional tapi Disarankan)</span>
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="Contoh: https://maps.app.goo.gl/... atau https://maps.google.com/?q=..."
                    value={formData.mapsUrl}
                    onChange={e => setFormData({ ...formData, mapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">Salin tautan bagikan dari aplikasi Google Maps agar pembeli mudah menemukan rute.</p>
                </div>
              </div>

              {/* Keterangan Usaha */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Keterangan / Deskripsi Produk & Layanan Usaha <strong className="text-red-500">*</strong></span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan menu, varian produk, keunggulan, layanan antar, pesanan hajatan, dll..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent leading-relaxed"
                />
              </div>

              {/* Optional Info: Harga & Jam Buka */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Kisaran Harga (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 5.000 - Rp 50.000"
                    value={formData.priceRange}
                    onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Jam Operasional (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 08.00 - 21.00 WIB (Buka Tiap Hari)"
                    value={formData.openingHours}
                    onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* UPLOAD FOTO - MINIMAL 4 SLIDE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>Galeri Foto Produk / Tempat Usaha <strong className="text-red-500">*</strong></span>
                    </label>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <strong>Syarat: Wajib minimal 4 slide foto</strong> (tampak depan toko, etalase produk, proses kerja, dll).
                    </p>
                  </div>

                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 self-start sm:self-auto ${
                    photos.length >= 4 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {photos.length >= 4 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>{photos.length} / 4 Foto Terupload</span>
                  </div>
                </div>

                {/* Upload Button Box */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                >
                  {isCompressing ? (
                    <div className="py-3 flex flex-col items-center gap-2 text-xs text-slate-600">
                      <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                      <span>Mengompresi & mengoptimalkan foto...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          Klik untuk Memilih Foto Usaha
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Mendukung banyak file sekaligus (JPG, PNG, WEBP). Foto otomatis dikompresi agar hemat memori.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Photo Previews Grid */}
                {photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Slide Foto Terpilih ({photos.length}):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {photos.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden aspect-4/3 bg-slate-200 border border-slate-300 shadow-2xs">
                          <img
                            src={imgUrl}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 left-1 bg-slate-950/75 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                            Slide #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(idx);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-102 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Tayangkan UMKM</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
