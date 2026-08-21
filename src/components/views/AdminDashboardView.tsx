import React, { useState } from 'react';
import { 
  useVillageData, 
  NewsArticle, 
  LetterSubmission 
} from '../../context/VillageDataContext';
import { 
  OfficialPerson, 
  ActivityItem, 
  VerificationStatus,
  VerificationSourceOption,
  Signatory,
  LetterTemplate,
  MapLocation,
  MapLocationCategory,
  MediaItem,
  CommunityOrgMember,
  CommunityOrgType,
  CitizenActivityPhoto
} from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { OfficialLetterDocument, LetterDocumentData } from '../common/OfficialLetterDocument';
import { 
  Users, 
  FileText, 
  Newspaper, 
  Activity, 
  MapPin, 
  Image as ImageIcon, 
  Database, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Check, 
  X, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Copy,
  ExternalLink,
  Printer,
  ChevronRight,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  PenTool,
  Lock,
  HeartHandshake,
  Flame,
  Camera,
  Cloud,
  MessageSquare,
  Compass
} from 'lucide-react';
import { SupabaseSettingsTab } from './admin/SupabaseSettingsTab';
import { ComplaintsTab } from './admin/ComplaintsTab';
import { DocumentTemplatesTab } from './admin/DocumentTemplatesTab';
import { DocumentSubmissionsTab } from './admin/DocumentSubmissionsTab';
import { HamletsTab } from './admin/HamletsTab';
import { OrganizationsTab } from './admin/OrganizationsTab';
import { UmkmAdminTab } from './admin/UmkmAdminTab';
import { PhotoUploadInput } from '../common/PhotoUploadInput';
import { VerificationSourceSelector } from '../common/VerificationSourceSelector';
import { Store } from 'lucide-react';

interface AdminDashboardViewProps {
  onOpenSource: (sourceId: string) => void;
}

type AdminTab = 
  | 'pamong'
  | 'kewilayahan'
  | 'kelembagaan'
  | 'umkm'
  | 'signatories'
  | 'complaints'
  | 'templates'
  | 'letters'
  | 'map'
  | 'news'
  | 'activities'
  | 'citizen_photos'
  | 'media'
  | 'supabase'
  | 'backup';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onOpenSource }) => {
  const { 
    villageHead, 
    officials, 
    updateOfficial, 
    addOfficial, 
    deleteOfficial, 
    updateVillageHead,
    news, 
    addNews, 
    updateNews, 
    deleteNews,
    activities, 
    addActivity, 
    updateActivity, 
    deleteActivity,
    hamlets,
    updateHamletHead,
    signatories,
    addSignatory,
    updateSignatory,
    deleteSignatory,
    letterTemplates,
    addLetterTemplate,
    updateLetterTemplate,
    duplicateLetterTemplate,
    deleteLetterTemplate,
    mapLocations,
    addMapLocation,
    updateMapLocation,
    deleteMapLocation,
    villageBoundary,
    updateVillageBoundary,
    mediaList,
    addMediaItem,
    deleteMediaItem,
    submissions,
    updateSubmissionStatus,
    deleteSubmission,
    pkkMembers,
    karangTarunaMembers,
    addCommunityMember,
    updateCommunityMember,
    deleteCommunityMember,
    citizenPhotos,
    updateCitizenPhotoStatus,
    deleteCitizenPhoto,
    complaints,
    umkmList,
    addUmkm,
    updateUmkm,
    updateUmkmStatus,
    deleteUmkm,
    resetToDefaults,
    exportJSON,
    importJSON
  } = useVillageData();

  const [activeTab, setActiveTab] = useState<AdminTab>('pamong');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // ----------------------------------------------------
  // TAB 1: PAMONG & SOTK STATE
  // ----------------------------------------------------
  const [editingHead, setEditingHead] = useState(false);
  const [headForm, setHeadForm] = useState(villageHead);
  const [editingOfficialId, setEditingOfficialId] = useState<string | null>(null);
  const [officialForm, setOfficialForm] = useState<Partial<OfficialPerson>>({});
  const [isAddingOfficial, setIsAddingOfficial] = useState(false);
  const [newOfficial, setNewOfficial] = useState<Partial<OfficialPerson>>({
    name: '',
    role: 'Kepala Urusan Umum & Perencanaan',
    period: '2019 - Sekarang',
    photoUrl: '',
    status: 'VERIFIED' as VerificationStatus,
    sourceId: 'SRC-PEMDES-BRABO',
    verificationSource: 'VERIFIED_DESA',
    verificationNote: 'SK Pengangkatan Perangkat Desa Brabo',
    customSourceName: '',
    isConfirmedActive: true,
  });

  const handleSaveHead = () => {
    const verSource = headForm.verificationSource || 'VERIFIED_DESA';
    let verStatus: VerificationStatus = 'VERIFIED';
    let srcId = 'SRC-PEMDES-BRABO';

    if (verSource === 'VERIFIED_DESA') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-PEMDES-BRABO';
    } else if (verSource === 'BPS_GROBOGAN') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-BPS-2022';
    } else if (verSource === 'OTHER_VALID_SOURCE') {
      verStatus = 'SUPPORTED';
      srcId = 'SRC-OTHER-VALID';
    } else {
      verStatus = 'UNVERIFIED';
      srcId = 'SRC-KKN-UNVERIFIED';
    }

    updateVillageHead({
      ...headForm,
      verificationSource: verSource,
      status: verStatus,
      sourceId: srcId,
    });
    setEditingHead(false);
    showToast('Profil Kepala Desa & status verifikasi berhasil diperbarui.');
  };

  const handleSaveOfficial = (id: string) => {
    const verSource = officialForm.verificationSource || 'VERIFIED_DESA';
    let verStatus: VerificationStatus = 'VERIFIED';
    let srcId = 'SRC-PEMDES-BRABO';

    if (verSource === 'VERIFIED_DESA') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-PEMDES-BRABO';
    } else if (verSource === 'BPS_GROBOGAN') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-BPS-2022';
    } else if (verSource === 'OTHER_VALID_SOURCE') {
      verStatus = 'SUPPORTED';
      srcId = 'SRC-OTHER-VALID';
    } else {
      verStatus = 'UNVERIFIED';
      srcId = 'SRC-KKN-UNVERIFIED';
    }

    updateOfficial(id, {
      ...officialForm,
      verificationSource: verSource,
      status: verStatus,
      sourceId: srcId,
      isConfirmedActive: verStatus === 'VERIFIED' ? true : (officialForm.isConfirmedActive ?? false),
    });
    setEditingOfficialId(null);
    showToast('Data Pamong & status verifikasi berhasil disimpan.');
  };

  const handleQuickChangeOfficialStatus = (
    id: string, 
    verSource: VerificationSourceOption,
    customName?: string,
    note?: string
  ) => {
    let verStatus: VerificationStatus = 'VERIFIED';
    let srcId = 'SRC-PEMDES-BRABO';

    if (verSource === 'VERIFIED_DESA') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-PEMDES-BRABO';
    } else if (verSource === 'BPS_GROBOGAN') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-BPS-2022';
    } else if (verSource === 'OTHER_VALID_SOURCE') {
      verStatus = 'SUPPORTED';
      srcId = 'SRC-OTHER-VALID';
    } else {
      verStatus = 'UNVERIFIED';
      srcId = 'SRC-KKN-UNVERIFIED';
    }

    updateOfficial(id, {
      verificationSource: verSource,
      status: verStatus,
      sourceId: srcId,
      verificationNote: note !== undefined ? note : (verSource === 'VERIFIED_DESA' ? 'SK Pengangkatan Pamong Desa Brabo' : ''),
      customSourceName: customName !== undefined ? customName : (verSource === 'OTHER_VALID_SOURCE' ? 'Dokumen Terpercaya' : ''),
      isConfirmedActive: verStatus === 'VERIFIED',
    });
    showToast('Status verifikasi pamong berhasil diperbarui.');
  };

  const handleVerifyAllOfficials = () => {
    officials.forEach((official) => {
      updateOfficial(official.id, {
        status: 'VERIFIED',
        verificationSource: 'VERIFIED_DESA',
        sourceId: 'SRC-PEMDES-BRABO',
        verificationNote: 'Telah Diverifikasi Resmi oleh Pemerintah Desa Brabo',
        isConfirmedActive: true,
      });
    });
    showToast('Semua struktur pamong desa berhasil diset sebagai "Terverifikasi Resmi (Data Desa)".');
  };

  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficial.name?.trim()) {
      alert('Nama Pamong wajib diisi.');
      return;
    }
    const verSource = newOfficial.verificationSource || 'VERIFIED_DESA';
    let verStatus: VerificationStatus = 'VERIFIED';
    let srcId = 'SRC-PEMDES-BRABO';

    if (verSource === 'VERIFIED_DESA') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-PEMDES-BRABO';
    } else if (verSource === 'BPS_GROBOGAN') {
      verStatus = 'VERIFIED';
      srcId = 'SRC-BPS-2022';
    } else if (verSource === 'OTHER_VALID_SOURCE') {
      verStatus = 'SUPPORTED';
      srcId = 'SRC-OTHER-VALID';
    } else {
      verStatus = 'UNVERIFIED';
      srcId = 'SRC-KKN-UNVERIFIED';
    }

    addOfficial({
      ...newOfficial,
      name: newOfficial.name.trim(),
      role: newOfficial.role?.trim() || 'Perangkat Desa',
      verificationSource: verSource,
      status: verStatus,
      sourceId: srcId,
      isConfirmedActive: verStatus === 'VERIFIED',
    } as Omit<OfficialPerson, 'id'>);

    setIsAddingOfficial(false);
    setNewOfficial({
      name: '',
      role: 'Kepala Urusan Umum & Perencanaan',
      period: '2019 - Sekarang',
      photoUrl: '',
      status: 'VERIFIED',
      sourceId: 'SRC-PEMDES-BRABO',
      verificationSource: 'VERIFIED_DESA',
      verificationNote: 'SK Pengangkatan Perangkat Desa Brabo',
      customSourceName: '',
      isConfirmedActive: true,
    });
    showToast('Pamong desa baru berhasil ditambahkan.');
  };

  // ----------------------------------------------------
  // TAB 2: SIGNATORIES (PENANDATANGAN) STATE
  // ----------------------------------------------------
  const [editingSigId, setEditingSigId] = useState<string | null>(null);
  const [sigForm, setSigForm] = useState<Partial<Signatory>>({});
  const [isAddingSig, setIsAddingSig] = useState(false);
  const [newSig, setNewSig] = useState({
    nama: '',
    jabatan: 'Kepala Dusun I Dukoh',
    wilayah: 'Dusun I Dukoh',
    nip: '-',
    statusAktif: true,
  });

  const handleSaveSig = (id: string) => {
    updateSignatory(id, sigForm);
    setEditingSigId(null);
    showToast('Data Penandatangan berhasil diperbarui.');
  };

  const handleCreateSig = (e: React.FormEvent) => {
    e.preventDefault();
    addSignatory(newSig);
    setIsAddingSig(false);
    setNewSig({
      nama: '',
      jabatan: 'Kepala Dusun I Dukoh',
      wilayah: 'Dusun I Dukoh',
      nip: '-',
      statusAktif: true,
    });
    showToast('Penandatangan baru berhasil ditambahkan.');
  };

  // ----------------------------------------------------
  // TAB 3: TEMPLATES (BUILDER) STATE
  // ----------------------------------------------------
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState<Partial<LetterTemplate>>({
    code: '',
    name: '',
    category: 'Keterangan',
    kopTitle: 'PEMERINTAH KABUPATEN GROBOGAN',
    kopSubtitle: 'KECAMATAN TANGGUNGHARJO\nPEMERINTAH DESA BRABO\nAlamat: Jl. Raya Brabo - Tanggungharjo, Kode Pos: 58166',
    letterNumberFormat: '470 / {{nomor}} / Desa-Brb / {{bulan_romawi}} / {{tahun}}',
    perihal: 'Surat Keterangan',
    openingText: 'Yang bertanda tangan di bawah ini Pemerintah Desa Brabo, Kecamatan Tanggungharjo, menerangkan bahwa:',
    contentTemplate: 'Nama: {{nama}}\nNIK: {{nik}}\nTempat / Tgl Lahir: {{tempat_lahir}}, {{tanggal_lahir}}\nAlamat: RT {{rt}} / RW {{rw}}, Dusun {{dusun}}, Desa Brabo\n\nAdalah benar-benar warga masyarakat Desa Brabo dengan keperluan:\n{{keperluan}}',
    closingText: 'Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.',
    signatureLayout: 'single',
    signatureSlots: [
      {
        slotId: 'slot-1',
        title: 'Kepala Desa Brabo',
        signatoryId: 'SIG-KADES',
        position: 'right',
      }
    ],
    footerNote: 'Dokumen Resmi Pemerintah Desa Brabo.',
    isActive: true,
    fontSize: 'base',
    margins: 'normal',
    requirements: ['KTP & KK Pemohon'],
  });

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      updateLetterTemplate(editingTemplate.id, templateForm);
      setEditingTemplate(null);
      showToast(`Template "${templateForm.name}" berhasil diperbarui.`);
    } else if (isCreatingTemplate) {
      addLetterTemplate(templateForm as Omit<LetterTemplate, 'id'>);
      setIsCreatingTemplate(false);
      showToast(`Template baru "${templateForm.name}" berhasil dibuat.`);
    }
  };

  // ----------------------------------------------------
  // TAB 4: LETTERS SUBMISSIONS STATE
  // ----------------------------------------------------
  const [previewSub, setPreviewSub] = useState<LetterSubmission | null>(null);

  // ----------------------------------------------------
  // TAB 5: MAP LOCATIONS STATE
  // ----------------------------------------------------
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locForm, setLocForm] = useState<Partial<MapLocation>>({});
  const [isAddingLoc, setIsAddingLoc] = useState(false);
  const [newLoc, setNewLoc] = useState({
    name: '',
    category: 'Fasilitas Umum' as MapLocationCategory,
    lat: -7.0673,
    lng: 110.6358,
    description: '',
    address: 'Dusun Krajan, Desa Brabo',
    photoUrl: '',
    status: 'ACTIVE' as const,
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED' as VerificationStatus,
  });

  const handleCreateLoc = (e: React.FormEvent) => {
    e.preventDefault();
    addMapLocation(newLoc);
    setIsAddingLoc(false);
    setNewLoc({
      name: '',
      category: 'Fasilitas Umum',
      lat: -7.0673,
      lng: 110.6358,
      description: '',
      address: 'Dusun Krajan, Desa Brabo',
      photoUrl: '',
      status: 'ACTIVE',
      sourceId: 'SRC-PEMKAB-GROB',
      verificationStatus: 'VERIFIED',
    });
    showToast('Titik lokasi peta baru berhasil ditambahkan.');
  };

  const handleSaveLoc = (id: string) => {
    updateMapLocation(id, locForm);
    setEditingLocId(null);
    showToast('Titik lokasi peta berhasil disimpan.');
  };

  // ----------------------------------------------------
  // TAB 6: NEWS STATE
  // ----------------------------------------------------
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsArticle>>({});
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Pengumuman' as NewsArticle['category'],
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: 'Admin Humas Desa',
    excerpt: '',
    content: '',
    status: 'VERIFIED' as VerificationStatus,
    sourceId: 'SRC-PEMKAB-GROB',
    imageUrl: '',
    featured: false,
  });

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    addNews(newNews);
    setIsAddingNews(false);
    setNewNews({
      title: '',
      category: 'Pengumuman',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Admin Humas Desa',
      excerpt: '',
      content: '',
      status: 'VERIFIED',
      sourceId: 'SRC-PEMKAB-GROB',
      imageUrl: '',
      featured: false,
    });
    showToast('Warta berita baru berhasil diterbitkan.');
  };

  // ----------------------------------------------------
  // TAB 7: ACTIVITIES STATE
  // ----------------------------------------------------
  const [isAddingAct, setIsAddingAct] = useState(false);
  const [editingActId, setEditingActId] = useState<string | null>(null);
  const [actForm, setActForm] = useState<Partial<ActivityItem>>({});
  const [newAct, setNewAct] = useState({
    title: '',
    category: 'Pemerintahan' as ActivityItem['category'],
    frequency: 'KEGIATAN RUTIN' as ActivityItem['frequency'],
    location: 'Balai Desa Brabo',
    scheduleOrDate: 'Setiap Hari Kerja',
    description: '',
    participants: 'Perangkat & Warga Desa',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'VERIFIED' as VerificationStatus,
    imageUrl: '',
    coverImage: '',
    galleryImages: [] as string[],
  });
  const [rawGalleryInput, setRawGalleryInput] = useState('');

  const handleCreateAct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGallery = rawGalleryInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    addActivity({
      ...newAct,
      galleryImages: parsedGallery,
    });
    setIsAddingAct(false);
    setRawGalleryInput('');
    showToast('Kegiatan dan galeri foto berhasil ditambahkan.');
  };

  // ----------------------------------------------------
  // TAB 8: MEDIA LIBRARY STATE
  // ----------------------------------------------------
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaCat, setNewMediaCat] = useState<MediaItem['category']>('Umum');

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl) return;
    addMediaItem({
      name: newMediaName || 'Media Desa Brabo',
      url: newMediaUrl,
      category: newMediaCat,
      size: 1500000,
      fileType: 'image/jpeg',
    });
    setNewMediaUrl('');
    setNewMediaName('');
    showToast('Media berhasil ditambahkan ke pustaka media.');
  };

  // ----------------------------------------------------
  // TAB 9: BACKUP & JSON STATE
  // ----------------------------------------------------
  const [jsonInput, setJsonInput] = useState('');

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_desa_brabo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('File JSON cadangan berhasil diunduh.');
  };

  const handleImport = () => {
    if (!jsonInput.trim()) {
      alert('Masukkan teks JSON terlebih dahulu.');
      return;
    }
    const success = importJSON(jsonInput);
    if (success) {
      showToast('Data berhasil dipulihkan dari cadangan JSON.');
      setJsonInput('');
    } else {
      alert('Format JSON tidak valid.');
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi default riset terverifikasi?')) {
      resetToDefaults();
      showToast('Sistem berhasil direset ke baseline data terverifikasi.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Pusat Kendali CMS Desa
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Admin Panel Desa Brabo Digital
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Kelola struktur pamong, kewilayahan 3 dusun, status verifikasi data transparan, pejabat penandatangan, template surat mandiri, antrean permohonan warga, warta berita, dan dokumentasi kegiatan.
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {[
            { id: 'pamong', label: 'Pamong & SOTK', icon: Users },
            { id: 'kewilayahan', label: `Kewilayahan (${hamlets.length} Dusun)`, icon: Compass },
            { id: 'kelembagaan', label: `Kelembagaan (${pkkMembers.length + karangTarunaMembers.length})`, icon: HeartHandshake },
            { id: 'umkm', label: `UMKM & Usaha Warga (${umkmList.length})`, icon: Store },
            { id: 'signatories', label: 'Penandatangan', icon: PenTool },
            { id: 'complaints', label: `Aduan Warga (${complaints.length})`, icon: MessageSquare },
            { id: 'templates', label: `Template Berkas (${letterTemplates.length})`, icon: Sliders },
            { id: 'letters', label: `Antrean Berkas (${submissions.length})`, icon: FileText },
            { id: 'map', label: `Peta & Lokasi (${mapLocations.length})`, icon: MapPin },
            { id: 'news', label: `Berita & Warta (${news.length})`, icon: Newspaper },
            { id: 'activities', label: `Kegiatan (${activities.length})`, icon: Activity },
            { id: 'citizen_photos', label: `Foto Warga (${citizenPhotos.length})`, icon: Camera },
            { id: 'media', label: `Media Library (${mediaList.length})`, icon: ImageIcon },
            { id: 'supabase', label: 'Koneksi Supabase', icon: Cloud },
            { id: 'backup', label: 'Cadangan & Audit', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: PAMONG & SOTK */}
      {/* ==================================================== */}
      {activeTab === 'pamong' && (
        <div className="space-y-8">
          {/* Kepala Desa Editor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Profil Kepala Desa Definitif
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pejabat tertinggi Pemerintah Desa Brabo
                </p>
              </div>
              {!editingHead ? (
                <button
                  onClick={() => {
                    setHeadForm(villageHead);
                    setEditingHead(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profil Kades</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingHead(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveHead}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              )}
            </div>

            {!editingHead ? (
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {villageHead.photoUrl ? (
                  <img src={villageHead.photoUrl} alt="" className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shrink-0">
                    KADES
                  </div>
                )}
                <div className="space-y-2 text-xs text-slate-700 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-extrabold text-slate-900">{villageHead.name}</p>
                    <VerificationBadge
                      status={villageHead.status || 'VERIFIED'}
                      verificationSource={villageHead.verificationSource || 'VERIFIED_DESA'}
                      verificationNote={villageHead.verificationNote}
                      customSourceName={villageHead.customSourceName}
                      sourceId={villageHead.sourceId || 'SRC-PEMDES-BRABO'}
                      onOpenSource={onOpenSource}
                    />
                  </div>
                  <p className="font-semibold text-emerald-800">{villageHead.role}</p>
                  <p>Masa Jabatan: <strong>{villageHead.period || '2019 - Sekarang'}</strong> (Dilantik: {villageHead.appointmentDate || '18 Des 2019'})</p>
                  <p className="text-slate-600">{villageHead.description}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      value={headForm.name}
                      onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={headForm.role}
                      onChange={(e) => setHeadForm({ ...headForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Masa Jabatan</label>
                    <input
                      type="text"
                      value={headForm.period || ''}
                      onChange={(e) => setHeadForm({ ...headForm, period: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <PhotoUploadInput
                      label="Foto Profil Kepala Desa"
                      value={headForm.photoUrl || ''}
                      onChange={(url) => setHeadForm({ ...headForm, photoUrl: url })}
                      folderName="kades"
                      helperText="Unggah pas foto resmi Kepala Desa (otomatis dioptimalkan WebP & Supabase)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi / Keterangan</label>
                    <textarea
                      rows={2}
                      value={headForm.description || ''}
                      onChange={(e) => setHeadForm({ ...headForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Verification Source Selector for Kepala Desa */}
                <div className="pt-3 border-t border-slate-100">
                  <VerificationSourceSelector
                    verificationSource={headForm.verificationSource || 'VERIFIED_DESA'}
                    verificationNote={headForm.verificationNote || ''}
                    customSourceName={headForm.customSourceName || ''}
                    onChange={(fields) => setHeadForm({ ...headForm, ...fields })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Perangkat & Pamong Desa List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Daftar Pamong Desa & SOTK ({officials.length})</span>
                  <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {officials.filter(o => o.status === 'VERIFIED').length} Terverifikasi
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sekretaris Desa, Kaur, Kasi, dan Kepala Dusun (Kadus) lengkap dengan status verifikasi resmi
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerifyAllOfficials}
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                  title="Tandai seluruh pamong sebagai Terverifikasi Resmi oleh Pemdes"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verifikasi Semua (Data Desa)</span>
                </button>
                <button
                  onClick={() => setIsAddingOfficial(!isAddingOfficial)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pamong Baru</span>
                </button>
              </div>
            </div>

            {/* Add Official Form Modal/Inline */}
            {isAddingOfficial && (
              <form onSubmit={handleCreateOfficial} className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-emerald-950">Form Tambah Pamong Desa:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama pamong..."
                      value={newOfficial.name}
                      onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kepala Urusan Keuangan"
                      value={newOfficial.role}
                      onChange={(e) => setNewOfficial({ ...newOfficial, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Masa Jabatan</label>
                    <input
                      type="text"
                      placeholder="2019 - Sekarang"
                      value={newOfficial.period}
                      onChange={(e) => setNewOfficial({ ...newOfficial, period: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <PhotoUploadInput
                      label="Foto Profil Pamong / Perangkat"
                      value={newOfficial.photoUrl}
                      onChange={(url) => setNewOfficial({ ...newOfficial, photoUrl: url })}
                      folderName="pamong"
                      helperText="Unggah foto profil perangkat desa (JPG, PNG, WebP)"
                    />
                  </div>
                </div>

                {/* Verification Source Selector for New Official */}
                <div className="pt-2">
                  <VerificationSourceSelector
                    verificationSource={newOfficial.verificationSource || 'VERIFIED_DESA'}
                    verificationNote={newOfficial.verificationNote || ''}
                    customSourceName={newOfficial.customSourceName || ''}
                    onChange={(fields) => setNewOfficial({ ...newOfficial, ...fields })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOfficial(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Simpan Pamong
                  </button>
                </div>
              </form>
            )}

            {/* Officials Table / List */}
            <div className="space-y-3">
              {officials.map((official) => {
                const isEditing = editingOfficialId === official.id;
                const currentSource = official.verificationSource || (official.status === 'VERIFIED' ? 'VERIFIED_DESA' : (official.status === 'SUPPORTED' ? 'OTHER_VALID_SOURCE' : 'UNVERIFIED'));
                return (
                  <div
                    key={official.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      official.status === 'VERIFIED'
                        ? 'border-emerald-200 bg-white hover:border-emerald-300'
                        : 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                    }`}
                  >
                    {!isEditing ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                        {official.photoUrl ? (
                          <img src={official.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {official.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{official.name}</p>
                            <VerificationBadge
                              status={official.status || 'VERIFIED'}
                              verificationSource={currentSource}
                              verificationNote={official.verificationNote}
                              customSourceName={official.customSourceName}
                              sourceId={official.sourceId || 'SRC-PEMDES-BRABO'}
                              onOpenSource={onOpenSource}
                            />
                          </div>
                          <p className="text-[11px] text-emerald-800 font-semibold truncate">{official.role}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                            <span>Masa: {official.period || '2019 - Sekarang'}</span>
                            {official.verificationNote && (
                              <span className="text-emerald-700 font-medium">Doc: {official.verificationNote}</span>
                            )}
                          </div>
                        </div>

                        {/* Fast Verification Status Switcher */}
                        <div className="flex items-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="text-[10px] text-slate-400 font-medium sm:hidden">Ubah Status:</span>
                          <select
                            aria-label={`Ubah status verifikasi ${official.name}`}
                            value={currentSource}
                            onChange={(e) => handleQuickChangeOfficialStatus(official.id, e.target.value as VerificationSourceOption)}
                            className="text-[11px] font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value="VERIFIED_DESA">✓ Terverifikasi (Data Desa)</option>
                            <option value="BPS_GROBOGAN">✓ Terverifikasi (Data BPS)</option>
                            <option value="OTHER_VALID_SOURCE">✓ Sumber Valid Lainnya</option>
                            <option value="UNVERIFIED">⚠ Butuh Verifikasi Desa</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-slate-50 p-4 rounded-2xl border border-emerald-300 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <p className="text-xs font-bold text-emerald-950">Edit Data Pamong:</p>
                          <span className="text-[10px] text-slate-500 font-mono">{official.id}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Pamong</label>
                            <input
                              type="text"
                              value={officialForm.name ?? official.name}
                              onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Jabatan / Posisi</label>
                            <input
                              type="text"
                              value={officialForm.role ?? official.role}
                              onChange={(e) => setOfficialForm({ ...officialForm, role: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Jabatan</label>
                            <input
                              type="text"
                              value={officialForm.period ?? official.period ?? ''}
                              onChange={(e) => setOfficialForm({ ...officialForm, period: e.target.value })}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <PhotoUploadInput
                              label="Foto Profil Pamong"
                              value={officialForm.photoUrl ?? official.photoUrl ?? ''}
                              onChange={(url) => setOfficialForm({ ...officialForm, photoUrl: url })}
                              folderName="pamong"
                              helperText="Pilih atau ganti foto profil pamong ini"
                            />
                          </div>
                        </div>

                        {/* Verification Source Selector in Edit Form */}
                        <div className="pt-2 border-t border-slate-200">
                          <VerificationSourceSelector
                            verificationSource={officialForm.verificationSource ?? (official.verificationSource || (official.status === 'VERIFIED' ? 'VERIFIED_DESA' : 'VERIFIED_DESA'))}
                            verificationNote={officialForm.verificationNote ?? official.verificationNote ?? ''}
                            customSourceName={officialForm.customSourceName ?? official.customSourceName ?? ''}
                            onChange={(fields) => setOfficialForm({ ...officialForm, ...fields })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingOfficialId(official.id);
                              setOfficialForm({
                                ...official,
                                verificationSource: official.verificationSource || (official.status === 'VERIFIED' ? 'VERIFIED_DESA' : 'VERIFIED_DESA'),
                                status: official.status === 'REQUIRES_VERIFICATION' ? 'VERIFIED' : (official.status || 'VERIFIED'),
                                sourceId: official.sourceId || 'SRC-PEMDES-BRABO',
                                verificationNote: official.verificationNote || 'SK Pengangkatan Perangkat Desa Brabo',
                              });
                            }}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Edit Data Pamong & Verifikasi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${official.name}?`)) {
                                deleteOfficial(official.id);
                                showToast('Pamong berhasil dihapus.');
                              }
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingOfficialId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveOfficial(official.id)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB KEWILAYAHAN: 3 DUSUN CMS */}
      {/* ==================================================== */}
      {activeTab === 'kewilayahan' && (
        <HamletsTab onOpenSource={onOpenSource} showToast={showToast} />
      )}

      {/* ==================================================== */}
      {/* TAB KELEMBAGAAN: PKK & KARANG TARUNA */}
      {/* ==================================================== */}
      {activeTab === 'kelembagaan' && (
        <OrganizationsTab onOpenSource={onOpenSource} showToast={showToast} />
      )}

      {/* ==================================================== */}
      {/* TAB: UMKM & USAHA WARGA */}
      {/* ==================================================== */}
      {activeTab === 'umkm' && (
        <UmkmAdminTab
          umkmList={umkmList}
          onAddUmkm={(data) => {
            addUmkm(data);
            showToast('UMKM baru berhasil didaftarkan dan tersimpan di database.');
          }}
          onUpdateUmkm={(id, data) => {
            updateUmkm(id, data);
            showToast('Informasi UMKM berhasil diperbarui.');
          }}
          onUpdateStatus={(id, status, verStatus, notes) => {
            updateUmkmStatus(id, status, verStatus, notes);
            showToast('Status UMKM berhasil diperbarui.');
          }}
          onDeleteUmkm={(id) => {
            deleteUmkm(id);
            showToast('Data UMKM berhasil dihapus dari database.');
          }}
          onOpenSource={onOpenSource}
        />
      )}

      {/* ==================================================== */}
      {/* TAB 2: SIGNATORIES (PENANDATANGAN) */}
      {/* ==================================================== */}
      {activeTab === 'signatories' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daftar Pejabat Penandatangan Surat ({signatories.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola nama penandatangan (Kades, Sekdes, Kadus Dukoh/Krajan/Cangkring, Ketua RT/RW) untuk dihubungkan pada template surat dinamis.
              </p>
            </div>

            <button
              onClick={() => setIsAddingSig(!isAddingSig)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Penandatangan</span>
            </button>
          </div>

          {/* Add Signatory Form */}
          {isAddingSig && (
            <form onSubmit={handleCreateSig} className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-emerald-950">Form Tambah Penandatangan:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sukarjo"
                    value={newSig.nama}
                    onChange={(e) => setNewSig({ ...newSig, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sekretaris Desa"
                    value={newSig.jabatan}
                    onChange={(e) => setNewSig({ ...newSig, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah Kewenangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dusun I Dukoh / RT 01"
                    value={newSig.wilayah}
                    onChange={(e) => setNewSig({ ...newSig, wilayah: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="-"
                    value={newSig.nip}
                    onChange={(e) => setNewSig({ ...newSig, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSig(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Simpan Penandatangan
                </button>
              </div>
            </form>
          )}

          {/* Signatories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signatories.map((sig) => {
              const isEditing = editingSigId === sig.id;
              return (
                <div
                  key={sig.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between gap-3 bg-white shadow-2xs"
                >
                  {!isEditing ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                          {sig.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sig.statusAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                          {sig.statusAktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-2">{sig.nama}</h4>
                      <p className="text-[11px] font-semibold text-emerald-800">{sig.jabatan}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Wilayah: {sig.wilayah || 'Desa Brabo'} • NIP: {sig.nip || '-'}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={sigForm.nama ?? sig.nama}
                        onChange={(e) => setSigForm({ ...sigForm, nama: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={sigForm.jabatan ?? sig.jabatan}
                        onChange={(e) => setSigForm({ ...sigForm, jabatan: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Wilayah..."
                        value={sigForm.wilayah ?? sig.wilayah ?? ''}
                        onChange={(e) => setSigForm({ ...sigForm, wilayah: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        updateSignatory(sig.id, { statusAktif: !sig.statusAktif });
                        showToast(`Status penandatangan ${sig.nama} diubah.`);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      {sig.statusAktif ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingSigId(sig.id);
                              setSigForm(sig);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus penandatangan ${sig.nama}?`)) {
                                deleteSignatory(sig.id);
                                showToast('Penandatangan dihapus.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingSigId(null)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveSig(sig.id)}
                            className="px-3 py-1 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-700"
                          >
                            Simpan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ADUAN / LAPORAN WARGA */}
      {/* ==================================================== */}
      {activeTab === 'complaints' && <ComplaintsTab />}

      {/* ==================================================== */}
      {/* TAB 4: FILE TEMPLATES (UPLOAD & DOWNLOAD) */}
      {/* ==================================================== */}
      {activeTab === 'templates' && <DocumentTemplatesTab />}

      {/* ==================================================== */}
      {/* TAB 5: DOCUMENT SUBMISSIONS (ANTREAN PENGAJUAN) */}
      {/* ==================================================== */}
      {activeTab === 'letters' && <DocumentSubmissionsTab />}

      {/* ==================================================== */}
      {/* TAB 5: MAP LOCATIONS & BOUNDARY */}
      {/* ==================================================== */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pusat Kendali Titik Lokasi & Peta Desa ({mapLocations.length} Lokasi)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola koordinat GPS balai desa, dusun, madrasah, pesantren, pos kesehatan, dan batas wilayah tanpa koding.
              </p>
            </div>

            <button
              onClick={() => setIsAddingLoc(!isAddingLoc)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Titik Lokasi</span>
            </button>
          </div>

          {/* Add Location Form */}
          {isAddingLoc && (
            <form onSubmit={handleCreateLoc} className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-emerald-950">Form Tambah Titik Lokasi Peta:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tempat / Fasilitas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Balai Posyandu Dusun Dukoh"
                    value={newLoc.name}
                    onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newLoc.category}
                    onChange={(e) => setNewLoc({ ...newLoc, category: e.target.value as MapLocationCategory })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kantor Desa">Kantor Desa</option>
                    <option value="Dusun">Dusun</option>
                    <option value="Sekolah">Sekolah</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Tempat Ibadah">Tempat Ibadah</option>
                    <option value="Fasilitas Umum">Fasilitas Umum</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Potensi Desa">Potensi Desa</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat</label>
                  <input
                    type="text"
                    placeholder="Dusun Krajan, Desa Brabo"
                    value={newLoc.address}
                    onChange={(e) => setNewLoc({ ...newLoc, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Latitude (Lintang)</label>
                  <input
                    type="number"
                    step="any"
                    value={newLoc.lat}
                    onChange={(e) => setNewLoc({ ...newLoc, lat: parseFloat(e.target.value) || -7.0673 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Longitude (Bujur)</label>
                  <input
                    type="number"
                    step="any"
                    value={newLoc.lng}
                    onChange={(e) => setNewLoc({ ...newLoc, lng: parseFloat(e.target.value) || 110.6358 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto (Opsional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newLoc.photoUrl}
                    onChange={(e) => setNewLoc({ ...newLoc, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    placeholder="Keterangan fasilitas atau potensi..."
                    value={newLoc.description}
                    onChange={(e) => setNewLoc({ ...newLoc, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLoc(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Simpan Titik Lokasi
                </button>
              </div>
            </form>
          )}

          {/* Locations Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mapLocations.map((loc) => {
              const isEditing = editingLocId === loc.id;
              return (
                <div
                  key={loc.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2 flex flex-col justify-between shadow-2xs"
                >
                  {!isEditing ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                          {loc.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {loc.lat}, {loc.lng}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-2">{loc.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{loc.address}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{loc.description}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={locForm.name ?? loc.name}
                        onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="any"
                          value={locForm.lat ?? loc.lat}
                          onChange={(e) => setLocForm({ ...locForm, lat: parseFloat(e.target.value) || loc.lat })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                        <input
                          type="number"
                          step="any"
                          value={locForm.lng ?? loc.lng}
                          onChange={(e) => setLocForm({ ...locForm, lng: parseFloat(e.target.value) || loc.lng })}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={locForm.description ?? loc.description}
                        onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        updateMapLocation(loc.id, { status: loc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
                        showToast(`Status lokasi ${loc.name} diubah.`);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      {loc.status === 'ACTIVE' ? 'Sembunyikan' : 'Tampilkan'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingLocId(loc.id);
                              setLocForm(loc);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus titik lokasi ${loc.name}?`)) {
                                deleteMapLocation(loc.id);
                                showToast('Titik lokasi dihapus.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingLocId(null)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveLoc(loc.id)}
                            className="px-3 py-1 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-700"
                          >
                            Simpan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: NEWS & ANNOUNCEMENTS */}
      {/* ==================================================== */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pusat Warta, Berita & Pengumuman Desa ({news.length} Artikel)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola publikasi warta kegiatan desa, pengumuman layanan, dan informasi pembangunan.
              </p>
            </div>

            <button
              onClick={() => setIsAddingNews(!isAddingNews)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Berita Baru</span>
            </button>
          </div>

          {/* Add News Form */}
          {isAddingNews && (
            <form onSubmit={handleCreateNews} className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-emerald-950">Form Tulis Berita / Pengumuman:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita *</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul warta atau pengumuman..."
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newNews.category}
                    onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Sosial">Sosial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penulis / Sumber</label>
                  <input
                    type="text"
                    placeholder="Admin Humas Desa"
                    value={newNews.author}
                    onChange={(e) => setNewNews({ ...newNews, author: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Cover (Opsional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newNews.imageUrl}
                    onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan (Excerpt)</label>
                  <input
                    type="text"
                    placeholder="Ringkasan singkat berita..."
                    value={newNews.excerpt}
                    onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Isi Konten Lengkap</label>
                  <textarea
                    rows={4}
                    placeholder="Isi berita lengkap..."
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNews(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Publikasikan Berita
                </button>
              </div>
            </form>
          )}

          {/* News List */}
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{item.excerpt || item.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      if (confirm(`Hapus berita "${item.title}"?`)) {
                        deleteNews(item.id);
                        showToast('Berita berhasil dihapus.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7: ACTIVITIES & GALLERY */}
      {/* ==================================================== */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pusat Dokumentasi Kegiatan & Galeri ({activities.length} Agenda)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola foto dokumentasi kegiatan gotong royong, posyandu, keagamaan, dan agenda desa dengan dukungan multi-foto.
              </p>
            </div>

            <button
              onClick={() => setIsAddingAct(!isAddingAct)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan & Galeri</span>
            </button>
          </div>

          {/* Add Activity Form */}
          {isAddingAct && (
            <form onSubmit={handleCreateAct} className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-emerald-950">Form Tambah Kegiatan & Galeri:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gotong Royong Irigasi Pertanian"
                    value={newAct.title}
                    onChange={(e) => setNewAct({ ...newAct, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newAct.category}
                    onChange={(e) => setNewAct({ ...newAct, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Posyandu">Posyandu</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Gotong Royong">Gotong Royong</option>
                    <option value="Pemuda">Pemuda</option>
                    <option value="Olahraga">Olahraga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frekuensi</label>
                  <select
                    value={newAct.frequency}
                    onChange={(e) => setNewAct({ ...newAct, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="KEGIATAN RUTIN">KEGIATAN RUTIN</option>
                    <option value="KEGIATAN BERKALA">KEGIATAN BERKALA</option>
                    <option value="KEGIATAN INSIDENTAL">KEGIATAN INSIDENTAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jadwal / Waktu</label>
                  <input
                    type="text"
                    placeholder="Contoh: Setiap Jumat Pagi"
                    value={newAct.scheduleOrDate}
                    onChange={(e) => setNewAct({ ...newAct, scheduleOrDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dusun Cangkring"
                    value={newAct.location}
                    onChange={(e) => setNewAct({ ...newAct, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Cover</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newAct.imageUrl}
                    onChange={(e) => setNewAct({ ...newAct, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daftar Foto Galeri Dokumentasi (Satu URL per baris)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                    value={rawGalleryInput}
                    onChange={(e) => setRawGalleryInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kegiatan</label>
                  <textarea
                    rows={2}
                    value={newAct.description}
                    onChange={(e) => setNewAct({ ...newAct, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAct(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Simpan Kegiatan & Foto
                </button>
              </div>
            </form>
          )}

          {/* Activities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2">
                  {act.imageUrl && (
                    <img src={act.imageUrl} alt="" className="w-full h-32 rounded-xl object-cover border border-slate-200" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                      {act.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {act.frequency}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{act.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{act.location}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus kegiatan ${act.title}?`)) {
                        deleteActivity(act.id);
                        showToast('Kegiatan dihapus.');
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB: MODERASI FOTO DOKUMENTASI WARGA */}
      {/* ==================================================== */}
      {activeTab === 'citizen_photos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Moderasi Foto Partisipasi Warga ({citizenPhotos.length} Foto)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola kiriman dokumentasi kegiatan warga yang telah dikompresi otomatis oleh peramban (WebP) agar ukuran database tetap ringan.
              </p>
            </div>
          </div>

          {citizenPhotos.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Belum ada kiriman foto dokumentasi dari warga.</p>
              <p className="text-[11px] text-slate-500">Warga dapat mengunggah melalui formulir di halaman Agenda & Dokumentasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {citizenPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-full h-40 rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200">
                      <img src={photo.photoUrl} alt="" className="w-full h-full object-cover" />
                      {photo.fileSizeKb && (
                        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                          {photo.fileSizeKb} KB (WebP)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {photo.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {photo.takenDate || photo.uploadedAt}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">{photo.activityTitle}</h4>
                    {photo.caption && <p className="text-[11px] text-slate-600 line-clamp-2">{photo.caption}</p>}
                    <p className="text-[10px] text-slate-500">
                      Pengunggah: <strong className="text-slate-800">{photo.uploaderName}</strong> ({photo.uploaderHamlet || 'Warga'})
                      {photo.uploaderPhone && ` • WA: ${photo.uploaderPhone}`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${photo.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {photo.status === 'APPROVED' ? 'DITAMPILKAN' : 'PENDING'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const newStatus = photo.status === 'APPROVED' ? 'PENDING' : 'APPROVED';
                          updateCitizenPhotoStatus(photo.id, newStatus);
                          showToast(`Status foto diubah menjadi ${newStatus === 'APPROVED' ? 'Ditampilkan' : 'Disembunyikan'}.`);
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        {photo.status === 'APPROVED' ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus foto "${photo.activityTitle}" dari warga?`)) {
                            deleteCitizenPhoto(photo.id);
                            showToast('Foto dokumentasi berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 8: MEDIA LIBRARY */}
      {/* ==================================================== */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pusat Media & Galeri Aset Desa ({mediaList.length} Media)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Penyimpanan terpusat foto kantor desa, fasilitas madrasah/pesantren, dokumentasi pertanian, dan stempel digital.
              </p>
            </div>
          </div>

          {/* Quick Add Media Form */}
          <form onSubmit={handleAddMedia} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              required
              placeholder="Masukkan URL Gambar (https://...)"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
            />
            <input
              type="text"
              placeholder="Nama Gambar..."
              value={newMediaName}
              onChange={(e) => setNewMediaName(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
            />
            <select
              value={newMediaCat}
              onChange={(e) => setNewMediaCat(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Perangkat">Perangkat</option>
              <option value="Potensi">Potensi</option>
              <option value="Peta">Peta</option>
              <option value="Dokumen">Dokumen</option>
              <option value="Umum">Umum</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Simpan ke Pustaka</span>
            </button>
          </form>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white uppercase">
                      {item.category}
                    </span>
                    <button
                      onClick={() => deleteMediaItem(item.id)}
                      className="p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-white text-[11px]">
                    <p className="font-bold truncate">{item.name}</p>
                    <p className="text-[9px] text-slate-300">{item.uploadedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB: KONEKSI SUPABASE & CLOUD DB */}
      {/* ==================================================== */}
      {activeTab === 'supabase' && (
        <SupabaseSettingsTab onShowToast={showToast} />
      )}

      {/* ==================================================== */}
      {/* TAB 9: CADANGAN & AUDIT */}
      {/* ==================================================== */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Pencadangan & Pemulihan Basis Data Desa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simpan seluruh konfigurasi pamong, template surat, lokasi peta, dan warta berita ke dalam format JSON standar OpenSID.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Ekspor Cadangan JSON</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unduh seluruh status database lokal ke file JSON yang dapat disimpan secara offline.
                </p>
                <button
                  onClick={handleExport}
                  className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File Cadangan</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Reset ke Data Asli</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kembalikan seluruh data ke kondisi awal terverifikasi Pemkab Grobogan dan BPS.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Baseline</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-700" />
                  <span>Impor Cadangan JSON</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Muat data dari file atau salinan JSON yang sudah dicadangkan sebelumnya.
                </p>
                <textarea
                  rows={2}
                  placeholder="Tempel teks JSON di sini..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-[11px] rounded-xl border border-slate-200 bg-white font-mono"
                />
                <button
                  onClick={handleImport}
                  className="w-full py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Terapkan Cadangan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
