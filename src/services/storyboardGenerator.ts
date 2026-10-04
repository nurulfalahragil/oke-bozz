import { GeneratorRequest, StoryboardData, StoryboardPart, StoryboardScene } from '../types';
import { getStyleById } from '../data/storyboardStyles';

export function fitVoToDuration(text: string, panelDurationSec: number): string {
  const maxWords = Math.max(3, Math.floor(panelDurationSec * 2.2));
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;

  let sliced = words.slice(0, maxWords).join(' ');
  sliced = sliced.replace(/[,;]\s*$/, '').trim();
  if (!/[.!?]$/.test(sliced)) {
    sliced += '!';
  }
  return sliced;
}

export function estimateSpeakingDuration(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return +(words.length / 2.2).toFixed(1);
}

export async function generateStoryboardWithAi(request: GeneratorRequest): Promise<StoryboardData> {
  try {
    const response = await fetch('/api/generate-storyboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.parts && data.parts.length > 0 && data.parts[0]?.scenes?.length > 0) {
        // Ensure consistency of scenesCount and partsCount
        data.scenesCount = request.numPanels;
        data.partsCount = request.numParts;
        data.durationTotal = request.duration;
        data.style = request.storyboardStyle;

        // Auto-calibrate VO duration so speaking never rushes or cuts off
        const durationPerPart = Math.round(request.duration / request.numParts);
        const panelSec = +(durationPerPart / request.numPanels).toFixed(1);
        const maxWords = Math.max(3, Math.floor(panelSec * 2.2));

        data.parts.forEach((p: StoryboardPart) => {
          p.scenes.forEach((sc: StoryboardScene) => {
            const wordCount = sc.vo.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount > maxWords) {
              sc.vo = fitVoToDuration(sc.vo, panelSec);
              sc.subtitle = sc.vo;
            }
          });
        });

        return data;
      }
    }
  } catch (err) {
    console.warn('API call failed or unavailable, using intelligent local engine:', err);
  }

  // Fallback to local intelligent synthesis
  return generateLocalStoryboard(request);
}

interface SceneBlueprint {
  phaseTitle: string;
  shot: string;
  angle: string;
  voId: string;
  voEn: string;
  callout: string;
  visualDesc: string;
  cameraMovement: string;
  hasInsetCollage?: boolean;
  isLastCta?: boolean;
}

function generateStyleSpecificVoAndVisuals(
  styleId: string,
  sceneIndex: number, // 0 to 5
  rawSceneText: string,
  productName: string,
  modelPersona: string,
  features: string[],
  panelDuration: number
): {
  phaseTitle: string;
  shot: string;
  angle: string;
  voId: string;
  voEn: string;
  callout: string;
  visualDesc: string;
  cameraMovement: string;
  hasInsetCollage?: boolean;
  isLastCta?: boolean;
} {
  const f0 = features[0] || 'Kualitas Premium';
  const f1 = features[1] || 'Fungsional & Praktis';
  const isShort = panelDuration <= 3.2;

  // Clean raw scene text into a title
  const cleanTitle = rawSceneText.replace(/^Scene\s*\d+\s*:\s*/i, '').trim();
  const phaseTitle = cleanTitle.split(/[—–]/)[0].trim() || `Adegan ${sceneIndex + 1}`;

  // 1. ASMR & SOUND STYLES (asmr_product, asmr_detail)
  if (styleId === 'asmr_product' || styleId === 'asmr_detail') {
    const asmrMap = [
      {
        shot: 'Extreme Macro 100mm (kemasan & tekstur)',
        angle: 'Top down 45 degree',
        callout: 'Dengerin tekstur kemasannya... 🎧',
        camera: 'Extreme slow gliding macro shot dengan visual hening fokus detail',
        voId: isShort ? `Dengerin suara kemasannya...` : `Dengerin suara kemasannya... renyah dan rapi banget.`,
        voEn: `Listen to this packaging sound...`,
        visual: `Kemasan bertekstur ${productName} di atas meja kayu aesthetic, jari tangan mengetuk halus permukaannya.`,
      },
      {
        shot: 'Super close up hands & nail tapping',
        angle: 'Macro eye level',
        callout: 'Tapping renyah memuaskan 🫧',
        camera: 'Fixed locked macro framing menonjolkan getaran ketukan halus',
        voId: isShort ? `Ketukan halusnya bertekstur.` : `Ketukan jari pada materialnya kerasa padat dan premium.`,
        voEn: `Crisp tactile tapping on premium texture.`,
        visual: `Ujung kuku mengetuk permukaan ${productName} secara berirama, menangkap resonansi material solid.`,
      },
      {
        shot: 'Macro close up mekanikal / pembukaan',
        angle: 'Low angle macro',
        callout: 'Bunyi klik presisi 🔊',
        camera: 'Slow pedestal zoom ke titik bukaan / segel',
        voId: isShort ? `Bunyi kliknya presisi banget.` : `Bunyi klik saat dibuka halus banget, tanpa hambatan.`,
        voEn: `Satisfying mechanical precision sound.`,
        visual: `Tangan membuka penutup/resleting ${productName} dengan gerakan perlahan, mengeluarkan bunyi klik lembut.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Extreme close up 1:1 macro',
        angle: 'Top-down macro',
        callout: 'Tekstur super lembut & rapi ✨',
        camera: 'Micro dolly shot meluncur di atas tekstur bahan',
        voId: isShort ? `Bahan ${f0.toLowerCase()} sangat halus.` : `Sentuhan ${f0.toLowerCase()} yang lembut dan detail jahitan rapi.`,
        voEn: `Ultra soft texture and fine details.`,
        visual: `Permukaan material ${productName} disorot cahaya lembut, memperlihatkan detail serat dan lekukan presisi.`,
      },
      {
        shot: 'Medium close up (sensasi pemakaian)',
        angle: 'Eye level shallow depth',
        callout: 'Sensasi 100% Satisfying 🤍',
        camera: 'Slow drift follow shot mengikuti aksi pemakaian',
        voId: isShort ? `Sensasi memuaskan saat dipakai.` : `Sensasi memuaskan yang bikin rileks setiap kali digunakan.`,
        voEn: `Pure relaxing sensation in every use.`,
        visual: `Model ${modelPersona} menikmati sensasi kelembutan ${productName} dengan ekspresi tenang dan rileks.`,
      },
      {
        shot: 'Medium close up whisper framing',
        angle: 'Eye level',
        callout: 'Bisikan promo eksklusif 🤫',
        camera: 'Gentle slow push-in zoom ke senyuman model dan produk',
        voId: isShort ? `Rasakan sensasinya, klik link sekarang.` : `Rasakan sendiri sensasi memuaskannya. Cek keranjang sekarang ya.`,
        voEn: `Experience it yourself, claim yours today.`,
        visual: `${productName} berdiri megah di samping model yang tersenyum tenang, diiringi teks bisikan promo penutup.`,
        isLastCta: true,
      },
    ];
    const item = asmrMap[sceneIndex] || asmrMap[0];
    return {
      phaseTitle: phaseTitle || `ASMR Tahap ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 2. SATISFYING & ODDLY SATISFYING STYLES
  if (styleId === 'satisfying') {
    const satMap = [
      {
        shot: 'Top-down locked tripod',
        angle: 'Bird-eye 90 degree',
        callout: 'Kondisi awal sebelum dibersihkan ❌',
        camera: 'Locked static framing fokus pada kontras area',
        voId: isShort ? `Lihat perbedaan sebelum & sesudah.` : `Kekacauan yang menunggu dibersihkan dalam sekejap.`,
        voEn: `Watch this satisfying transformation.`,
        visual: `Area bernoda/kusam sebelum ${productName} diaplikasikan.`,
      },
      {
        shot: 'Close up slider tracking',
        angle: '45 degree',
        callout: 'Satu sapuan langsung kinclong! 🫧',
        camera: 'Smooth linear tracking mengikuti sapuan produk',
        voId: isShort ? `Satu sapuan langsung bersih!` : `Cukup satu kali sapuan, noda langsung hilang seketika!`,
        voEn: `One single glide clears everything!`,
        visual: `${productName} digerakkan satu tarikan garis lurus, meninggalkan jejak bersih mengkilap seketika.`,
      },
      {
        shot: 'Extreme close up split comparison',
        angle: 'Macro eye level',
        callout: 'Garis kontras bersih sempurna ✨',
        camera: 'Slow push-in zoom ke batas area bersih',
        voId: isShort ? `Kontrasnya bikin puas banget.` : `Perbedaan garis bersihnya bener-bener memuaskan mata.`,
        voEn: `Crystal clear contrast line.`,
        visual: `Garis pemisah antara area kotor dan area yang sudah disentuh ${productName} tampak sangat kontras.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Medium tracking shot',
        angle: 'Slight high angle',
        callout: 'Sapuan berlanjut tuntas ⚡',
        camera: 'Continuous smooth pan melintasi seluruh permukaan',
        voId: isShort ? `Proses cepat tanpa sisa.` : `Seluruh permukaan berubah kinclong tanpa perlu tenaga ekstra.`,
        voEn: `Effortless clean across whole surface.`,
        visual: `Gerakan sapuan berlanjut rapi hingga seluruh area berubah menjadi bersih bercahaya.`,
      },
      {
        shot: 'Macro gleam & light reflection',
        angle: 'Low angle reflection',
        callout: 'Kilau pantulan cahaya mewah 🌟',
        camera: 'Dolly arc shot menangkap kilau pantulan cahaya',
        voId: isShort ? `Kilaunya sempurna banget!` : `Pantulan kilau cahaya membuktikan hasil bersih maksimal!`,
        voEn: `Stunning glossy light reflection!`,
        visual: `Cahaya memantul sempurna dari permukaan yang telah dibersihkan oleh ${productName}.`,
      },
      {
        shot: 'Medium close up hero pose',
        angle: 'Eye level',
        callout: 'Puas maksimal! Checkout sekarang ♡',
        camera: 'Slow push in focus on CTA and smile',
        voId: isShort ? `Yuk rasakan kepuasannya sekarang!` : `Puas banget kan? Yuk miliki sekarang sebelum kehabisan diskon!`,
        voEn: `Get this satisfying experience today!`,
        visual: `Model tersenyum puas memegang ${productName} dengan latar hasil bersih sempurna dan 4 badge checklist.`,
        isLastCta: true,
      },
    ];
    const item = satMap[sceneIndex] || satMap[0];
    return {
      phaseTitle: phaseTitle || `Satisfying Adegan ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 3. BEFORE & AFTER / TRANSFORMATION
  if (styleId === 'before_after' || styleId === 'transformation') {
    const baMap = [
      {
        shot: 'Medium close up (frustrasi / keluhan)',
        angle: 'Eye level, moody tone',
        callout: 'Kondisi Before: Pusing & Ribet ❌',
        camera: 'Slow tracking shot menangkap ekspresi keluhan',
        voId: isShort ? `Pernah ngalamin masalah ini?` : `Pusing sama masalah yang gak kunjung kelar?`,
        voEn: `Struggling with this everyday problem?`,
        visual: `Model ${modelPersona} mengeluh dengan kondisi sebelum menggunakan produk.`,
      },
      {
        shot: 'Close up detail masalah awal',
        angle: 'Macro eye level',
        callout: 'Kondisi kusam & bermasalah',
        camera: 'Push in cepat ke area bermasalah',
        voId: isShort ? `Kondisi awal yang bikin gak pede.` : `Kondisi kusam yang bikin gak percaya diri setiap hari.`,
        voEn: `The frustrating condition before.`,
        visual: `Detail close-up kondisi bermasalah sebelum adanya solusi dari ${productName}.`,
      },
      {
        shot: 'Medium shot hero product entry',
        angle: 'Low angle heroic',
        callout: 'Ini dia penyelamatnya! ✨',
        camera: 'Smooth whip pan reveal produk dengan cahaya terang',
        voId: isShort ? `Untung ada ${productName.toLowerCase()}!` : `Sampai akhirnya aku nemu ${productName.toLowerCase()} ini!`,
        voEn: `Meet your ultimate savior: ${productName}!`,
        visual: `${productName} hadir dengan kemasan bercahaya memukau sebagai solusi praktis.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Close up hands-on application',
        angle: '45 degree action angle',
        callout: 'Pemakaian mudah & instan ⚡',
        camera: 'Tracking follow shot aksi pemakaian produk',
        voId: isShort ? `Pakainya gampang dan cepat.` : `Cara pakainya super simpel, formula ${f0.toLowerCase()} langsung bekerja.`,
        voEn: `Simple application with instant action.`,
        visual: `Tangan mengaplikasikan ${productName} secara mudah dan nyaman tanpa hambatan.`,
      },
      {
        shot: 'Extreme split screen Before vs After reveal',
        angle: 'Hero eye level',
        callout: 'Hasil After: Berubah Drastis! 💖',
        camera: 'Dynamic split-slider wipe reveal',
        voId: isShort ? `Hasilnya beneran glowing drastis!` : `Lihat hasilnya, langsung berubah drastis dan memukau!`,
        voEn: `Look at the dramatic after transformation!`,
        visual: `Reveal dramatis perbandingan Before vs After yang menunjukkan hasil sempurna dan cerah.`,
      },
      {
        shot: 'Medium close up smiling confidence',
        angle: 'Eye level with CTA banner',
        callout: 'Buktikan sendiri sekarang juga! ♡',
        camera: 'Slow pedestal zoom ke model dan produk',
        voId: isShort ? `Yuk coba dan rasakan perubahannya!` : `Buktikan sendiri perubahannya, checkout sekarang mumpung diskon!`,
        voEn: `Experience the transformation yourself now!`,
        visual: `Model tersenyum percaya diri memegang ${productName} didampingi 4 badge checklist transformasi.`,
        isLastCta: true,
      },
    ];
    const item = baMap[sceneIndex] || baMap[0];
    return {
      phaseTitle: phaseTitle || `Transformasi Adegan ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 4. TUTORIAL & EDUCATIONAL STYLES (tutorial, how_to_use, product_demo, myth_fact, behind_the_scenes)
  if (styleId === 'tutorial' || styleId === 'how_to_use' || styleId === 'product_demo' || styleId === 'myth_fact') {
    const tutMap = [
      {
        shot: 'Medium close up (hook tutorial)',
        angle: 'Eye level',
        callout: 'Tutorial 3 Menit Mudah! 📋',
        camera: 'Dolly in cepat ke ekspresi model',
        voId: isShort ? `Mau hasil rapi dalam 3 menit?` : `Mau hasil maksimal dalam 3 menit? Ini dia tutorial mudahnya!`,
        voEn: `Want perfect results in 3 minutes? Here is how!`,
        visual: `Model ${modelPersona} menyapa penonton memperlihatkan hasil akhir memukau dari ${productName}.`,
      },
      {
        shot: 'Top-down flatlay desk guide',
        angle: 'Overhead 90 degree',
        callout: 'Step 1: Persiapan & Takaran 1️⃣',
        camera: 'Steady overhead shot dengan label grafis Step 1',
        voId: isShort ? `Step 1: Siapkan produk dengan benar.` : `Langkah pertama: Siapkan ${productName.toLowerCase()} dan pegang dengan posisi nyaman.`,
        voEn: `Step 1: Prepare and position product properly.`,
        visual: `Tangan menata ${productName} di meja tutorial dengan instruksi grafis nomor 1.`,
      },
      {
        shot: 'Close up action demo',
        angle: '45 degree instruction angle',
        callout: 'Step 2: Aplikasikan merata 2️⃣',
        camera: 'Smooth tracking follow shot ke titik aplikasi',
        voId: isShort ? `Step 2: Aplikasikan secara merata.` : `Langkah kedua: Aplikasikan secara merata menggunakan fitur ${f0.toLowerCase()}.`,
        voEn: `Step 2: Apply evenly with smooth strokes.`,
        visual: `Demonstrasi jelas cara mengaplikasikan produk secara bertahap dan tepat sasaran.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Macro close up pro-tips',
        angle: 'Macro detail',
        callout: 'Step 3: Trik rahasia tahan lama 3️⃣',
        camera: 'Slow zoom in ke detail trik khusus',
        voId: isShort ? `Step 3: Kunci hasil agar tahan lama.` : `Kunci rahasianya: Ratakan perlahan agar hasil menempel kuat seharian.`,
        voEn: `Step 3: Pro tip for long lasting perfection.`,
        visual: `Close-up tips trik khusus agar hasil pemakaian ${productName} maksimal tanpa cacat.`,
      },
      {
        shot: 'Medium full shot review hasil',
        angle: 'Eye level checkmark',
        callout: 'Hasil Sempurna 10/10! ✅',
        camera: 'Orbit 45 degree menampakkan hasil tuntas',
        voId: isShort ? `Hasilnya rapi dan profesional!` : `Tadaa! Hasilnya langsung rapi sempurna dan profesional.`,
        voEn: `Tada! Flawless, professional finish.`,
        visual: `Model menunjukkan hasil tuntas dengan senyuman puas dan grafis centang hijau.`,
      },
      {
        shot: 'Medium close up CTA bookmark',
        angle: 'Eye level',
        callout: 'Simpan video & Cek link promo! ♡',
        camera: 'Slow push in to CTA and product',
        voId: isShort ? `Simpan video ini dan checkout sekarang!` : `Simpan tutorial ini dan langsung order di keranjang ya!`,
        voEn: `Save this tutorial and grab yours today!`,
        visual: `Model memegang ${productName} didampingi 4 checklist keunggulan dan teks ajakan checkout.`,
        isLastCta: true,
      },
    ];
    const item = tutMap[sceneIndex] || tutMap[0];
    return {
      phaseTitle: phaseTitle || `Panduan Step ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 5. CINEMATIC & LUXURY STYLES (mini_commercial, cinematic_product, aesthetic_visual, slow_motion, macro_product_shot, emotional_cinematic)
  if (
    styleId === 'mini_commercial' ||
    styleId === 'cinematic_product' ||
    styleId === 'aesthetic_visual' ||
    styleId === 'slow_motion' ||
    styleId === 'macro_product_shot' ||
    styleId === 'emotional_cinematic'
  ) {
    const cineMap = [
      {
        shot: 'Wide cinematic establishing shot (2.39:1 anamorphic)',
        angle: 'Low angle atmospheric',
        callout: 'Sinematik Megah & Elegan 🎬',
        camera: 'Slow atmospheric drone or crane descent with lens flare',
        voId: isShort ? `Keindahan sejati dimulai di sini.` : `Kemewahan sejati berawal dari sebuah sentuhan presisi.`,
        voEn: `True elegance begins with flawless precision.`,
        visual: `Siluet lanskap modern dengan pencahayaan golden hour dramatis, memperkenalkan aura eksklusif ${productName}.`,
      },
      {
        shot: 'Medium tracking shot (karakter elegan)',
        angle: 'Slight low angle tracking',
        callout: 'Karakter berkelas & percaya diri',
        camera: 'Smooth gimbal tracking mengikuti langkah subjek',
        voId: isShort ? `Diciptakan untuk pribadi istimewa.` : `Dirancang khusus bagi mereka yang menghargai kesempurnaan.`,
        voEn: `Crafted for those who demand perfection.`,
        visual: `Model ${modelPersona} melangkah penuh wibawa dengan busana haute couture, memancarkan pesona anggun.`,
      },
      {
        shot: 'Extreme macro probe lens 100fps slow-motion',
        angle: 'Macro oblique angle',
        callout: 'Material premium berbalut kemilau ✨',
        camera: 'Motorized slider glide across textures with specular highlights',
        voId: isShort ? `Detail ${f0.toLowerCase()} tanpa cela.` : `Setiap detail ${f0.toLowerCase()} dipahat dengan standar tertinggi.`,
        voEn: `Every immaculate detail crafted to perfection.`,
        visual: `Lensa macro menelusuri detail tekstur dan pantulan cahaya emas pada logo dan lekukan ${productName}.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Dynamic 360-degree orbital hero shot',
        angle: 'Eye level orbital',
        callout: 'Fungsionalitas berpadu seni',
        camera: 'High-speed camera robotic arm arc orbit',
        voId: isShort ? `Harmoni fungsionalitas dan estetika.` : `Menyatukan kemudahan fungsional dalam balutan estetika abadi.`,
        voEn: `Harmonizing everyday function and timeless beauty.`,
        visual: `${productName} melayang perlahan dengan partikel cahaya atmosferik mengelilinginya.`,
      },
      {
        shot: 'Medium close-up emotional resonance',
        angle: 'Hero eye level',
        callout: 'Momen kepuasan tak tertandingi 🌟',
        camera: 'Slow motion push-in to confident smile',
        voId: isShort ? `Momen terbaik dalam hidupmu.` : `Menghadirkan kepuasan yang menyempurnakan setiap momen berhargamu.`,
        voEn: `Elevating every precious moment of your life.`,
        visual: `Model tersenyum anggun memegang produk dengan tatapan percaya diri ke arah kamera.`,
      },
      {
        shot: 'Hero product pedestal shot with golden typography',
        angle: 'Low angle heroic',
        callout: 'Miliki Kemewahan Ini Sekarang ♡',
        camera: 'Slow cinematic crane pull-back with glowing outro tagline',
        voId: isShort ? `Miliki sekarang, jadilah yang terdepan.` : `Wujudkan kemewahan Anda hari ini. Tersedia eksklusif di link resmi.`,
        voEn: `Claim your luxury today. Exclusively available now.`,
        visual: `${productName} berdiri di atas podium marmer megah diiringi tagline brand berkilau emas dan logo resmi.`,
        isLastCta: true,
      },
    ];
    const item = cineMap[sceneIndex] || cineMap[0];
    return {
      phaseTitle: phaseTitle || `Cinematic Act ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 6. UGC & SOCIAL MEDIA (ugc, pov, testimonial, first_impression, reaction_surprise, challenge)
  if (
    styleId === 'ugc' ||
    styleId === 'pov' ||
    styleId === 'testimonial' ||
    styleId === 'first_impression' ||
    styleId === 'reaction_surprise' ||
    styleId === 'challenge'
  ) {
    const ugcMap = [
      {
        shot: 'Handheld smartphone selfie angle (vertical 9:16)',
        angle: 'Front-facing eye level',
        callout: 'Racun baru TikTok! Wajib tonton 🔥',
        camera: 'Handheld natural vlogger motion with organic micro-shake',
        voId: isShort ? `Gais, racun baru yang lagi viral!` : `Gais, sumpah ini racun baru yang wajib banget kalian tahu!`,
        voEn: `Guys, you won't believe what I just discovered!`,
        visual: `Kreator ${modelPersona} berbicara langsung ke kamera ponsel di kamar aesthetic dengan ekspresi antusias.`,
      },
      {
        shot: 'Medium close up showing product to camera',
        angle: 'Slight high angle selfie',
        callout: 'Awalnya ragu, pas coba kaget! 😲',
        camera: 'Smooth arm push-in mendekatkan produk ke lensa',
        voId: isShort ? `Awalnya ragu, tapi pas dicoba...` : `Awalnya aku skeptis, tapi pas barangnya dateng langsung syok!`,
        voEn: `I was skeptical at first, but look at this!`,
        visual: `Kreator memegang ${productName} tepat di depan kamera ponsel memperlihatkan bentuk aslinya.`,
      },
      {
        shot: 'First-person POV live demo',
        angle: 'POV first person view',
        callout: 'Lihat deh kualitasnya! ✨',
        camera: 'Over-the-shoulder POV camera tracking hands',
        voId: isShort ? `Bahan ${f0.toLowerCase()} juara banget.` : `Lihat deh, ${f0.toLowerCase()} dan finishing-nya beneran rapi pol.`,
        voEn: `Look at the quality and neat finishing.`,
        visual: `Sudut pandang mata pertama memperlihatkan tangan kreator membuka dan mengecek detail ${productName}.`,
        hasInsetCollage: true,
      },
      {
        shot: 'Close up live hands-on testing',
        angle: 'Eye level action',
        callout: 'Praktis banget dipakenya ⚡',
        camera: 'Quick snappy zoom ke aksi pemakaian',
        voId: isShort ? `Super gampang dan praktis!` : `Pas dipake langsung kerasa bedanya, ${f1.toLowerCase()} beneran kepake.`,
        voEn: `Super easy and practical in real life.`,
        visual: `Kreator langsung mencoba memakai ${productName} dalam aktivitas harian secara spontan.`,
      },
      {
        shot: 'Medium close up genuine reaction',
        angle: 'Selfie front camera',
        callout: 'Rating: 100/10! Beneran worth it ⭐',
        camera: 'Snap zoom ke ekspresi kagum kreator',
        voId: isShort ? `Gak nyesel sama sekali belinya!` : `Gak nyesel sama sekali, ini beneran rating 10 dari 10!`,
        voEn: `Zero regrets, this is a solid 10 out of 10!`,
        visual: `Kreator mengacungkan jempol dengan ekspresi wajah puas dan bahagia memamerkan produk.`,
      },
      {
        shot: 'Medium shot pointing to yellow cart / link',
        angle: 'Eye level selfie framing',
        callout: 'Checkout di keranjang sekarang! 🛒',
        camera: 'Gentle nod follow down to cart callout banner',
        voId: isShort ? `Klik keranjang kuning sebelum habis!` : `Mumpung masih promo diskon, langsung checkout di keranjang kuning ya!`,
        voEn: `Click the link below before promo ends!`,
        visual: `Kreator menunjuk ke arah tombol keranjang kuning dengan senyum ramah dan 4 badge checklist.`,
        isLastCta: true,
      },
    ];
    const item = ugcMap[sceneIndex] || ugcMap[0];
    return {
      phaseTitle: phaseTitle || `UGC Scene ${sceneIndex + 1}`,
      shot: item.shot,
      angle: item.angle,
      callout: item.callout,
      cameraMovement: item.camera,
      voId: item.voId,
      voEn: item.voEn,
      visualDesc: item.visual,
      hasInsetCollage: item.hasInsetCollage,
      isLastCta: item.isLastCta,
    };
  }

  // 7. DEFAULT / ADAPTIVE FALLBACK FOR ANY OTHER STYLE (uses raw breakdown)
  const defaultMap = [
    {
      shot: 'Medium shot (kamera depan interaktif)',
      angle: 'Eye level',
      callout: `${productName.split(' ')[0]} pilihan cerdas! ✨`,
      camera: 'Smooth forward tracking shot at eye level',
      voId: isShort ? `Lagi cari ${productName.toLowerCase()} terbaik?` : `Ini dia rahasia tampil maksimal dengan ${productName.toLowerCase()}!`,
      voEn: `Meet the new ${productName}!`,
      visual: `${rawSceneText}. Model ${modelPersona} berinteraksi dengan ${productName}.`,
    },
    {
      shot: 'Medium close up',
      angle: 'Slight angle / 45 degree',
      callout: 'Desain elegan & fungsional',
      camera: 'Slow 45-degree orbit around subject',
      voId: isShort ? `Desainnya pas buat kebutuhanmu.` : `Didesain dengan cermat untuk mendukung segala aktivitas harianmu.`,
      voEn: `Built for your daily convenience.`,
      visual: `${rawSceneText}. Memperlihatkan siluet dan proporsi produk secara apik.`,
    },
    {
      shot: 'Close up + 4-photo insert detail',
      angle: 'Macro / Close up',
      callout: f0,
      camera: 'Macro dolly shot menelusuri detail tekstur',
      voId: isShort ? `Bahan ${f0.toLowerCase()} kuat & rapi.` : `Material ${f0.toLowerCase()} dengan sentuhan akhir premium dan tahan lama.`,
      voEn: `Premium materials and craftsmanship.`,
      visual: `${rawSceneText}. Kolase 4 foto detail macro material dan fitur utama.`,
      hasInsetCollage: true,
    },
    {
      shot: 'Medium shot aksi nyata',
      angle: 'Eye level',
      callout: f1,
      camera: 'Dynamic follow shot mengikuti aksi penggunaan',
      voId: isShort ? `Praktis, ${f1.toLowerCase()} mudah digunakan.` : `Super praktis saat digunakan, ${f1.toLowerCase()} bikin semua jadi mudah.`,
      voEn: `Convenient and effortless in real life.`,
      visual: `${rawSceneText}. Karakter merasakan langsung kemudahan fitur produk.`,
    },
    {
      shot: 'Close up ekspresi kepuasan',
      angle: 'Hero eye level',
      callout: '100% Terbukti Memuaskan ⭐',
      camera: 'Smooth push-in ke senyuman model dan produk',
      voId: isShort ? `Hasilnya terbukti memuaskan banget!` : `Hasilnya benar-benar nyata dan memuaskan di luar ekspektasi!`,
      voEn: `Tangible results exceeding expectations!`,
      visual: `${rawSceneText}. Ekspresi wajah bahagia berpadu dengan tampilan produk.`,
    },
    {
      shot: 'Medium close up (hero pose + CTA)',
      angle: 'Eye level',
      callout: 'Order sekarang & dapatkan promonya! ♡',
      camera: 'Slow pedestal zoom ke produk dan CTA grafis penutup',
      voId: isShort ? `Yuk checkout sekarang sebelum kehabisan!` : `Jangan sampai kehabisan promonya, checkout sekarang juga ya!`,
      voEn: `Grab yours today before limited discounts run out!`,
      visual: `${rawSceneText}. Model tersenyum memegang produk ke depan dada didampingi 4 badge checklist.`,
      isLastCta: true,
    },
  ];

  const item = defaultMap[sceneIndex] || defaultMap[0];
  return {
    phaseTitle: phaseTitle || `Tahap ${sceneIndex + 1}`,
    shot: item.shot,
    angle: item.angle,
    callout: item.callout,
    cameraMovement: item.camera,
    voId: item.voId,
    voEn: item.voEn,
    visualDesc: item.visual,
    hasInsetCollage: item.hasInsetCollage,
    isLastCta: item.isLastCta,
  };
}

function getStyleBlueprints(
  styleId: string,
  numPanels: number,
  panelDuration: number,
  productName: string,
  modelPersona: string,
  features: string[]
): SceneBlueprint[] {
  const styleItem = getStyleById(styleId);
  const rawBreakdowns = styleItem.structureBreakdown && styleItem.structureBreakdown.length >= 6
    ? styleItem.structureBreakdown
    : [
        'Scene 1: Hook pembuka menarik perhatian',
        'Scene 2: Eksplorasi fitur dan kenyamanan karakter',
        'Scene 3: Detail bahan dan kompartemen produk',
        'Scene 4: Demonstrasi aksi pemakaian nyata',
        'Scene 5: Hasil pembuktian dan reaksi kepuasan',
        'Scene 6: Call to Action penawaran spesial',
      ];

  // Build all 6 blueprints dynamically tailored to this specific style
  const full6Blueprints: SceneBlueprint[] = rawBreakdowns.map((rawText, idx) => {
    return generateStyleSpecificVoAndVisuals(
      styleId,
      idx,
      rawText,
      productName,
      modelPersona,
      features,
      panelDuration
    );
  });

  // Now map according to requested numPanels:
  if (numPanels === 6) {
    return full6Blueprints;
  }
  if (numPanels === 4) {
    // Indices: 0 (Hook), 1 (Feature/Exploration), 3 (Action/Demo), 5 (Result/CTA)
    const p4 = [full6Blueprints[0], full6Blueprints[1], full6Blueprints[3], full6Blueprints[5]];
    p4[3].isLastCta = true;
    return p4;
  }
  if (numPanels === 3) {
    // Indices: 0 (Hook), 3 (Action/Demo), 5 (CTA)
    const p3 = [full6Blueprints[0], full6Blueprints[3], full6Blueprints[5]];
    p3[2].isLastCta = true;
    return p3;
  }
  if (numPanels === 2) {
    return [full6Blueprints[0], full6Blueprints[5]];
  }

  return full6Blueprints.slice(0, numPanels);
}

export function generateLocalStoryboard(request: GeneratorRequest): StoryboardData {
  const {
    brandName = 'BRAND STORYBOARD IKLAN',
    productName,
    tagline = 'Solusi Terbaik untuk Aktivitasmu',
    productDescription,
    productFeatures = [],
    storyboardStyle = 'lifestyle',
    numParts = 1,
    numPanels = 6,
    duration = 20,
    aspectRatio = '9:16',
    targetAudience = 'Target pasar umum',
    musicStyle = 'Upbeat modern commercial pop',
    language = 'id',
    modelPersonaPreset = 'Model Profesional',
  } = request;

  const styleItem = getStyleById(storyboardStyle);
  const styleDisplayName = styleItem.name;

  const featuresList = productFeatures.length > 0
    ? productFeatures
    : ['Bahan Premium Berkualitas', 'Banyak Kompartemen', 'Akses Cepat & Fungsional', 'Resleting Kuat & Halus'];

  const durationPerPart = Math.round(duration / numParts);
  const panelDuration = +(durationPerPart / numPanels).toFixed(1);
  const blueprints = getStyleBlueprints(storyboardStyle, numPanels, panelDuration, productName, modelPersonaPreset, featuresList);

  const parts: StoryboardPart[] = [];

  for (let p = 1; p <= numParts; p++) {
    const scenes: StoryboardScene[] = [];

    for (let s = 1; s <= numPanels; s++) {
      const bp = blueprints[s - 1] || blueprints[blueprints.length - 1];
      const startSec = Math.round((s - 1) * panelDuration);
      const endSec = s === numPanels ? durationPerPart : Math.round(s * panelDuration);
      const timeRange = `${startSec} – ${endSec} detik`;
      const id = `part-${p}-scene-${s}`;

      // Strictly fit VO to panel duration
      const rawVo = language === 'id' ? bp.voId : bp.voEn;
      const vo = fitVoToDuration(rawVo, panelDuration);
      const subtitle = vo;
      const calloutText = bp.callout;
      const isLastScene = s === numPanels || bp.isLastCta;
      const featureBadges = isLastScene ? featuresList.slice(0, 4) : undefined;
      const hasInsetCollage = bp.hasInsetCollage || false;

      const scenePromptTti = `Award-winning commercial advertising photography of "${productName}" (${styleDisplayName} aesthetic). Visual scene: ${bp.visualDesc}. Optics & Cinematography: Shot on Hasselblad H6D-100c with 85mm f/1.4 lens or Arri Alexa LF, ${bp.shot}, ${bp.angle}, shallow depth of field with creamy natural bokeh. Lighting & Atmosphere: ${styleItem.lightingStyle}, Profoto softbox key with subtle specular rim highlights accentuating physical material textures. Color Grading & Texture: Master 35mm film color science, true-to-life skin tones for ${modelPersonaPreset}, hyper-crisp physical details, pristine 8k editorial resolution --ar ${aspectRatio} --v 6.1 --style raw`;
      const scenePromptTtv = `[Camera Movement: ${bp.cameraMovement}] [Shot Framing: ${bp.shot}, ${bp.angle}] [Lighting & Mood: ${styleItem.lightingStyle}] High-production 4K 60fps commercial advertising video shot of "${productName}" in ${styleDisplayName} style. Action choreography: ${bp.visualDesc}. Actor motion: ${modelPersonaPreset} with fluid, natural micro-expressions. Lighting dynamics: Volumetric ambient light with soft specular reflections on product surface. Audio Cue & Synchronized VO: "${vo}". Film grading: 35mm Kodak 2383 cinematic LUT, photorealistic motion blur, crisp textures, zero distortion, high dynamic range.`;

      scenes.push({
        id,
        sceneNumber: s,
        phaseTitle: bp.phaseTitle,
        timeRange,
        shot: bp.shot,
        angle: bp.angle,
        duration: timeRange,
        vo,
        subtitle,
        calloutText,
        calloutArrowDirection: s % 2 === 0 ? 'left' : 'right',
        featureBadges,
        hasInsetCollage,
        insetPhotos: hasInsetCollage ? [
          { id: `${id}-in-1`, title: 'Material Utama', callout: featuresList[0] || 'Bahan Premium & Tahan Lama', imageDescription: 'Tampak depan produk menonjolkan tekstur material dan kerapian jahitan' },
          { id: `${id}-in-2`, title: 'Kompartemen Luas', callout: featuresList[1] || 'Banyak Kompartemen', imageDescription: 'Produk terbuka dari atas memperlihatkan interior rapi berisi smartphone dan dompet' },
          { id: `${id}-in-3`, title: 'Akses Cepat', callout: featuresList[2] || 'Ada Saku Depan Cepat', imageDescription: 'Tangan memasukkan barang ke dalam kantong cepat dengan mudah' },
          { id: `${id}-in-4`, title: 'Finishing Kokoh', callout: featuresList[3] || 'Resleting Kuat & Halus', imageDescription: 'Macro shot close up detail aksen logam/resleting kokoh dan halus' },
        ] : undefined,
        visualDescription: bp.visualDesc,
        scenePromptTti,
        scenePromptTtv,
        cameraMovement: bp.cameraMovement,
      });
    }

    parts.push({
      partNumber: p,
      partTitle: numParts > 1 ? `Part ${p} (${durationPerPart}s)` : `Part 1: Full Ad (${duration}s)`,
      scenes,
    });
  }

  // Determine dynamic grid layout string
  const gridLayout = numPanels === 6
    ? '3x2 grid layout (6 panels total)'
    : numPanels === 3
    ? '1x3 layout (3 panels total)'
    : '2x2 grid layout (4 panels total)';

  // Construct dynamic master TTI prompt explicitly describing all numPanels scenes
  const scenesTtiDescriptions = parts[0]?.scenes.map((sc) => {
    if (sc.hasInsetCollage) {
      return `Scene ${sc.sceneNumber} Panel (${sc.phaseTitle} • ${sc.timeRange}): ${sc.visualDescription}. 4-photo inset detail showing material, hardware, and compartments. Specs below: [Shot: ${sc.shot} | Angle: ${sc.angle} | Timing: ${sc.timeRange} | VO: "${sc.vo}"].`;
    }
    const badgesText = sc.featureBadges && sc.featureBadges.length > 0
      ? ` Beside the model are 4 rounded vertical badge pills (${sc.featureBadges.join(', ')}).`
      : '';
    return `Scene ${sc.sceneNumber} Panel (${sc.phaseTitle} • ${sc.timeRange}): ${sc.visualDescription}.${badgesText} Handwritten aesthetic annotation with curved arrow: "${sc.calloutText}". Specs below: [Shot: ${sc.shot} | Angle: ${sc.angle} | Timing: ${sc.timeRange} | VO: "${sc.vo}"].`;
  }).join('\n\n');

  const masterTtiPrompt = `Professional agency commercial advertising storyboard presentation board for "${brandName} - ${productName}", styled in "${styleDisplayName}" visual theme (${styleItem.category}), structured in a crisp ${gridLayout} on a premium matte studio presentation board background.

Top Header Banner: Modern vector brand logo "${brandName}", glossy rounded pill badge "${productName}" with sub-tagline "${tagline}", and technical HUD spec card ("Duration: ${duration}s | Part: ${numParts} | Panels: ${numPanels} | Aspect Ratio: ${aspectRatio}").
Director Visual Treatment: ${styleItem.cameraStyle}. Lighting Atmosphere: ${styleItem.lightingStyle}.

${scenesTtiDescriptions}

Bottom Footer Ribbon: Audio: ${musicStyle} | VO Character: ${styleItem.voTone} | Target Audience: ${targetAudience} | Standard: 8K Commercial Advertising Art Direction. Hyper-detailed graphic presentation board, immaculate panel borders with subtle drop shadows, clean editorial typography, award-winning advertising layout --ar 2:3 --v 6.1 --style raw --q 2`;

  const masterTtvPrompt = `[Commercial Video Production Master Script - "${productName}" (${styleDisplayName}) - ${duration}s, ${aspectRatio}]
Director Technical Specifications:
• Camera Optics: ${styleItem.cameraStyle}
• Lighting Atmosphere: ${styleItem.lightingStyle}
• Voiceover Tone: ${styleItem.voTone}
• Frame Rate & Grading: 60fps UHD Photorealistic, 35mm Commercial Film Color Science

SEQUENCE BREAKDOWN:
${parts[0]?.scenes.map((sc) => `SCENE ${sc.sceneNumber} (${sc.timeRange} • ${sc.phaseTitle}):
[Camera: ${sc.cameraMovement}]
Framing & Angle: ${sc.shot}, ${sc.angle}
Action Choreography: ${sc.visualDescription}
Voiceover Dialogue: "${sc.vo}"
On-Screen Graphic / Text: "${sc.calloutText}"
Lighting & Atmosphere: ${styleItem.lightingStyle}`).join('\n\n')}`;

  const bgmSfx = styleItem.category === 'social_ugc' && (storyboardStyle === 'asmr_product' || storyboardStyle === 'asmr_detail')
    ? 'Audio: Binaural ASMR microphone setup, subtle whisper breathing, tactile micro-tapping on packaging, gentle unsealing sounds, zero intrusive background music.'
    : styleItem.category === 'cinematic'
    ? `Audio: Cinematic orchestral swell with ambient sub-bass risers and crisp foley effects on hero actions.`
    : `Audio: ${musicStyle}. SFX: Dynamic whooshes on scene transitions and chime on closing CTA.`;

  return {
    brandName,
    productName,
    tagline,
    durationTotal: duration,
    partsCount: numParts,
    scenesCount: numPanels,
    aspectRatio,
    musicRecommendation: musicStyle,
    overlayTextRule: 'Minimal (sesuai storyboard)',
    targetAudience,
    style: storyboardStyle,
    parts,
    masterTtiPrompt,
    masterTtiNegativePrompt: 'blurry, messy layout, pixelated text, low resolution, ugly face, distorted hands, extra limbs, watermark, amateur sketch, chaotic composition, illegible fonts, oversaturated colors, plastic skin, uncanny valley, watermark text, amateur photography',
    masterTtvPrompt,
    bgmSfxNotes: bgmSfx,
    productVisualSummary: `${productName}: ${productDescription || 'Produk unggulan berkualitas tinggi'}`,
    modelVisualSummary: modelPersonaPreset,
  };
}
