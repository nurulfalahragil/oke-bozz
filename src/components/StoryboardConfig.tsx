import React from 'react';
import {
  Palette,
  Clock,
  Layers,
  LayoutGrid,
  Smartphone,
  Cpu,
  Video,
  Check,
  Sparkles
} from 'lucide-react';
import { AspectRatio, StoryboardStyle, TtiEngine, TtvEngine } from '../types';

interface StoryboardConfigProps {
  style: StoryboardStyle;
  onChangeStyle: (style: StoryboardStyle) => void;
  numParts: number;
  onChangeNumParts: (parts: number) => void;
  numPanels: number;
  onChangeNumPanels: (panels: number) => void;
  duration: number;
  onChangeDuration: (sec: number) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  targetTtiEngine: TtiEngine;
  onChangeTargetTtiEngine: (engine: TtiEngine) => void;
  targetTtvEngine: TtvEngine;
  onChangeTargetTtvEngine: (engine: TtvEngine) => void;
}

const STYLE_OPTIONS: { id: StoryboardStyle; name: string; desc: string; badge?: string }[] = [
  {
    id: 'lifestyle',
    name: 'Lifestyle Showcase',
    desc: 'Penggunaan nyata sehari-hari, outfit match, outdoor & indoor aesthetic.',
    badge: 'Paling Populer',
  },
  {
    id: 'before_after',
    name: 'Before / After (Masalah vs Solusi)',
    desc: 'Membandingkan kerepotan sebelum memakai produk vs kepuasan sesudahnya.',
  },
  {
    id: 'unboxing',
    name: 'Unboxing & First Impression',
    desc: 'Sensasi membuka paket, detail aksesoris, kompartemen, dan reaksi pertama.',
  },
  {
    id: 'testimonial',
    name: 'Testimoni & UGC Review Kreator',
    desc: 'Gaya review kreator TikTok, tatap kamera, jujur, santai, dan meyakinkan.',
  },
  {
    id: 'problem_solution',
    name: 'Pain Point / Problem - Solution',
    desc: 'Hook masalah umum yang dialami audiens langsung dijawab dengan produk.',
  },
  {
    id: 'asmr_detail',
    name: 'ASMR & Luxury Aesthetic Detail',
    desc: 'Fokus close up tekstur, suara resleting/klik, dan kemewahan material.',
  },
  {
    id: 'emotional_story',
    name: 'Emotional Storytelling',
    desc: 'Alur cerita hangat yang menghubungkan emosi audiens dengan manfaat produk.',
  },
];

const DURATION_OPTIONS = [10, 15, 20, 30, 60];
const PANEL_OPTIONS = [
  { count: 3, label: '3 Scene', desc: 'Hook → Feature → CTA' },
  { count: 4, label: '4 Scene (Standar Referensi)', desc: 'Hook → Detail/Insert → Lifestyle → Closing/CTA', isDefault: true },
  { count: 6, label: '6 Scene', desc: 'Hook → Masalah → Solusi → Detail → Lifestyle → CTA' },
];

const RATIO_OPTIONS: { ratio: AspectRatio; label: string; desc: string }[] = [
  { ratio: '9:16', label: '9:16 Vertikal', desc: 'TikTok, Reels, Shorts (Standar)' },
  { ratio: '16:9', label: '16:9 Horizontal', desc: 'YouTube & TVC Commercial' },
  { ratio: '1:1', label: '1:1 Persegi', desc: 'Instagram Feed & Carousel' },
  { ratio: '4:5', label: '4:5 Vertikal Feed', desc: 'Meta Ads & Instagram Feed' },
];

export const StoryboardConfig: React.FC<StoryboardConfigProps> = ({
  style,
  onChangeStyle,
  numParts,
  onChangeNumParts,
  numPanels,
  onChangeNumPanels,
  duration,
  onChangeDuration,
  aspectRatio,
  onChangeAspectRatio,
  targetTtiEngine,
  onChangeTargetTtiEngine,
  targetTtvEngine,
  onChangeTargetTtvEngine,
}) => {
  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
          4
        </div>
        <h2 className="font-semibold text-white text-base">Konfigurasi Alur & Format Storyboard</h2>
      </div>

      {/* 1. Gaya Storyboard */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-emerald-400" />
          Pilih Gaya Storyboard Iklan:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {STYLE_OPTIONS.map((item) => {
            const isSelected = style === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeStyle(item.id)}
                className={`text-left p-3 rounded-xl border transition cursor-pointer relative ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/50'
                    : 'border-slate-700/80 bg-slate-900/50 hover:bg-slate-700/40 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                {item.badge && (
                  <span className="inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Durasi Video, Jumlah Part, & Jumlah Scene per Part */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-700/50">
        {/* Durasi */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Total Durasi Video Iklan:
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {DURATION_OPTIONS.map((sec) => {
              const isSelected = duration === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChangeDuration(sec)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sec}s
                  {sec === 15 && <span className="block text-[8px] text-amber-400 font-normal">Ref</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jumlah Part */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Jumlah Part:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((p) => {
              const isSelected = numParts === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChangeNumParts(p)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p} Part
                  {p === 1 && <span className="block text-[8px] text-blue-300 font-normal">Standar</span>}
                  {p > 1 && <span className="block text-[8px] text-slate-400 font-normal">Seri Iklan</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jumlah Scene / Panel per Part */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
            Jumlah Panel per Part:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {PANEL_OPTIONS.map((item) => {
              const isSelected = numPanels === item.count;
              return (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => onChangeNumPanels(item.count)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label.split(' ')[0]} {item.label.split(' ')[1]}
                  {item.isDefault && <span className="block text-[8px] text-purple-300 font-normal">2x2 Grid</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Aspect Ratio & Target Engines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-700/50">
        {/* Aspect Ratio */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            Format Aspek Rasio:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {RATIO_OPTIONS.map((opt) => {
              const isSelected = aspectRatio === opt.ratio;
              return (
                <button
                  key={opt.ratio}
                  type="button"
                  onClick={() => onChangeAspectRatio(opt.ratio)}
                  className={`p-2 rounded-lg text-left border transition cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Engine TTI */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Target Engine TTI (Gambar):
          </label>
          <select
            value={targetTtiEngine}
            onChange={(e) => onChangeTargetTtiEngine(e.target.value as TtiEngine)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="flow">Flow AI (Direkomendasikan)</option>
            <option value="midjourney">Midjourney v6.1 (Poster & Grid Mode)</option>
            <option value="flux">Flux.1 Pro / Dev (Photorealistic)</option>
            <option value="ideogram">Ideogram 2.0 (Akurasi Teks Tinggi)</option>
            <option value="sdxl">Stable Diffusion XL</option>
            <option value="leonardo">Leonardo AI</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Prompt TTI akan disesuaikan otomatis dengan syntax dan parameter engine terpilih.
          </p>
        </div>

        {/* Target Engine TTV */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-pink-400" />
            Target Engine TTV (Video):
          </label>
          <select
            value={targetTtvEngine}
            onChange={(e) => onChangeTargetTtvEngine(e.target.value as TtvEngine)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="kling">Kling AI v1.5 (Format Gerakan Halus)</option>
            <option value="runway">Runway Gen-3 Alpha (Camera Director)</option>
            <option value="luma">Luma Dream Machine</option>
            <option value="sora">OpenAI Sora</option>
            <option value="minimax">Hailuo / Minimax Video</option>
            <option value="pika">Pika 2.0</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Prompt TTV akan memuat bracket kamera [Camera: Dolly / Pan], subject action, dan cue waktu.
          </p>
        </div>
      </div>
    </div>
  );
};
