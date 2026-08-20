import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  FileText, 
  ShieldCheck, 
  Landmark, 
  Users, 
  Sparkles, 
  Layers, 
  PhoneCall, 
  Compass, 
  Calendar,
  Lock,
  MapPin,
  Newspaper,
  DollarSign
} from 'lucide-react';

export type NavTab = 
  | 'beranda'
  | 'profil'
  | 'pemerintahan'
  | 'dusun'
  | 'informasi'
  | 'kegiatan'
  | 'potensi'
  | 'fasilitas'
  | 'layanan'
  | 'transparansi'
  | 'peta'
  | 'riset'
  | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSourceModal: (sourceId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<'profil' | 'pemerintahan' | 'informasi' | null>(null);
  
  // Mobile accordion states
  const [mobileAccordion, setMobileAccordion] = useState<{ [key: string]: boolean }>({
    profil: false,
    pemerintahan: false,
    informasi: false,
  });

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setDesktopDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTabActive = (tab: NavTab) => activeTab === tab;
  const isProfilGroupActive = ['profil', 'fasilitas', 'potensi'].includes(activeTab);
  const isGovGroupActive = ['pemerintahan', 'dusun'].includes(activeTab);
  const isInfoGroupActive = ['informasi', 'kegiatan', 'transparansi'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-3 sm:px-4 py-1.5 border-b border-emerald-900/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold tracking-wide border border-emerald-700 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              PORTAL RESMI
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold border border-emerald-800 shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              KKN PM 02 UNIMUS
            </span>
            <span className="truncate text-[11px] sm:text-xs text-emerald-200/90 hidden md:inline">
              Kec. Tanggungharjo, Kab. Grobogan, Jawa Tengah • Kode Pos 58166
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-medium shrink-0 ml-auto">
            <button 
              onClick={() => handleNav('riset')} 
              className="hover:text-white underline decoration-emerald-500 underline-offset-2 flex items-center gap-1 transition-colors"
              title="Audit Basis Riset Publik"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="hidden xs:inline">Audit Riset Data</span>
            </button>
            <span className="text-emerald-700">|</span>
            <button 
              onClick={() => handleNav('admin')} 
              className="hover:text-white flex items-center gap-1 text-emerald-300 font-semibold transition-colors"
              title="Pusat Kendali Admin CMS"
            >
              <Lock className="w-3 h-3" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNav('beranda')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-hidden shrink-0"
            aria-label="Kembali ke Beranda Desa Brabo"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 border border-emerald-600/40 group-hover:scale-105 transition-transform shrink-0">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  DESA BRABO
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-900 rounded border border-emerald-300">
                  Grobogan
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate leading-none mt-0.5">
                Kecamatan Tanggungharjo
              </p>
            </div>
          </button>

          {/* Desktop Nav Items (lg and above) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-semibold text-slate-700">
            {/* Beranda */}
            <button
              onClick={() => handleNav('beranda')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all ${
                isTabActive('beranda')
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>

            {/* Profil Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDesktopDropdown('profil')}
              onMouseLeave={() => setDesktopDropdown(null)}
            >
              <button
                onClick={() => handleNav('profil')}
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-xl transition-all ${
                  isProfilGroupActive
                    ? 'bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Profil Desa</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${desktopDropdown === 'profil' ? 'rotate-180' : ''}`} />
              </button>

              {desktopDropdown === 'profil' && (
                <div className="absolute top-full left-0 w-60 py-2 bg-white rounded-2xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <button
                    onClick={() => handleNav('profil')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('profil') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sejarah, Visi & Demografi</span>
                  </button>
                  <button
                    onClick={() => handleNav('fasilitas')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('fasilitas') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fasilitas Pendidikan & Desa</span>
                  </button>
                  <button
                    onClick={() => handleNav('potensi')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('potensi') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Potensi Pesantren & Tani</span>
                  </button>
                </div>
              )}
            </div>

            {/* Pemerintahan Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDesktopDropdown('pemerintahan')}
              onMouseLeave={() => setDesktopDropdown(null)}
            >
              <button
                onClick={() => handleNav('pemerintahan')}
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-xl transition-all ${
                  isGovGroupActive
                    ? 'bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Pemerintahan</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${desktopDropdown === 'pemerintahan' ? 'rotate-180' : ''}`} />
              </button>

              {desktopDropdown === 'pemerintahan' && (
                <div className="absolute top-full left-0 w-64 py-2 bg-white rounded-2xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <button
                    onClick={() => handleNav('pemerintahan')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('pemerintahan') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Struktur Pamong & SOTK</span>
                  </button>
                  <button
                    onClick={() => handleNav('dusun')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('dusun') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Kewilayahan 3 Dusun</span>
                  </button>
                </div>
              )}
            </div>

            {/* Informasi Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDesktopDropdown('informasi')}
              onMouseLeave={() => setDesktopDropdown(null)}
            >
              <button
                onClick={() => handleNav('informasi')}
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-xl transition-all ${
                  isInfoGroupActive
                    ? 'bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>Informasi</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${desktopDropdown === 'informasi' ? 'rotate-180' : ''}`} />
              </button>

              {desktopDropdown === 'informasi' && (
                <div className="absolute top-full left-0 w-60 py-2 bg-white rounded-2xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <button
                    onClick={() => handleNav('informasi')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('informasi') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Newspaper className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Berita & Pengumuman</span>
                  </button>
                  <button
                    onClick={() => handleNav('kegiatan')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('kegiatan') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Agenda & Dokumentasi</span>
                  </button>
                  <button
                    onClick={() => handleNav('transparansi')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${isTabActive('transparansi') ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transparansi & APBDes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Peta Desa */}
            <button
              onClick={() => handleNav('peta')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all ${
                isTabActive('peta')
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              Peta Desa
            </button>
          </nav>

          {/* CTA Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('layanan')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 ${
                isTabActive('layanan')
                  ? 'bg-emerald-900 text-white ring-2 ring-emerald-500'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-950/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="whitespace-nowrap">Layanan Surat</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors touch-manipulation focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Accordion Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-2xl max-h-[82vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* Beranda */}
          <button
            onClick={() => handleNav('beranda')}
            className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              isTabActive('beranda') ? 'bg-emerald-800 text-white' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Beranda</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          {/* Profil Accordion */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleMobileAccordion('profil')}
              className={`w-full text-left px-3.5 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                isProfilGroupActive ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50/50 text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Profil Desa</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion.profil ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.profil && (
              <div className="bg-white p-2 space-y-1 border-t border-slate-100">
                <button
                  onClick={() => handleNav('profil')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('profil') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Sejarah, Visi & Demografi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNav('fasilitas')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('fasilitas') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Fasilitas Pendidikan & Desa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNav('potensi')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('potensi') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Potensi Pesantren & Tani</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Pemerintahan Accordion */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleMobileAccordion('pemerintahan')}
              className={`w-full text-left px-3.5 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                isGovGroupActive ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50/50 text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Pemerintahan</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion.pemerintahan ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.pemerintahan && (
              <div className="bg-white p-2 space-y-1 border-t border-slate-100">
                <button
                  onClick={() => handleNav('pemerintahan')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('pemerintahan') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Struktur Pamong & SOTK</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNav('dusun')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('dusun') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Kewilayahan 3 Dusun (Dukoh, Krajan, Cangkring)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Informasi Accordion */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleMobileAccordion('informasi')}
              className={`w-full text-left px-3.5 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                isInfoGroupActive ? 'bg-emerald-50 text-emerald-900' : 'bg-slate-50/50 text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-emerald-700" />
                <span>Informasi & Warta</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion.informasi ? 'rotate-180' : ''}`} />
            </button>
            {mobileAccordion.informasi && (
              <div className="bg-white p-2 space-y-1 border-t border-slate-100">
                <button
                  onClick={() => handleNav('informasi')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('informasi') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Berita & Pengumuman</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNav('kegiatan')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('kegiatan') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Agenda Kegiatan & Dokumentasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNav('transparansi')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    isTabActive('transparansi') ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Transparansi Anggaran APBDes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Peta Desa */}
          <button
            onClick={() => handleNav('peta')}
            className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              isTabActive('peta') ? 'bg-emerald-800 text-white' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Peta Spasial Desa</span>
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          {/* Prominent Layanan Surat button */}
          <button
            onClick={() => handleNav('layanan')}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-between shadow-sm transition-all ${
              isTabActive('layanan')
                ? 'bg-emerald-950 text-white ring-2 ring-emerald-400'
                : 'bg-emerald-800 text-white hover:bg-emerald-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-300" />
              <span>Layanan Surat Mandiri</span>
            </span>
            <span className="text-xs bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-md font-semibold">
              Buka Layanan
            </span>
          </button>

          {/* Quick Footer Links */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNav('riset')}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audit Riset</span>
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
