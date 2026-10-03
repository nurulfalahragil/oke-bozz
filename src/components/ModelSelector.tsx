import React, { useRef } from 'react';
import { UserCheck, UploadCloud, X } from 'lucide-react';

interface ModelSelectorProps {
  modelImage?: string;
  onChangeModelImage: (dataUrl: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelImage,
  onChangeModelImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onChangeModelImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">
            2
          </div>
          <h2 className="font-semibold text-white text-base flex items-center gap-1.5">
            Karakter Model Iklan
            <span className="text-slate-400 text-xs font-normal uppercase tracking-wider bg-slate-700/60 px-2 py-0.5 rounded-full border border-slate-600/50">
              Opsional
            </span>
          </h2>
        </div>
        {modelImage && (
          <span className="text-purple-300 text-xs flex items-center gap-1 font-medium bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            <UserCheck className="w-3.5 h-3.5" />
            Foto Model Terpasang
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3.5">
        Upload foto model karakter iklan (opsional). Jika tidak diisi, AI akan menyesuaikan talent dengan gaya storyboard yang dipilih.
      </p>

      {/* Upload Model Area */}
      <div>
        {modelImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-purple-500/40 bg-slate-900/60 h-40 flex items-center justify-center p-2">
            <img
              src={modelImage}
              alt="Model Kustom"
              className="h-full object-contain rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded shadow transition cursor-pointer"
              >
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={() => onChangeModelImage('')}
                className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium rounded shadow transition cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 hover:border-purple-400/80 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-800/50"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">
                Klik untuk upload foto karakter model iklan (opsional)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP (maks. 10MB)</p>
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
    </div>
  );
};
