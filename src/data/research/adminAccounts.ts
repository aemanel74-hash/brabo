import { AdminAccount, SecurityLogEntry, ActiveSession } from '../../types/auth';

// Standard salt for local crypt hashing
export const DEFAULT_SALT = 'desa_brabo_2026_salt';

// Pre-hashed defaults with 'desa_brabo_2026_salt':
// Password 'admin' -> hash
// Kades Passphrase 'KADES-BRABO-2026'
// Developer Token 'BRABO-DEV-2026'
// PIN '123456'
export const DEFAULT_ADMIN_ACCOUNT: AdminAccount = {
  id: 'ADM-BRABO-01',
  username: 'admin.brabo',
  nipd: '33.15.14.2001.01',
  name: 'Pamong Utama & Pengembang Sistem',
  role: 'SUPER_ADMIN',
  roleLabel: 'Super Administrator & Pengendali Sistem Desa',
  email: 'pamong@brabo.desa.id',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  passwordHash: '', // Will be initialized if empty via sha256Hash('admin')
  passwordSalt: DEFAULT_SALT,
  kadesPassphraseHash: '', // sha256Hash('KADES-BRABO-2026')
  developerTokenHash: '', // sha256Hash('BRABO-DEV-2026')
  securityPinHash: '', // sha256Hash('123456')
  lastLoginAt: '21 Agu 2026, 22:45 WIB',
  lastLoginIp: '180.252.164.22 (Kantor Balai Desa Brabo)',
  registeredAt: '2024-01-01',
};

export const INITIAL_SECURITY_LOGS: SecurityLogEntry[] = [
  {
    id: 'LOG-1001',
    timestamp: '21 Agu 2026, 22:45 WIB',
    adminName: 'Pamong Utama & Pengembang Sistem',
    adminEmail: 'pamong@brabo.desa.id',
    eventType: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    details: 'Autentikasi Dual-Authority berhasil. Sesi terverifikasi melalui Otorisasi Lanjutan Kedinasan.',
    device: 'Edge 128 / Windows 11 (PC Staf Balai Desa Brabo)',
    ip: '180.252.164.22',
  },
  {
    id: 'LOG-1002',
    timestamp: '21 Agu 2026, 21:10 WIB',
    adminName: 'Pamong Utama & Pengembang Sistem',
    adminEmail: 'pamong@brabo.desa.id',
    eventType: 'PUBLIC_PC_MODE_ACTIVATED',
    status: 'WARNING',
    details: 'Mode Komputer Publik Balai Desa diaktifkan. Batas waktu inaktivitas 15 menit diterapkan.',
    device: 'Edge 128 / Windows 11 (PC Balai Desa 01)',
    ip: '180.252.164.22',
  },
  {
    id: 'LOG-1003',
    timestamp: '20 Agu 2026, 14:20 WIB',
    adminName: 'Pamong Utama & Pengembang Sistem',
    adminEmail: 'pamong@brabo.desa.id',
    eventType: 'SCREEN_UNLOCKED',
    status: 'SUCCESS',
    details: 'Kunci layar dibuka kembali menggunakan PIN Kedinasan 6-Digit.',
    device: 'Edge 128 / Windows 11 (PC Staf Balai Desa Brabo)',
    ip: '180.252.164.22',
  }
];

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'SES-001',
    sessionToken: 'e4f9b8c2d1a3f7e6b5a4c3d2e1f0a9b8',
    adminId: 'ADM-BRABO-01',
    adminName: 'Pamong Utama & Pengembang Sistem',
    adminRole: 'Super Administrator & Pengendali Sistem Desa',
    adminEmail: 'pamong@brabo.desa.id',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    deviceInfo: 'Workstation Balai Desa Brabo (PC 01)',
    isPublicComputer: true,
    loginTimestamp: '21 Agu 2026, 22:45 WIB',
    expiresAt: '21 Agu 2026, 23:45 WIB',
    lastActivityTimestamp: 'Baru saja',
    ipAddress: '180.252.164.22',
    location: 'Balai Desa Brabo, Tanggungharjo, Grobogan',
    authenticatedVia: 'KADES_PASSPHRASE',
    isCurrentSession: true,
  }
];
