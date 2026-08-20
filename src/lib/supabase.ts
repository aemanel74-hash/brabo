import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  OfficialPerson, 
  ActivityItem, 
  MapLocation, 
  CommunityOrgMember, 
  CitizenActivityPhoto, 
  MediaItem, 
  LetterTemplate,
  DocumentTemplate,
  DocumentSubmission,
  CitizenComplaint,
  Signatory
} from '../types';
import { LetterSubmission, NewsArticle } from '../context/VillageDataContext';

// Storage key for custom user-configured credentials via UI
const SUPABASE_CONFIG_STORAGE_KEY = 'desa_brabo_supabase_custom_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Get Supabase Configuration from env or localStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envAnonKey) {
    return { url: envUrl, anonKey: envAnonKey };
  }

  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  return { url: envUrl, anonKey: envAnonKey };
}

/**
 * Save custom Supabase credentials directly from Admin CMS
 */
export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving Supabase config:', e);
  }
}

/**
 * Clear custom Supabase credentials
 */
export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(SUPABASE_CONFIG_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing Supabase config:', e);
  }
}

// Singleton Supabase Client
let cachedClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const key = `${config.url}:::${config.anonKey}`;
  if (!cachedClient || currentConfigKey !== key) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      currentConfigKey = key;
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey && config.url.startsWith('https://'));
}

/**
 * Test Connection & check if tables/buckets exist in Supabase
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
  bucketsFound?: string[];
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL atau Anon Key belum dikonfigurasi. Silakan masukkan di formulir pengaturan.',
    };
  }

  try {
    // 1. Check storage buckets
    const { data: buckets, error: storageError } = await client.storage.listBuckets();
    const bucketNames = buckets?.map((b) => b.name) || [];

    // 2. Test querying officials table
    const { data: officials, error: dbError } = await client
      .from('pamong_desa')
      .select('id')
      .limit(1);

    if (dbError && dbError.code === '42P01') {
      return {
        success: true,
        message: 'Koneksi ke Supabase BERHASIL! Namun tabel database belum dibuat. Silakan salin & jalankan script SQL Schema di Supabase SQL Editor Anda.',
        bucketsFound: bucketNames,
        tablesFound: [],
      };
    }

    if (dbError && !storageError) {
      return {
        success: true,
        message: `Koneksi Supabase aktif. Respon query: ${dbError.message}`,
        bucketsFound: bucketNames,
      };
    }

    return {
      success: true,
      message: 'Koneksi ke Database dan Storage Supabase BERHASIL dan SIAP DIGUNAKAN!',
      bucketsFound: bucketNames,
      tablesFound: ['pamong_desa'],
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal terhubung ke Supabase: ${error?.message || String(error)}`,
    };
  }
}

/**
 * Storage Bucket Operations
 */
export const SUPABASE_BUCKETS = {
  MEDIA: 'brabo-media',
  DOCUMENTS: 'brabo-docs',
  CITIZEN_PHOTOS: 'brabo-citizen-photos',
  COMPLAINTS: 'brabo-complaints',
};

/**
 * Upload binary file (File / Blob) directly to Supabase Storage
 */
export async function uploadFileToSupabaseStorage(
  file: File | Blob,
  bucketName: string,
  fileName: string,
  contentType?: string
): Promise<{ success: boolean; url: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, url: '', error: 'Supabase client belum aktif.' };
  }

  try {
    const cleanPath = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const detectedType = contentType || (file instanceof File ? file.type : 'application/octet-stream') || 'application/octet-stream';

    const { data, error } = await client.storage
      .from(bucketName)
      .upload(cleanPath, file, {
        contentType: detectedType,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Storage upload error:', error);
      return { success: false, url: '', error: error.message };
    }

    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Error uploading file to Supabase storage:', err);
    return { success: false, url: '', error: err.message || String(err) };
  }
}

/**
 * Upload Base64 Image to Supabase Storage Bucket
 */
export async function uploadBase64ToSupabaseStorage(
  base64DataUrl: string,
  bucketName: string,
  fileName: string
): Promise<{ success: boolean; url: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, url: '', error: 'Supabase client belum aktif.' };
  }

  try {
    // Convert base64 dataUrl to Blob
    const parts = base64DataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'image/webp';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    const blob = new Blob([uInt8Array], { type: contentType });
    const cleanPath = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { data, error } = await client.storage
      .from(bucketName)
      .upload(cleanPath, blob, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Storage upload error:', error);
      return { success: false, url: '', error: error.message };
    }

    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Error uploading base64 to Supabase storage:', err);
    return { success: false, url: '', error: err.message || String(err) };
  }
}

/**
 * Real-time direct query for tracking Citizen Complaint (Multi-device search)
 */
export async function searchComplaintInSupabase(trackingCode: string): Promise<CitizenComplaint | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const cleanCode = trackingCode.trim().toUpperCase();
    const { data, error } = await client
      .from('aduan_warga')
      .select('*')
      .or(`tracking_code.ilike.%${cleanCode}%,id.eq.${cleanCode}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      trackingCode: data.tracking_code,
      reporterName: data.reporter_name,
      isAnonymous: data.is_anonymous,
      nik: data.nik,
      phone: data.phone,
      hamlet: data.hamlet,
      specificLocation: data.specific_location,
      category: data.category,
      title: data.title,
      description: data.description,
      photoUrl: data.photo_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      adminResponse: data.admin_response,
      adminResponseDate: data.admin_response_date,
      officerInCharge: data.officer_in_charge,
    };
  } catch (err) {
    console.warn('Failed to search complaint in Supabase:', err);
    return null;
  }
}

/**
 * Real-time direct query for tracking Document Submission (Multi-device search)
 */
export async function searchSubmissionInSupabase(trackingCode: string): Promise<LetterSubmission | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const cleanCode = trackingCode.trim().toUpperCase();
    // Check in pengajuan_dokumen first, fallback to antrean_surat
    const { data: docData, error: docErr } = await client
      .from('pengajuan_dokumen')
      .select('*')
      .or(`tracking_code.ilike.%${cleanCode}%,id.eq.${cleanCode}`)
      .limit(1)
      .maybeSingle();

    if (!docErr && docData) {
      return {
        id: docData.id,
        trackingCode: docData.tracking_code,
        templateId: docData.template_id,
        templateCode: docData.template_code || '',
        serviceName: docData.template_name || docData.service_name || '',
        nik: docData.applicant_nik || docData.nik || '',
        fullName: docData.applicant_name || docData.full_name || '',
        gender: docData.gender,
        placeOfBirth: docData.place_of_birth,
        dateOfBirth: docData.date_of_birth,
        religion: docData.religion,
        occupation: docData.occupation,
        hamlet: docData.hamlet || 'Dusun Krajan',
        rt: docData.rt || '01',
        rw: docData.rw || '01',
        purpose: docData.purpose || '',
        uploadedFileUrl: docData.attached_file_url || docData.uploaded_file_url,
        uploadedFileName: docData.attached_file_name || docData.uploaded_file_name,
        ktpPhotoUrl: docData.ktp_photo_url,
        kkPhotoUrl: docData.kk_photo_url,
        status: docData.status || 'MENUNGGU_VERIFIKASI',
        submittedAt: docData.submitted_at || docData.created_at,
        notes: docData.admin_notes || docData.notes,
        customLetterNumber: docData.letter_number || docData.custom_letter_number,
        pickupSchedule: docData.pickup_schedule,
      };
    }

    const { data: legacyData, error: legacyErr } = await client
      .from('antrean_surat')
      .select('*')
      .or(`id.ilike.%${cleanCode}%,letter_number.ilike.%${cleanCode}%`)
      .limit(1)
      .maybeSingle();

    if (!legacyErr && legacyData) {
      return {
        id: legacyData.id,
        trackingCode: legacyData.id,
        templateId: legacyData.template_id,
        templateCode: legacyData.template_id,
        serviceName: legacyData.template_name,
        nik: legacyData.applicant_nik,
        fullName: legacyData.applicant_name,
        hamlet: legacyData.hamlet || 'Dusun Krajan',
        rt: '01',
        rw: '01',
        purpose: legacyData.form_data?.purpose || 'Permohonan Berkas',
        status: legacyData.status,
        submittedAt: legacyData.submitted_at,
        notes: legacyData.notes,
        customLetterNumber: legacyData.letter_number,
      };
    }

    return null;
  } catch (err) {
    console.warn('Failed to search submission in Supabase:', err);
    return null;
  }
}

/**
 * Sync all local data to Supabase database tables
 */
export async function pushAllDataToSupabase(payload: {
  villageHead: OfficialPerson;
  officials: OfficialPerson[];
  submissions: LetterSubmission[];
  activities: ActivityItem[];
  news: NewsArticle[];
  mapLocations: MapLocation[];
  pkkMembers: CommunityOrgMember[];
  karangTarunaMembers: CommunityOrgMember[];
  citizenPhotos: CitizenActivityPhoto[];
  mediaList: MediaItem[];
  letterTemplates: DocumentTemplate[];
  signatories: Signatory[];
  complaints?: CitizenComplaint[];
  documentTemplates?: DocumentTemplate[];
  documentSubmissions?: DocumentSubmission[];
}): Promise<{ success: boolean; message: string; details?: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client belum terkonfigurasi.' };
  }

  try {
    const results: Record<string, string> = {};

    // 1. Sync Pamong (Village Head + Officials)
    const allPamong = [payload.villageHead, ...payload.officials].map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      period: p.period || '',
      appointment_date: p.appointmentDate || '',
      status: p.status,
      source_id: p.sourceId,
      photo_url: p.photoUrl || '',
      description: p.description || '',
      contact: p.contact || '',
      is_confirmed_active: p.isConfirmedActive,
      updated_at: new Date().toISOString(),
    }));

    const { error: pamongErr } = await client.from('pamong_desa').upsert(allPamong, { onConflict: 'id' });
    results['pamong_desa'] = pamongErr ? `Error: ${pamongErr.message}` : `Berhasil (${allPamong.length} data)`;

    // 2. Sync Complaints / Aduan Warga
    const complaintsList = payload.complaints || [];
    if (complaintsList.length > 0) {
      const complaintsData = complaintsList.map((c) => ({
        id: c.id,
        tracking_code: c.trackingCode,
        reporter_name: c.reporterName,
        is_anonymous: c.isAnonymous,
        nik: c.nik || '',
        phone: c.phone || '',
        hamlet: c.hamlet || '',
        specific_location: c.specificLocation || '',
        category: c.category,
        title: c.title,
        description: c.description,
        photo_url: c.photoUrl || '',
        status: c.status,
        admin_response: c.adminResponse || '',
        admin_response_date: c.adminResponseDate || '',
        officer_in_charge: c.officerInCharge || '',
        created_at: c.createdAt || new Date().toISOString(),
        updated_at: c.updatedAt || new Date().toISOString(),
      }));

      const { error: compErr } = await client.from('aduan_warga').upsert(complaintsData, { onConflict: 'id' });
      results['aduan_warga'] = compErr ? `Error: ${compErr.message}` : `Berhasil (${complaintsData.length} data)`;
    }

    // 3. Sync Document Templates
    const templatesList = payload.documentTemplates || payload.letterTemplates || [];
    if (templatesList.length > 0) {
      const templatesData = templatesList.map((t) => ({
        id: t.id,
        code: t.code,
        name: t.name,
        category: t.category,
        description: t.description || '',
        file_url: t.fileUrl || '',
        file_name: t.fileName || '',
        file_type: t.fileType || 'PDF',
        file_size_bytes: t.fileSizeBytes || 0,
        estimated_processing_time: t.estimatedProcessingTime || '1-2 Hari Kerja',
        cost: t.cost || 'Gratis',
        is_active: t.isActive,
        requirements: t.requirements || [],
        procedural_steps: t.proceduralSteps || [],
        target_officer: t.targetOfficer || 'Kasi Pelayanan',
        last_updated: t.lastUpdated || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: tplErr } = await client.from('template_dokumen').upsert(templatesData, { onConflict: 'id' });
      results['template_dokumen'] = tplErr ? `Error: ${tplErr.message}` : `Berhasil (${templatesData.length} data)`;
    }

    // 4. Sync Submissions (Pengajuan Berkas Warga)
    const submissionsList = payload.documentSubmissions || payload.submissions || [];
    if (submissionsList.length > 0) {
      const submissionsData = submissionsList.map((s) => ({
        id: s.id,
        tracking_code: s.trackingCode,
        template_id: s.templateId,
        template_code: s.templateCode || '',
        template_name: s.serviceName || s.templateCode,
        applicant_name: s.fullName,
        applicant_nik: s.nik,
        applicant_phone: (s as any).phone || '-',
        applicant_address: `RT ${s.rt} / RW ${s.rw}, ${s.hamlet}`,
        hamlet: s.hamlet,
        rt: s.rt,
        rw: s.rw,
        purpose: s.purpose,
        gender: s.gender || '',
        place_of_birth: s.placeOfBirth || '',
        date_of_birth: s.dateOfBirth || '',
        religion: s.religion || '',
        occupation: s.occupation || '',
        attached_file_url: s.uploadedFileUrl || '',
        attached_file_name: s.uploadedFileName || '',
        ktp_photo_url: s.ktpPhotoUrl || '',
        kk_photo_url: s.kkPhotoUrl || '',
        status: s.status,
        submitted_at: s.submittedAt,
        notes: s.notes || '',
        letter_number: s.customLetterNumber || '',
        pickup_schedule: s.pickupSchedule || '',
        updated_at: new Date().toISOString(),
      }));

      const { error: subErr } = await client.from('pengajuan_dokumen').upsert(submissionsData, { onConflict: 'id' });
      results['pengajuan_dokumen'] = subErr ? `Error: ${subErr.message}` : `Berhasil (${submissionsData.length} data)`;
    }

    // 5. Sync Activities
    if (payload.activities.length > 0) {
      const activitiesData = payload.activities.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        frequency: a.frequency,
        location: a.location,
        schedule_or_date: a.scheduleOrDate,
        description: a.description,
        participants: a.participants,
        source_id: a.sourceId,
        status: a.status,
        image_url: a.imageUrl || '',
        cover_image: a.coverImage || '',
        gallery_images: a.galleryImages || [],
        updated_at: new Date().toISOString(),
      }));
      const { error: actErr } = await client.from('kegiatan_desa').upsert(activitiesData, { onConflict: 'id' });
      results['kegiatan_desa'] = actErr ? `Error: ${actErr.message}` : `Berhasil (${activitiesData.length} data)`;
    }

    // 6. Sync News
    if (payload.news.length > 0) {
      const newsData = payload.news.map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.id,
        date: n.date,
        category: n.category,
        summary: n.excerpt || '',
        content: n.content,
        author: n.author,
        source_id: n.sourceId,
        status: n.status,
        featured: n.featured || false,
        updated_at: new Date().toISOString(),
      }));
      const { error: newsErr } = await client.from('berita_desa').upsert(newsData, { onConflict: 'id' });
      results['berita_desa'] = newsErr ? `Error: ${newsErr.message}` : `Berhasil (${newsData.length} data)`;
    }

    // 7. Sync Map Locations
    if (payload.mapLocations.length > 0) {
      const mapData = payload.mapLocations.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        lat: m.lat,
        lng: m.lng,
        description: m.description,
        address: m.address,
        photo_url: m.photoUrl || '',
        status: m.status,
        source_id: m.sourceId,
        verification_status: m.verificationStatus,
        updated_at: new Date().toISOString(),
      }));
      const { error: mapErr } = await client.from('peta_lokasi').upsert(mapData, { onConflict: 'id' });
      results['peta_lokasi'] = mapErr ? `Error: ${mapErr.message}` : `Berhasil (${mapData.length} data)`;
    }

    // 8. Sync Kelembagaan (PKK & Karang Taruna)
    const allOrgMembers = [...payload.pkkMembers, ...payload.karangTarunaMembers].map((m) => ({
      id: m.id,
      org_type: m.orgType,
      name: m.name,
      position: m.position,
      period: m.period || '',
      photo_url: m.photoUrl || '',
      contact: m.contact || '',
      status: m.status,
      source_id: m.sourceId,
      updated_at: new Date().toISOString(),
    }));
    if (allOrgMembers.length > 0) {
      const { error: orgErr } = await client.from('kelembagaan_desa').upsert(allOrgMembers, { onConflict: 'id' });
      results['kelembagaan_desa'] = orgErr ? `Error: ${orgErr.message}` : `Berhasil (${allOrgMembers.length} data)`;
    }

    // 9. Sync Citizen Photos
    if (payload.citizenPhotos.length > 0) {
      const citizenPhotosData = payload.citizenPhotos.map((cp) => ({
        id: cp.id,
        activity_title: cp.activityTitle,
        category: cp.category,
        uploader_name: cp.uploaderName,
        uploader_hamlet: cp.uploaderHamlet || '',
        uploader_phone: cp.uploaderPhone || '',
        photo_url: cp.photoUrl,
        caption: cp.caption || '',
        taken_date: cp.takenDate || '',
        uploaded_at: cp.uploadedAt,
        file_size_kb: cp.fileSizeKb || 0,
        status: cp.status,
        updated_at: new Date().toISOString(),
      }));
      const { error: photoErr } = await client.from('foto_partisipasi_warga').upsert(citizenPhotosData, { onConflict: 'id' });
      results['foto_partisipasi_warga'] = photoErr ? `Error: ${photoErr.message}` : `Berhasil (${citizenPhotosData.length} data)`;
    }

    return {
      success: true,
      message: 'Sinkronisasi seluruh data ke Supabase berhasil diselesaikan!',
      details: results,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sinkronisasi gagal: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Pull and fetch all data from Supabase database tables to Local State
 */
export async function pullAllDataFromSupabase(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client belum terkonfigurasi.' };
  }

  try {
    // 1. Fetch Pamong
    const { data: pamongDb } = await client.from('pamong_desa').select('*');
    
    // 2. Fetch Complaints (Aduan Warga)
    const { data: complaintsDb } = await client.from('aduan_warga').select('*');

    // 3. Fetch Document Templates
    const { data: templatesDb } = await client.from('template_dokumen').select('*');

    // 4. Fetch Submissions (from pengajuan_dokumen or antrean_surat)
    let submissionsDb: any[] = [];
    const { data: pengajuanDb, error: pengajuanErr } = await client.from('pengajuan_dokumen').select('*');
    if (!pengajuanErr && pengajuanDb) {
      submissionsDb = pengajuanDb;
    } else {
      const { data: legacySubDb } = await client.from('antrean_surat').select('*');
      submissionsDb = legacySubDb || [];
    }
    
    // 5. Fetch Activities
    const { data: activitiesDb } = await client.from('kegiatan_desa').select('*');
    
    // 6. Fetch News
    const { data: newsDb } = await client.from('berita_desa').select('*');
    
    // 7. Fetch Map Locations
    const { data: mapDb } = await client.from('peta_lokasi').select('*');
    
    // 8. Fetch Kelembagaan (PKK & Karang Taruna)
    const { data: orgDb } = await client.from('kelembagaan_desa').select('*');
    
    // 9. Fetch Citizen Photos
    const { data: photosDb } = await client.from('foto_partisipasi_warga').select('*');

    return {
      success: true,
      message: 'Berhasil mengunduh data terbaru dari Supabase!',
      data: {
        pamong: pamongDb || [],
        complaints: complaintsDb || [],
        documentTemplates: templatesDb || [],
        submissions: submissionsDb || [],
        activities: activitiesDb || [],
        news: newsDb || [],
        mapLocations: mapDb || [],
        orgMembers: orgDb || [],
        citizenPhotos: photosDb || [],
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal memuat data dari Supabase: ${err?.message || String(err)}`,
    };
  }
}

/**
 * SQL SCHEMA SCRIPT TO SETUP SUPABASE DATABASE & STORAGE BUCKETS
 * Users can copy and paste this in Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- SKRIP INISIALISASI DATABASE & STORAGE SUPABASE UNTUK DESA BRABO
-- Jalankan skrip ini pada menu "SQL Editor" di Dashboard Supabase Anda.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: PAMONG & PERANGKAT DESA
CREATE TABLE IF NOT EXISTS public.pamong_desa (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT,
  appointment_date TEXT,
  status TEXT DEFAULT 'VERIFIED',
  source_id TEXT DEFAULT 'SRC-PEMDES-BRABO',
  photo_url TEXT,
  description TEXT,
  contact TEXT,
  is_confirmed_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: ADUAN / LAPORAN MASYARAKAT (REALTIME TRACKING)
CREATE TABLE IF NOT EXISTS public.aduan_warga (
  id TEXT PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  reporter_name TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  nik TEXT,
  phone TEXT,
  hamlet TEXT,
  specific_location TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'MENUNGGU_VERIFIKASI',
  admin_response TEXT,
  admin_response_date TIMESTAMPTZ,
  officer_in_charge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: TEMPLATE DOKUMEN & FORMULIR UNDUH DESA
CREATE TABLE IF NOT EXISTS public.template_dokumen (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  file_size_bytes INT DEFAULT 0,
  estimated_processing_time TEXT DEFAULT '1-2 Hari Kerja',
  cost TEXT DEFAULT 'Gratis',
  is_active BOOLEAN DEFAULT true,
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  procedural_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_officer TEXT DEFAULT 'Kasi Pelayanan',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: PENGAJUAN DOKUMEN & SURAT WARGA
CREATE TABLE IF NOT EXISTS public.pengajuan_dokumen (
  id TEXT PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  template_id TEXT NOT NULL,
  template_code TEXT,
  template_name TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_nik TEXT NOT NULL,
  applicant_phone TEXT,
  applicant_address TEXT,
  hamlet TEXT,
  rt TEXT,
  rw TEXT,
  purpose TEXT,
  gender TEXT,
  place_of_birth TEXT,
  date_of_birth TEXT,
  religion TEXT,
  occupation TEXT,
  attached_file_url TEXT,
  attached_file_name TEXT,
  ktp_photo_url TEXT,
  kk_photo_url TEXT,
  status TEXT DEFAULT 'MENUNGGU_VERIFIKASI',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  letter_number TEXT,
  pickup_schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL: KEGIATAN & AGENDA DESA
CREATE TABLE IF NOT EXISTS public.kegiatan_desa (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL,
  location TEXT NOT NULL,
  schedule_or_date TEXT NOT NULL,
  description TEXT,
  participants TEXT,
  source_id TEXT DEFAULT 'SRC-PEMDES-BRABO',
  status TEXT DEFAULT 'VERIFIED',
  image_url TEXT,
  cover_image TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL: BERITA & WARTA DESA
CREATE TABLE IF NOT EXISTS public.berita_desa (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  author TEXT NOT NULL,
  source_id TEXT DEFAULT 'SRC-PEMDES-BRABO',
  status TEXT DEFAULT 'VERIFIED',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL: PETA & TITIK LOKASI FASILITAS
CREATE TABLE IF NOT EXISTS public.peta_lokasi (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  description TEXT,
  address TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'ACTIVE',
  source_id TEXT DEFAULT 'SRC-GEOSPATIAL-BRABO',
  verification_status TEXT DEFAULT 'VERIFIED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL: KELEMBAGAAN DESA (TP PKK & KARANG TARUNA)
CREATE TABLE IF NOT EXISTS public.kelembagaan_desa (
  id TEXT PRIMARY KEY,
  org_type TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT DEFAULT '2021 - 2026',
  photo_url TEXT,
  contact TEXT,
  status TEXT DEFAULT 'VERIFIED',
  source_id TEXT DEFAULT 'SRC-PEMDES-BRABO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL: FOTO DOKUMENTASI PARTISIPASI WARGA
CREATE TABLE IF NOT EXISTS public.foto_partisipasi_warga (
  id TEXT PRIMARY KEY,
  activity_title TEXT NOT NULL,
  category TEXT NOT NULL,
  uploader_name TEXT NOT NULL,
  uploader_hamlet TEXT,
  uploader_phone TEXT,
  photo_url TEXT NOT NULL,
  caption TEXT,
  taken_date TEXT,
  uploaded_at TEXT,
  file_size_kb INT DEFAULT 0,
  status TEXT DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- KONFIGURASI STORAGE BUCKETS SUPABASE
-- ====================================================================

-- Buat Bucket Publik untuk Dokumen, Aduan, dan Media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('brabo-media', 'brabo-media', true),
  ('brabo-docs', 'brabo-docs', true),
  ('brabo-citizen-photos', 'brabo-citizen-photos', true),
  ('brabo-complaints', 'brabo-complaints', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Aktifkan RLS untuk Storage Objects
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id IN ('brabo-media', 'brabo-docs', 'brabo-citizen-photos', 'brabo-complaints'));
CREATE POLICY "Allow Public Upload Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('brabo-media', 'brabo-docs', 'brabo-citizen-photos', 'brabo-complaints'));
CREATE POLICY "Allow Public Update Media" ON storage.objects FOR UPDATE USING (bucket_id IN ('brabo-media', 'brabo-docs', 'brabo-citizen-photos', 'brabo-complaints'));
CREATE POLICY "Allow Public Delete Media" ON storage.objects FOR DELETE USING (bucket_id IN ('brabo-media', 'brabo-docs', 'brabo-citizen-photos', 'brabo-complaints'));

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) UNTUK SEMUA TABEL
-- ====================================================================

ALTER TABLE public.pamong_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aduan_warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengajuan_dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peta_lokasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelembagaan_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_partisipasi_warga ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik
CREATE POLICY "Public Access Pamong" ON public.pamong_desa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Aduan" ON public.aduan_warga FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Template Dokumen" ON public.template_dokumen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Pengajuan Dokumen" ON public.pengajuan_dokumen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Kegiatan" ON public.kegiatan_desa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Berita" ON public.berita_desa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Peta" ON public.peta_lokasi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Kelembagaan" ON public.kelembagaan_desa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Foto Warga" ON public.foto_partisipasi_warga FOR ALL USING (true) WITH CHECK (true);
`;

