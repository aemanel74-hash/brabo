import React from 'react';
import { VerificationSourceOption, VerificationStatus } from '../../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, HelpCircle, Building, Database } from 'lucide-react';

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
  verificationSource = 'UNVERIFIED',
  verificationNote = '',
  customSourceName = '',
  onChange,
  label = 'Status & Sumber Verifikasi Data',
  helperText = 'Pilih sumber verifikasi yang mendasari data ini agar transparan bagi publik.'
}) => {

  const handleTypeChange = (newType: VerificationSourceOption) => {
    let status: VerificationStatus = 'UNVERIFIED';
    let sourceId = 'SRC-KKN-UNVERIFIED';

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
      verificationNote: newType === 'VERIFIED_DESA' ? verificationNote : '',
      customSourceName: newType === 'OTHER_VALID_SOURCE' ? customSourceName : '',
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
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-0.5">
          {label}
        </label>
        {helperText && (
          <p className="text-[11px] text-slate-500">
            {helperText}
          </p>
        )}
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Option 1: Belum Diverifikasi */}
        <label
          onClick={() => handleTypeChange('UNVERIFIED')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'UNVERIFIED'
              ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400 text-amber-950 font-medium'
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
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Belum Diverifikasi</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Data sementara atau catatan lapangan yang belum ada dokumen pendukung.
            </p>
          </div>
        </label>

        {/* Option 2: Diverifikasi oleh Desa */}
        <label
          onClick={() => handleTypeChange('VERIFIED_DESA')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'VERIFIED_DESA'
              ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500 text-emerald-950 font-medium'
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
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Diverifikasi oleh Desa</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Telah disahkan berdasarkan SK/Arsip resmi Pemerintah Desa Brabo.
            </p>
          </div>
        </label>

        {/* Option 3: Data BPS Grobogan */}
        <label
          onClick={() => handleTypeChange('BPS_GROBOGAN')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'BPS_GROBOGAN'
              ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500 text-blue-950 font-medium'
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
              <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Data BPS Grobogan</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Berdasarkan publikasi resmi BPS Kab. Grobogan / Tanggungharjo Dalam Angka.
            </p>
          </div>
        </label>

        {/* Option 4: Sumber lainnya yang valid */}
        <label
          onClick={() => handleTypeChange('OTHER_VALID_SOURCE')}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
            verificationSource === 'OTHER_VALID_SOURCE'
              ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-500 text-purple-950 font-medium'
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
              <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Sumber Lainnya yang Valid</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Didukung referensi terpercaya (Bapelitbangda, Arsip Pesantren, Kemenag, dll).
            </p>
          </div>
        </label>
      </div>

      {/* Dynamic Sub-inputs based on selection */}
      {verificationSource === 'VERIFIED_DESA' && (
        <div className="p-3 rounded-xl bg-emerald-100/50 border border-emerald-200 space-y-1.5 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-emerald-950">
            Keterangan / Catatan Verifikasi Desa (Opsional):
          </label>
          <input
            type="text"
            placeholder="Contoh: SK Kepala Desa No. 141/04/2020 atau Validasi Sekretariat Desa Brabo"
            value={verificationNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 bg-white placeholder:text-slate-400 text-slate-800"
          />
          <p className="text-[10px] text-emerald-800">
            Catatan ini akan ditampilkan pada badge informasi saat kursor didekatkan atau diklik oleh warga.
          </p>
        </div>
      )}

      {verificationSource === 'OTHER_VALID_SOURCE' && (
        <div className="p-3 rounded-xl bg-purple-100/50 border border-purple-200 space-y-1.5 animate-in fade-in duration-150">
          <label className="block text-[11px] font-bold text-purple-950">
            Nama Sumber Valid Lainnya *:
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Arsip PP Sirojuth Tholibin, Dokumen Bapelitbangda Grobogan, atau Buku Babad"
            value={customSourceName}
            onChange={(e) => handleCustomSourceChange(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white placeholder:text-slate-400 text-slate-800"
          />
          <p className="text-[10px] text-purple-800">
            Nama sumber ini akan tampil secara transparan pada label sumber di halaman publik.
          </p>
        </div>
      )}
    </div>
  );
};
