import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Copy,
  CheckCircle2,
  FileText,
  Video,
  ImageIcon,
  Share2,
  RefreshCw,
  Clock,
  Smartphone,
  Tag,
  ArrowRight,
  Volume2,
  Check
} from 'lucide-react';
import { SimpleAdData, SimpleAdFormat, GeneratorRequest } from '../../types';
import {
  generateSimpleAd,
  SIMPLE_AD_FORMATS,
  SimpleAdRequestInput,
} from '../../services/simpleAdGenerator';

interface SimpleAdStudioViewProps {
  request: GeneratorRequest;
  setRequest: React.Dispatch<React.SetStateAction<GeneratorRequest>>;
  onSwitchToStoryboard: () => void;
  onSwitchToTts?: (script: string) => void;
}

export const SimpleAdStudioView: React.FC<SimpleAdStudioViewProps> = ({
  request,
  setRequest,
  onSwitchToStoryboard,
  onSwitchToTts,
}) => {
  const [format, setFormat] = useState<SimpleAdFormat>('hook_viral');
  const [duration, setDuration] = useState<number>(15);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>(
    request.aspectRatio === '16:9' ? '16:9' : request.aspectRatio === '1:1' ? '1:1' : '9:16'
  );
  const [keyFeature, setKeyFeature] = useState<string>(
    request.productFeatures?.[0] || 'Kualitas bahan premium dan praktis dibawa'
  );
  const [pricePromo, setPricePromo] = useState<string>('Promo Diskon 40% Hari Ini');
  const [voTone, setVoTone] = useState<SimpleAdRequestInput['voTone']>('energetic');

  const [activeOutputTab, setActiveOutputTab] = useState<'script' | 'tti' | 'ttv' | 'caption'>('script');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initial generated data state
  const [result, setResult] = useState<SimpleAdData>(() => {
    return {
      productName: request.productName || 'Tas Selempang Wanita',
      brandName: request.brandName || 'OVAL IKLAN',
      format: 'hook_viral',
      formatName: 'Hook Viral & Solusi Kilat',
      duration: 15,
      platform: 'TikTok / Reels / Shorts (9:16)',
      hookHeadline: 'Stop scroll! Ini rahasia praktis buat kamu yang mau tampil modis tanpa ribet',
      fullVoScript: 'Stop scroll! Cari tas kecil yang muat banyak? Ini dia tas selempang kulit premium dengan double gold zipper. Lagi ada diskon 40%, checkout di keranjang kuning sekarang sebelum kehabisan!',
      scenes: [
        {
          timeRange: '0 - 3 Detik (Hook)',
          title: 'Pattern Interrupt Hook',
          visualAction: 'Model muda memegang tas di depan kamera outdoor dengan senyum ramah dan gestur stop scroll.',
          cameraDirection: '[Camera: Quick Snap Zoom in to product]',
          voScript: 'Stop scroll! Cari tas kecil yang muat banyak?',
          onScreenText: 'STOP SCROLL! Tas Kecil Muat Banyak 🔥',
        },
        {
          timeRange: '3 - 10 Detik (Solusi & Demo)',
          title: 'Demonstrasi Fitur Utama',
          visualAction: 'Tangan membuka tas memperlihatkan multi kompartemen rapi berisi HP, dompet, dan makeup.',
          cameraDirection: '[Camera: Top-down POV angle close-up]',
          voScript: 'Ini dia tas kulit sintetis premium dengan resleting ganda yang halus dan awet.',
          onScreenText: 'Bahan Premium & Muat Banyak ✨',
        },
        {
          timeRange: '10 - 15 Detik (CTA)',
          title: 'Call to Action Mendesak',
          visualAction: 'Model tersenyum memegang tas di depan dada dengan badge promo diskon 40%.',
          cameraDirection: '[Camera: Slow push-in focus on CTA banner]',
          voScript: 'Lagi ada promo diskon 40%, checkout di keranjang kuning sekarang sebelum kehabisan!',
          onScreenText: 'Checkout di Keranjang Kuning 🛒',
        },
      ],
      ttiVisualPrompt: 'Commercial viral TikTok ad hero shot for "Tas Selempang Wanita". Indonesian young woman with cream hijab in sage green blouse holding brown tan crossbody bag, vibrant modern street background, clean text overlay "STOP SCROLL! 🔥", high resolution 8k commercial photography --ar 9:16 --v 6.1',
      ttvVideoPrompt: '[Camera: Dynamic TikTok vertical video] Fast-paced 15-second commercial ad for Tas Selempang Wanita. Creator grabs viewer attention in first 3 seconds, transitions to hands-on unzipping showing spacious pockets, ending with smiling creator pointing to yellow cart. 60fps smooth kinetic motion.',
      captionCopy: 'Gak nyangka nemu tas sekecil ini tapi muatnya banyak banget! 😭✨ Bahannya kulit sintetis premium, resletingnya halus gak gampang seret. Mumpung lagi promo diskon 40%, buruan checkout di keranjang kuning ya! 🛒👇',
      hashtags: ['#RacunTikTok', '#TasWanita', '#OOTDHijab', '#TasKecilMuatBanyak', '#PromoSpesial', '#DiskonHariIni'],
    };
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = async () => {
    if (!request.productName.trim()) {
      alert('Harap masukkan nama produk terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateSimpleAd({
        productImage: request.productImage,
        productName: request.productName,
        brandName: request.brandName,
        tagline: request.tagline,
        keyFeature: keyFeature.trim() || 'Kualitas premium & praktis digunakan',
        pricePromo: pricePromo.trim() || 'Promo Spesial Hari Ini',
        format,
        duration,
        aspectRatio,
        voTone,
      });
      setResult(generated);
    } catch (err) {
      console.error('Error generating simple ad:', err);
      alert('Gagal generate iklan simpel. Coba sesaat lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation: Sub-menu switch between Storyboard & Iklan Simpel */}
      <div className="bg-slate-900/90 rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Sub Menu: Iklan Simpel
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1-Click Fast Ad
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Buat naskah video 15–30s, prompt foto TTI, prompt video TTV, dan caption viral instan
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={onSwitchToStoryboard}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Storyboard Lengkap</span>
          </button>

          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md cursor-default flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Iklan Simpel</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Iklan Simpel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/70">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Input Iklan Cepat
              </h3>
              <span className="text-[11px] text-slate-400">15 – 30 Detik</span>
            </div>

            {/* Nama Produk */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Nama Produk *</span>
                <span className="text-[10px] text-slate-400 font-normal">Wajib</span>
              </label>
              <input
                type="text"
                value={request.productName}
                onChange={(e) => setRequest((prev) => ({ ...prev, productName: e.target.value }))}
                placeholder="Contoh: Tas Selempang Kulit Wanita / Serum Wajah"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition"
              />
            </div>

            {/* Keunggulan Utama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Keunggulan Utama / Masalah yang Diselesaikan
              </label>
              <input
                type="text"
                value={keyFeature}
                onChange={(e) => setKeyFeature(e.target.value)}
                placeholder="Contoh: Bahan anti air, muat banyak HP & dompet, ringan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition"
              />
            </div>

            {/* Promo / Call to Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Penawaran / Promo Khusus
              </label>
              <input
                type="text"
                value={pricePromo}
                onChange={(e) => setPricePromo(e.target.value)}
                placeholder="Contoh: Diskon 40% Hari Ini / Beli 1 Gratis 1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden transition"
              />
            </div>

            {/* Format Iklan Simpel */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Pilih Format Iklan Simpel:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIMPLE_AD_FORMATS.map((item) => {
                  const isSelected = format === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormat(item.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30 text-white shadow-md'
                          : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{item.icon}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                            isSelected ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="font-bold text-xs">{item.name}</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opsi Aspek Rasio & Durasi */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  Aspek Rasio
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        aspectRatio === ratio
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  Durasi Iklan
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {[15, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        duration === sec
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {sec} Detik
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nada Voiceover */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Gaya / Nada Voiceover:
              </label>
              <select
                value={voTone}
                onChange={(e) => setVoTone(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-amber-500 focus:outline-hidden"
              >
                <option value="energetic">Antusias & Ceria (Kreator TikTok Viral)</option>
                <option value="casual_ugc">Santai & Relatable (Honest UGC Review)</option>
                <option value="hard_sell">Tegas & Mendesak (Flash Sale / Hard Selling)</option>
                <option value="soft_luxury">Elegan & Mewah (Brand Eksklusif)</option>
                <option value="calm_asmr">Menenangkan & Bisikan (ASMR / Skincare)</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-white/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menyusun Naskah &amp; Prompt Iklan...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                  <span>⚡ Generate Iklan Simpel Instan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Iklan Simpel */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Header Card */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h3 className="font-extrabold text-white text-base">
                  Hasil Iklan Simpel: {result.productName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Format: <strong className="text-amber-400">{result.formatName}</strong> • {result.duration} Detik • {result.platform}
              </p>
            </div>

            {onSwitchToTts && (
              <button
                type="button"
                onClick={() => onSwitchToTts(result.fullVoScript)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kirim ke Teks to Suara</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveOutputTab('script')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeOutputTab === 'script'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Naskah &amp; VO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOutputTab('tti')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeOutputTab === 'tti'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-md'
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Prompt Foto TTI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOutputTab('ttv')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeOutputTab === 'ttv'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-400 shadow-md'
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>3. Prompt Video TTV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOutputTab('caption')}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeOutputTab === 'caption'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>4. Caption &amp; Hashtag</span>
            </button>
          </div>

          {/* TAB 1: Naskah & Voiceover */}
          {activeOutputTab === 'script' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Struktur Naskah Iklan (0 - {result.duration} Detik)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Total {result.fullVoScript.split(/\s+/).filter(Boolean).length} kata • Estimasi durasi bicara ~{result.duration}s
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(result.fullVoScript, 'full_vo')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'full_vo' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Naskah Lengkap</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hook Card */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  🔥 Hook Utama (3 Detik Pertama)
                </span>
                <p className="text-sm font-extrabold text-white">
                  "{result.hookHeadline}"
                </p>
              </div>

              {/* Timeline Scenes */}
              <div className="space-y-3">
                {result.scenes.map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {sc.timeRange}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-300">
                        {sc.title}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Aksi Visual:</strong> {sc.visualAction}
                      </div>
                      <div className="text-slate-400">
                        <strong className="text-indigo-400">Kamera:</strong> {sc.cameraDirection}
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                        <strong className="text-amber-300 font-bold block text-[11px] mb-0.5">Voiceover:</strong>
                        "{sc.voScript}"
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        Overlay Text: {sc.onScreenText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Prompt Foto TTI */}
          {activeOutputTab === 'tti' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    Prompt Foto Iklan (Text-to-Image)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gunakan pada Flow AI / Midjourney v6 / Flux untuk render visual iklan profesional
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(result.ttiVisualPrompt, 'tti')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'tti' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt TTI</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                {result.ttiVisualPrompt}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                <strong className="text-slate-300 block">💡 Tips Penggunaan TTI:</strong>
                <p>1. Salin prompt di atas ke AI generator (Flow AI / Midjourney / Flux).</p>
                <p>2. Gunakan parameter aspek rasio <code className="text-indigo-300">--ar {aspectRatio}</code> sesuai target platform iklan Anda.</p>
              </div>
            </div>
          )}

          {/* TAB 3: Prompt Video TTV */}
          {activeOutputTab === 'ttv' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    Prompt Video Iklan (Text-to-Video)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gunakan pada Kling AI / Runway Gen-3 / Sora / Luma Dream Machine
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(result.ttvVideoPrompt, 'ttv')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'ttv' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt TTV</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-200 leading-relaxed whitespace-pre-wrap select-all">
                {result.ttvVideoPrompt}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                <strong className="text-slate-300 block">💡 Tips Penggunaan TTV:</strong>
                <p>1. Copy prompt di atas ke Kling AI / Runway Gen-3 dengan mode Text-to-Video atau Image-to-Video.</p>
                <p>2. Upload foto produk yang sudah digenerate TTI sebagai referensi first frame untuk konsistensi maksimal.</p>
              </div>
            </div>
          )}

          {/* TAB 4: Caption & Hashtag */}
          {activeOutputTab === 'caption' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    Copywriting Caption &amp; Hashtag
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Siap diposting langsung ke TikTok, Instagram Reels, atau Meta Ads
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(`${result.captionCopy}\n\n${result.hashtags.join(' ')}`, 'caption')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption &amp; Tags</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {result.captionCopy}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {result.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
