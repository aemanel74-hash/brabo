import { NewsItem, VerificationStatus } from '../../types';

export interface BudgetCategory {
  title: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface VillageBudgetData {
  fiscalYear: string;
  status: VerificationStatus;
  sourceId: string;
  totalIncome: number;
  totalExpenditure: number;
  incomeCategories: BudgetCategory[];
  expenditureCategories: BudgetCategory[];
  notes: string;
}

export const VILLAGE_BUDGET_SAMPLE: VillageBudgetData = {
  fiscalYear: 'Tahun Anggaran Berjalan (Estimasi Transparansi APBDes)',
  status: 'REQUIRES_VERIFICATION',
  sourceId: 'SRC-KKN-UNVERIFIED',
  totalIncome: 1850000000,
  totalExpenditure: 1845000000,
  incomeCategories: [
    { title: 'Dana Desa (APBN)', amount: 980000000, percentage: 53, description: 'Alokasi Dana Desa untuk penanganan kemiskinan, ketahanan pangan, dan infrastruktur dasar.' },
    { title: 'Alokasi Dana Desa (ADD Kab. Grobogan)', amount: 620000000, percentage: 33, description: 'Operasional pemerintahan desa dan siltap pamong desa.' },
    { title: 'Bagi Hasil Pajak & Retribusi Daerah', amount: 120000000, percentage: 7, description: 'Bagi hasil pajak bumi dan bangunan serta retribusi daerah.' },
    { title: 'Pendapatan Asli Desa (PADes) & Lainnya', amount: 130000000, percentage: 7, description: 'Penerimaan tanah kas desa dan hasil pengelolaan aset desa.' },
  ],
  expenditureCategories: [
    { title: 'Bidang Pelaksanaan Pembangunan Desa', amount: 820000000, percentage: 44, description: 'Peningkatan jalan rabat beton lingkungan, talud irigasi pertanian, dan pemeliharaan gedung balai desa.' },
    { title: 'Bidang Penyelenggaraan Pemerintahan Desa', amount: 590000000, percentage: 32, description: 'Penghasilan tetap (Siltap), tunjangan pamong, dan operasional perkantoran balai desa.' },
    { title: 'Bidang Pembinaan & Pemberdayaan Kemasyarakatan', amount: 265000000, percentage: 14, description: 'Pelatihan kelompok tani, bantuan sarana posyandu balita/lansia, kegiatan PKK, dan kepemudaan.' },
    { title: 'Bidang Penanggulangan Bencana & Mendesak', amount: 170000000, percentage: 10, description: 'BLT Dana Desa bagi warga rentan dan dana tanggap darurat bencana.' },
  ],
  notes: 'Data rincian APBDes definitif wajib diperbarui setiap tahun sesuai Peraturan Desa (Perdes) tentang APBDes yang disahkan oleh BPD dan Kepala Desa Brabo.',
};

export const VILLAGE_NEWS: NewsItem[] = [
  {
    id: 'NEWS-01',
    title: 'Pemerintah Desa Brabo Fasilitasi Pelayanan Administrasi Warga dan Santri',
    slug: 'pelayanan-administrasi-warga-dan-santri',
    date: '12 Agustus 2026',
    category: 'Pemerintahan',
    summary: 'Balai Desa Brabo memperkuat efisiensi loket pelayanan publik untuk mengurus surat keterangan domisili santri, pengantar administrasi kependudukan, dan legalitas usaha.',
    content: 'Dalam rangka mewujudkan tata kelola desa yang responsif, Balai Desa Brabo yang berlokasi di Dusun Krajan terus memaksimalkan pelayanan administrasi terpadu. Selain melayani warga asli desa di 3 dusun (Dukoh, Krajan, Cangkring), balai desa juga memfasilitasi kebutuhan administrasi surat keterangan tinggal santri pesantren yang menimba ilmu di Desa Brabo.',
    author: 'Sekretariat Desa Brabo',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'VERIFIED',
    featured: true,
  },
  {
    id: 'NEWS-02',
    title: 'Kelompok Tani Desa Brabo Matangkan Persiapan Musim Tanam & Pembersihan Saluran Irigasi',
    slug: 'persiapan-musim-tanam-dan-irigasi',
    date: '08 Agustus 2026',
    category: 'Pembangunan',
    summary: 'Warga petani Dusun Cangkring dan Dusun Dukoh melaksanakan gotong royong pembersihan saluran irigasi guna mengoptimalkan pasokan air pertanian padi dan tembakau.',
    content: 'Menjelang siklus masa tanam, Gabungan Kelompok Tani (Gapoktan) Desa Brabo bersama masyarakat menggelar kerja bakti massal membersihkan sedimen lumpur pada saluran irigasi tersier. Upaya ini penting untuk menjamin distribusi air yang merata pada areal persawahan seluas ratusan hektar.',
    author: 'Kasi Kesejahteraan / Poktan',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'SUPPORTED',
    featured: true,
  },
  {
    id: 'NEWS-03',
    title: 'Semarak Peringatan Hari Santri & Syiar Pendidikan Islam di Desa Brabo',
    slug: 'peringatan-hari-santri-desa-brabo',
    date: '25 Juli 2026',
    category: 'Pendidikan',
    summary: 'Kompleks Yayasan Pendidikan Islam Tajul Ulum dan Pondok Pesantren Sirojuth Tholibin menggelar rangkaian musabaqoh dan kajian keagamaan.',
    content: 'Sebagai desa yang dijuluki Kampung Santri dan Desa Seribu Pesantren, Desa Brabo senantiasa menjadi pusat kegiatan keagamaan yang menginspirasi. Berbagai kegiatan kajian kitab kuning, halaqah santri, dan pembinaan generasi muda diselenggarakan dengan penuh kekhidmatan.',
    author: 'Tim Humas Pesantren & KKN',
    sourceId: 'SRC-YAYASAN-TAJUL-ULUM',
    status: 'SUPPORTED',
    featured: false,
  },
  {
    id: 'NEWS-04',
    title: 'Kader PKK & Bidan Desa Gencarkan Posyandu Terpadu Pencegahan Stunting',
    slug: 'posyandu-terpadu-pencegahan-stunting',
    date: '18 Juli 2026',
    category: 'Sosial',
    summary: 'Pemeriksaan rutin tumbuh kembang balita, penimbangan, imunisasi, dan penyuluhan gizi seimbang dilaksanakan di pos-pos Posyandu ketiga dusun.',
    content: 'Kesehatan ibu dan anak menjadi salah satu prioritas utama pembangunan manusia di Desa Brabo. Melalui kader Posyandu di Dusun Dukoh, Dusun Krajan, dan Dusun Cangkring, penimbangan berat badan, pengukuran tinggi badan balita, serta pemberian makanan tambahan (PMT) rutin disalurkan.',
    author: 'Kader Posyandu PKK Desa Brabo',
    sourceId: 'SRC-PEMKAB-GROB',
    status: 'SUPPORTED',
    featured: false,
  },
];
