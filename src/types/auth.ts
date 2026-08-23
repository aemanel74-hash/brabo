export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'KEPALA_DESA' 
  | 'DEVELOPER_ADMIN';

export type SecondFactorAuthMode = 
  | 'KADES_AUTHORITY_PASSPHRASE' 
  | 'DEVELOPER_SIGNING_TOKEN';

export interface AdminAccount {
  id: string;
  username: string;
  nipd: string; // Nomor Induk Perangkat Desa
  name: string;
  role: AdminRole;
  roleLabel: string;
  email: string;
  avatarUrl: string;
  passwordHash: string; // SHA-256 Hash
  passwordSalt: string;
  kadesPassphraseHash: string; // SHA-256 Hash for Kades Master Passphrase
  developerTokenHash: string; // SHA-256 Hash for Dev Master Signing Token
  securityPinHash: string; // SHA-256 Hash for Screen Lock PIN
  lastLoginAt?: string;
  lastLoginIp?: string;
  registeredAt: string;
}

export interface ActiveSession {
  id: string;
  sessionToken: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  adminEmail: string;
  avatarUrl: string;
  deviceInfo: string;
  isPublicComputer: boolean;
  loginTimestamp: string;
  expiresAt: string;
  lastActivityTimestamp: string;
  ipAddress: string;
  location: string;
  authenticatedVia: 'KADES_PASSPHRASE' | 'DEVELOPER_TOKEN';
  isCurrentSession?: boolean;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  eventType: 
    | 'LOGIN_SUCCESS' 
    | 'LOGIN_FAILED' 
    | 'STEP1_VERIFIED' 
    | 'MASTER_KEY_VERIFIED' 
    | 'ACCOUNT_LOCKED_TEMPORARY'
    | 'LOGOUT' 
    | 'SESSION_EXPIRED' 
    | 'CREDENTIALS_ROTATED' 
    | 'PASSPHRASE_ROTATED'
    | 'DEV_TOKEN_ROTATED'
    | 'PIN_CHANGED' 
    | 'SCREEN_LOCKED'
    | 'SCREEN_UNLOCKED'
    | 'PUBLIC_PC_MODE_ACTIVATED';
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
  device: string;
  ip: string;
}

export interface RateLimitState {
  failedAttempts: number;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
}
