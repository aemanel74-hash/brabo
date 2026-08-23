import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  Copy, 
  Check, 
  FolderArchive, 
  ExternalLink, 
  Key, 
  Globe, 
  Terminal,
  Zap,
  Radio,
  Clock
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  pushAllDataToSupabase, 
  SUPABASE_SQL_SCHEMA,
  SUPABASE_BUCKETS
} from '../../../lib/supabase';
import { useVillageData } from '../../../context/VillageDataContext';

interface SupabaseSettingsTabProps {
  onShowToast: (msg: string) => void;
}

export const SupabaseSettingsTab: React.FC<SupabaseSettingsTabProps> = ({ onShowToast }) => {
  const villageData = useVillageData();

  const [urlInput, setUrlInput] = useState('');
  const [anonKeyInput, setAnonKeyInput] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    bucketsFound?: string[];
    tablesFound?: string[];
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDirection, setSyncDirection] = useState<'push' | 'pull' | null>(null);
  const [syncDetails, setSyncDetails] = useState<Record<string, string> | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const cfg = getSupabaseConfig();
    setUrlInput(cfg.url);
    setAnonKeyInput(cfg.anonKey);

    if (cfg.url && cfg.anonKey) {
      runConnectionTest(false);
    }
  }, []);

  const runConnectionTest = async (showNotification = true) => {
    setTestingConnection(true);
    const result = await testSupabaseConnection();
    setTestingConnection(false);
    setConnectionStatus({
      tested: true,
      success: result.success,
      message: result.message,
      bucketsFound: result.bucketsFound,
      tablesFound: result.tablesFound,
    });

    if (showNotification) {
      onShowToast(result.success ? 'Koneksi Supabase aktif & terverifikasi.' : 'Koneksi gagal diperiksa.');
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !anonKeyInput.trim()) {
      alert('Mohon isi Supabase URL dan Anon Key.');
      return;
    }

    saveSupabaseConfig({
      url: urlInput.trim(),
      anonKey: anonKeyInput.trim(),
    });

    onShowToast('Kredensial Supabase berhasil disimpan.');
    runConnectionTest(true);
    villageData.refreshCloudData();
  };

  const handleClearCredentials = () => {
    if (confirm('Hapus kredensial Supabase yang tersimpan?')) {
      clearSupabaseConfig();
      setUrlInput('');
      setAnonKeyInput('');
      setConnectionStatus(null);
      onShowToast('Kredensial Supabase telah dihapus.');
    }
  };

  const handlePushAllData = async () => {
    if (!confirm('Kirim dan sinkronkan seluruh data Desa Brabo lokal (pamong, surat, aduan, UMKM, demografi, kegiatan, berita, peta, foto warga) ke Supabase?')) {
      return;
    }

    setIsSyncing(true);
    setSyncDirection('push');
    setSyncDetails(null);

    const payload = {
      villageHead: villageData.villageHead,
      officials: villageData.officials,
      submissions: villageData.submissions,
      activities: villageData.activities,
      news: villageData.news,
      mapLocations: villageData.mapLocations,
      pkkMembers: villageData.pkkMembers,
      karangTarunaMembers: villageData.karangTarunaMembers,
      citizenPhotos: villageData.citizenPhotos,
      mediaList: villageData.mediaList,
      letterTemplates: villageData.letterTemplates,
      signatories: villageData.signatories,
      complaints: villageData.complaints,
      umkmList: villageData.umkmList,
      hamletDemographics: villageData.hamletDemographics,
      villageDemographicSummary: villageData.villageDemographicSummary,
      demographicEvents: villageData.demographicEvents,
    };

    const res = await pushAllDataToSupabase(payload);
    setIsSyncing(false);
    setSyncDirection(null);

    if (res.success) {
      setSyncDetails(res.details || null);
      onShowToast(res.message);
      villageData.refreshCloudData();
    } else {
      alert(`Gagal sinkronisasi: ${res.message}\n\nPastikan Anda telah menjalankan skrip SQL Schema di Supabase SQL Editor.`);
    }
  };

  const handlePullAllData = async () => {
    if (!confirm('Tarik data terbaru dari Supabase ke aplikasi? Data lokal akan diperbarui.')) {
      return;
    }

    setIsSyncing(true);
    setSyncDirection('pull');

    await villageData.refreshCloudData();

    setIsSyncing(false);
    setSyncDirection(null);
    onShowToast('Data terbaru berhasil disinkronkan dari Supabase Cloud.');
  };

  const copySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    onShowToast('Skrip SQL Schema Supabase berhasil disalin ke clipboard.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const isConnected = connectionStatus?.success || villageData.isCloudConnected;

  return (
    <div className="space-y-8">
      {/* Supabase Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Koneksi Database Cloud & Realtime Supabase
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isConnected 
                    ? 'bg-emerald-800 text-emerald-100 border border-emerald-600' 
                    : 'bg-amber-900/80 text-amber-200 border border-amber-700'
                }`}>
                  {isConnected ? 'TERKONEKSI' : 'BELUM AKTIF'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sinkronisasi persistensi data otomatis antar-pamong (PostgreSQL Cloud, Realtime Replication & Object Storage) untuk seluruh modul Desa Brabo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => runConnectionTest(true)}
              disabled={testingConnection}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Buka Supabase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Realtime Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Status Realtime: <strong>{isConnected ? 'Aktif (Streaming Perubahan Antar-Pamong)' : 'Offline / Menunggu Konfigurasi'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 sm:justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Sinkronisasi Terakhir: <strong>{villageData.lastCloudSync || 'Belum ada'}</strong></span>
          </div>
        </div>

        {/* Live Status Banner */}
        {connectionStatus && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            connectionStatus.success 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
              : 'bg-amber-950/40 border-amber-800 text-amber-200'
          }`}>
            {connectionStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold">{connectionStatus.message}</p>
              {connectionStatus.bucketsFound && connectionStatus.bucketsFound.length > 0 && (
                <p className="text-[11px] text-slate-300">
                  Storage Bucket terdeteksi: <strong>{connectionStatus.bucketsFound.join(', ')}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: API Configuration Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-800" />
              <span>Konfigurasi Kredensial Supabase</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dapatkan dari menu <strong>Project Settings &gt; API</strong> di Dashboard Supabase Anda.
            </p>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Project URL (VITE_SUPABASE_URL) *</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Anon / Public Key (VITE_SUPABASE_ANON_KEY) *</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Aktifkan</span>
              </button>
              {(urlInput || anonKeyInput) && (
                <button
                  type="button"
                  onClick={handleClearCredentials}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  title="Hapus Kredensial"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* Storage Buckets Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-emerald-800" />
              <span>Storage Buckets Terkonfigurasi</span>
            </p>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                <span className="font-mono text-emerald-950 font-bold">{SUPABASE_BUCKETS.CITIZEN_PHOTOS}</span>
                <span className="text-[10px] text-slate-400">Foto Warga (WebP)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                <span className="font-mono text-emerald-950 font-bold">{SUPABASE_BUCKETS.UMKM}</span>
                <span className="text-[10px] text-slate-400">Foto UMKM Desa</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                <span className="font-mono text-emerald-950 font-bold">{SUPABASE_BUCKETS.COMPLAINTS}</span>
                <span className="text-[10px] text-slate-400">Bukti Aduan Warga</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                <span className="font-mono text-emerald-950 font-bold">{SUPABASE_BUCKETS.MEDIA}</span>
                <span className="text-[10px] text-slate-400">Warta & Galeri</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                <span className="font-mono text-emerald-950 font-bold">{SUPABASE_BUCKETS.DOCUMENTS}</span>
                <span className="text-[10px] text-slate-400">Arsip Surat Resmi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sync Center & SQL Schema */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Sync Actions Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <span>Pusat Sinkronisasi Data Cloud</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Setiap perubahan yang Anda lakukan di Admin CMS otomatis dikirim ke Supabase secara background. Gunakan tombol di bawah ini untuk sinkronisasi massal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">Kirim Massal ke Supabase (Push)</h5>
                    <p className="text-[10px] text-emerald-800">Inisialisasi / perbarui seluruh data</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Menyimpan seluruh data pamong ({villageData.officials.length}), surat ({villageData.submissions.length}), aduan ({villageData.complaints.length}), UMKM ({villageData.umkmList.length}), demografi ({villageData.hamletDemographics.length} dusun), kegiatan ({villageData.activities.length}), warta ({villageData.news.length}), peta ({villageData.mapLocations.length}), dan foto warga ({villageData.citizenPhotos.length}) ke tabel Supabase.
                </p>
                <button
                  onClick={handlePushAllData}
                  disabled={isSyncing || !isConnected}
                  className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${isSyncing && syncDirection === 'push' ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing && syncDirection === 'push' ? 'Menyinkronkan...' : 'Sinkronkan Seluruh Data ke Cloud'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-800 text-white flex items-center justify-center">
                    <DownloadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-blue-950">Tarik dari Supabase (Pull)</h5>
                    <p className="text-[10px] text-blue-800">Muat data terbaru dari cloud</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Mengunduh update data pamong, permohonan surat, aduan warga, dan pendaftaran UMKM terbaru dari tabel Supabase ke dalam cache aplikasi portal desa.
                </p>
                <button
                  onClick={handlePullAllData}
                  disabled={isSyncing || !isConnected}
                  className="w-full py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <DownloadCloud className={`w-4 h-4 ${isSyncing && syncDirection === 'pull' ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing && syncDirection === 'pull' ? 'Mengunduh...' : 'Tarik Data Terbaru'}</span>
                </button>
              </div>
            </div>

            {/* Sync Details Log */}
            {syncDetails && (
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[11px] space-y-1.5 font-mono">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hasil Sinkronisasi Tabel:</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
                  {Object.entries(syncDetails).map(([tbl, status]) => (
                    <div key={tbl} className="p-1.5 bg-slate-800/80 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block">{tbl}:</span>
                      <span className="text-emerald-300 font-bold">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Supabase SQL Schema Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-800" />
                  <span>Skrip SQL Schema & Storage Setup</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Salin dan jalankan skrip ini sekali pada menu <strong>SQL Editor</strong> di Dashboard Supabase Anda.
                </p>
              </div>
              <button
                onClick={copySqlSchema}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin SQL Schema'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 text-emerald-300 rounded-2xl text-[10px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800 select-all">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
