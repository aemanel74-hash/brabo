import React, { useState } from 'react';
import { useVillageData } from '../../../context/VillageDataContext';
import { HamletData, VerificationStatus, VerificationSourceOption } from '../../../types';
import { VerificationBadge } from '../../common/VerificationBadge';
import { VerificationSourceSelector } from '../../common/VerificationSourceSelector';
import { 
  Compass, 
  MapPin, 
  Landmark, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  Users, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Activity,
  Sparkles
} from 'lucide-react';

interface HamletsTabProps {
  onOpenSource: (sourceId: string) => void;
  showToast: (msg: string) => void;
}

export const HamletsTab: React.FC<HamletsTabProps> = ({ onOpenSource, showToast }) => {
  const { hamlets, addHamlet, updateHamlet, deleteHamlet } = useVillageData();

  const [isAdding, setIsAdding] = useState(false);
  const [editingHamletId, setEditingHamletId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<HamletData>>({
    name: '',
    alias: '',
    order: hamlets.length + 1,
    headName: '',
    headStatus: 'VERIFIED',
    headSourceId: 'SRC-PEMDES-BRABO',
    headVerificationSource: 'VERIFIED_DESA',
    headVerificationNote: 'SK Pengangkatan Kepala Dusun',
    headCustomSourceName: '',
    rtCount: 4,
    rwCount: 1,
    population: 1500,
    kkCount: 400,
    description: '',
    characteristics: [],
    facilities: [],
    potentials: [],
    activities: [],
    historicalSite: '',
    status: 'VERIFIED',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationSource: 'VERIFIED_DESA',
    verificationNote: 'Batas wilayah administratif resmi Pemerintah Desa Brabo',
    customSourceName: '',
  });

  // String helpers for list fields (Characteristics, Facilities, Potentials, Activities)
  const [characteristicsStr, setCharacteristicsStr] = useState('');
  const [facilitiesStr, setFacilitiesStr] = useState('');
  const [potentialsStr, setPotentialsStr] = useState('');
  const [activitiesStr, setActivitiesStr] = useState('');

  const handleOpenAdd = () => {
    setEditingHamletId(null);
    setFormData({
      name: '',
      alias: `Dusun 0${hamlets.length + 1}`,
      order: hamlets.length + 1,
      headName: '',
      headStatus: 'VERIFIED',
      headSourceId: 'SRC-PEMDES-BRABO',
      headVerificationSource: 'VERIFIED_DESA',
      headVerificationNote: 'SK Pengangkatan Kepala Dusun dari Balai Desa',
      headCustomSourceName: '',
      rtCount: 4,
      rwCount: 1,
      population: 0,
      kkCount: 0,
      description: '',
      characteristics: [],
      facilities: [],
      potentials: [],
      activities: [],
      historicalSite: '',
      status: 'VERIFIED',
      sourceId: 'SRC-PEMKAB-GROB',
      verificationSource: 'VERIFIED_DESA',
      verificationNote: 'Peraturan Desa tentang Penetapan Wilayah Dusun',
      customSourceName: '',
    });
    setCharacteristicsStr('');
    setFacilitiesStr('');
    setPotentialsStr('');
    setActivitiesStr('');
    setIsAdding(true);
  };

  const handleOpenEdit = (hamlet: HamletData) => {
    setIsAdding(false);
    setEditingHamletId(hamlet.id);
    setFormData({ ...hamlet });
    setCharacteristicsStr(hamlet.characteristics?.join('\n') || '');
    setFacilitiesStr(hamlet.facilities?.join('\n') || '');
    setPotentialsStr(hamlet.potentials?.join('\n') || '');
    setActivitiesStr(hamlet.activities?.join('\n') || '');
  };

  const parseList = (str: string) => {
    return str
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert('Nama Dusun wajib diisi.');
      return;
    }

    const payload: Omit<HamletData, 'id'> = {
      name: formData.name.trim(),
      alias: formData.alias?.trim() || `Dusun 0${formData.order || 1}`,
      order: Number(formData.order) || 1,
      headName: formData.headName?.trim() || 'Data belum diverifikasi',
      headStatus: formData.headStatus || 'VERIFIED',
      headSourceId: formData.headSourceId || 'SRC-PEMDES-BRABO',
      headVerificationSource: formData.headVerificationSource || 'VERIFIED_DESA',
      headVerificationNote: formData.headVerificationNote || '',
      headCustomSourceName: formData.headCustomSourceName || '',
      rtCount: Number(formData.rtCount) || 0,
      rwCount: Number(formData.rwCount) || 0,
      population: Number(formData.population) || 0,
      kkCount: Number(formData.kkCount) || 0,
      description: formData.description?.trim() || '',
      characteristics: parseList(characteristicsStr),
      facilities: parseList(facilitiesStr),
      potentials: parseList(potentialsStr),
      activities: parseList(activitiesStr),
      historicalSite: formData.historicalSite?.trim() || '',
      status: formData.status || 'VERIFIED',
      sourceId: formData.sourceId || 'SRC-PEMKAB-GROB',
      verificationSource: formData.verificationSource || 'VERIFIED_DESA',
      verificationNote: formData.verificationNote || '',
      customSourceName: formData.customSourceName || '',
    };

    if (editingHamletId) {
      updateHamlet(editingHamletId, payload);
      setEditingHamletId(null);
      showToast(`Data ${payload.name} berhasil diperbarui.`);
    } else {
      addHamlet(payload);
      setIsAdding(false);
      showToast(`Dusun baru "${payload.name}" berhasil ditambahkan.`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}"? Perubahan akan langsung tampil di halaman publik.`)) {
      deleteHamlet(id);
      showToast(`Dusun "${name}" berhasil dihapus.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Kewilayahan CMS
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Total: {hamlets.length} Dusun Terdaftar
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Manajemen Data Kewilayahan & Dusun Desa Brabo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambah, edit profil, kelola Kepala Dusun (Kadus), serta tentukan sumber dan catatan verifikasi secara mandiri.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dusun Baru</span>
          </button>
        </div>

        {/* Modal / Inline Form for Add & Edit */}
        {(isAdding || editingHamletId) && (
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-800" />
                <h4 className="text-sm font-bold text-emerald-950">
                  {editingHamletId ? `Edit Profil ${formData.name || 'Dusun'}` : 'Form Tambah Dusun Baru'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingHamletId(null);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Dusun *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dusun Dukoh / Dusun Krajan"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alias / Sebutan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dusun I / Dusun II (Pusat Desa)"
                  value={formData.alias || ''}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Urut (Order)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.order || 1}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Demographics & Boundaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah RT
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="Contoh: 6"
                  value={formData.rtCount ?? ''}
                  onChange={(e) => setFormData({ ...formData, rtCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah RW
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="Contoh: 2"
                  value={formData.rwCount ?? ''}
                  onChange={(e) => setFormData({ ...formData, rwCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimasi Jumlah Penduduk (Jiwa)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="Contoh: 1750"
                  value={formData.population ?? ''}
                  onChange={(e) => setFormData({ ...formData, population: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimasi Kepala Keluarga (KK)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="Contoh: 480"
                  value={formData.kkCount ?? ''}
                  onChange={(e) => setFormData({ ...formData, kkCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Kadus & Head Verification */}
            <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <h5 className="text-xs font-bold text-slate-900">
                  Kepala Dusun (Kadus / Kamituwo)
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Kepala Dusun *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama pejabat Kadus definitif..."
                    value={formData.headName || ''}
                    onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <VerificationSourceSelector
                label="Status & Sumber Verifikasi Pejabat Kadus"
                helperText="Tentukan sumber keabsahan nama pejabat Kepala Dusun ini."
                verificationSource={formData.headVerificationSource || 'VERIFIED_DESA'}
                verificationNote={formData.headVerificationNote || ''}
                customSourceName={formData.headCustomSourceName || ''}
                onChange={({ verificationSource, verificationNote, customSourceName, status, sourceId }) => {
                  setFormData({
                    ...formData,
                    headVerificationSource: verificationSource,
                    headVerificationNote: verificationNote,
                    headCustomSourceName: customSourceName,
                    headStatus: status,
                    headSourceId: sourceId,
                  });
                }}
              />
            </div>

            {/* Description & Historical Site */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Wilayah & Profil Dusun *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan gambaran umum, suasana, nilai historis, atau aktivitas masyarakat di dusun ini..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Situs / Peninggalan Sejarah Khas (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Petilasan Sumur & Makam Blok Merapi (Peninggalan Tidjoyo)"
                  value={formData.historicalSite || ''}
                  onChange={(e) => setFormData({ ...formData, historicalSite: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* 4 Multi-item lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Karakteristik Wilayah (Satu baris per poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh:&#10;Kawasan pemukiman padat religius&#10;Terdapat asrama pesantren santri"
                  value={characteristicsStr}
                  onChange={(e) => setCharacteristicsStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fasilitas Umum & Sarpras (Satu baris per poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh:&#10;Masjid Jami Dusun&#10;Posyandu Dusun&#10;Jalan rabat beton"
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Potensi Komoditas & Ekonomi (Satu baris per poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh:&#10;Penghasil jagung hibrida & tembakau&#10;UMKM warung santri & olahan pangan"
                  value={potentialsStr}
                  onChange={(e) => setPotentialsStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kegiatan Rutin Warga (Satu baris per poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh:&#10;Pengajian rutin malam Jum'at&#10;Posyandu balita & lansia&#10;Kerja bakti pembersihan saluran"
                  value={activitiesStr}
                  onChange={(e) => setActivitiesStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Dusun Verification Selector */}
            <VerificationSourceSelector
              label="Status & Sumber Verifikasi Data Dusun Ini"
              helperText="Tentukan rujukan data batas dan profil dusun ini agar transparan di website."
              verificationSource={formData.verificationSource || 'VERIFIED_DESA'}
              verificationNote={formData.verificationNote || ''}
              customSourceName={formData.customSourceName || ''}
              onChange={({ verificationSource, verificationNote, customSourceName, status, sourceId }) => {
                setFormData({
                  ...formData,
                  verificationSource,
                  verificationNote,
                  customSourceName,
                  status,
                  sourceId,
                });
              }}
            />

            {/* Form Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-200/80">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingHamletId(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingHamletId ? 'Simpan Perubahan Dusun' : 'Tambahkan Dusun'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Dusun Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hamlets.map((hamlet) => {
            return (
              <div
                key={hamlet.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Dusun 0{hamlet.order}
                    </span>
                    <VerificationBadge
                      status={hamlet.status}
                      sourceId={hamlet.sourceId}
                      verificationSource={hamlet.verificationSource}
                      verificationNote={hamlet.verificationNote}
                      customSourceName={hamlet.customSourceName}
                      onOpenSource={onOpenSource}
                    />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{hamlet.name}</h4>
                    <p className="text-xs text-slate-500">{hamlet.alias || '-'}</p>
                  </div>

                  {/* Kadus Info */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Kepala Dusun (Kadus):</span>
                      <VerificationBadge
                        status={hamlet.headStatus}
                        sourceId={hamlet.headSourceId}
                        verificationSource={hamlet.headVerificationSource}
                        verificationNote={hamlet.headVerificationNote}
                        customSourceName={hamlet.headCustomSourceName}
                        onOpenSource={onOpenSource}
                      />
                    </div>
                    <p className="font-bold text-slate-800">{hamlet.headName || 'Belum diisi'}</p>
                    {hamlet.headVerificationNote && (
                      <p className="text-[10px] text-emerald-700 italic">
                        {hamlet.headVerificationNote}
                      </p>
                    )}
                  </div>

                  {/* RT / RW Stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold">
                      {hamlet.rtCount || 0} RT
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold">
                      {hamlet.rwCount || 0} RW
                    </span>
                    {hamlet.population ? (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold">
                        ~{hamlet.population} Jiwa
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {hamlet.description}
                  </p>

                  {hamlet.historicalSite && (
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hamlet.historicalSite}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(hamlet)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Dusun</span>
                  </button>
                  <button
                    onClick={() => handleDelete(hamlet.id, hamlet.name)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Dusun"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
