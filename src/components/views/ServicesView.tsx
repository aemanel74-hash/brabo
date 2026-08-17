import React, { useState } from 'react';
import { useVillageData, LetterSubmission } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { OfficialLetterDocument, LetterDocumentData } from '../common/OfficialLetterDocument';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Printer, 
  Download, 
  Send, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  AlertCircle,
  Copy,
  QrCode,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle
} from 'lucide-react';
import { LetterTemplate } from '../../types';

interface ServicesViewProps {
  onOpenSource: (sourceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenSource }) => {
  const { letterTemplates, signatories, submitLetter, submissions } = useVillageData();

  // Active templates filter
  const activeTemplates = letterTemplates.filter(t => t.isActive);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate>(activeTemplates[0] || letterTemplates[0]);

  // Interactive Form State
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    gender: 'Laki-laki',
    placeOfBirth: 'Grobogan',
    dateOfBirth: '2000-01-01',
    religion: 'Islam',
    occupation: 'Petani / Wiraswasta',
    hamlet: 'Krajan',
    rt: '01',
    rw: '01',
    purpose: '',
    businessName: '',
    businessType: 'Perdagangan & Pertanian',
  });

  const [activeSubmission, setActiveSubmission] = useState<LetterSubmission | null>(null);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [searchedSubmission, setSearchedSubmission] = useState<LetterSubmission | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'tracking'>('form');

  const getRomanMonth = (monthIndex: number): string => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanMonths[monthIndex] || 'VIII';
  };

  const getFormattedDate = (): string => {
    const now = new Date();
    return `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  };

  const generateLetterNumber = (tpl: LetterTemplate, customNumber?: string): string => {
    if (customNumber) return customNumber;
    const now = new Date();
    const year = now.getFullYear();
    const romanMonth = getRomanMonth(now.getMonth());
    const randomNum = Math.floor(100 + Math.random() * 900);
    return tpl.letterNumberFormat
      .replace('{{nomor}}', String(randomNum))
      .replace('{{bulan_romawi}}', romanMonth)
      .replace('{{tahun}}', String(year));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nik) {
      alert('Mohon lengkapi Nama Lengkap dan NIK terlebih dahulu.');
      return;
    }

    const created = submitLetter({
      templateId: selectedTemplate.id,
      templateCode: selectedTemplate.code,
      serviceName: selectedTemplate.name,
      nik: formData.nik,
      fullName: formData.fullName,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth,
      dateOfBirth: formData.dateOfBirth,
      religion: formData.religion,
      occupation: formData.occupation,
      hamlet: formData.hamlet,
      rt: formData.rt,
      rw: formData.rw,
      purpose: formData.purpose || 'Persyaratan Administrasi Pelayanan Warga',
      businessName: formData.businessName,
      businessType: formData.businessType,
      customLetterNumber: generateLetterNumber(selectedTemplate),
    });

    setActiveSubmission(created);
    setViewMode('preview');
  };

  const handleTrackLetter = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(false);
    const query = trackingQuery.trim().toLowerCase();
    if (!query) return;

    const found = submissions.find(
      s => s.trackingCode.toLowerCase() === query || s.nik === query
    );

    if (found) {
      setSearchedSubmission(found);
      const matchedTemplate = letterTemplates.find(t => t.id === found.templateId || t.code === found.templateCode) || selectedTemplate;
      setSelectedTemplate(matchedTemplate);
      setActiveSubmission(found);
      setFormData({
        nik: found.nik,
        fullName: found.fullName,
        gender: found.gender,
        placeOfBirth: found.placeOfBirth,
        dateOfBirth: found.dateOfBirth,
        religion: found.religion,
        occupation: found.occupation,
        hamlet: found.hamlet,
        rt: found.rt,
        rw: found.rw,
        purpose: found.purpose,
        businessName: found.businessName || '',
        businessType: found.businessType || '',
      });
      setViewMode('preview');
    } else {
      setSearchedSubmission(null);
      setSearchError(true);
    }
  };

  // Prepare data for OfficialLetterDocument
  const previewDocumentData: LetterDocumentData = {
    trackingCode: activeSubmission ? activeSubmission.trackingCode : 'BRB-DRAFT',
    letterNumber: activeSubmission?.customLetterNumber || generateLetterNumber(selectedTemplate),
    dateStr: getFormattedDate(),
    template: selectedTemplate,
    formData,
    signatories,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden print:hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Pelayanan Mandiri & Bebas Pungli 100%
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Layanan Surat Digital Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Permudah pengajuan Surat Keterangan Usaha (SKU), SKTM, Surat Domisili, Surat Pengantar KTP/KK, Undangan Warga, dan Surat Keterangan lainnya secara online dengan format resmi standar Desa Brabo.
          </p>
        </div>
      </div>

      {/* Tracking Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 print:hidden">
        <form onSubmit={handleTrackLetter} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Lacak Status Berkas Surat:</span>
          </div>

          <div className="flex-1 flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Masukkan Kode Registrasi (cth: BRB-782190) atau NIK..."
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-colors"
            >
              Cek Status
            </button>
          </div>
        </form>

        {searchError && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Nomor registrasi atau NIK tidak ditemukan dalam sistem antrean surat desa. Silakan periksa kembali kodenya.</span>
          </div>
        )}

        {searchedSubmission && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-950">Berkas Surat Ditemukan: {searchedSubmission.serviceName}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                searchedSubmission.status === 'SELESAI_SIAP_AMBIL' ? 'bg-emerald-200 text-emerald-900' :
                searchedSubmission.status === 'DIPROSES' ? 'bg-blue-100 text-blue-900' :
                searchedSubmission.status === 'DITOLAK' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {searchedSubmission.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-700">Pemohon: <strong>{searchedSubmission.fullName}</strong> ({searchedSubmission.nik}) • Wilayah: Dusun {searchedSubmission.hamlet}, RT {searchedSubmission.rt}/RW {searchedSubmission.rw}</p>
            {searchedSubmission.notes && <p className="text-slate-600 italic">Catatan Petugas: {searchedSubmission.notes}</p>}
          </div>
        )}
      </div>

      {/* Mode Selector Tabs (Formulir vs Preview Cetak) */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'form'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Pilih Format & Isi Formulir
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'preview'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Pratinjau Surat & Cetak A4 / PDF
          </button>
        </div>

        {activeSubmission && (
          <span className="text-xs text-emerald-800 font-bold hidden sm:inline-flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Surat Aktif: {activeSubmission.trackingCode}
          </span>
        )}
      </div>

      {/* VIEW MODE: FORM */}
      {viewMode === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
          {/* Left Column: Template Selection */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Pilih Jenis Surat
            </h3>

            <div className="space-y-2">
              {activeTemplates.map((template) => {
                const isSelected = selectedTemplate.id === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setActiveSubmission(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                        {template.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                        {template.code}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {template.perihal}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Template Requirements Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Persyaratan Berkas:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                {selectedTemplate.requirements?.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Biaya Retribusi:</span>
                <strong className="text-emerald-700 font-bold">Gratis (Rp 0,-)</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Citizen Data Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Formulir Permohonan: {selectedTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lengkapi identitas sesuai KTP/KK untuk pencetakan surat otomatis dan verifikasi registrasi desa.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  Format Baku Desa
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Induk Kependudukan (NIK) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="Contoh: 3315170204910001"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap (Sesuai KTP) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Slamet Riyadi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      placeholder="Grobogan"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dusun Domisili
                    </label>
                    <select
                      value={formData.hamlet}
                      onChange={(e) => setFormData({ ...formData, hamlet: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Krajan">Dusun II Krajan</option>
                      <option value="Dukoh">Dusun I Dukoh</option>
                      <option value="Cangkring">Dusun III Cangkring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rukun Tetangga (RT)
                    </label>
                    <input
                      type="text"
                      placeholder="01"
                      value={formData.rt}
                      onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rukun Warga (RW)
                    </label>
                    <input
                      type="text"
                      placeholder="01"
                      value={formData.rw}
                      onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Agama
                    </label>
                    <select
                      value={formData.religion}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      placeholder="Petani / Pedagang / Wiraswasta"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Specific Fields for SKU */}
                {selectedTemplate.code === 'SKU' && (
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-950">
                      Rincian Usaha Pemohon:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Usaha / Toko
                        </label>
                        <input
                          type="text"
                          placeholder="Toko Berkah Tani Brabo"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Bidang / Jenis Usaha
                        </label>
                        <input
                          type="text"
                          placeholder="Perdagangan Pupuk & Hasil Bumi"
                          value={formData.businessType}
                          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keperluan / Peruntukan Surat
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Persyaratan pengajuan beasiswa, pinjaman bank, atau pendaftaran sekolah..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Pratinjau Langsung
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ajukan & Buat Surat Resmi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: PREVIEW / CETAK A4 / PDF */}
      {viewMode === 'preview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={() => setViewMode('form')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembali Edit Data Formulir</span>
            </button>
          </div>

          <OfficialLetterDocument
            data={previewDocumentData}
            onPrint={() => window.print()}
            showActions={true}
          />
        </div>
      )}
    </div>
  );
};
