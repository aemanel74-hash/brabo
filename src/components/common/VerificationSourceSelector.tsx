import React from 'react';
import { VerificationSourceOption, VerificationStatus } from '../../types';
import { ShieldCheck, Database, FileText, AlertTriangle } from 'lucide-react';

interface VerificationSourceSelectorProps {
  verificationSource?: VerificationSourceOption;
  verificationNote?: string;
  customSourceName?: string;
  onChange: (result: {
    verificationSource: VerificationSourceOption;
    verificationNote?: string;
    customSourceName?: string;
    status: VerificationStatus;
    sourceId: string;
  }) => void;
  label?: string;
  helperText?: string;
}

export const VerificationSourceSelector: React.FC<VerificationSourceSelectorProps> = ({
  verificationSource = 'VERIFIED_DESA',
  verificationNote = '',
  customSourceName = '',
  onChange,
  label = 'Status & Sumber Verifikasi Data',
  helperText = 'Pilih apakah data ini sudah terverifikasi (Data Desa / Data BPS / Sumber Lain) atau belum terverifikasi.'
}) => {

  const handleTypeChange = (newType: VerificationSourceOption) => {
    let status: VerificationStatus = 'VERIFIED';
    let sourceId = 'SRC-PEMDES-BRABO';

    if (newType === 'VERIFIED_DESA') {
      status = 'VERIFIED';
      sourceId = 'SRC-PEMDES-BRABO';
    } else if (newType === 'BPS_GROBOGAN') {
      status = 'VERIFIED';
      sourceId = 'SRC-BPS-2022';
    } else if (newType === 'OTHER_VALID_SOURCE') {
      status = 'SUPPORTED';
      sourceId = 'SRC-OTHER-VALID';
    } else {
      status = 'UNVERIFIED';
      sourceId = 'SRC-KKN-UNVERIFIED';
    }

    onChange({
      verificationSource: newType,
      verificationNote: newType === 'VERIFIED_DESA' ? (verificationNote || 'Disahkan oleh Pemerintah Desa Brabo') : '',
      customSourceName: newType === 'OTHER_VALID_SOURCE' ? (customSourceName || 'Arsip Resmi Instansi') : '',
      status,
      sourceId
    });
  };

  const handleNoteChange = (note: string) => {
    onChange({
      verificationSource: 'VERIFIED_DESA',
      verificationNote: note,
      customSourceName: '',
      status: 'VERIFIED',
      sourceId: 'SRC-PEMDES-BRABO'
    });
  };

  const handleCustomSourceChange = (src: string) => {
    onChange({
      verificationSource: 'OTHER_VALID_SOURCE',
      verificationNote: '',
      customSourceName: src,
      status: 'SUPPORTED',
      sourceId: 'SRC-OTHER-VALID'
    });
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="block text-xs font-bold text-slate-900">
            {label}
          </label>
          {helperText && (
            <p className="text-[11px] text-slate-500">
              {helperText}
            </p>
          )}
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
          verificationSource === 'VERIFIED_DESA'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : verificationSource === 'BPS_GROBOGAN'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : verificationSource === 'OTHER_VALID_SOURCE'
            ? 'bg-purple-100 text-purple-800 border border-purple-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {verificationSource === 'VERIFIED_DESA' && '✓ Status: Sudah Terverifikasi (Data Desa)'}
          {verificationSource === 'BPS_GROBOGAN' && '✓ Status: Sudah Terverifikasi (Data BPS)'}
          {verificationSource === 'OTHER_VALID_SOURCE' && '✓ Status: Didukung Sumber Valid Lainnya'}
          {verificationSource === 'UNVERIFIED' && '⚠ Status: Belum Terverifikasi / Butuh Verifikasi'}
        </span>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Option 1: Diverifikasi oleh Desa (Data Desa) */}
        <label
          onClick={() => handleTypeChange('VERIFIED_DESA')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'VERIFIED_DESA'
              ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500 text-emerald-950 font-medium shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="verificationTypeRadio"
            checked={verificationSource === 'VERIFIED_DESA'}
            onChange={() => handleTypeChange('VERIFIED_DESA')}
            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sudah Terverifikasi (Data Desa)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Telah disahkan berdasarkan SK/Arsip/Pamong resmi Pemerintah Desa Brabo.
            </p>
          </div>
        </label>

        {/* Option 2: Data BPS Grobogan (Data BPS) */}
        <label
          onClick={() => handleTypeChange('BPS_GROBOGAN')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'BPS_GROBOGAN'
              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500 text-blue-950 font-medium shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="verificationTypeRadio"
            checked={verificationSource === 'BPS_GROBOGAN'}
            onChange={() => handleTypeChange('BPS_GROBOGAN')}
            className="mt-0.5 text-blue-600 focus:ring-blue-500"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Database className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Sudah Terverifikasi (Data BPS)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Berdasarkan rujukan resmi Badan Pusat Statistik (BPS) Kab. Grobogan.
            </p>
          </div>
        </label>

        {/* Option 3: Sumber lainnya yang valid */}
        <label
          onClick={() => handleTypeChange('OTHER_VALID_SOURCE')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'OTHER_VALID_SOURCE'
              ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-500 text-purple-950 font-medium shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="verificationTypeRadio"
            checked={verificationSource === 'OTHER_VALID_SOURCE'}
            onChange={() => handleTypeChange('OTHER_VALID_SOURCE')}
            className="mt-0.5 text-purple-600 focus:ring-purple-500"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Didukung Sumber Valid Lainnya</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Didukung referensi institusi pendidikan, yayasan/pesantren, atau Kemenag.
            </p>
          </div>
        </label>

        {/* Option 4: Belum Terverifikasi */}
        <label
          onClick={() => handleTypeChange('UNVERIFIED')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'UNVERIFIED'
              ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500 text-amber-950 font-medium shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="verificationTypeRadio"
            checked={verificationSource === 'UNVERIFIED'}
            onChange={() => handleTypeChange('UNVERIFIED')}
            className="mt-0.5 text-amber-600 focus:ring-amber-500"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Belum Terverifikasi / Butuh Verifikasi</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Data masih berupa catatan sementara yang butuh konfirmasi desa lagi.
            </p>
          </div>
        </label>
      </div>

      {/* Dynamic Sub-inputs based on selection */}
      {verificationSource === 'VERIFIED_DESA' && (
        <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-300 space-y-1.5 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-emerald-950">
            Dasar Hukum / Catatan SK Pengesahan Desa:
          </label>
          <input
            type="text"
            placeholder="Contoh: SK Kepala Desa No. 141/04/2020 atau Buku Induk Pamong Desa Brabo"
            value={verificationNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 bg-white placeholder:text-slate-400 text-slate-800"
          />
          <p className="text-[10px] text-emerald-800">
            Keterangan ini akan langsung tampil pada badge verifikasi publik sebagai bukti keabsahan data resmi desa.
          </p>
        </div>
      )}

      {verificationSource === 'OTHER_VALID_SOURCE' && (
        <div className="p-3 rounded-xl bg-purple-100/60 border border-purple-300 space-y-1.5 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-purple-950">
            Nama Dokumen / Instansi Sumber Valid *:
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Arsip PP Sirojuth Tholibin, Dokumen Bapelitbangda, atau Riset KKN PM02 UNIMUS"
            value={customSourceName}
            onChange={(e) => handleCustomSourceChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white placeholder:text-slate-400 text-slate-800"
          />
          <p className="text-[10px] text-purple-800">
            Nama sumber valid ini akan tampil transparan pada label sumber di halaman publik.
          </p>
        </div>
      )}
    </div>
  );
};
