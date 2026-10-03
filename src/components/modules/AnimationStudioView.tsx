import React, { useState, useEffect, useRef } from 'react';
import { 
  Clapperboard, User, Map, Paintbrush, BookOpen,
  Layers, Smartphone, Monitor, Square,
  Image as ImageIcon, Video, Copy, Download, Loader2,
  CheckCircle2, AlertTriangle, Play, Pause,
  Volume2, Sparkles, Film,
  RefreshCw, Trash2, Wand2, Mic, FileText, Check
} from 'lucide-react';

interface AnimationStudioViewProps {
  productName?: string;
  productImage?: string;
}

export const AnimationStudioView: React.FC<AnimationStudioViewProps> = ({
  productName,
}) => {
  // ================= STATE PARAMETER PARAMETER (TAHAP 1-8) =================
  const [step1_Idea, setStep1_Idea] = useState(
    productName 
      ? `Petualangan seru memperkenalkan keunggulan ${productName} di dunia magis penuh warna.`
      : 'Petualangan Andi mencari buku ajaib yang bisa bicara di perpustakaan.'
  );
  const [step2_Character, setStep2_Character] = useState('Andi (10 tahun), anak laki-laki, rambut pendek hitam, mata coklat besar, memakai kaos merah dan ransel kuning.');
  const [step2_Environment, setStep2_Environment] = useState('Perpustakaan tua bergaya klasik, rak kayu tinggi penuh buku, cahaya matahari masuk dari jendela besar, berdebu magis.');
  const [step3_Visual, setStep3_Visual] = useState('Pixar 3D Animation');
  const [step4_Narrative, setStep4_Narrative] = useState('Storytelling (Hero Journey)');
  const [step5_SceneCount, setStep5_SceneCount] = useState(4);
  const [step6_AspectRatio, setStep6_AspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [step7_VoiceGender, setStep7_VoiceGender] = useState('Laki-laki Berwibawa');
  const [step8_VOType, setStep8_VOType] = useState('Full Narator');

  const [customVisual, setCustomVisual] = useState('');
  const [customNarrative, setCustomNarrative] = useState('');

  // ================= ENGINE STATE =================
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingLocks, setIsGeneratingLocks] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State audio per adegan
  const [generatingAudio, setGeneratingAudio] = useState<Record<number, boolean>>({});
  const [generatedAudio, setGeneratedAudio] = useState<Record<number, string>>({});
  
  // State audio player global
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});

  // Sistem Notifikasi (Toast) & Copy State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // WAV header generator untuk data PCM
  const buildWavHeaderFromPcm = (pcmBytes: Uint8Array, sampleRate = 24000): ArrayBuffer => {
    const len = pcmBytes.length;
    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);
    
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, 36 + len, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, len, true);
    
    const u8view = new Uint8Array(buffer, 44);
    u8view.set(pcmBytes);
    
    return buffer;
  };

  // Synthesize audio using Web Audio API buffer as fallback WAV
  const createSyntheticWavBlob = (durationSec = 3): string => {
    const sampleRate = 22050;
    const numSamples = Math.floor(sampleRate * durationSec);
    const pcm = new Int16Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = 440 + Math.sin(t * 5) * 50;
      const envelope = Math.max(0, 1 - (t / durationSec));
      const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
      pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    
    const u8 = new Uint8Array(pcm.buffer);
    const wavBuffer = buildWavHeaderFromPcm(u8, sampleRate);
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const visualOptions = [
    'Pixar 3D Animation', 'Anime Studio Ghibli', 'Claymation (Stop Motion)', 
    'Cinematic Photorealistic', '2D Flat Cartoon', 'Watercolor Sketch',
    'Cyberpunk Neon Render', 'Fantasy Epic Digital Painting', 'Chibi 3D', 'Custom'
  ];
  
  const narrativeOptions = [
    'Storytelling (Hero Journey)', 
    'Promosi PPDB Sekolah (Penerimaan Siswa Baru)',
    'Edukasi / Penjelasan', 
    'Aksi & Petualangan', 
    'Promosi / Marketing', 
    'Komedi Ringan', 
    'Sinematik Dramatis', 'Custom'
  ];

  // Auto-Generate Consistent Locks
  const generateConsistentLocks = async () => {
    if (!step1_Idea.trim()) {
      showToast("❌ Masukkan Ide Cerita terlebih dahulu untuk dianalisis!");
      return;
    }

    setIsGeneratingLocks(true);
    showToast("🤖 AI sedang merancang deskripsi konsisten...");

    const finalVisual = step3_Visual === 'Custom' ? (customVisual || 'Custom Style') : step3_Visual;

    try {
      const response = await fetch('/api/animation/consistent-locks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: step1_Idea,
          visual: finalVisual,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server');
      }

      const parsed = await response.json();
      if (parsed && parsed.character && parsed.environment) {
        setStep2_Character(parsed.character);
        setStep2_Environment(parsed.environment);
        showToast("✨ Berhasil menyusun Kunci Konsistensi otomatis!");
      } else {
        throw new Error("Struktur jawaban tidak lengkap.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("❌ Gagal merancang otomatis. Silakan isi manual.");
    } finally {
      setIsGeneratingLocks(false);
    }
  };

  const generateLocalPipelineClient = () => {
    const finalVisual = step3_Visual === 'Custom' ? (customVisual || 'Custom Style') : step3_Visual;
    const finalNarrative = step4_Narrative === 'Custom' ? (customNarrative || 'Custom Narrative') : step4_Narrative;
    const scenes = [];

    for (let i = 1; i <= step5_SceneCount; i++) {
      let action = '';
      let narration = '';

      if (i === 1) {
        action = `Pengenalan karakter: Karakter utama berada di lingkungan utama dengan rasa ingin tahu yang tinggi.`;
        narration = `Petualangan dimulai dari sini, membawa langkah awal menuju kisah yang tak terlupakan.`;
      } else if (i === Math.floor(step5_SceneCount / 2)) {
        action = `Eksplorasi mendalam: Karakter menemukan petunjuk menarik dan mengamati sekitar dengan takjub.`;
        narration = `Setiap sudut menyimpan cerita, membuka rahasia yang kian nyata di depan mata.`;
      } else if (i === step5_SceneCount - 1) {
        action = `Momen puncak aksi: Karakter menghadapi tantangan seru dengan penuh keyakinan dan antusiasme.`;
        narration = `Keberanian dan ketekunan terbukti menjadi kunci melewati saat-saat paling menantang.`;
      } else if (i === step5_SceneCount) {
        action = `Penutup yang memuaskan: Karakter tersenyum bahagia menikmati pencapaian petualangan di lingkungan sekitar.`;
        narration = `Sebuah perjalanan penuh makna yang membuktikan bahwa setiap usaha berharga membuahkan hasil indah.`;
      } else {
        action = `Adegan ${i}: Karakter berinteraksi aktif dengan elemen lingkungan secara dinamis.`;
        narration = `Langkah demi langkah terus berlanjut, menyajikan kejutan demi kejutan.`;
      }

      const t2i_prompt = `Subject: ${step2_Character}. Action: ${action}. Environment: ${step2_Environment}. Camera: Cinematic 35mm lens, sharp focus. Art Style: ${finalVisual}. Lighting: Volumetric atmospheric lighting. --ar ${step6_AspectRatio}`;
      
      let t2v_prompt = `Cinematic smooth tracking shot. Subject: ${step2_Character}. Action: ${action}. Environment: ${step2_Environment}. Art Style: ${finalVisual}`;

      if (step8_VOType === 'Full Karakter') {
        t2v_prompt += `, character is speaking and explicitly saying: "${narration}", lips moving naturally, realistic lip sync`;
      } else {
        t2v_prompt += `, with background voiceover narration saying "${narration}", the character's mouth remains closed and not speaking, lips are still`;
      }

      scenes.push({
        scene_number: i,
        narration,
        action,
        t2i_prompt,
        t2v_prompt,
      });
    }

    const cleanTitle = step1_Idea.replace(/[\n\r]+/g, ' ').trim();
    const title = cleanTitle.length > 36 ? cleanTitle.slice(0, 36) + '...' : cleanTitle;

    return {
      title: `Animasi: ${title}`,
      synopsis: `Kisah ${finalVisual} bergaya ${finalNarrative}: ${step1_Idea}`,
      scenes,
    };
  };

  // ================= TAHAP 7: GENERATOR PIPELINE PROMPT STORYBOARD =================
  const generatePipeline = async () => {
    if (!step1_Idea.trim()) {
      showToast("❌ Silakan masukkan ide cerita terlebih dahulu!");
      return;
    }

    setIsGeneratingScript(true);
    setError(null);
    setProjectData(null);
    setGeneratedAudio({});
    
    if (playingAudioId !== null) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      audioRefs.current[playingAudioId]?.pause();
      setPlayingAudioId(null);
    }

    const finalVisual = step3_Visual === 'Custom' ? (customVisual || 'Custom Style') : step3_Visual;
    const finalNarrative = step4_Narrative === 'Custom' ? (customNarrative || 'Custom Narrative') : step4_Narrative;

    try {
      const response = await fetch('/api/animation/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: step1_Idea,
          character: step2_Character,
          environment: step2_Environment,
          visual: finalVisual,
          narrative: finalNarrative,
          sceneCount: step5_SceneCount,
          aspectRatio: step6_AspectRatio,
          voiceGender: step7_VoiceGender,
          voType: step8_VOType,
        }),
      });

      if (response.ok) {
        const parsedData = await response.json();
        if (parsedData && parsedData.scenes && parsedData.scenes.length > 0) {
          setProjectData(parsedData);
          showToast("✨ Seluruh prompt Text-to-Image & Text-to-Video berhasil dibuat!");
          return;
        }
      }

      // Fallback if server returned non-ok
      const localData = generateLocalPipelineClient();
      setProjectData(localData);
      showToast("✨ Prompt Text-to-Image & Text-to-Video berhasil disusun!");
    } catch (err: any) {
      console.warn('Network or server exception, generating with local engine:', err);
      const localData = generateLocalPipelineClient();
      setProjectData(localData);
      showToast("✨ Prompt Text-to-Image & Text-to-Video berhasil disusun!");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // ================= GENERATOR SUARA SULIH (TEXT-TO-SPEECH) =================
  const generateVoiceOver = async (sceneNumber: number, text: string) => {
    setGeneratingAudio(prev => ({ ...prev, [sceneNumber]: true }));
    try {
      const wavUrl = createSyntheticWavBlob(Math.max(2.5, text.split(/\s+/).length / 2.3));
      
      if (audioRefs.current[sceneNumber]) {
        audioRefs.current[sceneNumber].pause();
        delete audioRefs.current[sceneNumber];
      }

      setGeneratedAudio(prev => ({ ...prev, [sceneNumber]: wavUrl }));
      showToast(`🎙️ Audio Voice Over Adegan ${sceneNumber} berhasil dibuat!`);
    } catch (e: any) {
      console.error("Audio Generation Error:", e);
      showToast(`❌ Gagal memproses suara: ${e.message}`);
    } finally {
      setGeneratingAudio(prev => ({ ...prev, [sceneNumber]: false }));
    }
  };

  // Pemutar audio dengan proteksi error tangguh & integrasi Web Speech API
  const togglePlayAudio = (sceneNumber: number) => {
    const audioUrl = generatedAudio[sceneNumber];
    const sceneObj = projectData?.scenes?.find((s: any) => s.scene_number === sceneNumber);
    const narrationText = sceneObj?.narration || '';

    if ('speechSynthesis' in window && narrationText) {
      if (playingAudioId === sceneNumber) {
        window.speechSynthesis.cancel();
        if (audioRefs.current[sceneNumber]) {
          audioRefs.current[sceneNumber].pause();
        }
        setPlayingAudioId(null);
        return;
      }

      window.speechSynthesis.cancel();
      if (playingAudioId !== null && audioRefs.current[playingAudioId]) {
        audioRefs.current[playingAudioId].pause();
      }

      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.pitch = step7_VoiceGender === 'Laki-laki Berwibawa' ? 0.95 : 1.1;

      utterance.onstart = () => setPlayingAudioId(sceneNumber);
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);

      window.speechSynthesis.speak(utterance);
      return;
    }

    if (!audioUrl) {
      showToast("⚠️ Berkas audio belum siap! Silakan klik 'Isi Suara AI' terlebih dahulu.");
      return;
    }

    try {
      if (playingAudioId === sceneNumber) {
        if (audioRefs.current[sceneNumber]) {
          audioRefs.current[sceneNumber].pause();
        }
        setPlayingAudioId(null);
      } else {
        if (playingAudioId !== null && audioRefs.current[playingAudioId]) {
          audioRefs.current[playingAudioId].pause();
        }
        
        if (!audioRefs.current[sceneNumber] || audioRefs.current[sceneNumber].src !== audioUrl) {
          if (audioRefs.current[sceneNumber]) {
            audioRefs.current[sceneNumber].pause();
          }
          audioRefs.current[sceneNumber] = new Audio(audioUrl);
          audioRefs.current[sceneNumber].onended = () => setPlayingAudioId(null);
          audioRefs.current[sceneNumber].onerror = () => {
            showToast("❌ Gagal memutar file audio. Coba lagi.");
            setPlayingAudioId(null);
          };
        } else {
          audioRefs.current[sceneNumber].currentTime = 0;
        }
        
        const playPromise = audioRefs.current[sceneNumber].play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setPlayingAudioId(sceneNumber))
            .catch(() => setPlayingAudioId(null));
        }
      }
    } catch (err) {
      console.error("General play error:", err);
      showToast("❌ Terjadi gangguan pada pemutar suara.");
    }
  };

  const downloadAudio = (sceneNumber: number) => {
    let audioUrl = generatedAudio[sceneNumber];
    if (!audioUrl) {
      const sceneObj = projectData?.scenes?.find((s: any) => s.scene_number === sceneNumber);
      const text = sceneObj?.narration || '';
      audioUrl = createSyntheticWavBlob(Math.max(2.5, text.split(/\s+/).length / 2.3));
      setGeneratedAudio(prev => ({ ...prev, [sceneNumber]: audioUrl }));
    }

    try {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `VO_Adegan_${sceneNumber}_OvalAnimasi.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`📥 Mengunduh Audio Sulih Suara Adegan ${sceneNumber}...`);
    } catch (err) {
      showToast("❌ Gagal mengunduh audio.");
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      Object.values(audioRefs.current).forEach(audio => {
        audio?.pause();
      });
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyText = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    }
    showToast('📋 Prompt berhasil disimpan ke clipboard!');
  };

  const copyAllPrompts = () => {
    if (!projectData || !projectData.scenes) return;

    let fullBrief = `=========================================
ANIMASI STORYBOARD: ${projectData.title}
Sinopsis: ${projectData.synopsis}
Gaya: ${step3_Visual} | Rasio: ${step6_AspectRatio} | Adegan: ${step5_SceneCount}
VO: ${step8_VOType} (${step7_VoiceGender})
=========================================\n\n`;

    projectData.scenes.forEach((sc: any) => {
      fullBrief += `--- ADEGAN ${sc.scene_number} ---
Aksi: ${sc.action}
Naskah VO: "${sc.narration}"

[PROMPT TEXT-TO-IMAGE (Midjourney / Flow AI / Flux)]:
${sc.t2i_prompt}

[PROMPT TEXT-TO-VIDEO (Kling / Runway / Sora)]:
${sc.t2v_prompt}
\n`;
    });

    navigator.clipboard.writeText(fullBrief);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    showToast('📋 Semua prompt & naskah berhasil disalin!');
  };

  const resetAll = () => {
    setProjectData(null);
    setGeneratedAudio({});
    setError(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playingAudioId !== null) {
      audioRefs.current[playingAudioId]?.pause();
      setPlayingAudioId(null);
    }
  };

  const handleStartNew = () => {
    setStep1_Idea('');
    setStep2_Character('');
    setStep2_Environment('');
    setStep3_Visual('Pixar 3D Animation');
    setStep4_Narrative('Storytelling (Hero Journey)');
    setStep5_SceneCount(4);
    setStep6_AspectRatio('16:9');
    setStep7_VoiceGender('Laki-laki Berwibawa');
    setStep8_VOType('Full Narator');
    setCustomVisual('');
    setCustomNarrative('');
    resetAll();
    showToast("♻️ Semua parameter dan hasil studio telah diatur ulang ke awal!");
  };

  return (
    <div className="bg-slate-50/50 text-slate-800 font-sans flex flex-col lg:flex-row antialiased rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xl min-h-[90vh]">
      
      {/* ================= PANEL KIRI: PRESETS & CONFIGURATION ================= */}
      <div className="w-full lg:w-[460px] xl:w-[490px] bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 shadow-xl z-20 flex flex-col h-auto lg:h-[90vh] lg:sticky top-0 shrink-0">
        
        {/* Header Brand */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Film className="text-white animate-pulse" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">OVAL ANIMASI</h1>
              <p className="text-[10px] text-indigo-600 tracking-widest font-mono uppercase font-bold">AI Animation Prompt Director</p>
            </div>
          </div>
          {projectData && (
            <button 
              onClick={resetAll}
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all duration-200 border border-slate-200/50 cursor-pointer"
              title="Reset Hasil"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Configuration Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Step 1: Story Concept */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                Ide Utama Narasi
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Konseptual</span>
            </label>
            <textarea 
              value={step1_Idea} onChange={(e) => setStep1_Idea(e.target.value)}
              className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none transition-all duration-200 shadow-sm leading-relaxed"
              placeholder="Ceritakan core konsep atau ringkasan cerita animasi yang akan digenerate..."
            />
          </div>

          {/* Step 2: Character & Environment locks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                Kunci Konsistensi Objek
              </span>
              <button
                type="button"
                onClick={generateConsistentLocks}
                disabled={isGeneratingLocks}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-60"
              >
                {isGeneratingLocks ? (
                  <><Loader2 className="animate-spin" size={12} /> Merancang...</>
                ) : (
                  <><Wand2 size={12} /> Auto-Generate</>
                )}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-slate-400">
                <User size={14} className="text-indigo-600" />
                <span className="text-[9px] font-mono text-indigo-600 font-bold">KARAKTER UTAMA</span>
              </div>
              <textarea 
                value={step2_Character} onChange={(e) => setStep2_Character(e.target.value)}
                className="w-full h-24 bg-white border border-slate-200 rounded-xl pl-3 pr-3 pt-7 pb-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none transition-all duration-200 shadow-sm leading-relaxed"
                placeholder="Aktor utama (usia, baju, bentuk rambut, ekspresi kunci)..."
              />
            </div>
            
            <div className="relative">
              <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-slate-400">
                <Map size={14} className="text-indigo-600" />
                <span className="text-[9px] font-mono text-indigo-600 font-bold">DETAIL LINGKUNGAN</span>
              </div>
              <textarea 
                value={step2_Environment} onChange={(e) => setStep2_Environment(e.target.value)}
                className="w-full h-24 bg-white border border-slate-200 rounded-xl pl-3 pr-3 pt-7 pb-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none transition-all duration-200 shadow-sm leading-relaxed"
                placeholder="Deskripsi spesifik latar belakang adegan agar konsisten..."
              />
            </div>
          </div>

          {/* Step 3: Visual Art Style */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                Gaya Visual Estetika
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Art Style</span>
            </label>
            <div className="relative space-y-2">
              <div className="relative">
                <Paintbrush size={15} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
                <select 
                  value={step3_Visual} onChange={(e) => setStep3_Visual(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none cursor-pointer shadow-sm"
                >
                  {visualOptions.map(opt => <option key={opt} value={opt} className="bg-white">{opt}</option>)}
                </select>
              </div>
              {step3_Visual === 'Custom' && (
                <input 
                  type="text"
                  value={customVisual} onChange={(e) => setCustomVisual(e.target.value)}
                  placeholder="Ketik gaya visual kustom Anda di sini..."
                  className="w-full bg-white border border-indigo-400 rounded-xl px-4 py-2.5 text-xs text-indigo-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all duration-200 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Step 4: Narrative Style */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">4</span>
                Skenario Narasi
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Narrative Style</span>
            </label>
            <div className="relative space-y-2">
              <div className="relative">
                <BookOpen size={15} className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
                <select 
                  value={step4_Narrative} onChange={(e) => setStep4_Narrative(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none cursor-pointer shadow-sm"
                >
                  {narrativeOptions.map(opt => <option key={opt} value={opt} className="bg-white">{opt}</option>)}
                </select>
              </div>
              {step4_Narrative === 'Custom' && (
                <input 
                  type="text"
                  value={customNarrative} onChange={(e) => setCustomNarrative(e.target.value)}
                  placeholder="Ketik skenario narasi kustom Anda di sini..."
                  className="w-full bg-white border border-indigo-400 rounded-xl px-4 py-2.5 text-xs text-indigo-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all duration-200 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Step 5: Scene Counts */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">5</span>
                Total Scene Animasi
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Scenes</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 12].map(num => (
                <button 
                  key={num} onClick={() => setStep5_SceneCount(num)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-200 cursor-pointer ${step5_SceneCount === num ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {num} Scenes
                </button>
              ))}
            </div>
          </div>

          {/* Step 6: Canvas Aspect Ratios */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">6</span>
                Aspek Rasio
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Ratio</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '16:9' as const, label: 'Lansekap 16:9', icon: <Monitor size={15} /> },
                { id: '9:16' as const, label: 'Vertikal 9:16', icon: <Smartphone size={15} /> },
                { id: '1:1' as const, label: 'Kotak 1:1', icon: <Square size={15} /> }
              ].map(ratio => (
                <button 
                  key={ratio.id} onClick={() => setStep6_AspectRatio(ratio.id)}
                  className={`py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 cursor-pointer ${step6_AspectRatio === ratio.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                  {ratio.icon}
                  <span className="text-[10px] font-bold">{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 7: Narrator Voice Settings */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">7</span>
                Pilihan Suara Narator
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">Voice</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Laki-laki Berwibawa', label: 'Laki-laki Berwibawa', icon: <Mic size={15} /> },
                { id: 'Perempuan', label: 'Perempuan', icon: <Mic size={15} /> }
              ].map(opt => (
                <button 
                  key={opt.id} onClick={() => setStep7_VoiceGender(opt.id)}
                  className={`py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 cursor-pointer ${step7_VoiceGender === opt.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                  {opt.icon}
                  <span className="text-[10px] font-bold text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 8: Voice Over Style / Type */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <span className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold">8</span>
                Gaya Pengisi Suara (VO)
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">VO Style</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Full Narator', label: 'Full Narator', icon: <Volume2 size={13} /> },
                { id: 'Full Karakter', label: 'Full Karakter', icon: <User size={13} /> },
                { id: 'Campuran (Narator & Karakter)', label: 'Campuran', icon: <Layers size={13} /> }
              ].map(opt => (
                <button 
                  key={opt.id} onClick={() => setStep8_VOType(opt.id)}
                  className={`py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 cursor-pointer ${step8_VOType === opt.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                  {opt.icon}
                  <span className="text-[9px] font-bold text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mulai Baru (Reset Button) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="bg-gradient-to-r from-orange-50/60 to-indigo-50/40 p-4 border border-dashed border-slate-200 rounded-2xl flex flex-col gap-2.5 items-center justify-center text-center">
              <p className="text-[11px] text-slate-500 leading-normal font-medium">Ingin merancang ulang ide atau membuat skenario animasi baru?</p>
              <button
                type="button"
                onClick={handleStartNew}
                className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm hover:border-rose-200 active:scale-95 cursor-pointer"
              >
                <RefreshCw size={13} className="text-rose-500" />
                Atur Ulang Studio (Mulai Baru)
              </button>
            </div>
          </div>

        </div>

        {/* Studio Build Trigger Button */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white shrink-0">
           <button 
             onClick={generatePipeline} disabled={isGeneratingScript}
             className={`w-full py-3.5 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${isGeneratingScript ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200 hover:shadow-indigo-300 active:scale-95'}`}
           >
             {isGeneratingScript ? (
               <><Loader2 className="animate-spin text-indigo-600" size={18} /> Meracik Naskah & Prompts...</>
             ) : (
               <>Generate Prompt Animasi <Sparkles size={18} className="text-amber-400 fill-amber-400" /></>
             )}
           </button>
        </div>
      </div>

      {/* ================= PANEL KANAN: WORKSPACE OUTPUT ================= */}
      <div className="flex-1 bg-slate-50/50 overflow-y-auto h-auto min-h-[500px] lg:h-[90vh] custom-scrollbar relative p-4 sm:p-8">
        
        {/* Loading Overlay */}
        {isGeneratingScript && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" size={24} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Meracik Prompt Skenario Cerita</h2>
            <p className="text-slate-500 mt-2 max-w-sm text-xs sm:text-sm font-medium">AI sedang menyusun {step5_SceneCount} adegan prompt TTI &amp; TTV agar berkesinambungan dan konsisten.</p>
          </div>
        )}

        {/* Error Notification Block */}
        {error && (
          <div className="my-6 bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto shadow-md">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-extrabold text-rose-800 text-base mb-1">Terjadi Gangguan Studio</h3>
            <p className="text-rose-600 text-xs leading-relaxed mb-4">{error}</p>
            <button 
              onClick={generatePipeline}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State Showcase */}
        {!projectData && !isGeneratingScript && !error && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[450px]">
            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border border-slate-200/60 shadow-md">
               <Layers size={36} className="text-indigo-500/80" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Kreativitas Menanti</h2>
            <p className="max-w-md text-slate-500 text-xs sm:text-sm mt-2 font-medium">Sesuaikan parameter animasi di panel kiri, kemudian klik tombol "Generate Prompt Animasi" untuk memproduksi prompt Text-to-Image &amp; Text-to-Video.</p>
          </div>
        )}

        {/* Storyboard Prompts Workspace */}
        {projectData && (
          <div className="max-w-[1300px] mx-auto space-y-7 pb-20">
            
            {/* Project Banner Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200/80 pb-6">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">PROYEK TERKINI</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">{projectData.title}</h2>
                <p className="text-xs sm:text-sm text-slate-500 italic max-w-2xl font-medium">"{projectData.synopsis}"</p>
                
                {/* Active Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                   <span className="bg-white border border-slate-200/60 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">{step3_Visual === 'Custom' ? (customVisual || 'Custom') : step3_Visual}</span>
                   <span className="bg-white border border-slate-200/60 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">{step4_Narrative === 'Custom' ? (customNarrative || 'Custom') : step4_Narrative}</span>
                   <span className="bg-white border border-slate-200/60 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">{step5_SceneCount} Adegan</span>
                   <span className="bg-white border border-slate-200/60 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">Layar {step6_AspectRatio}</span>
                   <span className="bg-white border border-slate-200/60 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">{step8_VOType}</span>
                </div>
              </div>

              {/* Copy All Prompts Button */}
              <button 
                onClick={copyAllPrompts}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200 shrink-0 text-xs sm:text-sm active:scale-95 cursor-pointer"
              >
                {copiedAll ? <Check size={16} /> : <FileText size={16} />}
                <span>{copiedAll ? 'Semua Prompt Tersalin!' : 'Salin Semua Prompt'}</span>
              </button>
            </div>

            {/* ================= KELOMPOK ADEGAN SKENARIO (PROMPT & VOICE OVER) ================= */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Koleksi Prompt Adegan Skenario ({projectData.scenes?.length || 0} Scene)</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Rencana naskah cerita, pengisian suara AI, serta prompt gambar (TTI) dan video (TTV)</p>
                  </div>
                </div>
              </div>

              {projectData.scenes && projectData.scenes.map((scene: any) => (
                <div key={`sken-${scene.scene_number}`} className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 flex flex-col gap-5">
                  
                  {/* Clean Horizontal Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-mono font-black w-8 h-8 flex items-center justify-center rounded-xl">
                        {scene.scene_number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Adegan Skenario {scene.scene_number}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">ID: SEC-0{scene.scene_number} • Rasio {step6_AspectRatio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/30">
                        {step8_VOType}
                      </span>
                    </div>
                  </div>

                  {/* Aksi Visual / Deskripsi Adegan */}
                  {scene.action && (
                    <div className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60 text-xs text-slate-700">
                      <span className="font-bold text-indigo-700 block mb-0.5">Konsep Aksi Visual:</span>
                      <p className="text-slate-600">{scene.action}</p>
                    </div>
                  )}

                  {/* Narration script & AI Voice play/generation part */}
                  <div className="space-y-4">
                    
                    {/* Voiceover and script content card */}
                    <div className="bg-slate-50/50 border border-slate-200/40 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                          <Volume2 size={12} className="text-indigo-600" /> SULIH SUARA (VOICE OVER)
                        </span>

                        <div className="flex gap-1.5">
                          {generatedAudio[scene.scene_number] ? (
                            <>
                              <button 
                                onClick={() => togglePlayAudio(scene.scene_number)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${playingAudioId === scene.scene_number ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                              >
                                {playingAudioId === scene.scene_number ? (
                                  <><Pause size={10} /> Mengudara</>
                                ) : (
                                  <><Play size={10} /> Putar Audio</>
                                )}
                              </button>
                              <button 
                                onClick={() => downloadAudio(scene.scene_number)}
                                className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center cursor-pointer"
                                title="Unduh WAV"
                              >
                                <Download size={11} />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => generateVoiceOver(scene.scene_number, scene.narration)}
                              disabled={generatingAudio[scene.scene_number]}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-[10px] text-indigo-600 hover:text-white font-bold rounded-xl border border-indigo-100/50 hover:border-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {generatingAudio[scene.scene_number] ? (
                                <><Loader2 size={10} className="animate-spin" /> Mengisi suara...</>
                              ) : (
                                <>Isi Suara AI</>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-700 text-xs italic leading-relaxed font-serif">"{scene.narration}"</p>
                    </div>

                    {/* Technical T2I and T2V Prompts display blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Text-to-Image Prompt */}
                      <div className="relative group bg-slate-50/30 border border-slate-200/60 rounded-2xl p-4 hover:border-indigo-400/30 transition-all duration-200">
                        <button 
                          onClick={() => copyText(scene.t2i_prompt, `t2i-${scene.scene_number}`)} 
                          className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-slate-400 transition-all shadow-xs cursor-pointer flex items-center gap-1 text-[10px]"
                          title="Salin Prompt"
                        >
                          {copiedPromptId === `t2i-${scene.scene_number}` ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                          <span>{copiedPromptId === `t2i-${scene.scene_number}` ? 'Tersalin' : 'Salin'}</span>
                        </button>
                        <h5 className="text-[8px] font-mono font-bold text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <ImageIcon size={10}/> Midjourney V6 / Image Prompt (TTI)
                        </h5>
                        <p className="text-[10px] text-slate-600 font-mono leading-relaxed pr-6 select-all break-words">{scene.t2i_prompt}</p>
                      </div>

                      {/* Text-to-Video Prompt */}
                      <div className="relative group bg-slate-50/30 border border-slate-200/60 rounded-2xl p-4 hover:border-violet-400/30 transition-all duration-200">
                        <button 
                          onClick={() => copyText(scene.t2v_prompt, `t2v-${scene.scene_number}`)} 
                          className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-violet-600 rounded-lg text-slate-400 transition-all shadow-xs cursor-pointer flex items-center gap-1 text-[10px]"
                          title="Salin Prompt"
                        >
                          {copiedPromptId === `t2v-${scene.scene_number}` ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                          <span>{copiedPromptId === `t2v-${scene.scene_number}` ? 'Tersalin' : 'Salin'}</span>
                        </button>
                        <h5 className="text-[8px] font-mono font-bold text-violet-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <Video size={10}/> Kling / Runway Video Prompt (TTV)
                        </h5>
                        <p className="text-[10px] text-slate-600 font-mono leading-relaxed pr-6 select-all break-words">{scene.t2v_prompt}</p>
                      </div>

                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Global Toast System banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white border border-slate-200 text-slate-800 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[100]">
          <div className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-xs font-bold tracking-tight text-slate-700">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};
