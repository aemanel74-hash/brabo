import React from 'react';
import { VerificationStatus } from '../../types';
import { ShieldCheck, CheckCircle2, HelpCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { RESEARCH_SOURCES } from '../../data/research/sources';

interface VerificationBadgeProps {
  status: VerificationStatus;
  sourceId?: string;
  className?: string;
  showSourceTitle?: boolean;
  onOpenSource?: (sourceId: string) => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  sourceId,
  className = '',
  showSourceTitle = false,
  onOpenSource,
}) => {
  const source = sourceId ? RESEARCH_SOURCES[sourceId] : undefined;

  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          label: 'Terverifikasi Resmi',
          shortLabel: 'VERIFIED',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
          dot: 'bg-emerald-500',
          description: 'Didukung oleh dokumen resmi pemerintah/BPS/kementerian.',
        };
      case 'SUPPORTED':
        return {
          label: 'Didukung Sumber Terpercaya',
          shortLabel: 'SUPPORTED',
          bg: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
          dot: 'bg-blue-500',
          description: 'Didukung oleh publikasi institusi pendidikan, arsip yayasan, atau laporan terpercaya.',
        };
      case 'REQUIRES_VERIFICATION':
        return {
          label: 'Perlu Verifikasi Pihak Desa',
          shortLabel: 'VERIFIKASI DESA',
          bg: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          dot: 'bg-amber-500',
          description: 'Data memerlukan konfirmasi langsung dari pamong atau sekretariat Desa Brabo.',
        };
      case 'UNVERIFIED':
        return {
          label: 'Belum Terverifikasi Dokumen',
          shortLabel: 'UNVERIFIED',
          bg: 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100',
          icon: <HelpCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
          dot: 'bg-orange-500',
          description: 'Ditemukan pada catatan lisan lokal, namun belum memiliki dokumen pembanding.',
        };
      case 'NOT_FOUND':
      default:
        return {
          label: 'Data Belum Ditemukan',
          shortLabel: 'NOT FOUND',
          bg: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
          icon: <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
          dot: 'bg-slate-400',
          description: 'Data tidak ditemukan dalam sumber publik terbuka.',
        };
    }
  };

  const config = getStatusConfig();

  const handleClick = (e: React.MouseEvent) => {
    if (sourceId && onOpenSource) {
      e.stopPropagation();
      onOpenSource(sourceId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${config.label} - ${config.description}${source ? ` (Sumber: ${source.title})` : ''}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.shortLabel}</span>
      {showSourceTitle && source && (
        <span className="hidden sm:inline border-l border-current/20 pl-1.5 opacity-90 text-[11px] truncate max-w-[150px]">
          {source.publisher}
        </span>
      )}
      {sourceId && <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />}
    </button>
  );
};
