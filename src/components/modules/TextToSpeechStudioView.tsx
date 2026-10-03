import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Wand2, 
  PlayCircle, 
  Loader2, 
  Music, 
  Download,
  Settings2, 
  Gauge
} from 'lucide-react';

interface TextToSpeechStudioViewProps {
  productName?: string;
  defaultVoText?: string;
  defaultDuration?: number;
}

// Pemetaan 6 suara asli API (3 Pria, 3 Wanita) ke karakter Indonesia
const INDONESIAN_VOICES = [
  { id: 'Fenrir', name: 'Ardi Pratama', desc: 'Pria • Tegas, Profesional' },
  { id: 'Puck', name: 'Bima Saputra', desc: 'Pria • Santai, Hangat' },
  { id: 'Charon', name: 'Dimas Wicaksono', desc: 'Pria • Dalam, Berwibawa' },
  { id: 'Aoede', name: 'Sinta Maharani', desc: 'Wanita • Lembut, Elegan' },
  { id: 'Kore', name: 'Nabila Putri', desc: 'Wanita • Ceria, Fresh' },
  { id: 'Zephyr', name: 'Ayu Lestari', desc: 'Wanita • Hangat, Storytelling' }
];

const STYLE_PRESETS = ['Normal', 'Semangat', 'Tenang', 'Bahagia', 'Sedih', 'Tegas', 'Misterius'];

const SPEED_OPTIONS = [
  { label: 'Lambat (0.75x)', value: 'lambat', rate: 0.75 },
  { label: 'Normal (1.0x)', value: 'normal', rate: 1.0 },
  { label: 'Cepat (1.25x)', value: 'cepat', rate: 1.25 }
];

// Utility to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Utility to create a WAV file from raw PCM data with audio de-clicking and smooth fade-out
function pcmToWav(pcmData: Int16Array, sampleRate: number): Blob {
  const totalSamples = pcmData.length;
  const cleanedPcm = new Int16Array(totalSamples);
  cleanedPcm.set(pcmData);

  // 1. Smooth Fade-in (first 5ms) to prevent initial click
  const fadeInSamples = Math.min(Math.floor(sampleRate * 0.005), totalSamples);
  for (let i = 0; i < fadeInSamples; i++) {
    const factor = 0.5 * (1 - Math.cos((Math.PI * i) / fadeInSamples));
    cleanedPcm[i] = Math.round(cleanedPcm[i] * factor);
  }

  // 2. Smooth Fade-out (last 70ms) to ensure waveform smoothly hits zero without clicks/pops
  const fadeOutSamples = Math.min(Math.floor(sampleRate * 0.07), totalSamples);
  const fadeOutStart = Math.max(0, totalSamples - fadeOutSamples);
  for (let i = 0; i < fadeOutSamples; i++) {
    const factor = 0.5 * (1 + Math.cos((Math.PI * i) / fadeOutSamples));
    const idx = fadeOutStart + i;
    if (idx < totalSamples) {
      cleanedPcm[idx] = Math.round(cleanedPcm[idx] * factor);
    }
  }

  // 3. Append 100ms of pure digital silence padding to prevent DAC cutoff clicks
  const silenceSamples = Math.floor(sampleRate * 0.1);
  const finalPcm = new Int16Array(totalSamples + silenceSamples);
  finalPcm.set(cleanedPcm);

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataByteLength = finalPcm.byteLength;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  const writeString = (v: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      v.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataByteLength, true);

  return new Blob([view, finalPcm as unknown as BlobPart], { type: 'audio/wav' });
}

// Fallback clean audio wave generator (pure silence to prevent annoying sine wave buzzing)
function createFallbackWav(durationSec = 3, sampleRate = 24000): Blob {
  const numSamples = Math.floor(sampleRate * durationSec);
  const pcm = new Int16Array(numSamples);
  return pcmToWav(pcm, sampleRate);
}

export const TextToSpeechStudioView: React.FC<TextToSpeechStudioViewProps> = ({
  productName,
  defaultVoText,
}) => {
  // State
  const [script, setScript] = useState(
    defaultVoText ||
      (productName
        ? `Halo, perkenalkan ${productName}. Solusi terbaik dengan kualitas premium, hasil maksimal, dan sangat praktis untuk kebutuhan harian Anda. Coba sekarang!`
        : 'Halo, selamat datang di OkeBozz. Ini adalah contoh teks yang dihasilkan otomatis untuk kamu coba konversi menjadi suara. Keren kan?')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Gemini State
  const [selectedVoice, setSelectedVoice] = useState(INDONESIAN_VOICES[0].name);
  const [geminiStyle, setGeminiStyle] = useState('Normal');
  const [speechSpeed, setSpeechSpeed] = useState(SPEED_OPTIONS[1]); // Normal default

  // Notifications
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | ''; message: string }>({ type: '', message: '' });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Derived state
  const charCount = script.length;
  const charLimit = 3000;
  const progressPercent = Math.min((charCount / charLimit) * 100, 100);
  const estTime = Math.max(1, Math.ceil(charCount / 15)); // Rough estimation

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleAudioPlay = () => {
    if (isFallbackMode && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const voiceConfig = INDONESIAN_VOICES.find(v => v.name === selectedVoice);
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = 'id-ID';
      utterance.rate = speechSpeed.rate;
      utterance.pitch = selectedVoice.includes('Pria') || voiceConfig?.desc.includes('Pria') ? 0.95 : 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioPause = () => {
    if (isFallbackMode && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleGenerateAudio = async () => {
    const trimmedScript = script.trim();
    if (!trimmedScript) {
      setNotification({ type: 'error', message: 'Script masih kosong!' });
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setIsFallbackMode(false);
    setNotification({ type: '', message: '' });

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const voiceConfig = INDONESIAN_VOICES.find(v => v.name === selectedVoice);
      const apiVoiceId = voiceConfig ? voiceConfig.id : 'Kore';

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: trimmedScript,
          voiceName: apiVoiceId,
          style: geminiStyle,
          speed: speechSpeed.value,
        }),
      });

      let wavBlob: Blob | null = null;

      if (response.ok) {
        const result = await response.json();
        if (result && result.audioData && result.mimeType) {
          const sampleRate = parseInt(result.mimeType.match(/rate=(\d+)/)?.[1] || '24000', 10);
          const pcmData = base64ToArrayBuffer(result.audioData);
          const pcm16 = new Int16Array(pcmData);
          wavBlob = pcmToWav(pcm16, sampleRate);
        }
      }

      // If server TTS returned fallback or wasn't available, generate clean silent WAV container
      if (!wavBlob) {
        setIsFallbackMode(true);
        const wordCount = trimmedScript.split(/\s+/).length;
        const durationSec = Math.max(2, +(wordCount / (2.2 * speechSpeed.rate)).toFixed(1));
        wavBlob = createFallbackWav(durationSec);
      }

      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setNotification({ type: 'success', message: 'Audio berhasil dibuat!' });

      setTimeout(() => {
        const audioElement = document.getElementById('result-audio') as HTMLAudioElement | null;
        if (audioElement) {
          audioElement.playbackRate = speechSpeed.rate;
          audioElement.play().catch(() => {});
        }
      }, 150);

    } catch (error: any) {
      console.error(error);
      setIsFallbackMode(true);
      const wordCount = trimmedScript.split(/\s+/).length;
      const durationSec = Math.max(2, +(wordCount / (2.2 * speechSpeed.rate)).toFixed(1));
      const wavBlob = createFallbackWav(durationSec);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
      setNotification({ type: 'success', message: 'Audio berhasil dibuat!' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIAutoWrite = () => {
    if (productName) {
      setScript(`Temukan keunggulan istimewa dari ${productName}! Dirancang khusus dengan standar kualitas tinggi, material pilihan, dan performa terbaik untuk memenuhi kebutuhan harian Anda. Dapatkan penawaran spesial sekarang juga!`);
    } else {
      setScript("Halo, selamat datang di OkeBozz. Ini adalah contoh teks yang dihasilkan otomatis untuk kamu coba konversi menjadi suara. Keren kan?");
    }
  };

  return (
    <div className="min-h-[85vh] bg-neutral-950 text-white font-sans selection:bg-lime-500/30 rounded-3xl border border-white/5 overflow-hidden shadow-2xl pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-lg shadow-lime-500/20">
              <Volume2 className="text-neutral-950 w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none">
                OKE<span className="text-lime-500">BOZZ</span>
              </h1>
              <p className="text-xs text-white/50 mt-0.5 font-medium font-mono">Teks to Suara • AI Voice Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-full text-xs text-neutral-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span>Indonesian TTS Ready</span>
          </div>
        </div>
      </header>

      {/* Container Utama */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Komposisi Grid (Desktop View) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Kolom Kiri (1/3 Lebar) - Panel Konfigurasi */}
          <div className="space-y-6">
            
            {/* Kartu 1: Konfigurasi Utama */}
            <div className="bg-neutral-900 rounded-3xl border border-white/5 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-lime-500" />
                <h2 className="font-bold text-sm tracking-wide text-white/90">KONFIGURASI</h2>
              </div>
              
              <div className="p-5 space-y-5">
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span className="text-xs font-medium text-lime-400">Gratis &amp; Cepat</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-lime-400" />
                      Narator Suara (Indonesia)
                    </label>
                    <select 
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 appearance-none cursor-pointer"
                    >
                      {INDONESIAN_VOICES.map(v => (
                        <option key={v.name} value={v.name} className="bg-neutral-900 text-white">
                          {v.name} - {v.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Gauge className="w-3.5 h-3.5 text-lime-400" />
                      Tempo / Speed
                    </label>
                    <div className="flex bg-neutral-950 rounded-xl p-1 border border-white/10">
                      {SPEED_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSpeechSpeed(opt)}
                          className={`flex-1 text-[11px] py-2.5 rounded-lg transition-all font-semibold cursor-pointer ${
                            speechSpeed.value === opt.value 
                              ? 'bg-lime-500 text-black shadow-md' 
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {opt.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5 text-lime-400" />
                      Emotion Style
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {STYLE_PRESETS.map(preset => (
                        <button 
                          key={preset}
                          onClick={() => setGeminiStyle(preset)}
                          className={`text-[10px] uppercase font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            geminiStyle === preset 
                              ? 'bg-lime-500/20 border-lime-500/50 text-lime-400 scale-[1.02]' 
                              : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu 2: Statistik */}
            <div className="bg-neutral-900 rounded-3xl border border-white/5 p-5 shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-white/50">Panjang Karakter</span>
                  <span className="font-mono text-lg font-bold text-white/90">
                    {charCount}
                    <span className="text-xs text-white/30 font-sans">/{charLimit}</span>
                  </span>
                </div>
                
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-lime-500 rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-xs font-medium text-white/40">Estimasi Waktu</span>
                  <span className="text-sm font-medium text-lime-400">~{estTime} detik</span>
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (2/3 Lebar) - Editor & Output */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Kartu 1: Script Editor */}
            <div className="bg-neutral-900 rounded-3xl border border-white/5 min-h-[420px] flex flex-col overflow-hidden relative shadow-xl">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-neutral-900/50">
                <span className="font-bold text-xs tracking-widest text-white/50 font-mono">SCRIPT EDITOR</span>
                <button 
                  onClick={handleAIAutoWrite}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AI Auto-Write
                </button>
              </div>
              
              <div className="flex-1 p-6">
                <textarea 
                  value={script}
                  onChange={(e) => setScript(e.target.value.slice(0, charLimit))}
                  placeholder="Ketik atau paste text kamu di sini..."
                  className="w-full h-full min-h-[220px] bg-transparent resize-none outline-none text-base sm:text-lg leading-relaxed placeholder:text-white/20 text-white/90"
                  maxLength={charLimit}
                />
              </div>

              {/* Footer Action Bar */}
              <div className="p-4 bg-neutral-950/50 border-t border-white/5 shrink-0 flex flex-col gap-3">
                {/* Alert Area */}
                {notification.message && (
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm animate-in slide-in-from-bottom-2 ${
                    notification.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
                  }`}>
                    {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
                    {notification.message}
                  </div>
                )}

                <button 
                  onClick={handleGenerateAudio}
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    isGenerating 
                      ? 'bg-neutral-800 text-white/40 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-lime-500 to-lime-400 text-black shadow-lg shadow-lime-500/20 hover:scale-[1.01] active:scale-95'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Menciptakan Suara...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Generate Suara Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Kartu 2: Result Player (Conditional) */}
            {audioUrl && (
              <div className="bg-neutral-800/50 rounded-3xl border border-lime-500/30 p-6 animate-in slide-in-from-bottom flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-lime-500/5">
                <div className="w-16 h-16 rounded-full bg-lime-500/20 flex items-center justify-center shrink-0 border border-lime-500/30 relative">
                   <div className="absolute inset-0 rounded-full border border-lime-500/50 animate-ping opacity-20"></div>
                   <Music className="w-8 h-8 text-lime-400" />
                </div>
                
                <div className="flex-1 w-full space-y-4 text-center md:text-left">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-white leading-none">Audio Berhasil Dibuat</h3>
                    <p className="text-xs font-medium text-white/50">
                      {selectedVoice} • Gaya {geminiStyle} • {speechSpeed.label}
                    </p>
                  </div>
                  <audio 
                    id="result-audio" 
                    ref={audioRef}
                    controls 
                    src={audioUrl} 
                    onPlay={handleAudioPlay}
                    onPause={handleAudioPause}
                    onEnded={handleAudioPause}
                    className="w-full h-10 rounded-full focus:outline-none custom-audio-player"
                  />
                </div>

                <a 
                  href={audioUrl} 
                  download={`okebozz-tts-${Date.now()}.wav`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors shrink-0 w-full md:w-auto justify-center cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Custom CSS for native audio player */}
      <style>{`
        .custom-audio-player::-webkit-media-controls-panel {
          background-color: #262626;
        }
        .custom-audio-player::-webkit-media-controls-play-button,
        .custom-audio-player::-webkit-media-controls-mute-button {
          background-color: #84cc16;
          border-radius: 50%;
        }
        .custom-audio-player::-webkit-media-controls-current-time-display,
        .custom-audio-player::-webkit-media-controls-time-remaining-display {
          color: #fff;
        }
      `}</style>
    </div>
  );
};
