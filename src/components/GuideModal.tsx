import React from 'react';
import { X, Sparkles, Image as ImageIcon, Video, HelpCircle, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Panduan Penggunaan StoryBoard AI</h3>
              <p className="text-xs text-slate-400">Cara menghasilkan gambar &amp; video iklan dari prompt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: 6 Kategori Gaya & Struktur Storyboard */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            1. Pilihan 6 Kategori Gaya &amp; Struktur Alur Storyboard
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            OkeBozz menyediakan 38 gaya storyboard iklan yang dikelompokkan ke dalam 6 kategori terstruktur:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div><strong className="text-purple-300">🎭 Storytelling:</strong> Lifestyle, Day in My Life, Emotional Story, Problem → Solution, Transformation, Gifting, Story + Reveal.</div>
            <div><strong className="text-blue-300">🛍️ Product &amp; Shopping:</strong> Product Showcase, Unboxing, Unboxing + Review, Product Demo, Feature Highlight, Benefit Focus, Comparison.</div>
            <div><strong className="text-emerald-300">📱 Social &amp; UGC:</strong> UGC, POV, Review/Testimoni, First Impression, Reaksi, Challenge, ASMR Product, Satisfying.</div>
            <div><strong className="text-amber-300">⚡ Direct Response:</strong> Hook → Product → Benefit → CTA, Before → After, 3 Benefits, Top Features, Limited Promo, Q&amp;A.</div>
            <div><strong className="text-rose-300">🎬 Cinematic:</strong> Mini Commercial, Cinematic Product, Aesthetic, Slow Motion, Macro Shot, Emotional Cinematic.</div>
            <div><strong className="text-sky-300">📚 Educational:</strong> Tutorial, How To Use, Myth → Fact, Behind The Scenes, Expectation vs Reality.</div>
          </div>
          <p className="text-[11px] text-slate-400">
            Saat gaya dipilih, AI otomatis menyesuaikan <strong>Rantai Alur Adegan</strong> (Hook, Eksplorasi Karakter, Interaksi Produk, Detail, Pembuktian, hingga CTA), sudut kamera, pencahayaan, dan naskah Voice Over.
          </p>
        </div>

        {/* Section 2: Output TTI ke Flow AI / Midjourney */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            2. Cara Menghasilkan Lembar Storyboard di Flow AI / Midjourney
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Prompt TTI (Text-to-Image) di aplikasi ini telah direkayasa dengan teknik <em>Presentation Sheet Layout Prompting</em>. Saat Anda memasukkan prompt ini ke <strong>Flow AI</strong>, <strong>Midjourney v6</strong>, atau <strong>Flux</strong>, AI tidak hanya membuat satu foto, melainkan me-render:
          </p>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside bg-slate-950 p-3 rounded-xl border border-slate-800">
            <li>Header judul brand &amp; produk dengan banner kapsul modern</li>
            <li>Kotak spesifikasi teknis (Durasi, Part, Jumlah Scene, Rasio)</li>
            <li>Grid 3, 4, atau 6 panel scene dengan bingkai rapi</li>
            <li>Anotasi panah tulisan tangan (handwritten callouts)</li>
            <li>Tabel kamera (Shot, Angle, Durasi, VO, Subtitle) di bawah tiap scene</li>
            <li>Bar footer musik &amp; target audiens</li>
          </ul>
        </div>

        {/* Section 3: Output TTV ke Kling AI / Runway */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-pink-300 flex items-center gap-2">
            <Video className="w-4 h-4 text-pink-400" />
            3. Cara Menghasilkan Video Iklan di Kling AI / Runway Gen-3
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Untuk menghasilkan video iklan gerak nyata:
          </p>
          <div className="text-xs text-slate-300 space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p><strong>Langkah 1:</strong> Generate gambar per scene terlebih dahulu menggunakan prompt di tab TTI, atau gunakan foto produk asli Anda.</p>
            <p><strong>Langkah 2:</strong> Buka Kling AI / Runway Gen-3, pilih mode <em>Image-to-Video</em> (I2V).</p>
            <p><strong>Langkah 3:</strong> Upload gambar sebagai First Frame, lalu salin Prompt TTV Scene yang sudah menyertakan arahan kamera <code>[Camera: ...]</code>.</p>
            <p><strong>Langkah 4:</strong> Video akan bergerak mulus dengan pergerakan kamera komersial profesional tanpa distorsi subjek.</p>
          </div>
        </div>

        {/* Section 3: Pengaturan Voice Over & Pacing Durasi */}
        <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Kalibrasi Voice Over (VO) &amp; Pacing Audio
          </div>
          <p className="leading-relaxed">
            Setiap naskah VO per scene telah disinkronkan secara ketat dengan durasi video (kecepatan wicara standar ~2.2 kata per detik / 130 WPM). Hal ini menjamin pembacaan narasi terdengar santai, jelas, bebas dari efek belibet/terburu-buru, dan tidak ada kata yang terpotong. Anda juga dapat mendengarkan pratinjau audio langsung di tab <strong>Prompt TTV</strong> atau menu <strong>Teks to Suara</strong>.
          </p>
        </div>

        <div className="text-right pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Mengerti &amp; Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
