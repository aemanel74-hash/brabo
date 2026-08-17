import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  FileText,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { LetterTemplate, Signatory, OfficialPerson } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface LetterDocumentData {
  trackingCode: string;
  letterNumber: string;
  dateStr: string;
  template: LetterTemplate;
  formData: {
    nik: string;
    fullName: string;
    gender: string;
    placeOfBirth: string;
    dateOfBirth: string;
    religion: string;
    occupation: string;
    hamlet: string;
    rt: string;
    rw: string;
    purpose: string;
    businessName?: string;
    businessType?: string;
  };
  signatories: Signatory[];
}

interface OfficialLetterDocumentProps {
  data: LetterDocumentData;
  onPrint?: () => void;
  showActions?: boolean;
}

export const OfficialLetterDocument: React.FC<OfficialLetterDocumentProps> = ({ 
  data, 
  onPrint,
  showActions = true 
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const { template, formData, signatories, letterNumber, dateStr, trackingCode } = data;

  const replacePlaceholders = (text: string): string => {
    let result = text;
    const replacements: { [key: string]: string } = {
      '{{nomor_surat}}': letterNumber,
      '{{nomor}}': trackingCode.replace('BRB-', ''),
      '{{tanggal_surat}}': dateStr,
      '{{nama}}': formData.fullName || '................................',
      '{{nik}}': formData.nik || '................................',
      '{{tempat_lahir}}': formData.placeOfBirth || 'Grobogan',
      '{{tanggal_lahir}}': formData.dateOfBirth || '....................',
      '{{jenis_kelamin}}': formData.gender || 'Laki-laki',
      '{{agama}}': formData.religion || 'Islam',
      '{{pekerjaan}}': formData.occupation || '................................',
      '{{alamat}}': `Dusun ${formData.hamlet || 'Krajan'}, RT ${formData.rt || '01'} / RW ${formData.rw || '01'}`,
      '{{dusun}}': formData.hamlet || 'Krajan',
      '{{rt}}': formData.rt || '01',
      '{{rw}}': formData.rw || '01',
      '{{desa}}': 'Brabo',
      '{{kecamatan}}': 'Tanggungharjo',
      '{{kabupaten}}': 'Grobogan',
      '{{nama_usaha}}': formData.businessName || '................................',
      '{{jenis_usaha}}': formData.businessType || 'Perdagangan / Jasa',
      '{{keperluan}}': formData.purpose || 'Persyaratan Administrasi Pelayanan Warga',
      '{{hari_tanggal}}': dateStr,
      '{{waktu}}': '09:00',
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, value);
    });

    return result;
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const element = documentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanFileName = `Surat_${template.code}_${formData.fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'Desa_Brabo'}.pdf`;
      pdf.save(cleanFileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  // Resolve signatories for each slot
  const resolvedSlots = template.signatureSlots.map((slot) => {
    let signatory: Signatory | undefined;
    if (slot.signatoryId) {
      signatory = signatories.find(s => s.id === slot.signatoryId);
    }
    
    // If territory match is requested, match Kadus or RT according to citizen's hamlet/rt
    if (slot.requiresTerritoryMatch && !signatory) {
      if (slot.title.toLowerCase().includes('kadus') || slot.title.toLowerCase().includes('dusun')) {
        signatory = signatories.find(s => s.wilayah?.toLowerCase().includes(formData.hamlet.toLowerCase()));
      } else if (slot.title.toLowerCase().includes('rt')) {
        signatory = signatories.find(s => s.wilayah?.toLowerCase().includes(`rt ${formData.rt}`));
      }
    }

    // Default fallback to first active or Kades if still not found
    if (!signatory) {
      signatory = signatories.find(s => s.id === 'SIG-KADES') || signatories[0];
    }

    return {
      slot,
      signatory,
      title: replacePlaceholders(slot.title),
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      {showActions && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">DOKUMEN RESMI A4</span>
                <span className="text-xs text-slate-400 font-mono">({trackingCode})</span>
              </div>
              <p className="text-sm font-bold text-white">{template.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Salin Kode Registrasi"
            >
              {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTracking ? 'Tersalin' : 'Salin Kode'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-700 border border-slate-700 active:scale-95"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Surat (A4)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Memproses PDF...' : 'Unduh PDF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* A4 Paper Document Container */}
      <div className="overflow-x-auto pb-4 flex justify-center">
        <div
          id="printable-letter-document"
          ref={documentRef}
          className="w-[210mm] min-h-[297mm] bg-white text-slate-950 p-[20mm] sm:p-[25mm] shadow-2xl rounded-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 mx-auto flex flex-col justify-between font-serif text-[12pt] leading-relaxed relative"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Official Village Letterhead (KOP SURAT) */}
          <div>
            <div className="flex items-center gap-4 border-b-[3px] border-slate-950 pb-3 mb-1">
              {/* Official Seal / Logo */}
              <div className="w-20 h-20 shrink-0 flex items-center justify-center border-2 border-slate-900 rounded-full text-slate-900 p-2">
                <div className="text-center">
                  <Building2 className="w-8 h-8 mx-auto text-slate-900" />
                  <span className="text-[7px] font-black uppercase font-sans tracking-tight block mt-0.5">GROBOGAN</span>
                </div>
              </div>

              {/* Letterhead Titles */}
              <div className="flex-1 text-center font-sans">
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 leading-tight">
                  {template.kopTitle || 'PEMERINTAH KABUPATEN GROBOGAN'}
                </h3>
                <h4 className="text-lg font-black uppercase tracking-wider text-slate-950 leading-tight">
                  KECAMATAN TANGGUNGHARJO
                </h4>
                <h2 className="text-2xl font-black uppercase tracking-widest text-slate-950 leading-none my-1">
                  PEMERINTAH DESA BRABO
                </h2>
                <p className="text-[10px] text-slate-700 leading-tight font-sans">
                  Jl. Raya Brabo - Tanggungharjo, Kecamatan Tanggungharjo, Kabupaten Grobogan, Jawa Tengah
                  <br />
                  Kode Pos: 58166 • Layanan Elektronik: desabrabo.digital
                </p>
              </div>
            </div>
            {/* Secondary Thin Border */}
            <div className="border-b border-slate-950 mb-6" />

            {/* Letter Number and Title */}
            <div className="text-center my-6 space-y-1">
              <h1 className="text-lg font-bold uppercase tracking-wide underline underline-offset-4 decoration-2">
                {template.name}
              </h1>
              <p className="text-xs font-sans font-semibold text-slate-800">
                Nomor: {letterNumber}
              </p>
            </div>

            {/* Opening Paragraph */}
            <p className="text-justify text-sm leading-relaxed mb-4">
              {replacePlaceholders(template.openingText)}
            </p>

            {/* Dynamic Content Body (Formatted Data Identitas) */}
            <div className="my-4 px-2 sm:px-4 space-y-2 text-sm leading-relaxed whitespace-pre-line font-serif">
              {replacePlaceholders(template.contentTemplate)}
            </div>

            {/* Closing Paragraph */}
            <p className="text-justify text-sm leading-relaxed mt-4 mb-8">
              {replacePlaceholders(template.closingText)}
            </p>
          </div>

          {/* Signatures & Footer Section */}
          <div className="pt-4 mt-auto">
            {/* Date and Location Header */}
            <div className="text-right text-xs font-sans text-slate-800 mb-2">
              Brabo, {dateStr}
            </div>

            {/* Signature Columns according to template layout */}
            {template.signatureLayout === 'single' && (
              <div className="flex justify-end">
                <div className="text-center min-w-[200px] max-w-[260px] space-y-1 text-xs font-sans">
                  <p className="font-bold whitespace-pre-line">{resolvedSlots[0]?.title || 'Kepala Desa Brabo'}</p>
                  <div className="h-20 flex items-center justify-center relative">
                    <div className="w-16 h-16 border border-dashed border-slate-300 rounded-full flex items-center justify-center opacity-40 text-[9px] text-slate-400">
                      Stempel Desa
                    </div>
                  </div>
                  <p className="font-bold underline text-sm">{resolvedSlots[0]?.signatory?.nama || 'Mohamad Nurokhim, S.Ag.'}</p>
                  <p className="text-[10px] text-slate-600">NIP: {resolvedSlots[0]?.signatory?.nip || '-'}</p>
                </div>
              </div>
            )}

            {template.signatureLayout === 'double_horizontal' && (
              <div className="flex justify-between items-start gap-4">
                {/* Left Slot (e.g. Pemohon, RT, or Kadus) */}
                <div className="text-center min-w-[180px] max-w-[240px] space-y-1 text-xs font-sans">
                  <p className="font-bold whitespace-pre-line">{resolvedSlots[0]?.title || 'Ketua RT Setempat'}</p>
                  <div className="h-20 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic">(Tanda Tangan)</span>
                  </div>
                  <p className="font-bold underline text-sm">{resolvedSlots[0]?.signatory?.nama || '( ........................................ )'}</p>
                  <p className="text-[10px] text-slate-600">{resolvedSlots[0]?.signatory?.jabatan || 'Ketua RT'}</p>
                </div>

                {/* Right Slot (e.g. Kepala Desa / Sekdes) */}
                <div className="text-center min-w-[180px] max-w-[240px] space-y-1 text-xs font-sans">
                  <p className="font-bold whitespace-pre-line">{resolvedSlots[1]?.title || 'Kepala Desa Brabo'}</p>
                  <div className="h-20 flex items-center justify-center relative">
                    <div className="w-14 h-14 border border-dashed border-slate-300 rounded-full flex items-center justify-center opacity-40 text-[8px] text-slate-400">
                      Stempel Desa
                    </div>
                  </div>
                  <p className="font-bold underline text-sm">{resolvedSlots[1]?.signatory?.nama || 'Mohamad Nurokhim, S.Ag.'}</p>
                  <p className="text-[10px] text-slate-600">NIP: {resolvedSlots[1]?.signatory?.nip || '-'}</p>
                </div>
              </div>
            )}

            {template.signatureLayout === 'triple' && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-sans">
                {resolvedSlots.map((slotItem, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-bold whitespace-pre-line leading-tight">{slotItem.title}</p>
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-[9px] text-slate-300 italic">(TTD)</span>
                    </div>
                    <p className="font-bold underline text-xs">{slotItem.signatory?.nama || '( .............................. )'}</p>
                    <p className="text-[9px] text-slate-500">{slotItem.signatory?.jabatan || '-'}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Official Digital Stamp & Security Verification */}
            <div className="border-t border-slate-200 mt-6 pt-3 flex items-center justify-between text-[8px] font-sans text-slate-500">
              <div className="flex items-center gap-2">
                <QrCode className="w-9 h-9 text-slate-800 p-0.5 border border-slate-300 rounded shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Verifikasi Keaslian Dokumen Desa Brabo</p>
                  <p>Kode Tracking: <span className="font-mono font-bold text-slate-900">{trackingCode}</span></p>
                  <p>{template.footerNote || 'Dicetak otomatis melalui Portal Pelayanan Mandiri Desa Brabo.'}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-emerald-800 uppercase block">Resmi • Bebas Pungli</span>
                <span>Halaman 1 dari 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
