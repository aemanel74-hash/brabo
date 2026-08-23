import React, { useState } from 'react';
import { VILLAGE_PROFILE } from '../../data/research/villageProfile';
import { HISTORY_EVENTS } from '../../data/research/history';
import { DEMOGRAPHIC_STATS, POPULATION_AGE_DISTRIBUTION, LIVELIHOOD_DISTRIBUTION } from '../../data/research/demographics';
import { VerificationBadge } from '../common/VerificationBadge';
import { useVillageData } from '../../context/VillageDataContext';
import { UmkmShowcaseSection } from '../profile/UmkmShowcaseSection';
import { RealtimeDemographicsSection } from '../profile/RealtimeDemographicsSection';
import { 
  Building2, 
  History, 
  Target, 
  MapPin, 
  Users, 
  Compass, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  Store
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ProfileViewProps {
  onOpenSource: (sourceId: string) => void;
  defaultSection?: 'sejarah' | 'visi' | 'geografis' | 'demografi' | 'umkm';
}

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSource, defaultSection = 'sejarah' }) => {
  const [activeSection, setActiveSection] = useState<'sejarah' | 'visi' | 'geografis' | 'demografi' | 'umkm'>(defaultSection);
  const { umkmList, addUmkm } = useVillageData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Profil Komprehensif
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Profil Resmi Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menelusuri sejarah babad pembukaan wilayah oleh Tidjoyo, etimologi penamaan Brah-Bo, visi misi desa, letak geografis berbatasan dengan Demak, serta demografi 5.244 jiwa penduduk.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-emerald-800/60">
          <button
            onClick={() => setActiveSection('sejarah')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'sejarah'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sejarah & Babad</span>
          </button>
          <button
            onClick={() => setActiveSection('visi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'visi'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Visi & Misi</span>
          </button>
          <button
            onClick={() => setActiveSection('geografis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'geografis'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Letak Geografis & Batas</span>
          </button>
          <button
            onClick={() => setActiveSection('demografi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'demografi'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Demografi Penduduk</span>
          </button>
          <button
            onClick={() => setActiveSection('umkm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSection === 'umkm'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>UMKM & Niaga Desa ({umkmList.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: SEJARAH & BABAD TIMELINE */}
      {activeSection === 'sejarah' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-6 h-6 text-emerald-600" />
                  Kronologi & Babad Sejarah Desa Brabo
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Disusun berdasarkan sumber babad lisan, arsip pesantren tertua, dan catatan dokumen pemerintah.
                </p>
              </div>
              <VerificationBadge status="SUPPORTED" sourceId="SRC-BABAD-LOKAL" onOpenSource={onOpenSource} showSourceTitle={true} />
            </div>

            {/* Timeline Tree */}
            <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-8 mt-8 space-y-8 pb-4">
              {HISTORY_EVENTS.map((event, idx) => (
                <div key={event.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-600 group-hover:scale-125 group-hover:bg-emerald-600 transition-all shadow-xs" />

                  <div className="bg-slate-50 hover:bg-emerald-50/40 p-5 rounded-2xl border border-slate-200/80 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {event.periodOrYear}
                      </span>
                      <VerificationBadge status={event.status} sourceId={event.sourceId} onOpenSource={onOpenSource} />
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {event.eventDescription}
                    </p>

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {event.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Historical Synthesis Note */}
            <div className="mt-8 bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-950">Prinsip Keterbukaan Sejarah KKN:</p>
                <p className="leading-relaxed">
                  Narasi sejarah di atas bersumber dari babad tutur tradisi dan arsip pesantren terdaftar. Apabila terdapat catatan babad resmi lainnya yang dimiliki keluarga sesepuh desa atau dokumen primer tambahan, data ini dapat dimutakhirkan melalui menu Admin Pengelola Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VISI & MISI */}
      {activeSection === 'visi' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vision Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-7 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Visi Desa
                  </span>
                  <VerificationBadge status={VILLAGE_PROFILE.vision.status} sourceId={VILLAGE_PROFILE.vision.sourceId} onOpenSource={onOpenSource} />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Arah Pembangunan Desa
                </h3>
                <blockquote className="text-sm italic leading-relaxed text-emerald-100 bg-emerald-950/40 p-4 rounded-xl border border-emerald-700/40">
                  "{VILLAGE_PROFILE.vision.text}"
                </blockquote>
              </div>

              <div className="text-[11px] text-emerald-300/80 pt-4 border-t border-emerald-700/60">
                Memerlukan verifikasi formal naskah RPJMDes pada masa kepemimpinan Kades terpilih.
              </div>
            </div>

            {/* Mission List */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-7 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Misi Pembangunan Desa Brabo
                  </h3>
                  <p className="text-xs text-slate-500">Pilar pelaksanaan program kerja dan pelayanan</p>
                </div>
                <VerificationBadge status={VILLAGE_PROFILE.missions.status} sourceId={VILLAGE_PROFILE.missions.sourceId} onOpenSource={onOpenSource} />
              </div>

              <div className="space-y-3">
                {VILLAGE_PROFILE.missions.items.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {m}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: GEOGRAFIS & BATAS */}
      {activeSection === 'geografis' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-emerald-600" />
                  Kondisi Geografis & Batas Wilayah
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Luas wilayah 456,97 Ha (4,57 km²) di dataran agraris bagian barat Kabupaten Grobogan.
                </p>
              </div>
              <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} showSourceTitle={true} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boundaries Box */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Batas Wilayah Administratif
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-semibold">Utara</p>
                    <p className="font-bold text-slate-800 mt-1">{VILLAGE_PROFILE.boundaries.north}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-semibold">Timur</p>
                    <p className="font-bold text-slate-800 mt-1">{VILLAGE_PROFILE.boundaries.east}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-semibold">Selatan</p>
                    <p className="font-bold text-slate-800 mt-1">{VILLAGE_PROFILE.boundaries.south}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-semibold">Barat</p>
                    <p className="font-bold text-slate-800 mt-1">{VILLAGE_PROFILE.boundaries.west}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 leading-relaxed">
                  {VILLAGE_PROFILE.geographicNote}
                </div>
              </div>

              {/* Administrative Breakdown */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    Kode Wilayah & Kewilayahan
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Kode Kemendagri:</span>
                      <span className="font-mono font-bold text-slate-900">{VILLAGE_PROFILE.kemendagriCode}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Kode Pos Resmi:</span>
                      <span className="font-mono font-bold text-emerald-700">{VILLAGE_PROFILE.postalCode}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Jumlah Dusun:</span>
                      <span className="font-bold text-slate-900">3 Dusun (Dukoh, Krajan, Cangkring)</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Jumlah Rukun Warga (RW):</span>
                      <span className="font-bold text-slate-900">4 RW</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-600">Jumlah Rukun Tetangga (RT):</span>
                      <span className="font-bold text-slate-900">32 RT</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic pt-2">
                  Data telah disinkronkan dengan Buku Profil Kecamatan Tanggungharjo Dalam Angka (BPS Grobogan).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: DEMOGRAFI & CHARTS */}
      {activeSection === 'demografi' && (
        <RealtimeDemographicsSection onOpenSource={onOpenSource} />
      )}

      {/* SECTION 5: DIREKTORI UMKM DESA BRABO */}
      {activeSection === 'umkm' && (
        <UmkmShowcaseSection
          umkmList={umkmList}
          onAddUmkm={addUmkm}
          onOpenSource={onOpenSource}
        />
      )}
    </div>
  );
};
