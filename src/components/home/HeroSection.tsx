import React from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Users, 
  ShieldCheck, 
  Search,
  ArrowRight,
  Compass,
  CheckCircle2,
  TreePine
} from 'lucide-react';
import { NavTab } from '../layout/Navbar';
import { VerificationBadge } from '../common/VerificationBadge';

interface HeroSectionProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSource: (sourceId: string) => void;
  onSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, onOpenSource, onSearch }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6">
      {/* Decorative ambient background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Main Hero Copy */}
          <div className="max-w-2xl text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Portal Resmi Keterbukaan Informasi Desa</span>
              <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Selamat Datang di <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                  Website Digital Desa Brabo
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Pusat informasi, sejarah babad pendirian, struktur pemerintahan, pelayanan surat online, serta potensi agraris dan pesantren di Kecamatan Tanggungharjo, Kabupaten Grobogan.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1 justify-center lg:justify-start">
              <button
                onClick={() => onSelectTab('layanan')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Buat Surat Desa Online</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onSelectTab('dusun')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:text-white"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Jelajahi 3 Dusun</span>
              </button>

              <button
                onClick={() => onSelectTab('profil')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Sejarah & Asal Nama</span>
              </button>
            </div>

            {/* Fast Stats Highlight */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">5.244</p>
                <p className="text-xs text-slate-400 mt-0.5">Penduduk (BPS 2020)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">3 Dusun</p>
                <p className="text-xs text-slate-400 mt-0.5">Dukoh, Krajan, Cangkring</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">456,97</p>
                <p className="text-xs text-slate-400 mt-0.5">Hektar Luas Wilayah</p>
              </div>
            </div>
          </div>

          {/* Quick Access Card Grid */}
          <div className="w-full lg:max-w-md space-y-3">
            <div className="bg-slate-800/80 border border-slate-700/80 backdrop-blur-md rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Akses Cepat Warga & Santri</span>
                </div>
                <span className="text-[11px] text-slate-400">Terbuka 24 Jam</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-left">
                <button
                  onClick={() => onSelectTab('layanan')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-700/50 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                        Layanan Administrasi Surat
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        SKU Usaha, SKTM, Domisili, Pengantar KTP & KK
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectTab('pemerintahan')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-teal-300">
                        Pamong & Kepala Desa
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Mohamad Nurokhim, S.Ag (SK 2019) & Struktur Pamong
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectTab('potensi')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                        Kampung Santri & Pesantren
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        PP Sirojuth Tholibin, MTs/MA Tajul Ulum (Akreditasi A)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectTab('peta')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300">
                        Peta Wilayah & 3 Dusun
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Batas Desa, Lokasi Balai Desa & Lokasi Pendidikan
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Research Integrity Footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Berdasarkan Data BPS & Pemkab
                </span>
                <button
                  onClick={() => onSelectTab('riset')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Lihat Audit Riset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
