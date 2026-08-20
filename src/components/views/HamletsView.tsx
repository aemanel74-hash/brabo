import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  Compass, 
  MapPin, 
  Landmark, 
  Sparkles, 
  Layers, 
  Activity, 
  Building2, 
  CheckCircle2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { HamletData } from '../../types';

interface HamletsViewProps {
  onOpenSource: (sourceId: string) => void;
}

export const HamletsView: React.FC<HamletsViewProps> = ({ onOpenSource }) => {
  const { hamlets } = useVillageData();
  const [selectedHamletId, setSelectedHamletId] = useState<string>(hamlets[0]?.id || 'HAMLET-DUKOH');

  const selectedHamlet = hamlets.find(h => h.id === selectedHamletId) || hamlets[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Kewilayahan 3 Dusun
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tiga Dusun Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menelusuri keunikan, peninggalan sejarah, fasilitas, potensi komoditas, dan kegiatan warga di Dusun Dukoh, Dusun Krajan, dan Dusun Cangkring.
          </p>
        </div>
      </div>

      {/* Hamlet Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hamlets.map((hamlet) => {
          const isSelected = hamlet.id === selectedHamletId;
          return (
            <div
              key={hamlet.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedHamletId(hamlet.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedHamletId(hamlet.id);
                }
              }}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-600 shadow-xl shadow-emerald-900/20 ring-2 ring-emerald-500'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Dusun 0{hamlet.order}
                  </span>
                  <VerificationBadge
                    status={hamlet.status}
                    verificationSource={hamlet.verificationSource}
                    verificationNote={hamlet.verificationNote}
                    customSourceName={hamlet.customSourceName}
                    sourceId={hamlet.sourceId}
                    onOpenSource={onOpenSource}
                  />
                </div>

                <h3 className="text-lg font-bold">{hamlet.name}</h3>
                <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {hamlet.alias}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-current/20 flex items-center justify-between text-xs">
                <span className="opacity-90">Lihat Profil Detail</span>
                <span className="font-bold">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hamlet Comprehensive Profile View */}
      {selectedHamlet && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Dusun 0{selectedHamlet.order} • {selectedHamlet.alias}
                </span>
                <VerificationBadge
                  status={selectedHamlet.status}
                  verificationSource={selectedHamlet.verificationSource}
                  verificationNote={selectedHamlet.verificationNote}
                  customSourceName={selectedHamlet.customSourceName}
                  sourceId={selectedHamlet.sourceId}
                  onOpenSource={onOpenSource}
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {selectedHamlet.name}
              </h2>
            </div>

            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <div>
                <span className="font-semibold text-slate-800">Kepala Dusun: </span>
                <span className={`font-medium ${selectedHamlet.headName.toLowerCase().includes('belum') ? 'italic text-amber-700' : 'font-bold text-slate-900'}`}>
                  {selectedHamlet.headName}
                </span>
              </div>
              <VerificationBadge
                status={selectedHamlet.headStatus}
                verificationSource={selectedHamlet.verificationSource}
                verificationNote={selectedHamlet.verificationNote}
                customSourceName={selectedHamlet.customSourceName}
                sourceId={selectedHamlet.headSourceId}
                onOpenSource={onOpenSource}
              />
            </div>
          </div>

          {/* Description & Historical site if available */}
          <div className="space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedHamlet.description}
            </p>

            {selectedHamlet.historicalSite && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <Landmark className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">Situs / Peninggalan Sejarah Khas:</p>
                  <p className="text-amber-800 mt-0.5 leading-relaxed">{selectedHamlet.historicalSite}</p>
                </div>
              </div>
            )}
          </div>

          {/* 4 Cards Grid of Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Characteristics */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Karakteristik Wilayah</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedHamlet.characteristics.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potentials */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Potensi Unggulan Dusun</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedHamlet.potentials.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Fasilitas & Sarana Prasarana</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedHamlet.facilities.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Aktivitas & Kegiatan Warga</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedHamlet.activities.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
