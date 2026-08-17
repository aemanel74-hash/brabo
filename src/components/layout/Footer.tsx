import React from 'react';
import { Landmark, MapPin, Mail, Phone, ExternalLink, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSourceModal: (sourceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenSourceModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner */}
      <div className="bg-emerald-950 border-b border-emerald-900/60 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Desa Digital & Terbuka
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Desa Brabo: Pusat Syiar Santri & Kemandirian Agraris
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl">
              Dibangun dengan transparansi data riset publik terverifikasi oleh Tim KKN bersama Pemerintah Desa Brabo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('riset')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600/40 shadow-sm transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Verifikasi Sumber Data</span>
            </button>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs transition-colors"
              title="Kembali ke Atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Pemerintah Desa Brabo</h4>
                <p className="text-xs text-slate-400">Kec. Tanggungharjo, Kab. Grobogan, Jawa Tengah</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Website ini menyajikan informasi resmi penyelenggaraan pemerintahan, data kependudukan, sejarah berdirinya desa, potensi pesantren & pertanian, serta pelayanan administrasi surat bagi seluruh warga Desa Brabo.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jl. Raya Brabo - Tanggungharjo, Dusun Krajan, Desa Brabo, Tanggungharjo, Grobogan, Jawa Tengah 58166</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>pemdes.brabo@grobogan.go.id (Rujukan Resmi Desa)</span>
              </div>
            </div>
          </div>

          {/* Quick Links 1: Profil & Dusun */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-emerald-500 pl-2">
              Kewilayahan
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('profil')} className="hover:text-emerald-400 transition-colors">
                  Sejarah & Asal-usul
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dusun')} className="hover:text-emerald-400 transition-colors">
                  Dusun I Dukoh (Situs Merapi)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dusun')} className="hover:text-emerald-400 transition-colors">
                  Dusun II Krajan (Pusat Desa)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dusun')} className="hover:text-emerald-400 transition-colors">
                  Dusun III Cangkring (Lumbung Tani)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('peta')} className="hover:text-emerald-400 transition-colors">
                  Peta Batas Wilayah
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2: Layanan & Informasi */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-emerald-500 pl-2">
              Pelayanan Publik
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('layanan')} className="hover:text-emerald-400 transition-colors">
                  Surat Keterangan Usaha (SKU)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('layanan')} className="hover:text-emerald-400 transition-colors">
                  Surat Keterangan Tidak Mampu (SKTM)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('layanan')} className="hover:text-emerald-400 transition-colors">
                  Surat Keterangan Domisili Santri
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('layanan')} className="hover:text-emerald-400 transition-colors">
                  Pengantar KTP & Kartu Keluarga
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('transparansi')} className="hover:text-emerald-400 transition-colors">
                  Transparansi APBDes
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 3: Sumber Resmi & Standar */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-emerald-500 pl-2">
              Sumber Riset Publik
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenSourceModal('SRC-BPS-2022')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>BPS Grobogan</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSourceModal('SRC-PEMKAB-GROB')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Pemkab Grobogan</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSourceModal('SRC-KEMENDIKBUD-DAPO')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Kemendikbud (SDN 1, 2, 3)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSourceModal('SRC-YAYASAN-TAJUL-ULUM')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Arsip Ponpes Sirojuth Tholibin</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('riset')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Semua Daftar Sumber →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pemerintah Desa Brabo & Tim KKN. Mengacu pada standar sistem keterbukaan OpenSID.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Dirancang dengan integritas data publik</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
