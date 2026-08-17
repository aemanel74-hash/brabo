import { VerificationStatus } from '../../types';

export interface VillageProfileData {
  name: string;
  officialStatus: string;
  nickname: string;
  regency: string;
  district: string;
  province: string;
  postalCode: string;
  areaHa: number;
  areaKm2: number;
  kemendagriCode: string;
  boundaries: {
    north: string;
    east: string;
    south: string;
    west: string;
  };
  rtCount: number;
  rwCount: number;
  hamletCount: number;
  vision: {
    text: string;
    sourceId: string;
    status: VerificationStatus;
  };
  missions: {
    items: string[];
    sourceId: string;
    status: VerificationStatus;
  };
  geographicNote: string;
  sourceId: string;
  status: VerificationStatus;
}

export const VILLAGE_PROFILE: VillageProfileData = {
  name: 'Desa Brabo',
  officialStatus: 'Desa Definitif',
  nickname: 'Kampung Santri / Desa Seribu Pesantren',
  regency: 'Kabupaten Grobogan',
  district: 'Kecamatan Tanggungharjo',
  province: 'Jawa Tengah',
  postalCode: '58166',
  areaHa: 456.97,
  areaKm2: 4.57,
  kemendagriCode: '33.15.17.2007',
  boundaries: {
    north: 'Desa Kebonagung (Kec. Tegowanu / Kab. Demak)',
    east: 'Desa Tanggungharjo',
    south: 'Wilayah Kabupaten Demak',
    west: 'Desa Padang',
  },
  rtCount: 32,
  rwCount: 4,
  hamletCount: 3,
  vision: {
    text: 'Mewujudkan Desa Brabo yang Religius, Maju, Mandiri, Berkeadilan, dan Sejahtera Berlandaskan Nilai-Nilai Keagamaan dan Gotong Royong.',
    sourceId: 'SRC-KKN-UNVERIFIED',
    status: 'REQUIRES_VERIFICATION',
  },
  missions: {
    items: [
      'Meningkatkan tata kelola pemerintahan desa yang transparan, akuntabel, dan responsif terhadap kebutuhan warga.',
      'Memperkuat identitas Desa Brabo sebagai pusat pendidikan karakter dan keagamaan berbasis pesantren yang inklusif.',
      'Mendorong optimalisasi produktivitas pertanian pangan, tembakau, jagung, serta ketahanan pangan rumah tangga.',
      'Mengembangkan UMKM lokal, koperasi pesantren, dan peluang ekonomi kreatif bagi generasi muda desa.',
      'Meningkatkan kualitas infrastruktur desa, sanitasi, dan layanan dasar kesehatan Posyandu secara merata di 3 dusun.',
    ],
    sourceId: 'SRC-KKN-UNVERIFIED',
    status: 'REQUIRES_VERIFICATION',
  },
  geographicNote: 'Terletak di dataran rendah bagian barat Kabupaten Grobogan yang berbatasan langsung dengan Kabupaten Demak. Topografi didominasi oleh lahan persawahan irigasi teknis/tadah hujan dan kawasan pemukiman religius.',
  sourceId: 'SRC-PEMKAB-GROB',
  status: 'VERIFIED',
};
