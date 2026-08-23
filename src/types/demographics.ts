import { VerificationStatus, VerificationSourceOption } from './index';

export interface HamletDemographicRecord {
  hamletId: string;
  hamletName: string;
  alias: string;
  rtCount: number;
  rwCount: number;
  kkCount: number;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  temporarySantriPopulation: number; // Santri mukim non-KTP lokal yang berdomisili
  birthsThisYear: number;
  deathsThisYear: number;
  inMigrantsThisYear: number; // Pindah Masuk
  outMigrantsThisYear: number; // Pindah Keluar
  lastSynchronized: string;
  verificationSource: VerificationSourceOption;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface VillageDemographicSummary {
  year: number;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  kkCount: number;
  rtCount: number;
  rwCount: number;
  temporarySantriCount: number;
  totalWithSantri: number;
  birthsCount: number;
  deathsCount: number;
  inMigrantsCount: number;
  outMigrantsCount: number;
  growthRatePercent: number;
  densityPerKm2: number;
  totalAreaHa: number;
  dataSourceType: 'BUKU_INDUK_PEMDES' | 'BPS_GROBOGAN_2026' | 'BPS_2022' | 'PROYEKSI_GABUNGAN';
  dataSourceLabel: string;
  lastUpdated: string;
  status: VerificationStatus;
  sourceId: string;
  verificationSource: VerificationSourceOption;
  verificationNote?: string;
  bpsSyncLog?: {
    bpsApiEndpoint: string;
    datasetCode: string;
    bpsSyncTimestamp: string;
    version: string;
  };
}

export interface DemographicEventLog {
  id: string;
  type: 'KELAHIRAN' | 'KEMATIAN' | 'PINDAH_MASUK' | 'PINDAH_KELUAR' | 'UPDATE_KK' | 'SINKRONISASI_BPS';
  hamletId: string;
  hamletName: string;
  rt: string;
  rw: string;
  nik?: string;
  personName: string;
  gender?: 'Laki-laki' | 'Perempuan';
  date: string;
  reportedBy: string;
  notes?: string;
  recordedAt: string;
}
