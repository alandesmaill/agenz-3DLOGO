'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Info } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function ImageUploader({ value, onChange, label, hint }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Upload failed (${res.status}). Please try again.`);
        return;
      }
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      )}

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-40 rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#00e92c]/50 bg-[#00e92c]/5'
              : 'border-white/10 hover:border-white/20 bg-white/5'
          }`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-white/40 animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-white/40 mb-2" />
              <p className="text-sm text-white/40">Drop image or click to upload</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <X size={11} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/webp,image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="mt-2 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
      />

      {hint && (
        <p className="flex items-start gap-1 mt-1.5 text-xs text-white/35">
          <Info size={11} className="mt-0.5 shrink-0" />
          {hint}
        </p>
      )}
    </div>
  );
}
