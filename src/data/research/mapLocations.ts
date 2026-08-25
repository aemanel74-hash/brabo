import { MapLocation, VillageBoundary } from '../../types';

export interface HamletBoundary {
  id: string;
  name: string;
  color: string;
  fillColor: string;
  center: [number, number];
  coordinates: [number, number][];
}

export const HAMLET_BOUNDARIES: HamletBoundary[] = [
  {
    id: 'HAMLET-DUKOH',
    name: 'Dusun I Dukoh (Utara & Barat Laut)',
    color: '#059669', // emerald
    fillColor: '#10b981',
    center: [-7.0858, 110.5745],
    coordinates: [
      [-7.0832, 110.5736],
      [-7.0842, 110.5755],
      [-7.0848, 110.5780],
      [-7.0875, 110.5775],
      [-7.0870, 110.5730],
      [-7.0855, 110.5728],
      [-7.0832, 110.5736]
    ]
  },
  {
    id: 'HAMLET-KRAJAN',
    name: 'Dusun II Krajan (Sentral Desa & Kompleks Pesantren)',
    color: '#2563eb', // blue
    fillColor: '#3b82f6',
    center: [-7.090589, 110.577245],
    coordinates: [
      [-7.0870, 110.5730],
      [-7.0875, 110.5775],
      [-7.0854, 110.5810],
      [-7.0862, 110.5836],
      [-7.0898, 110.5824],
      [-7.0935, 110.5808],
      [-7.0945, 110.5726],
      [-7.0912, 110.5724],
      [-7.0880, 110.5726],
      [-7.0870, 110.5730]
    ]
  },
  {
    id: 'HAMLET-CANGKRING',
    name: 'Dusun III Cangkring (Selatan & Pertanian)',
    color: '#d97706', // amber
    fillColor: '#f59e0b',
    center: [-7.0995, 110.5775],
    coordinates: [
      [-7.0945, 110.5726],
      [-7.0935, 110.5808],
      [-7.0958, 110.5802],
      [-7.0982, 110.5798],
      [-7.1008, 110.5796],
      [-7.1032, 110.5795],
      [-7.1045, 110.5790],
      [-7.1042, 110.5772],
      [-7.1028, 110.5756],
      [-7.1005, 110.5742],
      [-7.0978, 110.5732],
      [-7.0945, 110.5726]
    ]
  }
];

export const INITIAL_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'LOC-BALAI-DESA',
    name: 'Kantor Balai Desa Brabo',
    category: 'Kantor Desa',
    lat: -7.090589,
    lng: 110.577245,
    description: 'Pusat pelayanan administrasi kependudukan, balai pertemuan musyawarah warga, dan kantor Kepala Desa Brabo.',
    address: 'Jl. Raya Brabo - Tanggungharjo, Dusun Krajan',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
    photoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'LOC-DUSUN-DUKOH',
    name: 'Dusun I Dukoh (Situs Petilasan Merapi)',
    category: 'Dusun',
    lat: -7.085800,
    lng: 110.574500,
    description: 'Dusun pemukiman awal babad Tidjoyo dengan makam/situs Merapi dan persawahan subur, berbatasan dengan Desa Padang di barat.',
    address: 'Wilayah Dusun I Dukoh, Bagian Barat Laut Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-DUSUN-KRAJAN',
    name: 'Dusun II Krajan (Sentral Desa & Pesantren)',
    category: 'Dusun',
    lat: -7.090589,
    lng: 110.577245,
    description: 'Jantung desa, lokasi Balai Desa Brabo, Kompleks Pesantren Sirojuth Tholibin, dan pertokoan sentral santri.',
    address: 'Wilayah Dusun II Krajan, Pusat Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-DUSUN-CANGKRING',
    name: 'Dusun III Cangkring (Lumbung Tani)',
    category: 'Dusun',
    lat: -7.099500,
    lng: 110.577500,
    description: 'Hamparan lahan pertanian agraris penghasil komoditas padi, tembakau rajangan, dan jagung hibrida binaan Gapoktan.',
    address: 'Wilayah Dusun III Cangkring, Bagian Selatan Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-PESANTREN-SIROJUTH',
    name: 'Pondok Pesantren Sirojuth Tholibin',
    category: 'Tempat Ibadah',
    lat: -7.088600,
    lng: 110.574800,
    description: 'Pesantren salaf terkemuka berdiri sejak 1941 oleh KH. Siraj & KH. Ahmad Syamsuri dengan ribuan santri dari seluruh penjuru nusantara.',
    address: 'Kompleks Pesantren, Dusun Krajan',
    status: 'ACTIVE',
    sourceId: 'SRC-YAYASAN-TAJUL-ULUM',
    verificationStatus: 'VERIFIED',
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'LOC-PESANTREN-ANNASRIYYAH',
    name: 'Pondok Pesantren Annasriyyah',
    category: 'Tempat Ibadah',
    lat: -7.089400,
    lng: 110.576200,
    description: 'Lembaga pondok pesantren kajian kitab kuning dan tahfidzul quran asuhan masyayikh Desa Brabo.',
    address: 'Dusun Krajan, Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-YAYASAN-TAJUL-ULUM',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-MA-TAJUL-ULUM',
    name: 'Perguruan Islam Tajul Ulum (MTs / MA)',
    category: 'Sekolah',
    lat: -7.089800,
    lng: 110.575800,
    description: 'Lembaga pendidikan formal madrasah terakreditasi A di bawah naungan Yayasan Tajul Ulum.',
    address: 'Jl. Raya Brabo, Dusun Krajan',
    status: 'ACTIVE',
    sourceId: 'SRC-KEMENDIKBUD',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-SDN1-BRABO',
    name: 'SD Negeri 1 Brabo (Est. 1938)',
    category: 'Sekolah',
    lat: -7.090800,
    lng: 110.576900,
    description: 'Sekolah dasar negeri tertua di Desa Brabo yang beroperasi sejak era pra-kemerdekaan RI (NPSN: 20314115).',
    address: 'Dusun Krajan, Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-KEMENDIKBUD',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-SDN2-BRABO',
    name: 'SD Negeri 2 Brabo',
    category: 'Sekolah',
    lat: -7.085500,
    lng: 110.574200,
    description: 'Sekolah dasar negeri yang melayani zonasi pendidikan warga Dusun Dukoh (NPSN: 20314116).',
    address: 'Dusun Dukoh, Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-KEMENDIKBUD',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-SDN3-BRABO',
    name: 'SD Negeri 3 Brabo',
    category: 'Sekolah',
    lat: -7.098500,
    lng: 110.577800,
    description: 'Sekolah dasar negeri yang melayani zonasi pendidikan warga Dusun Cangkring (NPSN: 20314117).',
    address: 'Dusun Cangkring, Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-KEMENDIKBUD',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-POSKESDES',
    name: 'Pos Kesehatan Desa (PKD) & Posyandu',
    category: 'Kesehatan',
    lat: -7.090700,
    lng: 110.577400,
    description: 'Fasilitas kesehatan tingkat pertama bidan desa, imunisasi balita, dan penimbangan balita & lansia berkala.',
    address: 'Kompleks Balai Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-MASJID-JAMI',
    name: 'Masjid Jami’ Desa Brabo',
    category: 'Tempat Ibadah',
    lat: -7.090100,
    lng: 110.576500,
    description: 'Pusat ibadah shalat Jumat, pengajian akbar warga desa, dan kajian keislaman santri.',
    address: 'Dusun Krajan, Desa Brabo',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'LOC-LUMBUNG-TANI',
    name: 'Kawasan Pertanian Subur Gapoktan Brabo',
    category: 'Pertanian',
    lat: -7.096500,
    lng: 110.578500,
    description: 'Hamparan persawahan teknis padi dan palawija binaan Gabungan Kelompok Tani Desa Brabo.',
    address: 'Kawasan Persawahan Dusun Cangkring & Dukoh',
    status: 'ACTIVE',
    sourceId: 'SRC-PEMKAB-GROB',
    verificationStatus: 'VERIFIED',
  }
];

export const INITIAL_VILLAGE_BOUNDARY: VillageBoundary = {
  id: 'BND-BRABO',
  name: 'Batas Wilayah Administrasi Desa Brabo',
  sourceName: 'Peta Geospasial Desa Brabo (BIG & Google Maps)',
  sourceUrl: 'https://geoportal.big.go.id',
  verificationStatus: 'VERIFIED',
  isActive: true,
  lastVerified: '2026',
  coordinates: [
    [-7.0832, 110.5736], // Puncak Barat Laut (Ujung Utara Krajan/Dukoh)
    [-7.0842, 110.5755],
    [-7.0848, 110.5780],
    [-7.0854, 110.5810],
    [-7.0862, 110.5836], // Sudut Timur Laut (Batas Utara Kebonagung)
    [-7.0880, 110.5830], // Turun ke Selatan (Batas Barat Dusun Ngethuk)
    [-7.0898, 110.5824],
    [-7.0915, 110.5818],
    [-7.0935, 110.5808], // Lekukan sebelah barat Maskur (luar batas)
    [-7.0958, 110.5802],
    [-7.0982, 110.5798],
    [-7.1008, 110.5796],
    [-7.1032, 110.5795], // Koridor Selatan Dusun Cangkring
    [-7.1045, 110.5790], // Ujung Tenggara Selatan
    [-7.1042, 110.5772], // Batas Selatan Bawah
    [-7.1028, 110.5756], // Menikung ke Barat Daya
    [-7.1005, 110.5742],
    [-7.0978, 110.5732], // Batas Barat berbatasan dengan Desa Padang
    [-7.0945, 110.5726],
    [-7.0912, 110.5724], // Barat Kompleks Krajan & Pesantren
    [-7.0880, 110.5726], // Barat PP Sirojuth Tholibin
    [-7.0855, 110.5728], // Barat Dukoh
    [-7.0832, 110.5736]  // Kembali ke Puncak Barat Laut
  ]
};
