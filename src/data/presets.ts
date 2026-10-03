import { GeneratorRequest, StoryboardData } from '../types';

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  thumbnail: string;
  request: GeneratorRequest;
  initialStoryboard: StoryboardData;
}

export const PRESET_OVAL_BAG: PresetItem = {
  id: 'oval-bag-reference',
  name: 'Tas Selempang Wanita (Sesuai Contoh Referensi)',
  category: 'Fashion & Aksesoris',
  tagline: 'Simpel • Cantik • Praktis',
  thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
  request: {
    productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    modelImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    modelPersonaPreset: 'Wanita Berhijab Casual / Modern Muslimah',
    brandName: 'OVAL STORYBOARD IKLAN',
    productName: 'Tas Selempang Wanita',
    tagline: 'Simpel • Cantik • Praktis',
    productDescription: 'Tas selempang wanita kulit sintetis premium warna cokelat tan dengan double gold zipper, strap selempang nyaman, multi kompartemen untuk HP, dompet, dan makeup.',
    productFeatures: [
      'Bahan premium dan tahan lama',
      'Banyak kompartemen terorganisir',
      'Ada saku depan untuk barang cepat',
      'Resleting kuat, halus, dan elegan'
    ],
    storyboardStyle: 'lifestyle',
    numParts: 1,
    numPanels: 4,
    duration: 15,
    aspectRatio: '9:16',
    targetAudience: 'Wanita / Muslimah / Remaja – Dewasa',
    musicStyle: 'Elegant / Soft Viral TikTok',
    language: 'id',
    targetTtiEngine: 'flow',
    targetTtvEngine: 'kling',
  },
  initialStoryboard: {
    brandName: 'OVAL STORYBOARD IKLAN',
    productName: 'Tas Selempang Wanita',
    tagline: 'Simpel • Cantik • Praktis',
    durationTotal: 15,
    partsCount: 1,
    scenesCount: 4,
    aspectRatio: '9:16',
    musicRecommendation: 'Elegant / Soft Viral TikTok',
    overlayTextRule: 'Minimal (sesuai storyboard)',
    targetAudience: 'Wanita / Muslimah / Remaja – Dewasa',
    style: 'lifestyle',
    productVisualSummary: 'Tas selempang wanita bahan kulit faux tan/camel bertekstur kerikil halus (pebble grain leather), hardware resleting ganda berwarna gold mengkilap, tali bahu tipis senada, ukuran compact 22x14 cm.',
    modelVisualSummary: 'Model wanita Indonesia muda berhijab krem elegan, atasan sage green lembut dengan lengan puff ringan, riasan natural glowing, senyum ramah ceria.',
    masterTtiPrompt: `Commercial advertising storyboard presentation sheet for "OVAL - Tas Selempang Wanita", 2x2 grid panel layout on clean white poster background. Top banner has navy blue brand logo "OVAL STORYBOARD IKLAN", light blue pill banner "Tas Selempang Wanita" with subtext "Simpel • Cantik • Praktis", and top right technical box ("Durasi: 15 detik | Part: 1 Part | Jumlah Scene: 4 Scene | Aspect Ratio: 9:16"). 

Scene 1 Panel (Hook 0-3s): Indonesian young woman with cream hijab in sage green blouse wearing brown tan crossbody bag outdoors on modern pavement, smiling at camera. Handwritten white annotation with curved arrow pointing to bag: "Tas kecil tapi muat banyak!". Below image has specs table: Shot: Medium shot (kamera depan, sedikit tilt up) | Angle: Eye level | Durasi: 0 - 3 detik | VO: "Cari tas kecil yang tetap muat banyak?".

Scene 2 Panel (Detail & Kapasitas 3-7s): 4-photo collage insert grid showing: 1) angled shot of bag with text "Bahan premium dan tahan lama", 2) unzipped bag interior loaded with smartphone and cosmetics with text "Banyak kompartemen", 3) female hand slipping smartphone into front slip pocket with text "Ada saku depan untuk barang cepat", 4) macro close-up of dual gold zippers with text "Resleting kuat dan halus". Specs below: Shot: Close up + insert detail | Angle: Top / Close Up | Durasi: 3 - 7 detik | VO: "Modelnya simpel, cantik, dan praktis. Ada banyak kompartemen, bahan premium, resletingnya kuat.".

Scene 3 Panel (Lifestyle 7-11s): Model walking outdoors in sunny pedestrian park with trees, bag comfortably slung, cute handwritten text: "Cocok untuk aktivitas sehari-hari ♡". Specs below: Shot: Medium full shot (tracking / follow) | Angle: Slight low angle / eye level | Durasi: 7 - 11 detik | VO: "Cocok banget buat aktivitas sehari-hari. Mau ke kampus, kantor, atau jalan-jalan, tetap stylish dan nyaman dipakai.".

Scene 4 Panel (Closing / CTA 11-15s): Model holding the tan bag with both hands at chest level, warm engaging smile. Left side features 4 rounded vertical badge pills: "Desain Elegan", "Ringan dan Nyaman", "Banyak Kompartemen", "Cocok untuk Semua Aktivitas". Handwritten text: "Yuk, punya sekarang! ♡". Specs below: Shot: Medium close up (model memegang tas) | Angle: Eye level | Durasi: 11 - 15 detik | VO: "Kalau kamu suka modelnya, cek produknya sekarang. Jangan sampai kehabisan!".

Bottom bar across sheet has footer items: Musik: Elegant / Soft Viral TikTok | Overlay Text: Minimal (sesuai storyboard) | Target: Wanita / Muslimah / Remaja – Dewasa. Professional marketing art direction, hyper-detailed typography, clean rounded corner cards, 8k resolution, cinematic commercial lighting --ar 2:3 --v 6.1 --style raw`,
    masterTtiNegativePrompt: `blurry, messy layout, pixelated text, low resolution, ugly face, distorted hands, extra limbs, watermark, amateur sketch, chaotic composition, illegible fonts, oversaturated colors`,
    masterTtvPrompt: `[Format: Commercial Ad 15s 9:16 Vertical Video]
Scene 1 (00:00 - 00:03): [Camera: Medium shot, smooth frontal tracking at eye level] Beautiful young woman with cream hijab in sage green blouse walking on modern clean urban pathway, wearing tan leather crossbody bag. She smiles charismatically at the camera while gently touching the bag strap. Natural diffused golden hour daylight, shallow depth of field. 
Scene 2 (00:03 - 00:07): [Camera: Macro dynamic cut sequence, slow dolly over bag] Rapid crisp macro shots of the tan pebble leather texture, fingers smoothly sliding the polished gold metal zipper open, revealing organized compartments with phone, lip gloss, and wallet. Close-up finger inserting phone into the front zipper pocket. Smooth tactile satisfying motion.
Scene 3 (00:07 - 00:11): [Camera: Low angle slight tracking follow shot, 60fps slow motion] Model strolling through a lush sunlit park alleyway with modern cafes in blurred background. Crossbody bag sits comfortably on her hip without bouncing. Effortless chic and stylish stride.
Scene 4 (00:11 - 00:15): [Camera: Push-in to medium close-up, eye level] Model stops, holds the bag forward with two hands at chest height, smiling directly into camera lens with an inviting cheerful look. Soft commercial studio rim lighting, clean modern lifestyle backdrop. Fade to call-to-action button.`,
    bgmSfxNotes: 'BGM: Soft acoustic pop with gentle modern lo-fi beat. SFX: Subtle crisp zipper glide at 00:04, tactile leather pat at 00:06, soft upbeat chime at 00:14 CTA.',
    parts: [
      {
        partNumber: 1,
        partTitle: 'Part 1: Full 15s Commercial Ad',
        scenes: [
          {
            id: 'scene-1',
            sceneNumber: 1,
            phaseTitle: 'Hook',
            timeRange: '0 – 3 detik',
            shot: 'Medium shot (kamera depan, sedikit tilt up)',
            angle: 'Eye level',
            duration: '0 – 3 detik',
            vo: 'Cari tas kecil yang tetap muat banyak?',
            subtitle: 'Cari tas kecil yang tetap muat banyak?',
            calloutText: 'Tas kecil tapi muat banyak!',
            calloutArrowDirection: 'down',
            visualDescription: 'Model wanita berhijab berjalan di trotoar modern kota mengenakan tas selempang cokelat tan di pinggangnya, tersenyum ramah menghadap kamera.',
            cameraMovement: 'Kamera depan eye level, sedikit tilt up, smooth tracking mengikuti langkah model',
            scenePromptTti: 'Medium shot of young Indonesian woman wearing elegant cream hijab and soft sage green blouse, carrying a tan brown leather crossbody bag over her shoulder. City sidewalk blurred background, bright morning lighting. Realistic commercial advertising shot, clean aesthetic, high-end catalog quality --ar 9:16 --v 6.1',
            scenePromptTtv: '[Camera: Medium shot, frontal smooth dolly at eye level] Young Indonesian woman with hijab walks smoothly towards camera wearing a tan leather crossbody bag. She smiles brightly and gestures subtly to the bag. 4k resolution, cinematic lighting, 60fps, photorealistic.'
          },
          {
            id: 'scene-2',
            sceneNumber: 2,
            phaseTitle: 'Detail & Kapasitas',
            timeRange: '3 – 7 detik',
            shot: 'Close up + insert detail',
            angle: 'Top / Close Up',
            duration: '3 – 7 detik',
            vo: 'Modelnya simpel, cantik, dan praktis. Ada banyak kompartemen, bahan premium, resletingnya kuat.',
            subtitle: 'Modelnya simpel, cantik, dan praktis. Ada banyak kompartemen, bahan premium, resletingnya kuat.',
            hasInsetCollage: true,
            insetPhotos: [
              {
                id: 'inset-1',
                title: 'Bahan Premium',
                callout: 'Bahan premium dan tahan lama',
                imageDescription: 'Tampak depan tas selempang kulit cokelat tan menonjolkan tekstur pebble grain halus dan jahitan rapi.'
              },
              {
                id: 'inset-2',
                title: 'Kompartemen Luas',
                callout: 'Banyak kompartemen',
                imageDescription: 'Tas dibuka dari atas memperlihatkan interior rapi berisi smartphone, dompet lipat, lipstik, dan kunci.'
              },
              {
                id: 'inset-3',
                title: 'Saku Depan Cepat',
                callout: 'Ada saku depan untuk barang cepat',
                imageDescription: 'Tangan wanita memasukkan smartphone ke dalam kantong beresleting depan tas dengan mudah.'
              },
              {
                id: 'inset-4',
                title: 'Resleting Emas Kokoh',
                callout: 'Resleting kuat dan halus',
                imageDescription: 'Macro shot close up detail slider resleting ganda warna gold metalik berkilau dan tarikan kulit.'
              }
            ],
            visualDescription: 'Koleksi 4 frame detail: bahan kulit premium, kompartemen dalam berisi barang esensial, saku depan cepat, dan macro resleting emas kokoh.',
            cameraMovement: 'Macro top-down angle, dynamic quick-cut inserts with smooth slider motion across textures',
            scenePromptTti: 'Commercial product photography 4-panel insert grid: 1) macro texture of tan brown pebble leather, 2) open bag showing organized smartphone, cards, lipstick inside, 3) female manicured hand slipping phone into front pocket, 4) extreme macro of luxury gold metallic dual zipper. Studio softbox lighting, ultra sharp --ar 9:16 --v 6.1',
            scenePromptTtv: '[Camera: Macro lens, slow cinematic dolly across product] Fingers smoothly pull open polished gold zipper of tan leather bag, revealing interior compartments filled with essentials. Close up on hands placing smartphone inside front pocket. Tactile and crisp motion, 8k commercial quality.'
          },
          {
            id: 'scene-3',
            sceneNumber: 3,
            phaseTitle: 'Lifestyle',
            timeRange: '7 – 11 detik',
            shot: 'Medium full shot (tracking / follow)',
            angle: 'Slight low angle / eye level',
            duration: '7 – 11 detik',
            vo: 'Cocok banget buat aktivitas sehari-hari. Mau ke kampus, kantor, atau jalan-jalan, tetap stylish dan nyaman dipakai.',
            subtitle: 'Cocok banget buat aktivitas sehari-hari. Mau ke kampus, kantor, atau jalan-jalan, tetap stylish dan nyaman dipakai.',
            calloutText: 'Cocok untuk aktivitas sehari-hari ♡',
            calloutArrowDirection: 'left',
            visualDescription: 'Model melangkah santai dan percaya diri di area taman perkotaan bernuansa hijau asri, tas selempang tampak harmonis dengan outfit modernnya.',
            cameraMovement: 'Medium full tracking shot, slight low angle, kamera bergerak halus menyamping/mundur menjaga model di tengah frame',
            scenePromptTti: 'Medium full shot of Indonesian woman in modern modest hijab fashion walking through a sunlit tree-lined urban park, wearing a tan crossbody leather bag on her hip. Joyful relaxed lifestyle, soft green foliage bokeh, high-fashion street photography --ar 9:16 --v 6.1',
            scenePromptTtv: '[Camera: Medium full tracking shot, backward dolly at eye-level] Woman walks naturally outdoors surrounded by lush greenery, crossbody bag swinging gently at her hip. Warm sun flare, realistic walking cadence, high production aesthetic, 60fps.'
          },
          {
            id: 'scene-4',
            sceneNumber: 4,
            phaseTitle: 'Closing / CTA',
            timeRange: '11 – 15 detik',
            shot: 'Medium close up (model memegang tas)',
            angle: 'Eye level',
            duration: '11 – 15 detik',
            vo: 'Kalau kamu suka modelnya, cek produknya sekarang. Jangan sampai kehabisan!',
            subtitle: 'Kalau kamu suka modelnya, cek produknya sekarang. Jangan sampai kehabisan!',
            calloutText: 'Yuk, punya sekarang! ♡',
            calloutArrowDirection: 'down',
            featureBadges: [
              'Desain Elegan',
              'Ringan dan Nyaman',
              'Banyak Kompartemen',
              'Cocok untuk Semua Aktivitas'
            ],
            visualDescription: 'Model memegang tas dengan kedua tangan di depan dada, tersenyum hangat langsung menatap mata penonton dengan ramah, diiringi badge keunggulan dan ajakan beli.',
            cameraMovement: 'Medium close up, gentle slow push-in zoom towards the model’s friendly gaze and the product',
            scenePromptTti: 'Medium close up commercial portrait of smiling Indonesian hijab model holding a tan leather crossbody bag forward at chest height. Beside her are 4 modern minimalist icon badges. Welcoming enthusiastic expression, bright clean commercial lighting, 8k portrait photography --ar 9:16 --v 6.1',
            scenePromptTtv: '[Camera: Slow subtle push-in zoom to medium close-up] Model smiling cheerfully holds up the tan leather bag towards the viewer, nodding enticingly as if saying check this out. Crisp soft rim lighting, joyful energetic closing shot for TikTok ad.'
          }
        ]
      }
    ]
  }
};

export const PRESETS_LIST: PresetItem[] = [
  PRESET_OVAL_BAG,
  {
    id: 'skincare-serum',
    name: 'Skincare Glowing Serum (Before & After Style)',
    category: 'Kecantikan & Skincare',
    tagline: 'Cerahkan Wajah dalam 7 Hari',
    thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    request: {
      productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      modelPersonaPreset: 'Wanita Muda Glowing / Dewy Skin',
      brandName: 'GLOW LAB STORYBOARD',
      productName: 'Aura Glow Radiant Serum',
      tagline: 'Wajah Kusam Jadi Glowing Cerah',
      productDescription: 'Serum pencerah dengan 10% Niacinamide murni dan Triple Hyaluronic Acid, tekstur watery cepat meresap tanpa lengket, memudarkan noda hitam dan melembabkan kulit.',
      productFeatures: [
        '10% Niacinamide & Triple HA',
        'Tekstur ringan & cepat meresap',
        'Efek glowing seketika tanpa kilap minyak',
        'Teruji dermatologis & BPOM aman'
      ],
      storyboardStyle: 'before_after',
      numParts: 1,
      numPanels: 4,
      duration: 15,
      aspectRatio: '9:16',
      targetAudience: 'Wanita & Pria 18-35 tahun bermasalah wajah kusam & bekas jerawat',
      musicStyle: 'Chill Lo-Fi Aesthetic / Fresh Beats',
      language: 'id',
      targetTtiEngine: 'flow',
      targetTtvEngine: 'kling',
    },
    initialStoryboard: {
      brandName: 'GLOW LAB STORYBOARD',
      productName: 'Aura Glow Radiant Serum',
      tagline: 'Wajah Kusam Jadi Glowing Cerah',
      durationTotal: 15,
      partsCount: 1,
      scenesCount: 4,
      aspectRatio: '9:16',
      musicRecommendation: 'Fresh Chill Lo-Fi / Water Droplet Beats',
      overlayTextRule: 'Clean minimal sans-serif with glow effect',
      targetAudience: 'Wanita & Pria 18-35 tahun',
      style: 'before_after',
      productVisualSummary: 'Botol dropper kaca transparan dengan cairan serum bening kental berglitter keemasan lembut, pipet putih dengan cincin perak minimalis.',
      modelVisualSummary: 'Wanita muda Asia dengan kulit wajah bersih, natural dewy glow, rambut dikuncir rapi ke belakang memperlihatkan pipi bercahaya sehat.',
      masterTtiPrompt: `Commercial advertising storyboard presentation sheet for "GLOW LAB - Aura Glow Radiant Serum", 2x2 grid layout on clean white poster background. Top banner has minimalist skincare brand logo "GLOW LAB STORYBOARD", soft rose-gold pill banner "Aura Glow Radiant Serum" with subtext "Wajah Kusam Jadi Glowing Cerah", and specs box ("Durasi: 15 detik | Part: 1 Part | Jumlah Scene: 4 Scene | Aspect Ratio: 9:16"). Scene 1: Hook split screen showing tired dull skin vs fresh look with callout "Capek wajah kusam & noda hitam?". Scene 2: Macro shot of amber glass dropper releasing a pristine glowing dew droplet with callout "10% Niacinamide Murni!". Scene 3: Model applying serum onto cheek with gentle tap, instant glass skin dewy reflection with callout "Cepat meresap & langsung glowing ♡". Scene 4: Model smiling with radiant glass skin holding bottle, 4 badges ("Bahan Alami", "Ringan & Tidak Lengket", "BPOM Approved", "Hasil 7 Hari") with CTA callout "Coba sekarang diskon 40%! ♡". Below each panel: Shot, Angle, Durasi, VO, Subtitle. High key skincare aesthetic, pristine 8k render --ar 2:3 --v 6.1`,
      masterTtiNegativePrompt: `blurry, bad lighting, rough skin, acne scars, cluttered, muddy colors, deformed hands, amateur graphics`,
      masterTtvPrompt: `[Format: Skincare Ad 15s 9:16 Vertical Video]
Scene 1 (00:00 - 00:03): [Camera: Close-up macro to eye level] Girl touches cheek in front of mirror with concerned expression, then transition into smiling look. VO: "Masih bingung cara hilangin bekas jerawat dan kulit kusam?".
Scene 2 (00:03 - 00:07): [Camera: Extreme macro slow-motion 120fps] Glass dropper lifts, a crystal clear golden radiant serum droplet falls in super slow motion onto a smooth cosmetic surface. VO: "Kenalin Aura Glow Serum dengan 10% Niacinamide murni!".
Scene 3 (00:07 - 00:11): [Camera: Close-up side profile tracking] Model gently glides fingertips over cheekbone, serum transforms into dewy glass skin glow under soft ring light. VO: "Teksturnya super ringan, cepat meresap dan langsung bikin glowing sehat.".
Scene 4 (00:11 - 00:15): [Camera: Medium portrait shot push-in] Model smiles radiantly into camera holding the serum bottle next to her glowing cheek. VO: "Cek keranjang kuning sekarang mumpung lagi diskon launching!".`,
      bgmSfxNotes: 'BGM: Soft refreshing spa lo-fi. SFX: Crisp water droplet chime at 00:04, soft brush whoosh at 00:08.',
      parts: [
        {
          partNumber: 1,
          partTitle: 'Part 1: 15s Skincare Ad',
          scenes: [
            {
              id: 'glow-1',
              sceneNumber: 1,
              phaseTitle: 'Hook',
              timeRange: '0 – 3 detik',
              shot: 'Close up (kamera depan cermin)',
              angle: 'Eye level',
              duration: '0 – 3 detik',
              vo: 'Masih insecure sama wajah kusam dan noda membandel?',
              subtitle: 'Masih insecure sama wajah kusam dan noda membandel?',
              calloutText: 'Capek wajah kusam & noda hitam?',
              calloutArrowDirection: 'right',
              visualDescription: 'Model melihat ke cermin menyentuh pipinya, ekspresi hook penasaran.',
              cameraMovement: 'Close up push-in to model’s face',
              scenePromptTti: 'Close up beauty portrait of young Asian woman touching cheek, soft morning light --ar 9:16 --v 6.1',
              scenePromptTtv: '[Camera: Close-up push in] Woman looking in mirror touches face gently, 4k 60fps'
            },
            {
              id: 'glow-2',
              sceneNumber: 2,
              phaseTitle: 'Formula & Detail',
              timeRange: '3 – 7 detik',
              shot: 'Macro insert shot (pipet & tekstur cairan)',
              angle: 'Top / 45 degree',
              duration: '3 – 7 detik',
              vo: 'Kenalin Aura Glow Serum! 10% Niacinamide murni yang bekerja mencerahkan lebih cepat.',
              subtitle: 'Kenalin Aura Glow Serum! 10% Niacinamide murni yang bekerja mencerahkan lebih cepat.',
              hasInsetCollage: true,
              insetPhotos: [
                { id: 'g1', title: 'Dropper Kaca', callout: 'Dropper presisi & higienis', imageDescription: 'Dropper meneteskan serum bening berkilau' },
                { id: 'g2', title: 'Tekstur Watery', callout: 'Cepat meresap tanpa lengket', imageDescription: 'Tetesan serum merata di punggung tangan halus' },
                { id: 'g3', title: 'Kandungan Aktif', callout: '10% Niacinamide + HA', imageDescription: 'Botol dengan pantulan cahaya keemasan lembut' },
                { id: 'g4', title: 'Hasil Teruji', callout: 'Mencerahkan dalam 7 hari', imageDescription: 'Hasil uji kelembapan kulit naik drastis' }
              ],
              visualDescription: 'Macro shot pipet meneteskan serum bening dengan kelembapan tinggi.',
              cameraMovement: 'Slow macro dolly across glass bottle and droplet',
              scenePromptTti: 'Commercial cosmetic photography of serum dropper with falling viscous droplet, studio lighting --ar 9:16 --v 6.1',
              scenePromptTtv: '[Camera: Macro 120fps] Crystal clear serum drop falls smoothly from glass pipette'
            },
            {
              id: 'glow-3',
              sceneNumber: 3,
              phaseTitle: 'Aplikasi & Feel',
              timeRange: '7 – 11 detik',
              shot: 'Medium close up (aplikasi ke pipi)',
              angle: 'Side profile 45 degree',
              duration: '7 – 11 detik',
              vo: 'Teksturnya watery dan langsung meresap dalam hitungan detik tanpa rasa lengket sama sekali.',
              subtitle: 'Teksturnya watery dan langsung meresap dalam hitungan detik tanpa rasa lengket sama sekali.',
              calloutText: 'Langsung glowing seketika! ♡',
              calloutArrowDirection: 'left',
              visualDescription: 'Model mengusap serum ke pipi dengan lembut, kulit langsung tampak dewy dan kenyal.',
              cameraMovement: 'Side 45 degree smooth orbit around cheekbone',
              scenePromptTti: 'Beauty commercial shot of girl applying facial serum, dewy glass skin finish --ar 9:16 --v 6.1',
              scenePromptTtv: '[Camera: Smooth orbit] Model gently applies serum to glowing dewy cheek'
            },
            {
              id: 'glow-4',
              sceneNumber: 4,
              phaseTitle: 'Closing / CTA',
              timeRange: '11 – 15 detik',
              shot: 'Close up portrait (memegang botol produk)',
              angle: 'Eye level',
              duration: '11 – 15 detik',
              vo: 'Dapatkan kulit sehat glowing impianmu hari ini. Klik link di bio sebelum kehabisan!',
              subtitle: 'Dapatkan kulit sehat glowing impianmu hari ini. Klik link di bio sebelum kehabisan!',
              calloutText: 'Promo launching diskon 40%! ♡',
              calloutArrowDirection: 'down',
              featureBadges: ['10% Niacinamide', 'Ringan & Cepat Resap', 'BPOM Approved', 'Glowing 7 Hari'],
              visualDescription: 'Model tersenyum puas memegang botol serum di sebelah wajahnya yang glowing cerah.',
              cameraMovement: 'Gentle push in to hero smiling pose with product',
              scenePromptTti: 'Commercial portrait of radiant smiling woman holding serum bottle beside cheek --ar 9:16 --v 6.1',
              scenePromptTtv: '[Camera: Push in] Smiling model holds serum bottle next to radiant face with sparkle'
            }
          ]
        }
      ]
    }
  }
];
