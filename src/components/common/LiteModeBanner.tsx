import React from 'react';
import { useLiteMode } from '../../context/LiteModeContext';
import { Zap, Wifi, X, Check, ArrowRight } from 'lucide-react';
import { formatBytes } from '../../utils/imageOptimizer';

interface LiteModeBannerProps {
  onOpenModal: () => void;
}

export const LiteModeBanner: React.FC<LiteModeBannerProps> = ({ onOpenModal }) => {
  const {
    isLiteMode,
    showSlowNetworkNotice,
    dismissSlowNetworkNotice,
    estimatedDataSavedBytes,
  } = useLiteMode();

  if (!showSlowNetworkNotice) return null;

  return (
    <div className="bg-amber-950 border-b border-amber-800/80 text-amber-100 text-xs px-4 py-2 relative z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
            <Zap className="w-3 h-3 fill-current" />
          </div>
          <p className="text-[11px] sm:text-xs text-amber-200">
            <strong className="text-white font-semibold">Sinyal 3G / Koneksi Lemah Terdeteksi:</strong>{' '}
            <span className="hidden sm:inline">Mode Hemat Kuota otomatis diaktifkan agar website terbuka di bawah 2 detik.</span>
            <span className="sm:hidden">Mode Hemat Kuota aktif otomatis.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={onOpenModal}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all"
          >
            <span>Pengaturan Kuota</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={dismissSlowNetworkNotice}
            className="p-1 rounded text-amber-400 hover:text-white"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
