import { SimpleAdData, SimpleAdFormat } from '../types';

export interface SimpleAdRequestInput {
  productImage?: string;
  productName: string;
  brandName?: string;
  tagline?: string;
  keyFeature: string;
  pricePromo?: string;
  format: SimpleAdFormat;
  duration: number; // 15 or 30
  aspectRatio: '9:16' | '16:9' | '1:1';
  voTone: 'energetic' | 'casual_ugc' | 'hard_sell' | 'soft_luxury' | 'calm_asmr';
}

export const SIMPLE_AD_FORMATS: {
  id: SimpleAdFormat;
  name: string;
  description: string;
  icon: string;
  badge: string;
  gradient: string;
}[] = [
  {
    id: 'hook_viral',
    name: 'Hook Viral & Solusi Kilat',
    description: 'Hook 3 detik menghentikan scroll, perkenalkan solusi produk, dan ajakan checkout instan.',
    icon: '⚡',
    badge: 'Paling Laris',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'racun_tiktok',
    name: 'Racun TikTok / Review UGC',
    description: 'Gaya kreator jujur tanpa filter, unboxing cepat, coba langsung, dan rekomendasi tulus.',
    icon: '🛒',
    badge: 'Viral TikTok',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'flash_sale',
    name: 'Flash Sale / Promo Terbatas',
    description: 'Fokus pada potongan harga, bonus eksklusif, countdown urgensi, dan dorongan beli sekarang.',
    icon: '🏷️',
    badge: 'Hard Selling',
    gradient: 'from-red-500 to-amber-600',
  },
  {
    id: 'satisfying_hero',
    name: 'Oddly Satisfying & Visual Hero',
    description: 'Visual memanjakan mata, audio renyah, sapuan bersih/tekstur estetik yang bikin betah nonton.',
    icon: '🫧',
    badge: 'Bikin Candu',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'problem_solution',
    name: 'Problem → Solusi Relatable',
    description: 'Membuka rasa frustrasi harian audiens kemudian memberikan solusi tuntas lewat produk.',
    icon: '💡',
    badge: 'Relatable',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'top_3_reasons',
    name: 'Top 3 Alasan Wajib Punya',
    description: 'Menyajikan 3 poin keunggulan utama secara padat, cepat, dan meyakinkan tanpa basa-basi.',
    icon: '🏆',
    badge: 'Praktis & Jelas',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

export async function generateSimpleAd(input: SimpleAdRequestInput): Promise<SimpleAdData> {
  try {
    const res = await fetch('/api/generate-simple-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.scenes && data.scenes.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend Simple Ad API fallback to local generator:', err);
  }

  return generateLocalSimpleAd(input);
}

export function generateLocalSimpleAd(input: SimpleAdRequestInput): SimpleAdData {
  const {
    productName,
    brandName = 'PRODUK PILIHAN',
    tagline = 'Solusi Praktis Sehari-hari',
    keyFeature = 'Kualitas premium & praktis digunakan',
    pricePromo = 'Promo Diskon Spesial Hari Ini',
    format = 'hook_viral',
    duration = 15,
    aspectRatio = '9:16',
    voTone = 'energetic',
  } = input;

  const activeFormatInfo = SIMPLE_AD_FORMATS.find((f) => f.id === format) || SIMPLE_AD_FORMATS[0];
  const shortName = productName.trim().split(/\s+/).slice(0, 3).join(' ');

  let hookHeadline = '';
  let fullVoScript = '';
  let scenes: SimpleAdData['scenes'] = [];
  let ttiVisualPrompt = '';
  let ttvVideoPrompt = '';
  let captionCopy = '';
  let hashtags: string[] = [];

  const platformLabel = aspectRatio === '9:16' ? 'TikTok / Reels / Shorts (9:16)' : aspectRatio === '16:9' ? 'YouTube / TVC (16:9)' : 'Instagram Feed (1:1)';

  if (format === 'hook_viral') {
    hookHeadline = `Stop scroll! Ini rahasia praktis buat kamu yang mau ${keyFeature.toLowerCase()}`;
    scenes = [
      {
        timeRange: '0 - 3 Detik (Hook)',
        title: 'Pattern Interrupt Hook',
        visualAction: `Kreator memegang ${productName} tepat di depan kamera dengan gestur stop scroll, latar estetik dan pencahayaan terang.`,
        cameraDirection: '[Camera: Quick Snap Zoom in to product]',
        voScript: `Stop scroll! Kalian wajib tahu produk penyelamat ini.`,
        onScreenText: `STOP SCROLL! Rahasia Baru 🔥`,
      },
      {
        timeRange: '3 - 10 Detik (Solusi & Demo)',
        title: 'Pembuktian Fitur Utama',
        visualAction: `Demonstrasi cepat pemakaian ${productName}. Menunjukkan ${keyFeature} bekerja instan dengan hasil rapi memuaskan.`,
        cameraDirection: '[Camera: Smooth tracking shot following hands-on action]',
        voScript: `Ini ${shortName}! Didesain dengan ${keyFeature.toLowerCase()}, bikin semua jadi super praktis.`,
        onScreenText: `${keyFeature} ✨`,
      },
      {
        timeRange: '10 - 15 Detik (CTA)',
        title: 'Call to Action Mendesak',
        visualAction: `Model tersenyum puas menunjukkan produk ke kamera didampingi badge promo "${pricePromo}".`,
        cameraDirection: '[Camera: Slow push-in focus on CTA banner]',
        voScript: `Lagi ada promo spesial, checkout di keranjang kuning sekarang sebelum kehabisan!`,
        onScreenText: `Checkout di Keranjang Kuning 🛒`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `Commercial viral TikTok ad hero shot for "${shortName}". Indonesian young creator holding ${productName} smiling with confidence, vibrant lighting, modern clean aesthetic room background, bold typography overlay "STOP SCROLL! 🔥", high resolution 8k commercial photography, crisp texture detail --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Dynamic TikTok vertical video] Fast-paced 15-second commercial ad for ${productName}. Creator grabs viewer attention in first 3 seconds, seamlessly transitions into hands-on demonstration of ${keyFeature}, and concludes with enthusiastic smile pointing to cart. 60fps smooth kinetic motion.`;
    captionCopy = `Gak nyangka nemu yang sepraktis ini! 😭✨ Buat kalian yang cari solusi ${keyFeature.toLowerCase()}, ${productName} ini beneran wajib punya. Mumpung lagi ${pricePromo.toLowerCase()}, buruan cek keranjang kuning sebelum kehabisan ya! 🛒👇`;
    hashtags = ['#RacunTikTok', '#ProdukViral', '#SolusiPraktis', '#PromoSpesial', '#MustHaveItem', '#DiskonHariIni'];
  } else if (format === 'racun_tiktok') {
    hookHeadline = `Jujur, awalnya gak nyangka bakal sebagus ini!`;
    scenes = [
      {
        timeRange: '0 - 3 Detik (Hook)',
        title: 'UGC Honest Reaction Hook',
        visualAction: `Kreator dengan smartphone selfie angle tampak terkejut memegang paket ${productName}.`,
        cameraDirection: '[Camera: Handheld organic selfie framing with gentle micro-shake]',
        voScript: `Gais, sumpah ini racun TikTok paling worth it minggu ini!`,
        onScreenText: `Racun TikTok 10/10! 😭💖`,
      },
      {
        timeRange: '3 - 10 Detik (Review)',
        title: 'Hands-on Unboxing & Fitur',
        visualAction: `Close up tangan memperlihatkan tekstur asli dan keunggulan ${keyFeature} dari ${productName}.`,
        cameraDirection: '[Camera: Top-down POV angle close-up]',
        voScript: `Lihat deh detailnya, ${keyFeature.toLowerCase()} beneran rapi dan kokoh pol.`,
        onScreenText: `Kualitas Juara Banget ✨`,
      },
      {
        timeRange: '10 - 15 Detik (CTA)',
        title: 'Rekomendasi Tulus & Link',
        visualAction: `Kreator mengacungkan jempol dengan senyuman tulus menunjuk ke arah tombol beli.`,
        cameraDirection: '[Camera: Snap zoom into creator gesture]',
        voScript: `Gak nyesel sama sekali, langsung klik link di bawah ya!`,
        onScreenText: `Rating 100/10 ⭐ Cek Keranjang!`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `Authentic UGC TikTok review aesthetic shot for ${productName}. Indonesian aesthetic influencer holding product close to camera, selfie angle, ring light reflection in eyes, aesthetic cozy room, handwritten style sticker overlay "Rating 10/10 ⭐", photorealistic 8k --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Handheld organic UGC vlog style] 15s authentic creator review of ${productName}. Natural energetic expressions, quick snappy cut from unboxing to live testing of ${keyFeature}, enthusiastic recommendation. 60fps clean lighting.`;
    captionCopy = `Akhirnya nemu yang beneran bagus no tipu-tipu! 😍 Suka banget sama ${keyFeature.toLowerCase()}-nya. Rating pribadi 10/10! Link pembelian resmi ada di bio / keranjang kuning ya guys 🛍️✨`;
    hashtags = ['#UGCCreator', '#HonestReview', '#SpillProduk', '#ViralDiTikTok', '#RekomendasiProduk'];
  } else if (format === 'flash_sale') {
    hookHeadline = `FLASH SALE ALERT: Diskon Gila-gilaan Khusus Hari Ini!`;
    scenes = [
      {
        timeRange: '0 - 3 Detik (Hook)',
        title: 'Urgensi Diskon & Countdown',
        visualAction: `Grafis flash sale menyala merah/emas dengan animasi countdown timer di samping ${productName}.`,
        cameraDirection: '[Camera: Dynamic fast push-in with energetic zoom]',
        voScript: `Flash sale khusus hari ini! Diskon gila-gilaan buat kalian!`,
        onScreenText: `⚡ FLASH SALE HARI INI SAJA! ⚡`,
      },
      {
        timeRange: '3 - 10 Detik (Value)',
        title: 'Keunggulan Mewah Harga Murah',
        visualAction: `Produk ${productName} disorot 360 derajat menampilkan ${keyFeature} dengan badge diskon besar.`,
        cameraDirection: '[Camera: High speed orbital slider shot]',
        voScript: `Dapatkan ${shortName} dengan ${keyFeature.toLowerCase()} seharga promo termurah.`,
        onScreenText: `${pricePromo} 🏷️`,
      },
      {
        timeRange: '10 - 15 Detik (CTA)',
        title: 'Dorongan Checkout Sebelum Hangus',
        visualAction: `Tumpukan produk siap kirim dengan teks batas waktu voucher yang hampir habis.`,
        cameraDirection: '[Camera: Pedestal zoom into urgent buy banner]',
        voScript: `Stok terbatas! Klik klaim kupon sekarang sebelum harga normal kembali!`,
        onScreenText: `KLAIM VOUCHER SEKARANG! 🏃💨`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `High-energy e-commerce flash sale commercial poster for "${productName}". Floating product surrounded by red and gold discount badges, neon lightning streaks, 3D typography "FLASH SALE 50% OFF", commercial studio spotlight, ultra-detailed --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Fast kinetic motion graphics camera] 15s high-energy direct-response commercial for ${productName}. Neon countdown timer, explosive price reveals, crisp hero rotations showing ${keyFeature}, and urgent closing countdown graphic.`;
    captionCopy = `🚨 DISKON GEDE-GEDEAN HARI INI AJA! 🚨 Kapan lagi dapet ${productName} dengan fitur ${keyFeature.toLowerCase()} semurah ini! Stok promo tinggal dikit banget, langsung klaim vouchernya sekarang ya! 🏃💨`;
    hashtags = ['#FlashSale', '#DiskonGede', '#PromoHariIni', '#CuciGudang', '#BantingHarga', '#BelanjaHemat'];
  } else if (format === 'satisfying_hero') {
    hookHeadline = `Visual Satisfying yang Bikin Betah Nonton Sampai Habis 🫧`;
    scenes = [
      {
        timeRange: '0 - 3 Detik (Hook)',
        title: 'Visual ASMR & Tekstur',
        visualAction: `Extreme close up 100mm macro menyorot tekstur mulus dan kemasan eksklusif ${productName}.`,
        cameraDirection: '[Camera: Extreme slow macro glide with shallow focus]',
        voScript: `Dengerin sensasi memuaskannya...`,
        onScreenText: `Oddly Satisfying ✨`,
      },
      {
        timeRange: '3 - 10 Detik (Aksi)',
        title: 'Sapuan Bersih & Detail Estetik',
        visualAction: `Gerakan sapuan halus satu garis pada ${productName}, memperlihatkan ${keyFeature} bekerja secara memukau.`,
        cameraDirection: '[Camera: Smooth linear dolly tracking]',
        voScript: `Setiap sentuhan ${keyFeature.toLowerCase()} dirancang untuk kepuasan maksimal.`,
        onScreenText: `100% Kepuasan Visual 🫧`,
      },
      {
        timeRange: '10 - 15 Detik (CTA)',
        title: 'Hero Outro & Keindahan',
        visualAction: `${productName} berdiri megah dengan pantulan cahaya berkilau dan senyuman tenang karakter.`,
        cameraDirection: '[Camera: Gentle pull back revealing golden glow]',
        voScript: `Rasakan sensasinya sekarang. Miliki melalui link resmi.`,
        onScreenText: `Miliki Sensasinya Hari Ini ♡`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `Oddly satisfying luxury aesthetic commercial photo of ${productName}. Soft diffuse daylight, pristine water droplets or smooth texture reflection, pastel minimalist studio podium, clean serene atmosphere, 8k hyper-realism --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Ultra smooth motorized slider 100fps slow-motion] 15s satisfying visual video of ${productName}. Mesmerizing smooth glide across ${keyFeature}, soft light flares, crisp ASMR audio pacing, aesthetic minimal environment.`;
    captionCopy = `Paling suka sama sensasi satisfying dari ${productName} ini! ✨ Bukan cuma estetik, tapi ${keyFeature.toLowerCase()}-nya beneran juara. Yuk rasakan sendiri perubahannya, order sekarang ya! 🫧🤍`;
    hashtags = ['#OddlySatisfying', '#ASMRVideo', '#AestheticProduct', '#SatisfyingReels', '#DailyLuxury'];
  } else if (format === 'problem_solution') {
    hookHeadline = `Sering kesel sama masalah ini? Ini dia solusinya!`;
    scenes = [
      {
        timeRange: '0 - 4 Detik (Problem)',
        title: 'Keluhan Harian yang Relatable',
        visualAction: `Model memperlihatkan rasa kesal atau repot saat menghadapi masalah harian tanpa produk.`,
        cameraDirection: '[Camera: Medium tracking shot at eye level]',
        voScript: `Pernah ngerasa repot dan ribet pas beraktivitas sehari-hari?`,
        onScreenText: `Capek sama masalah ini? ❌`,
      },
      {
        timeRange: '4 - 11 Detik (Solution)',
        title: 'Reveal Solusi Cerdas',
        visualAction: `Produk ${productName} diperkenalkan dengan mudah. Fitur ${keyFeature} menyelesaikan masalah dalam hitungan detik.`,
        cameraDirection: '[Camera: Whip pan transition into bright solution lighting]',
        voScript: `Tenang! Sekarang ada ${shortName}. Dengan ${keyFeature.toLowerCase()}, semua masalah langsung beres!`,
        onScreenText: `Solusi Tuntas Instan! ✅`,
      },
      {
        timeRange: '11 - 15 Detik (CTA)',
        title: 'Kepuasan & Ajakan Beli',
        visualAction: `Model tersenyum lega beraktivitas santai dengan ${productName}, diiringi tombol promo.`,
        cameraDirection: '[Camera: Push in to confident happy expression]',
        voScript: `Gak perlu pusing lagi, yuk order sekarang mumpung lagi diskon!`,
        onScreenText: `Order Sekarang & Bebas Ribet! 🛒`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `Commercial problem-solution before and after storytelling board for ${productName}. Left side shows relatable struggle, right side shows joyful smiling Indonesian user enjoying ${productName} with glowing solution light, crisp clean layout --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Dynamic before-and-after storytelling] 15s problem-solution video ad for ${productName}. Relatable frustration in first 4s, bright uplifting transition as ${keyFeature} provides instant ease, ending with smiling user recommendation.`;
    captionCopy = `Solusi buat yang gak mau ribet lagi! 😍 Sejak pakai ${productName}, aktivitas jadi jauh lebih praktis berkat ${keyFeature.toLowerCase()}-nya. Yuk jangan ditunda, checkout sekarang mumpung masih promo! 🛒✨`;
    hashtags = ['#SolusiPraktis', '#LifeHacks', '#BebasRibet', '#ProdukInovatif', '#RekomendasiHemat'];
  } else {
    // top_3_reasons
    hookHeadline = `3 Alasan Kenapa Kamu Wajib Punya Produk Ini Sekarang!`;
    scenes = [
      {
        timeRange: '0 - 3 Detik (Hook)',
        title: '3 Alasan Utama',
        visualAction: `Kreator mengangkat 3 jari dengan gestur menarik, ${productName} melayang di sampingnya.`,
        cameraDirection: '[Camera: Fast push-in with kinetic text]',
        voScript: `3 Alasan kenapa kamu wajib punya ${shortName} sekarang!`,
        onScreenText: `3 ALASAN WAJIB PUNYA! 3️⃣`,
      },
      {
        timeRange: '3 - 10 Detik (3 Poin)',
        title: 'Poin 1, 2 & 3 Cepat',
        visualAction: `Grafis 3 badge muncul bergantian: 1) ${keyFeature}, 2) Desain Awet & Elegan, 3) Harga Terjangkau.`,
        cameraDirection: '[Camera: Quick pan and split screen showcasing 3 features]',
        voScript: `Pertama, ${keyFeature.toLowerCase()}. Kedua, awet tahan lama. Ketiga, harganya ramah kantong!`,
        onScreenText: `1. Praktis | 2. Awet | 3. Hemat ✨`,
      },
      {
        timeRange: '10 - 15 Detik (CTA)',
        title: 'Penutup 10/10 & Ajakan',
        visualAction: `Model tersenyum puas memperlihatkan produk ke kamera didampingi checklist 3 poin.`,
        cameraDirection: '[Camera: Push in zoom into CTA]',
        voScript: `Tunggu apa lagi? Cek produknya sekarang sebelum kehabisan!`,
        onScreenText: `Dapatkan Diskon Hari Ini! 🛒`,
      },
    ];
    fullVoScript = scenes.map((s) => s.voScript).join(' ');
    ttiVisualPrompt = `High conversion commercial ad poster for "${productName}". Clean modern studio background, three stylish numbered badge callouts (1, 2, 3) highlighting features, crisp Indonesian commercial art direction, 8k photorealistic --ar ${aspectRatio} --v 6.1`;
    ttvVideoPrompt = `[Camera: Kinetic numbered motion sequence] 15s fast-paced video ad for ${productName}. Dynamic 1-2-3 numbered badges popping on screen, snappy product rotation highlighting ${keyFeature}, enthusiastic call to action.`;
    captionCopy = `Ini dia 3 alasan kenapa ${productName} jadi favorit banyak orang! 🏆 1. ${keyFeature}, 2. Kualitas awet, 3. Harga promo terjangkau! Jangan sampai ketinggalan promonya, klik link sekarang ya! 🛒✨`;
    hashtags = ['#Top3Alasan', '#ReviewJujur', '#ProdukFavorit', '#PilihanCerdas', '#PromoViral'];
  }

  return {
    productName,
    brandName,
    format,
    formatName: activeFormatInfo.name,
    duration,
    platform: platformLabel,
    hookHeadline,
    fullVoScript,
    scenes,
    ttiVisualPrompt,
    ttvVideoPrompt,
    captionCopy,
    hashtags,
  };
}
