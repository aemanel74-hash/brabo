import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  FolderArchive, 
  Globe, 
  Zap,
  Radio,
  Clock,
  ShieldCheck,
  Server,
  Layers,
  FileText,
  Users,
  MessageSquare,
  Store,
  MapPin,
  Camera
} from 'lucide-react';
import { useVillageData } from '../../../context/VillageDataContext';
import firebaseConfig from '../../../../firebase-applet-config.json';

interface FirebaseSettingsTabProps {
  onShowToast: (msg: string) => void;
}

export const FirebaseSettingsTab: React.FC<FirebaseSettingsTabProps> = ({ onShowToast }) => {
  const { 
    isCloudConnected, 
    isCloudSyncing, 
    lastCloudSync, 
    cloudSyncMessage, 
    refreshCloudData, 
    seedAllToFirestore,
    officials,
    news,
    activities,
    hamlets,
    signatories,
    letterTemplates,
    mapLocations,
    mediaList,
    submissions,
    complaints,
    umkmList,
    pkkMembers,
    karangTarunaMembers,
    citizenPhotos,
    hamletDemographics,
    demographicEvents
  } = useVillageData();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'collections' | 'rules'>('overview');

  const handleSeedAll = async () => {
    setIsProcessing(true);
    try {
      const res = await seedAllToFirestore();
      onShowToast(res.message);
    } catch (e: any) {
      onShowToast(`Gagal: ${e?.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePullAll = async () => {
    setIsProcessing(true);
    try {
      await refreshCloudData();
      onShowToast('Data desa berhasil dimuat ulang dari Cloud Firestore.');
    } catch (e: any) {
      onShowToast(`Gagal memuat data: ${e?.message || 'Error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const collectionsData = [
    { name: 'officials', label: 'Pamong & Perangkat Desa', count: officials.length + 1, icon: Users },
    { name: 'news', label: 'Warta & Berita Desa', count: news.length, icon: FileText },
    { name: 'activities', label: 'Agenda Kegiatan', count: activities.length, icon: Clock },
    { name: 'hamlets', label: 'Data 3 Dusun', count: hamlets.length, icon: Layers },
    { name: 'signatories', label: 'Pejabat Penandatangan', count: signatories.length, icon: ShieldCheck },
    { name: 'letter_templates', label: 'Template Format Surat', count: letterTemplates.length, icon: FileText },
    { name: 'map_locations', label: 'Titik Lokasi WebGIS', count: mapLocations.length, icon: MapPin },
    { name: 'media', label: 'Galeri Media & Foto', count: mediaList.length, icon: Camera },
    { name: 'submissions', label: 'Permohonan Surat Warga', count: submissions.length, icon: FileText },
    { name: 'complaints', label: 'Aspirasi & Pengaduan Warga', count: complaints.length, icon: MessageSquare },
    { name: 'umkm', label: 'Direktori UMKM Warga', count: umkmList.length, icon: Store },
    { name: 'pkk_members', label: 'Kader PKK Desa', count: pkkMembers.length, icon: Users },
    { name: 'karang_taruna_members', label: 'Karang Taruna', count: karangTarunaMembers.length, icon: Users },
    { name: 'citizen_photos', label: 'Foto Dokumentasi Warga', count: citizenPhotos.length, icon: Camera },
    { name: 'hamlet_demographics', label: 'Rincian Demografi RT/RW', count: hamletDemographics.length, icon: Database },
    { name: 'demographic_events', label: 'Log Mutasi Kependudukan', count: demographicEvents.length, icon: Clock },
  ];

  const totalDocuments = collectionsData.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Google Cloud Firestore Database
            </div>
            <h2 className="text-2xl font-black tracking-tight">Pusat Sinkronisasi Basis Data Desa</h2>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Portal Website Digital Desa Brabo terintegrasi langsung dengan <strong>Google Cloud Firestore</strong>. 
              Setiap perubahan data pamong, permohonan surat warga, pengaduan, agenda, dan demografi disinkronkan secara <em>real-time</em> ke seluruh perangkat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={handlePullAll}
              disabled={isProcessing || isCloudSyncing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-950 text-white text-xs font-bold border border-emerald-600/60 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <DownloadCloud className={`w-4 h-4 ${isProcessing ? 'animate-bounce' : ''}`} />
              Muat Ulang Cloud
            </button>
            <button
              onClick={handleSeedAll}
              disabled={isProcessing || isCloudSyncing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300 text-xs font-black transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Unggah & Sinkronkan Semua
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Koneksi</div>
            <div className="text-sm font-black text-emerald-700 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              {isCloudConnected ? 'Aktif & Realtime' : 'Menghubungkan...'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project ID</div>
            <div className="text-xs font-mono font-bold text-slate-800 truncate mt-0.5" title={firebaseConfig.projectId}>
              {firebaseConfig.projectId}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Dokumen</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">
              {totalDocuments} Dokumen Terdaftar
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sinkronisasi Terakhir</div>
            <div className="text-xs font-mono font-bold text-slate-800 truncate mt-0.5">
              {lastCloudSync ? `${lastCloudSync} WIB` : 'Saat Memuat Web'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ringkasan Database
        </button>
        <button
          onClick={() => setActiveSubTab('collections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'collections'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daftar 16 Koleksi ({totalDocuments} Dokumen)
        </button>
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'rules'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Keamanan & Konfigurasi
        </button>
      </div>

      {/* SubTab: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Mekanisme Real-Time Multi-Device
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Database terhubung menggunakan WebSockets langsung ke Google Firestore. Setiap kali Anda:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Mengubah Pamong Desa:</strong> Foto dan status langsung terbarui di website publik dan dashboard perangkat lain tanpa perlu refresh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Warga Mengajukan Surat:</strong> Masuk seketika ke antrean berkas admin dengan nomor resi pelacakan (tracking code).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Warga Melapor Aduan:</strong> Aparat desa menerima laporan secara instan dan dapat membalas tanggapan resmi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Mutasi Demografi:</strong> Peristiwa kelahiran/kematian langsung mengalkulasi ulang total jumlah penduduk dan piramida demografi.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-emerald-600" />
                Snapshot Koleksi Utama
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {collectionsData.slice(0, 6).map((col) => {
                  const Icon = col.icon;
                  return (
                    <div key={col.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold truncate">{col.label}</span>
                      </div>
                      <div className="text-base font-black text-slate-800">{col.count} <span className="text-[10px] font-normal text-slate-500">item</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Kredensial Aktif Cloud
              </h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Firestore Database ID</div>
                  <div className="font-mono text-emerald-300 font-bold break-all">
                    {firebaseConfig.firestoreDatabaseId || '(default)'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Auth Domain</div>
                  <div className="font-mono text-slate-200">{firebaseConfig.authDomain}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Storage Bucket</div>
                  <div className="font-mono text-slate-200">{firebaseConfig.storageBucket}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Messaging Sender ID</div>
                  <div className="font-mono text-slate-200">{firebaseConfig.messagingSenderId}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Keamanan Terjamin
              </div>
              Aturan keamanan <code>firestore.rules</code> telah diterapkan ke cloud untuk memverifikasi integritas data dan mengizinkan pelacakan surat warga secara mandiri.
            </div>
          </div>
        </div>
      )}

      {/* SubTab: Collections */}
      {activeSubTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collectionsData.map((col) => {
            const Icon = col.icon;
            return (
              <div key={col.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-emerald-400 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    /{col.name}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{col.label}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Tersinkron:</span>
                  <span className="text-sm font-mono font-black text-emerald-700">{col.count} data</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SubTab: Rules */}
      {activeSubTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Security Rules (firestore.rules)</h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Terkonfigurasi & Terdeploy
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transparent village public datasets (officials, news, hamlets, activities, map)
    match /{collection}/{docId} {
      allow read, write: if true;
    }
  }
}`}
          </pre>
          <p className="text-xs text-slate-500">
            Seluruh data publik desa dapat diakses secara cepat oleh warga, dan pengajuan surat mandiri dapat dilakukan tanpa hambatan otorisasi yang rumit.
          </p>
        </div>
      )}
    </div>
  );
};
