import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, X, Sparkles } from 'lucide-react';

interface ProductUploaderProps {
  image: string;
  onChange: (dataUrl: string) => void;
}

export const ProductUploader: React.FC<ProductUploaderProps> = ({ image, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
            1
          </div>
          <h2 className="font-semibold text-white text-base flex items-center gap-1.5">
            Foto Produk
            <span className="text-rose-400 text-xs font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Wajib
            </span>
          </h2>
        </div>
        {image && (
          <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gambar Terpasang
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3.5">
        Upload foto produk utama yang akan dipromosikan dalam iklan storyboard. AI akan menganalisis bentuk, warna, dan material produk secara visual.
      </p>

      {image ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-600/80 bg-slate-900/60 max-h-64 flex items-center justify-center p-2">
          <img
            src={image}
            alt="Preview Produk"
            className="max-h-56 max-w-full object-contain rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-slate-600 hover:border-indigo-400/80 hover:bg-slate-700/40 bg-slate-800/40'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Tarik & Letakkan gambar produk di sini, atau <span className="text-indigo-400 underline">pilih file</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Mendukung JPG, PNG, WEBP (maks. 10MB)</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
