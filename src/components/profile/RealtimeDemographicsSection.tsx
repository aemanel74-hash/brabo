import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { LIVELIHOOD_DISTRIBUTION, POPULATION_AGE_DISTRIBUTION } from '../../data/research/demographics';
import { 
  Users, 
  Home, 
  Building2, 
  Baby, 
  UserMinus, 
  UserPlus, 
  ArrowUpRight, 
  Activity, 
  Layers, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

interface RealtimeDemographicsSectionProps {
  onOpenSource: (sourceId: string) => void;
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

export const RealtimeDemographicsSection: React.FC<RealtimeDemographicsSectionProps> = ({ onOpenSource }) => {
  const { hamletDemographics, villageDemographicSummary, demographicEvents } = useVillageData();
  const [activeSubTab, setActiveSubTab] = useState<'ringkasan' | 'dusun' | 'pekerjaan_usia' | 'log'>('ringkasan');

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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
        
        {/* Header with Verification Badge & 2026 Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                Data Real-Time Kependudukan
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Sinkron BPS Grobogan {villageDemographicSummary.year}
              </span>
              <VerificationBadge 
                status={villageDemographicSummary.status} 
                verificationSource={villageDemographicSummary.verificationSource}
                sourceId={villageDemographicSummary.sourceId} 
                onOpenSource={onOpenSource} 
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Statistik Demografi Terintegrasi Buku Induk & BPS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Data dinamis yang diperbarui secara berkala dari pencatatan pamong 3 dusun dan publikasi BPS Kabupaten Grobogan.
            </p>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 inline-block">
              Terakhir Dimutakhirkan: {new Date(villageDemographicSummary.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Top 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Total Penduduk Definitif</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {villageDemographicSummary.totalPopulation.toLocaleString('id-ID')}
            </p>
            <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-emerald-200/60">
              <span>L: <strong>{villageDemographicSummary.malePopulation.toLocaleString('id-ID')}</strong></span>
              <span>P: <strong>{villageDemographicSummary.femalePopulation.toLocaleString('id-ID')}</strong></span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-800">
              <span>Kepala Keluarga (KK)</span>
              <Home className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {villageDemographicSummary.kkCount.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-blue-200/60">
              Tersebar di <strong>{villageDemographicSummary.rwCount} RW</strong> & <strong>{villageDemographicSummary.rtCount} RT</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>Santri Mukim Pesantren</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              +{villageDemographicSummary.temporarySantriCount.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/60">
              Total Jiwa Mukim: <strong>{villageDemographicSummary.totalWithSantri.toLocaleString('id-ID')} Jiwa</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border border-purple-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-purple-800">
              <span>Kepadatan Penduduk</span>
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {villageDemographicSummary.densityPerKm2}
            </p>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-purple-200/60">
              Jiwa / km² • Wilayah: <strong>456,97 Ha</strong>
            </p>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {[
            { id: 'ringkasan', label: 'Grafik & Indikator Mutasi', icon: Activity },
            { id: 'dusun', label: 'Rincian 3 Dusun & Santri', icon: Layers },
            { id: 'pekerjaan_usia', label: 'Pekerjaan & Struktur Usia', icon: TrendingUp },
            { id: 'log', label: `Log Pembaruan (${demographicEvents.length})`, icon: Clock },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUBTAB 1: RINGKASAN GRAFIK & MUTASI */}
        {activeSubTab === 'ringkasan' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Vital Mutasi Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                  <Activity className="w-4 h-4" />
                  Statistik Mutasi Penduduk Berjalan (Tahun {villageDemographicSummary.year})
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Pertumbuhan Alami: +{villageDemographicSummary.birthsCount - villageDemographicSummary.deathsCount} Jiwa
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <Baby className="w-3.5 h-3.5" />
                    <span>Kelahiran</span>
                  </div>
                  <p className="text-2xl font-black text-white">+{villageDemographicSummary.birthsCount}</p>
                  <p className="text-[10px] text-slate-400">Tercatat di Desa</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Kematian</span>
                  </div>
                  <p className="text-2xl font-black text-white">-{villageDemographicSummary.deathsCount}</p>
                  <p className="text-[10px] text-slate-400">Surat Kematian</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Pindah Masuk</span>
                  </div>
                  <p className="text-2xl font-black text-white">+{villageDemographicSummary.inMigrantsCount}</p>
                  <p className="text-[10px] text-slate-400">SKPWNI Disdukcapil</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Pindah Keluar</span>
                  </div>
                  <p className="text-2xl font-black text-white">-{villageDemographicSummary.outMigrantsCount}</p>
                  <p className="text-[10px] text-slate-400">Pindah Domisili</p>
                </div>
              </div>
            </div>

            {/* Charts: Bar & Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart Gender & Santri */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Komposisi Gender & Santri per Dusun (2026)
                  </h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hamletChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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

              {/* Pie Chart Distribusi Dusun */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    Distribusi Persentase Penduduk Antardusun
                  </h3>
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
          </div>
        )}

        {/* SUBTAB 2: RINCIAN 3 DUSUN */}
        {activeSubTab === 'dusun' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hamletDemographics.map((hamlet) => (
                <div 
                  key={hamlet.hamletId} 
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 flex flex-col justify-between"
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
                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{hamlet.notes}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-500">Penduduk Definitif:</span>
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
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
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

                  <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-right">
                    Sinkronisasi: {new Date(hamlet.lastSynchronized).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: PEKERJAAN & STRUKTUR USIA */}
        {activeSubTab === 'pekerjaan_usia' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-150">
            {/* Livelihood Chart */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Estimasi Komposisi Mata Pencaharian (%)
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={LIVELIHOOD_DISTRIBUTION} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" unit="%" />
                    <YAxis type="category" dataKey="sector" width={110} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Proporsi']} />
                    <Bar dataKey="percentage" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Age Distribution Chart */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Struktur Usia Penduduk Desa
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={POPULATION_AGE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="group"
                    >
                      {POPULATION_AGE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} Jiwa`, 'Estimasi']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {POPULATION_AGE_DISTRIBUTION.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-600 truncate">{entry.group}: <strong>{entry.count}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: LOG PEMBARUAN */}
        {activeSubTab === 'log' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="divide-y divide-slate-100">
              {demographicEvents.map(evt => {
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
                  <div key={evt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`}>
                          {evt.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{evt.personName}</span>
                        <span className="text-xs text-slate-500">• {evt.hamletName}</span>
                      </div>
                      <p className="text-xs text-slate-600">{evt.notes || 'Pembaruan data Buku Induk Kependudukan.'}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{evt.recordedAt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
