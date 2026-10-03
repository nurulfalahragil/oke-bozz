import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Sliders,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StoryboardData, TtiEngine } from '../types';

interface TtiOutputViewProps {
  data: StoryboardData;
  engine: TtiEngine;
  onChangeEngine: (engine: TtiEngine) => void;
}

export const TtiOutputView: React.FC<TtiOutputViewProps> = ({
  data,
  engine,
  onChangeEngine,
}) => {
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);
  const [expandedScenes, setExpandedScenes] = useState<boolean>(true);

  // Adapt prompt based on selected engine
  const formatPromptForEngine = (basePrompt: string, selectedEngine: TtiEngine) => {
    let clean = basePrompt.replace(/--ar\s+[0-9:]+/g, '').replace(/--v\s+[0-9.]+/g, '').replace(/--style\s+\w+/g, '').trim();

    switch (selectedEngine) {
      case 'flow':
        return `${clean}\n\n[Flow AI Settings: Commercial Poster Mode, High Text Coherence, 4K Upscale, Photorealistic Studio Grade]`;
      case 'midjourney':
        return `${clean} --ar 2:3 --v 6.1 --style raw --q 2`;
      case 'flux':
        return `${clean}, sharp typography, photographic 35mm lens commercial aesthetic, cinematic studio lighting, detailed layout`;
      case 'ideogram':
        return `${clean}, typography focus, clean vector lines, commercial advertising presentation sheet, crisp legible text`;
      case 'sdxl':
        return `masterpiece, ultra-high resolution, commercial advertising storyboard sheet, 2x2 grid layout, ${clean}, photorealistic, 8k`;
      default:
        return `${clean} --ar 2:3 --v 6.1`;
    }
  };

  const currentMasterPrompt = formatPromptForEngine(data.masterTtiPrompt, engine);

  const copyToClipboard = (text: string, type: 'master' | 'negative' | 'scene', id?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'master') {
      setCopiedMaster(true);
      setTimeout(() => setCopiedMaster(false), 2000);
    } else if (type === 'negative') {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    } else if (id) {
      setCopiedSceneId(id);
      setTimeout(() => setCopiedSceneId(null), 2000);
    }
  };

  const scenes = data.parts[0]?.scenes || [];

  if (scenes.length === 0) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/20">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-bold text-white">Prompt Storyboard (TTI) Siap Dibuat</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload foto produk (wajib), isi nama &amp; deskripsi di panel kiri, lalu klik tombol <strong>Generate Storyboard &amp; Prompt TTI / TTV</strong> untuk menghasilkan Master Prompt Storyboard Sheet dan prompt per adegan untuk Flow AI &amp; Midjourney.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Output 1
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Prompt Text to Image (TTI) — Lembar Storyboard
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Prompt ini dirancang khusus untuk menghasilkan gambar poster iklan bergaya storyboard utuh saat dimasukkan ke Flow AI, Midjourney, Flux, atau Ideogram.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 pl-2">Format Engine:</span>
            <select
              value={engine}
              onChange={(e) => onChangeEngine(e.target.value as TtiEngine)}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="flow">Flow AI</option>
              <option value="midjourney">Midjourney v6.1</option>
              <option value="flux">Flux.1 Pro</option>
              <option value="ideogram">Ideogram 2.0</option>
              <option value="sdxl">Stable Diffusion XL</option>
              <option value="leonardo">Leonardo AI</option>
            </select>
          </div>
        </div>
      </div>

      {/* MASTER STORYBOARD GRID PROMPT */}
      <div className="bg-slate-800/80 rounded-2xl border border-indigo-500/40 overflow-hidden shadow-lg">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Master Prompt Lembar Storyboard Utuh ({scenes.length === 6 ? 'Grid 3x2 (6 Scene)' : scenes.length === 3 ? 'Grid 1x3 (3 Scene)' : 'Grid 2x2 (4 Scene)'} + Header + Specs)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(currentMasterPrompt, 'master')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              copiedMaster
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMaster ? 'Tersalin ke Clipboard!' : 'Salin Prompt Master TTI'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-indigo-100 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap select-all">
            {currentMasterPrompt}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                Engine Target: <strong className="text-slate-200 capitalize">{engine}</strong> (Otomatis menyertakan parameter layout storyboard)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {currentMasterPrompt.length} karakter
            </span>
          </div>
        </div>
      </div>

      {/* NEGATIVE PROMPT */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Negative Prompt (Untuk Mencegah Glitch Teks & Tangan Cacat)
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(data.masterTtiNegativePrompt, 'negative')}
            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            {copiedNegative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedNegative ? 'Tersalin' : 'Salin Negative'}</span>
          </button>
        </div>
        <p className="font-mono text-xs text-rose-200/90 bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all">
          {data.masterTtiNegativePrompt}
        </p>
      </div>

      {/* INDIVIDUAL SCENE PROMPTS (ACCORDION) */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedScenes(!expandedScenes)}
          className="w-full px-5 py-3.5 bg-slate-900/60 hover:bg-slate-900 transition flex items-center justify-between text-left cursor-pointer border-b border-slate-700/50"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Prompt TTI Per Scene Individual (Jika Ingin Render Frame Terpisah Resolusi Tinggi)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{scenes.length} Scene</span>
            {expandedScenes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {expandedScenes && (
          <div className="p-4 sm:p-5 space-y-4">
            {scenes.map((sc, idx) => (
              <div
                key={sc.id || idx}
                className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-bold">
                      {sc.sceneNumber}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Scene {sc.sceneNumber}: {sc.phaseTitle} ({sc.timeRange})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sc.scenePromptTti, 'scene', sc.id)}
                    className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSceneId === sc.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSceneId === sc.id ? 'Tersalin' : 'Salin Scene Prompt'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed select-all">
                  {sc.scenePromptTti}
                </p>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400">
                  <span>Shot: <strong className="text-slate-300">{sc.shot}</strong></span>
                  <span>Angle: <strong className="text-slate-300">{sc.angle}</strong></span>
                  <span>VO: <em className="text-slate-300">"{sc.vo}"</em></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WORKFLOW GUIDE FOR FLOW AI / MIDJOURNEY */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4" />
          Panduan Praktis Cara Generate di Flow AI / Midjourney:
        </h4>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            Salin <strong>Master Prompt Lembar Storyboard Utuh</strong> di atas dengan tombol salin.
          </li>
          <li>
            Buka platform <strong>Flow AI</strong> atau <strong>Midjourney Discord (/imagine)</strong>.
          </li>
          <li>
            Jika Anda ingin menyertakan gambar produk nyata, gunakan fitur <strong>Image Reference (Image-to-Image / Prompt Reference)</strong> dengan mengupload foto produk Anda bersama prompt tersebut.
          </li>
          <li>
            Prompt sudah dilengkapi parameter rasio <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">--ar 2:3</code> dan styling presentation board sehingga hasilnya akan otomatis berformat 4-panel storyboard dengan kartu metadata dan callout mirip gambar referensi.
          </li>
        </ol>
      </div>
    </div>
  );
};
