import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Monitor, 
  Clock, 
  Lock, 
  LogOut, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';

export const PublicPcSessionBar: React.FC = () => {
  const { 
    isAuthenticated, 
    isPublicComputer, 
    sessionTimeRemaining, 
    extendSession, 
    lockScreen, 
    logout,
    currentAdmin 
  } = useAdminAuth();

  if (!isAuthenticated || !currentAdmin) return null;

  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;
  const isUrgent = sessionTimeRemaining < 180; // less than 3 mins

  return (
    <div className={`transition-all ${
      isPublicComputer 
        ? isUrgent 
          ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 border-rose-500' 
          : 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-amber-500/50'
        : 'bg-slate-900 border-slate-800'
    } text-white px-4 py-2 border-b shadow-md text-xs z-30 sticky top-0`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Status */}
        <div className="flex items-center gap-2.5">
          <span className={`p-1 rounded-lg ${
            isPublicComputer 
              ? isUrgent ? 'bg-rose-500/30 text-rose-300 animate-pulse' : 'bg-amber-500/30 text-amber-300' 
              : 'bg-emerald-500/30 text-emerald-300'
          }`}>
            {isPublicComputer ? <Monitor className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">{currentAdmin.name}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({currentAdmin.roleLabel})</span>
              {isPublicComputer ? (
                <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Mode Balai Desa (Komputer Bersama)
                </span>
              ) : (
                <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Sesi Pribadi Terverifikasi 2FA
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls: Timer & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold ${
            isUrgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800/90 text-amber-400 border border-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Sesi: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>

          <button
            onClick={extendSession}
            title="Perpanjang Sesi Aktif"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">Perpanjang</span>
          </button>

          <button
            onClick={lockScreen}
            title="Kunci Layar Sementara (Lock Screen PIN)"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden xs:inline">Kunci Layar</span>
          </button>

          <button
            onClick={logout}
            title="Keluar Sesi Aman"
            className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[11px] font-bold border border-rose-700/60 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Keluar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
