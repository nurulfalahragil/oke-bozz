import { GeneratorRequest, StoryboardData, StoryboardPart, StoryboardScene } from '../types';

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

function getStyleBlueprints(
  style: string,
  numPanels: number,
  panelDuration: number,
  productName: string,
  modelPersona: string,
  features: string[]
): SceneBlueprint[] {
  const f0 = features[0] || 'Bahan Premium';
  const f1 = features[1] || 'Banyak Kompartemen';
  const f2 = features[2] || 'Praktis & Fungsional';
  const f3 = features[3] || 'Desain Elegan';
  const isShortDuration = panelDuration <= 3.2; // e.g. 15s with 6 panels = 2.5s, 10s with 4 panels = 2.5s

  // 1. UNBOXING STYLE
  if (style === 'unboxing') {
    if (numPanels === 6) {
      return [
        {
          phaseTitle: 'Paket Tiba & Kemasan',
          shot: 'Medium shot (kamera meja studio)',
          angle: 'Top down 45 degree',
          voId: isShortDuration
            ? `Paketnya tiba! Penasaran banget isinya.`
            : `Paket ${productName.toLowerCase()} akhirnya tiba! Penasaran banget sama isinya.`,
          voEn: isShortDuration
            ? `Package is here! Can't wait.`
            : `The package for ${productName} finally arrived! Can't wait to open.`,
          callout: 'Unboxing time! Paket baru tiba 📦',
          visualDesc: `Kotak kemasan pengiriman premium ${productName} terletak di atas meja aesthetic, tangan menyambut paket dengan antusias.`,
          cameraMovement: 'Smooth push-in ke kotak paket dengan pencahayaan studio bersih',
        },
        {
          phaseTitle: 'Membuka Segel / Unsealing',
          shot: 'Close up hands (detail segel)',
          angle: 'Top angle',
          voId: isShortDuration
            ? `Packaging rapi dengan segel eksklusif.`
            : `Packaging rapi dan aman banget dengan segel eksklusif brand.`,
          voEn: isShortDuration
            ? `Sleek packaging with custom seal.`
            : `Super sleek packaging and secure with custom branded sealing.`,
          callout: 'Sensasi buka segel satisfying ✨',
          visualDesc: 'Tangan membuka pita atau segel stiker pada kotak kemasan secara halus, memberikan efek visual ASMR yang memuaskan.',
          cameraMovement: 'Macro close-up perlahan mengikuti gerakan jari membuka segel',
        },
        {
          phaseTitle: 'First Impression Reveal',
          shot: 'Medium close up (tutup box terbuka)',
          angle: 'Eye level / 45 degree',
          voId: isShortDuration
            ? `First look: warnanya mewah banget!`
            : `First look pas dibuka: warnanya mewah dan sesuai ekspektasi!`,
          voEn: isShortDuration
            ? `First look: stunning luxury finish!`
            : `First look inside: pristine finish and totally exceeds expectations!`,
          callout: 'Wah, desainnya mewah banget! 😍',
          visualDesc: `Kotak terbuka memperlihatkan ${productName} yang diletakkan rapi di dalam lapisan pelindung, model tersenyum kagum.`,
          cameraMovement: 'Slow pedestal up menampakkan produk di dalam box secara utuh',
        },
        {
          phaseTitle: 'Detail Inset & Material',
          shot: 'Close up + 4-photo insert detail',
          angle: 'Macro / Multi angle',
          voId: isShortDuration
            ? `Bahan ${f0.toLowerCase()} kompartemennya luas.`
            : `Lihat detailnya: ${f0.toLowerCase()} dan kompartemennya luas terorganisir.`,
          voEn: isShortDuration
            ? `Premium materials with spacious compartments.`
            : `Check out the details: premium finish and organized compartments.`,
          callout: 'Kualitas material juara!',
          visualDesc: `Kolase 4 frame macro memperlihatkan detail tekstur, resleting/hardware, bagian kompartemen dalam, dan finishing logo.`,
          cameraMovement: 'Macro multi-angle quick dolly across textures and stitching',
          hasInsetCollage: true,
        },
        {
          phaseTitle: 'Uji Coba Langsung (Hands-on)',
          shot: 'Medium full shot (mencoba produk)',
          angle: 'Eye level',
          voId: isShortDuration
            ? `Pas dicoba, super nyaman dipakai!`
            : `Pas langsung dicoba, kerasa banget kenyamanan dan build quality-nya.`,
          voEn: isShortDuration
            ? `Super comfortable in real use!`
            : `Trying it on, the comfort and practicality are instantly noticeable.`,
          callout: 'Dipakai langsung nyaman & pas! ♡',
          visualDesc: `Model ${modelPersona} langsung memakai atau menguji fungsi ${productName} dengan percaya diri dan gestur natural.`,
          cameraMovement: 'Medium tracking shot bergerak mengikuti gerakan model',
        },
        {
          phaseTitle: 'Review Kepuasan & CTA',
          shot: 'Medium close up (model memegang produk)',
          angle: 'Eye level',
          voId: isShortDuration
            ? `Beneran worth it! Yuk checkout.`
            : `Worth it banget! Yuk amankan promonya sekarang sebelum kehabisan.`,
          voEn: isShortDuration
            ? `Totally worth it! Order now.`
            : `Totally worth every penny! Grab the promo before it sells out.`,
          callout: 'Unboxing 10/10! Wajib punya ♡',
          visualDesc: `Model tersenyum puas di depan kamera memegang ${productName}, diiringi 4 badge checklist keunggulan produk.`,
          cameraMovement: 'Gentle push-in ke senyum ramah model dan produk di tangan',
          isLastCta: true,
        },
      ];
    } else if (numPanels === 3) {
      return [
        {
          phaseTitle: 'Packaging & Unboxing Hook',
          shot: 'Medium shot',
          angle: 'Top down 45 degree',
          voId: isShortDuration
            ? `Unboxing ${productName.toLowerCase()} yang lagi viral!`
            : `Akhirnya paket ${productName.toLowerCase()} yang lagi viral ini sampai juga!`,
          voEn: isShortDuration
            ? `Unboxing the viral ${productName}!`
            : `Finally the viral ${productName} package has arrived!`,
          callout: 'Unboxing time! 📦',
          visualDesc: `Membuka kemasan paket ${productName} di meja studio dengan pencahayaan hangat.`,
          cameraMovement: 'Dolly in ke box',
        },
        {
          phaseTitle: 'Detail Material & Isi',
          shot: 'Close up insert',
          angle: 'Top angle',
          voId: isShortDuration
            ? `Bahan ${f0.toLowerCase()} super rapi.`
            : `Bahan ${f0.toLowerCase()} dan kompartemennya bener-bener rapi.`,
          voEn: isShortDuration
            ? `Premium build and neat details.`
            : `Featuring high quality materials and precision compartments.`,
          callout: 'Bahan juara & super rapi!',
          visualDesc: `Detail close-up isi box dan kualitas material ${productName}.`,
          cameraMovement: 'Slow macro pan',
          hasInsetCollage: true,
        },
        {
          phaseTitle: 'Review & Closing CTA',
          shot: 'Medium close up',
          angle: 'Eye level',
          voId: isShortDuration
            ? `Puas banget! Yuk checkout sekarang.`
            : `Puas banget sama kualitasnya! Amankan diskon spesialnya sekarang.`,
          voEn: isShortDuration
            ? `Loved it! Claim discount now.`
            : `Super satisfied with quality! Claim your special discount today.`,
          callout: 'Yuk punya sekarang! ♡',
          visualDesc: `Model memegang ${productName} tersenyum mengajak audiens checkout.`,
          cameraMovement: 'Push-in focus on CTA',
          isLastCta: true,
        },
      ];
    } else {
      // 4 panels unboxing
      return [
        {
          phaseTitle: 'Paket Tiba & Kemasan',
          shot: 'Medium shot (kamera depan)',
          angle: '45 degree',
          voId: isShortDuration
            ? `Paket ${productName.toLowerCase()} akhirnya tiba!`
            : `Unboxing time! Paket ${productName.toLowerCase()} yang ditunggu akhirnya tiba.`,
          voEn: isShortDuration
            ? `The package has finally arrived!`
            : `Unboxing time! The long awaited package is finally here.`,
          callout: 'Paket baru tiba 📦',
          visualDesc: `Kemasan boks estetik ${productName} di meja unboxing.`,
          cameraMovement: 'Dolly in ke kemasan',
        },
        {
          phaseTitle: 'Unsealing & First Look',
          shot: 'Close up hands',
          angle: 'Top angle',
          voId: isShortDuration
            ? `First impression-nya mewah dan rapi.`
            : `Pas segel dibuka, first impression-nya mewah banget dan super rapi.`,
          voEn: isShortDuration
            ? `First impression is super sleek.`
            : `Opening the box, the first impression is remarkably luxurious.`,
          callout: 'Kesan pertama: 10/10! ✨',
          visualDesc: `Kotak dibuka menampakkan produk ${productName} dengan kemasan rapi.`,
          cameraMovement: 'Pedestal up reveal',
        },
        {
          phaseTitle: 'Detail Inset & Fitur',
          shot: 'Close up insert collage',
          angle: 'Top / Close Up',
          voId: isShortDuration
            ? `Ada ${f0.toLowerCase()} dan kompartemen luas.`
            : `Detailnya ada ${f0.toLowerCase()} dan kompartemen fungsional yang luas.`,
          voEn: isShortDuration
            ? `Crafted with ${f0.toLowerCase()} and compartments.`
            : `Details feature high grade materials and smooth hardware.`,
          callout: 'Detail bahan premium',
          visualDesc: `Kolase 4 foto detail produk dan kompartemen fungsional.`,
          cameraMovement: 'Macro scan across features',
          hasInsetCollage: true,
        },
        {
          phaseTitle: 'Review Kepuasan & CTA',
          shot: 'Medium close up',
          angle: 'Eye level',
          voId: isShortDuration
            ? `Worth it banget! Amankan promonya.`
            : `Benar-benar worth it! Yuk dapatkan promo eksklusif sekarang juga.`,
          voEn: isShortDuration
            ? `Totally worth it! Order now.`
            : `Totally worth every penny! Grab the exclusive promo now.`,
          callout: 'Yuk, punya sekarang! ♡',
          visualDesc: `Model tersenyum puas menunjukkan produk ke kamera dengan checklist badge.`,
          cameraMovement: 'Push-in zoom ke senyuman model',
          isLastCta: true,
        },
      ];
    }
  }

  // 2. BEFORE / AFTER STYLE
  if (style === 'before_after') {
    if (numPanels === 6) {
      return [
        {
          phaseTitle: 'Hook Masalah (Before)',
          shot: 'Medium close up',
          angle: 'Eye level',
          voId: isShortDuration ? `Sering kesel barang berantakan?` : `Sering ngalamin masalah barang berantakan atau cepat rusak?`,
          voEn: isShortDuration ? `Tired of messy belongings?` : `Always struggling with messy belongings or worn out items?`,
          callout: 'Capek sama masalah ini? 😣',
          visualDesc: 'Model memperlihatkan ekspresi bingung atau frustrasi dengan kondisi lama yang tidak praktis.',
          cameraMovement: 'Slight zoom-in on model expression',
        },
        {
          phaseTitle: 'Penjelasan Pain Point',
          shot: 'Close up detail masalah',
          angle: 'Eye level',
          voId: isShortDuration ? `Barang biasa cepat rusak.` : `Banyak produk di pasaran yang kelihatannya bagus tapi nggak awet.`,
          voEn: isShortDuration ? `Ordinary items wear out fast.` : `Many products look decent on the outside but fall apart quickly.`,
          callout: 'Gampang rusak & sempit',
          visualDesc: 'Visual memperlihatkan barang lama yang sesak dan tidak fungsional.',
          cameraMovement: 'Macro tilt down',
        },
        {
          phaseTitle: 'Pengenalan Solusi',
          shot: 'Medium shot reveal',
          angle: 'Low angle heroic',
          voId: isShortDuration ? `Untung ada ${productName.toLowerCase()}!` : `Sampai akhirnya ketemu solusinya: ${productName}!`,
          voEn: isShortDuration ? `Meet ${productName} solution!` : `Until I found the ultimate solution: ${productName}!`,
          callout: 'Ini dia solusinya! ✨',
          visualDesc: `Transisi dinamis menampakkan ${productName} dalam kilau cahaya elegan.`,
          cameraMovement: 'Dynamic whip pan reveal',
        },
        {
          phaseTitle: 'Detail Transformasi (Insert)',
          shot: 'Close up insert collage',
          angle: 'Top angle',
          voId: isShortDuration ? `Ada ${f0.toLowerCase()}, rapi seketika.` : `Dilengkapi ${f0.toLowerCase()}, semuanya jadi rapi dan terorganisir.`,
          voEn: isShortDuration ? `Built with ${f0.toLowerCase()} details.` : `Equipped with premium features, keeping everything neat.`,
          callout: 'Kapasitas & detail juara',
          visualDesc: 'Kolase 4 foto detail perbandingan kondisi sebelum vs sesudah pemakaian.',
          cameraMovement: 'Macro slider across compartments',
          hasInsetCollage: true,
        },
        {
          phaseTitle: 'Hasil Nyata (After)',
          shot: 'Medium full shot',
          angle: 'Eye level',
          voId: isShortDuration ? `Aktivitas jadi praktis & pede!` : `Sekarang mau aktivitas apa pun jadi jauh lebih praktis dan pede!`,
          voEn: isShortDuration ? `Everything is effortless now!` : `Now whatever the daily activity, everything feels effortless!`,
          callout: 'Perubahannya kerasa banget! 😍',
          visualDesc: 'Model tampil rapi, tersenyum percaya diri menggunakan produk dalam keseharian.',
          cameraMovement: 'Tracking shot mengikuti langkah ceria model',
        },
        {
          phaseTitle: 'Closing / CTA Transformasi',
          shot: 'Medium close up',
          angle: 'Eye level',
          voId: isShortDuration ? `Yuk checkout sebelum kehabisan!` : `Yuk rasakan perubahannya sekarang juga sebelum promonya berakhir!`,
          voEn: isShortDuration ? `Order now before promo ends!` : `Experience the transformation yourself before promo ends!`,
          callout: 'Checkout sekarang juga! ♡',
          visualDesc: 'Model memegang produk dengan bangga, diiringi 4 badge checklist transformasi.',
          cameraMovement: 'Push-in focus on CTA',
          isLastCta: true,
        },
      ];
    }
  }

  // 3. DEFAULT (LIFESTYLE & GENERAL)
  if (numPanels === 6) {
    return [
      {
        phaseTitle: 'Hook Perhatian',
        shot: 'Medium shot (kamera depan)',
        angle: 'Eye level',
        voId: isShortDuration
          ? `Lagi cari ${productName.toLowerCase()} yang praktis?`
          : `Lagi cari ${productName.toLowerCase()} yang praktis tapi tetap stylish?`,
        voEn: isShortDuration
          ? `Looking for practical ${productName.toLowerCase()}?`
          : `Looking for a ${productName.toLowerCase()} that is practical yet stylish?`,
        callout: `${productName.split(' ')[0]} pilihan terbaik!`,
        visualDesc: `Model ${modelPersona} tersenyum ramah memperlihatkan ${productName} di trotoar modern kota.`,
        cameraMovement: 'Smooth forward tracking shot at eye level',
      },
      {
        phaseTitle: 'First Look & Desain',
        shot: 'Medium close up',
        angle: 'Slight low angle',
        voId: isShortDuration
          ? `Desain elegan, pas buat outfitmu.`
          : `Desainnya elegan banget, cocok dipadukan dengan berbagai outfit harianmu.`,
        voEn: isShortDuration
          ? `Sleek design fits every outfit.`
          : `The design is sleek and versatile, matching any everyday outfit effortlessly.`,
        callout: 'Desain elegan & modern ✨',
        visualDesc: 'Model memamerkan siluet produk dengan outfit chic modern.',
        cameraMovement: 'Slow 45-degree orbit around model',
      },
      {
        phaseTitle: 'Detail Inset & Material',
        shot: 'Close up + 4-photo insert detail',
        angle: 'Top / Close Up',
        voId: isShortDuration
          ? `Bahan ${f0.toLowerCase()} dan kompartemen rapi.`
          : `Dibuat dari ${f0.toLowerCase()} dengan kompartemen luas dan tertata rapi.`,
        voEn: isShortDuration
          ? `Quality build and neat pockets.`
          : `Crafted from quality materials with spacious, well-organized pockets.`,
        callout: 'Bahan premium tahan lama',
        visualDesc: 'Kolase 4 foto detail macro: tekstur bahan, kompartemen dalam, saku cepat, dan resleting/hardware.',
        cameraMovement: 'Macro dolly across textures',
        hasInsetCollage: true,
      },
      {
        phaseTitle: 'Kenyamanan Penggunaan',
        shot: 'Close up hands & tactile feel',
        angle: 'Side angle',
        voId: isShortDuration
          ? `Ringan dan nyaman dibawa seharian.`
          : `Ringan saat dibawa, strap-nya empuk, dan akses barangnya super cepat.`,
        voEn: isShortDuration
          ? `Lightweight and comfortable all day.`
          : `Lightweight to carry, comfortable straps, and instant quick access.`,
        callout: 'Ringan & nyaman dipakai',
        visualDesc: 'Tangan dengan mudah membuka kompartemen dan mengambil perlengkapan.',
        cameraMovement: 'Tactile close up follow shot',
      },
      {
        phaseTitle: 'Lifestyle Sehari-hari',
        shot: 'Medium full shot (tracking)',
        angle: 'Slight low angle',
        voId: isShortDuration
          ? `Dipakai kemana pun selalu pede!`
          : `Mau dipakai ke kampus, kantor, atau hangout santai, selalu bikin percaya diri.`,
        voEn: isShortDuration
          ? `Stay confident wherever you go!`
          : `Whether for campus, work, or casual hangout, it always boosts your confidence.`,
        callout: 'Cocok untuk aktivitas sehari-hari ♡',
        visualDesc: 'Model berjalan santai dan percaya diri di area taman perkotaan hijau asri.',
        cameraMovement: 'Medium tracking shot mundur menjaga model di tengah frame',
      },
      {
        phaseTitle: 'Closing / CTA Penawaran',
        shot: 'Medium close up (model memegang produk)',
        angle: 'Eye level',
        voId: isShortDuration
          ? `Yuk miliki sekarang sebelum kehabisan!`
          : `Kalau kamu suka modelnya, cek produknya sekarang sebelum kehabisan diskonnya!`,
        voEn: isShortDuration
          ? `Grab yours before promo ends!`
          : `If you love the style, grab yours today before limited discounts run out!`,
        callout: 'Yuk, punya sekarang! ♡',
        visualDesc: 'Model tersenyum memegang produk ke depan dada, diiringi 4 badge checklist keunggulan.',
        cameraMovement: 'Slow push-in zoom ke senyuman model dan produk',
        isLastCta: true,
      },
    ];
  } else if (numPanels === 3) {
    return [
      {
        phaseTitle: 'Hook',
        shot: 'Medium close up',
        angle: 'Eye level',
        voId: isShortDuration ? `Tampil kece dengan ${productName.toLowerCase()}!` : `Ini dia rahasia tampil kece dengan ${productName.toLowerCase()}!`,
        voEn: isShortDuration ? `Look stylish with ${productName}!` : `Meet the ultimate ${productName} for everyday lifestyle!`,
        callout: 'Solusi terbaik untukmu!',
        visualDesc: `Model memperkenalkan ${productName} dengan ekspresi ceria.`,
        cameraMovement: 'Dolly in cepat',
      },
      {
        phaseTitle: 'Detail & Keunggulan',
        shot: 'Close up insert',
        angle: '45 degree',
        voId: isShortDuration ? `Bahan ${f0.toLowerCase()} super praktis.` : `Dengan ${f0.toLowerCase()}, bikin aktivitasmu makin praktis.`,
        voEn: isShortDuration ? `Engineered with ${f0.toLowerCase()}.` : `Engineered with high quality features for seamless convenience.`,
        callout: f0,
        visualDesc: `Insert shot detail tekstur dan kerapian ${productName}.`,
        cameraMovement: 'Smooth macro pan',
        hasInsetCollage: true,
      },
      {
        phaseTitle: 'Closing / CTA',
        shot: 'Medium shot',
        angle: 'Eye level',
        voId: isShortDuration ? `Klik keranjang sekarang juga!` : `Klik keranjang sekarang untuk dapatkan promo spesialnya!`,
        voEn: isShortDuration ? `Order now for promo!` : `Order now to claim exclusive limited discounts!`,
        callout: 'Order sekarang juga! ♡',
        visualDesc: `Model tersenyum menunjukkan produk ke kamera.`,
        cameraMovement: 'Push-in focus on CTA',
        isLastCta: true,
      },
    ];
  } else {
    // 4 panels standard (like reference)
    return [
      {
        phaseTitle: 'Hook',
        shot: 'Medium shot (kamera depan, sedikit tilt up)',
        angle: 'Eye level',
        voId: isShortDuration
          ? `Cari ${productName.toLowerCase()} muat banyak?`
          : `Cari ${productName.toLowerCase()} yang tetap muat banyak?`,
        voEn: isShortDuration
          ? `Looking for a compact ${productName}?`
          : `Looking for a ${productName.toLowerCase()} that is compact yet holds everything?`,
        callout: `${productName.split(' ')[0]} kecil tapi muat banyak!`,
        visualDesc: `Model ${modelPersona} tersenyum ramah memperlihatkan ${productName} di area outdoor modern.`,
        cameraMovement: 'Medium tracking shot maju perlahan mengikuti langkah model',
      },
      {
        phaseTitle: 'Detail & Kapasitas',
        shot: 'Close up + insert detail',
        angle: 'Top / Close Up',
        voId: isShortDuration
          ? `Bahan ${f0.toLowerCase()} dan resleting kuat.`
          : `Modelnya simpel, cantik, dan praktis. Ada ${f0.toLowerCase()} dan resleting kuat.`,
        voEn: isShortDuration
          ? `Quality build and durable hardware.`
          : `Sleek, practical design with quality materials and heavy-duty smooth zippers.`,
        callout: f0,
        visualDesc: `Koleksi 4 frame detail: bahan premium, kompartemen luas, saku cepat, dan resleting kokoh.`,
        cameraMovement: 'Macro dolly shot bergeser perlahan menyoroti detail tekstur',
        hasInsetCollage: true,
      },
      {
        phaseTitle: 'Lifestyle',
        shot: 'Medium full shot (tracking / follow)',
        angle: 'Slight low angle / eye level',
        voId: isShortDuration
          ? `Cocok banget buat aktivitas sehari-hari.`
          : `Cocok banget buat aktivitas sehari-hari. Mau ke kampus atau jalan-jalan, tetap stylish.`,
        voEn: isShortDuration
          ? `Perfect fit for daily lifestyle.`
          : `Perfect for everyday lifestyle. Campus, office, or hangouts, stay chic and confident.`,
        callout: 'Cocok untuk aktivitas sehari-hari ♡',
        visualDesc: `Model melangkah santai dan stylish di taman kota dengan ${productName} tersampir nyaman.`,
        cameraMovement: 'Medium full tracking shot mengikuti gerakan langkah model',
      },
      {
        phaseTitle: 'Closing / CTA',
        shot: 'Medium close up (model memegang produk)',
        angle: 'Eye level',
        voId: isShortDuration
          ? `Suka modelnya? Checkout sekarang!`
          : `Kalau kamu suka modelnya, cek produknya sekarang sebelum kehabisan!`,
        voEn: isShortDuration
          ? `Love the model? Order now!`
          : `If you love the model, check it out right now before stocks run out!`,
        callout: 'Yuk, punya sekarang! ♡',
        visualDesc: `Model memegang ${productName} di depan dada tersenyum meyakinkan ke kamera dengan 4 badge checklist.`,
        cameraMovement: 'Slow push-in zoom ke senyuman model dan produk utama',
        isLastCta: true,
      },
    ];
  }
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
    numPanels = 4,
    duration = 15,
    aspectRatio = '9:16',
    targetAudience = 'Wanita / Remaja – Dewasa',
    musicStyle = 'Elegant / Soft Viral TikTok',
    language = 'id',
    modelPersonaPreset = 'Model Profesional',
  } = request;

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

      const scenePromptTti = `Commercial advertising storyboard panel of ${productName} (${storyboardStyle} style). ${bp.visualDesc} Camera: ${bp.shot}, ${bp.angle}. Professional commercial photography, clean studio and natural daylight balance, 8k resolution, crisp texture detail --ar ${aspectRatio} --v 6.1`;
      const scenePromptTtv = `[Camera: ${bp.cameraMovement}] High production value advertising footage of ${productName} in ${storyboardStyle} theme. ${bp.visualDesc} Crisp colors, photorealistic motion, commercial grade grading, 60fps cinematic look.`;

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

  const styleDisplayName = storyboardStyle === 'unboxing'
    ? 'Unboxing & First Impression'
    : storyboardStyle === 'before_after'
    ? 'Before & After'
    : storyboardStyle === 'testimonial'
    ? 'UGC Testimonial Review'
    : storyboardStyle === 'problem_solution'
    ? 'Problem - Solution'
    : storyboardStyle === 'asmr_detail'
    ? 'ASMR & Luxury Detail'
    : 'Lifestyle Commercial';

  // Construct dynamic master TTI prompt explicitly describing all numPanels scenes
  const scenesTtiDescriptions = parts[0]?.scenes.map((sc) => {
    if (sc.hasInsetCollage) {
      return `Scene ${sc.sceneNumber} Panel (${sc.phaseTitle} ${sc.timeRange}): 4-photo collage insert grid showing: 1) ${sc.insetPhotos?.[0]?.callout || 'Bahan premium'}, 2) ${sc.insetPhotos?.[1]?.callout || 'Banyak kompartemen'}, 3) ${sc.insetPhotos?.[2]?.callout || 'Akses cepat'}, 4) ${sc.insetPhotos?.[3]?.callout || 'Resleting kuat'}. Specs below: Shot: ${sc.shot} | Angle: ${sc.angle} | Durasi: ${sc.timeRange} | VO: "${sc.vo}".`;
    }
    const badgesText = sc.featureBadges && sc.featureBadges.length > 0
      ? ` Beside the model are 4 rounded vertical badge pills (${sc.featureBadges.join(', ')}).`
      : '';
    return `Scene ${sc.sceneNumber} Panel (${sc.phaseTitle} ${sc.timeRange}): ${sc.visualDescription}.${badgesText} Handwritten white annotation with arrow: "${sc.calloutText}". Specs below: Shot: ${sc.shot} | Angle: ${sc.angle} | Durasi: ${sc.timeRange} | VO: "${sc.vo}".`;
  }).join('\n\n');

  const masterTtiPrompt = `Commercial ${storyboardStyle} advertising storyboard presentation sheet for "${brandName} - ${productName}", ${gridLayout} on clean white poster background. Top banner has brand logo "${brandName}", rounded pill banner "${productName}" with tagline "${tagline}", and top right technical box ("Durasi: ${duration} detik | Part: ${numParts} Part | Jumlah Scene: ${numPanels} Scene | Aspect Ratio: ${aspectRatio}").

${scenesTtiDescriptions}

Bottom bar across sheet has footer items: Musik: ${musicStyle} | Overlay Text: Minimal (sesuai storyboard) | Target: ${targetAudience}. Professional ${styleDisplayName} marketing art direction, hyper-detailed typography, clean rounded corner cards, 8k resolution, cinematic commercial lighting --ar 2:3 --v 6.1 --style raw`;

  const masterTtvPrompt = `[Commercial ${styleDisplayName} Video Sequence - ${duration}s, ${aspectRatio}]
${parts[0]?.scenes.map((sc) => `Scene ${sc.sceneNumber} (${sc.timeRange} - ${sc.phaseTitle}): [Camera: ${sc.cameraMovement}] ${sc.visualDescription}. Voiceover script: "${sc.vo}". Lighting: Crisp commercial lighting.`).join('\n')}`;

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
    masterTtiNegativePrompt: 'blurry, messy layout, pixelated text, low resolution, ugly face, distorted hands, extra limbs, watermark, amateur sketch, chaotic composition, illegible fonts, oversaturated colors',
    masterTtvPrompt,
    bgmSfxNotes: `BGM: ${musicStyle}. SFX: Transition whooshes between scenes, tactile sound effects (box opening/unsealing/zipper), and cheerful chime on closing CTA.`,
    productVisualSummary: `${productName}: ${productDescription || 'Produk unggulan berkualitas tinggi'}`,
    modelVisualSummary: modelPersonaPreset,
  };
}
