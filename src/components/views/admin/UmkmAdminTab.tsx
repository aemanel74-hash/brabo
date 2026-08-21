import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Plus, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  User, 
  Image as ImageIcon,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { VillageUmkm, VerificationStatus } from '../../../types';
import { VerificationBadge } from '../../common/VerificationBadge';
import { RegisterUmkmModal } from '../../profile/RegisterUmkmModal';

interface UmkmAdminTabProps {
  umkmList: VillageUmkm[];
  onAddUmkm: (data: Omit<VillageUmkm, 'id' | 'submittedAt' | 'status' | 'verificationStatus'>) => void;
  onUpdateUmkm: (id: string, updated: Partial<VillageUmkm>) => void;
  onUpdateStatus: (id: string, status: VillageUmkm['status'], verificationStatus?: VerificationStatus, notes?: string) => void;
  onDeleteUmkm: (id: string) => void;
  onOpenSource?: (sourceId: string) => void;
}

export const UmkmAdminTab: React.FC<UmkmAdminTabProps> = ({
  umkmList,
  onAddUmkm,
  onUpdateUmkm,
  onUpdateStatus,
  onDeleteUmkm,
  onOpenSource,
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHamlet, setSelectedHamlet] = useState('SEMUA');
  const [editingUmkm, setEditingUmkm] = useState<VillageUmkm | null>(null);

  const filtered = umkmList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHamlet = selectedHamlet === 'SEMUA' || u.hamlet.includes(selectedHamlet);
    return matchesSearch && matchesHamlet;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUmkm) return;
    onUpdateUmkm(editingUmkm.id, editingUmkm);
    setEditingUmkm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Database & Direktori UMKM Warga Desa Brabo
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total {umkmList.length} unit usaha terdaftar dari warga di 3 wilayah dusun.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah / Daftarkan Usaha</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama usaha, pemilik, atau kategori..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <select
            value={selectedHamlet}
            onChange={e => setSelectedHamlet(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
          >
            <option value="SEMUA">Semua Dusun</option>
            <option value="Dukoh">Dusun I Dukoh</option>
            <option value="Krajan">Dusun II Krajan</option>
            <option value="Cangkring">Dusun III Cangkring</option>
          </select>
        </div>
      </div>

      {/* List Table / Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Belum ada data UMKM yang cocok.
          </div>
        ) : (
          filtered.map(umkm => (
            <div
              key={umkm.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left side: details & photo thumbs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Photo slides preview */}
                  <div className="grid grid-cols-2 gap-1.5 w-32 sm:w-36 shrink-0">
                    {umkm.photos?.slice(0, 4).map((photo, pIdx) => (
                      <div key={pIdx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img src={photo} alt={`Slide ${pIdx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-slate-900/80 text-[8px] text-white px-1 rounded font-mono">
                          #{pIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {umkm.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {umkm.hamlet}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Terdaftar: {umkm.submittedAt}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {umkm.name}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {umkm.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pemilik: <strong>{umkm.ownerName}</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WA: <strong>+{umkm.whatsapp}</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span className="truncate max-w-xs">{umkm.address}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    {umkm.mapsUrl && (
                      <a
                        href={umkm.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Buka Google Maps"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Maps</span>
                      </a>
                    )}
                    <button
                      onClick={() => setEditingUmkm(umkm)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Edit Data UMKM"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus usaha "${umkm.name}" dari database?`)) {
                          onDeleteUmkm(umkm.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Hapus Usaha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-400" />
                <span>Edit Informasi Usaha: {editingUmkm.name}</span>
              </h4>
              <button
                onClick={() => setEditingUmkm(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Usaha</label>
                <input
                  type="text"
                  required
                  value={editingUmkm.name}
                  onChange={e => setEditingUmkm({ ...editingUmkm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Pemilik</label>
                  <input
                    type="text"
                    required
                    value={editingUmkm.ownerName}
                    onChange={e => setEditingUmkm({ ...editingUmkm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nomor WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editingUmkm.whatsapp}
                    onChange={e => setEditingUmkm({ ...editingUmkm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={editingUmkm.category}
                    onChange={e => setEditingUmkm({ ...editingUmkm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Kuliner & Olahan">Kuliner & Olahan</option>
                    <option value="Busana & Perlengkapan Santri">Busana & Perlengkapan Santri</option>
                    <option value="Pertanian & Hasil Bumi">Pertanian & Hasil Bumi</option>
                    <option value="Jasa & Percetakan">Jasa & Percetakan</option>
                    <option value="Kerajinan & Seni">Kerajinan & Seni</option>
                    <option value="Toko & Kelontong">Toko & Kelontong</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Wilayah Dusun</label>
                  <select
                    value={editingUmkm.hamlet}
                    onChange={e => setEditingUmkm({ ...editingUmkm, hamlet: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Dusun I Dukoh">Dusun I Dukoh</option>
                    <option value="Dusun II Krajan">Dusun II Krajan</option>
                    <option value="Dusun III Cangkring">Dusun III Cangkring</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingUmkm.address}
                  onChange={e => setEditingUmkm({ ...editingUmkm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Link Google Maps</label>
                <input
                  type="url"
                  value={editingUmkm.mapsUrl || ''}
                  onChange={e => setEditingUmkm({ ...editingUmkm, mapsUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Keterangan Usaha</label>
                <textarea
                  rows={3}
                  value={editingUmkm.description}
                  onChange={e => setEditingUmkm({ ...editingUmkm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUmkm(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      <RegisterUmkmModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmitUmkm={onAddUmkm}
      />
    </div>
  );
};
