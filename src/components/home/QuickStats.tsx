import React from 'react';
import { DEMOGRAPHIC_STATS } from '../../data/research/demographics';
import { Users, LandPlot, MapPin, Building, ShieldCheck, HeartHandshake } from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';

interface QuickStatsProps {
  onOpenSource: (sourceId: string) => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ onOpenSource }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Statistik Terverifikasi
              </span>
              <span className="text-xs text-slate-500 font-medium">BPS & Pemkab Grobogan (Tahun 2020/2022)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Gambaran Umum Profil Demografi Desa Brabo
            </h2>
          </div>
          <VerificationBadge status="VERIFIED" sourceId="SRC-BPS-2022" onOpenSource={onOpenSource} showSourceTitle={true} />
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Penduduk</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">5.244</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Laki-laki: 2.647 • Perempuan: 2.597
            </p>
            <div className="pt-1">
              <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Luas Wilayah</span>
              <LandPlot className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">456,97</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Hektar (4,57 km²)
            </p>
            <div className="pt-1">
              <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Pembagian Dusun</span>
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">3 Dusun</p>
            <p className="text-[11px] text-slate-500 font-medium">
              4 RW • 32 Rukun Tetangga (RT)
            </p>
            <div className="pt-1">
              <VerificationBadge status="VERIFIED" sourceId="SRC-BPS-2022" onOpenSource={onOpenSource} />
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Kepadatan Penduduk</span>
              <Building className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">1.147</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Jiwa / km² (Terpadat ke-2 se-Kecamatan)
            </p>
            <div className="pt-1">
              <VerificationBadge status="VERIFIED" sourceId="SRC-BPS-2022" onOpenSource={onOpenSource} />
            </div>
          </div>
        </div>

        {/* Additional verified footnote */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mata pencaharian dominan: <strong>Petani (Padi, Tembakau, Jagung)</strong> dan <strong>Buruh Pabrik / Industri</strong>.</span>
          </div>
          <span className="italic text-slate-500 text-[11px]">
            *Data disajikan berdasarkan publikasi resmi tanpa rekayasa data.
          </span>
        </div>
      </div>
    </section>
  );
};
