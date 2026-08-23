import React, { useState } from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Monitor, 
  LogOut, 
  Download,
  Info,
  UserCheck,
  Eye,
  EyeOff,
  Terminal,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

interface Security2FaTabProps {
  showToast: (msg: string) => void;
}

export const Security2FaTab: React.FC<Security2FaTabProps> = ({ showToast }) => {
  const { 
    adminAccount,
    authenticatedVia,
    activeSessions, 
    securityLogs, 
    rotatePassword,
    rotateKadesPassphrase, 
    rotateDeveloperToken,
    updateSecurityPin, 
    terminateOtherSessions, 
    terminateSpecificSession,
    lockScreen 
  } = useAdminAuth();

  // Password Rotation Form State
  const [currPassword, setCurrPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

  // Kades Passphrase Rotation State
  const [newKadesPassphrase, setNewKadesPassphrase] = useState<string>('');
  const [showKadesPassphrase, setShowKadesPassphrase] = useState<boolean>(false);

  // Developer Token Rotation State
  const [newDevToken, setNewDevToken] = useState<string>('');
  const [showDevToken, setShowDevToken] = useState<boolean>(false);

  // PIN Rotation State
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  // Handle Password Rotation
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword) {
      showToast('Silakan masukkan kata sandi saat ini.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    const res = await rotatePassword(currPassword, newPassword);
    if (res.success) {
      showToast('Kata sandi kedinasan berhasil diperbarui!');
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.error || 'Gagal mengubah kata sandi.');
    }
  };

  // Handle Kades Passphrase Rotation
  const handleKadesPassphraseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKadesPassphrase.trim() || newKadesPassphrase.trim().length < 6) {
      showToast('Passphrase Kepala Desa minimal 6 karakter.');
      return;
    }

    const res = await rotateKadesPassphrase(newKadesPassphrase);
    if (res.success) {
      showToast('Passphrase Otoritas Kepala Desa berhasil dirotasi!');
      setNewKadesPassphrase('');
    } else {
      showToast(res.error || 'Gagal memperbarui passphrase.');
    }
  };

  // Handle Developer Token Rotation
  const handleDevTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevToken.trim() || newDevToken.trim().length < 6) {
      showToast('Developer Signing Token minimal 6 karakter.');
      return;
    }

    const res = await rotateDeveloperToken(newDevToken);
    if (res.success) {
      showToast('Developer Master Signing Token berhasil dirotasi!');
      setNewDevToken('');
    } else {
      showToast(res.error || 'Gagal memperbarui developer token.');
    }
  };

  // Handle PIN Rotation
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      showToast('PIN harus tepat 6 digit angka numerik.');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('Konfirmasi PIN baru tidak cocok!');
      return;
    }

    const res = await updateSecurityPin(newPin);
    if (res.success) {
      showToast('PIN Kunci Layar 6-Digit berhasil diperbarui!');
      setNewPin('');
      setConfirmPin('');
    } else {
      showToast(res.error || 'Gagal memperbarui PIN.');
    }
  };

  const exportAuditLogsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(securityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-keamanan-siapdesa-brabo-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Log audit keamanan forensik berhasil diunduh (JSON).');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Otorisasi Ganda Dual-Authority • Arsitektur SHA-256</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pusat Keamanan Akun & Otoritas Sistem CMS
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Manajemen kunci otorisasi kedinasan, rotasi passphrase Kepala Desa, token teknis Developer, serta kontrol sesi workstation balai desa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={lockScreen}
              className="px-3.5 py-2 bg-amber-950/60 hover:bg-amber-900/70 text-amber-300 border border-amber-700/60 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Kunci Layar (PIN)</span>
            </button>
            <button
              onClick={exportAuditLogsJson}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Audit Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Info & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Official Identity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{adminAccount.name}</h2>
                <p className="text-xs text-slate-400 font-mono">NIPD: {adminAccount.nipd}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ID Login:</span>
                <span className="font-mono text-emerald-300 font-semibold">{adminAccount.username}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Email Kedinasan:</span>
                <span className="font-mono text-slate-200">{adminAccount.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Sesi Saat Ini:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {authenticatedVia === 'KADES_PASSPHRASE' ? 'Otoritas Kades' : 'Token Developer'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Akses Terakhir:</span>
                <span className="text-slate-300">{adminAccount.lastLoginAt || 'Baru saja'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>Kredensial disimpan dalam bentuk salted SHA-256 hash untuk mencegah kebocoran data.</span>
          </div>
        </div>

        {/* Card 2: Rotasi Passphrase Otoritas Kades */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Passphrase Otoritas Kepala Desa</h2>
              <p className="text-[11px] text-slate-400">Kunci rahasia tahap 2 pejabat Kepala Desa</p>
            </div>
          </div>

          <form onSubmit={handleKadesPassphraseSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Rotasi Passphrase Kades Baru
              </label>
              <div className="relative">
                <input
                  type={showKadesPassphrase ? 'text' : 'password'}
                  value={newKadesPassphrase}
                  onChange={(e) => setNewKadesPassphrase(e.target.value)}
                  placeholder="Masukkan frasa rahasia baru..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKadesPassphrase(!showKadesPassphrase)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showKadesPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Simpan Passphrase Kades
            </button>
          </form>
        </div>

        {/* Card 3: Rotasi Developer Master Signing Token */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Developer Signing Token</h2>
              <p className="text-[11px] text-slate-400">Kunci teknis otorisasi pengembang sistem</p>
            </div>
          </div>

          <form onSubmit={handleDevTokenSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Rotasi Developer Token Baru
              </label>
              <div className="relative">
                <input
                  type={showDevToken ? 'text' : 'password'}
                  value={newDevToken}
                  onChange={(e) => setNewDevToken(e.target.value)}
                  placeholder="Masukkan token pengembang baru..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowDevToken(!showDevToken)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showDevToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Simpan Token Developer
            </button>
          </form>
        </div>

      </div>

      {/* Grid: Rotasi Kata Sandi Kedinasan & PIN Kunci Layar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Ganti Kata Sandi Kedinasan */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Rotasi Kata Sandi Kedinasan (Tahap 1)</h2>
              <p className="text-[11px] text-slate-400">Pembaruan kata sandi utama akun</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Kata Sandi Saat Ini
              </label>
              <input
                type={showPasswordFields ? 'text' : 'password'}
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswordFields ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPasswordFields ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Konfirmasi Sandi Baru
                </label>
                <input
                  type={showPasswordFields ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              Perbarui Kata Sandi Kedinasan
            </button>
          </form>
        </div>

        {/* Form Ganti PIN Kunci Layar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">PIN Kunci Layar (6-Digit)</h2>
              <p className="text-[11px] text-slate-400">PIN numerik untuk buka kunci cepat workstation</p>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  PIN Baru (6 Angka)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="6 angka..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Konfirmasi PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ketik ulang..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 border border-amber-700/60 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Simpan PIN Kunci Layar
            </button>
          </form>
        </div>

      </div>

      {/* Sesi Komputer & Log Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sesi Terhubung */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white">Sesi Perangkat Terdaftar</h2>
            </div>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-md font-mono">
              {activeSessions.length} Sesi
            </span>
          </div>

          <div className="space-y-2.5">
            {activeSessions.map((session) => (
              <div 
                key={session.id} 
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  session.isCurrentSession 
                    ? 'bg-emerald-950/30 border-emerald-700/60' 
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
                    {session.isCurrentSession && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    {session.deviceInfo}
                  </span>
                  {session.isCurrentSession ? (
                    <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded-sm font-semibold">
                      Sesi Ini
                    </span>
                  ) : (
                    <button
                      onClick={() => terminateSpecificSession(session.id)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Putus</span>
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>IP: {session.ipAddress}</span>
                  <span>{session.loginTimestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {activeSessions.length > 1 && (
            <button
              onClick={terminateOtherSessions}
              className="mt-3 w-full py-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/70 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Putuskan Sesi Lainnya</span>
            </button>
          )}
        </div>

        {/* Log Audit Forensik */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg text-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white">Log Audit Keamanan Forensik Real-Time</h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {securityLogs.length} Entri Terakhir
            </span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {securityLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                      log.status === 'SUCCESS' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' 
                        : log.status === 'WARNING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    }`}>
                      {log.eventType}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.details}</p>
                </div>

                <div className="text-right shrink-0 text-[10px] text-slate-500 font-mono">
                  <span>{log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
