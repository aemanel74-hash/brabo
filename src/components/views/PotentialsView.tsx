import React, { useState } from 'react';
import { VILLAGE_POTENTIALS } from '../../data/research/potentials';
import { VerificationBadge } from '../common/VerificationBadge';
import { useVillageData } from '../../context/VillageDataContext';
import { UmkmShowcaseSection } from '../profile/UmkmShowcaseSection';
import { 
  Sparkles, 
  BookOpen, 
  Wheat, 
  ShoppingBag, 
  Sprout, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Building2,
  Store,
  Plus
} from 'lucide-react';

interface PotentialsViewProps {
  onOpenSource: (sourceId: string) => void;
}

export const PotentialsView: React.FC<PotentialsViewProps> = ({ onOpenSource }) => {
  const { umkmList, addUmkm } = useVillageData();
  const [activeTab, setActiveTab] = useState<'potensi' | 'umkm'>('potensi');

  const getIcon = (category: string) => {
    switch (category) {
      case 'Pendidikan & Pesantren':
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'Pertanian':
        return <Wheat className="w-6 h-6 text-amber-600" />;
      case 'UMKM & Perdagangan':
        return <ShoppingBag className="w-6 h-6 text-blue-600" />;
      case 'Ketahanan Pangan':
      default:
        return <Sprout className="w-6 h-6 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Kekayaan & Komoditas Desa
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-YAYASAN-TAJUL-ULUM" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Potensi Unggulan & UMKM Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Dua pilar utama penopang kemajuan desa: Tradisi keilmuan Islam pesantren yang mendidik ribuan santri, dan hamparan agraris produktif komoditas padi, tembakau, jagung, serta ekosistem UMKM santri.
          </p>

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={() => setActiveTab('potensi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'potensi'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>4 Pilar Potensi Wilayah</span>
            </button>
            <button
              onClick={() => setActiveTab('umkm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'umkm'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80'
              }`}
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Katalog & Pendaftaran UMKM Warga ({umkmList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'potensi' ? (
        /* 4 Major Pillars Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VILLAGE_POTENTIALS.map((pot) => (
            <div
              key={pot.id}
              className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      {getIcon(pot.category)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {pot.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">
                        {pot.title}
                      </h3>
                    </div>
                  </div>
                  <VerificationBadge status={pot.status} sourceId={pot.sourceId} onOpenSource={onOpenSource} />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pot.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Fitur / Komoditas Kunci:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {pot.keyProductsOrFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-slate-700">Dampak:</span>
                  <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">{pot.scaleOrImpact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <UmkmShowcaseSection
          umkmList={umkmList}
          onAddUmkm={addUmkm}
          onOpenSource={onOpenSource}
        />
      )}
    </div>
  );
};
