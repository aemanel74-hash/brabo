import React, { useState } from 'react';
import { useVillageData } from '../../../context/VillageDataContext';
import { CommunityOrgMember, CommunityOrgType, VerificationStatus } from '../../../types';
import { VerificationBadge } from '../../common/VerificationBadge';
import { VerificationSourceSelector } from '../../common/VerificationSourceSelector';
import { PhotoUploadInput } from '../../common/PhotoUploadInput';
import { 
  HeartHandshake, 
  Flame, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  User, 
  Phone, 
  Calendar, 
  ShieldCheck,
  Info
} from 'lucide-react';

interface OrganizationsTabProps {
  onOpenSource: (sourceId: string) => void;
  showToast: (msg: string) => void;
}

export const OrganizationsTab: React.FC<OrganizationsTabProps> = ({ onOpenSource, showToast }) => {
  const { 
    pkkMembers, 
    karangTarunaMembers, 
    addCommunityMember, 
    updateCommunityMember, 
    deleteCommunityMember 
  } = useVillageData();

  const [selectedOrgType, setSelectedOrgType] = useState<CommunityOrgType>('PKK');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for Adding new member
  const initialNewMember = {
    name: '',
    position: 'Ketua',
    period: '2021 - 2026',
    photoUrl: '',
    contact: '',
    status: 'VERIFIED' as VerificationStatus,
    sourceId: 'SRC-PEMDES-BRABO',
    verificationSource: 'VERIFIED_DESA' as const,
    verificationNote: 'SK Kepala Desa Brabo tentang Struktur Kepengurusan Lembaga Kemasyarakatan Desa',
    customSourceName: '',
    isConfirmedActive: true,
  };

  const [newMember, setNewMember] = useState(initialNewMember);
  const [editForm, setEditForm] = useState<Partial<CommunityOrgMember>>({});

  const handleOpenAdd = () => {
    setNewMember({
      ...initialNewMember,
      position: selectedOrgType === 'PKK' ? 'Ketua TP PKK' : 'Ketua Karang Taruna',
      verificationNote: `SK Kepala Desa Brabo tentang Pengurus ${selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'} Desa Brabo`,
    });
    setIsAdding(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) {
      alert('Nama pengurus wajib diisi.');
      return;
    }
    const rolePosition = newMember.position.trim() || (selectedOrgType === 'PKK' ? 'Pengurus PKK' : 'Pengurus Karang Taruna');

    addCommunityMember({
      orgType: selectedOrgType,
      name: newMember.name.trim(),
      position: rolePosition,
      role: rolePosition, // sync compatibility
      period: newMember.period?.trim() || '2021 - 2026',
      photoUrl: newMember.photoUrl || '',
      contact: newMember.contact || '',
      phone: newMember.contact || '', // sync compatibility
      status: newMember.status,
      sourceId: newMember.sourceId || 'SRC-PEMDES-BRABO',
      verificationSource: newMember.verificationSource,
      verificationNote: newMember.verificationNote,
      customSourceName: newMember.customSourceName,
      isConfirmedActive: newMember.isConfirmedActive ?? true,
    });

    setIsAdding(false);
    setNewMember(initialNewMember);
    showToast(`Pengurus ${selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'} baru berhasil ditambahkan.`);
  };

  const handleStartEdit = (member: CommunityOrgMember) => {
    setEditingId(member.id);
    const resolvedPosition = member.position || member.role || '';
    const resolvedContact = member.contact || member.phone || '';
    setEditForm({
      ...member,
      position: resolvedPosition,
      role: resolvedPosition,
      contact: resolvedContact,
      phone: resolvedContact,
      verificationSource: member.verificationSource || 'VERIFIED_DESA',
      verificationNote: member.verificationNote || `SK Pengurus ${selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'} Desa Brabo`,
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.name?.trim()) {
      alert('Nama pengurus wajib diisi.');
      return;
    }
    const resolvedPos = (editForm.position || editForm.role || '').trim();
    const resolvedContact = (editForm.contact || editForm.phone || '').trim();

    updateCommunityMember(id, {
      ...editForm,
      position: resolvedPos,
      role: resolvedPos,
      contact: resolvedContact,
      phone: resolvedContact,
    });

    setEditingId(null);
    setEditForm({});
    showToast(`Data pengurus ${selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'} berhasil diperbarui.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus pengurus "${name}" dari struktur ${selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'}?`)) {
      deleteCommunityMember(id);
      showToast('Pengurus berhasil dihapus.');
    }
  };

  const currentList = selectedOrgType === 'PKK' ? pkkMembers : karangTarunaMembers;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Struktur Kelembagaan Desa (TP PKK & Karang Taruna)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data susunan pengurus TP PKK dan Karang Taruna Desa Brabo. Data siap diinput dan disunting mandiri dengan transparansi verifikasi SK Desa.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengurus {selectedOrgType === 'PKK' ? 'PKK' : 'Karang Taruna'}</span>
        </button>
      </div>

      {/* Org Selector Switch */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => {
            setSelectedOrgType('PKK');
            setIsAdding(false);
            setEditingId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedOrgType === 'PKK'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Tim Penggerak PKK</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedOrgType === 'PKK' ? 'bg-rose-900 text-rose-100' : 'bg-slate-200 text-slate-700'}`}>
            {pkkMembers.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedOrgType('KARANG_TARUNA');
            setIsAdding(false);
            setEditingId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedOrgType === 'KARANG_TARUNA'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Karang Taruna</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedOrgType === 'KARANG_TARUNA' ? 'bg-blue-900 text-blue-100' : 'bg-slate-200 text-slate-700'}`}>
            {karangTarunaMembers.length}
          </span>
        </button>
      </div>

      {/* Add Org Member Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${selectedOrgType === 'PKK' ? 'bg-rose-600' : 'bg-blue-600'}`}>
                {selectedOrgType === 'PKK' ? <HeartHandshake className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Formulir Tambah Pengurus {selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Nama lengkap pengurus..."
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Posisi *</label>
              <input
                type="text"
                required
                placeholder={selectedOrgType === 'PKK' ? 'Ketua / Sekretaris / Pokja I...' : 'Ketua / Wakil / Seksi Olahraga...'}
                value={newMember.position}
                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Periode Masa Bakti</label>
              <input
                type="text"
                placeholder="2021 - 2026"
                value={newMember.period}
                onChange={(e) => setNewMember({ ...newMember, period: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <PhotoUploadInput
                label="Foto Profil Pengurus"
                value={newMember.photoUrl}
                onChange={(url) => setNewMember({ ...newMember, photoUrl: url })}
                folderName="kelembagaan"
                helperText="Unggah pas foto profil pengurus kelembagaan (JPG, PNG, WebP)"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">No. Kontak / WhatsApp</label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx (opsional)"
                value={newMember.contact}
                onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Keaktifan</label>
              <select
                value={newMember.status}
                onChange={(e) => setNewMember({ ...newMember, status: e.target.value as VerificationStatus })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="VERIFIED">TERVERIFIKASI SK DESA (Resmi & Aktif)</option>
                <option value="SUPPORTED">TERCATAT (Dalam Pendataan)</option>
                <option value="UNVERIFIED">BELUM TERVERIFIKASI</option>
              </select>
            </div>
          </div>

          {/* Verification Source Selector */}
          <div className="pt-3 border-t border-slate-200">
            <VerificationSourceSelector
              verificationSource={newMember.verificationSource}
              verificationNote={newMember.verificationNote}
              customSourceName={newMember.customSourceName}
              onChange={(fields) => setNewMember({ ...newMember, ...fields })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
            >
              Simpan Pengurus
            </button>
          </div>
        </form>
      )}

      {/* Org Members List */}
      {currentList.length === 0 ? (
        <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            {selectedOrgType === 'PKK' ? <HeartHandshake className="w-6 h-6 text-rose-500" /> : <Flame className="w-6 h-6 text-blue-500" />}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700">
              Data Struktur {selectedOrgType === 'PKK' ? 'TP PKK' : 'Karang Taruna'} Masih Kosong
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Data sengaja disiapkan kosongan tanpa dummy data. Silakan klik tombol "Tambah Pengurus" untuk menginput susunan pengurus resmi.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            + Tambah Pengurus Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((member) => {
            const isEditing = editingId === member.id;
            const currentPosition = member.position || member.role || 'Pengurus';
            const currentContact = member.contact || member.phone || '';

            return (
              <div
                key={member.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-3"
              >
                {!isEditing ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      {member.photoUrl ? (
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100" 
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          selectedOrgType === 'PKK' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900 leading-snug break-words">{member.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            selectedOrgType === 'PKK' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {currentPosition}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            {member.period || '2021 - 2026'}
                          </span>
                          {currentContact && (
                            <span className="flex items-center gap-1 text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{currentContact}</span>
                            </span>
                          )}
                        </div>
                        <div className="pt-0.5">
                          <VerificationBadge
                            status={member.status}
                            verificationSource={member.verificationSource}
                            verificationNote={member.verificationNote}
                            customSourceName={member.customSourceName}
                            sourceId={member.sourceId}
                            onOpenSource={onOpenSource}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleStartEdit(member)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Edit Data Pengurus"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Pengurus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Edit Data Pengurus: {member.name}
                      </span>
                      <span className="text-[10px] text-slate-400">ID: {member.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Pengurus *</label>
                        <input
                          type="text"
                          value={editForm.name ?? member.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan / Posisi *</label>
                        <input
                          type="text"
                          value={editForm.position ?? editForm.role ?? currentPosition}
                          onChange={(e) => setEditForm({ ...editForm, position: e.target.value, role: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Periode Masa Bakti</label>
                        <input
                          type="text"
                          value={editForm.period ?? member.period ?? '2021 - 2026'}
                          onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <PhotoUploadInput
                          label="Foto Profil Pengurus"
                          value={editForm.photoUrl ?? member.photoUrl ?? ''}
                          onChange={(url) => setEditForm({ ...editForm, photoUrl: url })}
                          folderName="kelembagaan"
                          helperText="Pilih atau ganti foto profil pengurus ini"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">No. Kontak / WhatsApp</label>
                        <input
                          type="tel"
                          value={editForm.contact ?? editForm.phone ?? currentContact}
                          onChange={(e) => setEditForm({ ...editForm, contact: e.target.value, phone: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Keaktifan</label>
                        <select
                          value={editForm.status ?? member.status ?? 'VERIFIED'}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as VerificationStatus })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="VERIFIED">TERVERIFIKASI SK DESA (Resmi & Aktif)</option>
                          <option value="SUPPORTED">TERCATAT</option>
                          <option value="UNVERIFIED">BELUM TERVERIFIKASI</option>
                        </select>
                      </div>
                    </div>

                    {/* Verification Source Selector */}
                    <div className="pt-2 border-t border-slate-100">
                      <VerificationSourceSelector
                        verificationSource={editForm.verificationSource ?? member.verificationSource ?? 'VERIFIED_DESA'}
                        verificationNote={editForm.verificationNote ?? member.verificationNote ?? ''}
                        customSourceName={editForm.customSourceName ?? member.customSourceName ?? ''}
                        onChange={(fields) => setEditForm({ ...editForm, ...fields })}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm({});
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(member.id)}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
