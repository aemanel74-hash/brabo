import React, { useState } from 'react';
import { VILLAGE_FACILITIES } from '../../data/research/facilities';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  HeartPulse, 
  Landmark, 
  CheckCircle2, 
  Search,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { FacilityItem } from '../../types';

interface FacilitiesViewProps {
  onOpenSource: (sourceId: string) => void;
}

const CATEGORIES = ['Semua', 'Pendidikan', 'Pesantren', 'Pemerintahan', 'Kesehatan', 'Ibadah'];

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({ onOpenSource }) => {
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFacilities = VILLAGE_FACILITIES.filter(item => {
    const matchCat = selectedCat === 'Semua' || item.category === selectedCat;
    const matchSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addressOrLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pendidikan':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'Pesantren':
        return <BookOpen className="w-5 h-5 text-teal-600" />;
      case 'Kesehatan':
        return <HeartPulse className="w-5 h-5 text-red-600" />;
      case 'Pemerintahan':
        return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'Ibadah':
      default:
        return <Building2 className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Sarana & Prasarana
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-KEMENDIKBUD-DAPO" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Fasilitas Desa & Lembaga Pendidikan
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Direktori resmi lembaga pendidikan formal (SD Negeri 1, 2, 3 Brabo, MTs & MA Tajul Ulum), pondok pesantren (Sirojuth Tholibin, Annasriyyah, Attaufiqiyyah), kesehatan, balai desa, dan tempat ibadah.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari fasilitas, NPSN, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {getCategoryIcon(fac.category)}
                </div>
                <VerificationBadge status={fac.status} sourceId={fac.sourceId} onOpenSource={onOpenSource} />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {fac.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {fac.name}
                </h3>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{fac.addressOrLocation}</span>
                </div>

                {fac.npsnOrCode && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                    <span>{fac.npsnOrCode}</span>
                  </div>
                )}

                {fac.accreditation && (
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 w-fit">
                    <Award className="w-3 h-3 text-teal-600" />
                    <span>{fac.accreditation}</span>
                  </div>
                )}

                {fac.yearEstablished && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Berdiri sejak tahun: <strong>{fac.yearEstablished}</strong></span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {fac.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Sarana Publik Desa Brabo</span>
              <span className="font-semibold text-emerald-700">Aktif Digunakan</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
