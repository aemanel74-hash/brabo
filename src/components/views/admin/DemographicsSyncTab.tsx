import React, { useState } from 'react';
import { useVillageData } from '../../../context/VillageDataContext';
import { VerificationBadge } from '../../common/VerificationBadge';
import { 
  Users, 
  RefreshCw, 
  Plus, 
  Baby, 
  UserMinus, 
  UserPlus, 
  Home, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  ShieldCheck, 
  Database, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  FileSpreadsheet,
  Activity,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

interface DemographicsSyncTabProps {
  onOpenSource: (sourceId: string) => void;
  showToast: (msg: string) => void;
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

export const DemographicsSyncTab: React.FC<DemographicsSyncTabProps> = ({ onOpenSource, showToast }) => {
  const { 
    hamletDemographics, 
    villageDemographicSummary, 
    demographicEvents, 
    updateHamletDemographic, 
    recordDemographicEvent, 
    deleteDemographicEvent,
    syncFromBps2026 
  } = useVillageData();

  const [isSyncingBps, setIsSyncingBps] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingHamletId, setEditingHamletId] = useState<string | null>(null);

  // Form State for Event Mutation (Kelahiran, Kematian, Pindah)
  const [eventForm, setEventForm] = useState({
    type: 'KELAHIRAN' as 'KELAHIRAN' | 'KEMATIAN' | 'PINDAH_MASUK' | 'PINDAH_KELUAR',
    hamletId: 'HAMLET-KRAJAN',
    rt: '01',
    rw: '01',
    personName: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    date: new Date().toISOString().split('T')[0],
    reportedBy: 'Keluarga / Ketua RT Setempat',
    notes: '',
  });

  // Edit Hamlet Demographic Modal Form
  const [hamletEditForm, setHamletEditForm] = useState({
    kkCount: 0,
    malePopulation: 0,
    femalePopulation: 0,
    temporarySantriPopulation: 0,
    rtCount: 0,
    rwCount: 1,
    notes: '',
  });

  const handleTriggerBpsSync = () => {
    setIsSyncingBps(true);
    setTimeout(() => {
      const res = syncFromBps2026();
      setIsSyncingBps(false);
      showToast(res.message);
    }, 600);
  };

  const handleOpenEditHamlet = (hamletId: string) => {
    const h = hamletDemographics.find(item => item.hamletId === hamletId);
    if (!h) return;
    setEditingHamletId(hamletId);
    setHamletEditForm({
      kkCount: h.kkCount || 0,
      malePopulation: h.malePopulation || 0,
      femalePopulation: h.femalePopulation || 0,
      temporarySantriPopulation: h.temporarySantriPopulation || 0,
      rtCount: h.rtCount || 0,
      rwCount: h.rwCount || 1,
      notes: h.notes || '',
    });
  };

  const handleSaveHamletEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHamletId) return;

    updateHamletDemographic(editingHamletId, {
      kkCount: Number(hamletEditForm.kkCount),
      malePopulation: Number(hamletEditForm.malePopulation),
      femalePopulation: Number(hamletEditForm.femalePopulation),
      temporarySantriPopulation: Number(hamletEditForm.temporarySantriPopulation),
      rtCount: Number(hamletEditForm.rtCount),
      rwCount: Number(hamletEditForm.rwCount),
      notes: hamletEditForm.notes,
      verificationSource: 'VERIFIED_DESA',
      verificationStatus: 'VERIFIED',
    });

    setEditingHamletId(null);
    showToast('Data demografi dusun berhasil diperbarui.');
  };

  const handleRecordEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.personName.trim()) {
      alert('Mohon isi nama warga atau kepala keluarga yang bersangkutan.');
      return;
    }

    const hamletObj = hamletDemographics.find(h => h.hamletId === eventForm.hamletId);
    const hamletName = hamletObj ? hamletObj.hamletName : 'Dusun Terkait';

    recordDemographicEvent({
      type: eventForm.type,
      hamletId: eventForm.hamletId,
      hamletName,
      rt: eventForm.rt,
      rw: eventForm.rw,
      personName: eventForm.personName,
      gender: eventForm.gender,
      date: eventForm.date,
      reportedBy: eventForm.reportedBy,
      notes: eventForm.notes,
    });

    setIsAddingEvent(false);
    setEventForm({
      type: 'KELAHIRAN',
      hamletId: 'HAMLET-KRAJAN',
      rt: '01',
      rw: '01',
      personName: '',
      gender: 'Laki-laki',
      date: new Date().toISOString().split('T')[0],
      reportedBy: 'Keluarga / Ketua RT Setempat',
      notes: '',
    });

    showToast(`Peristiwa ${eventForm.type.toLowerCase()} berhasil dicatat dan grafik demografi langsung tersinkronisasi.`);
  };

  const hamletChartData = hamletDemographics.map(h => ({
    name: h.hamletName.replace('Dusun ', ''),
    Laki: h.malePopulation,
    Perempuan: h.femalePopulation,
    Santri: h.temporarySantriPopulation,
    Total: h.totalPopulation,
    KK: h.kkCount,
  }));

  const pieData = hamletDemographics.map(h => ({
    name: h.hamletName,
    value: h.totalPopulation,
  }));

  return (
    <div className="space-y-8">
      {/* Header Panel with BPS 2026 Sync Trigger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              Sinkronisasi Real-Time Demografi
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              BPS Grobogan Rilis 2026
            </span>
            <VerificationBadge 
              status="VERIFIED" 
              verificationSource={villageDemographicSummary.verificationSource}
              sourceId={villageDemographicSummary.sourceId} 
              onOpenSource={onOpenSource} 
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Buku Induk Penduduk & Gateway BPS 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Pusat pemutakhiran statistik kependudukan Desa Brabo. Menggabungkan pencatatan mutasi harian (Kelahiran, Kematian, Pindah Datang, Pindah Keluar) per dusun dengan data agregat BPS Grobogan terbaru tahun 2026 secara otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Mutasi / Peristiwa Warga</span>
          </button>

          <button
            onClick={handleTriggerBpsSync}
            disabled={isSyncingBps}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingBps ? 'animate-spin' : ''}`} />
            <span>{isSyncingBps ? 'Menghubungkan BPS...' : 'Tarik Data BPS 2026'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Penduduk Definitif</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {villageDemographicSummary.totalPopulation.toLocaleString('id-ID')}
          </p>
          <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-100">
            <span>L: <strong>{villageDemographicSummary.malePopulation.toLocaleString('id-ID')}</strong></span>
            <span>P: <strong>{villageDemographicSummary.femalePopulation.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Kepala Keluarga (KK)</span>
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {villageDemographicSummary.kkCount.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Tersebar di <strong>{villageDemographicSummary.rwCount} RW</strong> & <strong>{villageDemographicSummary.rtCount} RT</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Santri Mukim Non-KTP</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-tight">
            +{villageDemographicSummary.temporarySantriCount.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Total Jiwa Mukim: <strong>{villageDemographicSummary.totalWithSantri.toLocaleString('id-ID')}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Kepadatan & Wilayah</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {villageDemographicSummary.densityPerKm2}
          </p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Jiwa / km² • Luas: <strong>456,97 Ha</strong>
          </p>
        </div>
      </div>

      {/* Vital Statistics (Mutasi Tahun Berjalan) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Indikator Mutasi Penduduk Berjalan (Tahun {villageDemographicSummary.year})
            </h3>
            <p className="text-xs text-slate-400">
              Hasil agregasi akumulasi pelaporan kelahiran, kematian, dan kepindahan per dusun.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
            Pertumbuhan Alami: +{villageDemographicSummary.birthsCount - villageDemographicSummary.deathsCount} Jiwa
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <Baby className="w-4 h-4" />
              <span>Kelahiran</span>
            </div>
            <p className="text-2xl font-black text-white">+{villageDemographicSummary.birthsCount}</p>
            <p className="text-[10px] text-slate-400">Tercatat Akta Lahir</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-rose-400 font-bold">
              <UserMinus className="w-4 h-4" />
              <span>Kematian</span>
            </div>
            <p className="text-2xl font-black text-white">-{villageDemographicSummary.deathsCount}</p>
            <p className="text-[10px] text-slate-400">Surat Kematian Diterbitkan</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
              <UserPlus className="w-4 h-4" />
              <span>Pindah Masuk</span>
            </div>
            <p className="text-2xl font-black text-white">+{villageDemographicSummary.inMigrantsCount}</p>
            <p className="text-[10px] text-slate-400">SKPWNI Disdukcapil</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>Pindah Keluar</span>
            </div>
            <p className="text-2xl font-black text-white">-{villageDemographicSummary.outMigrantsCount}</p>
            <p className="text-[10px] text-slate-400">Surat Pindah Keluar</p>
          </div>
        </div>
      </div>

      {/* Breakdown per Dusun with Direct Edit Capability */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Rincian Demografi & Buku Induk Per Dusun
            </h3>
            <p className="text-xs text-slate-500">
              Pamong desa dan Kadus dapat menyesuaikan statistik KK dan jumlah jiwa secara berkala.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hamletDemographics.map((hamlet) => (
            <div 
              key={hamlet.hamletId} 
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                    {hamlet.alias}
                  </span>
                  <VerificationBadge 
                    status={hamlet.verificationStatus} 
                    verificationSource={hamlet.verificationSource}
                    onOpenSource={onOpenSource} 
                  />
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">{hamlet.hamletName}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{hamlet.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500">Jumlah Penduduk:</span>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">{hamlet.totalPopulation.toLocaleString('id-ID')} Jiwa</p>
                    <span className="text-[10px] text-slate-400">L: {hamlet.malePopulation} • P: {hamlet.femalePopulation}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500">Kepala Keluarga:</span>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">{hamlet.kkCount.toLocaleString('id-ID')} KK</p>
                    <span className="text-[10px] text-slate-400">{hamlet.rtCount} RT • {hamlet.rwCount} RW</span>
                  </div>
                </div>

                {hamlet.temporarySantriPopulation > 0 && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-center justify-between">
                    <span>Santri Mukim Kompleks:</span>
                    <strong className="text-amber-800">+{hamlet.temporarySantriPopulation.toLocaleString('id-ID')} Orang</strong>
                  </div>
                )}

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Mutasi Thn Ini:</span>
                  <span className="font-semibold text-slate-700">
                    Lhr: +{hamlet.birthsThisYear} • Wft: -{hamlet.deathsThisYear} • Msk: +{hamlet.inMigrantsThisYear}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Update: {new Date(hamlet.lastSynchronized).toLocaleDateString('id-ID')}
                </span>
                <button
                  onClick={() => handleOpenEditHamlet(hamlet.hamletId)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-all"
                >
                  Edit Data Dusun
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Charts (Bar & Pie Demografi Real-Time) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart Komposisi Dusun */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Komposisi Gender & Santri per Dusun (2026)
              </h3>
              <p className="text-xs text-slate-500">Perbandingan riil dari Buku Induk Pemdes Brabo</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hamletChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Laki" name="Laki-laki" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Perempuan" name="Perempuan" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Santri" name="Santri Mukim" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Proporsi Penduduk */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Distribusi Populasi Antardusun (%)
              </h3>
              <p className="text-xs text-slate-500">Kepadatan tertinggi di Dusun Krajan</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString('id-ID')} Jiwa`, 'Populasi']} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Riwayat Log Mutasi & Catatan Peristiwa */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Riwayat Log Mutasi & Pembaruan Kependudukan
            </h3>
            <p className="text-xs text-slate-500">
              Catatan kronologis perubahan data penduduk, pelaporan warga, dan penarikan API BPS 2026.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Total {demographicEvents.length} Catatan Log
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-hidden">
          {demographicEvents.map((evt) => {
            const isBps = evt.type === 'SINKRONISASI_BPS';
            const isBirth = evt.type === 'KELAHIRAN';
            const isDeath = evt.type === 'KEMATIAN';
            const isIn = evt.type === 'PINDAH_MASUK';

            let badgeColor = 'bg-slate-100 text-slate-700';
            if (isBps) badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
            else if (isBirth) badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            else if (isDeath) badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
            else if (isIn) badgeColor = 'bg-teal-100 text-teal-800 border-teal-200';

            return (
              <div key={evt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/80 px-3 rounded-xl transition-all">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{evt.personName}</span>
                    <span className="text-xs text-slate-500">• {evt.hamletName} {evt.rt !== 'Semua' ? `(RT ${evt.rt} / RW ${evt.rw})` : ''}</span>
                  </div>
                  <p className="text-xs text-slate-600">{evt.notes || 'Tidak ada catatan tambahan.'}</p>
                  <p className="text-[11px] text-slate-400">
                    Pelapor/Sumber: <strong>{evt.reportedBy}</strong> • Tanggal Peristiwa: {evt.date}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">{evt.recordedAt}</span>
                  <button
                    onClick={() => {
                      if (confirm('Hapus riwayat log ini?')) {
                        deleteDemographicEvent(evt.id);
                        showToast('Log riwayat berhasil dihapus.');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all opacity-80 group-hover:opacity-100"
                    title="Hapus Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Catat Peristiwa / Mutasi Kependudukan */}
      {isAddingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Catat Mutasi / Peristiwa Kependudukan
              </h3>
              <button
                onClick={() => setIsAddingEvent(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleRecordEventSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jenis Peristiwa / Mutasi:</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="KELAHIRAN">👶 Kelahiran (+1 Jiwa)</option>
                  <option value="KEMATIAN">🕊️ Kematian (-1 Jiwa)</option>
                  <option value="PINDAH_MASUK">🏠 Pindah Masuk Domisili (+1 Jiwa)</option>
                  <option value="PINDAH_KELUAR">📦 Pindah Keluar Domisili (-1 Jiwa)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Dusun:</label>
                  <select
                    value={eventForm.hamletId}
                    onChange={(e) => setEventForm({ ...eventForm, hamletId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {hamletDemographics.map(h => (
                      <option key={h.hamletId} value={h.hamletId}>{h.hamletName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">RT:</label>
                  <input
                    type="text"
                    value={eventForm.rt}
                    onChange={(e) => setEventForm({ ...eventForm, rt: e.target.value })}
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">RW:</label>
                  <input
                    type="text"
                    value={eventForm.rw}
                    onChange={(e) => setEventForm({ ...eventForm, rw: e.target.value })}
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Warga / Kepala Keluarga Bersangkutan:</label>
                <input
                  type="text"
                  required
                  value={eventForm.personName}
                  onChange={(e) => setEventForm({ ...eventForm, personName: e.target.value })}
                  placeholder="Contoh: Ananda Muhammad Arifin / Alm. Bpk. Suparman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jenis Kelamin:</label>
                  <select
                    value={eventForm.gender}
                    onChange={(e) => setEventForm({ ...eventForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Peristiwa:</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pelapor / Dasar Dokumen:</label>
                <input
                  type="text"
                  value={eventForm.reportedBy}
                  onChange={(e) => setEventForm({ ...eventForm, reportedBy: e.target.value })}
                  placeholder="Contoh: Keluarga / Ketua RT 02 / SKPWNI No. 470"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Keterangan Tambahan:</label>
                <textarea
                  rows={2}
                  value={eventForm.notes}
                  onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                  placeholder="Keterangan penyesuaian KK baru / nomor surat..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Simpan & Mutasikan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Data Dusun */}
      {editingHamletId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Angka Demografi {hamletDemographics.find(h => h.hamletId === editingHamletId)?.hamletName}
              </h3>
              <button
                onClick={() => setEditingHamletId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveHamletEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Laki-laki (Jiwa):</label>
                  <input
                    type="number"
                    value={hamletEditForm.malePopulation}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, malePopulation: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Perempuan (Jiwa):</label>
                  <input
                    type="number"
                    value={hamletEditForm.femalePopulation}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, femalePopulation: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kepala Keluarga (KK):</label>
                  <input
                    type="number"
                    value={hamletEditForm.kkCount}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, kkCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Santri Mukim Kompleks:</label>
                  <input
                    type="number"
                    value={hamletEditForm.temporarySantriPopulation}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, temporarySantriPopulation: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jumlah RT:</label>
                  <input
                    type="number"
                    value={hamletEditForm.rtCount}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, rtCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jumlah RW:</label>
                  <input
                    type="number"
                    value={hamletEditForm.rwCount}
                    onChange={(e) => setHamletEditForm({ ...hamletEditForm, rwCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Verifikasi Pamong:</label>
                <textarea
                  rows={2}
                  value={hamletEditForm.notes}
                  onChange={(e) => setHamletEditForm({ ...hamletEditForm, notes: e.target.value })}
                  placeholder="Dasar pencatatan Buku Induk Pamong..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingHamletId(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Simpan Pembaruan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
