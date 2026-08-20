import React, { useState } from 'react';
import { 
  useVillageData 
} from '../../../context/VillageDataContext';
import { 
  CitizenComplaint, 
  ComplaintStatus, 
  ComplaintCategory 
} from '../../../types';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  MapPin, 
  User, 
  Phone, 
  Eye, 
  Trash2, 
  Send, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Check, 
  Maximize2,
  X,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const ComplaintsTab: React.FC = () => {
  const { 
    complaints, 
    updateComplaintStatus, 
    deleteComplaint 
  } = useVillageData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [hamletFilter, setHamletFilter] = useState<string>('ALL');

  // Modal detail state
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('MENUNGGU_VERIFIKASI');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenDetail = (complaint: CitizenComplaint) => {
    setSelectedComplaint(complaint);
    setAdminResponseText(complaint.adminResponse || '');
    setOfficerName(complaint.officerInCharge || 'Pemerintah Desa Brabo');
    setSelectedStatus(complaint.status);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(
      selectedComplaint.id,
      selectedStatus,
      adminResponseText,
      officerName
    );

    // Update local selected state
    setSelectedComplaint({
      ...selectedComplaint,
      status: selectedStatus,
      adminResponse: adminResponseText,
      officerInCharge: officerName,
      adminResponseDate: new Date().toISOString()
    });

    showToast(`Status & tanggapan untuk aduan ${selectedComplaint.trackingCode} berhasil disimpan.`);
  };

  const handleQuickStatusChange = (id: string, newStatus: ComplaintStatus) => {
    updateComplaintStatus(id, newStatus);
    showToast(`Status aduan diperbarui menjadi: ${getStatusLabel(newStatus)}`);
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint({
        ...selectedComplaint,
        status: newStatus
      });
      setSelectedStatus(newStatus);
    }
  };

  const handleDelete = (id: string, trackingCode: string) => {
    if (window.confirm(`Yakin ingin menghapus laporan aduan ${trackingCode}? Data tidak dapat dikembalikan.`)) {
      deleteComplaint(id);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(null);
      }
      showToast(`Aduan ${trackingCode} berhasil dihapus.`);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(item => {
    const matchesSearch = 
      item.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specificLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesHamlet = hamletFilter === 'ALL' || item.hamlet === hamletFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesHamlet;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Verifikasi
          </span>
        );
      case 'DIVERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Diverifikasi
          </span>
        );
      case 'SEDANG_DITINDAKLANJUTI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse">
            <Clock className="w-3 h-3 text-indigo-600" />
            Sedang Ditindaklanjuti
          </span>
        );
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Selesai Ditangani
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ditolak
          </span>
        );
    }
  };

  const getStatusLabel = (status: ComplaintStatus) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI': return 'Menunggu Verifikasi';
      case 'DIVERIFIKASI': return 'Diverifikasi';
      case 'SEDANG_DITINDAKLANJUTI': return 'Sedang Ditindaklanjuti';
      case 'SELESAI': return 'Selesai';
      case 'DITOLAK': return 'Ditolak';
    }
  };

  const getWhatsAppLink = (complaint: CitizenComplaint) => {
    if (!complaint.phone) return null;
    let clean = complaint.phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1);
    }
    const message = `Halo Bapak/Ibu ${complaint.isAnonymous ? 'Warga' : complaint.reporterName}, ini dari Kantor Balai Desa Brabo mengonfirmasi Laporan Aduan Anda:\n\n` +
      `📌 *No. Resi:* ${complaint.trackingCode}\n` +
      `📋 *Judul:* ${complaint.title}\n` +
      `📊 *Status:* ${getStatusLabel(complaint.status)}\n` +
      (complaint.adminResponse ? `💬 *Tanggapan:* ${complaint.adminResponse}\n\n` : '\n') +
      `Terima kasih atas partisipasi aktif Anda dalam membangun Desa Brabo.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  };

  // Metrics
  const countPending = complaints.filter(c => c.status === 'MENUNGGU_VERIFIKASI').length;
  const countProcess = complaints.filter(c => c.status === 'SEDANG_DITINDAKLANJUTI' || c.status === 'DIVERIFIKASI').length;
  const countDone = complaints.filter(c => c.status === 'SELESAI').length;
  const countRejected = complaints.filter(c => c.status === 'DITOLAK').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Pusat Validasi Aduan
              </span>
              <span className="text-xs text-slate-500 font-medium">Koneksi Database Desa</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Validasi & Tindak Lanjut Aduan Warga
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tinjau laporan masyarakat Desa Brabo, verifikasi kebenaran laporan, berikan tanggapan resmi pemerintah desa, serta mutakhirkan status penanganan secara transparan.
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'ALL' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold opacity-80">Total Masuk</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black mt-2">{complaints.length}</p>
            <p className="text-[10px] opacity-70 mt-0.5">Semua laporan warga</p>
          </div>

          <div 
            onClick={() => setStatusFilter('MENUNGGU_VERIFIKASI')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'MENUNGGU_VERIFIKASI' 
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/70 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold opacity-90">Perlu Validasi</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black mt-2">{countPending}</p>
            <p className="text-[10px] opacity-80 mt-0.5">Menunggu respon admin</p>
          </div>

          <div 
            onClick={() => setStatusFilter('SEDANG_DITINDAKLANJUTI')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'SEDANG_DITINDAKLANJUTI' 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                : 'bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100/70 text-indigo-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold opacity-90">Diproses</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black mt-2">{countProcess}</p>
            <p className="text-[10px] opacity-80 mt-0.5">Sedang dalam pengerjaan</p>
          </div>

          <div 
            onClick={() => setStatusFilter('SELESAI')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'SELESAI' 
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
                : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold opacity-90">Selesai</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black mt-2">{countDone}</p>
            <p className="text-[10px] opacity-80 mt-0.5">Tuntas ditangani</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode resi, judul, pelapor, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              <option value="ALL">Semua Status Aduan</option>
              <option value="MENUNGGU_VERIFIKASI">⏳ Menunggu Verifikasi</option>
              <option value="DIVERIFIKASI">🛡️ Diverifikasi</option>
              <option value="SEDANG_DITINDAKLANJUTI">⚙️ Sedang Ditindaklanjuti</option>
              <option value="SELESAI">✅ Selesai Ditangani</option>
              <option value="DITOLAK">❌ Ditolak</option>
            </select>
          </div>

          <div className="sm:col-span-2">
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

          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Infrastruktur & Jalan">Infrastruktur</option>
              <option value="Pelayanan Publik">Pelayanan Publik</option>
              <option value="Kebersihan & Lingkungan">Kebersihan</option>
              <option value="Sosial & Bantuan">Sosial & Bantuan</option>
              <option value="Keamanan & Ketertiban">Keamanan</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Tidak ada aduan warga yang sesuai filter.</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau reset filter status di atas.</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => {
            const isPending = complaint.status === 'MENUNGGU_VERIFIKASI';
            return (
              <div 
                key={complaint.id}
                className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md space-y-4 ${
                  isPending 
                    ? 'border-amber-300 bg-amber-50/20 shadow-xs' 
                    : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => handleCopyCode(complaint.trackingCode)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                      title="Salin kode pelacakan"
                    >
                      <span>{complaint.trackingCode}</span>
                      {copiedCode === complaint.trackingCode ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {complaint.category}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(complaint.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(complaint.status)}
                  </div>
                </div>

                {/* Content body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Complaint text & reporter details */}
                  <div className="md:col-span-8 space-y-2.5">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {complaint.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {complaint.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pelapor: </span>
                        <strong className="text-slate-800">
                          {complaint.isAnonymous ? 'Anonim (Dirahasiakan)' : complaint.reporterName}
                        </strong>
                      </div>

                      {complaint.phone && (
                        <div className="flex items-center gap-1 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a 
                            href={`https://wa.me/${complaint.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{complaint.phone}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Lokasi: </span>
                        <strong className="text-slate-800">Dusun {complaint.hamlet}</strong>
                        {complaint.specificLocation && (
                          <span className="text-slate-500">({complaint.specificLocation})</span>
                        )}
                      </div>
                    </div>

                    {/* Existing Admin Response Preview */}
                    {complaint.adminResponse && (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-emerald-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            Tanggapan Resmi Desa ({complaint.officerInCharge || 'Pemerintah Desa'})
                          </span>
                          {complaint.adminResponseDate && (
                            <span className="text-[10px] text-emerald-700 font-normal">
                              {new Date(complaint.adminResponseDate).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-950 font-medium">{complaint.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Photo evidence & Quick Action controls */}
                  <div className="md:col-span-4 flex flex-col justify-between gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                    {/* Photo evidence */}
                    {complaint.photoUrl ? (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 block">Foto Bukti Lapangan:</span>
                        <div 
                          onClick={() => setPreviewPhoto(complaint.photoUrl!)}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-pointer h-28 bg-black/5"
                        >
                          <img 
                            src={complaint.photoUrl} 
                            alt="Bukti Aduan" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Maximize2 className="w-4 h-4" />
                            <span>Perbesar</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 bg-white rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-center p-2">
                        <span className="text-[11px] text-slate-400 italic">Tidak melampirkan foto</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleOpenDetail(complaint)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Validasi & Tanggapi</span>
                      </button>

                      {complaint.phone && getWhatsAppLink(complaint) && (
                        <a
                          href={getWhatsAppLink(complaint)!}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi via WhatsApp</span>
                        </a>
                      )}

                      <div className="grid grid-cols-2 gap-1.5">
                        {complaint.status !== 'SEDANG_DITINDAKLANJUTI' && (
                          <button
                            onClick={() => handleQuickStatusChange(complaint.id, 'SEDANG_DITINDAKLANJUTI')}
                            className="py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold border border-indigo-200 transition-colors"
                          >
                            Proses
                          </button>
                        )}
                        {complaint.status !== 'SELESAI' && (
                          <button
                            onClick={() => handleQuickStatusChange(complaint.id, 'SELESAI')}
                            className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors"
                          >
                            Selesai
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(complaint.id, complaint.trackingCode)}
                          className="col-span-2 py-1 px-2 rounded-lg hover:bg-rose-50 text-rose-600 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus Aduan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail & Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Panel Validasi & Tanggapan Resmi
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Aduan: {selectedComplaint.trackingCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complaint Info Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{selectedComplaint.title}</span>
                <span className="text-xs text-slate-500">{selectedComplaint.category}</span>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedComplaint.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block">Pelapor:</span>
                  <strong>{selectedComplaint.isAnonymous ? 'Anonim' : selectedComplaint.reporterName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Kontak WA:</span>
                  <strong>{selectedComplaint.phone || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Lokasi:</span>
                  <strong>Dusun {selectedComplaint.hamlet}</strong>
                </div>
              </div>
            </div>

            {/* Response & Status Form */}
            <form onSubmit={handleSaveResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Ubah Status Penanganan Aduan *
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="MENUNGGU_VERIFIKASI">⏳ Menunggu Verifikasi (Pending)</option>
                  <option value="DIVERIFIKASI">🛡️ Diverifikasi (Laporan Valid & Diterima)</option>
                  <option value="SEDANG_DITINDAKLANJUTI">⚙️ Sedang Ditindaklanjuti (Dalam Pengerjaan/Koordinasi)</option>
                  <option value="SELESAI">✅ Selesai Ditangani (Tuntas)</option>
                  <option value="DITOLAK">❌ Ditolak (Tidak Sesuai Ketentuan / Duplikat / Tidak Valid)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Status ini akan langsung tampil saat warga memeriksa kode resi <strong className="text-emerald-700">{selectedComplaint.trackingCode}</strong> di portal pelayanan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nama Petugas / Bidang yang Menangani
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kasi Kesejahteraan / Kadus Dukoh / Tim Tanggap Darurat Desa"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tulis Tanggapan Resmi Pemerintah Desa Brabo
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan keterangan tindakan yang telah diambil atau rencana jadwal peninjauan ke lapangan..."
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Keterangan ini dapat dibaca oleh warga pelapor secara transparan.
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  {selectedComplaint.phone && getWhatsAppLink(selectedComplaint) && (
                    <a
                      href={getWhatsAppLink(selectedComplaint)!}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim Info via WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simpan & Terbitkan Tanggapan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Full Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center relative">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewPhoto} 
              alt="Bukti Aduan" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
