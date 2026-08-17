import React, { useState } from 'react';
import { useVillageData, NewsArticle } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  Newspaper, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  Search, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Megaphone,
  PlusCircle,
  Share2
} from 'lucide-react';

interface NewsViewProps {
  onOpenSource: (sourceId: string) => void;
  onNavigateToAdmin?: () => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onOpenSource, onNavigateToAdmin }) => {
  const { news } = useVillageData();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filterCat, setFilterCat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Pengumuman', 'Pemerintahan', 'Pembangunan', 'Pendidikan', 'Pertanian', 'Sosial'];

  const filteredNews = news.filter(item => {
    const matchCat = filterCat === 'Semua' || item.category === filterCat;
    const matchSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticles = news.filter(n => n.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Kabar & Publikasi Terkini
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PEMKAB-GROB" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Warta & Pengumuman Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menyajikan berita resmi seputar kegiatan pemerintahan desa, agenda pesantren santri, pembangunan infrastruktur pertanian, dan layanan kesehatan masyarakat.
          </p>
        </div>
      </div>

      {/* Featured Highlight If Present */}
      {featuredArticles.length > 0 && filterCat === 'Semua' && searchQuery === '' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Sorotan Berita Utama</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.slice(0, 2).map((feat) => (
              <div
                key={feat.id}
                onClick={() => setSelectedArticle(feat)}
                className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-800/60 shadow-lg cursor-pointer hover:scale-[1.01] transition-transform space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600/60 border border-emerald-400/40 text-emerald-100">
                      {feat.category} • UTAMA
                    </span>
                    <VerificationBadge status={feat.status} sourceId={feat.sourceId} onOpenSource={onOpenSource} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold leading-snug hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {feat.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {feat.date}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari berita atau pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map(article => (
          <div
            key={article.id}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {article.category}
                </span>
                <VerificationBadge status={article.status} sourceId={article.sourceId} onOpenSource={onOpenSource} />
              </div>

              <h3 
                onClick={() => setSelectedArticle(article)}
                className="text-lg font-bold text-slate-900 leading-snug hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {article.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {article.author}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(article)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-400">Publikasi Terbuka</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">Tidak ada berita yang sesuai dengan kata kunci pencarian.</p>
          <button
            onClick={() => { setFilterCat('Semua'); setSearchQuery(''); }}
            className="text-xs text-emerald-700 underline font-semibold"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                  {selectedArticle.category}
                </span>
                <VerificationBadge status={selectedArticle.status} sourceId={selectedArticle.sourceId} onOpenSource={onOpenSource} showSourceTitle={true} />
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.author}
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p className="font-semibold text-slate-900">{selectedArticle.excerpt}</p>
              <div className="whitespace-pre-line text-slate-700">{selectedArticle.content}</div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Pemerintah Desa Brabo • Humas & Informasi Publik</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700"
              >
                Tutup Warta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
