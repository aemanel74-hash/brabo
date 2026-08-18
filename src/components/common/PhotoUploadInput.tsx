import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, CheckCircle2, RefreshCw, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';
import { isSupabaseConfigured, uploadBase64ToSupabaseStorage, SUPABASE_BUCKETS } from '../../lib/supabase';

interface PhotoUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folderName?: string;
  bucketName?: string;
  placeholder?: string;
  helperText?: string;
}

export const PhotoUploadInput: React.FC<PhotoUploadInputProps> = ({
  label,
  value,
  onChange,
  folderName = 'pamong',
  bucketName = SUPABASE_BUCKETS.MEDIA,
  placeholder = 'Unggah foto profil atau masukkan URL...',
  helperText = 'Mendukung JPG, PNG, WebP (otomatis dioptimalkan)',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>(value && value.startsWith('http') && !value.includes('supabase') ? 'url' : 'upload');
  const [urlInput, setUrlInput] = useState(value || '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Auto compress to WebP max 800x800 for optimal fast loading
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        format: 'image/webp',
      });

      let finalUrl = compressed.dataUrl;

      // If Supabase Storage is active, upload to Supabase Storage Bucket
      if (isSupabaseConfigured()) {
        const cleanName = `${folderName}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.webp`;
        const res = await uploadBase64ToSupabaseStorage(
          compressed.dataUrl,
          bucketName,
          cleanName
        );
        if (res.success && res.url) {
          finalUrl = res.url;
        }
      }

      onChange(finalUrl);
      setUrlInput(finalUrl);
    } catch (err) {
      console.error('Failed to compress/upload image:', err);
      alert('Gagal memproses file foto. Pastikan format gambar valid.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  const handleApplyUrl = (val: string) => {
    setUrlInput(val);
    onChange(val.trim());
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
              mode === 'upload' ? 'bg-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Unggah File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
              mode === 'url' ? 'bg-emerald-800 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Input URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          {value ? (
            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative group">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Foto Terpasang</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {value.startsWith('data:') ? 'Format gambar terkompresi (WebP)' : value}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                  title="Ganti Foto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 ${
                isUploading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-emerald-800">
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-700">
                {isUploading ? 'Mengompres & Mengunggah...' : 'Klik untuk Pilih / Unggah Foto Profil'}
              </p>
              <p className="text-[10px] text-slate-500">{helperText}</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => handleApplyUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shrink-0"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
