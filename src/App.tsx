import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { QuickStats } from './components/home/QuickStats';
import { HamletsOverview } from './components/home/HamletsOverview';
import { ProfileView } from './components/views/ProfileView';
import { GovernmentView } from './components/views/GovernmentView';
import { HamletsView } from './components/views/HamletsView';
import { ActivitiesView } from './components/views/ActivitiesView';
import { PotentialsView } from './components/views/PotentialsView';
import { FacilitiesView } from './components/views/FacilitiesView';
import { ServicesView } from './components/views/ServicesView';
import { TransparencyView } from './components/views/TransparencyView';
import { InteractiveMapView } from './components/views/InteractiveMapView';
import { NewsView } from './components/views/NewsView';
import { ResearchDataAuditView } from './components/views/ResearchDataAuditView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { SourceModal } from './components/common/SourceModal';
import { VillageDataProvider } from './context/VillageDataContext';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Newspaper, 
  Heart,
  ChevronRight,
  Landmark,
  Compass,
  Users
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleOpenSource = (sourceId: string) => {
    setSelectedSourceId(sourceId);
  };

  const handleCloseSource = () => {
    setSelectedSourceId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSourceModal={handleOpenSource}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <HeroSection
              onSelectTab={setActiveTab}
              onOpenSource={handleOpenSource}
              onSearch={() => setActiveTab('layanan')}
            />

            {/* Quick Stats Grid with Verified Sources */}
            <QuickStats onOpenSource={handleOpenSource} />

            {/* 3 Hamlets Overview */}
            <HamletsOverview
              onSelectTab={setActiveTab}
              onOpenSource={handleOpenSource}
            />

            {/* Featured Potential Showcase Banner on Homepage */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-900/60">
                <div className="max-w-2xl space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700 text-xs font-bold uppercase tracking-wider text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dua Soko Guru Kemakmuran Brabo</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Pusat Pendidikan Islam Pesantren & Hamparan Lumbung Pangan
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Desa Brabo melahirkan ribuan santri melalui Pondok Pesantren Sirojuth Tholibin (sejak 1941) dan Perguruan Tajul Ulum, disokong ketahanan pangan agraris padi, tembakau, dan jagung yang produktif.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => setActiveTab('potensi')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
                    >
                      <span>Eksplorasi Potensi Desa</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('fasilitas')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <span>Direktori Fasilitas & Sekolah</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 w-full lg:max-w-sm">
                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-xs text-center space-y-1">
                    <span className="text-2xl font-black text-emerald-400">1941</span>
                    <p className="text-xs font-bold text-white">PP Sirojuth Tholibin</p>
                    <p className="text-[10px] text-slate-400">Pondok Pesantren Salaf</p>
                  </div>

                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-xs text-center space-y-1">
                    <span className="text-2xl font-black text-teal-400">1938</span>
                    <p className="text-xs font-bold text-white">SD Negeri 1 Brabo</p>
                    <p className="text-[10px] text-slate-400">Sekolah Tertua</p>
                  </div>

                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-xs text-center space-y-1">
                    <span className="text-2xl font-black text-amber-400">Akreditasi A</span>
                    <p className="text-xs font-bold text-white">MA Tajul Ulum</p>
                    <p className="text-[10px] text-slate-400">Madrasah Aliyah</p>
                  </div>

                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 backdrop-blur-xs text-center space-y-1">
                    <span className="text-2xl font-black text-blue-400">100%</span>
                    <p className="text-xs font-bold text-white">Bebas Pungli</p>
                    <p className="text-[10px] text-slate-400">Layanan Administrasi</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Public Services Call to Action */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                      Layanan Mandiri
                    </span>
                    <span className="text-xs text-slate-500">Buka 24 Jam</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Butuh Surat Keterangan Usaha (SKU) atau SKTM Beasiswa?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                    Generate draf pengantar surat resmi Pemerintah Desa Brabo langsung dari ponsel Anda dan cetak dokumen baku resmi secara instan.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('layanan')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
                >
                  <FileText className="w-4 h-4" />
                  <span>Buka Layanan Surat Mandiri</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'profil' && <ProfileView onOpenSource={handleOpenSource} />}
        {activeTab === 'pemerintahan' && <GovernmentView onOpenSource={handleOpenSource} />}
        {activeTab === 'dusun' && <HamletsView onOpenSource={handleOpenSource} />}
        {activeTab === 'informasi' && <NewsView onOpenSource={handleOpenSource} onNavigateToAdmin={() => setActiveTab('admin')} />}
        {activeTab === 'kegiatan' && <ActivitiesView onOpenSource={handleOpenSource} />}
        {activeTab === 'potensi' && <PotentialsView onOpenSource={handleOpenSource} />}
        {activeTab === 'fasilitas' && <FacilitiesView onOpenSource={handleOpenSource} />}
        {activeTab === 'layanan' && <ServicesView onOpenSource={handleOpenSource} />}
        {activeTab === 'transparansi' && <TransparencyView onOpenSource={handleOpenSource} />}
        {activeTab === 'peta' && <InteractiveMapView onOpenSource={handleOpenSource} />}
        {activeTab === 'riset' && <ResearchDataAuditView onOpenSource={handleOpenSource} />}
        {activeTab === 'admin' && <AdminDashboardView onOpenSource={handleOpenSource} />}
      </main>

      {/* Source Citation Modal */}
      <SourceModal
        sourceId={selectedSourceId}
        onClose={handleCloseSource}
      />

      {/* Global Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenSourceModal={handleOpenSource}
      />
    </div>
  );
}

export default function App() {
  return (
    <VillageDataProvider>
      <AppContent />
    </VillageDataProvider>
  );
}
