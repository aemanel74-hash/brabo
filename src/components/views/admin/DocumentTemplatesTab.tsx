import React, { useState } from 'react';
import { useVillageData } from '../../../context/VillageDataContext';
import { DocumentTemplate, DocumentCategory } from '../../../types';
import { DocumentUploadInput } from '../../common/DocumentUploadInput';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Download, 
  Check, 
  X, 
  Sliders, 
  Clock, 
  DollarSign, 
  ListChecks, 
  ArrowRight, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertCircle,
  Eye
} from 'lucide-react';

const CATEGORIES: DocumentCategory[] = [
  'Kependudukan',
  'Perizinan & Usaha',
  'Sosial & Kesejahteraan',
  'Keterangan Umum',
  'Pertanahan & Waris',
];

export const DocumentTemplatesTab: React.FC = () => {
  const { 
    letterTemplates, 
    addLetterTemplate, 
    updateLetterTemplate, 
    duplicateLetterTemplate, 
    deleteLetterTemplate 
  } = useVillageData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DocumentTemplate>>({
    code: '',
    name: '',
    category: 'Kependudukan',
    description: '',
    fileUrl: '',
    fileName: '',
    fileType: 'DOCX',
    fileSizeBytes: 0,
    estimatedProcessingTime: '1 Hari Kerja',
    cost: 'Gratis (Rp 0)',
    isActive: true,
    requirements: ['KTP Asli / Fotokopi Pemohon', 'Kartu Keluarga (KK)'],
    proceduralSteps: [
      'Unduh template berkas formulir resmi di portal ini.',
      'Cetak dan isi lengkap data yang dibutuhkan.',
      'Minta tanda tangan pengantar Ketua RT & RW setempat.',
      'Unggah kembali hasil scan/foto berkas ke portal ini atau serahkan ke Balai Desa.'
    ],
    targetOfficer: 'Kaur Umum & Perencanaan'
  });

  // Dynamic input fields for requirements & steps
  const [newRequirement, setNewRequirement] = useState('');
  const [newStep, setNewStep] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartCreate = () => {
    setEditingTemplate(null);
    setFormData({
      code: `F-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Kependudukan',
      description: '',
      fileUrl: '',
      fileName: '',
      fileType: 'DOCX',
      fileSizeBytes: 0,
      estimatedProcessingTime: '1 Hari Kerja',
      cost: 'Gratis (Rp 0)',
      isActive: true,
      requirements: ['KTP Asli / Fotokopi Pemohon', 'Kartu Keluarga (KK)'],
      proceduralSteps: [
        'Unduh template berkas formulir resmi di portal ini.',
        'Cetak dan isi lengkap data yang dibutuhkan.',
        'Minta tanda tangan pengantar Ketua RT & RW setempat.',
        'Unggah kembali hasil scan/foto berkas ke portal ini atau serahkan ke Balai Desa.'
      ],
      targetOfficer: 'Kaur Umum & Perencanaan'
    });
    setIsCreating(true);
  };

  const handleStartEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      ...template,
      requirements: template.requirements || ['KTP Asli / Fotokopi Pemohon'],
      proceduralSteps: template.proceduralSteps || [
        'Unduh template berkas formulir resmi di portal ini.',
        'Cetak dan isi lengkap data.',
        'Minta pengantar RT/RW setempat.',
        'Serahkan ke Balai Desa atau kirim via portal.'
      ]
    });
    setIsCreating(false);
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    const current = formData.requirements || [];
    setFormData({
      ...formData,
      requirements: [...current, newRequirement.trim()]
    });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
    const current = formData.requirements || [];
    setFormData({
      ...formData,
      requirements: current.filter((_, i) => i !== index)
    });
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    const current = formData.proceduralSteps || [];
    setFormData({
      ...formData,
      proceduralSteps: [...current, newStep.trim()]
    });
    setNewStep('');
  };

  const handleRemoveStep = (index: number) => {
    const current = formData.proceduralSteps || [];
    setFormData({
      ...formData,
      proceduralSteps: current.filter((_, i) => i !== index)
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Nama formulir dan kode berkas wajib diisi.');
      return;
    }

    if (editingTemplate) {
      updateLetterTemplate(editingTemplate.id, formData);
      showToast(`Template berkas ${formData.name} berhasil diperbarui.`);
    } else {
      addLetterTemplate({
        code: formData.code || `F-${Date.now()}`,
        name: formData.name || 'Formulir Baru',
        category: formData.category || 'Kependudukan',
        description: formData.description || '',
        fileUrl: formData.fileUrl || '',
        fileName: formData.fileName || 'template_dokumen.docx',
        fileType: formData.fileType || 'DOCX',
        fileSizeBytes: formData.fileSizeBytes || 0,
        estimatedProcessingTime: formData.estimatedProcessingTime || '1 Hari Kerja',
        cost: formData.cost || 'Gratis (Rp 0)',
        isActive: formData.isActive !== false,
        requirements: formData.requirements || ['KTP', 'Kartu Keluarga'],
        proceduralSteps: formData.proceduralSteps || ['Unduh template', 'Isi data', 'Bawa ke balai desa'],
        targetOfficer: formData.targetOfficer || 'Pamong Desa'
      });
      showToast(`Template berkas baru ${formData.name} berhasil ditambahkan.`);
    }

    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateLetterTemplate(id);
    showToast('Salinan template berhasil dibuat.');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus template formulir "${name}"?`)) {
      deleteLetterTemplate(id);
      showToast(`Template "${name}" telah dihapus.`);
    }
  };

  const filteredTemplates = letterTemplates.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200">
                Model File Upload & Download
              </span>
              <span className="text-xs text-slate-500 font-medium">{letterTemplates.length} Format Berkas</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              Manajemen Format Surat & Berkas Desa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              Unggah file template master (DOCX, PDF, DOC), atur syarat dokumen permohonan (rules), dan susun alur panduan pengajuan bagi warga Desa Brabo.
            </p>
          </div>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Format Berkas Baru</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama surat, kode formulir, atau keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
            >
              <option value="ALL">Semua Kategori Berkas</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Editor Modal / Form */}
      {(isCreating || editingTemplate) && (
        <form 
          onSubmit={handleSaveForm}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-500 space-y-6 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {editingTemplate ? `Edit Format Berkas: ${editingTemplate.name}` : 'Buat Format Berkas Baru'}
                </h4>
                <p className="text-xs text-slate-500">
                  Lengkapi data dokumen, unggah file master, dan tentukan syarat & alur permohonan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTemplate(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kode Berkas *</label>
              <input
                type="text"
                required
                placeholder="Contoh: F-DOMISILI, F-SKU, F-SKCK"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Judul Berkas / Surat *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Formulir Surat Keterangan Domisili"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Dokumen *</label>
              <select
                value={formData.category || 'Kependudukan'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Peruntukan Dokumen</label>
              <textarea
                rows={2}
                placeholder="Keterangan singkat kegunaan dokumen ini..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h5 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Unggah File Master Template Berkas (Word / PDF / Excel)</span>
            </h5>
            <DocumentUploadInput
              label="File Template Dokumen"
              fileUrl={formData.fileUrl || ''}
              fileName={formData.fileName || ''}
              folderName="template_surat"
              helperText="Unggah file DOCX, PDF, DOC, atau ZIP yang akan diunduh warga untuk diisi."
              onFileChange={(url, name, size, type) => {
                setFormData({
                  ...formData,
                  fileUrl: url,
                  fileName: name,
                  fileSizeBytes: size || 0,
                  fileType: type || 'DOCX'
                });
              }}
            />
          </div>

          {/* Operational Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Waktu Proses</label>
              <input
                type="text"
                placeholder="1 Hari Kerja / Langsung Jadi"
                value={formData.estimatedProcessingTime || ''}
                onChange={(e) => setFormData({ ...formData, estimatedProcessingTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biaya Administrasi</label>
              <input
                type="text"
                placeholder="Gratis (Rp 0)"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Petugas / Bidang Penanggung Jawab</label>
              <input
                type="text"
                placeholder="Kaur Umum & Perencanaan / Kasi Pelayanan"
                value={formData.targetOfficer || ''}
                onChange={(e) => setFormData({ ...formData, targetOfficer: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Rules & Requirements Editor */}
          <div className="space-y-3 p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-amber-700" />
                <span>Rules & Persyaratan Dokumen yang Wajib Disiapkan Warga:</span>
              </label>
              <span className="text-[11px] text-amber-800 font-semibold">
                {(formData.requirements || []).length} Syarat
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik syarat baru (contoh: Surat Pengantar RT/RW, Fotokopi KTP, dll)..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Tambah Syarat
              </button>
            </div>

            {/* List tags */}
            <div className="space-y-1.5 pt-1">
              {(formData.requirements || []).map((req, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Procedural Steps Editor */}
          <div className="space-y-3 p-5 rounded-2xl bg-blue-50/50 border border-blue-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 text-blue-700" />
                <span>Alur & Panduan Tata Cara Permohonan bagi Pemohon:</span>
              </label>
              <span className="text-[11px] text-blue-800 font-semibold">
                {(formData.proceduralSteps || []).length} Langkah
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik langkah baru (contoh: Minta verifikasi Kadus Dukoh)..."
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Tambah Langkah
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {(formData.proceduralSteps || []).map((step, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active status checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={formData.isActive !== false}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
              Format berkas aktif dan dapat diunduh oleh warga
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTemplate(null);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              {editingTemplate ? 'Simpan Perubahan Berkas' : 'Terbitkan Format Berkas'}
            </button>
          </div>
        </form>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Tidak ada template berkas yang sesuai filter.</p>
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
            >
              + Buat Template Berkas Baru
            </button>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const hasFile = !!template.fileUrl;
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 uppercase">
                      {template.code}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {template.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        template.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {template.isActive !== false ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{template.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {template.description || 'Format berkas resmi Pemerintah Desa Brabo.'}
                    </p>
                  </div>

                  {/* File badge */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate text-[11px]">
                        {template.fileName || 'template_dokumen.docx'}
                      </span>
                    </div>
                    {hasFile ? (
                      <a
                        href={template.fileUrl}
                        download={template.fileName || 'template.docx'}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh File</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-700 font-semibold italic">Belum diunggah</span>
                    )}
                  </div>

                  {/* Rules preview */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Syarat Pengajuan ({(template.requirements || []).length}):
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      {(template.requirements || []).slice(0, 3).map((req, i) => (
                        <li key={i} className="truncate">{req}</li>
                      ))}
                      {(template.requirements || []).length > 3 && (
                        <li className="text-emerald-700 font-semibold list-none text-[10px]">
                          + {(template.requirements || []).length - 3} syarat lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{template.estimatedProcessingTime || '1 Hari Kerja'}</span>
                    <span className="mx-1">•</span>
                    <span>{template.cost || 'Gratis'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(template)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Edit template"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Salin template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id, template.name)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
