import React, { useState, useMemo } from 'react';
import {
  Palette,
  Clock,
  Layers,
  LayoutGrid,
  Smartphone,
  Cpu,
  Video,
  Check,
  Sparkles,
  Search,
  Camera,
  Sun,
  Mic,
  ArrowRight,
  ListTree,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { AspectRatio, StoryboardCategory, StoryboardStructure, StoryboardStyle, TtiEngine, TtvEngine } from '../types';
import {
  ALL_STORYBOARD_STYLES,
  STORYBOARD_CATEGORIES,
  STRUCTURE_FLOW_PRESETS,
  getStyleById,
  StoryboardStyleItem
} from '../data/storyboardStyles';

interface StoryboardConfigProps {
  style: StoryboardStyle;
  onChangeStyle: (style: StoryboardStyle, category?: StoryboardCategory) => void;
  category?: StoryboardCategory;
  onChangeCategory?: (cat: StoryboardCategory) => void;
  structure?: StoryboardStructure;
  onChangeStructure?: (struct: StoryboardStructure) => void;
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

const DURATION_OPTIONS = [10, 15, 20, 30, 60];
const PANEL_OPTIONS = [
  { count: 3, label: '3 Scene', desc: 'Hook → Feature → CTA' },
  { count: 4, label: '4 Scene', desc: '2x2 Grid Standar Referensi', isDefault: true },
  { count: 6, label: '6 Scene', desc: '3x2 Grid Storytelling Lengkap' },
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
  category,
  onChangeCategory,
  structure = 'auto',
  onChangeStructure,
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
  const currentStyleItem = useMemo(() => getStyleById(style), [style]);

  // Active Category filter tab (defaults to 'all' so users see all available styles immediately)
  const [activeCategory, setActiveCategory] = useState<StoryboardCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);

  // Filtered styles based on category and search
  const filteredStyles = useMemo(() => {
    return ALL_STORYBOARD_STYLES.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.suitableFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSelectStyle = (item: StoryboardStyleItem) => {
    onChangeStyle(item.id, item.category);
    if (onChangeCategory) {
      onChangeCategory(item.category);
    }
  };

  const activeStructurePreset = useMemo(() => {
    return STRUCTURE_FLOW_PRESETS.find((p) => p.id === structure) || STRUCTURE_FLOW_PRESETS[0];
  }, [structure]);

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
            4
          </div>
          <div>
            <h2 className="font-semibold text-white text-base">Gaya Storyboard &amp; Konfigurasi Alur</h2>
            <p className="text-xs text-slate-400">Pilih gaya storytelling untuk otomatis menentukan kamera, lighting, pose &amp; alur adegan</p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          38 Gaya Tersedia
        </span>
      </div>

      {/* 1. KATEGORI TABS UTAMA (6 Kategori) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            1. Kategori Gaya Storyboard
          </label>

          {/* Quick Search */}
          <div className="relative w-44 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gaya (UGC, POV, Promo...)"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-8 pr-2.5 py-1 text-[11px] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>✨</span>
            <span>Semua</span>
            <span className="text-[10px] opacity-75">({ALL_STORYBOARD_STYLES.length})</span>
          </button>

          {STORYBOARD_CATEGORIES.map((cat) => {
            const count = ALL_STORYBOARD_STYLES.filter((s) => s.category === cat.id).length;
            const isCatActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (onChangeCategory) onChangeCategory(cat.id);
                }}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border text-center ${
                  isCatActive
                    ? `bg-gradient-to-r ${cat.gradient} text-white border-white/30 shadow-md`
                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={cat.description}
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.shortTitle}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Description Banner */}
        {activeCategory !== 'all' && (
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="line-clamp-1">
              {STORYBOARD_CATEGORIES.find((c) => c.id === activeCategory)?.description}
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold shrink-0 ml-2">
              {filteredStyles.length} pilihan
            </span>
          </div>
        )}
      </div>

      {/* 2. GRID PILIHAN GAYA STORYBOARD */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            2. Pilih Gaya Storyboard:
          </label>
          <span className="text-[11px] text-slate-400">
            Terpilih: <strong className="text-emerald-400 font-semibold">{currentStyleItem.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredStyles.map((item) => {
            const isSelected = style === item.id;
            return (
              <button
                key={`${item.category}-${item.id}`}
                type="button"
                onClick={() => handleSelectStyle(item)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/40'
                    : 'border-slate-700/80 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{item.icon}</span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200 group-hover:text-white'}`}>
                        {item.name}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : item.badge ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-2">
                    {item.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate">
                    Cocok: <span className="text-slate-300">{item.suitableFor}</span>
                  </span>
                  {isSelected && (
                    <span className="text-emerald-400 font-bold shrink-0 ml-1">Aktif</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STRUKTUR STORYBOARD (ALUR ADEGAN OTOMATIS) */}
      <div className="bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 rounded-xl p-4 border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <ListTree className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                Struktur Storyboard
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  Auto Disinkronkan dengan "{currentStyleItem.name}"
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Alur cerita, ritme adegan, dan peran produk disesuaikan otomatis oleh AI
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          {onChangeStructure && (
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={structure}
                onChange={(e) => onChangeStructure(e.target.value as StoryboardStructure)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {STRUCTURE_FLOW_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Visual Structure Flow Pills */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
            <span>Rantai Alur Adegan:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            {activeStructurePreset.steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 text-[9px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  {step}
                </span>
                {idx < activeStructurePreset.steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Live 6-Scene Breakdown for Selected Style */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span>🎬 Rincian 6 Adegan Spesifik ({currentStyleItem.name}):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFullBreakdown(!showFullBreakdown)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{showFullBreakdown ? 'Sembunyikan' : 'Tampilkan Detail'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullBreakdown ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFullBreakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {currentStyleItem.structureBreakdown.map((sceneDesc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      SCENE {idx + 1}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {numPanels === 6 ? `${Math.round(duration / 6)}s` : `${Math.round(duration / numPanels)}s`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug font-medium">
                    {sceneDesc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camera, Lighting & Voiceover Specs of Selected Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
            <Camera className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Gaya Kamera:</span>
              <span className="text-slate-200 leading-tight">{currentStyleItem.cameraStyle}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
            <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Pencahayaan / Mood:</span>
              <span className="text-slate-200 leading-tight">{currentStyleItem.lightingStyle}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
            <Mic className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold">Nada Voiceover (VO):</span>
              <span className="text-slate-200 leading-tight">{currentStyleItem.voTone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Durasi Video, Jumlah Part, & Jumlah Scene per Part */}
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
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-sm'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sec}s
                  {sec === 20 && <span className="block text-[8px] text-amber-400 font-normal">Optimal</span>}
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
                      ? 'border-blue-500 bg-blue-500/20 text-blue-200 shadow-sm'
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
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200 shadow-sm'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label.split(' ')[0]} {item.label.split(' ')[1]}
                  {item.count === 6 && <span className="block text-[8px] text-purple-300 font-normal">3x2 Grid</span>}
                  {item.count === 4 && <span className="block text-[8px] text-purple-300 font-normal">2x2 Grid</span>}
                  {item.count === 3 && <span className="block text-[8px] text-purple-300 font-normal">1x3 Grid</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Aspect Ratio & Target Engines */}
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
                      ? 'border-sky-500 bg-sky-500/20 text-sky-200 shadow-sm'
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
            <option value="midjourney">Midjourney v6.1 (Poster &amp; Grid Mode)</option>
            <option value="flux">Flux.1 Pro / Dev (Photorealistic)</option>
            <option value="ideogram">Ideogram 2.0 (Akurasi Teks Tinggi)</option>
            <option value="sdxl">Stable Diffusion XL</option>
            <option value="leonardo">Leonardo AI</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Prompt TTI disesuaikan otomatis dengan syntax dan grid parameter engine terpilih.
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
            Prompt TTV memuat bracket kamera [Camera: Dolly / Pan], subject action, dan cue waktu.
          </p>
        </div>
      </div>
    </div>
  );
};
