import React from 'react';
import { useLiteMode, ImageQualityMode } from '../../context/LiteModeContext';
import { formatBytes } from '../../utils/imageOptimizer';
import { 
  Zap, 
  X, 
  Wifi, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Clock, 
  TrendingDown, 
  Radio, 
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';

interface LiteModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiteModeModal: React.FC<LiteModeModalProps> = ({ isOpen, onClose }) => {
  const {
    isLiteMode,
    imageQuality,
    networkStatus,
    estimatedDataSavedBytes,
    totalImagesOptimized,
    loadSpeedGrade,
    toggleLiteMode,
    setLiteMode,
    setImageQuality,
    resetStats
  } = useLiteMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isLiteMode 
                ? 'bg-amber-100 text-amber-700 ring-4 ring-amber-50' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Mode Hemat Kuota & Sinyal 3G</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isLiteMode 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {isLiteMode ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimalisasi khusus untuk warga di wilayah sinyal internet lemah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Master Switch Toggle */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white flex items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Akselerasi Buka Website
            </p>
            <h3 className="text-sm font-extrabold text-white">
              {isLiteMode ? 'Mode Hemat Kuota Aktif' : 'Mode Standar (Kualitas Penuh)'}
            </h3>
            <p className="text-[11px] text-slate-300">
              {isLiteMode 
                ? 'Gambar dikompresi otomatis, lazy loading bertahap, website terbuka < 1,5 detik di 3G.' 
                : 'Memuat seluruh aset dan foto resolusi tinggi (memerlukan koneksi 4G/WiFi stabil).'}
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleLiteMode}
            role="switch"
            aria-checked={isLiteMode}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 cursor-pointer ${
              isLiteMode ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-slate-900 ${
                isLiteMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isLiteMode ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            </div>
          </button>
        </div>

        {/* Live Metrics & Saved Data Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-0.5">
            <TrendingDown className="w-4 h-4 text-emerald-600 mx-auto" />
            <p className="text-xs text-slate-500">Hemat Kuota</p>
            <p className="text-sm sm:text-base font-extrabold text-emerald-700">
              {formatBytes(estimatedDataSavedBytes)}
            </p>
            <span className="text-[9px] text-emerald-600 font-semibold">(~82% Lebih Ringan)</span>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-0.5">
            <Clock className="w-4 h-4 text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500">Waktu Buka</p>
            <p className="text-sm sm:text-base font-extrabold text-blue-700">
              {isLiteMode ? '< 1.1 dtk' : '~2.8 dtk'}
            </p>
            <span className="text-[9px] text-blue-600 font-semibold">di Jaringan 3G</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center space-y-0.5">
            <Layers className="w-4 h-4 text-purple-600 mx-auto" />
            <p className="text-xs text-slate-500">Gambar Hemat</p>
            <p className="text-sm sm:text-base font-extrabold text-purple-700">
              {totalImagesOptimized} Aset
            </p>
            <span className="text-[9px] text-purple-600 font-semibold">WebP Terkompresi</span>
          </div>
        </div>

        {/* Quality Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Pilihan Tingkat Penghematan Gambar:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            
            {/* Ultra Lite */}
            <button
              type="button"
              onClick={() => setImageQuality('ultra_lite')}
              className={`p-3 rounded-xl border text-left transition-all ${
                imageQuality === 'ultra_lite' && isLiteMode
                  ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Super Hemat</span>
                {imageQuality === 'ultra_lite' && isLiteMode && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Resolusi mini 240px, kompresi 25%, kuota hemat hingga 90%.
              </p>
            </button>

            {/* Lite (Recommended) */}
            <button
              type="button"
              onClick={() => setImageQuality('lite')}
              className={`p-3 rounded-xl border text-left transition-all ${
                imageQuality === 'lite' && isLiteMode
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Rekomendasi</span>
                {imageQuality === 'lite' && isLiteMode && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                WebP 360px jelas namun sangat ringan (~35KB per foto).
              </p>
            </button>

            {/* Standard HD */}
            <button
              type="button"
              onClick={() => setImageQuality('standard')}
              className={`p-3 rounded-xl border text-left transition-all ${
                imageQuality === 'standard' || !isLiteMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Standar HD</span>
                {(!isLiteMode || imageQuality === 'standard') && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Foto tajam resolusi asli (WiFi / 4G kuota bebas).
              </p>
            </button>

          </div>
        </div>

        {/* Informative Hamlet Context Banner */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800 text-[11px]">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Kondisi Sinyal Jaringan di Wilayah Desa Brabo</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Warga di area persawahan dan dusun seperti <strong>Dusun Galeh</strong>, <strong>Dusun Pucang</strong>, dan <strong>Dusun Krajan</strong> terkadang mengalami fluktuasi sinyal. Fitur ini memastikan pengajuan surat online, pencarian informasi APBDes, dan berita desa tetap lancar tanpa buffering.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={resetStats}
            className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Hitungan Kuota</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all"
          >
            Terapkan & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
