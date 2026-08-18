import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  OfficialPerson, 
  ActivityItem, 
  HamletData, 
  VillageService, 
  VerificationStatus,
  Signatory,
  DocumentTemplate,
  LetterTemplate,
  DocumentSubmission,
  LetterSubmission,
  MapLocation,
  VillageBoundary,
  MediaItem,
  CommunityOrgMember,
  CommunityOrgType,
  CitizenActivityPhoto,
  CitizenComplaint,
  ComplaintStatus
} from '../types';
import { VILLAGE_HEAD, VILLAGE_OFFICIALS } from '../data/research/government';
import { VILLAGE_ACTIVITIES } from '../data/research/activities';
import { HAMLETS_DATA } from '../data/research/hamlets';
import { VILLAGE_SERVICES } from '../data/research/services';
import { INITIAL_SIGNATORIES } from '../data/research/signatories';
import { INITIAL_LETTER_TEMPLATES } from '../data/research/letterTemplates';
import { INITIAL_MAP_LOCATIONS, INITIAL_VILLAGE_BOUNDARY } from '../data/research/mapLocations';
import { INITIAL_MEDIA } from '../data/research/media';
import { INITIAL_COMPLAINTS } from '../data/research/complaints';

export type { 
  DocumentSubmission, 
  LetterSubmission, 
  DocumentTemplate, 
  LetterTemplate, 
  CitizenComplaint, 
  ComplaintStatus 
};

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Pengumuman' | 'Pemerintahan' | 'Pembangunan' | 'Pendidikan' | 'Pertanian' | 'Sosial';
  date: string;
  author: string;
  excerpt: string;
  content: string;
  status: VerificationStatus;
  sourceId: string;
  imageUrl?: string;
  featured?: boolean;
}

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Peluncuran Website Digital & Basis Riset Terbuka Desa Brabo oleh Tim KKN',
    category: 'Pengumuman',
    date: '15 Agustus 2024',
    author: 'Tim KKN & Humas Desa',
    excerpt: 'Inisiatif digitalisasi desa yang menyajikan data sejarah babad, SOTK pamong desa, direktori lembaga pendidikan, dan pelayanan surat mandiri.',
    content: 'Website Desa Brabo ini dibangun dengan prinsip transparansi data riset berbasis standar OpenSID. Warga dapat mengakses informasi profil desa, data kependudukan BPS, serta memanfaatkan sistem pengajuan surat pengantar secara mandiri dan transparan.',
    status: 'VERIFIED',
    sourceId: 'SRC-PEMKAB-GROB',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-2',
    title: 'Haul Akbar Pendiri & Pengasuh Pondok Pesantren Sirojuth Tholibin Brabo',
    category: 'Pendidikan',
    date: '28 Juli 2024',
    author: 'Keluarga Besar PP Sirojuth Tholibin',
    excerpt: 'Ribuan alumni santri dari berbagai daerah menghadiri peringatan Haul KH. Siraj & KH. Ahmad Syamsuri di kompleks pesantren Dusun Krajan.',
    content: 'Pondok Pesantren Sirojuth Tholibin Brabo menyelenggarakan Haul Akbar yang dihadiri para masyaikh, tokoh ulama, serta alumni dan wali santri. Kegiatan ini sekaligus mempererat silaturahmi antarwarga desa dan memperkokoh tradisi keilmuan Islam ala Ahlussunnah wal Jamaah.',
    status: 'VERIFIED',
    sourceId: 'SRC-YAYASAN-TAJUL-ULUM',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-3',
    title: 'Gotong Royong Normalisasi Saluran Irigasi Tersier Pertanian Dusun Cangkring',
    category: 'Pertanian',
    date: '10 Juli 2024',
    author: 'Gabungan Kelompok Tani (Gapoktan)',
    excerpt: 'Warga petani bergotong royong membersihkan sedimentasi saluran air guna mengoptimalkan pasokan air bagi lahan persawahan padi dan palawija.',
    content: 'Menjelang musim tanam, para petani Dusun Cangkring menggelar gotong royong bersama untuk memastikan aliran air irigasi berjalan lancar. Kegiatan ini dipandu oleh ketua kelompok tani dan dihadiri puluhan warga petani desa.',
    status: 'SUPPORTED',
    sourceId: 'SRC-BABAD-LOKAL',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-4',
    title: 'Pelayanan Posyandu Balita & Lansia Rutin di Seluruh Pos Dusun Desa Brabo',
    category: 'Sosial',
    date: '05 Juli 2024',
    author: 'Kader Posyandu & Bidan Desa',
    excerpt: 'Pemeriksaan tumbuh kembang anak, penimbangan berat badan, imunisasi rutin, dan pemeriksaan tensi darah lansia secara gratis.',
    content: 'Kegiatan posyandu berkala dilaksanakan di Pos Dusun Dukoh, Krajan, dan Cangkring didampingi Bidan Desa. Program ini bertujuan mencegah stunting pada anak dan memantau kesehatan warga lanjut usia.',
    status: 'SUPPORTED',
    sourceId: 'SRC-PEMKAB-GROB',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
  }
];

const INITIAL_SUBMISSIONS: LetterSubmission[] = [
  {
    id: 'sub-1',
    trackingCode: 'BRB-782190',
    templateId: 'TPL-SKU',
    templateCode: 'SKU',
    serviceName: 'Surat Keterangan Usaha (SKU)',
    nik: '3315170204910001',
    fullName: 'Slamet Riyadi',
    gender: 'Laki-laki',
    placeOfBirth: 'Grobogan',
    dateOfBirth: '1991-04-02',
    religion: 'Islam',
    occupation: 'Wiraswasta',
    hamlet: 'Dusun Krajan',
    rt: '02',
    rw: '01',
    purpose: 'Kelengkapan administrasi pengajuan KUR Bank BRI Unit Tanggungharjo',
    businessName: 'Toko Berkah Hasil Tani',
    businessType: 'Perdagangan Pupuk & Hasil Bumi',
    selectedSignatoryIds: ['SIG-KADES'],
    status: 'SELESAI_SIAP_AMBIL',
    submittedAt: '14 Agustus 2024, 09:30 WIB',
    notes: 'Surat telah ditandatangani Kepala Desa dan dibubuhi stempel resmi.',
    customLetterNumber: '510 / 084 / SKU-Brb / VIII / 2024',
  },
  {
    id: 'sub-2',
    trackingCode: 'BRB-419823',
    templateId: 'TPL-SKTM',
    templateCode: 'SKTM',
    serviceName: 'Surat Keterangan Tidak Mampu (SKTM)',
    nik: '3315175510020003',
    fullName: 'Nurul Hidayah',
    gender: 'Perempuan',
    placeOfBirth: 'Grobogan',
    dateOfBirth: '2002-10-15',
    religion: 'Islam',
    occupation: 'Pelajar / Santri',
    hamlet: 'Dusun Dukoh',
    rt: '01',
    rw: '02',
    purpose: 'Pengajuan beasiswa santri berprestasi di Perguruan Tinggi',
    selectedSignatoryIds: ['SIG-KADUS-1', 'SIG-KADES'],
    status: 'DIPROSES',
    submittedAt: '15 Agustus 2024, 11:15 WIB',
    notes: 'Berkas sedang diverifikasi oleh Kasi Kesejahteraan.',
    customLetterNumber: '401 / 112 / SKTM-Brb / VIII / 2024',
  }
];

const STORAGE_KEY = 'brabo_portal_state_v4';

interface VillageDataContextType {
  // Village Head & Officials
  villageHead: OfficialPerson;
  officials: OfficialPerson[];
  updateOfficial: (id: string, updated: Partial<OfficialPerson>) => void;
  addOfficial: (official: Omit<OfficialPerson, 'id'>) => void;
  deleteOfficial: (id: string) => void;
  updateVillageHead: (updated: Partial<OfficialPerson>) => void;

  // News & Announcements
  news: NewsArticle[];
  addNews: (item: Omit<NewsArticle, 'id'>) => void;
  updateNews: (id: string, updated: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;

  // Activities / Agenda
  activities: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, 'id'>) => void;
  updateActivity: (id: string, updated: Partial<ActivityItem>) => void;
  deleteActivity: (id: string) => void;

  // Hamlets Data
  hamlets: HamletData[];
  updateHamletHead: (hamletId: string, headName: string, status?: VerificationStatus) => void;

  // Signatories
  signatories: Signatory[];
  addSignatory: (sig: Omit<Signatory, 'id'>) => void;
  updateSignatory: (id: string, updated: Partial<Signatory>) => void;
  deleteSignatory: (id: string) => void;

  // Letter Templates (Document Formats)
  letterTemplates: DocumentTemplate[];
  addLetterTemplate: (tpl: Omit<DocumentTemplate, 'id'>) => void;
  updateLetterTemplate: (id: string, updated: Partial<DocumentTemplate>) => void;
  duplicateLetterTemplate: (id: string) => void;
  deleteLetterTemplate: (id: string) => void;

  // Map Locations & Boundary
  mapLocations: MapLocation[];
  addMapLocation: (loc: Omit<MapLocation, 'id'>) => void;
  updateMapLocation: (id: string, updated: Partial<MapLocation>) => void;
  deleteMapLocation: (id: string) => void;
  villageBoundary: VillageBoundary;
  updateVillageBoundary: (updated: Partial<VillageBoundary>) => void;

  // Media Library
  mediaList: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;

  // Citizen Letter & Document Submissions
  submissions: LetterSubmission[];
  submitLetter: (submissionData: Omit<LetterSubmission, 'id' | 'trackingCode' | 'submittedAt' | 'status'>) => LetterSubmission;
  updateSubmissionStatus: (id: string, status: LetterSubmission['status'], notes?: string, customLetterNumber?: string, pickupSchedule?: string) => void;
  deleteSubmission: (id: string) => void;

  // Citizen Complaints & Reports (Aduan / Lapor Warga)
  complaints: CitizenComplaint[];
  submitComplaint: (complaintData: Omit<CitizenComplaint, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'status'>) => CitizenComplaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, adminResponse?: string, officerInCharge?: string) => void;
  deleteComplaint: (id: string) => void;

  // Lembaga Kemasyarakatan Desa (PKK & Karang Taruna)
  pkkMembers: CommunityOrgMember[];
  karangTarunaMembers: CommunityOrgMember[];
  addCommunityMember: (item: Omit<CommunityOrgMember, 'id'>) => void;
  updateCommunityMember: (id: string, updated: Partial<CommunityOrgMember>) => void;
  deleteCommunityMember: (id: string) => void;

  // Citizen Activity Photos (Dokumentasi Partisipasi Warga)
  citizenPhotos: CitizenActivityPhoto[];
  addCitizenPhoto: (photo: Omit<CitizenActivityPhoto, 'id' | 'uploadedAt'>) => CitizenActivityPhoto;
  updateCitizenPhotoStatus: (id: string, status: CitizenActivityPhoto['status']) => void;
  deleteCitizenPhoto: (id: string) => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
}

const VillageDataContext = createContext<VillageDataContextType | undefined>(undefined);

export const VillageDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [villageHead, setVillageHead] = useState<OfficialPerson>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_kades`);
      return saved ? JSON.parse(saved) : VILLAGE_HEAD;
    } catch {
      return VILLAGE_HEAD;
    }
  });

  const [officials, setOfficials] = useState<OfficialPerson[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_officials`);
      return saved ? JSON.parse(saved) : VILLAGE_OFFICIALS;
    } catch {
      return VILLAGE_OFFICIALS;
    }
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_news`);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : VILLAGE_ACTIVITIES;
    } catch {
      return VILLAGE_ACTIVITIES;
    }
  });

  const [hamlets, setHamlets] = useState<HamletData[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hamlets`);
      return saved ? JSON.parse(saved) : HAMLETS_DATA;
    } catch {
      return HAMLETS_DATA;
    }
  });

  const [signatories, setSignatories] = useState<Signatory[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_signatories`);
      return saved ? JSON.parse(saved) : INITIAL_SIGNATORIES;
    } catch {
      return INITIAL_SIGNATORIES;
    }
  });

  const [letterTemplates, setLetterTemplates] = useState<LetterTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_letterTemplates`);
      return saved ? JSON.parse(saved) : INITIAL_LETTER_TEMPLATES;
    } catch {
      return INITIAL_LETTER_TEMPLATES;
    }
  });

  const [mapLocations, setMapLocations] = useState<MapLocation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mapLocations`);
      return saved ? JSON.parse(saved) : INITIAL_MAP_LOCATIONS;
    } catch {
      return INITIAL_MAP_LOCATIONS;
    }
  });

  const [villageBoundary, setVillageBoundary] = useState<VillageBoundary>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_villageBoundary`);
      return saved ? JSON.parse(saved) : INITIAL_VILLAGE_BOUNDARY;
    } catch {
      return INITIAL_VILLAGE_BOUNDARY;
    }
  });

  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mediaList`);
      return saved ? JSON.parse(saved) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const [submissions, setSubmissions] = useState<LetterSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  // PKK & Karang Taruna (Empty state initially as requested, admin can fill)
  const [pkkMembers, setPkkMembers] = useState<CommunityOrgMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pkk`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [karangTarunaMembers, setKarangTarunaMembers] = useState<CommunityOrgMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_karang_taruna`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Citizen Activity Photos (Dokumentasi Partisipasi Warga)
  const [citizenPhotos, setCitizenPhotos] = useState<CitizenActivityPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_citizen_photos`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Citizen Complaints & Aspirations (Aduan / Lapor Masyarakat)
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_kades`, JSON.stringify(villageHead));
      localStorage.setItem(`${STORAGE_KEY}_officials`, JSON.stringify(officials));
      localStorage.setItem(`${STORAGE_KEY}_news`, JSON.stringify(news));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_hamlets`, JSON.stringify(hamlets));
      localStorage.setItem(`${STORAGE_KEY}_signatories`, JSON.stringify(signatories));
      localStorage.setItem(`${STORAGE_KEY}_letterTemplates`, JSON.stringify(letterTemplates));
      localStorage.setItem(`${STORAGE_KEY}_mapLocations`, JSON.stringify(mapLocations));
      localStorage.setItem(`${STORAGE_KEY}_villageBoundary`, JSON.stringify(villageBoundary));
      localStorage.setItem(`${STORAGE_KEY}_mediaList`, JSON.stringify(mediaList));
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
      localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
      localStorage.setItem(`${STORAGE_KEY}_pkk`, JSON.stringify(pkkMembers));
      localStorage.setItem(`${STORAGE_KEY}_karang_taruna`, JSON.stringify(karangTarunaMembers));
      localStorage.setItem(`${STORAGE_KEY}_citizen_photos`, JSON.stringify(citizenPhotos));
    } catch (e) {
      console.error('Failed saving to localStorage:', e);
    }
  }, [
    villageHead,
    officials,
    news,
    activities,
    hamlets,
    signatories,
    letterTemplates,
    mapLocations,
    villageBoundary,
    mediaList,
    submissions,
    complaints,
    pkkMembers,
    karangTarunaMembers,
    citizenPhotos,
  ]);

  // Officials handlers
  const updateOfficial = (id: string, updated: Partial<OfficialPerson>) => {
    setOfficials(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const addOfficial = (official: Omit<OfficialPerson, 'id'>) => {
    const newId = `GOV-${Date.now()}`;
    setOfficials(prev => [...prev, { ...official, id: newId }]);
  };

  const deleteOfficial = (id: string) => {
    setOfficials(prev => prev.filter(item => item.id !== id));
  };

  const updateVillageHead = (updated: Partial<OfficialPerson>) => {
    setVillageHead(prev => ({ ...prev, ...updated }));
  };

  // News handlers
  const addNews = (item: Omit<NewsArticle, 'id'>) => {
    const newItem: NewsArticle = {
      ...item,
      id: `news-${Date.now()}`,
    };
    setNews(prev => [newItem, ...prev]);
  };

  const updateNews = (id: string, updated: Partial<NewsArticle>) => {
    setNews(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  // Activities handlers
  const addActivity = (item: Omit<ActivityItem, 'id'>) => {
    const newId = `ACT-${Date.now()}`;
    const newAct: ActivityItem = {
      ...item,
      id: newId,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updated: Partial<ActivityItem>) => {
    setActivities(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(item => item.id !== id));
  };

  // Hamlet Head handler
  const updateHamletHead = (hamletId: string, headName: string, status: VerificationStatus = 'VERIFIED') => {
    setHamlets(prev =>
      prev.map(h => {
        if (h.id === hamletId) {
          return {
            ...h,
            headName: headName || 'Data belum diverifikasi',
            headStatus: headName ? status : 'REQUIRES_VERIFICATION',
          };
        }
        return h;
      })
    );
  };

  // Signatory handlers
  const addSignatory = (sig: Omit<Signatory, 'id'>) => {
    const newId = `SIG-${Date.now()}`;
    setSignatories(prev => [...prev, { ...sig, id: newId }]);
  };

  const updateSignatory = (id: string, updated: Partial<Signatory>) => {
    setSignatories(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSignatory = (id: string) => {
    setSignatories(prev => prev.filter(s => s.id !== id));
  };

  // Letter Template handlers
  const addLetterTemplate = (tpl: Omit<LetterTemplate, 'id'>) => {
    const newId = `TPL-${Date.now()}`;
    setLetterTemplates(prev => [...prev, { ...tpl, id: newId }]);
  };

  const updateLetterTemplate = (id: string, updated: Partial<LetterTemplate>) => {
    setLetterTemplates(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const duplicateLetterTemplate = (id: string) => {
    const found = letterTemplates.find(t => t.id === id);
    if (!found) return;
    const duplicated: LetterTemplate = {
      ...found,
      id: `TPL-${Date.now()}`,
      name: `${found.name} (Salinan)`,
      code: `${found.code}-COPY`,
    };
    setLetterTemplates(prev => [...prev, duplicated]);
  };

  const deleteLetterTemplate = (id: string) => {
    setLetterTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Map Location handlers
  const addMapLocation = (loc: Omit<MapLocation, 'id'>) => {
    const newId = `LOC-${Date.now()}`;
    setMapLocations(prev => [...prev, { ...loc, id: newId }]);
  };

  const updateMapLocation = (id: string, updated: Partial<MapLocation>) => {
    setMapLocations(prev => prev.map(l => (l.id === id ? { ...l, ...updated } : l)));
  };

  const deleteMapLocation = (id: string) => {
    setMapLocations(prev => prev.filter(l => l.id !== id));
  };

  const updateVillageBoundary = (updated: Partial<VillageBoundary>) => {
    setVillageBoundary(prev => ({ ...prev, ...updated }));
  };

  // Media Library handlers
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem => {
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const newMedia: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadedAt: dateStr,
    };
    setMediaList(prev => [newMedia, ...prev]);
    return newMedia;
  };

  const deleteMediaItem = (id: string) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  // Submissions handlers
  const submitLetter = (data: Omit<LetterSubmission, 'id' | 'trackingCode' | 'submittedAt' | 'status'>): LetterSubmission => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `BRB-${randomNumber}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newSub: LetterSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      trackingCode,
      submittedAt: `${dateStr} WIB`,
      status: 'MENUNGGU_VERIFIKASI',
      notes: 'Permohonan surat mandiri telah tercatat di sistem antrean desa.',
    };

    setSubmissions(prev => [newSub, ...prev]);
    return newSub;
  };

  const updateSubmissionStatus = (id: string, status: LetterSubmission['status'], notes?: string, customLetterNumber?: string, pickupSchedule?: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { 
        ...s, 
        status, 
        notes: notes || s.notes,
        customLetterNumber: customLetterNumber !== undefined ? customLetterNumber : s.customLetterNumber,
        pickupSchedule: pickupSchedule !== undefined ? pickupSchedule : s.pickupSchedule
      } : s))
    );
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  // Citizen Complaints & Aspirations (Aduan Warga)
  const submitComplaint = (data: Omit<CitizenComplaint, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'status'>): CitizenComplaint => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `ADU-${randomCode}`;
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newComplaint: CitizenComplaint = {
      ...data,
      id: `adu-${Date.now()}`,
      trackingCode,
      createdAt: `${dateStr} WIB`,
      updatedAt: `${dateStr} WIB`,
      status: 'MENUNGGU_VERIFIKASI',
      officerInCharge: 'Petugas Pelayanan & Aparat Desa',
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, adminResponse?: string, officerInCharge?: string) => {
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setComplaints(prev =>
      prev.map(c => (c.id === id ? {
        ...c,
        status,
        updatedAt: `${dateStr} WIB`,
        adminResponse: adminResponse !== undefined ? adminResponse : c.adminResponse,
        adminResponseDate: adminResponse ? `${dateStr} WIB` : c.adminResponseDate,
        officerInCharge: officerInCharge || c.officerInCharge,
      } : c))
    );
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  // Community Org Members (PKK & Karang Taruna)
  const addCommunityMember = (item: Omit<CommunityOrgMember, 'id'>) => {
    const newItem: CommunityOrgMember = {
      ...item,
      id: `COMM-${item.orgType}-${Date.now()}`,
    };
    if (item.orgType === 'PKK') {
      setPkkMembers(prev => [...prev, newItem]);
    } else {
      setKarangTarunaMembers(prev => [...prev, newItem]);
    }
  };

  const updateCommunityMember = (id: string, updated: Partial<CommunityOrgMember>) => {
    setPkkMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));
    setKarangTarunaMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteCommunityMember = (id: string) => {
    setPkkMembers(prev => prev.filter(m => m.id !== id));
    setKarangTarunaMembers(prev => prev.filter(m => m.id !== id));
  };

  // Citizen Activity Photos
  const addCitizenPhoto = (photo: Omit<CitizenActivityPhoto, 'id' | 'uploadedAt'>): CitizenActivityPhoto => {
    const newPhoto: CitizenActivityPhoto = {
      ...photo,
      id: `PHOTO-${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setCitizenPhotos(prev => [newPhoto, ...prev]);
    return newPhoto;
  };

  const updateCitizenPhotoStatus = (id: string, status: CitizenActivityPhoto['status']) => {
    setCitizenPhotos(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const deleteCitizenPhoto = (id: string) => {
    setCitizenPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setVillageHead(VILLAGE_HEAD);
    setOfficials(VILLAGE_OFFICIALS);
    setNews(INITIAL_NEWS);
    setActivities(VILLAGE_ACTIVITIES);
    setHamlets(HAMLETS_DATA);
    setSignatories(INITIAL_SIGNATORIES);
    setLetterTemplates(INITIAL_LETTER_TEMPLATES);
    setMapLocations(INITIAL_MAP_LOCATIONS);
    setVillageBoundary(INITIAL_VILLAGE_BOUNDARY);
    setMediaList(INITIAL_MEDIA);
    setSubmissions(INITIAL_SUBMISSIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setPkkMembers([]);
    setKarangTarunaMembers([]);
    setCitizenPhotos([]);
    localStorage.clear();
  };

  const exportJSON = () => {
    const payload = {
      villageHead,
      officials,
      news,
      activities,
      hamlets,
      signatories,
      letterTemplates,
      mapLocations,
      villageBoundary,
      mediaList,
      submissions,
      complaints,
      pkkMembers,
      karangTarunaMembers,
      citizenPhotos,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.officials && Array.isArray(parsed.officials)) setOfficials(parsed.officials);
      if (parsed.villageHead) setVillageHead(parsed.villageHead);
      if (parsed.news && Array.isArray(parsed.news)) setNews(parsed.news);
      if (parsed.activities && Array.isArray(parsed.activities)) setActivities(parsed.activities);
      if (parsed.hamlets && Array.isArray(parsed.hamlets)) setHamlets(parsed.hamlets);
      if (parsed.signatories && Array.isArray(parsed.signatories)) setSignatories(parsed.signatories);
      if (parsed.letterTemplates && Array.isArray(parsed.letterTemplates)) setLetterTemplates(parsed.letterTemplates);
      if (parsed.mapLocations && Array.isArray(parsed.mapLocations)) setMapLocations(parsed.mapLocations);
      if (parsed.villageBoundary) setVillageBoundary(parsed.villageBoundary);
      if (parsed.mediaList && Array.isArray(parsed.mediaList)) setMediaList(parsed.mediaList);
      if (parsed.submissions && Array.isArray(parsed.submissions)) setSubmissions(parsed.submissions);
      if (parsed.complaints && Array.isArray(parsed.complaints)) setComplaints(parsed.complaints);
      if (parsed.pkkMembers && Array.isArray(parsed.pkkMembers)) setPkkMembers(parsed.pkkMembers);
      if (parsed.karangTarunaMembers && Array.isArray(parsed.karangTarunaMembers)) setKarangTarunaMembers(parsed.karangTarunaMembers);
      if (parsed.citizenPhotos && Array.isArray(parsed.citizenPhotos)) setCitizenPhotos(parsed.citizenPhotos);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  return (
    <VillageDataContext.Provider
      value={{
        villageHead,
        officials,
        updateOfficial,
        addOfficial,
        deleteOfficial,
        updateVillageHead,
        news,
        addNews,
        updateNews,
        deleteNews,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        hamlets,
        updateHamletHead,
        signatories,
        addSignatory,
        updateSignatory,
        deleteSignatory,
        letterTemplates,
        addLetterTemplate,
        updateLetterTemplate,
        duplicateLetterTemplate,
        deleteLetterTemplate,
        mapLocations,
        addMapLocation,
        updateMapLocation,
        deleteMapLocation,
        villageBoundary,
        updateVillageBoundary,
        mediaList,
        addMediaItem,
        deleteMediaItem,
        submissions,
        submitLetter,
        updateSubmissionStatus,
        deleteSubmission,
        complaints,
        submitComplaint,
        updateComplaintStatus,
        deleteComplaint,
        pkkMembers,
        karangTarunaMembers,
        addCommunityMember,
        updateCommunityMember,
        deleteCommunityMember,
        citizenPhotos,
        addCitizenPhoto,
        updateCitizenPhotoStatus,
        deleteCitizenPhoto,
        resetToDefaults,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </VillageDataContext.Provider>
  );
};

export const useVillageData = () => {
  const context = useContext(VillageDataContext);
  if (!context) {
    throw new Error('useVillageData must be used within a VillageDataProvider');
  }
  return context;
};
