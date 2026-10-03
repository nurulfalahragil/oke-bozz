import React from 'react';
import { FileText } from 'lucide-react';

interface ProductDetailsFormProps {
  productName: string;
  onChangeProductName: (val: string) => void;
  description: string;
  onChangeDescription: (val: string) => void;
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  productName,
  onChangeProductName,
  description,
  onChangeDescription,
}) => {
  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
          3
        </div>
        <h2 className="font-semibold text-white text-base">Deskripsi Produk</h2>
      </div>

      <div className="space-y-3.5">
        {/* Nama Produk */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Nama Produk <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => onChangeProductName(e.target.value)}
            placeholder="Contoh: Tas Selempang Wanita Kulit"
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Deskripsi Produk */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Deskripsi Produk <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="Jelaskan detail produk, material, warna, fungsi utama, keunggulan, dan solusi yang ditawarkan produk untuk iklan..."
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
