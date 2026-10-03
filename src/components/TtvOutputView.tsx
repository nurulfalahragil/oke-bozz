import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Video,
  Clapperboard,
  Sparkles,
  Volume2,
  Clock,
  Camera,
  Layers,
  FileVideo,
  Play,
  Square,
  Zap,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { StoryboardData, TtvEngine } from '../types';
import { fitVoToDuration } from '../services/storyboardGenerator';

interface TtvOutputViewProps {
  data: StoryboardData;
  engine: TtvEngine;
  onChangeEngine: (engine: TtvEngine) => void;
  onUpdateSceneVo?: (sceneId: string, newVo: string) => void;
}

export const TtvOutputView: React.FC<TtvOutputViewProps> = ({
  data,
  engine,
  onChangeEngine,
  onUpdateSceneVo,
}) => {
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);
  const [copiedAudio, setCopiedAudio] = useState(false);
  const [playingSceneId, setPlayingSceneId] = useState<string | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editedVoText, setEditedVoText] = useState<string>('');

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatPromptForVideoEngine = (prompt: string, selectedEngine: TtvEngine) => {
    switch (selectedEngine) {
      case 'kling':
        return `[Kling AI Prompt - Motion Strength: 6, Camera Mode: Smooth Cinematic]\n${prompt} --cfg_scale 0.5 --negative_prompt "distorted hands, glitch, rapid flickering, unnatural movements"`;
      case 'runway':
        return `[Runway Gen-3 Alpha]\n${prompt} Camera Control: Cinematic Pan & Dolly In, 60fps, 4K resolution, photorealistic commercial grading.`;
      case 'luma':
        return `[Luma Dream Machine]\n${prompt} High fidelity motion, photorealistic commercial ad lighting, consistent subject identity.`;
      case 'sora':
        return `[OpenAI Sora Cinematic Prompt]\n${prompt} Hyper-realistic texture, shallow depth of field, steady camera motion, 4k ultra-detailed.`;
      case 'minimax':
        return `[Hailuo / Minimax Video-01]\n${prompt} Cinematic high production commercial video, natural body motion, vivid natural colors.`;
      default:
        return prompt;
    }
  };

  const copyToClipboard = (text: string, type: 'master' | 'audio' | 'scene', id?: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'master') {
      setCopiedMaster(true);
      setTimeout(() => setCopiedMaster(false), 2000);
    } else if (type === 'audio') {
      setCopiedAudio(true);
      setTimeout(() => setCopiedAudio(false), 2000);
    } else if (id) {
      setCopiedSceneId(id);
      setTimeout(() => setCopiedSceneId(null), 2000);
    }
  };

  const playSceneAudio = (text: string, sceneId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung fitur audio Text-to-Speech.');
      return;
    }

    if (playingSceneId === sceneId) {
      window.speechSynthesis.cancel();
      setPlayingSceneId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setPlayingSceneId(sceneId);
    utterance.onend = () => setPlayingSceneId(null);
    utterance.onerror = () => setPlayingSceneId(null);

    window.speechSynthesis.speak(utterance);
  };

  const scenes = data.parts[0]?.scenes || [];
  const currentMasterTtv = formatPromptForVideoEngine(data.masterTtvPrompt, engine);

  // If no scenes generated yet
  if (scenes.length === 0) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 mx-auto flex items-center justify-center border border-pink-500/20">
          <Video className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-bold text-white">Prompt Video (TTV) Siap Dibuat</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload foto produk, tentukan gaya (misal: unboxing / lifestyle), durasi video, dan klik tombol <strong>Generate Storyboard &amp; Prompt TTI / TTV</strong> untuk menghasilkan arahan kamera dan naskah VO tersinkronisasi.
          </p>
        </div>
      </div>
    );
  }

  // Calculate approximate seconds allocated per scene
  const allocatedSecPerScene = +(data.durationTotal / scenes.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Output 2
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Prompt Text to Video (TTV) &amp; Voice Over Terkalibrasi
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Prompt video terstruktur untuk Kling AI, Runway Gen-3 Alpha, dan Sora. Dilengkapi kalibrasi durasi naskah VO agar pengucapan terdengar santai, berartikulasi jelas, bebas dari terburu-buru/belibet, dan tidak terpotong.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 pl-2">Engine Video:</span>
            <select
              value={engine}
              onChange={(e) => onChangeEngine(e.target.value as TtvEngine)}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="kling">Kling AI v1.5</option>
              <option value="runway">Runway Gen-3 Alpha</option>
              <option value="luma">Luma Dream Machine</option>
              <option value="sora">OpenAI Sora</option>
              <option value="minimax">Hailuo / Minimax</option>
              <option value="pika">Pika 2.0</option>
            </select>
          </div>
        </div>
      </div>

      {/* MASTER FULL AD VIDEO SEQUENCE PROMPT */}
      <div className="bg-slate-800/80 rounded-2xl border border-purple-500/40 overflow-hidden shadow-lg">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Master Prompt Video Iklan Utuh ({data.durationTotal}s • {scenes.length} Scene • Rasio {data.aspectRatio})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(currentMasterTtv, 'master')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              copiedMaster
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
            }`}
          >
            {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMaster ? 'Tersalin ke Clipboard!' : 'Salin Master Prompt TTV'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-purple-100 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap select-all">
            {currentMasterTtv}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>
                Format Video: <strong className="text-slate-200">{data.aspectRatio}</strong> (Cocok untuk TikTok Ads, IG Reels, &amp; YouTube Shorts)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {currentMasterTtv.length} karakter
            </span>
          </div>
        </div>
      </div>

      {/* SCENE-BY-SCENE VIDEO PROMPTS WITH CALIBRATED VO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Prompt Video Per Scene &amp; Sinkronisasi Voice Over ({scenes.length} Scene)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-indigo-400" />
            Standar VO: ~2.2 kata/detik (130 WPM)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {scenes.map((sc, idx) => {
            const words = sc.vo.trim().split(/\s+/).filter(Boolean);
            const wordCount = words.length;
            const estimatedSec = +(wordCount / 2.2).toFixed(1);
            // Optimal max words for allocated seconds
            const maxAllowedWords = Math.floor(allocatedSecPerScene * 2.3);
            const isPacingOver = wordCount > maxAllowedWords;
            const isPacingOptimal = wordCount <= maxAllowedWords && wordCount >= Math.floor(allocatedSecPerScene * 1.4);

            return (
              <div
                key={sc.id || idx}
                className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-sm hover:border-purple-500/50 transition space-y-3.5"
              >
                {/* Scene Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold border border-pink-500/30">
                      {sc.sceneNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Scene {sc.sceneNumber}: {sc.phaseTitle}
                      </h4>
                      <p className="text-[11px] text-purple-300 font-medium">
                        Alokasi Durasi Video: <span className="text-white font-bold">{sc.timeRange}</span> (~{allocatedSecPerScene} detik)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playSceneAudio(sc.vo, sc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
                        playingSceneId === sc.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                      }`}
                      title="Tes suara voice over dengan kecepatan pas"
                    >
                      {playingSceneId === sc.id ? (
                        <>
                          <Square className="w-3.5 h-3.5" />
                          <span>Berhenti</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Dengar VO</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(sc.scenePromptTtv, 'scene', sc.id)}
                      className="px-3 py-1.5 bg-pink-600/20 hover:bg-pink-600/40 text-pink-200 border border-pink-500/30 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSceneId === sc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedSceneId === sc.id ? 'Tersalin' : 'Salin Prompt Video'}</span>
                    </button>
                  </div>
                </div>

                {/* TTV Prompt Code Box */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                    Prompt Text-to-Video Engine:
                  </label>
                  <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-pink-100 leading-relaxed select-all">
                    {sc.scenePromptTtv}
                  </div>
                </div>

                {/* Camera Movement */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2 text-xs">
                  <Camera className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-medium">Pergerakan Kamera:</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{sc.cameraMovement}</p>
                  </div>
                </div>

                {/* VOICE OVER SECTION WITH PACING INDICATOR */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Naskah Voice Over (VO) Scene {sc.sceneNumber}
                    </span>

                    {/* PACING STATUS BADGE */}
                    <div className="flex items-center gap-2">
                      {isPacingOver ? (
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Terlalu Panjang ({wordCount} kata • ~{estimatedSec}s &gt; {allocatedSecPerScene}s)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Tempo Pas &amp; Nyaman ({wordCount} kata • ~{estimatedSec}s / {allocatedSecPerScene}s)
                        </span>
                      )}

                      {/* AUTO-FIT BUTTON IF TOO LONG */}
                      {isPacingOver && (
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = fitVoToDuration(sc.vo, allocatedSecPerScene);
                            if (onUpdateSceneVo) {
                              onUpdateSceneVo(sc.id, trimmed);
                            }
                          }}
                          className="text-[10px] font-bold text-amber-300 hover:text-white bg-amber-600/30 hover:bg-amber-600/60 px-2 py-0.5 rounded-full border border-amber-400/40 transition flex items-center gap-1 cursor-pointer"
                          title="Potong/perpendek teks agar tepat sesuai durasi detik"
                        >
                          <Zap className="w-2.5 h-2.5" />
                          <span>Pas-kan ke {allocatedSecPerScene}s</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* VO SCRIPT DISPLAY OR INLINE EDIT */}
                  {editingSceneId === sc.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedVoText}
                        onChange={(e) => setEditedVoText(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-lg border border-indigo-500 focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSceneId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateSceneVo) {
                              onUpdateSceneVo(sc.id, editedVoText);
                            }
                            setEditingSceneId(null);
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Simpan VO
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <p className="text-xs text-slate-100 italic leading-relaxed font-sans">
                        "{sc.vo}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSceneId(sc.id);
                          setEditedVoText(sc.vo);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer shrink-0"
                        title="Edit Naskah VO"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Subtitle preview */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Subtitle On-Screen:</span>
                    <span className="text-slate-300 font-mono">"{sc.subtitle}"</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUDIO, BGM & SFX CUE SHEET */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Arahan Musik Latar (BGM) &amp; Efek Suara (SFX)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(data.bgmSfxNotes, 'audio')}
            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            {copiedAudio ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedAudio ? 'Tersalin' : 'Salin Arahan Audio'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-mono">
          {data.bgmSfxNotes || 'Upbeat lo-fi modern commercial beat dengan transisi swoosh halus pada tiap pergantian scene.'}
        </p>
      </div>

      {/* WORKFLOW GUIDE FOR AI VIDEO */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
          <FileVideo className="w-4 h-4" />
          Panduan Workflow Pembuatan Video Iklan AI:
        </h4>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            <strong>Image-to-Video (Direkomendasikan):</strong> Gunakan gambar yang dihasilkan dari Tab <em>Prompt TTI</em> sebagai frame awal (Start Frame / First Frame) di Kling AI atau Runway Gen-3.
          </li>
          <li>
            Masukkan <strong>Prompt Video Scene</strong> di atas pada kolom prompt video. Prompt sudah menyertakan arahan kamera <code className="bg-slate-800 px-1 py-0.5 rounded text-pink-300">[Camera: ...]</code> agar gerakan konsisten dan stabil.
          </li>
          <li>
            Setel durasi video per scene ke {allocatedSecPerScene} detik sesuai dengan alokasi timing di atas.
          </li>
          <li>
            Gabungkan semua klip scene video ({scenes.length} klip) di CapCut / Premiere, lalu tambahkan narasi suara sesuai naskah VO di atas yang sudah dipastikan pas dengan durasi!
          </li>
        </ol>
      </div>
    </div>
  );
};
