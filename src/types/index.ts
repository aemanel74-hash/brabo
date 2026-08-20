export type VerificationStatus = 
  | 'VERIFIED'
  | 'SUPPORTED'
  | 'UNVERIFIED'
  | 'NOT_FOUND'
  | 'REQUIRES_VERIFICATION';

export type VerificationSourceOption = 
  | 'UNVERIFIED'          // Belum Diverifikasi
  | 'VERIFIED_DESA'       // Diverifikasi oleh Desa
  | 'BPS_GROBOGAN'        // Data BPS Grobogan
  | 'OTHER_VALID_SOURCE'; // Sumber lainnya yang valid

export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  accessedAt?: string;
  year?: string;
  category?: string;
  description?: string;
  tier: 1 | 2 | 3; // 1 = Pemerintah/BPS, 2 = Lembaga/Akademik, 3 = Media/Sekunder
  verificationStatus: VerificationStatus;
  notes?: string;
}

export type ResearchSource = SourceCitation;

export interface VerifiedItem<T> {
  data: T;
  sourceId: string;
  status: VerificationStatus;
  note?: string;
  lastUpdated?: string;
}

export interface OfficialPerson {
  id: string;
  name: string;
  role: string;
  period?: string;
  appointmentDate?: string;
  status: VerificationStatus;
  sourceId: string;
  photoUrl?: string;
  description?: string;
  contact?: string;
  isConfirmedActive: boolean;
  // Dynamic Verification Integration
  verificationSource?: VerificationSourceOption;
  verificationNote?: string;
  customSourceName?: string;
}

export interface HamletData {
  id: string;
  name: string;
  alias?: string;
  order: number;
  headName: string;
  headStatus: VerificationStatus;
  headSourceId: string;
  headVerificationSource?: VerificationSourceOption;
  headVerificationNote?: string;
  headCustomSourceName?: string;
  rtCount?: number;
  rwCount?: number;
  population?: number;
  kkCount?: number;
  description: string;
  characteristics: string[];
  facilities: string[];
  potentials: string[];
  activities: string[];
  historicalSite?: string;
  sourceId: string;
  status: VerificationStatus;
  verificationSource?: VerificationSourceOption;
  verificationNote?: string;
  customSourceName?: string;
  imageUrl?: string;
}

export interface HistoryEvent {
  id: string;
  periodOrYear: string;
  title: string;
  eventDescription: string;
  sourceId: string;
  status: VerificationStatus;
  tags?: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'Pemerintahan' | 'Keagamaan' | 'Sosial' | 'Posyandu' | 'Pemuda' | 'Pertanian' | 'UMKM' | 'Pendidikan' | 'Gotong Royong' | 'Olahraga';
  frequency: 'KEGIATAN RUTIN' | 'KEGIATAN BERKALA' | 'KEGIATAN INSIDENTAL';
  location: string;
  scheduleOrDate: string;
  description: string;
  participants: string;
  sourceId: string;
  status: VerificationStatus;
  imageUrl?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrl?: string;
}

export interface Signatory {
  id: string;
  nama: string;
  jabatan: string;
  wilayah?: string; // e.g. "Desa Brabo", "Dusun I Dukoh", "Dusun II Krajan", "Dusun III Cangkring", "RT 01 / RW 01"
  nip?: string;
  fotoSignature?: string;
  statusAktif: boolean;
}

export interface SignatureSlotConfig {
  slotId: string;
  title: string; // e.g. "Kepala Desa Brabo", "Mengetahui, Kepala Dusun", "Ketua RT Setempat"
  signatoryId?: string; // Specific chosen signatory ID, or dynamically selected
  position: 'left' | 'center' | 'right';
  requiresTerritoryMatch?: boolean;
}

export type ComplaintStatus = 
  | 'MENUNGGU_VERIFIKASI'
  | 'DIVERIFIKASI'
  | 'SEDANG_DITINDAKLANJUTI'
  | 'SELESAI'
  | 'DITOLAK';

export type ComplaintCategory = 
  | 'Infrastruktur & Jalan'
  | 'Pelayanan Publik'
  | 'Kebersihan & Lingkungan'
  | 'Sosial & Bantuan'
  | 'Keamanan & Ketertiban'
  | 'Kesehatan'
  | 'Lainnya';

export interface CitizenComplaint {
  id: string;
  trackingCode: string; // e.g. ADU-849201
  reporterName: string;
  isAnonymous: boolean;
  nik?: string;
  phone: string;
  hamlet: string;
  specificLocation: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  adminResponseDate?: string;
  officerInCharge?: string;
}

export type DocumentCategory = 
  | 'Kependudukan' 
  | 'Perizinan & Usaha' 
  | 'Sosial & Kesejahteraan' 
  | 'Keterangan Umum' 
  | 'Pertanahan & Waris';

export interface DocumentTemplate {
  id: string;
  code: string;
  name: string;
  category: DocumentCategory;
  description: string;
  fileUrl: string; // URL file download format surat/formulir
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'DOC' | 'ZIP' | 'IMAGE';
  fileSizeBytes?: number;
  lastUpdated: string;
  estimatedProcessingTime: string;
  cost: string;
  isActive: boolean;
  requirements: string[]; // Rules / syarat dokumen
  proceduralSteps: string[]; // Tata cara / alur permohonan
  targetOfficer?: string;
  // Legacy optional properties for backward compatibility
  kopTitle?: string;
  kopSubtitle?: string;
  letterNumberFormat?: string;
  perihal?: string;
  openingText?: string;
  contentTemplate?: string;
  closingText?: string;
  signatureLayout?: 'single' | 'double_horizontal' | 'double_stacked' | 'triple';
  signatureSlots?: SignatureSlotConfig[];
  footerNote?: string;
  fontSize?: 'sm' | 'base' | 'lg';
  margins?: 'compact' | 'normal' | 'spacious';
}

// Type alias
export type LetterTemplate = DocumentTemplate;

export interface DocumentSubmission {
  id: string;
  trackingCode: string;
  templateId: string;
  templateCode: string;
  serviceName: string;
  nik: string;
  fullName: string;
  gender?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  religion?: string;
  occupation?: string;
  hamlet: string;
  rt: string;
  rw: string;
  purpose: string;
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  ktpPhotoUrl?: string;
  kkPhotoUrl?: string;
  businessName?: string;
  businessType?: string;
  selectedSignatoryIds?: string[];
  status: 'MENUNGGU_VERIFIKASI' | 'DIPROSES' | 'SELESAI_SIAP_AMBIL' | 'DITOLAK';
  submittedAt: string;
  notes?: string;
  customLetterNumber?: string;
  pickupSchedule?: string;
}

export type LetterSubmission = DocumentSubmission;

export type MapLocationCategory = 
  | 'Kantor Desa' 
  | 'Dusun' 
  | 'Sekolah' 
  | 'Kesehatan' 
  | 'Tempat Ibadah' 
  | 'Fasilitas Umum' 
  | 'UMKM' 
  | 'Pertanian' 
  | 'Potensi Desa' 
  | 'Olahraga' 
  | 'Lainnya';

export interface MapLocation {
  id: string;
  name: string;
  category: MapLocationCategory;
  lat: number;
  lng: number;
  description: string;
  address: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  sourceId: string;
  verificationStatus: VerificationStatus;
}

export interface VillageBoundary {
  id: string;
  name: string;
  sourceName: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  coordinates: [number, number][]; // [lat, lng] pairs for boundary polygon
  isActive: boolean;
  lastVerified: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'Berita' | 'Kegiatan' | 'Perangkat' | 'Potensi' | 'Peta' | 'Dokumen' | 'Umum';
  size: number;
  uploadedAt: string;
  fileType: string;
}

export interface PotentialItem {
  id: string;
  title: string;
  category: 'Pendidikan & Pesantren' | 'Pertanian' | 'UMKM & Perdagangan' | 'Sosial & Budaya' | 'Ketahanan Pangan';
  description: string;
  keyProductsOrFeatures: string[];
  scaleOrImpact: string;
  sourceId: string;
  status: VerificationStatus;
  imageUrl?: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Pendidikan' | 'Pesantren' | 'Kesehatan' | 'Pemerintahan' | 'Ibadah' | 'Infrastruktur & Publik';
  addressOrLocation: string;
  description: string;
  status: VerificationStatus;
  sourceId: string;
  npsnOrCode?: string;
  accreditation?: string;
  yearEstablished?: string;
}

export interface DemographicStat {
  label: string;
  value: string | number;
  unit?: string;
  year: string;
  sourceId: string;
  status: VerificationStatus;
  description?: string;
}

export interface VillageService {
  id: string;
  name: string;
  code: string;
  category: 'Kependudukan' | 'Perizinan' | 'Keterangan' | 'Sosial';
  processingTime: string;
  cost: string;
  requirements: string[];
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Pemerintahan' | 'Pengumuman' | 'Pembangunan' | 'Pendidikan' | 'Sosial';
  summary: string;
  content: string;
  author: string;
  sourceId: string;
  status: VerificationStatus;
  featured?: boolean;
}

export type CommunityOrgType = 'PKK' | 'KARANG_TARUNA';

export interface CommunityOrgMember {
  id: string;
  orgType: CommunityOrgType;
  name: string;
  position: string;
  role?: string; // Alias compatibility for position
  period?: string;
  photoUrl?: string;
  contact?: string;
  phone?: string; // Alias compatibility for contact
  status: VerificationStatus;
  sourceId: string;
  verificationSource?: VerificationSourceOption;
  verificationNote?: string;
  customSourceName?: string;
  isConfirmedActive?: boolean;
  notes?: string;
  order?: number;
}

export interface CitizenActivityPhoto {
  id: string;
  activityId?: string;
  activityTitle: string;
  category: ActivityItem['category'];
  uploaderName: string;
  uploaderHamlet?: string;
  uploaderPhone?: string;
  photoUrl: string;
  caption: string;
  takenDate?: string;
  uploadedAt: string;
  fileSizeKb?: number;
  status: 'APPROVED' | 'PENDING';
}
