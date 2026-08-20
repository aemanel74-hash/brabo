import React, { useState, useRef } from 'react';
import { FileUp, FileText, Trash2, CheckCircle2, Download, Link as LinkIcon, RefreshCw, AlertCircle, FileSpreadsheet, Paperclip } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_BUCKETS } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/supabase';

interface DocumentUploadInputProps {
  label: string;
  fileUrl: string;
  fileName?: string;
  onFileChange: (url: string, name: string, sizeBytes?: number, fileType?: 'PDF' | 'DOCX' | 'DOC' | 'ZIP' | 'IMAGE') => void;
  folderName?: string;
  helperText?: string;
  accept?: string;
}

export const DocumentUploadInput: React.FC<DocumentUploadInputProps> = ({
  label,
  fileUrl,
  fileName,
  onFileChange,
  folderName = 'template_surat',
  helperText = 'Format: PDF, DOCX, DOC, RTF, ZIP (Maks 10MB)',
  accept = '.pdf,.doc,.docx,.rtf,.odt,.zip',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [manualUrl, setManualUrl] = useState(fileUrl || '');
  const [manualName, setManualName] = useState(fileName || '');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getExtensionType = (name: string): 'PDF' | 'DOCX' | 'DOC' | 'ZIP' | 'IMAGE' => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.pdf')) return 'PDF';
    if (lower.endsWith('.docx')) return 'DOCX';
    if (lower.endsWith('.doc') || lower.endsWith('.rtf') || lower.endsWith('.odt')) return 'DOC';
    if (lower.endsWith('.zip') || lower.endsWith('.rar')) return 'ZIP';
    return 'PDF';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const detectedType = getExtensionType(file.name);
      let finalUrl = '';

      // Max 10MB size limit
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Ukuran berkas melebihi batas maksimal 10MB.');
        setIsUploading(false);
        return;
      }

      // Check if Supabase client is configured for cloud upload
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const timestamp = Date.now();
          const cleanName = `${folderName}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          
          const { error: uploadErr } = await supabase.storage
            .from(SUPABASE_BUCKETS.DOCUMENTS)
            .upload(cleanName, file, {
              contentType: file.type || 'application/octet-stream',
              cacheControl: '3600',
              upsert: true,
            });

          if (!uploadErr) {
            const { data } = supabase.storage.from(SUPABASE_BUCKETS.DOCUMENTS).getPublicUrl(cleanName);
            finalUrl = data.publicUrl;
          }
        }
      }

      // If Supabase upload didn't yield a URL or isn't connected, convert to Data URL for local resilience
      if (!finalUrl) {
        // Prevent huge local base64 (> 2MB) when offline to protect localStorage quota
        if (file.size > 2.5 * 1024 * 1024) {
          setUploadError('Saat mode offline (tanpa Supabase), ukuran berkas dibatasi maksimal 2.5MB agar penyimpanan browser tidak penuh. Harap gunakan Tautan URL atau aktifkan Supabase.');
          setIsUploading(false);
          return;
        }

        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      onFileChange(finalUrl, file.name, file.size, detectedType);
      setManualUrl(finalUrl);
      setManualName(file.name);
    } catch (err: any) {
      console.error('Upload document error:', err);
      setUploadError('Gagal memproses file. Silakan coba lagi atau gunakan tautan URL dokumen.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!manualUrl.trim()) return;
    const name = manualName.trim() || manualUrl.split('/').pop() || 'Dokumen_Template.docx';
    const detectedType = getExtensionType(name);
    onFileChange(manualUrl.trim(), name, undefined, detectedType);
  };

  const handleClear = () => {
    onFileChange('', '', 0, 'PDF');
    setManualUrl('');
    setManualName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              mode === 'upload' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              mode === 'url' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tautan URL
          </button>
        </div>
      </div>

      {fileUrl ? (
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-950 truncate">{fileName || 'Dokumen Terlampir'}</p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Siap diunduh warga
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={fileUrl}
              download={fileName || 'template_dokumen'}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs flex items-center gap-1"
              title="Unduh / Cek File"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors text-xs"
              title="Hapus File"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          {mode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                id={`file-upload-${folderName}`}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-4 px-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50/70 hover:bg-emerald-50/40 text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Mengunggah berkas template...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-transform group-hover:scale-110">
                      <FileUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-900">
                        Klik untuk Pilih Berkas Template dari Perangkat
                      </p>
                      <p className="text-[10px] text-slate-500">{helperText}</p>
                    </div>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://contoh.com/berkas_template.docx"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Terapkan
                </button>
              </div>
              <input
                type="text"
                placeholder="Nama file (contoh: Form_Permohonan_SKU.docx)"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              />
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3 h-3" /> {uploadError}
        </p>
      )}
    </div>
  );
};
