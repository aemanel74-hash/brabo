import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Monitor, 
  Building2, 
  UserCheck,
  Terminal,
  RefreshCw,
  ArrowLeft,
  FileCheck2,
  Sparkles,
  Clock,
  Fingerprint,
  Info,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface AdminLoginScreenProps {
  onCancel?: () => void;
  onOpenSource?: (sourceId: string) => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onCancel, onOpenSource }) => {
  const { 
    step1Completed, 
    rateLimitState,
    captchaChallenge,
    loginStep1, 
    verifyAuthorityCode, 
    cancelStep1,
    refreshCaptcha
  } = useAdminAuth();

  // Step 1 Form States
  const [identifierInput, setIdentifierInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPublicPc, setIsPublicPc] = useState<boolean>(true);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2 Form States
  const [authorityMode, setAuthorityMode] = useState<'KADES' | 'DEVELOPER'>('KADES');
  const [authorityKeyInput, setAuthorityKeyInput] = useState<string>('');
  const [showAuthorityKey, setShowAuthorityKey] = useState<boolean>(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Credential Guide Accordion / Modal
  const [showCredGuide, setShowCredGuide] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFillDemoCreds = (id: string, pass: string) => {
    setIdentifierInput(id);
    setPasswordInput(pass);
    setStep1Error(null);
  };

  const handleFillDemoKey = (keyVal: string) => {
    setAuthorityKeyInput(keyVal);
    setStep2Error(null);
  };

  // Handle Step 1 Submit
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error(null);

    if (!identifierInput.trim()) {
      setStep1Error('Silakan masukkan NIPD atau ID Administrator Kedinasan.');
      return;
    }

    if (!passwordInput) {
      setStep1Error('Silakan masukkan kata sandi akun kedinasan.');
      return;
    }

    if (captchaChallenge && !captchaInput.trim()) {
      setStep1Error('Silakan lengkapi verifikasi keamanan (CAPTCHA).');
      return;
    }

    setIsSubmitting(true);
    const result = await loginStep1(identifierInput, passwordInput, captchaInput, isPublicPc);
    setIsSubmitting(false);

    if (!result.success) {
      setStep1Error(result.error || 'Verifikasi tahap 1 gagal. Periksa kembali NIPD dan kata sandi.');
      setCaptchaInput('');
    } else {
      setAuthorityKeyInput('');
      setStep2Error(null);
    }
  };

  // Handle Step 2 Submit
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error(null);

    if (!authorityKeyInput.trim()) {
      setStep2Error(
        authorityMode === 'KADES' 
          ? 'Silakan masukkan Passphrase Otorisasi Kepala Desa.' 
          : 'Silakan masukkan Developer Signing Key.'
      );
      return;
    }

    setIsSubmitting(true);
    const result = await verifyAuthorityCode(authorityKeyInput);
    setIsSubmitting(false);

    if (!result.success) {
      setStep2Error(result.error || 'Kode otorisasi tidak valid. Periksa kembali passphrase atau signing token.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Portal Publik Desa</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
              SIAPDesa CMS Brabo
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-800/60">
              Dual-Authority 2FA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCredGuide(!showCredGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 text-xs font-semibold transition-all"
            title="Bantuan Kredensial Kedinasan & Evaluasi"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Petunjuk Kredensial</span>
            <span className="md:hidden">Petunjuk</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zona Waktu: <strong>WIB (UTC+7)</strong></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Dignified Institutional Identity & Security Standards */}
          <div className="lg:col-span-5 space-y-6 text-slate-300">
            
            {/* Seal & Heading */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600/40 text-emerald-300 text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pusat Kendali Administrasi Kedinasan</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Pemerintah Desa Brabo
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Kecamatan Tanggungharjo, Kabupaten Grobogan, Jawa Tengah. Portal autentikasi terpusat untuk pamong desa, pengelola data BPS/SID, verifikator layanan surat mandiri, dan penandatangan dokumen resmi.
              </p>
            </div>

            {/* Security Compliance Pills Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Fingerprint className="w-4 h-4" />
                  <span>2FA Terproteksi</span>
                </div>
                <p className="text-[11px] text-slate-400">Verifikasi NIPD & Passphrase Kepala Desa.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Kriptografi SHA-256</span>
                </div>
                <p className="text-[11px] text-slate-400">Penyimpanan token salted anti-tamper.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Monitor className="w-4 h-4" />
                  <span>Mode Balai Desa</span>
                </div>
                <p className="text-[11px] text-slate-400">Proteksi auto-logout 15 menit workstation.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>Standar SPBE</span>
                </div>
                <p className="text-[11px] text-slate-400">Audit trail aktivitas & otorisasi berkas.</p>
              </div>
            </div>

            {/* Credential Helper Card (Toggleable) */}
            {showCredGuide && (
              <div className="p-4 rounded-2xl bg-slate-900/95 border border-emerald-600/40 text-slate-300 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kredensial Pengujian Kedinasan</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCredGuide(false)}
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    Tutup
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">ID / NIPD Pamong:</span>
                      <strong className="text-white font-mono text-xs">admin.brabo</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard('admin.brabo', 'nipd');
                        handleFillDemoCreds('admin.brabo', 'admin');
                      }}
                      className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center gap-1"
                    >
                      {copiedKey === 'nipd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'nipd' ? 'Tersalin' : 'Isi Otomatis'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kata Sandi Default:</span>
                      <strong className="text-white font-mono text-xs">admin</strong>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">(Terisi otomatis)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Passphrase Kades (Tahap 2):</span>
                      <strong className="text-emerald-300 font-mono text-xs">KADES-BRABO-2026</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard('KADES-BRABO-2026', 'kades');
                        handleFillDemoKey('KADES-BRABO-2026');
                      }}
                      className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center gap-1"
                    >
                      {copiedKey === 'kades' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'kades' ? 'Tersalin' : 'Isi Key'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Precision Authentication Console */}
          <div className="lg:col-span-7">
            
            {/* Rate Limit / Security Lockout Banner */}
            {rateLimitState.isLocked && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs flex items-start gap-3 shadow-xl animate-pulse">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-200 text-sm">Proteksi Keamanan Aktif (Anti-Brute Force)</p>
                  <p className="mt-1 text-slate-300">
                    Terdeteksi beberapa kali kegagalan otentikasi berturut-turut. Sistem menangguhkan akses masuk sementara selama{' '}
                    <span className="font-mono font-bold text-white bg-rose-900 px-1.5 py-0.5 rounded text-xs">{rateLimitState.lockoutRemainingSeconds} detik</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Auth Glass Card Container */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Subtle Ambient Glow Effect inside Card */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Step Segmented Progress Indicator */}
              <div className="mb-8 relative z-10">
                <div className="flex items-center justify-between">
                  {/* Step 1 Pill */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      !step1Completed 
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 font-black' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    }`}>
                      {step1Completed ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Tahap 1</p>
                      <p className="text-[11px] text-slate-400">Identitas & Kredensial</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="flex-1 mx-4 h-0.5 bg-slate-800 relative rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
                      style={{ width: step1Completed ? '100%' : '0%' }}
                    />
                  </div>

                  {/* Step 2 Pill */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      step1Completed 
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 font-black animate-pulse' 
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      2
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${step1Completed ? 'text-emerald-300' : 'text-slate-500'}`}>Tahap 2</p>
                      <p className="text-[11px] text-slate-500">Otorisasi Ganda</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================== */}
              {/* TAHAP 1: KREDENSIAL KEDINASAN */}
              {/* ==================================================== */}
              {!step1Completed ? (
                <form onSubmit={handleStep1Submit} className="space-y-5 relative z-10">
                  
                  {/* NIPD / Identifier Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200 tracking-wide">
                      NIPD / ID Administrator Kedinasan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <input
                        type="text"
                        value={identifierInput}
                        onChange={(e) => setIdentifierInput(e.target.value)}
                        placeholder="Contoh: admin.brabo atau pamong@brabo.desa.id"
                        disabled={rateLimitState.isLocked}
                        autoComplete="username"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700 hover:border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-200 tracking-wide">
                        Kata Sandi Kedinasan
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCredGuide(true)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Bantuan Akses
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-emerald-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Masukkan kata sandi akun kedinasan..."
                        disabled={rateLimitState.isLocked}
                        autoComplete="current-password"
                        required
                        className="w-full pl-10 pr-11 py-3 bg-slate-950/90 border border-slate-700 hover:border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                        title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Anti-Bot Challenge (Shown dynamically if suspicious attempts occur) */}
                  {captchaChallenge && (
                    <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                        <span>Verifikasi Anti-Bot Otomatis:</span>
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="text-[11px] text-amber-400 hover:text-amber-200 flex items-center gap-1 font-semibold"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Acak Soal</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white shadow-xs">
                          {captchaChallenge.question}
                        </span>
                        <input
                          type="number"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Hasil..."
                          className="w-28 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono text-center focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Public PC Mode Toggle Card */}
                  <div 
                    onClick={() => setIsPublicPc(!isPublicPc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isPublicPc 
                        ? 'bg-emerald-950/40 border-emerald-600/50 shadow-xs' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      isPublicPc 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isPublicPc && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Monitor className="w-3.5 h-3.5 text-amber-400" />
                        <span>Komputer Kantor Balai Desa (Workstation Bersama)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Menerapkan protokol auto-logout ketat setelah 15 menit inaktivitas untuk mencegah penyalahgunaan sesi di perangkat bersama.
                      </p>
                    </div>
                  </div>

                  {step1Error && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="font-semibold">{step1Error}</span>
                    </div>
                  )}

                  {/* Submit Button Step 1 */}
                  <button
                    type="submit"
                    disabled={isSubmitting || rateLimitState.isLocked}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>Verifikasi Kredensial & Lanjut ke Tahap 2</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (

                /* ==================================================== */
                /* TAHAP 2: OTORISASI DUAL-AUTHORITY (KADES / DEVELOPER) */
                /* ==================================================== */
                <form onSubmit={handleStep2Submit} className="space-y-5 relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
                  
                  {/* Dual Authority Switcher Box */}
                  <div className="bg-slate-950/90 border border-slate-700/80 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold text-white">Verifikasi Otoritas Ganda (Dual-Authority)</h2>
                        <p className="text-[11px] text-slate-400">Pilih salah satu metode otorisasi kedinasan berwenang:</p>
                      </div>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthorityMode('KADES');
                          setAuthorityKeyInput('');
                          setStep2Error(null);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          authorityMode === 'KADES'
                            ? 'bg-emerald-950 text-emerald-200 border border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                        }`}
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Passphrase Kades</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthorityMode('DEVELOPER');
                          setAuthorityKeyInput('');
                          setStep2Error(null);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          authorityMode === 'DEVELOPER'
                            ? 'bg-emerald-950 text-emerald-200 border border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Developer Token</span>
                      </button>
                    </div>
                  </div>

                  {/* Key / Passphrase Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-200 tracking-wide">
                        {authorityMode === 'KADES' ? 'Passphrase Otoritas Kepala Desa' : 'Developer Master Signing Key'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (authorityMode === 'KADES') {
                            handleFillDemoKey('KADES-BRABO-2026');
                          } else {
                            handleFillDemoKey('BRABO-DEV-2026');
                          }
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Isi Contoh Kunci
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <input
                        type={showAuthorityKey ? 'text' : 'password'}
                        value={authorityKeyInput}
                        onChange={(e) => setAuthorityKeyInput(e.target.value)}
                        placeholder={
                          authorityMode === 'KADES' 
                            ? 'Contoh: KADES-BRABO-2026' 
                            : 'Contoh: BRABO-DEV-2026'
                        }
                        autoFocus
                        autoComplete="off"
                        required
                        className="w-full pl-10 pr-11 py-3 bg-slate-950/90 border border-emerald-500/60 focus:border-emerald-400 rounded-xl text-white placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-400/20 transition-all font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthorityKey(!showAuthorityKey)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                        title={showAuthorityKey ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}
                      >
                        {showAuthorityKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {authorityMode === 'KADES' 
                        ? 'Frasa rahasia kedinasan yang dipegang resmi oleh Kepala Desa Brabo.'
                        : 'Kunci penandatanganan teknis dari pengembang sistem UNIMUS.'}
                    </p>
                  </div>

                  {step2Error && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="font-semibold">{step2Error}</span>
                    </div>
                  )}

                  {/* Dual Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={cancelStep1}
                      className="w-1/3 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || rateLimitState.isLocked}
                      className="w-2/3 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Validasi Otoritas & Masuk CMS</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom Quick Return Link */}
              {onCancel && (
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-center relative z-10">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-slate-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Kembali ke Portal Publik Warga</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Security Compliance & Governance Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950/80 px-4 py-3 text-center text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-2 sm:gap-4 z-20">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Terenkripsi SHA-256 + Salt</span>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span>Sistem Informasi Administrasi Pemerintahan Desa (SIAPDesa)</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-slate-400">KKN PM 02 UNIMUS × Pemdes Brabo 2026</span>
      </footer>

    </div>
  );
};

