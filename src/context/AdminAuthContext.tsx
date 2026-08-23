import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { 
  AdminAccount, 
  ActiveSession, 
  SecurityLogEntry,
  RateLimitState
} from '../types/auth';
import { 
  DEFAULT_ADMIN_ACCOUNT, 
  INITIAL_SECURITY_LOGS, 
  INITIAL_ACTIVE_SESSIONS,
  DEFAULT_SALT
} from '../data/research/adminAccounts';
import { 
  sha256Hash, 
  generateSessionToken, 
  generateRandomCaptcha 
} from '../utils/cryptoAuth';

interface LoginStep1Result {
  success: boolean;
  error?: string;
  requireCaptcha?: boolean;
}

interface MasterKeyVerifyResult {
  success: boolean;
  error?: string;
  authenticatedVia?: 'KADES_PASSPHRASE' | 'DEVELOPER_TOKEN';
}

interface CaptchaChallenge {
  id: string;
  question: string;
  answer: number;
}

interface AdminAuthContextType {
  adminAccount: AdminAccount;
  currentAdmin: AdminAccount | null;
  isAuthenticated: boolean;
  step1Completed: boolean;
  authenticatedVia: 'KADES_PASSPHRASE' | 'DEVELOPER_TOKEN' | null;
  isPublicComputer: boolean;
  isScreenLocked: boolean;
  activeSessions: ActiveSession[];
  securityLogs: SecurityLogEntry[];
  sessionTimeRemaining: number;
  rateLimitState: RateLimitState;
  captchaChallenge: CaptchaChallenge | null;
  
  // Methods
  loginStep1: (
    identifier: string, 
    passwordInput: string, 
    captchaAnswer?: string, 
    isPublicPC?: boolean
  ) => Promise<LoginStep1Result>;
  verifyAuthorityCode: (code: string) => Promise<MasterKeyVerifyResult>;
  cancelStep1: () => void;
  refreshCaptcha: () => void;
  logout: () => void;
  lockScreen: () => void;
  unlockScreen: (pin: string) => Promise<{ success: boolean; error?: string }>;
  extendSession: () => void;
  rotatePassword: (currentPasswordInput: string, newPasswordInput: string) => Promise<{ success: boolean; error?: string }>;
  rotateKadesPassphrase: (newPassphrase: string) => Promise<{ success: boolean; error?: string }>;
  rotateDeveloperToken: (newToken: string) => Promise<{ success: boolean; error?: string }>;
  updateSecurityPin: (newPin: string) => Promise<{ success: boolean; error?: string }>;
  terminateOtherSessions: () => void;
  terminateSpecificSession: (sessionId: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const PUBLIC_PC_TIMEOUT_SECONDS = 15 * 60; // 15 minutes
const STANDARD_TIMEOUT_SECONDS = 4 * 60 * 60; // 4 hours
const MAX_FAILED_ATTEMPTS = 4;
const LOCKOUT_DURATION_SECONDS = 45;

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Account State
  const [adminAccount, setAdminAccount] = useState<AdminAccount>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_admin_gov_account');
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_ADMIN_ACCOUNT;
    } catch {
      return DEFAULT_ADMIN_ACCOUNT;
    }
  });

  // Ensure default cryptographic hashes exist on first run
  useEffect(() => {
    const initHashes = async () => {
      let updated = false;
      const copy = { ...adminAccount };

      if (!copy.passwordHash) {
        copy.passwordHash = await sha256Hash('admin', copy.passwordSalt || DEFAULT_SALT);
        updated = true;
      }
      if (!copy.kadesPassphraseHash) {
        copy.kadesPassphraseHash = await sha256Hash('KADES-BRABO-2026', copy.passwordSalt || DEFAULT_SALT);
        updated = true;
      }
      if (!copy.developerTokenHash) {
        copy.developerTokenHash = await sha256Hash('BRABO-DEV-2026', copy.passwordSalt || DEFAULT_SALT);
        updated = true;
      }
      if (!copy.securityPinHash) {
        copy.securityPinHash = await sha256Hash('123456', copy.passwordSalt || DEFAULT_SALT);
        updated = true;
      }

      if (updated) {
        setAdminAccount(copy);
        localStorage.setItem('desabrabo_admin_gov_account', JSON.stringify(copy));
      }
    };
    initHashes();
  }, [adminAccount]);

  // Session & Auth state
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_current_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_is_auth');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [step1Completed, setStep1Completed] = useState<boolean>(false);
  const [authenticatedVia, setAuthenticatedVia] = useState<'KADES_PASSPHRASE' | 'DEVELOPER_TOKEN' | null>(null);

  const [isPublicComputer, setIsPublicComputer] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem('desabrabo_is_public_pc');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);

  // Rate Limiting & Anti-Brute Force Protection
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    failedAttempts: 0,
    isLocked: false,
    lockoutRemainingSeconds: 0,
  });

  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge | null>(null);

  // Sessions & Security Logs
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_active_sessions');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SESSIONS;
    } catch {
      return INITIAL_ACTIVE_SESSIONS;
    }
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_security_logs');
      return saved ? JSON.parse(saved) : INITIAL_SECURITY_LOGS;
    } catch {
      return INITIAL_SECURITY_LOGS;
    }
  });

  // Session Countdown Timer
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(
    isPublicComputer ? PUBLIC_PC_TIMEOUT_SECONDS : STANDARD_TIMEOUT_SECONDS
  );

  // Lockout Countdown Effect
  useEffect(() => {
    if (!rateLimitState.isLocked) return;

    const interval = setInterval(() => {
      setRateLimitState(prev => {
        if (prev.lockoutRemainingSeconds <= 1) {
          return {
            failedAttempts: 0,
            isLocked: false,
            lockoutRemainingSeconds: 0,
          };
        }
        return {
          ...prev,
          lockoutRemainingSeconds: prev.lockoutRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitState.isLocked]);

  // Session countdown interval
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      setSessionTimeRemaining(prev => {
        if (prev <= 1) {
          logout();
          addSecurityLog(
            'SESSION_EXPIRED',
            'WARNING',
            'Sesi kerja berakhir otomatis karena batas waktu keamanan inaktivitas tercapai.'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  // Activity tracker to reset inactivity timer
  const lastActivityRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current > 30000) {
        lastActivityRef.current = now;
        if (!isScreenLocked) {
          setSessionTimeRemaining(isPublicComputer ? PUBLIC_PC_TIMEOUT_SECONDS : STANDARD_TIMEOUT_SECONDS);
        }
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAuthenticated, isPublicComputer, isScreenLocked]);

  // Persistence helpers
  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_admin_gov_account', JSON.stringify(adminAccount));
    } catch (e) {
      console.error(e);
    }
  }, [adminAccount]);

  useEffect(() => {
    try {
      if (currentAdmin && isAuthenticated) {
        localStorage.setItem('desabrabo_current_admin', JSON.stringify(currentAdmin));
        localStorage.setItem('desabrabo_is_auth', 'true');
      } else {
        localStorage.removeItem('desabrabo_current_admin');
        localStorage.removeItem('desabrabo_is_auth');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentAdmin, isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_active_sessions', JSON.stringify(activeSessions));
    } catch (e) {
      console.error(e);
    }
  }, [activeSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_security_logs', JSON.stringify(securityLogs));
    } catch (e) {
      console.error(e);
    }
  }, [securityLogs]);

  const addSecurityLog = useCallback((
    eventType: SecurityLogEntry['eventType'],
    status: SecurityLogEntry['status'],
    details: string
  ) => {
    const newEntry: SecurityLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      adminName: adminAccount.name,
      adminEmail: adminAccount.email,
      eventType,
      status,
      details,
      device: isPublicComputer ? 'PC Balai Desa 01 (Public PC)' : 'Perangkat Terdaftar / Laptop Kedinasan',
      ip: isPublicComputer ? '180.252.164.22' : '180.252.164.45',
    };

    setSecurityLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  }, [adminAccount, isPublicComputer]);

  const refreshCaptcha = () => {
    setCaptchaChallenge(generateRandomCaptcha());
  };

  // STEP 1: Identification & Password Verification (SHA-256 Hashed)
  const loginStep1 = async (
    identifier: string,
    passwordInput: string,
    captchaAnswer?: string,
    isPublicPC: boolean = false
  ): Promise<LoginStep1Result> => {
    // Check if account is temporarily locked due to brute force
    if (rateLimitState.isLocked) {
      return {
        success: false,
        error: `Akses ditangguhkan sementara demi keamanan sistem. Silakan coba kembali dalam ${rateLimitState.lockoutRemainingSeconds} detik.`,
      };
    }

    // Verify Captcha if challenge exists
    if (captchaChallenge) {
      if (!captchaAnswer || parseInt(captchaAnswer.trim(), 10) !== captchaChallenge.answer) {
        refreshCaptcha();
        return {
          success: false,
          error: 'Verifikasi keamanan anti-bot (CAPTCHA) salah. Silakan jawab kembali pertanyaan matematika.',
          requireCaptcha: true,
        };
      }
    }

    const cleanInput = identifier.trim().toLowerCase();
    
    // Valid identifier patterns for the village authority
    const validIdentifiers = [
      adminAccount.username.toLowerCase(),
      adminAccount.nipd.toLowerCase(),
      adminAccount.email.toLowerCase(),
      'admin',
      'kades',
      'developer',
      'pamong'
    ];

    const isIdentValid = validIdentifiers.includes(cleanInput);

    if (!isIdentValid) {
      handleFailedAttempt(`Identitas pengguna "${identifier}" tidak terdaftar dalam direktori kedinasan.`);
      return { 
        success: false, 
        error: 'Identitas NIPD / Nama Pengguna tidak terdaftar pada sistem administrasi desa.',
        requireCaptcha: rateLimitState.failedAttempts + 1 >= 2,
      };
    }

    // Hash the input password and compare with stored hash
    const inputHash = await sha256Hash(passwordInput, adminAccount.passwordSalt || DEFAULT_SALT);
    const expectedHash = adminAccount.passwordHash || await sha256Hash('admin', DEFAULT_SALT);

    if (inputHash !== expectedHash) {
      handleFailedAttempt(`Kata sandi tidak valid untuk akun ${adminAccount.name}.`);
      return { 
        success: false, 
        error: 'Kata sandi akun kedinasan tidak valid.',
        requireCaptcha: rateLimitState.failedAttempts + 1 >= 2,
      };
    }

    // Success Step 1
    setRateLimitState({ failedAttempts: 0, isLocked: false, lockoutRemainingSeconds: 0 });
    setCaptchaChallenge(null);
    setIsPublicComputer(isPublicPC);
    try {
      sessionStorage.setItem('desabrabo_is_public_pc', isPublicPC ? 'true' : 'false');
    } catch {}

    setStep1Completed(true);

    addSecurityLog(
      'STEP1_VERIFIED',
      'SUCCESS',
      `Tahap 1 tervalidasi via SHA-256 [${isPublicPC ? 'Mode Komputer Balai Desa' : 'Mode Perangkat Kerja'}]. Menunggu otorisasi ganda (Kades Passphrase / Dev Signing Token).`
    );

    return { success: true };
  };

  const handleFailedAttempt = (reason: string) => {
    const nextAttempts = rateLimitState.failedAttempts + 1;
    if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
      setRateLimitState({
        failedAttempts: nextAttempts,
        isLocked: true,
        lockoutRemainingSeconds: LOCKOUT_DURATION_SECONDS,
      });
      addSecurityLog(
        'ACCOUNT_LOCKED_TEMPORARY',
        'FAILED',
        `Sistem mendeteksi ${nextAttempts} kali kegagalan otentikasi berturut-turut. Akses ditangguhkan selama ${LOCKOUT_DURATION_SECONDS} detik.`
      );
    } else {
      setRateLimitState(prev => ({
        ...prev,
        failedAttempts: nextAttempts,
      }));
      if (nextAttempts >= 2 && !captchaChallenge) {
        setCaptchaChallenge(generateRandomCaptcha());
      }
      addSecurityLog('LOGIN_FAILED', 'FAILED', `Otentikasi gagal (${nextAttempts}/${MAX_FAILED_ATTEMPTS}): ${reason}`);
    }
  };

  // STEP 2: Dual Authority Second Factor Verification (Kades Passphrase OR Developer Signing Token)
  const verifyAuthorityCode = async (code: string): Promise<MasterKeyVerifyResult> => {
    if (!step1Completed) {
      return { success: false, error: 'Silakan selesaikan Tahap 1 (kredensial akun) terlebih dahulu.' };
    }

    if (rateLimitState.isLocked) {
      return {
        success: false,
        error: `Akses ditangguhkan sementara. Silakan tunggu ${rateLimitState.lockoutRemainingSeconds} detik.`,
      };
    }

    const cleanEntered = code.trim();
    const inputHash = await sha256Hash(cleanEntered, adminAccount.passwordSalt || DEFAULT_SALT);

    // Target Hashes
    const expectedKadesHash = adminAccount.kadesPassphraseHash || await sha256Hash('KADES-BRABO-2026', DEFAULT_SALT);
    const expectedDevHash = adminAccount.developerTokenHash || await sha256Hash('BRABO-DEV-2026', DEFAULT_SALT);

    let authChannel: 'KADES_PASSPHRASE' | 'DEVELOPER_TOKEN' | null = null;

    if (inputHash === expectedKadesHash) {
      authChannel = 'KADES_PASSPHRASE';
    } else if (inputHash === expectedDevHash) {
      authChannel = 'DEVELOPER_TOKEN';
    }

    if (!authChannel) {
      handleFailedAttempt(`Kode otorisasi ganda tidak cocok dengan Otoritas Kades maupun Kunci Developer.`);
      return {
        success: false,
        error: 'Kode Otorisasi Ganda tidak valid. Masukkan Passphrase Kepala Desa atau Signing Token Developer yang sah.',
      };
    }

    // Success Authentication
    const sessionToken = generateSessionToken();
    setAuthenticatedVia(authChannel);
    setCurrentAdmin(adminAccount);
    setIsAuthenticated(true);
    setIsScreenLocked(false);
    setStep1Completed(false);
    setRateLimitState({ failedAttempts: 0, isLocked: false, lockoutRemainingSeconds: 0 });
    setSessionTimeRemaining(isPublicComputer ? PUBLIC_PC_TIMEOUT_SECONDS : STANDARD_TIMEOUT_SECONDS);

    // Update last login
    setAdminAccount(prev => ({
      ...prev,
      lastLoginAt: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      lastLoginIp: isPublicComputer ? '180.252.164.22 (Balai Desa)' : '180.252.164.45 (Workstation)'
    }));

    // Register active session with token
    const newSession: ActiveSession = {
      id: `SES-${Date.now().toString().slice(-4)}`,
      sessionToken,
      adminId: adminAccount.id,
      adminName: adminAccount.name,
      adminRole: adminAccount.roleLabel,
      adminEmail: adminAccount.email,
      avatarUrl: adminAccount.avatarUrl,
      deviceInfo: isPublicComputer ? 'Workstation Balai Desa Brabo (Public PC)' : 'Perangkat Terdaftar / Laptop Kedinasan',
      isPublicComputer: isPublicComputer,
      loginTimestamp: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      expiresAt: isPublicComputer ? '15 Menit Inaktif' : '4 Jam Sesi Normal',
      lastActivityTimestamp: 'Baru saja',
      ipAddress: isPublicComputer ? '180.252.164.22' : '180.252.164.45',
      location: 'Balai Desa Brabo, Tanggungharjo, Grobogan',
      authenticatedVia: authChannel,
      isCurrentSession: true,
    };

    setActiveSessions(prev => [newSession, ...prev.filter(s => !s.isCurrentSession)]);

    addSecurityLog(
      'MASTER_KEY_VERIFIED',
      'SUCCESS',
      `Autentikasi Dual-Authority tervalidasi penuh via [${authChannel === 'KADES_PASSPHRASE' ? 'Passphrase Kepala Desa' : 'Developer Signing Token'}]. Token sesi aktif diterbitkan.`
    );

    return { success: true, authenticatedVia: authChannel };
  };

  const cancelStep1 = () => {
    setStep1Completed(false);
  };

  const logout = () => {
    if (currentAdmin) {
      addSecurityLog(
        'LOGOUT',
        'SUCCESS',
        'Administrator keluar secara aman dari panel kendali CMS.'
      );
    }

    setCurrentAdmin(null);
    setIsAuthenticated(false);
    setIsScreenLocked(false);
    setStep1Completed(false);
    setAuthenticatedVia(null);
    setIsPublicComputer(false);

    try {
      localStorage.removeItem('desabrabo_current_admin');
      localStorage.removeItem('desabrabo_is_auth');
      sessionStorage.clear();
    } catch {}
  };

  const lockScreen = () => {
    setIsScreenLocked(true);
    addSecurityLog(
      'SCREEN_LOCKED',
      'SUCCESS',
      'Layar kerja admin dikunci sementara (Screen Lock).'
    );
  };

  const unlockScreen = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    const inputHash = await sha256Hash(pin, adminAccount.passwordSalt || DEFAULT_SALT);
    const expectedHash = adminAccount.securityPinHash || await sha256Hash('123456', DEFAULT_SALT);

    if (inputHash !== expectedHash) {
      addSecurityLog(
        'LOGIN_FAILED',
        'FAILED',
        'Percobaan buka kunci layar gagal: PIN Keamanan tidak valid.'
      );
      return { success: false, error: 'PIN Keamanan 6-digit salah.' };
    }

    setIsScreenLocked(false);
    setSessionTimeRemaining(isPublicComputer ? PUBLIC_PC_TIMEOUT_SECONDS : STANDARD_TIMEOUT_SECONDS);

    addSecurityLog(
      'SCREEN_UNLOCKED',
      'SUCCESS',
      'Layar kerja berhasil dibuka kembali dengan PIN Keamanan tervalidasi.'
    );

    return { success: true };
  };

  const extendSession = () => {
    setSessionTimeRemaining(isPublicComputer ? PUBLIC_PC_TIMEOUT_SECONDS : STANDARD_TIMEOUT_SECONDS);
  };

  const rotatePassword = async (currentPasswordInput: string, newPasswordInput: string): Promise<{ success: boolean; error?: string }> => {
    const currHash = await sha256Hash(currentPasswordInput, adminAccount.passwordSalt || DEFAULT_SALT);
    if (currHash !== adminAccount.passwordHash) {
      return { success: false, error: 'Kata sandi saat ini yang Anda masukkan salah.' };
    }

    if (!newPasswordInput || newPasswordInput.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter dengan kombinasi huruf dan angka.' };
    }

    const newHash = await sha256Hash(newPasswordInput, adminAccount.passwordSalt || DEFAULT_SALT);
    setAdminAccount(prev => ({ ...prev, passwordHash: newHash }));
    addSecurityLog(
      'CREDENTIALS_ROTATED',
      'SUCCESS',
      'Kata sandi utama akun kedinasan berhasil dirotasi (SHA-256 Salted Hash diperbarui).'
    );
    return { success: true };
  };

  const rotateKadesPassphrase = async (newPassphrase: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassphrase || newPassphrase.trim().length < 6) {
      return { success: false, error: 'Passphrase Kepala Desa minimal 6 karakter.' };
    }

    const newHash = await sha256Hash(newPassphrase.trim(), adminAccount.passwordSalt || DEFAULT_SALT);
    setAdminAccount(prev => ({ ...prev, kadesPassphraseHash: newHash }));
    addSecurityLog(
      'PASSPHRASE_ROTATED',
      'SUCCESS',
      'Passphrase Otorisasi Kepala Desa berhasil dirotasi.'
    );
    return { success: true };
  };

  const rotateDeveloperToken = async (newToken: string): Promise<{ success: boolean; error?: string }> => {
    if (!newToken || newToken.trim().length < 6) {
      return { success: false, error: 'Developer Signing Token minimal 6 karakter.' };
    }

    const newHash = await sha256Hash(newToken.trim(), adminAccount.passwordSalt || DEFAULT_SALT);
    setAdminAccount(prev => ({ ...prev, developerTokenHash: newHash }));
    addSecurityLog(
      'DEV_TOKEN_ROTATED',
      'SUCCESS',
      'Developer Master Signing Token berhasil dirotasi.'
    );
    return { success: true };
  };

  const updateSecurityPin = async (newPin: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPin || newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return { success: false, error: 'PIN harus tepat 6 digit angka numerik.' };
    }

    const newHash = await sha256Hash(newPin, adminAccount.passwordSalt || DEFAULT_SALT);
    setAdminAccount(prev => ({ ...prev, securityPinHash: newHash }));
    addSecurityLog(
      'PIN_CHANGED',
      'SUCCESS',
      'PIN Kunci Layar 6-Digit berhasil diperbarui.'
    );
    return { success: true };
  };

  const terminateOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrentSession));
    addSecurityLog(
      'CREDENTIALS_ROTATED',
      'WARNING',
      'Perintah terminasi paksa seluruh sesi perangkat lain berhasil dieksekusi.'
    );
  };

  const terminateSpecificSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminAccount,
        currentAdmin,
        isAuthenticated,
        step1Completed,
        authenticatedVia,
        isPublicComputer,
        isScreenLocked,
        activeSessions,
        securityLogs,
        sessionTimeRemaining,
        rateLimitState,
        captchaChallenge,
        loginStep1,
        verifyAuthorityCode,
        cancelStep1,
        refreshCaptcha,
        logout,
        lockScreen,
        unlockScreen,
        extendSession,
        rotatePassword,
        rotateKadesPassphrase,
        rotateDeveloperToken,
        updateSecurityPin,
        terminateOtherSessions,
        terminateSpecificSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
