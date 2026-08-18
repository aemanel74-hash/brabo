import React, { useState } from 'react';
import { useVillageData, LetterSubmission } from '../../../context/VillageDataContext';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  ExternalLink, 
  X, 
  Sliders, 
  Paperclip, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';
import { OfficialLetterDocument } from '../../common/OfficialLetterDocument';

export const DocumentSubmissionsTab: React.FC = () => {
  const { 
    submissions, 
    updateSubmissionStatus, 
    deleteSubmission, 
    letterTemplates, 
    signatories 
  } = useVillageData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hamletFilter, setHamletFilter] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<LetterSubmission | null>(null);
  const [previewDocSub, setPreviewDocSub] = useState<LetterSubmission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status edit form state
  const [editStatus, setEditStatus] = useState<LetterSubmission['status']>('MENUNGGU_VERIFIKASI');
  const [customLetterNumber, setCustomLetterNumber] = useState('');
  const [pickupSchedule, setPickupSchedule] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenEdit = (sub: LetterSubmission) => {
    setSelectedSub(sub);
    setEditStatus(sub.status);
    setCustomLetterNumber(sub.customLetterNumber || '');
    setPickupSchedule((sub as any).pickupSchedule || 'Bisa diambil pada jam kerja (08.00 - 14.00 WIB)');
    setAdminNotes(sub.notes || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    updateSubmissionStatus(
      selectedSub.id,
      editStatus,
      adminNotes,
      customLetterNumber,
      pickupSchedule
    );

    setSelectedSub(null);
    showToast(`Status permohonan surat ${selectedSub.trackingCode} berhasil disimpan.`);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Hapus berkas permohonan ${code}?`)) {
      deleteSubmission(id);
      showToast(`Permohonan ${code} telah dihapus.`);
    }
  };

  const getStatusBadge = (status: LetterSubmission['status']) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Verifikasi
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Sedang Diproses
          </span>
        );
      case 'SELESAI_SIAP_AMBIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Selesai / Siap Ambil
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ditolak
          </span>
        );
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      sub.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.nik.includes(searchTerm) ||
      sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    const matchesHamlet = hamletFilter === 'ALL' || sub.hamlet === hamletFilter;

    return matchesSearch && matchesStatus && matchesHamlet;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200">
                Pusat Pelayanan Dokumen
              </span>
              <span className="text-xs text-slate-500 font-medium">{submissions.length} Pengajuan Masuk</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              Antrean Permohonan & Berkas Warga
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              Verifikasi berkas isian yang diunggah warga, tetapkan nomor surat resmi, dan perbarui status pengerjaan atau jadwal pengambilan dokumen di Balai Desa.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode resi, nama pemohon, NIK, atau jenis permohonan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              <option value="ALL">Semua Status Permohonan</option>
              <option value="MENUNGGU_VERIFIKASI">⏳ Menunggu Verifikasi</option>
              <option value="DIPROSES">⚙️ Sedang Diproses</option>
              <option value="SELESAI_SIAP_AMBIL">✅ Selesai / Siap Ambil</option>
              <option value="DITOLAK">❌ Ditolak</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={hamletFilter}
              onChange={(e) => setHamletFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              <option value="ALL">Semua Dusun</option>
              <option value="Dukoh">Dusun Dukoh</option>
              <option value="Krajan">Dusun Krajan</option>
              <option value="Cangkring">Dusun Cangkring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Belum ada antrean permohonan surat.</p>
            <p className="text-xs text-slate-500">Permohonan berkas yang dikirimkan warga akan muncul di daftar ini secara otomatis.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const hasUploadedFile = !!(sub as any).uploadedFileUrl;
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md space-y-4"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => handleCopyCode(sub.trackingCode)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                      title="Salin kode permohonan"
                    >
                      <span>{sub.trackingCode}</span>
                      {copiedCode === sub.trackingCode ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {sub.serviceName}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sub.submittedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(sub.status)}
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Applicant details */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Nama Pemohon:</span>
                        <strong className="text-slate-900 text-sm">{sub.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">NIK:</span>
                        <span className="font-mono font-bold text-slate-900">{sub.nik}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Alamat Domisili:</span>
                        <span>Dusun {sub.hamlet}, RT {sub.rt} / RW {sub.rw}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Keperluan Surat:</span>
                        <span className="font-medium text-slate-900">{sub.purpose}</span>
                      </div>
                    </div>

                    {/* Uploaded File Link if available */}
                    {hasUploadedFile && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-emerald-700" />
                          <div>
                            <span className="font-bold text-emerald-950 block">
                              {(sub as any).uploadedFileName || 'Berkas-Unggahan-Warga.pdf'}
                            </span>
                            <span className="text-[10px] text-emerald-800">
                              Dokumen formulir yang diunggah oleh pemohon
                            </span>
                          </div>
                        </div>
                        <a
                          href={(sub as any).uploadedFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={(sub as any).uploadedFileName || 'berkas_pemohon.pdf'}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-[11px] font-bold hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Berkas</span>
                        </a>
                      </div>
                    )}

                    {/* Official Notes / Schedule Preview */}
                    {(sub.customLetterNumber || (sub as any).pickupSchedule || sub.notes) && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        {sub.customLetterNumber && (
                          <p>
                            <span className="font-bold text-slate-800">No. Surat Resmi: </span>
                            <span className="font-mono text-emerald-800 font-bold">{sub.customLetterNumber}</span>
                          </p>
                        )}
                        {(sub as any).pickupSchedule && (
                          <p>
                            <span className="font-bold text-slate-800">Jadwal Pengambilan: </span>
                            <span className="text-slate-700">{(sub as any).pickupSchedule}</span>
                          </p>
                        )}
                        {sub.notes && (
                          <p>
                            <span className="font-bold text-slate-800">Catatan Admin: </span>
                            <span className="text-slate-600">{sub.notes}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="md:col-span-4 flex flex-col justify-between gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Validasi & Mutakhirkan Status</span>
                      </button>

                      <button
                        onClick={() => setPreviewDocSub(sub)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Pratinjau Surat Resmi</span>
                      </button>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleDelete(sub.id, sub.trackingCode)}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Permohonan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status & Verification Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Panel Verifikasi Permohonan
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Resi: {selectedSub.trackingCode} ({selectedSub.fullName})
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Ubah Status Permohonan *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="MENUNGGU_VERIFIKASI">⏳ Menunggu Verifikasi</option>
                  <option value="DIPROSES">⚙️ Sedang Diproses (Pemeriksaan berkas/penandatanganan)</option>
                  <option value="SELESAI_SIAP_AMBIL">✅ Selesai / Siap Diambil di Balai Desa</option>
                  <option value="DITOLAK">❌ Ditolak (Berkas tidak lengkap / tidak memenuhi syarat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nomor Surat Resmi Desa (Buku Agenda Desa)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 470 / 102 / Desa-Brb / VIII / 2024"
                  value={customLetterNumber}
                  onChange={(e) => setCustomLetterNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Jadwal & Petunjuk Pengambilan Berkas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Siap diambil di Loket Pelayanan Balai Desa mulai besok pukul 09.00 WIB"
                  value={pickupSchedule}
                  onChange={(e) => setPickupSchedule(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Catatan / Instruksi Tambahan untuk Pemohon
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Harap membawa KTP asli saat pengambilan berkas..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Letter Document Modal */}
      {previewDocSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-100 rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Pratinjau Cetak Surat Resmi: {previewDocSub.trackingCode}
              </h3>
              <button
                onClick={() => setPreviewDocSub(null)}
                className="p-2 rounded-full bg-white text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <OfficialLetterDocument
              data={{
                trackingCode: previewDocSub.trackingCode,
                letterNumber: previewDocSub.customLetterNumber || '470 / 084 / Desa-Brb / VIII / 2024',
                dateStr: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                template: letterTemplates.find(t => t.id === previewDocSub.templateId || t.code === previewDocSub.templateCode) || letterTemplates[0],
                formData: {
                  nik: previewDocSub.nik,
                  fullName: previewDocSub.fullName,
                  gender: previewDocSub.gender,
                  placeOfBirth: previewDocSub.placeOfBirth,
                  dateOfBirth: previewDocSub.dateOfBirth,
                  religion: previewDocSub.religion,
                  occupation: previewDocSub.occupation,
                  hamlet: previewDocSub.hamlet,
                  rt: previewDocSub.rt,
                  rw: previewDocSub.rw,
                  purpose: previewDocSub.purpose,
                  businessName: previewDocSub.businessName,
                  businessType: previewDocSub.businessType,
                },
                signatories,
              }}
              showActions={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
