import { DemographicStat } from '../../types';

export const DEMOGRAPHIC_STATS: DemographicStat[] = [
  {
    label: 'Total Jumlah Penduduk',
    value: '5.244',
    unit: 'Jiwa',
    year: '2020 (BPS/Pemkab)',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'VERIFIED',
    description: 'Desa Brabo merupakan desa dengan kepadatan penduduk tertinggi ke-2 di wilayah Kecamatan Tanggungharjo.',
  },
  {
    label: 'Penduduk Laki-Laki',
    value: '2.647',
    unit: 'Jiwa (50,48%)',
    year: '2020',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'VERIFIED',
  },
  {
    label: 'Penduduk Perempuan',
    value: '2.597',
    unit: 'Jiwa (49,52%)',
    year: '2020',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'VERIFIED',
  },
  {
    label: 'Luas Wilayah',
    value: '456,97',
    unit: 'Hektar (4,57 km²)',
    year: '2022',
    sourceId: 'SRC-BPS-2022',
    status: 'VERIFIED',
  },
  {
    label: 'Kepadatan Penduduk',
    value: '1.147',
    unit: 'Jiwa / km²',
    year: '2020',
    sourceId: 'SRC-BPS-2022',
    status: 'VERIFIED',
  },
  {
    label: 'Pembagian Kewilayahan',
    value: '3 Dusun / 4 RW / 32 RT',
    unit: 'Wilayah',
    year: '2022',
    sourceId: 'SRC-BPS-2022',
    status: 'VERIFIED',
  },
  {
    label: 'Komposisi Agama',
    value: '100%',
    unit: 'Islam',
    year: '2020',
    sourceId: 'SRC-BPS-2022',
    status: 'SUPPORTED',
  },
  {
    label: 'Mata Pencaharian Utama',
    value: 'Petani & Buruh Pabrik',
    unit: 'Mayoritas',
    year: '2020',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'SUPPORTED',
    description: 'Didukung sektor pendidik keagamaan/guru pesantren, pedagang retail, dan wirausaha.',
  },
];

export const POPULATION_AGE_DISTRIBUTION = [
  { group: '0 - 14 Tahun (Anak-anak)', percentage: 22, count: 1153 },
  { group: '15 - 39 Tahun (Pemuda / Usia Produktif)', percentage: 41, count: 2150 },
  { group: '40 - 64 Tahun (Dewasa)', percentage: 27, count: 1416 },
  { group: '65+ Tahun (Lansia)', percentage: 10, count: 525 },
];

export const LIVELIHOOD_DISTRIBUTION = [
  { sector: 'Pertanian & Perkebunan (Padi, Jagung, Tembakau)', percentage: 46 },
  { sector: 'Buruh Industri / Pabrik', percentage: 24 },
  { sector: 'Pedagang, UMKM & Jasa Kebutuhan Santri', percentage: 16 },
  { sector: 'Pendidik / Tenaga Keagamaan / Pesantren', percentage: 9 },
  { sector: 'Lainnya / PNS / Konstruksi', percentage: 5 },
];
