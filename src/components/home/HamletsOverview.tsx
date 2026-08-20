import React from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { NavTab } from '../layout/Navbar';
import { Compass, MapPin, Sparkles, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';

interface HamletsOverviewProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSource: (sourceId: string) => void;
}

export const HamletsOverview: React.FC<HamletsOverviewProps> = ({ onSelectTab, onOpenSource }) => {
  const { hamlets } = useVillageData();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Wilayah Administratif
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Tiga Dusun Penyangga Desa Brabo
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Desa Brabo secara resmi terbagi ke dalam {hamlets.length} dusun dengan karakter historis, pusat administrasi, dan lumbung pertanian yang khas.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('dusun')}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>Pelajari Selengkapnya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hamlets.map((hamlet) => {
          return (
            <div
              key={hamlet.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      0{hamlet.order}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {hamlet.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{hamlet.alias}</p>
                    </div>
                  </div>
                  <VerificationBadge
                    status={hamlet.status}
                    verificationSource={hamlet.verificationSource}
                    verificationNote={hamlet.verificationNote}
                    customSourceName={hamlet.customSourceName}
                    sourceId={hamlet.sourceId}
                    onOpenSource={onOpenSource}
                  />
                </div>

                <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {hamlet.description}
                </p>

                {hamlet.historicalSite && (
                  <div className="bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-xs text-amber-900">
                    <p className="font-semibold flex items-center gap-1 text-[11px] text-amber-800">
                      <Landmark className="w-3.5 h-3.5" />
                      Situs / Landmark Khas:
                    </p>
                    <p className="text-[11px] mt-0.5">{hamlet.historicalSite}</p>
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Karakteristik Wilayah:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {hamlet.characteristics.slice(0, 2).map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-600 flex-1 min-w-0 pr-2">
                  <span className="font-medium text-slate-700">Kepala Dusun: </span>
                  <span className={hamlet.headName.toLowerCase().includes('belum') ? 'italic text-amber-700' : 'font-semibold text-slate-900'}>
                    {hamlet.headName}
                  </span>
                </div>
                <button
                  onClick={() => onSelectTab('dusun')}
                  className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shrink-0"
                  title="Lihat Detail Dusun"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
