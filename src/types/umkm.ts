import { VerificationStatus } from './index';

export interface UmkmProduct {
  name: string;
  price?: string;
  description?: string;
  photoUrl?: string;
}

export interface VillageUmkm {
  id: string;
  name: string; // Nama Usaha
  ownerName: string; // Nama Pemilik
  category: 'Kuliner & Olahan' | 'Busana & Perlengkapan Santri' | 'Pertanian & Hasil Bumi' | 'Jasa & Percetakan' | 'Kerajinan & Seni' | 'Toko & Kelontong' | 'Lainnya';
  hamlet: 'Dusun I Dukoh' | 'Dusun II Krajan' | 'Dusun III Cangkring' | string;
  address: string; // Alamat / Patokan lokasi
  description: string; // Keterangan Lengkap Usaha
  whatsapp: string; // Nomor WA aktif (e.g. 08123456789 atau 628123456789)
  mapsUrl?: string; // Link Google Maps
  photos: string[]; // Minimal 4 slide foto jenis usaha
  priceRange?: string; // e.g. Rp 5.000 - Rp 50.000
  openingHours?: string; // e.g. 08.00 - 21.00 WIB
  instagram?: string;
  marketplaceUrl?: string;
  status: 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED';
  verificationStatus: VerificationStatus;
  submittedAt: string;
  updatedAt?: string;
  verifiedAt?: string;
  isFeatured?: boolean;
  notes?: string;
}
