import React from 'react';
import { SourceCitation } from '../../types';
import { RESEARCH_SOURCES } from '../../data/research/sources';
import { X, ExternalLink, ShieldCheck, Building2, Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface SourceModalProps {
  sourceId: string | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ sourceId, onClose }) => {
  if (!sourceId) return null;
  const source: SourceCitation | undefined = RESEARCH_SOURCES[sourceId];

  if (!source) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Detail Sumber Informasi</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-600">ID Sumber `{sourceId}` belum terdaftar dalam direktori publik.</p>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return {
          label: 'Tingkat 1 — Sumber Resmi Pemerintah / BPS',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 2:
        return {
          label: 'Tingkat 2 — Sumber Organisasi / Lembaga Pendidikan',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      default:
        return {
          label: 'Tingkat 3 — Sumber Sekunder / Media Terpercaya',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
        };
    }
  };

  const tierBadge = getTierBadge(source.tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {source.id}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Verifikasi & Penelusuran Sumber</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${tierBadge.color}`}>
              {tierBadge.label}
            </span>
            <h4 className="text-base font-semibold text-slate-900 mt-2.5">{source.title}</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-medium">Penerbit / Institusi</p>
                <p className="font-semibold text-slate-800">{source.publisher}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-500 font-medium">Tahun Terbit / Akses</p>
                <p className="font-semibold text-slate-800">
                  {source.year ? `Tahun ${source.year}` : '-'} {source.accessedAt ? `(Diakses: ${source.accessedAt})` : ''}
                </p>
              </div>
            </div>
          </div>

          {source.notes && (
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Catatan Verifikasi Riset
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{source.notes}</p>
            </div>
          )}

          {source.verificationStatus === 'REQUIRES_VERIFICATION' && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Perhatian KKN / Desa:</strong> Data ini memerlukan konfirmasi langsung dengan pamong/sekretariat Desa Brabo untuk verifikasi faktual lapangan terkini.
              </p>
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-slate-100">
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
              >
                <span>Buka Tautan Sumber Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
