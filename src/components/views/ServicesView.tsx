import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { DocumentTemplate, CitizenComplaint, ComplaintStatus, LetterSubmission } from '../../types';
import { PhotoUploadInput } from '../common/PhotoUploadInput';
import { DocumentUploadInput } from '../common/DocumentUploadInput';
import { 
  FileText, 
  Download, 
  Search, 
  Clock, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Send, 
  Building, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  FileCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Eye, 
  UploadCloud, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Phone,
  Lock,
  ChevronDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ServicesViewProps {
  onOpenSource: (sourceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenSource }) => {
  const { letterTemplates, submissions, submitLetter, complaints, submitComplaint } = useVillageData();

  // Primary tab: 'templates' (Layanan Format Berkas & Surat) or 'aduan' (Lapor / Aduan Masyarakat)
  const [activeTab, setActiveTab] = useState<'templates' | 'aduan'>('templates');

  // Templates Filter & Selection
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(letterTemplates[0] || null);

  // Template Submission Modal / Form State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    nik: '',
    fullName: '',
    phone: '',
    gender: 'Laki-laki',
    placeOfBirth: 'Grobogan',
    dateOfBirth: '2000-01-01',
    religion: 'Islam',
    occupation: 'Petani / Wiraswasta',
    hamlet: 'Dusun Krajan',
    rt: '01',
    rw: '01',
    purpose: '',
    businessName: '',
    businessType: '',
    uploadedFileUrl: '',
    uploadedFileName: '',
    ktpPhotoUrl: '',
    kkPhotoUrl: '',
  });
  const [activeReceipt, setActiveReceipt] = useState<LetterSubmission | null>(null);

  // Tracking Submissions (Cek Status Berkas)
  const [letterTrackingQuery, setLetterTrackingQuery] = useState('');
  const [searchedSubmission, setSearchedSubmission] = useState<LetterSubmission | null>(null);
  const [submissionSearchError, setSubmissionSearchError] = useState(false);

  // Complaints / Aduan State
  const [complaintForm, setComplaintForm] = useState({
    authorName: '',
    isAnonymous: false,
    authorPhone: '',
    authorNik: '',
    category: 'INFRASTRUKTUR' as CitizenComplaint['category'],
    title: '',
    description: '',
    hamlet: 'Dusun Krajan',
    locationDetail: '',
    evidencePhotoUrl: '',
  });
  const [complaintReceipt, setComplaintReceipt] = useState<CitizenComplaint | null>(null);

  // Tracking Complaints
  const [complaintTrackingQuery, setComplaintTrackingQuery] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<CitizenComplaint | null>(null);
  const [complaintSearchError, setComplaintSearchError] = useState(false);

  // Filter Categories
  const categories = ['ALL', 'Kependudukan', 'Usaha', 'Sosial & Bantuan', 'Pertanahan & Bangunan', 'Umum'];

  const filteredTemplates = letterTemplates.filter((tpl) => {
    if (!tpl.isActive) return false;
    const matchCat = selectedCategory === 'ALL' || tpl.category === selectedCategory;
    const matchSearch =
      tpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.code.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.description.toLowerCase().includes(templateSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handle Letter Submission
  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    if (!submissionForm.fullName.trim() || !submissionForm.nik.trim()) {
      alert('Mohon lengkapi Nama Lengkap dan NIK terlebih dahulu.');
      return;
    }

    const created = submitLetter({
      templateId: selectedTemplate.id,
      templateCode: selectedTemplate.code,
      serviceName: selectedTemplate.name,
      nik: submissionForm.nik,
      fullName: submissionForm.fullName,
      gender: submissionForm.gender,
      placeOfBirth: submissionForm.placeOfBirth,
      dateOfBirth: submissionForm.dateOfBirth,
      religion: submissionForm.religion,
      occupation: submissionForm.occupation,
      hamlet: submissionForm.hamlet,
      rt: submissionForm.rt,
      rw: submissionForm.rw,
      purpose: submissionForm.purpose || `Pengajuan ${selectedTemplate.name}`,
      businessName: submissionForm.businessName,
      businessType: submissionForm.businessType,
      uploadedFileUrl: submissionForm.uploadedFileUrl,
      uploadedFileName: submissionForm.uploadedFileName,
      ktpPhotoUrl: submissionForm.ktpPhotoUrl,
      kkPhotoUrl: submissionForm.kkPhotoUrl,
    });

    setActiveReceipt(created);
    setShowApplyModal(false);
  };

  // Handle Tracking Search
  const handleTrackLetter = (e: React.FormEvent) => {
    e.preventDefault();
    const query = letterTrackingQuery.trim().toUpperCase();
    if (!query) return;

    const found = submissions.find(
      (s) => s.trackingCode.toUpperCase() === query || s.nik === query
    );
    if (found) {
      setSearchedSubmission(found);
      setSubmissionSearchError(false);
    } else {
      setSearchedSubmission(null);
      setSubmissionSearchError(true);
    }
  };

  // Handle Complaint Submission
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) {
      alert('Mohon lengkapi Judul Aduan dan Rincian Laporan.');
      return;
    }

    const created = submitComplaint({
      authorName: complaintForm.isAnonymous ? 'Warga Anonim' : complaintForm.authorName || 'Warga Desa',
      isAnonymous: complaintForm.isAnonymous,
      authorPhone: complaintForm.authorPhone,
      authorNik: complaintForm.authorNik,
      category: complaintForm.category,
      title: complaintForm.title,
      description: complaintForm.description,
      hamlet: complaintForm.hamlet,
      locationDetail: complaintForm.locationDetail,
      evidencePhotoUrl: complaintForm.evidencePhotoUrl,
    });

    setComplaintReceipt(created);
    // Reset Form
    setComplaintForm({
      authorName: '',
      isAnonymous: false,
      authorPhone: '',
      authorNik: '',
      category: 'INFRASTRUKTUR',
      title: '',
      description: '',
      hamlet: 'Dusun Krajan',
      locationDetail: '',
      evidencePhotoUrl: '',
    });
  };

  // Handle Complaint Tracking Search
  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const query = complaintTrackingQuery.trim().toUpperCase();
    if (!query) return;

    const found = complaints.find(
      (c) => c.trackingCode.toUpperCase() === query || c.authorNik === query
    );
    if (found) {
      setSearchedComplaint(found);
      setComplaintSearchError(false);
    } else {
      setSearchedComplaint(null);
      setComplaintSearchError(true);
    }
  };

  const getStatusBadge = (status: ComplaintStatus | LetterSubmission['status']) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
          </span>
        );
      case 'DIPROSES':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sedang Diproses
          </span>
        );
      case 'SELESAI_SIAP_AMBIL':
      case 'SELESAI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" /> Selesai / Siap Diambil
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Ditolak / Perlu Perbaikan
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'INFRASTRUKTUR':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'PELAYANAN_PUBLIK':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'KEAMANAN_KETERTIBAN':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'SOSIAL_BANTUAN':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'LINGKUNGAN':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'PERTANIAN_IRIGASI':
        return 'bg-lime-100 text-lime-900 border-lime-200';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Building className="w-3.5 h-3.5" />
            <span>Pusat Pelayanan Terpadu & Aspirasi Warga Desa Brabo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Layanan Persuratan & Kanal Aduan Masyarakat
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Unduh berkas format surat resmi, pelajari syarat & prosedur pengajuan, ajukan berkas secara mandiri, atau laporkan permasalahan lingkungan secara transparan.
          </p>

          {/* Tab Selector */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white text-emerald-950 shadow-lg scale-102'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 border border-emerald-700/50'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Format Berkas & Template Surat</span>
            </button>
            <button
              onClick={() => setActiveTab('aduan')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'aduan'
                  ? 'bg-amber-400 text-amber-950 shadow-lg scale-102 font-extrabold'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 border border-emerald-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Aduan & Lapor Warga (Resmi)</span>
              {complaints.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-200 font-black">
                  {complaints.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: FORMAT BERKAS & TEMPLATE SURAT DENGAN FILE UPLOAD/DOWNLOAD */}
      {/* ========================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-8">
          {/* Quick Tracking Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Lacak Status Berkas Pengajuan Mandiri
              </h2>
              <p className="text-xs text-slate-500">
                Masukkan Kode Registrasi (Contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">BRB-782190</code>) atau NIK Pemohon
              </p>
            </div>

            <form onSubmit={handleTrackLetter} className="flex gap-2 w-full md:w-auto md:min-w-[340px]">
              <input
                type="text"
                placeholder="BRB-XXXXXX atau NIK 16 digit..."
                value={letterTrackingQuery}
                onChange={(e) => setLetterTrackingQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono uppercase bg-slate-50/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Status</span>
              </button>
            </form>
          </div>

          {/* Searched Letter Result */}
          {searchedSubmission && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      {searchedSubmission.trackingCode}
                    </span>
                    <h3 className="text-sm font-bold text-emerald-950">{searchedSubmission.serviceName}</h3>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">Pemohon: <span className="font-bold">{searchedSubmission.fullName}</span> (NIK: {searchedSubmission.nik})</p>
                </div>
                <div>{getStatusBadge(searchedSubmission.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-900">
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">Waktu Pengajuan</span>
                  <span className="font-bold">{searchedSubmission.submittedAt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">Nomor Surat Resmi</span>
                  <span className="font-bold font-mono">{searchedSubmission.customLetterNumber || 'Sedang Diproses Desa'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">Jadwal Pengambilan</span>
                  <span className="font-bold">{searchedSubmission.pickupSchedule || 'Balai Desa (Jam Kerja 08:00-14:00)'}</span>
                </div>
              </div>

              {searchedSubmission.notes && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Catatan Petugas Pelayanan: </span>
                    <span>{searchedSubmission.notes}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {submissionSearchError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Kode registrasi atau NIK tidak ditemukan dalam antrean berkas. Mohon periksa kembali kode Anda.</span>
            </div>
          )}

          {/* Submission Success Receipt (if just submitted) */}
          {activeReceipt && (
            <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-950 to-slate-900 text-white shadow-xl space-y-4 border border-emerald-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pengajuan Berkas Berhasil Dikirimkan!</h3>
                  <p className="text-xs text-emerald-200">Petugas Balai Desa Brabo akan memvalidasi permohonan Anda.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-emerald-300 block">KODE PELACAKAN RESMI (SIMPAN KODE INI)</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                    {activeReceipt.trackingCode}
                  </span>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-emerald-300 block">Layanan</span>
                  <span className="text-xs font-bold text-white">{activeReceipt.serviceName}</span>
                </div>
              </div>

              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Anda dapat mengambil surat resmi yang telah bertanda tangan Kepala Desa & berstempel di Kantor Balai Desa Brabo pada hari kerja (Senin - Jumat, 08.00 - 14.00 WIB) dengan menunjukkan KTP asli.
              </p>
            </div>
          )}

          {/* Main Document Templates Grid & Rules */}
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Format Dokumen' : cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama surat / kode (SKU, SKTM, dll)..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                />
              </div>
            </div>

            {/* List of Document Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono text-[11px] font-extrabold">
                            {tpl.code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {tpl.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{tpl.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] shrink-0">
                        {tpl.fileType || 'DOCX'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Estimasi: {tpl.estimatedProcessingTime || '15 - 30 Menit'}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 font-bold text-emerald-800">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Biaya: {tpl.cost || 'Gratis (Rp 0)'}</span>
                      </div>
                    </div>

                    {/* Rules & Requirements Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Syarat & Berkas Persyaratan (Rules):</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1 pl-1">
                        {(tpl.requirements || [
                          'KTP Asli & Fotokopi Pemohon',
                          'Kartu Keluarga (KK) Desa Brabo',
                          'Surat Pengantar dari Ketua RT dan RW setempat',
                        ]).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Procedural Steps / Alur */}
                    {tpl.proceduralSteps && tpl.proceduralSteps.length > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-950 space-y-1.5">
                        <span className="font-bold flex items-center gap-1 text-emerald-900">
                          <Info className="w-3.5 h-3.5 text-emerald-700" /> Alur Pengajuan:
                        </span>
                        <div className="space-y-1 pl-1 text-slate-700">
                          {tpl.proceduralSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Download Template & Apply Online */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {tpl.fileUrl ? (
                      <a
                        href={tpl.fileUrl}
                        download={tpl.fileName || `${tpl.code}_Template.docx`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Unduh Format Template</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          // Fallback trigger if admin hasn't attached a direct file url
                          alert('Format template dapat diunduh langsung atau diajukan secara online di bawah ini.');
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Format Standar</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setShowApplyModal(true);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ajukan Online</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Tidak ada template dokumen yang cocok dengan pencarian.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ADUAN & LAPORAN MASYARAKAT (TERKONEKSI DATABASE & STATUS) */}
      {/* ========================================================= */}
      {activeTab === 'aduan' && (
        <div className="space-y-8">
          {/* Tracking Bar for Aduan */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-700" />
                Lacak Perkembangan Aduan Anda
              </h2>
              <p className="text-xs text-amber-800">
                Masukkan Kode Aduan (Contoh: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-mono font-bold">ADU-849201</code>) atau NIK Anda
              </p>
            </div>

            <form onSubmit={handleTrackComplaint} className="flex gap-2 w-full md:w-auto md:min-w-[340px]">
              <input
                type="text"
                placeholder="ADU-XXXXXX atau NIK..."
                value={complaintTrackingQuery}
                onChange={(e) => setComplaintTrackingQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono uppercase bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lacak Aduan</span>
              </button>
            </form>
          </div>

          {/* Searched Complaint Detail Result */}
          {searchedComplaint && (
            <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                      {searchedComplaint.trackingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(searchedComplaint.category)}`}>
                      {searchedComplaint.category}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{searchedComplaint.title}</h3>
                  <p className="text-xs text-slate-500">
                    Pelapor: <span className="font-bold text-slate-700">{searchedComplaint.isAnonymous ? 'Anonim (Dirahasiakan)' : searchedComplaint.authorName}</span> &bull; {searchedComplaint.hamlet} ({searchedComplaint.createdAt})
                  </p>
                </div>
                <div>{getStatusBadge(searchedComplaint.status)}</div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Rincian Kronologi & Aduan:</span>
                <p className="leading-relaxed">{searchedComplaint.description}</p>
                {searchedComplaint.locationDetail && (
                  <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi: {searchedComplaint.locationDetail}
                  </p>
                )}
              </div>

              {/* Photo Evidence if any */}
              {searchedComplaint.evidencePhotoUrl && (
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">Foto Bukti Lampiran:</span>
                  <img
                    src={searchedComplaint.evidencePhotoUrl}
                    alt="Bukti Aduan"
                    className="w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                </div>
              )}

              {/* Live Status Progress & Official Admin Response */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Tindak Lanjut & Validasi Pemerintah Desa:
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-800">
                    Petugas: {searchedComplaint.officerInCharge || 'Aparat Desa Brabo'}
                  </span>
                </div>

                {searchedComplaint.adminResponse ? (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="leading-relaxed font-medium">{searchedComplaint.adminResponse}</p>
                    {searchedComplaint.adminResponseDate && (
                      <span className="text-[10px] text-slate-400 block text-right">
                        Diperbarui: {searchedComplaint.adminResponseDate}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800 italic">
                    Aduan telah masuk ke dalam antrean validasi perangkat desa. Tim teknis akan memeriksa laporan ini segera.
                  </p>
                )}
              </div>
            </div>
          )}

          {complaintSearchError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Nomor aduan atau NIK tidak ditemukan. Pastikan Anda memasukkan kode dengan benar (contoh: ADU-849201).</span>
            </div>
          )}

          {/* New Complaint Success Receipt */}
          {complaintReceipt && (
            <div className="p-6 rounded-3xl bg-linear-to-br from-amber-950 to-slate-900 text-white shadow-xl space-y-4 border border-amber-700/40 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Laporan Aduan Berhasil Diterima Sistem!</h3>
                  <p className="text-xs text-amber-200">Aparat Desa Brabo akan memvalidasi dan memproses tindak lanjut.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-900/40 border border-amber-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-amber-300 block">KODE LACAK ADUAN RESMI</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                    {complaintReceipt.trackingCode}
                  </span>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-amber-300 block">Kategori</span>
                  <span className="text-xs font-bold text-white">{complaintReceipt.category}</span>
                </div>
              </div>

              <p className="text-xs text-amber-100/90 leading-relaxed">
                Terima kasih atas partisipasi Anda dalam membangun Desa Brabo yang lebih tertib dan maju. Anda dapat memeriksa perkembangan tindak lanjut melalui formulir lacak aduan sewaktu-waktu.
              </p>
            </div>
          )}

          {/* Grid Layout: Form Input on Left, Transparency Feed on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Input Lapor Aduan */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Formulir Aduan & Aspirasi Masyarakat</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Sampaikan Aspirasi atau Laporan Masalah
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporan Anda akan ditindaklanjuti langsung oleh perangkat desa terkait (Pamong, BPD, Kadus, atau Seksi Pelayanan).
                </p>
              </div>

              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                {/* Anonymous Toggle */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Kirim Sebagai Anonim (Rahasiakan Nama)</span>
                      <span className="text-[10px] text-slate-500">Identitas Anda tidak akan ditampilkan ke publik</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={complaintForm.isAnonymous}
                    onChange={(e) => setComplaintForm({ ...complaintForm, isAnonymous: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </div>

                {!complaintForm.isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap Pelapor <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={complaintForm.authorName}
                        onChange={(e) => setComplaintForm({ ...complaintForm, authorName: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp / HP (Opsional)
                      </label>
                      <input
                        type="tel"
                        placeholder="0812-XXXX-XXXX"
                        value={complaintForm.authorPhone}
                        onChange={(e) => setComplaintForm({ ...complaintForm, authorPhone: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori Laporan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={complaintForm.category}
                      onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    >
                      <option value="INFRASTRUKTUR">Infrastruktur, Jalan & Jembatan</option>
                      <option value="PELAYANAN_PUBLIK">Pelayanan Administrasi & Kantor</option>
                      <option value="PERTANIAN_IRIGASI">Pertanian & Saluran Irigasi</option>
                      <option value="SOSIAL_BANTUAN">Sosial, Bansos & Kesehatan</option>
                      <option value="LINGKUNGAN">Lingkungan Hidup & Sampah</option>
                      <option value="KEAMANAN_KETERTIBAN">Keamanan & Ketertiban Warga</option>
                      <option value="LAINNYA">Lainnya / Aspirasi Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wilayah Dusun <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={complaintForm.hamlet}
                      onChange={(e) => setComplaintForm({ ...complaintForm, hamlet: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    >
                      <option value="Dusun Krajan">Dusun Krajan</option>
                      <option value="Dusun Dukoh">Dusun Dukoh</option>
                      <option value="Dusun Cangkring">Dusun Cangkring</option>
                      <option value="Wilayah Desa Brabo Umum">Wilayah Desa Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Aduan / Pokok Masalah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lampu Penerangan Jalan Rusak di Dekat Lapangan Dusun Cangkring"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Uraian Detail Laporan / Kronologi <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Jelaskan secara jelas kendala atau masalah yang dialami, waktu kejadian, dan dampaknya bagi warga sekitar..."
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lokasi Spesifik / Patokan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: RT 03 RW 02, sebelah barat Musala Sirojut Tholibin"
                    value={complaintForm.locationDetail}
                    onChange={(e) => setComplaintForm({ ...complaintForm, locationDetail: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Evidence Photo Upload */}
                <PhotoUploadInput
                  label="Foto Bukti Lapangan (Opsional)"
                  value={complaintForm.evidencePhotoUrl}
                  onChange={(url) => setComplaintForm({ ...complaintForm, evidencePhotoUrl: url })}
                  folderName="aduan_warga"
                  placeholder="Unggah foto bukti kerusakan / kendala lapangan..."
                  helperText="Format JPG, PNG (otomatis dioptimalkan untuk kecepatan akses)"
                />

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-950/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan Aduan ke Balai Desa Brabo</span>
                </button>
              </form>
            </div>

            {/* Right: Public Transparency Feed */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Transparansi Aduan Warga
                    </h3>
                    <p className="text-[11px] text-slate-500">Status penyelesaian masalah di Desa Brabo</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                    {complaints.length} Laporan
                  </span>
                </div>

                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                  {complaints.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-black text-slate-500">
                          {item.trackingCode}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {item.adminResponse && (
                        <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200 space-y-0.5">
                          <span className="font-bold flex items-center gap-1 text-emerald-950">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tanggapan Desa:
                          </span>
                          <p className="text-emerald-900 leading-tight">{item.adminResponse}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>{item.hamlet}</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  ))}

                  {complaints.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Belum ada aduan warga yang tercatat.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJUKAN BERKAS ONLINE (FILE ATTACHMENT & FORM) */}
      {/* ========================================================= */}
      {showApplyModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-black">
                    {selectedTemplate.code}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{selectedTemplate.category}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Pengajuan {selectedTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Rules Reminder */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Persyaratan Pengajuan:
              </span>
              <ul className="list-disc list-inside text-[11px] text-amber-900/90 pl-1 space-y-0.5">
                {(selectedTemplate.requirements || ['KTP Asli', 'KK', 'Pengantar RT/RW']).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleLetterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="331517XXXXXXXXXX"
                    value={submissionForm.nik}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, nik: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama sesuai KTP"
                    value={submissionForm.fullName}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dusun</label>
                  <select
                    value={submissionForm.hamlet}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, hamlet: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="Dusun Krajan">Dusun Krajan</option>
                    <option value="Dusun Dukoh">Dusun Dukoh</option>
                    <option value="Dusun Cangkring">Dusun Cangkring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RT / RW</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="RT 01"
                      value={submissionForm.rt}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, rt: e.target.value })}
                      className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="RW 01"
                      value={submissionForm.rw}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, rw: e.target.value })}
                      className="w-1/2 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    placeholder="Petani / Pedagang"
                    value={submissionForm.occupation}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, occupation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* SKU specific fields */}
              {selectedTemplate.code === 'SKU' && (
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-950 block">Rincian Data Usaha:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Usaha (contoh: Toko Pupuk Berkah)"
                      value={submissionForm.businessName}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, businessName: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Bidang Usaha (contoh: Pertanian & Hasil Bumi)"
                      value={submissionForm.businessType}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, businessType: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keperluan / Peruntukan Surat
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pengajuan pinjaman KUR BRI, beasiswa pendidikan, atau pendaftaran sekolah..."
                  value={submissionForm.purpose}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Upload Berkas Hasil Pengisian / Formulir yang telah diisi */}
              <DocumentUploadInput
                label="Unggah File Formulir yang Sudah Diisi / Berkas Pendukung (Opsional)"
                fileUrl={submissionForm.uploadedFileUrl}
                fileName={submissionForm.uploadedFileName}
                onFileChange={(url, name) => {
                  setSubmissionForm({ ...submissionForm, uploadedFileUrl: url, uploadedFileName: name });
                }}
                folderName="pengajuan_warga"
                helperText="Mendukung DOCX, PDF, JPG foto formulir bertanda tangan RT/RW"
              />

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Permohonan Surat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
