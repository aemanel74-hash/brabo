import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, KeyRound, LogOut, AlertTriangle } from 'lucide-react';

export const ScreenLockModal: React.FC = () => {
  const { currentAdmin, unlockScreen, logout, isScreenLocked } = useAdminAuth();
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  if (!isScreenLocked || !currentAdmin) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 6) {
      setPinError('PIN Keamanan harus 6 digit angka.');
      return;
    }

    setIsUnlocking(true);
    const res = await unlockScreen(pinInput);
    setIsUnlocking(false);

    if (!res.success && res.error) {
      setPinError(res.error);
    } else {
      setPinInput('');
      setPinError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-800 text-center space-y-5 text-white">
        
        {/* Lock Icon & Avatar */}
        <div className="relative inline-block mx-auto">
          <img
            src={currentAdmin.avatarUrl}
            alt={currentAdmin.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md mx-auto"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-950 text-amber-400 border border-slate-700 shadow">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 uppercase tracking-wider">
            Workstation Terkunci Sementara
          </span>
          <h3 className="text-sm font-bold text-white">{currentAdmin.name}</h3>
          <p className="text-xs text-slate-400 font-mono">NIPD: {currentAdmin.nipd}</p>
        </div>

        {pinError && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-700/60 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        {/* PIN Input Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold block text-left">
              Masukkan PIN Keamanan Kedinasan (6-Digit)
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, ''));
                setPinError(null);
              }}
              placeholder="••••••"
              autoFocus
              className="w-full py-2.5 px-4 text-center tracking-[0.5em] text-lg font-mono font-bold rounded-xl border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-950 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUnlocking ? (
              <span className="inline-block animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Buka Kunci Layar</span>
              </>
            )}
          </button>
        </form>

        {/* Logout Option */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={logout}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi (Logout Aman)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
