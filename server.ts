import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getStyleById } from './src/data/storyboardStyles';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '35mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Storyboard Generation API Endpoint
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const {
      productImage,
      modelImage,
      modelPersonaPreset,
      productName,
      brandName = 'OVAL STORYBOARD IKLAN',
      tagline = 'Solusi Praktis & Menawan',
      productDescription = '',
      productFeatures = [],
      storyboardStyle = 'lifestyle',
      storyboardCategory = 'storytelling',
      storyboardStructure = 'auto',
      numParts = 1,
      numPanels = 4,
      duration = 15,
      aspectRatio = '9:16',
      targetAudience = 'Wanita / Remaja – Dewasa',
      musicStyle = 'Elegant / Soft Viral TikTok',
      language = 'id',
      targetTtiEngine = 'flow',
      targetTtvEngine = 'kling',
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('No GEMINI_API_KEY found, delegating to client engine');
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Prepare multimodal parts
    const contents: any[] = [];

    const styleInfo = getStyleById(storyboardStyle);
    const panelDurationSec = +(duration / numPanels).toFixed(1);
    const maxWordsPerScene = Math.max(3, Math.floor(panelDurationSec * 2.2));
    const idealWordsPerScene = Math.max(3, Math.floor(panelDurationSec * 1.8));

    const systemInstruction = `You are an award-winning Executive Creative Director and Master AI Prompt Engineer at a world-class advertising agency, specializing in high-conversion commercial video ads (TikTok Ads, Instagram Reels, TVC) and agency-grade storyboard presentation boards.

Your goal is to produce two extraordinary, production-ready outputs:
1. OUTPUT 1: PROMPT TEXT-TO-IMAGE (TTI) for Flow AI / Midjourney v6.1 / Flux Pro to render an ultra-aesthetic multi-panel storyboard presentation board in ${numPanels === 6 ? '3x2 grid layout (6 panels)' : numPanels === 3 ? '1x3 grid layout (3 panels)' : '2x2 grid layout (4 panels)'}. The prompt must be deeply atmospheric, professional, photorealistic, with vector brand header, technical specs HUD card, subtle rounded frames, handwritten white annotation callout arrows, and clean camera metadata tables below each frame.
2. OUTPUT 2: PROMPT TEXT-TO-VIDEO (TTV) for AI video generators (Kling AI, Runway Gen-3 Alpha, Sora, Minimax Hailuo, Luma) featuring cinematic camera movement brackets [Camera: ...], actor micro-expressions, fluid choreography, studio lighting, and synchronized voiceover for all ${numPanels} scenes.

PROFESSIONAL PROMPT ENGINEERING STANDARDS (NO STIFF / ROBOTIC PROMPTS):
- Master TTI Prompt: Specify Hasselblad H6D-100c or Arri Alexa LF 35mm optics, Profoto studio lighting, true-to-life physical materials, creamy depth of field, 35mm film color science, clean editorial presentation layout --ar 2:3 --v 6.1 --style raw.
- Individual Scene TTI Prompts: Every scene in the JSON must include a dedicated "scenePromptTti" ready to generate that standalone frame in Midjourney/Flux.
- Master & Scene TTV Prompts: Specify camera motion kinematics [Camera: Dynamic Tracking / Crane / Macro Dolly], framing, lighting setup, 60fps photorealism, and 35mm film LUT grading.

ATURAN MUTLAK DURASI & KECEPATAN VOICE OVER (VO):
- Durasi per scene adalah ${panelDurationSec} detik.
- Kecepatan bicara voiceover komersial yang natural adalah 1.8 - 2.2 kata per detik.
- Jumlah kata dalam 'vo' untuk tiap scene WAJIB MAKSIMAL ${maxWordsPerScene} KATA (IDEAL: ${idealWordsPerScene} KATA)!
- DILARANG membuat kalimat panjang majemuk. Naskah VO harus singkat, padat, beritme, dan pas dengan durasi ${panelDurationSec} detik agar pengucapan terdengar santai, jelas, tidak belibet/terburu-buru, dan tidak terpotong musik.

Language for VO, subtitles, callouts, and Indonesian market copy: ${language === 'id' ? 'Bahasa Indonesia yang natural, padat, persuasif, dan ritmik (gaya iklan komersial modern)' : 'Persuasive, concise, cinematic English marketing copy'}.`;

    let userPromptText = `PRODUK:
- Nama Produk: ${productName}
- Brand: ${brandName}
- Tagline: ${tagline}
- Deskripsi: ${productDescription}
- Fitur & Keunggulan Utama: ${productFeatures.join(', ')}

KONFIGURASI IKLAN DARI PENGGUNA (WAJIB DIIKUTI PERSIS):
- Gaya Storyboard Terpilih: ${styleInfo.name} (${storyboardStyle})
- Kategori Gaya: ${styleInfo.category}
- Struktur Alur Adegan: ${storyboardStructure.toUpperCase()}
- Jumlah Part: ${numParts} Part
- Jumlah Panel per Part: ${numPanels} Scene (WAJIB TEPAT ${numPanels} SCENE PER PART)
- Total Durasi Video: ${duration} detik (${panelDurationSec} detik per scene)
- Aspek Rasio: ${aspectRatio}
- Target Audiens: ${targetAudience}
- Gaya Musik: ${musicStyle}
- Karakter Model: ${modelPersonaPreset || 'Model Profesional'}
- Target Engine TTI: ${targetTtiEngine}
- Target Engine TTV: ${targetTtvEngine}

REFERENSI ALUR WAJIB SESUAI GAYA "${styleInfo.name.toUpperCase()}":
- Konsep Gaya: ${styleInfo.explanation}
- Rincian Adegan Acuan (Wajib diadaptasi ke dalam ${numPanels} panel):
${styleInfo.structureBreakdown.map((s, idx) => `  * Adegan ${idx + 1}: ${s}`).join('\n')}
- Rekomendasi Kamera: ${styleInfo.cameraStyle}
- Pencahayaan / Mood: ${styleInfo.lightingStyle}
- Karakter Suara / VO: ${styleInfo.voTone}

PANDUAN KHUSUS EKSEKUSI TEMA:
- JIKA MEMILIH ASMR (ASMR Product / ASMR Detail): Wajib fokus pada visual mikro, tapping kuku ke kemasan, bunyi klik resleting/tutup, desah bisikan VO yang tenang, dan macro texture.
- JIKA MEMILIH BEFORE -> AFTER: Wajib menampilkan keluhan/masalah nyata (Before) lalu proses dan reveal perubahan dramatis (After).
- JIKA MEMILIH UNBOXING: Wajib alur paket datang -> buka segel -> reveal produk -> detail macro -> hands-on -> review & CTA.
- JIKA MEMILIH TUTORIAL / HOW TO USE: Wajib langkah demi langkah (Step 1, Step 2, Step 3) dengan visual instruksi yang jelas.
- JIKA MEMILIH CINEMATIC: Wajib framing dramatis, slow motion, lighting atmosferik, dan narasi puitis/elegan.
- JIKA MEMILIH UGC / POV: Wajib sudut kamera selfie / POV orang pertama, gaya bicara santai seperti curhat ke followers, dan live demo spontan.

ATURAN KERAS VOICE OVER (VO) AGAR TIDAK BELIBET & TIDAK TERPOTONG:
- Kecepatan membaca VO iklan komersial Indonesia adalah ~2.2 kata per detik (130 kata per menit).
- Alokasi durasi scene adalah TEPAT ${panelDurationSec} detik.
- Naskah VO untuk tiap scene HARUS tepat antara ${Math.max(3, Math.floor(panelDurationSec * 1.4))} sampai ${maxWordsPerScene} kata (TIDAK BOLEH lebih dari ${maxWordsPerScene} kata!).
- Kalimat harus to-the-point, jelas, artikulasi mudah, tidak berbelit-belit, dan dapat diucapkan secara rileks tepat dalam ${panelDurationSec} detik tanpa ada kata yang terpotong.

CRITICAL INSTRUCTIONS FOR MASTER TTI PROMPT:
The "masterTtiPrompt" MUST be written specifically for ${numPanels === 6 ? 'a 3x2 grid layout (6 panels total)' : numPanels === 3 ? 'a 1x3 grid layout (3 panels total)' : 'a 2x2 grid layout (4 panels total)'} reflecting the "${storyboardStyle}" theme.
It MUST explicitly describe EVERY single scene from Scene 1 to Scene ${numPanels} one by one with its title, time range, visual action, handwritten arrow callout text, and specs table below!

Return ONLY a valid JSON object strictly matching this schema without markdown code fences:
{
  "brandName": "${brandName}",
  "productName": "${productName}",
  "tagline": "${tagline}",
  "durationTotal": ${duration},
  "partsCount": ${numParts},
  "scenesCount": ${numPanels},
  "aspectRatio": "${aspectRatio}",
  "musicRecommendation": "${musicStyle}",
  "overlayTextRule": "Minimal (sesuai storyboard)",
  "targetAudience": "${targetAudience}",
  "style": "${storyboardStyle}",
  "productVisualSummary": "concise description of physical product appearance based on photo",
  "modelVisualSummary": "concise description of model",
  "masterTtiPrompt": "Master Prompt for Flow AI/Midjourney to generate the FULL ${numPanels}-scene storyboard presentation poster sheet in ${numPanels === 6 ? '3x2' : numPanels === 3 ? '1x3' : '2x2'} grid layout, describing Scene 1 to Scene ${numPanels} in full detail with handwritten callouts and technical specs",
  "masterTtiNegativePrompt": "blurry, distorted hands, bad typography, low resolution, ugly face, extra limbs",
  "masterTtvPrompt": "Full commercial video script describing all ${numPanels} scenes with camera brackets [Camera: ...] and timing",
  "bgmSfxNotes": "BGM beat notes and specific SFX cues for each second",
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Part 1 (${Math.round(duration / numParts)}s)",
      "scenes": [
        // MUST PROVIDE EXACTLY ${numPanels} SCENE OBJECTS (sceneNumber 1 to ${numPanels})
      ]
    }
  ]
}

- For EACH scene inside parts[0].scenes, you MUST include:
  - "sceneNumber": integer 1 to ${numPanels}
  - "phaseTitle": string (e.g. Hook / Detail / Hands-on / CTA)
  - "timeRange": string (e.g. "0 – 4 detik")
  - "shot": string camera framing
  - "angle": string camera angle
  - "duration": string
  - "vo": string (strictly max ${maxWordsPerScene} words)
  - "subtitle": string
  - "calloutText": string concise visual annotation
  - "visualDescription": string visual description
  - "scenePromptTti": string detailed standalone prompt for Midjourney v6.1 / Flux
  - "scenePromptTtv": string detailed video generation prompt with [Camera: ...]
  - "cameraMovement": string camera movement direction`;

    // Add product image if base64
    if (productImage && productImage.startsWith('data:image/')) {
      const matches = productImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contents.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    // Add model image if base64
    if (modelImage && modelImage.startsWith('data:image/')) {
      const matches = modelImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contents.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    contents.push(userPromptText);

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let parsedData: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        parsedData = JSON.parse(cleanJson);
        if (parsedData && parsedData.parts && parsedData.parts.length > 0) {
          break;
        }
      } catch (err: any) {
        console.warn(`Storyboard model ${modelName} failed:`, err?.message || err);
      }
    }

    if (!parsedData) {
      throw new Error('All candidate AI models failed to generate valid storyboard JSON');
    }

    // Normalize output fields to strictly match user configuration
    parsedData.scenesCount = numPanels;
    parsedData.partsCount = numParts;
    parsedData.durationTotal = duration;
    parsedData.style = storyboardStyle;
    parsedData.aspectRatio = aspectRatio;

    if (parsedData.parts && parsedData.parts[0] && Array.isArray(parsedData.parts[0].scenes)) {
      // Ensure the scenes are correctly indexed from 1 to numPanels and VO is duration-calibrated
      parsedData.parts[0].scenes = parsedData.parts[0].scenes.slice(0, numPanels).map((sc: any, idx: number) => {
        let vo = (sc.vo || '').trim();
        const words = vo.split(/\s+/).filter(Boolean);
        if (words.length > maxWordsPerScene + 1) {
          vo = words.slice(0, maxWordsPerScene).join(' ').replace(/[,;]\s*$/, '').trim();
          if (!/[.!?]$/.test(vo)) vo += '!';
        }
        return {
          ...sc,
          sceneNumber: idx + 1,
          id: sc.id || `part-1-scene-${idx + 1}`,
          vo,
          subtitle: sc.subtitle || vo,
        };
      });
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating storyboard with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to generate storyboard with AI',
      message: error?.message || String(error),
    });
  }
});

// Simple Ad Generation API Endpoint (1-Click Fast Ad)
app.post('/api/generate-simple-ad', async (req, res) => {
  try {
    const {
      productImage,
      productName,
      brandName = 'PRODUK PILIHAN',
      tagline = 'Solusi Praktis & Menawan',
      keyFeature = 'Kualitas premium & praktis digunakan',
      pricePromo = 'Promo Diskon Spesial Hari Ini',
      format = 'hook_viral',
      duration = 15,
      aspectRatio = '9:16',
      voTone = 'energetic',
    } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Nama produk harus diisi' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const contents: any[] = [];

    const promptText = `Anda adalah Creative Director iklan komersial video pendek (TikTok Ads, Reels, YouTube Shorts).
Tugas Anda adalah membuat 1 paket IKLAN SIMPEL & CEPAT (${duration} detik, ${aspectRatio}) untuk:
- Nama Produk: ${productName}
- Brand: ${brandName}
- Tagline: ${tagline}
- Keunggulan Utama: ${keyFeature}
- Promo / Penawaran: ${pricePromo}
- Format Iklan: ${format.toUpperCase()}
- Gaya/Nada Suara VO: ${voTone}

PANDUAN FORMAT IKLAN:
- 0-3s: Hook Pembuka (Pattern Interrupt yang membuat penonton berhenti scroll)
- 3-10s: Demonstrasi/Review/Solusi Cepat menonjolkan "${keyFeature}"
- 10-15s: Call to Action (CTA) mendesak membeli atau checkout di keranjang dengan penawaran "${pricePromo}"

Naskah VO WAJIB singkat, padat, beritme, total tidak lebih dari 35 kata untuk durasi 15 detik.

Return ONLY a valid JSON object matching this schema without markdown code fences:
{
  "productName": "${productName}",
  "brandName": "${brandName}",
  "format": "${format}",
  "formatName": "Nama format iklan bahasa Indonesia",
  "duration": ${duration},
  "platform": "TikTok / Reels / Shorts (${aspectRatio})",
  "hookHeadline": "Kalimat Hook Pembuka yang menarik perhatian dalam 3 detik pertama",
  "fullVoScript": "Naskah voiceover lengkap dari awal sampai akhir",
  "scenes": [
    {
      "timeRange": "0 - 3 Detik (Hook)",
      "title": "Judul scene 1",
      "visualAction": "Deskripsi aksi visual jelas",
      "cameraDirection": "[Camera: ...]",
      "voScript": "Naskah VO scene 1",
      "onScreenText": "Teks overlay di layar"
    },
    {
      "timeRange": "3 - 10 Detik (Solusi & Demo)",
      "title": "Judul scene 2",
      "visualAction": "Deskripsi aksi visual jelas",
      "cameraDirection": "[Camera: ...]",
      "voScript": "Naskah VO scene 2",
      "onScreenText": "Teks overlay di layar"
    },
    {
      "timeRange": "10 - 15 Detik (CTA)",
      "title": "Judul scene 3",
      "visualAction": "Deskripsi aksi visual jelas",
      "cameraDirection": "[Camera: ...]",
      "voScript": "Naskah VO scene 3",
      "onScreenText": "Teks overlay di layar"
    }
  ],
  "ttiVisualPrompt": "Detailed commercial photography master prompt for Flow AI/Midjourney/Flux with product and lighting details --ar ${aspectRatio} --v 6.1",
  "ttvVideoPrompt": "Prompt video untuk Kling AI / Runway Gen-3 dengan arahan kamera [Camera: ...] dan lighting",
  "captionCopy": "Copywriting caption Instagram/TikTok yang menarik dan persuasif",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`;

    if (productImage && productImage.startsWith('data:image/')) {
      const match = productImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        contents.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    contents.push({ text: promptText });

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let parsedData: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        parsedData = JSON.parse(cleanJson);
        if (parsedData && parsedData.scenes && parsedData.scenes.length > 0) {
          break;
        }
      } catch (err: any) {
        console.warn(`Simple ad model ${modelName} failed:`, err?.message || err);
      }
    }

    if (!parsedData) {
      throw new Error('All candidate AI models failed to generate valid simple ad JSON');
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating simple ad with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to generate simple ad with AI',
      message: error?.message || String(error),
    });
  }
});

// ================= ANIMATION STUDIO DIRECTOR API ROUTES =================

// 1. Consistent Locks Generator (Auto-Generate Character & Environment)
app.post('/api/animation/consistent-locks', async (req, res) => {
  try {
    const { idea, visual } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Ide cerita harus diisi' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        character: `Main protagonist based on: "${idea}". Character with expressive eyes, distinctive signature outfit, recognizable hairstyle, high visual consistency for 3D animation.`,
        environment: `Setting of "${idea}" with detailed architectural elements, rich textural surfaces, warm cinematic lighting, high depth of field matching ${visual}.`
      });
    }

    const ai = new GoogleGenAI();
    const systemPrompt = `Anda adalah Scriptwriter dan Desainer Karakter Oval Animasi. Tugas Anda adalah membedah ide cerita dasar dan merancang deskripsi karakter serta latar belakang lingkungan yang sangat detail agar konsisten ketika diproses oleh generator gambar AI.

Ide Cerita: "${idea}"
Gaya Visual: "${visual}"

Kembalikan jawaban HANYA berupa JSON murni dengan format berikut tanpa markdown:
{
  "character": "Deskripsi fisik karakter utama dalam bahasa Inggris (misal: 'A 10-year-old boy, short black hair, big brown eyes, wearing a red t-shirt and yellow backpack'). Tulis dengan detail yang konkret dan ringkas.",
  "environment": "Deskripsi latar belakang lingkungan spesifik dalam bahasa Inggris (misal: 'An old classic-style library, tall wooden bookshelves filled with books, warm sunlight streaming through a large dusty window')."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ text: "Buat kunci konsistensi sekarang." }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const parsed = JSON.parse(cleanJson);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in consistent-locks:', err);
    return res.json({
      character: `Protagonist character, detailed facial features, signature recognizable clothing, high fidelity animation model.`,
      environment: `Atmospheric world environment with rich details, cinematic lighting, and distinctive landmarks.`
    });
  }
});

// Helper to build high-quality structured screenplay & prompts locally when AI model is temporarily unavailable or overloaded (e.g. 503 High Demand)
function buildAnimationPipelineLocally({
  idea,
  character,
  environment,
  visual,
  narrative,
  sceneCount = 4,
  aspectRatio = '16:9',
  voType = 'Full Narator',
}: any) {
  const scenes = [];
  const narrativeLower = (narrative || '').toLowerCase();
  
  // Progression phases
  const phaseNames = [
    { title: 'Pengenalan & Hook', camera: 'Establishing wide shot, slow push-in' },
    { title: 'Eksplorasi & Aksi', camera: 'Medium tracking shot, camera following movement' },
    { title: 'Titik Balik & Tantangan', camera: 'Low angle dynamic shot, dramatic lighting shift' },
    { title: 'Klimaks & Kejutan', camera: 'Close up intensely focused, high velocity tracking' },
    { title: 'Resolusi & Pembelajaran', camera: 'Eye level balanced framing, warm atmospheric glow' },
    { title: 'Kesimpulan & Call to Action', camera: 'Slow zoom out, revealing full environment' },
    { title: 'Momen Epik Lanjutan', camera: 'High angle bird eye perspective' },
    { title: 'Penutup Hangat', camera: 'Golden hour cinematic slow motion pan' }
  ];

  for (let i = 1; i <= sceneCount; i++) {
    const phaseIdx = Math.min(i - 1, phaseNames.length - 1);
    const phase = phaseNames[phaseIdx];
    
    let action = '';
    let narration = '';

    if (i === 1) {
      action = `Awal mula petualangan: Karakter utama melangkah ke dalam lingkungan utama dengan tatapan penasaran dan antusias.`;
      narration = `Semua berawal di sini, ketika sebuah petualangan magis dan tak terduga baru saja dimulai.`;
    } else if (i === Math.floor(sceneCount / 2)) {
      action = `Momen eksplorasi mendalam: Karakter menemukan petunjuk penting di lingkungan sekitar, bereaksi dengan takjub.`;
      narration = `Langkah demi langkah membawa rahasia besar yang perlahan mulai terungkap di depan mata.`;
    } else if (i === sceneCount - 1) {
      action = `Puncak ketegangan atau aksi puncak: Karakter berusaha mengatasi rintangan dengan tekad penuh.`;
      narration = `Tidak ada kata menyerah, karena keberanian sejati diuji pada saat-saat paling menentukan.`;
    } else if (i === sceneCount) {
      action = `Penutup yang memuaskan: Karakter tersenyum bangga di tengah lingkungan yang bercahaya indah, menghadap masa depan.`;
      narration = `Dan akhirnya, setiap langkah perjalanan membuktikan bahwa mimpi besar selalu layak untuk diperjuangkan.`;
    } else {
      action = `Adegan ${i} (${phase.title}): Karakter berinteraksi aktif dengan elemen lingkungan secara dinamis.`;
      narration = `Perjalanan semakin seru, membuka misteri baru yang tak pernah terbayangkan sebelumnya.`;
    }

    const t2i_prompt = `Subject: ${character}. Action: ${action}. Environment: ${environment}. Camera: ${phase.camera}, 35mm cinematic lens, sharp focus. Art Style: ${visual} visual aesthetic. Lighting: Cinematic volumetric lighting, vibrant color palette. --ar ${aspectRatio}`;
    
    let t2v_prompt = `${phase.camera}. Subject: ${character}. Action: ${action}. Environment: ${environment}. Art Style: ${visual}`;

    if (voType === 'Full Karakter') {
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

  // Derive title from idea
  const cleanTitle = idea.replace(/[\n\r]+/g, ' ').trim();
  const title = cleanTitle.length > 40 ? cleanTitle.slice(0, 40) + '...' : cleanTitle;

  return {
    title: `Animasi: ${title}`,
    synopsis: `Kisah ${visual} bertema ${narrative}: ${idea}`,
    scenes,
  };
}

// 2. Storyboard Pipeline Generator with Resilient Multi-tier Fallback
app.post('/api/animation/pipeline', async (req, res) => {
  const {
    idea = '',
    character = 'Karakter utama',
    environment = 'Lingkungan animasi',
    visual = 'Pixar 3D Animation',
    narrative = 'Storytelling (Hero Journey)',
    sceneCount = 4,
    aspectRatio = '16:9',
    voiceGender = 'Laki-laki Berwibawa',
    voType = 'Full Narator',
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const localResult = buildAnimationPipelineLocally({
      idea, character, environment, visual, narrative, sceneCount, aspectRatio, voiceGender, voType
    });
    return res.json(localResult);
  }

  const systemPrompt = `Anda adalah Sutradara & Produser Eksekutif dari Oval Animasi. Buatlah rancangan naskah, storyboard, dan instruksi visual teknis secara presisi dalam format JSON berdasarkan parameter berikut:

1. IDE CERITA DASAR: ${idea}
2. KARAKTER UTAMA (LOCK): ${character}
3. DETAIL LINGKUNGAN (LOCK): ${environment}
4. GAYA ESTETIKA VISUAL: ${visual}
5. FORMAT NARASI: ${narrative}
6. JUMLAH ADEGAN: ${sceneCount}
7. ASPEK RASIO: ${aspectRatio}
8. TIPE VOICE OVER (VO): ${voType}

ATURAN KONSISTENSI VISUAL DAN PROMPT GAMBAR (SANGAT KETAT):
- t2i_prompt (Text-to-Image): Wajib ditulis dalam Bahasa Inggris secara deskriptif, literal, dan jelas secara visual.
- Pola penulisan prompt HARUS mengikuti format terstruktur ini secara persis:
  "Subject: [Deskripsi detail fisik Karakter Utama secara persis sesuai '${character}']. Action: [Aksi fisik spesifik subjek pada adegan ini]. Environment: [Detail latar belakang lingkungan sesuai '${visual}' and '${environment}']. Camera: [Sudut pandang kamera/close up/medium shot/wide shot]. Art Style: [Gaya visual '${visual}']. Lighting: [Karakter pencahayaan/soft glow/sunlight/dramatic shadow]."

ATURAN KHUSUS UNTUK t2v_prompt (Text-to-Video) DAN TIPE VOICE OVER:
- Tambahkan instruksi gerakan kamera murni di awal (misal: "Slow camera pan left, zoom in slowly on the character...") lalu tempelkan teks prompt t2i_prompt tersebut.
- BERDASARKAN PARAMETER TIPE VOICE OVER ("${voType}"):
  * Jika Tipe VO adalah "Full Narator" atau "Campuran" (pada bagian narasi): Di dalam t2v_prompt, kata-kata narasi otomatis ditaruh sebagai suara latar belakang (VO) dan karakter utama TIDAK BOLEH menggerakkan mulut untuk berbicara ("mouth closed", "lips are still", "not speaking").
  * Jika Tipe VO adalah "Full Karakter" atau bagian dialog pada "Campuran": Karakter berbicara secara visual dengan gerakan mulut ("character is speaking naturally, realistic lip sync").

Kembalikan HANYA dokumen JSON murni tanpa ada pembuka, penutup, atau tanda markdown.
{
  "title": "Judul Film Animasi",
  "synopsis": "Ringkasan sinopsis pendek cerita",
  "scenes": [
    {
      "scene_number": 1,
      "narration": "Teks narasi suara yang akan dibacakan secara langsung",
      "action": "Aksi visual karakter",
      "t2i_prompt": "Prompt gambar berstruktur bahasa inggris yang sangat konsisten",
      "t2v_prompt": "Prompt video berstruktur bahasa inggris dasar dengan gerak kamera"
    }
  ]
}`;

  // Try calling AI models, gracefully falling back to local generator if 503 High Demand occurs
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
  const ai = new GoogleGenAI();

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ text: "Mulailah merancang pipeline JSON." }],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      const parsedData = JSON.parse(cleanJson);

      if (parsedData && Array.isArray(parsedData.scenes) && parsedData.scenes.length > 0) {
        // Sanitasi T2V prompt untuk lipsync
        parsedData.scenes = parsedData.scenes.map((scene: any) => {
          let t2v = scene.t2v_prompt || '';
          let isDialog = false;

          if (voType === 'Full Karakter') {
            isDialog = true;
          } else if (voType === 'Campuran (Narator & Karakter)') {
            if (scene.narration && (scene.narration.includes('"') || scene.narration.includes("'"))) {
              isDialog = true;
            }
          }

          if (isDialog) {
            t2v = t2v.replace(/mouth closed/gi, '')
                     .replace(/not speaking/gi, '')
                     .replace(/silent/gi, '')
                     .replace(/lips? is still/gi, '')
                     .replace(/,\s*,/g, ',')
                     .trim();

            if (!t2v.toLowerCase().includes('speak') && !t2v.toLowerCase().includes('talk') && !t2v.toLowerCase().includes('lips')) {
              t2v += `, character is speaking and explicitly saying: "${scene.narration}", lips moving naturally, realistic lip sync`;
            } else if (!t2v.includes(scene.narration)) {
              t2v += `, explicitly saying: "${scene.narration}"`;
            }
          } else {
            t2v = t2v.replace(/character is speaking/gi, '')
                     .replace(/character is talking/gi, '')
                     .replace(/lips? moving/gi, '')
                     .replace(/lip sync(hronization)?/gi, '')
                     .replace(/explicitly saying:?.*?,/gi, '')
                     .replace(/explicitly saying:?.*$/gi, '')
                     .replace(/,\s*,/g, ',')
                     .trim();

            if (t2v.endsWith(',')) t2v = t2v.slice(0, -1);
            t2v += `, with background voiceover narration saying "${scene.narration}", the character's mouth remains closed and not speaking, lips are still`;
          }

          return { ...scene, t2v_prompt: t2v };
        });

        return res.json(parsedData);
      }
    } catch (modelErr: any) {
      console.warn(`Model ${modelName} failed or busy (503/429):`, modelErr?.message || modelErr);
      // Continue to next candidate model or fallback
    }
  }

  // Graceful fallback: return rich local pipeline so user NEVER sees 503 error
  console.log('Using local intelligent screenplay generator fallback due to upstream API load');
  const fallbackData = buildAnimationPipelineLocally({
    idea, character, environment, visual, narrative, sceneCount, aspectRatio, voiceGender, voType
  });
  return res.json(fallbackData);
});

// 3. Image Rendering (Imagen or High-Quality AI Generation)
app.post('/api/animation/render-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI();
        // Try imagen-3.0-generate-002
        let targetAspect = '16:9';
        if (aspectRatio === '9:16' || aspectRatio === '1:1') {
          targetAspect = aspectRatio;
        }

        const imgResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: `${prompt}, ultra high quality, detailed animation frame`,
          config: {
            numberOfImages: 1,
            aspectRatio: targetAspect as any,
          },
        });

        if (imgResponse.generatedImages && imgResponse.generatedImages[0]?.image?.imageBytes) {
          const base64 = imgResponse.generatedImages[0].image.imageBytes;
          return res.json({
            image: `data:image/png;base64,${base64}`,
          });
        }
      } catch (imgErr) {
        console.warn('Imagen 3 model failed, proceeding to fallback generator:', imgErr);
      }
    }

    // High quality canvas/SVG fallback rendering
    return res.json({
      fallbackPrompt: prompt,
      aspectRatio,
    });
  } catch (err: any) {
    console.error('Error rendering animation image:', err);
    return res.status(500).json({ error: err.message || 'Gagal render gambar' });
  }
});

// ================= DESIGNER PROMPT GENERATOR API ROUTES =================

// 1. YouTube Viral Metadata Generator
app.post('/api/designer/youtube-meta', async (req, res) => {
  const { idea = '' } = req.body;
  if (!idea.trim()) {
    return res.status(400).json({ error: 'Ide video harus diisi' });
  }

  const systemPrompt = `Anda adalah YouTube Strategist dan SEO Expert profesional.
Tugas Anda adalah meriset dan memberikan paket metadata YouTube berdasarkan ide pengguna.
BERIKAN 5 JUDUL VIRAL: Harus clickbait namun relevan, mengundang rasa penasaran, menggunakan huruf kapital pada kata penting, dan emosional.
BERIKAN HOOK UNTUK TIAP JUDUL: Penjelasan visual/emosional mengapa judul ini menarik.
BERIKAN DESKRIPSI: Deskripsi video lengkap yang ramah SEO (3 paragraf singkat).
BERIKAN TAGS: Kata kunci relevan dipisahkan koma.
BERIKAN HASHTAGS: 3-5 hashtag utama.
Output harus dalam Bahasa Indonesia.

Kembalikan HANYA format JSON valid berikut tanpa markdown:
{
  "titles": [
    { "title": "Judul Viral 1", "hook": "Hook emosional/psikologis singkat" },
    { "title": "Judul Viral 2", "hook": "Hook emosional/psikologis singkat" },
    { "title": "Judul Viral 3", "hook": "Hook emosional/psikologis singkat" },
    { "title": "Judul Viral 4", "hook": "Hook emosional/psikologis singkat" },
    { "title": "Judul Viral 5", "hook": "Hook emosional/psikologis singkat" }
  ],
  "description": "Deskripsi lengkap ramah SEO...",
  "tags": "kata kunci 1, kata kunci 2, kata kunci 3...",
  "hashtags": "#tag1 #tag2 #tag3"
}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    const ai = new GoogleGenAI();

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ text: `Ide Video: "${idea}"` }],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const parsed = JSON.parse(cleanJson);
        if (parsed && Array.isArray(parsed.titles) && parsed.titles.length > 0) {
          return res.json(parsed);
        }
      } catch (err: any) {
        console.warn(`YouTube meta model ${modelName} failed or busy:`, err?.message || err);
      }
    }
  }

  // Local fallback
  return res.json({
    titles: [
      { title: `JANGAN SAMPAI MENYESAL! Rahasia Nyata ${idea.slice(0, 30)} yang Jarang Orang Tahu`, hook: 'Memicu urgensi & rasa takut ketinggalan informasi berharga (FOMO).' },
      { title: `TERBONGKAR! Trik Tercepat Menguasai ${idea.slice(0, 25)} Tanpa Ribet`, hook: 'Menjanjikan jalan pintas praktis dan hasil instan yang diminati audiens.' },
      { title: `Saya Mencoba Ini Selama 30 Hari: Fakta Mengejutkan ${idea.slice(0, 25)}`, hook: 'Eksperimen personal berbasis bukti nyata yang mengundang rasa ingin tahu tinggi.' },
      { title: `HENTIKAN Cara Lama! Strategi Baru ${idea.slice(0, 25)} yang Bikin Tercengang`, hook: 'Kontras ekstrem yang mematahkan kebiasaan umum audiens.' },
      { title: `Panduan Mutlak 2026: Semua yang Wajib Anda Ketahui Tentang ${idea.slice(0, 25)}`, hook: 'Otoritas komprehensif sebagai satu-satunya video referensi terlengkap.' }
    ],
    description: `Dalam video ini, kita akan mengupas tuntas rahasia dan panduan lengkap seputar ${idea}.\n\nBanyak orang belum menyadari trik penting yang dapat mengubah hasil secara signifikan. Simak langkah demi langkahnya sampai habis agar tidak melewatkan poin krusial.\n\nJangan lupa klik Like, Subscribe, dan bagikan pendapat Anda di kolom komentar!`,
    tags: `${idea.toLowerCase()}, tutorial, tips viral, cara cepat, panduan lengkap, rahasia terungkap, tren 2026`,
    hashtags: `#${idea.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)} #TipsViral #PanduanPraktis #Trending2026`
  });
});

// 2. Professional Design Prompt Generator
app.post('/api/designer/generate-prompt', async (req, res) => {
  const {
    idea = '',
    type = 'Infografis',
    aspectRatio = '--ar 1:1',
    selectedTitles = [],
  } = req.body;

  if (!idea.trim()) {
    return res.status(400).json({ error: 'Ide desain harus diisi' });
  }

  let specificContext = "";
  if (type === 'Thumbnail' && Array.isArray(selectedTitles) && selectedTitles.length > 0) {
    specificContext = `\n\n[SANGAT PENTING - MULTIPLE THUMBNAIL YOUTUBE]:
Pengguna telah memilih ${selectedTitles.length} Judul Video berikut:
${selectedTitles.map((t: any, i: number) => `${i+1}. Judul: "${t.title}" | Hook: "${t.hook}"`).join('\n')}

-> TUGAS KHUSUS PADA 'professionalPrompt': Anda WAJIB membuatkan prompt text-to-image secara terpisah untuk MASING-MASING judul yang dipilih di atas!
-> Susun 'professionalPrompt' dalam bentuk blok, pisahkan dengan jelas. Contoh Format:

--- 1. PROMPT THUMBNAIL: [Judul 1] ---
[Isi prompt text to image bahasa inggris...]

--- 2. PROMPT THUMBNAIL: [Judul 2] ---
[Isi prompt text to image bahasa inggris...]

-> PASTIKAN Teks Typography yang tertulis besar di dalam gambar masing-masing prompt disesuaikan dengan judulnya.
-> PASTIKAN Visual setiap prompt merepresentasikan Hook-nya masing-masing.`;
  }

  const systemPrompt = `Anda adalah Oval Design Prompt Engine. Anda bertindak sebagai Senior Graphic Designer, Creative Director, dan AI Prompt Engineer ahli.
Tugas Anda: Mengubah ide sederhana dari pengguna menjadi Prompt Text-to-Image yang sangat profesional, detail, dan siap digunakan pada AI generator (Midjourney, Flux, dll).

ATURAN WAJIB PEMBUATAN PROMPT (Gunakan Bahasa Inggris untuk isi prompt):
Prompt harus mendeskripsikan gambar.
Struktur prompt harus urut: [Main Subject/Concept], [Visual Style], [Layout/Composition], [Typography Direction (gaya font dan isi teks)], [Color Palette], [Lighting], [Graphic Elements], [Quality Tags], [Aspect Ratio].

BAHASA TEKS PADA GAMBAR (SANGAT PENTING):
Meskipun prompt ditulis dalam Bahasa Inggris, SEMUA teks (typography/text overlay) yang akan muncul di dalam gambar HARUS tetap dalam Bahasa Indonesia sesuai ide pengguna. Jangan menerjemahkan pesan/judul ke Bahasa Inggris.
Contoh penulisan di prompt: 
- with bold typography "JUAL BELI BARANG BEKAS"
- text overlay "CARA CEPAT VIRAL"
- infographic layout with Indonesian text "BAHAYA SAMPAH PLASTIK"

BERDASARKAN JENIS DESAIN (PENTING! Sesuaikan elemen dengan jenis ini):
1. Jika "Infografis": Tambahkan keyword: Data visualization, Modern charts, Statistic blocks, Information hierarchy, Educational design, Clean infographic layout, Professional icons, isometric elements, infographic style with readable Indonesian text.
2. Jika "Poster": Tambahkan keyword: Hero visual, Eye-catching composition, Promotional layout, Modern poster composition, Professional branding, Strong focal point, poster design with clear Indonesian typography.
3. Jika "Banner": Tambahkan keyword: Advertising banner design, Marketing layout, Promotional elements, Attention grabbing visuals, ultra wide composition (if landscape), commercial advertisement with bold Indonesian text.
4. Jika "Thumbnail": Tambahkan keyword: High CTR thumbnail style, Viral youtube style, Strong emotional impact, Click-worthy composition, Large readable typography element in Indonesian, Eye-catching contrast, vibrant colors. JIKA diberikan Judul dan Hook spesifik, GAMBAR HARUS MEREFLEKSIKANNYA 100%.

QUALITY TAGS WAJIB ADA:
ultra detailed, professional graphic design, award winning design, high quality, 8k resolution, premium layout, sharp focus, commercial advertising quality, behance style, dribbble trending.

PANDUAN NEGATIVE PROMPT:
Berikan negative prompt komprehensif dalam bahasa inggris yang mencegah hasil buruk, menyesuaikan jenis desain. Selalu sertakan: low quality, blurry, pixelated, bad typography, cropped text, poor composition, watermark, messy layout.

STRATEGI DESAIN:
Berikan penjelasan singkat (dalam Bahasa Indonesia) tentang mengapa prompt tersebut disusun demikian, dibagi menjadi 5 kategori strategi.

Kembalikan HANYA format JSON valid berikut tanpa markdown:
{
  "professionalPrompt": "The highly detailed, english text-to-image prompt ending with the aspect ratio parameter.",
  "negativePrompt": "Comma separated negative tags in english.",
  "strategyTargetAudience": "Target audience analysis in Indonesian.",
  "strategyVisualApproach": "Visual approach explanation in Indonesian.",
  "strategyColorStrategy": "Color choices explanation in Indonesian.",
  "strategyLayoutStrategy": "Layout and composition strategy in Indonesian.",
  "strategyTypographyStrategy": "Typography direction explanation in Indonesian."
}`;

  const userQuery = `Ide Desain: "${idea}"\nJenis Desain: ${type}\nAspect Ratio yang diinginkan: ${aspectRatio}${specificContext}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    const ai = new GoogleGenAI();

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ text: userQuery }],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const cleanJson = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
        const parsed = JSON.parse(cleanJson);
        if (parsed && parsed.professionalPrompt) {
          if (!parsed.professionalPrompt.includes(aspectRatio)) {
            parsed.professionalPrompt += ` ${aspectRatio}`;
          }
          return res.json(parsed);
        }
      } catch (err: any) {
        console.warn(`Designer prompt model ${modelName} failed:`, err?.message || err);
      }
    }
  }

  // Local fallback
  let fallbackPrompt = '';
  if (type === 'Thumbnail' && Array.isArray(selectedTitles) && selectedTitles.length > 0) {
    fallbackPrompt = selectedTitles.map((t: any, i: number) => {
      return `--- ${i + 1}. PROMPT THUMBNAIL: "${t.title}" ---
High CTR viral YouTube thumbnail for "${t.title}". Subject: Expressive human reacting enthusiastically to ${idea}, dynamic facial expression, high energy. Visual Hook: ${t.hook}. Layout: Asymmetrical composition with rule of thirds, subject on the right, large 3D bold Indonesian typography "${t.title.split(' ').slice(0, 3).join(' ')}" with bright drop shadow on the left. Color Palette: High-contrast electric blue, neon yellow, and deep navy background. Lighting: Dual rim lighting, cinematic studio glow. Elements: Floating glowing graphical badges, arrow accent, subtle motion blur. Quality: 8k resolution, ultra detailed, award-winning YouTube thumbnail design, Behance trending, sharp focus ${aspectRatio}`;
    }).join('\n\n');
  } else {
    fallbackPrompt = `Professional ${type.toLowerCase()} graphic design for "${idea}". Subject: Hero visual centerpiece representing ${idea} with clean modern aesthetic. Style: Contemporary commercial branding, minimal yet impactful aesthetic. Layout: Balanced visual hierarchy with clear focal point, structured grid arrangement, elegant negative space. Typography: Prominent Indonesian text overlay reading "${idea.slice(0, 30)}" in bold modern sans-serif typography with high legibility. Color Palette: Harmonious commercial palette with primary vibrant accent, deep charcoal background, and clean crisp white details. Lighting: Soft studio lighting, subtle volumetric glow, premium reflections. Elements: Sleek geometric badges, minimal line art flourishes, data callout modules. Quality: 8k resolution, ultra detailed, award winning design, premium layout, commercial advertising quality, Dribbble and Behance trending ${aspectRatio}`;
  }

  return res.json({
    professionalPrompt: fallbackPrompt,
    negativePrompt: "low quality, blurry, pixelated, bad typography, cropped text, poor composition, watermark, duplicate objects, overexposed, underexposed, messy layout, distorted graphics, text overlay error",
    strategyTargetAudience: `Ditargetkan untuk audiens modern yang responsif terhadap visual ${type.toLowerCase()} yang bersih, profesional, dan to-the-point.`,
    strategyVisualApproach: `Menggunakan pendekatan visual kontemporer dengan hierarki yang jelas agar pesan utama langsung tertangkap dalam 3 detik pertama.`,
    strategyColorStrategy: `Kombinasi warna kontras tinggi dengan aksen dinamis untuk menciptakan daya tarik visual optimal dan keterbacaan prima.`,
    strategyLayoutStrategy: `Tata letak terstruktur dengan pembagian ruang negatif proporsional untuk memandu mata audiens dari judul ke poin utama.`,
    strategyTypographyStrategy: `Tipografi berani (bold) dengan ukuran proporsional dalam Bahasa Indonesia yang dioptimalkan untuk kejelasan maksimal di semua layar.`
  });
});

// ================= TTS AUDIO GENERATOR API ROUTE =================
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { script, voiceName = 'Kore' } = req.body;
    if (!script || !script.trim()) {
      return res.status(400).json({ error: 'Script masih kosong!' });
    }

    const cleanScript = script.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Use official supported Gemini TTS models in priority order
      const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];
      for (const model of ttsModels) {
        try {
          const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          
          // Note: Send ONLY cleanScript without systemInstruction (TTS models do not support systemInstruction)
          const ttsPayload = {
            contents: [{ parts: [{ text: cleanScript }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName } }
              }
            }
          };

          const resp = await fetch(ttsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ttsPayload)
          });

          if (resp.ok) {
            const result = await resp.json();
            const part = result?.candidates?.[0]?.content?.parts?.[0];
            const audioData = part?.inlineData?.data;
            const mimeType = part?.inlineData?.mimeType;

            if (audioData && mimeType && mimeType.startsWith("audio/")) {
              return res.json({ audioData, mimeType });
            }
          } else {
            const errText = await resp.text();
            console.warn(`TTS model ${model} HTTP error ${resp.status}:`, errText);
          }
        } catch (mErr) {
          console.warn(`TTS model ${model} failed:`, mErr);
        }
      }
    }

    return res.json({ fallback: true });
  } catch (err: any) {
    console.error('Error in /api/tts/generate:', err);
    return res.json({ fallback: true });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 StoryBoard AI Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
