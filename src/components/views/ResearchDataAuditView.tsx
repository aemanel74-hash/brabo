import React, { useState } from 'react';
import { RESEARCH_SOURCES } from '../../data/research/sources';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Eye,
  Database,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { SourceCitation } from '../../types';

interface ResearchDataAuditViewProps {
  onOpenSource: (sourceId: string) => void;
}

export const ResearchDataAuditView: React.FC<ResearchDataAuditViewProps> = ({ onOpenSource }) => {
  const [selectedTier, setSelectedTier] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sourcesList = Object.values(RESEARCH_SOURCES);

  const filteredSources = sourcesList.filter(src => {
    const matchTier = selectedTier === 'Semua' || `Tier ${src.tier}` === selectedTier;
    const matchSearch = searchQuery === '' ||
      src.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (src.notes && src.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTier && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Audit Integritas Data & Sumber Publik
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
              Prinsip: RESEARCH → VERIFY → DEVELOP
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pusat Verifikasi Sumber Riset KKN
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Situs web ini menolak praktik rekayasa data. Setiap informasi (sejarah, demografi, sekolah, nama kepala desa) ditautkan ke kode sumber resmi dan label verifikasi yang dapat diaudit secara terbuka.
          </p>
        </div>
      </div>

      {/* Verification Level Explanatory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <h4 className="text-xs font-bold text-emerald-950">VERIFIED (Terverifikasi)</h4>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Didukung dokumen resmi pemerintah (BPS, SK Pelantikan Pemkab, Kemendikbud Dapodik).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-600" />
            <h4 className="text-xs font-bold text-teal-950">SUPPORTED (Didukung Data)</h4>
          </div>
          <p className="text-[11px] text-teal-800 leading-relaxed">
            Didukung arsip yayasan pesantren terdaftar atau tradisi lisan babad desa yang konsisten.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600" />
            <h4 className="text-xs font-bold text-amber-950">PERLU VERIFIKASI DESA</h4>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Struktur nama perangkat desa atau kontak langsung yang wajib divalidasi oleh pamong desa setempat.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <h4 className="text-xs font-bold text-rose-950">TIDAK DITEMUKAN / DILARANG</h4>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">
            Data tidak dikarang atau dibuat-buat secara sembarangan oleh tim pengembang website.
          </p>
        </div>
      </div>

      {/* Sources Directory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>Daftar Sumber Rujukan Primer & Sekunder</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik kode sumber pada badge mana pun di aplikasi untuk membuka rujukan ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex gap-1 text-xs">
              {['Semua', 'Tier 1', 'Tier 2'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedTier === tier
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari ID sumber, penerbit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Source Items */}
        <div className="space-y-4">
          {filteredSources.map((src) => (
            <div
              key={src.id}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/30 border border-slate-200/80 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-800 text-white shadow-xs">
                    {src.id}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Tier {src.tier}: {src.tier === 1 ? 'Pemerintah / BPS Resmi' : 'Arsip Lembaga / Komunitas'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Tahun Publikasi: <strong>{src.year || '2020-2024'}</strong></span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{src.title}</h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Penerbit: {src.publisher}</p>
              </div>

              {src.notes && (
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                  {src.notes}
                </p>
              )}

              {src.url && (
                <div className="pt-1 flex items-center gap-2 text-xs">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Kunjungi Tautan Publikasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
