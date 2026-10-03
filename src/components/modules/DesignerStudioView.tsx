import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  MinusCircle, 
  Lightbulb, 
  Copy, 
  Check, 
  FileText, 
  RotateCw, 
  Users, 
  Eye, 
  Palette, 
  LayoutGrid, 
  Type, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Video, 
  Loader2,
  Wand2
} from 'lucide-react';

interface DesignerStudioViewProps {
  productName?: string;
  tagline?: string;
  productImage?: string;
  brandName?: string;
}

interface YoutubeTitleItem {
  title: string;
  hook: string;
}

interface YoutubeMetaData {
  titles: YoutubeTitleItem[];
  description: string;
  tags: string;
  hashtags: string;
}

interface GeneratedPromptData {
  professionalPrompt: string;
  negativePrompt: string;
  strategyTargetAudience: string;
  strategyVisualApproach: string;
  strategyColorStrategy: string;
  strategyLayoutStrategy: string;
  strategyTypographyStrategy: string;
}

export const DesignerStudioView: React.FC<DesignerStudioViewProps> = ({
  productName,
  tagline,
}) => {
  // ================= STATE =================
  const [idea, setIdea] = useState(
    productName 
      ? `Poster promosi komersial untuk ${productName}${tagline ? ` - ${tagline}` : ''}, desain modern dan elegan.`
      : ''
  );
  const [aspectRatio, setAspectRatio] = useState<string>('--ar 1:1');
  const [selectedType, setSelectedType] = useState<'Infografis' | 'Poster' | 'Banner' | 'Thumbnail'>('Infografis');

  // YouTube Viral Kit State
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [ytMetaData, setYtMetaData] = useState<YoutubeMetaData | null>(null);
  const [selectedTitleIndices, setSelectedTitleIndices] = useState<number[]>([0]);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedPromptData | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'negative' | 'strategy'>('prompt');

  // Copy Feedback & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastError, setIsToastError] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (message: string, isError = false) => {
    setToastMessage(message);
    setIsToastError(isError);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedKey(key);
        showToast('Berhasil disalin ke clipboard!');
        setTimeout(() => setCopiedKey(null), 2000);
      },
      () => {
        showToast('Gagal menyalin text', true);
      }
    );
  };

  const handleTypeSelect = (type: 'Infografis' | 'Poster' | 'Banner' | 'Thumbnail') => {
    setSelectedType(type);
    if (type === 'Thumbnail') {
      setAspectRatio('--ar 16:9');
    }
  };

  const toggleTitleSelection = (index: number) => {
    if (selectedTitleIndices.includes(index)) {
      if (selectedTitleIndices.length === 1) {
        showToast('Minimal 1 judul video harus dipilih!', true);
        return;
      }
      setSelectedTitleIndices(selectedTitleIndices.filter((i) => i !== index));
    } else {
      setSelectedTitleIndices([...selectedTitleIndices, index]);
    }
  };

  // Generate YouTube Viral Kit (Metadata SEO)
  const generateYoutubeMeta = async () => {
    const trimmed = idea.trim();
    if (trimmed.length < 10) {
      showToast('Mohon masukkan ide minimal 10 karakter terlebih dahulu.', true);
      return;
    }

    setIsLoadingMeta(true);
    try {
      const response = await fetch('/api/designer/youtube-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi API server');
      }

      const data = await response.json();
      if (data && Array.isArray(data.titles)) {
        setYtMetaData(data);
        setSelectedTitleIndices([0]);
        showToast('Metadata YouTube berhasil digenerate!');
      } else {
        throw new Error('Format metadata tidak sesuai');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Gagal menghasilkan metadata. Coba lagi.', true);
    } finally {
      setIsLoadingMeta(false);
    }
  };

  // Generate Professional Design Prompt
  const generatePrompt = async () => {
    const trimmed = idea.trim();
    if (trimmed.length < 10) {
      showToast('Mohon masukkan ide minimal 10 karakter.', true);
      return;
    }

    // Validation for Thumbnail
    if (selectedType === 'Thumbnail') {
      if (!ytMetaData || selectedTitleIndices.length === 0) {
        showToast("WAJIB: Klik 'Generate Judul & Metadata SEO' dan ceklist minimal 1 judul!", true);
        return;
      }
    }

    setIsGenerating(true);
    try {
      const selectedTitles =
        selectedType === 'Thumbnail' && ytMetaData
          ? selectedTitleIndices.map((idx) => ytMetaData.titles[idx])
          : [];

      const response = await fetch('/api/designer/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: trimmed,
          type: selectedType,
          aspectRatio,
          selectedTitles,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses prompt desain di server');
      }

      const data = await response.json();
      if (data && data.professionalPrompt) {
        setGeneratedData(data);
        setActiveTab('prompt');
        showToast('Prompt berhasil dibuat!');
      } else {
        throw new Error('Format prompt tidak sesuai');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Terjadi kesalahan saat menghubungi AI Engine.', true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to TXT
  const exportToTxt = () => {
    if (!generatedData) return;

    const content = `OVAL DESIGN PROMPT GENERATOR
=============================
Ide Asli:
${idea}

Parameter:
Aspect Ratio: ${aspectRatio}
Jenis Desain: ${selectedType}

=============================
PROFESSIONAL PROMPT:
${generatedData.professionalPrompt}

=============================
NEGATIVE PROMPT:
${generatedData.negativePrompt}

=============================
DESIGN STRATEGY:
- Target Audience: ${generatedData.strategyTargetAudience}
- Visual Approach: ${generatedData.strategyVisualApproach}
- Color Strategy: ${generatedData.strategyColorStrategy}
- Layout Strategy: ${generatedData.strategyLayoutStrategy}
- Typography Strategy: ${generatedData.strategyTypographyStrategy}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OvalPrompt_${Date.now()}.txt`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File berhasil diexport!');
  };

  return (
    <div className="bg-[#0B0F19] text-white font-sans rounded-3xl border border-[#2A344F]/50 overflow-hidden shadow-2xl min-h-[90vh] flex flex-col relative">
      
      {/* ================= SUB-HEADER ================= */}
      <header className="w-full border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Wand2 className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Oval <span className="text-sky-400 font-light">Design Prompt</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Professional AI Prompt Engine</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2 bg-[#151A2D]/80 border border-[#2A344F]/60 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono text-xs">Engine Ready</span>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT PANEL: INPUT FORM ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Step 1: Idea Input */}
            <div className="bg-[#151A2D]/80 backdrop-blur-md border border-[#2A344F]/50 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold font-mono">1</span>
                <h2 className="text-base sm:text-lg font-semibold text-white">Masukkan Ide Desain</h2>
              </div>
              <label htmlFor="ideaInput" className="block text-xs text-gray-400 mb-2">
                Deskripsikan visual yang ingin Anda buat secara sederhana.
              </label>
              <textarea
                id="ideaInput"
                rows={5}
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, 5000))}
                className="w-full bg-[#0B0F19]/70 border border-[#2A344F] rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none leading-relaxed"
                placeholder="Contoh:&#10;Poster PPDB SD Negeri 4 Weding&#10;Banner Jual Beli Barang Bekas&#10;Thumbnail Youtube Cara Cepat Viral&#10;Infografis Bahaya Sampah Plastik"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                <span>Min 10 karakter</span>
                <span className={idea.length >= 5000 ? 'text-red-400 font-bold' : ''}>
                  {idea.length} / 5000
                </span>
              </div>
            </div>

            {/* Step 2: Aspect Ratio */}
            <div className="bg-[#151A2D]/80 backdrop-blur-md border border-[#2A344F]/50 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold font-mono">2</span>
                <h2 className="text-base sm:text-lg font-semibold text-white">Pilih Aspect Ratio</h2>
              </div>
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-[#0B0F19]/70 border border-[#2A344F] rounded-xl p-3 pl-4 pr-10 text-xs sm:text-sm text-white appearance-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer font-mono"
                >
                  <optgroup label="Sosial Media" className="bg-[#151A2D] text-white">
                    <option value="--ar 1:1">1:1 Square (Feed)</option>
                    <option value="--ar 4:5">4:5 Instagram Portrait</option>
                    <option value="--ar 9:16">9:16 Story/Reels/Tiktok</option>
                    <option value="--ar 16:9">16:9 Youtube Thumbnail</option>
                    <option value="--ar 3:4">3:4 Poster Portrait</option>
                    <option value="--ar 4:3">4:3 Landscape</option>
                  </optgroup>
                  <optgroup label="Cetak / Print" className="bg-[#151A2D] text-white">
                    <option value="--ar 1:1.414 (A4 Portrait)">A4 Portrait</option>
                    <option value="--ar 1.414:1 (A4 Landscape)">A4 Landscape</option>
                    <option value="--ar 1:1.5 (F4 Portrait)">F4 Portrait</option>
                    <option value="--ar 1.5:1 (F4 Landscape)">F4 Landscape</option>
                    <option value="--ar 1:1.414 (A3 Portrait)">A3 Portrait</option>
                    <option value="--ar 1.414:1 (A3 Landscape)">A3 Landscape</option>
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Step 3: Design Type */}
            <div className="bg-[#151A2D]/80 backdrop-blur-md border border-[#2A344F]/50 rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold font-mono">3</span>
                <h2 className="text-base sm:text-lg font-semibold text-white">Jenis Desain</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Infografis */}
                <div
                  onClick={() => handleTypeSelect('Infografis')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedType === 'Infografis'
                      ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/15'
                      : 'bg-[#1E253D]/40 border-white/5 hover:bg-[#1E253D]/80 hover:border-sky-400/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">📊</div>
                  <h3 className="font-semibold text-white text-sm mb-1">Infografis</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Visual edukatif dengan data, statistik, dan tata letak profesional.</p>
                </div>

                {/* Poster */}
                <div
                  onClick={() => handleTypeSelect('Poster')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedType === 'Poster'
                      ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/15'
                      : 'bg-[#1E253D]/40 border-white/5 hover:bg-[#1E253D]/80 hover:border-sky-400/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">🖼️</div>
                  <h3 className="font-semibold text-white text-sm mb-1">Poster</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Desain promosi dengan visual menarik &amp; fokus pesan utama.</p>
                </div>

                {/* Banner */}
                <div
                  onClick={() => handleTypeSelect('Banner')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedType === 'Banner'
                      ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/15'
                      : 'bg-[#1E253D]/40 border-white/5 hover:bg-[#1E253D]/80 hover:border-sky-400/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">📢</div>
                  <h3 className="font-semibold text-white text-sm mb-1">Banner</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Promosi dengan headline kuat dan visual penarik perhatian.</p>
                </div>

                {/* Thumbnail */}
                <div
                  onClick={() => handleTypeSelect('Thumbnail')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedType === 'Thumbnail'
                      ? 'bg-sky-500/10 border-sky-500 shadow-lg shadow-sky-500/15'
                      : 'bg-[#1E253D]/40 border-white/5 hover:bg-[#1E253D]/80 hover:border-sky-400/30'
                  }`}
                >
                  <div className="text-2xl mb-1.5">▶️</div>
                  <h3 className="font-semibold text-white text-sm mb-1">Thumbnail</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Visual Youtube CTR tinggi yang memancing klik.</p>
                </div>
              </div>

              {/* THUMBNAIL EXTRAS (YOUTUBE VIRAL KIT) */}
              {selectedType === 'Thumbnail' && (
                <div className="mt-6 pt-5 border-t border-[#2A344F]/50 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                      <Video size={18} className="text-rose-500" /> YouTube Viral Kit
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Dapatkan 5 ide judul viral dan metadata SEO sebelum membuat prompt gambar agar hasilnya relevan.
                  </p>

                  <button
                    type="button"
                    onClick={generateYoutubeMeta}
                    disabled={isLoadingMeta}
                    className="w-full bg-[#0B0F19] border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 active:scale-98 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoadingMeta ? (
                      <>
                        <Loader2 className="animate-spin" size={17} />
                        <span>Menganalisis SEO...</span>
                      </>
                    ) : (
                      <>
                        <Flame size={17} />
                        <span>{ytMetaData ? 'Regenerate Metadata SEO' : 'Generate Judul & Metadata SEO'}</span>
                      </>
                    )}
                  </button>

                  {/* Meta Results Area */}
                  {ytMetaData && (
                    <div className="space-y-4 pt-2">
                      {/* Titles Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                          Pilih Judul Video (Ceklist yang diinginkan)
                        </label>
                        <div className="space-y-2">
                          {ytMetaData.titles.map((item, index) => {
                            const isChecked = selectedTitleIndices.includes(index);
                            return (
                              <label
                                key={index}
                                className={`flex p-3 border rounded-xl cursor-pointer transition-all items-start gap-3 ${
                                  isChecked
                                    ? 'border-rose-500 bg-rose-500/10'
                                    : 'border-[#2A344F] bg-[#0B0F19]/40 hover:border-rose-500/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleTitleSelection(index)}
                                  className="mt-1 w-4 h-4 accent-rose-500 rounded cursor-pointer shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white text-xs mb-1 leading-snug">{item.title}</div>
                                  <div className="text-[10px] text-sky-400 bg-sky-500/10 inline-flex items-center px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                                    <Lightbulb size={11} className="mr-1 text-sky-400" />
                                    Hook: {item.hook}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
                            Deskripsi Lengkap
                          </label>
                          <button
                            onClick={() => copyToClipboard(ytMetaData.description, 'ytDesc')}
                            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedKey === 'ytDesc' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            <span>{copiedKey === 'ytDesc' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="w-full bg-[#0B0F19]/60 border border-[#2A344F] rounded-lg p-3 text-xs text-gray-300 h-24 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                          {ytMetaData.description}
                        </div>
                      </div>

                      {/* Tags & Hashtags */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
                            Tags &amp; Hashtags (SEO)
                          </label>
                          <button
                            onClick={() => copyToClipboard(`${ytMetaData.tags}\n\n${ytMetaData.hashtags}`, 'ytTags')}
                            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedKey === 'ytTags' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            <span>{copiedKey === 'ytTags' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="w-full bg-[#0B0F19]/60 border border-[#2A344F] rounded-lg p-3 text-xs text-gray-300 h-20 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                          {`${ytMetaData.tags}\n\n${ytMetaData.hashtags}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePrompt}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="text-white group-hover:animate-pulse" />
                  <span>Generate Professional Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* ================= RIGHT PANEL: RESULT AREA ================= */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-[#151A2D]/80 backdrop-blur-md rounded-2xl flex flex-col h-full overflow-hidden border border-[#2A344F]/50 border-t-4 border-t-sky-500 shadow-2xl">
              
              {/* Tabs Header */}
              <div className="flex border-b border-[#2A344F] bg-[#0B0F19]/40">
                <button
                  className={`flex-1 py-4 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'prompt'
                      ? 'text-white border-b-2 border-sky-500 bg-white/5'
                      : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('prompt')}
                >
                  <Terminal size={16} /> Professional Prompt
                </button>
                <button
                  className={`flex-1 py-4 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'negative'
                      ? 'text-white border-b-2 border-sky-500 bg-white/5'
                      : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('negative')}
                >
                  <MinusCircle size={16} /> Negative Prompt
                </button>
                <button
                  className={`flex-1 py-4 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'strategy'
                      ? 'text-white border-b-2 border-sky-500 bg-white/5'
                      : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('strategy')}
                >
                  <Lightbulb size={16} /> Design Strategy
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-grow p-6 relative bg-[#0d121f] min-h-[460px]">
                
                {/* Empty State */}
                {!generatedData && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-500">
                    <Wand2 size={54} className="text-gray-700 mb-4 stroke-[1.5]" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-400 mb-2">Menunggu Ide Brilian Anda</h3>
                    <p className="text-xs sm:text-sm max-w-sm text-gray-500 leading-relaxed">
                      Masukkan ide desain di panel kiri dan klik Generate untuk melihat keajaiban AI Prompt Engine.
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d121f] z-10 p-6 text-center">
                    <div className="w-12 h-12 border-3 border-white/10 border-b-sky-500 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-sky-400 font-medium animate-pulse text-base sm:text-lg">Menyusun Prompt Profesional...</h3>
                    <p className="text-xs text-gray-500 mt-2">AI sedang menganalisis komposisi, warna, dan tipografi.</p>
                  </div>
                )}

                {/* Tab 1: Professional Prompt */}
                {generatedData && activeTab === 'prompt' && !isGenerating && (
                  <div className="bg-[#0B0F19] border border-[#2A344F] rounded-xl p-5 h-full relative flex flex-col">
                    <div className="flex items-center justify-between mb-3 border-b border-[#2A344F]/50 pb-2">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold font-mono">
                        Generated Prompt ({aspectRatio})
                      </h4>
                      <button
                        onClick={() => copyToClipboard(generatedData.professionalPrompt, 'promptMain')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer"
                        title="Copy Prompt"
                      >
                        {copiedKey === 'promptMain' ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1 pr-2 text-gray-200 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap select-all">
                      {generatedData.professionalPrompt}
                    </div>
                  </div>
                )}

                {/* Tab 2: Negative Prompt */}
                {generatedData && activeTab === 'negative' && !isGenerating && (
                  <div className="bg-[#0B0F19] border border-red-900/30 rounded-xl p-5 h-full relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-red-900/30 pb-2">
                        <h4 className="text-xs uppercase tracking-wider text-rose-400 font-semibold font-mono">
                          Negative Prompt
                        </h4>
                        <button
                          onClick={() => copyToClipboard(generatedData.negativePrompt, 'promptNegative')}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer"
                          title="Copy Negative Prompt"
                        >
                          {copiedKey === 'promptNegative' ? (
                            <>
                              <Check size={14} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy Negative</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-[300px] pr-2 text-gray-300 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap select-all">
                        {generatedData.negativePrompt}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 mt-4 flex items-center gap-2">
                      <AlertCircle size={16} className="text-rose-400 shrink-0" />
                      <span>Gunakan parameter ini di kolom negative prompt pada AI Generator Anda (Midjourney --no, Flux, dll).</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Strategy */}
                {generatedData && activeTab === 'strategy' && !isGenerating && (
                  <div className="overflow-y-auto h-full pr-2 space-y-3.5">
                    {/* 1. Target Audience */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-400 bg-sky-500/10 p-2 rounded-lg">
                          <Users size={18} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Target Audience</h5>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{generatedData.strategyTargetAudience}</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Visual Approach */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-400 bg-sky-500/10 p-2 rounded-lg">
                          <Eye size={18} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Visual Approach</h5>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{generatedData.strategyVisualApproach}</p>
                        </div>
                      </div>
                    </div>

                    {/* 3. Color Strategy */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-400 bg-sky-500/10 p-2 rounded-lg">
                          <Palette size={18} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Color Strategy</h5>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{generatedData.strategyColorStrategy}</p>
                        </div>
                      </div>
                    </div>

                    {/* 4. Layout Strategy */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-400 bg-sky-500/10 p-2 rounded-lg">
                          <LayoutGrid size={18} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Layout &amp; Composition</h5>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{generatedData.strategyLayoutStrategy}</p>
                        </div>
                      </div>
                    </div>

                    {/* 5. Typography Strategy */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-sky-400 bg-sky-500/10 p-2 rounded-lg">
                          <Type size={18} />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Typography Direction</h5>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{generatedData.strategyTypographyStrategy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Bar (Bottom of right panel) */}
              {generatedData && (
                <div className="border-t border-[#2A344F] bg-[#151A2D] p-4 flex flex-wrap gap-3 justify-end items-center">
                  <button
                    onClick={exportToTxt}
                    className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[#2A344F] bg-[#0B0F19] hover:bg-white/5 text-gray-300 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileText size={16} /> Export TXT
                  </button>
                  <button
                    onClick={generatePrompt}
                    disabled={isGenerating}
                    className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <RotateCw size={16} className={isGenerating ? 'animate-spin' : ''} /> Regenerate
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Message Box / Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 transition-all duration-300 border text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${
          isToastError ? 'bg-[#1e151d] border-red-900/60' : 'bg-[#151A2D] border-[#2A344F]'
        }`}>
          {isToastError ? (
            <AlertCircle className="text-rose-400 shrink-0" size={18} />
          ) : (
            <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
          )}
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
