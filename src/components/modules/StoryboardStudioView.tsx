import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Video,
  FileText,
  Copy,
  Download,
  CheckCircle2
} from 'lucide-react';
import { ProductUploader } from '../ProductUploader';
import { ModelSelector } from '../ModelSelector';
import { ProductDetailsForm } from '../ProductDetailsForm';
import { StoryboardConfig } from '../StoryboardConfig';
import { TtiOutputView } from '../TtiOutputView';
import { TtvOutputView } from '../TtvOutputView';
import { GeneratorRequest, StoryboardData } from '../../types';
import { generateStoryboardWithAi } from '../../services/storyboardGenerator';

interface StoryboardStudioViewProps {
  request: GeneratorRequest;
  setRequest: React.Dispatch<React.SetStateAction<GeneratorRequest>>;
  storyboardData: StoryboardData;
  setStoryboardData: React.Dispatch<React.SetStateAction<StoryboardData>>;
  onOpenGuide: () => void;
}

export const StoryboardStudioView: React.FC<StoryboardStudioViewProps> = ({
  request,
  setRequest,
  storyboardData,
  setStoryboardData,
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'tti' | 'ttv' | 'export'>('tti');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStage, setGeneratingStage] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!request.productImage) {
      alert('Harap upload gambar produk terlebih dahulu (Wajib)');
      return;
    }
    if (!request.productName.trim()) {
      alert('Harap isi nama produk terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    setGeneratingStage('Menganalisis karakteristik visual produk...');

    try {
      setTimeout(() => {
        setGeneratingStage('Menyusun struktur adegan & naskah VO iklan...');
      }, 700);

      setTimeout(() => {
        setGeneratingStage('Merekayasa Master Prompt TTI & arahan kamera TTV...');
      }, 1500);

      const result = await generateStoryboardWithAi(request);
      setStoryboardData(result);
      setIsGenerating(false);
      setGeneratingStage('');
    } catch (err) {
      console.error('Error generating storyboard:', err);
      setIsGenerating(false);
      setGeneratingStage('');
      alert('Terjadi kendala saat generate. Silakan coba lagi.');
    }
  };

  const handleUpdateSceneVo = (sceneId: string, newVo: string) => {
    setStoryboardData((prev) => {
      const newParts = prev.parts.map((part) => ({
        ...part,
        scenes: part.scenes.map((sc) => {
          if (sc.id === sceneId) {
            return {
              ...sc,
              vo: newVo,
              subtitle: newVo,
            };
          }
          return sc;
        }),
      }));
      return {
        ...prev,
        parts: newParts,
      };
    });
  };

  const handleCopyFullBrief = () => {
    const briefText = `=========================================
STORYBOARD IKLAN KOMERSIAL: ${storyboardData.brandName || 'PRODUK'} - ${storyboardData.productName}
Tagline: ${storyboardData.tagline}
Durasi: ${storyboardData.durationTotal} detik | Part: ${storyboardData.partsCount} | Scene: ${storyboardData.scenesCount} | Rasio: ${storyboardData.aspectRatio}
Target: ${storyboardData.targetAudience} | Musik: ${storyboardData.musicRecommendation}
=========================================

[OUTPUT 1: PROMPT TEXT TO IMAGE (TTI) - MASTER STORYBOARD SHEET]
${storyboardData.masterTtiPrompt}

Negative Prompt:
${storyboardData.masterTtiNegativePrompt}

[OUTPUT 2: PROMPT TEXT TO VIDEO (TTV)]
${storyboardData.masterTtvPrompt}

Arahan Audio & SFX:
${storyboardData.bgmSfxNotes}

Rincian Adegan:
${storyboardData.parts[0]?.scenes.map((s) => `
--- SCENE ${s.sceneNumber} (${s.phaseTitle}) [${s.timeRange}] ---
Shot: ${s.shot} | Angle: ${s.angle}
VO: "${s.vo}"
Subtitle: ${s.subtitle}
Callout: ${s.calloutText || '-'}
Prompt TTI: ${s.scenePromptTti}
Prompt TTV: ${s.scenePromptTtv}
`).join('\n')}
=========================================`;

    navigator.clipboard.writeText(briefText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadBrief = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storyboardData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Storyboard-Prompt-${(storyboardData.productName || 'ad').replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Configuration Studio (Tahap 1 - 4) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Studio Input Iklan Storyboard
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Lengkapi 4 tahapan untuk generate prompt TTI &amp; TTV
              </p>
            </div>
          </div>

          {/* Tahap 1: Foto Produk (Wajib) */}
          <ProductUploader
            image={request.productImage}
            onChange={(img) => setRequest({ ...request, productImage: img })}
          />

          {/* Tahap 2: Karakter Model (Opsional) */}
          <ModelSelector
            modelImage={request.modelImage}
            onChangeModelImage={(img) => setRequest({ ...request, modelImage: img })}
          />

          {/* Tahap 3: Deskripsi Produk */}
          <ProductDetailsForm
            productName={request.productName}
            onChangeProductName={(val) => setRequest({ ...request, productName: val })}
            description={request.productDescription}
            onChangeDescription={(val) => setRequest({ ...request, productDescription: val })}
          />

          {/* Tahap 4: Konfigurasi Storyboard */}
          <StoryboardConfig
            style={request.storyboardStyle}
            onChangeStyle={(st) => setRequest({ ...request, storyboardStyle: st })}
            numParts={request.numParts}
            onChangeNumParts={(parts) => setRequest({ ...request, numParts: parts })}
            numPanels={request.numPanels}
            onChangeNumPanels={(panels) => setRequest({ ...request, numPanels: panels })}
            duration={request.duration}
            onChangeDuration={(sec) => setRequest({ ...request, duration: sec })}
            aspectRatio={request.aspectRatio}
            onChangeAspectRatio={(ratio) => setRequest({ ...request, aspectRatio: ratio })}
            targetTtiEngine={request.targetTtiEngine}
            onChangeTargetTtiEngine={(eng) => setRequest({ ...request, targetTtiEngine: eng })}
            targetTtvEngine={request.targetTtvEngine}
            onChangeTargetTtvEngine={(eng) => setRequest({ ...request, targetTtvEngine: eng })}
          />

          {/* MAIN GENERATE BUTTON */}
          <div className="pt-2 sticky bottom-4 z-20">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-white/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{generatingStage || 'Memproses AI Storyboard...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Generate Storyboard &amp; Prompt TTI / TTV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Studio (Prompt TTI & TTV) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Tabs Navigation */}
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                type="button"
                onClick={() => setActiveTab('tti')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tti'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Output 1: Prompt TTI</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-200 border border-purple-400/30 px-1.5 py-0.2 rounded-full">
                  Flow AI / Midjourney
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ttv')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'ttv'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-4 h-4 text-pink-300" />
                <span>Output 2: Prompt TTV</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-200 border border-pink-400/30 px-1.5 py-0.2 rounded-full">
                  Kling / Runway
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Dokumen Brief</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2">
              <button
                type="button"
                onClick={handleCopyFullBrief}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Salin semua prompt & arahan produksi sekaligus"
              >
                {copiedAll ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Tersalin!' : 'Salin Semua'}</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT PANELS */}
          <div>
            {/* TAB 1: PROMPT TTI */}
            {activeTab === 'tti' && (
              <TtiOutputView
                data={storyboardData}
                engine={request.targetTtiEngine}
                onChangeEngine={(eng) => setRequest({ ...request, targetTtiEngine: eng })}
              />
            )}

            {/* TAB 2: PROMPT TTV */}
            {activeTab === 'ttv' && (
              <TtvOutputView
                data={storyboardData}
                engine={request.targetTtvEngine}
                onChangeEngine={(eng) => setRequest({ ...request, targetTtvEngine: eng })}
                onUpdateSceneVo={handleUpdateSceneVo}
              />
            )}

            {/* TAB 3: PRODUCTION EXPORT */}
            {activeTab === 'export' && (
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Dokumen Brief &amp; Paket Produksi Iklan
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Unduh atau salin seluruh data storyboard, Master Prompt TTI, instruksi TTV, dan cue audio untuk dibagikan kepada tim konten, copywriter, atau video editor.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Download JSON Storyboard
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Simpan struktur data lengkap termasuk durasi, naskah VO, dan prompt dalam file JSON terstandar.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadBrief}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Unduh File JSON (.json)
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Salin Seluruh Ringkasan
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Salin naskah lengkap, prompt TTI &amp; TTV, dan audio cue ke clipboard untuk ditempel di Notion, WhatsApp, atau Trello.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyFullBrief}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedAll ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      {copiedAll ? 'Semua Berhasil Tersalin!' : 'Salin Seluruh Naskah & Prompt'}
                    </button>
                  </div>
                </div>

                {/* Summary Overview */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono text-slate-300 leading-relaxed">
                  <p className="font-bold text-indigo-400">Ringkasan Konfigurasi Iklan:</p>
                  <p>• Produk: {storyboardData.productName || 'Belum diisi'} ({storyboardData.brandName || '-'})</p>
                  <p>• Gaya: {storyboardData.style.toUpperCase()}</p>
                  <p>• Format: {storyboardData.durationTotal}s | {storyboardData.scenesCount} Scene | {storyboardData.aspectRatio}</p>
                  <p>• Target Audiens: {storyboardData.targetAudience}</p>
                  <p>• BGM &amp; Suara: {storyboardData.musicRecommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
