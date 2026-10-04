import { StoryboardCategory, StoryboardStyle } from '../types';

export interface StoryboardStyleItem {
  id: StoryboardStyle;
  name: string;
  category: StoryboardCategory;
  explanation: string;
  suitableFor: string;
  badge?: string;
  icon: string;
  structureBreakdown: string[];
  cameraStyle: string;
  lightingStyle: string;
  voTone: string;
}

export interface CategoryInfo {
  id: StoryboardCategory;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

export const STORYBOARD_CATEGORIES: CategoryInfo[] = [
  {
    id: 'storytelling',
    title: '1. 🎭 Storytelling',
    shortTitle: 'Storytelling',
    icon: '🎭',
    description: 'Cerita emosional, rutinitas, dan transformasi yang menghubungkan audiens dengan produk',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'product_shopping',
    title: '2. 🛍️ Product & Shopping',
    shortTitle: 'Product & Shop',
    icon: '🛍️',
    description: 'Fokus keindahan fisik, unboxing, detail fitur, material, dan demo produk',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'social_ugc',
    title: '3. 📱 Social Media / UGC',
    shortTitle: 'UGC & Social',
    icon: '📱',
    description: 'Format kasual, POV kreator, reaksi spontan, ASMR, dan konten viral TikTok/Reels',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'direct_response',
    title: '4. ⚡ Direct Response / Sales',
    shortTitle: 'Direct Response',
    icon: '⚡',
    description: 'Struktur iklan konversi tinggi: Hook cepat, Before/After, penawaran & CTA tegas',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cinematic',
    title: '5. 🎬 Cinematic',
    shortTitle: 'Cinematic',
    icon: '🎬',
    description: 'Sinematografi kelas film, lighting dramatis, slow motion, dan visual mood estetis',
    color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'educational',
    title: '6. 📚 Educational',
    shortTitle: 'Educational',
    icon: '📚',
    description: 'Tutorial langkah demi langkah, tips & trik, membongkar mitos, dan edukasi nilai produk',
    color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    gradient: 'from-sky-500 to-indigo-600',
  },
];

export const ALL_STORYBOARD_STYLES: StoryboardStyleItem[] = [
  // ================= 1. STORYTELLING =================
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    category: 'storytelling',
    explanation: 'Produk digunakan dalam aktivitas sehari-hari secara natural, sehingga iklan terasa seperti konten biasa.',
    suitableFor: 'Fashion, makanan, gadget, rumah tangga',
    badge: 'Favorit Brand',
    icon: '🌿',
    structureBreakdown: [
      'Scene 1: Suasana rutinitas santai & relatable di pagi/siang hari',
      'Scene 2: Karakter mempersiapkan barang harian & memegang produk',
      'Scene 3: Interaksi alami saat produk digunakan di aktivitas nyata',
      'Scene 4: Aesthetic close-up produk serasi dengan busana/interior',
      'Scene 5: Senyum kepuasan karakter menikmati momen tanpa hambatan',
      'Scene 6: Soft closing dengan logo brand & ajakan bergabung'
    ],
    cameraStyle: 'Eye level, medium shot handheld natural dengan warm ambient lighting',
    lightingStyle: 'Natural daylight, soft golden glow',
    voTone: 'Hangat, santai, dan bersahabat seperti obrolan teman',
  },
  {
    id: 'day_in_my_life',
    name: 'Day in My Life',
    category: 'storytelling',
    explanation: 'Produk menjadi bagian dari rutinitas sehari-hari karakter dari pagi hingga malam.',
    suitableFor: 'Fashion, skincare, gadget, lifestyle',
    badge: 'Tren Medsos',
    icon: '☀️',
    structureBreakdown: [
      'Scene 1: Rutinitas pagi hari — memulai hari dengan semangat baru',
      'Scene 2: Produk pertama kali hadir mendukung persiapan hari',
      'Scene 3: Berangkat kerja / kuliah — produk menemani mobilitas',
      'Scene 4: Momen puncak siang hari saat produk menjadi solusi penyelamat',
      'Scene 5: Suasana sore menjelang malam — kepuasan bertahan seharian',
      'Scene 6: Refleksi akhir hari & closing aesthetic bareng produk'
    ],
    cameraStyle: 'Handheld vlog style, jump cuts dinamis, medium close-up',
    lightingStyle: 'Transisi dari cahaya fajar, terik siang, hingga lampu kamar hangat malam hari',
    voTone: 'Vlog monologue personal, ramah, mengalir intim',
  },
  {
    id: 'emotional_story',
    name: 'Emotional Story',
    category: 'storytelling',
    explanation: 'Menggunakan emosi seperti kebahagiaan, keluarga, perjuangan, nostalgia, atau kejutan untuk membangun koneksi dengan penonton.',
    suitableFor: 'Brand, hadiah, fashion, makanan',
    badge: 'Sentuhan Hati',
    icon: '❤️',
    structureBreakdown: [
      'Scene 1: Hook emosional — momen hening atau kilas balik perjuangan/kenangan',
      'Scene 2: Hubungan antar karakter (keluarga/pasangan/sahabat) yang bermakna',
      'Scene 3: Produk dihadirkan sebagai simbol perhatian & kasih sayang',
      'Scene 4: Reaksi haru & pelukan hangat saat produk dirasakan manfaatnya',
      'Scene 5: Ikatan emosional semakin kuat berkat kehadiran produk',
      'Scene 6: Pesan filosofis brand mendalam & logo penutup yang berkesan'
    ],
    cameraStyle: 'Slow dolly-in, shallow depth of field, close-up ekspresi mata & senyum',
    lightingStyle: 'Cinematic warm backlighting, lembut, bokeh artistik',
    voTone: 'Mendalam, tenang, menyentuh hati dengan tempo ritmis',
  },
  {
    id: 'problem_solution',
    name: 'Problem → Solution',
    category: 'storytelling',
    explanation: 'Memperlihatkan masalah yang dialami target pengguna kemudian produk hadir sebagai solusi penyelamat.',
    suitableFor: 'Hampir semua produk',
    badge: 'Konversi Tinggi',
    icon: '💡',
    structureBreakdown: [
      'Scene 1: Masalah menjengkelkan yang sering dialami audiens ditampilkan dramatis',
      'Scene 2: Karakter merasa frustrasi atau kewalahan mencari jalan keluar',
      'Scene 3: Produk diperkenalkan sebagai momen "Aha!" yang menyegarkan',
      'Scene 4: Penggunaan produk secara instan menyelesaikan kerepotan',
      'Scene 5: Hasil bersih/sempurna tanpa repot dengan ekspresi lega',
      'Scene 6: Checklist keunggulan produk + Call to Action'
    ],
    cameraStyle: 'Kamera goyang/miring di awal (tegang) beralih ke orbit stabil & bersih (lega)',
    lightingStyle: 'Cool desaturated gloomy (masalah) berubah menjadi bright vibrant (solusi)',
    voTone: 'Empati di awal, lalu beralih antusias & meyakinkan',
  },
  {
    id: 'transformation',
    name: 'Transformation',
    category: 'storytelling',
    explanation: 'Karakter atau lingkungan mengalami perubahan visual drastis setelah menggunakan produk.',
    suitableFor: 'Fashion, beauty, interior, cleaning',
    badge: 'Visual Dampak',
    icon: '✨',
    structureBreakdown: [
      'Scene 1: Kondisi awal yang kusam, berantakan, atau kurang percaya diri',
      'Scene 2: Keputusan untuk mengambil langkah perubahan dengan produk',
      'Scene 3: Proses transformasi langkah demi langkah yang seru',
      'Scene 4: Momen reveal perubahan visual yang memukau mata',
      'Scene 5: Karakter tampil penuh rasa percaya diri & bahagia di lingkungan baru',
      'Scene 6: Side-by-side kilas balik perubahan + ajakan bertransformasi'
    ],
    cameraStyle: 'Whip pan transisi, time-lapse gerakan, match-cut visual',
    lightingStyle: 'Dramatis dari redup bertransformasi menjadi studio lighting berkilau',
    voTone: 'Inspiratif, memotivasi, dan penuh energi perubahan',
  },
  {
    id: 'gifting_story',
    name: 'Gift / Gifting Story',
    category: 'storytelling',
    explanation: 'Cerita dimulai dari seseorang memberikan produk sebagai hadiah istimewa sampai reaksi penerima.',
    suitableFor: 'Parfum, fashion, hadiah, gadget, perhiasan',
    badge: 'Momen Spesial',
    icon: '🎁',
    structureBreakdown: [
      'Scene 1: Persiapan kado — tangan mengikat pita pada kotak hadiah elegan',
      'Scene 2: Karakter pemberi membawa bingkisan dengan senyum misterius',
      'Scene 3: Momen penyerahan hadiah & tatapan kaget penerima',
      'Scene 4: Membuka pita & melihat produk di dalam kemasan eksklusif',
      'Scene 5: Mencoba produk & reaksi bahagia tak ternilai (pelukan/senyuman)',
      'Scene 6: Pesan kado sempurna untuk orang tersayang + CTA pemesanan'
    ],
    cameraStyle: 'Slow pedestal, over-the-shoulder shot, intimate close-up',
    lightingStyle: 'Lilin / festive fairy lights hangat, ambient mewah',
    voTone: 'Manis, penuh kasih sayang, hangat dan tulus',
  },
  {
    id: 'story_product_reveal',
    name: 'Story + Product Reveal',
    category: 'storytelling',
    explanation: 'Produk tidak langsung diperlihatkan; cerita dibangun terlebih dahulu kemudian produk muncul sebagai reveal utama.',
    suitableFor: 'Fashion, parfum, brand premium, peluncuran baru',
    badge: 'Penasaran Tinggi',
    icon: '🎭',
    structureBreakdown: [
      'Scene 1: Intro misterius — siluet karakter dalam perjalanan penuh tanda tanya',
      'Scene 2: Narasi rasa haus akan kualitas dan kesempurnaan',
      'Scene 3: Petunjuk-petunjuk kecil (tekstur, kilau, bayangan produk)',
      'Scene 4: Momen climactic reveal — pencahayaan menyala memperlihatkan produk penuh',
      'Scene 5: Karakter memegang produk dengan aura kepemilikan mutlak',
      'Scene 6: Nama produk terpampang megah beserta tagline brand eksklusif'
    ],
    cameraStyle: 'Low angle push-in perlahan, dramatic shadow tracking',
    lightingStyle: 'High-contrast chiaroscuro, spotlight reveal tajam',
    voTone: 'Karismatik, berwibawa, penuh intrik dan elegan',
  },

  // ================= 2. PRODUCT & SHOPPING =================
  {
    id: 'product_showcase',
    name: 'Product Showcase',
    category: 'product_shopping',
    explanation: 'Fokus utama pada keindahan, detail, fitur, material, dan tampilan produk dengan berbagai angle kamera.',
    suitableFor: 'Fashion, gadget, parfum, produk premium',
    badge: 'Estetika Tinggi',
    icon: '💎',
    structureBreakdown: [
      'Scene 1: Hero shot produk berputar perlahan di atas podium artistik',
      'Scene 2: Macro shot 1 — Kehalusan material dan tekstur jahitan/finishing',
      'Scene 3: Macro shot 2 — Komponen fungsional, tombol, atau hardware mengkilap',
      'Scene 4: Produk saat dipakai/digunakan secara elegan oleh model profesional',
      'Scene 5: Tampilan produk lengkap dalam berbagai varian warna/opsi',
      'Scene 6: Closing prestige dengan logo timbul dan info katalog'
    ],
    cameraStyle: '360 degree slow motorized turntable orbit, macro probe lens',
    lightingStyle: 'Commercial rim lighting, clean reflections, glossy gradient',
    voTone: 'Elegan, percaya diri, berbobot dan menonjolkan prestise',
  },
  {
    id: 'unboxing',
    name: 'Unboxing',
    category: 'product_shopping',
    explanation: 'Storyboard dimulai dari membuka paket, memperlihatkan isi, detail produk, kemudian mencoba produk.',
    suitableFor: 'Gadget, fashion, kosmetik, produk baru',
    badge: 'Paling Populer',
    icon: '📦',
    structureBreakdown: [
      'Scene 1: Paket datang — hook unboxing & rasa antusias membuka',
      'Scene 2: Membuka segel & kardus pengiriman dengan presisi',
      'Scene 3: Mengeluarkan produk utama dan isi aksesori bawaan',
      'Scene 4: Close-up detail produk saat pertama kali dipegang',
      'Scene 5: Mencoba/menyalakan/mengenakan produk secara langsung',
      'Scene 6: Kesan puas 10/10 + Call to Action untuk belanja'
    ],
    cameraStyle: 'Top-down flatlay 45 degree, medium close-up meja studio',
    lightingStyle: 'Clean studio desk lighting, soft shadows, neutral balance',
    voTone: 'Segar, antusias, jujur dan membangkitkan rasa ingin punya',
  },
  {
    id: 'unboxing_review',
    name: 'Unboxing + Review',
    category: 'product_shopping',
    explanation: 'Menggabungkan pembukaan paket dengan review singkat setelah produk dikeluarkan.',
    suitableFor: 'Gadget, fashion, kosmetik, perlengkapan kerja',
    badge: 'Review Jujur',
    icon: '🔍',
    structureBreakdown: [
      'Scene 1: Paket di meja — unboxing kilat dengan hook rasa penasaran',
      'Scene 2: Membuka kotak & mengeluarkan produk ke atas meja',
      'Scene 3: Review poin 1 — Kualitas fisik dan kenyamanan genggaman',
      'Scene 4: Review poin 2 — Fitur andalan yang paling diunggulkan',
      'Scene 5: Uji coba pemakaian nyata selama beraktivitas',
      'Scene 6: Kesimpulan rating jujur bintang 5 + rekomendasi belanja'
    ],
    cameraStyle: 'Desk vlog view, split screen perbandingan detail',
    lightingStyle: 'Bright softbox, pencahayaan merata jernih',
    voTone: 'Objektif, informatif, komunikatif dan meyakinkan',
  },
  {
    id: 'product_demo',
    name: 'Product Demo',
    category: 'product_shopping',
    explanation: 'Menunjukkan cara penggunaan produk secara bertahap dari awal sampai selesai.',
    suitableFor: 'Gadget, alat rumah tangga, kosmetik, perkakas',
    badge: 'Praktis',
    icon: '⚙️',
    structureBreakdown: [
      'Scene 1: Menunjukkan kondisi sebelum produk digunakan',
      'Scene 2: Langkah 1 — Menyiapkan dan mengaktifkan produk dengan mudah',
      'Scene 3: Langkah 2 — Mengaplikasikan produk pada target sasaran',
      'Scene 4: Visual aksi mekanis/formula produk bekerja secara instan',
      'Scene 5: Hasil tuntas sempurna dengan efisiensi waktu',
      'Scene 6: Rekap ringkas kemudahan + ajakan memiliki sekarang'
    ],
    cameraStyle: 'Close-up over-the-shoulder, steady tripod, inset detail zoom',
    lightingStyle: 'High-key studio lighting, no distracting reflections',
    voTone: 'Instruktif, lugas, santai dan mudah diikuti siapa saja',
  },
  {
    id: 'feature_highlight',
    name: 'Feature Highlight',
    category: 'product_shopping',
    explanation: 'Setiap scene berfokus pada satu fitur atau keunggulan produk secara spesifik.',
    suitableFor: 'Gadget, aplikasi, elektronik, tas multifungsi',
    badge: 'Spesifikasi Top',
    icon: '🎯',
    structureBreakdown: [
      'Scene 1: Hook pembuka memperkenalkan 3+ fitur rahasia produk',
      'Scene 2: Fitur 1 — Material unggulan tahan uji & durabilitas',
      'Scene 3: Fitur 2 — Desain ergonomis & kompartemen pintar',
      'Scene 4: Fitur 3 — Teknologi/kemudahan canggih yang membedakan',
      'Scene 5: Semua fitur berpadu dalam satu penggunaan harmonis',
      'Scene 6: Checklist keunggulan + call to action langsung'
    ],
    cameraStyle: 'Dynamic graphic zoom-in, callout pointer lines, 3D float',
    lightingStyle: 'Modern neon rim accents, clean product white-ground or sleek dark',
    voTone: 'Cepat, padat, berenergi tinggi dan meyakinkan',
  },
  {
    id: 'benefit_focus',
    name: 'Benefit Focus',
    category: 'product_shopping',
    explanation: 'Setiap scene menunjukkan satu manfaat utama produk melalui situasi nyata.',
    suitableFor: 'Skincare, kesehatan, rumah tangga, perlengkapan anak',
    badge: 'Solusi Nyata',
    icon: '🌟',
    structureBreakdown: [
      'Scene 1: Hook manfaat utama — hidup lebih mudah & nyaman',
      'Scene 2: Manfaat 1 — Menghemat waktu berharga sehari-hari',
      'Scene 3: Manfaat 2 — Memberikan rasa aman dan perlindungan maksimal',
      'Scene 4: Manfaat 3 — Meningkatkan penampilan & kepercayaan diri',
      'Scene 5: Suasana bahagia karakter menikmati dampak positifnya',
      'Scene 6: Ajakan merasakan manfaatnya hari ini + promo'
    ],
    cameraStyle: 'Lifestyle fluid camera, joyful character expressions, medium shot',
    lightingStyle: 'Warm sunny daylight, ceria dan membangkitkan mood',
    voTone: 'Menenangkan, empatik, optimis dan persuasif',
  },
  {
    id: 'comparison',
    name: 'Comparison',
    category: 'product_shopping',
    explanation: 'Membandingkan dua kondisi, metode, atau produk biasa vs produk ini secara visual.',
    suitableFor: 'Gadget, tools, cleaning, fashion, suplemen',
    badge: 'Bukti Komparasi',
    icon: '⚖️',
    structureBreakdown: [
      'Scene 1: Split screen — Cara lama yang ribet vs Cara baru produk ini',
      'Scene 2: Produk biasa cepat rusak / berat vs Produk ini kokoh & ringan',
      'Scene 3: Waktu pengerjaan produk biasa lama vs Produk ini instan hitungan detik',
      'Scene 4: Hasil akhir berdampingan — perbedaan kualitas tampak jelas',
      'Scene 5: Karakter mantap beralih 100% ke produk unggulan ini',
      'Scene 6: Tabel ringkasan perbandingan telak + Call to Action'
    ],
    cameraStyle: 'Split screen vertikal 50:50, swipe transition, side-by-side match',
    lightingStyle: 'Kiri (biasa): kusam/monoton; Kanan (produk): cerah berkilau',
    voTone: 'Tegas, komparatif, logis dan memandu pilihan terbaik',
  },

  // ================= 3. SOCIAL MEDIA / UGC =================
  {
    id: 'ugc',
    name: 'UGC (User Generated Content)',
    category: 'social_ugc',
    explanation: 'Dibuat seperti video rekomendasi pengguna biasa, lebih natural dan tidak terlalu terasa seperti iklan.',
    suitableFor: 'TikTok, Reels, produk viral, fashion, skincare',
    badge: 'Paling Viral',
    icon: '🤳',
    structureBreakdown: [
      'Scene 1: Selfie camera hook — "Kalian yang punya masalah ini, wajib stop scrolling!"',
      'Scene 2: Menunjukkan produk langsung di depan kamera ponsel tanpa filter',
      'Scene 3: Cerita singkat pengalaman pemakaian pribadi yang jujur',
      'Scene 4: Demo pemakaian langsung di kamar/meja rias/kantor',
      'Scene 5: Reaksi terkejut spontan melihat hasil yang didapat',
      'Scene 6: Rekomendasi ramah — "Check out di keranjang kuning sekarang ya!"'
    ],
    cameraStyle: 'Handheld smartphone camera vertikal, raw aesthetic, subtle camera shake',
    lightingStyle: 'Ring light natural, ambient ruangan asli, no studio lighting kaku',
    voTone: 'Spontan, santai ala gen-z/milenial, autentik tanpa kesan membaca skrip',
  },
  {
    id: 'pov',
    name: 'POV (Point of View)',
    category: 'social_ugc',
    explanation: 'Video seolah-olah dilihat langsung dari sudut pandang mata pengguna.',
    suitableFor: 'Gadget, makanan, fashion, marketplace, unboxing',
    badge: 'Imersif',
    icon: '👁️',
    structureBreakdown: [
      'Scene 1: POV tangan membuka pintu / melihat paket tiba di depan mata',
      'Scene 2: POV tangan meraih dan menggenggam produk untuk pertama kali',
      'Scene 3: POV mengoperasikan/menggunakan produk dari sudut pandang mata sendiri',
      'Scene 4: POV berinteraksi dengan lingkungan sekitar menggunakan produk',
      'Scene 5: POV teman/orang sekitar memuji dan mengagumi produk kita',
      'Scene 6: POV mengacungkan jempol ke produk + teks CTA di layar'
    ],
    cameraStyle: 'First-person camera (GoPro/chest mount), wide angle natural',
    lightingStyle: 'Dynamic real-world lighting mengikuti arah gerak kepala/mata',
    voTone: 'Inner thoughts narasi dalam hati, intimate, engaging',
  },
  {
    id: 'testimonial',
    name: 'Review / Testimonial',
    category: 'social_ugc',
    explanation: 'Karakter menjelaskan pengalaman menggunakan produk, kelebihan, dan hasil nyata yang dirasakan.',
    suitableFor: 'Produk konsumen, skincare, makanan, jasa',
    badge: 'Kepercayaan Tinggi',
    icon: '🗣️',
    structureBreakdown: [
      'Scene 1: Karakter menyapa audiens sambil memegang produk di tangan',
      'Scene 2: Cerita awal mula mencoba produk karena sempat ragu',
      'Scene 3: Bukti pemakaian rutin selama 2 minggu / sebulan terakhir',
      'Scene 4: Memperlihatkan hasil nyata pada diri karakter / benda kerja',
      'Scene 5: Alasan kenapa produk ini berbeda dibanding yang pernah dicoba',
      'Scene 6: Testimoni tulus & ajakan mencoba sendiri buktinya'
    ],
    cameraStyle: 'Medium close-up tatap mata kamera, conversational tripod setup',
    lightingStyle: 'Warm soft key light, flattering skin tone beauty light',
    voTone: 'Tulus, meyakinkan, jujur dan penuh rekomendasi tulus',
  },
  {
    id: 'first_impression',
    name: 'First Impression',
    category: 'social_ugc',
    explanation: 'Karakter pertama kali melihat, mencoba, atau menggunakan produk dan menunjukkan reaksinya.',
    suitableFor: 'Produk baru, makanan, kosmetik, gadget',
    badge: 'Spontanitas',
    icon: '😲',
    structureBreakdown: [
      'Scene 1: Hook rasa penasaran tinggi — "Akhirnya nyobain produk viral ini!"',
      'Scene 2: Momen pertama memegang produk & menilai bobot/materialnya',
      'Scene 3: Detik-detik mencoba/mencicipi/mengoleskan produk untuk kali pertama',
      'Scene 4: Ekspresi kaget dan terpukau tanpa kata (jaw drop / mata membelalak)',
      'Scene 5: Komentar spontan tentang sensasi unik yang baru dirasakan',
      'Scene 6: Vonis instan: "Worth the hype! Kalian harus coba."'
    ],
    cameraStyle: 'Tight close-up wajah reaksi, ekspresi mikro, responsive pan',
    lightingStyle: 'Bright vivid lighting menangkap detail ekspresi wajah',
    voTone: 'Penuh kejutan, riang, spontan dan menggugah rasa penasaran',
  },
  {
    id: 'reaction_surprise',
    name: 'Reaction / Surprise',
    category: 'social_ugc',
    explanation: 'Storyboard dibangun dari reaksi karakter setelah melihat atau mencoba produk.',
    suitableFor: 'Makanan, fashion, gadget, hadiah, cleaning',
    badge: 'Ekspresif',
    icon: '🎉',
    structureBreakdown: [
      'Scene 1: Karakter skeptis atau belum tahu apa yang akan terjadi',
      'Scene 2: Produk mulai diaplikasikan / ditunjukkan di depan karakter',
      'Scene 3: Reaksi terkejut histeris melihat perubahan atau fitur hebatnya',
      'Scene 4: Karakter memeriksa sendiri untuk memastikan bukan sulap',
      'Scene 5: Tawa lepas dan kepuasan luar biasa bersama produk',
      'Scene 6: Ajakan membagikan momen seru ini ke teman-teman'
    ],
    cameraStyle: 'Handheld dynamic zoom, quick push-in saat reaksi terjadi',
    lightingStyle: 'High-energy studio / real home ambiance',
    voTone: 'Enerjik, riuh, seru dan mengundang tawa positif',
  },
  {
    id: 'challenge',
    name: 'Challenge',
    category: 'social_ugc',
    explanation: 'Produk digunakan dalam sebuah tantangan atau eksperimen ekstrem untuk menunjukkan kemampuannya.',
    suitableFor: 'Cleaning, fitness, gadget tahan air/banting, perkakas',
    badge: 'Uji Ekstrem',
    icon: '🥊',
    structureBreakdown: [
      'Scene 1: Tantangan diumumkan — "Bisakah produk ini tahan uji ekstrem ini?"',
      'Scene 2: Menyiapkan situasi sulit (noda membandel / air / benturan)',
      'Scene 3: Produk diuji secara live tanpa rekayasa kamera',
      'Scene 4: Detik-detik penentuan hasil pengujian ekstrem',
      'Scene 5: Produk lolos uji dengan kondisi tetap prima 100%',
      'Scene 6: Kesimpulan ketahanan produk + promo tantangan berhadiah'
    ],
    cameraStyle: 'Action cam footage, slow-motion impact shot, high frame rate',
    lightingStyle: 'High contrast action lighting, dynamic shadows',
    voTone: 'Penuh adrenalin, memacu ketegangan, bangga dan berapi-api',
  },
  {
    id: 'asmr_product',
    name: 'ASMR Product',
    category: 'social_ugc',
    explanation: 'Fokus pada suara dan visual detail seperti membuka kemasan, tekstur, klik tombol, menuangkan produk.',
    suitableFor: 'Makanan, kosmetik, gadget, tas, perlengkapan tulis',
    badge: 'Tinggi Retensi',
    icon: '🎧',
    structureBreakdown: [
      'Scene 1: Bisikan lembut pembuka + visual tenang produk di atas meja aesthetic',
      'Scene 2: Sound of unboxing — ketukan kuku pada kemasan & suara pita dilepas',
      'Scene 3: Sound of clicking — bunyi klik tombol / resleting halus / bukaan segel',
      'Scene 4: Extreme close-up tekstur menyentuh permukaan / mengalir lembut',
      'Scene 5: Suara renyah saat digunakan atau dinikmati karakter',
      'Scene 6: Suara hembusan nafas lega & teks bisikan promo penutup'
    ],
    cameraStyle: 'Super macro 100mm, ultra shallow focus, gerakan lambat lembut',
    lightingStyle: 'Moody soft diffuse lighting, bayangan lembut menenangkan',
    voTone: 'ASMR whisper / audio visual murni dengan SFX renyah tanpa teriak',
  },
  {
    id: 'satisfying',
    name: 'Satisfying / Oddly Satisfying',
    category: 'social_ugc',
    explanation: 'Menampilkan aktivitas yang memberikan kepuasan visual, misalnya produk membersihkan sesuatu atau proses rapi.',
    suitableFor: 'Cleaning, stationery, tools, skincare peel-off, interior',
    badge: 'Bikin Candu',
    icon: '🫧',
    structureBreakdown: [
      'Scene 1: Visual noda tebal atau kekacauan yang menunggu dibersihkan',
      'Scene 2: Produk diaplikasikan dengan gerakan sapuan satu garis bersih',
      'Scene 3: Efek satisfying — perbedaan garis bersih vs kotor seketika',
      'Scene 4: Sapuan berlanjut hingga seluruh area berubah kinclong sempurna',
      'Scene 5: Tetesan air / kilau cahaya memantul dari permukaan yang rapi',
      'Scene 6: Kepuasan batin tuntas + ajakan merasakan sensasi ini sekarang'
    ],
    cameraStyle: 'Top-down locked tripod, smooth linear slider motion',
    lightingStyle: 'Ultra crisp white lighting menonjolkan kilau bersih',
    voTone: 'Menenangkan, puas, santai berirama dengan musik lo-fi',
  },

  // ================= 4. DIRECT RESPONSE / SALES =================
  {
    id: 'hook_product_benefit_cta',
    name: 'Hook → Product → Benefit → CTA',
    category: 'direct_response',
    explanation: 'Struktur iklan langsung: menarik perhatian, memperkenalkan produk, menunjukkan manfaat, lalu mengajak membeli.',
    suitableFor: 'TikTok Ads, Reels Ads, Meta Ads, produk viral',
    badge: 'Formula Terlaris',
    icon: '⚡',
    structureBreakdown: [
      'Scene 1: Pattern interrupt hook — tahan penonton di 3 detik pertama',
      'Scene 2: Kenalkan produk & fungsi utamanya sebagai bintang utama',
      'Scene 3: Manfaat 1 — Mengatasi kesulitan pengguna secara instan',
      'Scene 4: Manfaat 2 — Kualitas bahan unggul & keawetan jangka panjang',
      'Scene 5: Social proof kilat — ribuan orang sudah membuktikannya',
      'Scene 6: CTA mendesak — klik link promo hari ini sebelum kehabisan'
    ],
    cameraStyle: 'Fast paced cuts, snap zoom, kinetic typography overlay',
    lightingStyle: 'High-energy bright commercial lighting',
    voTone: 'Cepat, tegas, memikat, berorientasi aksi langsung',
  },
  {
    id: 'before_after',
    name: 'Before → After',
    category: 'direct_response',
    explanation: 'Menampilkan kondisi sebelum menggunakan produk lalu memperlihatkan perubahan drastis setelah menggunakannya.',
    suitableFor: 'Skincare, cleaning, fitness, kecantikan, renovasi',
    badge: 'Dampak Maksimal',
    icon: '🔄',
    structureBreakdown: [
      'Scene 1: Tampilkan masalah nyata & rasa frustrasi yang dialami (Before)',
      'Scene 2: Extreme close-up kondisi sebelum pemakaian yang bermasalah',
      'Scene 3: Produk diperkenalkan sebagai solusi praktis penyelamat',
      'Scene 4: Proses pemakaian yang mudah, cepat, dan nyaman',
      'Scene 5: Reveal dramatis kondisi sesudah pemakaian yang memukau (After)',
      'Scene 6: Senyum percaya diri karakter + Call to Action untuk mencoba'
    ],
    cameraStyle: 'Fixed angle match-cut perbandingan Before dan After identik',
    lightingStyle: 'Before: sedikit redup berbayang; After: bercahaya cerah merona',
    voTone: 'Dari prihatin empati beralih ke gembira dan memvalidasi',
  },
  {
    id: 'three_reasons_benefits',
    name: '3 Reasons / 3 Benefits',
    category: 'direct_response',
    explanation: 'Setiap scene menyampaikan satu dari tiga alasan/manfaat utama mengapa produk layak dipilih.',
    suitableFor: 'Hampir semua produk e-commerce & retail',
    badge: 'Format Struktur',
    icon: '3️⃣',
    structureBreakdown: [
      'Scene 1: Hook — "3 Alasan kenapa kamu wajib punya produk ini sekarang!"',
      'Scene 2: Alasan #1 — Efisiensi tinggi & memangkas waktu kerja',
      'Scene 3: Alasan #2 — Desain elegan & awet tahan lama',
      'Scene 4: Alasan #3 — Harga terjangkau dengan garansi resmi',
      'Scene 5: Tiga alasan berpadu dalam ringkasan grafis visual 3 ikon',
      'Scene 6: Ajakan take action sekarang sebelum promo berakhir'
    ],
    cameraStyle: 'Numbered badges on screen, dynamic sliding transitions',
    lightingStyle: 'Clean commercial lighting dengan highlight produk tajam',
    voTone: 'Terstruktur, lugas, percaya diri dan mengedukasi pembeli',
  },
  {
    id: 'top_features',
    name: 'Top 5 Features',
    category: 'direct_response',
    explanation: 'Menampilkan beberapa fitur unggulan secara cepat dan menarik tanpa buang waktu.',
    suitableFor: 'Gadget, aplikasi, tools, perlengkapan outdoor',
    badge: 'Cepat & Padat',
    icon: '🏆',
    structureBreakdown: [
      'Scene 1: Countdown hook — "Fitur gokil di produk ini yang bikin kaget!"',
      'Scene 2: Fitur 1 & 2 — Ketahanan material & kemudahan kendali',
      'Scene 3: Fitur 3 — Kepraktisan kompartemen & portabilitas',
      'Scene 4: Fitur 4 — Teknologi keamanan & efisiensi daya',
      'Scene 5: Fitur 5 — Nilai tambah eksklusif yang tidak ada di merk lain',
      'Scene 6: Rekap cepat + instruksi pemesanan instan'
    ],
    cameraStyle: 'Rapid fire montage, kinetic text highlight, snap focus',
    lightingStyle: 'High tech modern lighting dengan aksen warna brand',
    voTone: 'Antusias, bersemangat tinggi, cepat dan memikat',
  },
  {
    id: 'limited_promo',
    name: 'Limited Offer / Promo',
    category: 'direct_response',
    explanation: 'Storyboard menekankan promo, diskon, bundling, flash sale, atau keterbatasan waktu.',
    suitableFor: 'E-commerce, TikTok Shop, Flash Sale, Gajian Sale',
    badge: 'Urgensi Tinggi',
    icon: '🏷️',
    structureBreakdown: [
      'Scene 1: Alert banner hook — "Khusus hari ini! Diskon kilat jangan sampai lolos!"',
      'Scene 2: Tampilkan produk bintang utama dengan potongan harga tertera besar',
      'Scene 3: Paket bundling hadiah gratis yang didapat pembeli tercepat',
      'Scene 4: Ulasan kepuasan pembeli sebelumnya yang sudah borong',
      'Scene 5: Timer hitung mundur stok menipis tinggal beberapa slot',
      'Scene 6: CTA darurat — klik keranjang kuning / tombol beli sebelum habis!'
    ],
    cameraStyle: 'Pulsing urgency graphic, flashing price tags, dynamic zoom',
    lightingStyle: 'Vibrant punchy retail lighting, eye-catching saturation',
    voTone: 'Mendesak, antusias, memacu rasa takut kehabisan (FOMO)',
  },
  {
    id: 'question_answer',
    name: 'Question → Answer',
    category: 'direct_response',
    explanation: 'Dimulai dengan pertanyaan yang sering muncul dari calon pembeli kemudian produk memberikan jawabannya.',
    suitableFor: 'Semua kategori produk dengan keraguan pembeli',
    badge: 'Menjawab Ragu',
    icon: '❓',
    structureBreakdown: [
      'Scene 1: Muncul pertanyaan umum di layar: "Emang bener produk ini sebagus itu?"',
      'Scene 2: Produk diangkat ke kamera untuk membuktikan secara visual',
      'Scene 3: Menjawab keraguan #1: Uji ketahanan & kualitas bahan langsung',
      'Scene 4: Menjawab keraguan #2: Kemudahan cara pakai yang simpel',
      'Scene 5: Menjawab keraguan #3: Garansi dan layanan purna jual resmi',
      'Scene 6: Kesimpulan jawaban tuntas + ajakan checkout tanpa ragu'
    ],
    cameraStyle: 'Eye level conversational framing, text bubble Q&A graphic',
    lightingStyle: 'Warm trustworthy daylight, natural clear shadows',
    voTone: 'Ramah, menenangkan, meyakinkan dan berbasis fakta',
  },
  {
    id: 'problem_discovery',
    name: 'Problem Discovery',
    category: 'direct_response',
    explanation: 'Dimulai dengan situasi yang membuat penonton menyadari bahwa mereka memiliki masalah yang selama ini diabaikan.',
    suitableFor: 'Beauty, cleaning, lifestyle, kesehatan, ergonomi',
    badge: 'Buka Mata',
    icon: '🕵️',
    structureBreakdown: [
      'Scene 1: Hook pembuka: "Pernah gak ngerasa hal ini padahal sebenarnya ada solusi?"',
      'Scene 2: Visual zoom ke masalah kecil sehari-hari yang ternyata berdampak buruk',
      'Scene 3: Penjelasan kenapa cara lama yang biasa dipakai itu salah kaprah',
      'Scene 4: Produk diperkenalkan sebagai standar baru yang seharusnya digunakan',
      'Scene 5: Momen kelegaan saat hidup jadi jauh lebih sehat/rapi/nyaman',
      'Scene 6: Ajakan beralih ke solusi cerdas hari ini juga'
    ],
    cameraStyle: 'Slow push-in to detail problem, transition to bright wide shot',
    lightingStyle: 'Muted desaturated shadows shifting to clear daylight',
    voTone: 'Reflektif di awal, lalu membimbing dengan solusi mantap',
  },

  // ================= 5. CINEMATIC =================
  {
    id: 'mini_commercial',
    name: 'Mini Commercial / Cinematic',
    category: 'cinematic',
    explanation: 'Gaya iklan profesional dengan sinematografi, lighting, camera movement, dan visual premium.',
    suitableFor: 'Brand premium, parfum, fashion, otomotif, arloji',
    badge: 'Standar TVC',
    icon: '🎥',
    structureBreakdown: [
      'Scene 1: Cinematic wide landscape / interior mewah dengan pencahayaan anamorphic',
      'Scene 2: Karakter berjalan dengan aura percaya diri tinggi dalam framing artistik',
      'Scene 3: Macro extreme close-up produk membelah cahaya dengan kemilau refleksi',
      'Scene 4: Slow-motion shot interaksi halus antara tangan karakter dan produk',
      'Scene 5: Low-angle hero shot produk berdiri kokoh layaknya karya seni',
      'Scene 6: Logo brand timbul elegan disertai tagline mendalam'
    ],
    cameraStyle: 'Gimbal crane push-in, 24fps film look, shallow DOF, anamorphic flare',
    lightingStyle: 'Chiaroscuro cinematic lighting, dramatic rim lights, golden hour',
    voTone: 'Berwibawa, bariton dalam, tenang, mewah dan berkelas internasional',
  },
  {
    id: 'aesthetic_visual',
    name: 'Aesthetic / Visual Mood',
    category: 'cinematic',
    explanation: 'Lebih menekankan keindahan visual, komposisi, warna, lighting, dan suasana daripada dialog.',
    suitableFor: 'Parfum, fashion, skincare, perhiasan, interior',
    badge: 'Artistik',
    icon: '🎨',
    structureBreakdown: [
      'Scene 1: Komposisi visual simetris produk dengan palet warna selaras',
      'Scene 2: Permainan bayangan matahari senja melintasi kontur produk',
      'Scene 3: Gerakan kain sutra atau elemen alam (air/daun) di sekitar produk',
      'Scene 4: Model dalam pose editorial majalah kelas dunia memegang produk',
      'Scene 5: Detail tekstur permukaan produk di bawah pantulan kristal',
      'Scene 6: Frame penutup minimalis elegan dengan font serif mewah'
    ],
    cameraStyle: 'Art gallery framing, subtle slow pan, editorial magazine look',
    lightingStyle: 'Soft pastel tones, golden hour sun rays, moody shadows',
    voTone: 'Minimalis puitis atau murni instrumental musik berkelas',
  },
  {
    id: 'cinematic_product',
    name: 'Cinematic Product',
    category: 'cinematic',
    explanation: 'Eksplorasi kamera sinematik kelas atas khusus mengorbit produk tanpa gangguan model berlebih.',
    suitableFor: 'Gadget, parfum, sepatu sneakers, arloji, minuman',
    badge: 'Studio Kelas Atas',
    icon: '🪐',
    structureBreakdown: [
      'Scene 1: Kamera meluncur cepat dari kegelapan mendekati siluet produk',
      'Scene 2: Spotlight menyala menyapu kurva bodi produk dengan dramatis',
      'Scene 3: Gerakan kamera berputar (spiral orbit) menelusuri tiap sudut tajam',
      'Scene 4: Partikel halus / percikan air melayang di sekitar produk secara slow-motion',
      'Scene 5: Kamera berhenti pada posisi hero view produk yang gagah sempurna',
      'Scene 6: Nama produk menyala dengan efek neon glow lembut'
    ],
    cameraStyle: 'Robot arm camera movement, continuous 360 orbit, vertigo zoom',
    lightingStyle: 'Studio commercial dark mode, glowing neon edge highlights',
    voTone: 'Teknologis, prestisius, penuh wibawa dan percaya diri',
  },
  {
    id: 'slow_motion',
    name: 'Slow Motion',
    category: 'cinematic',
    explanation: 'Gerakan diperlambat dramatis untuk menangkap tetesan, percikan, lipatan kain, atau pantulan cahaya.',
    suitableFor: 'Minuman, kosmetik cair, olahraga, fashion, perhiasan',
    badge: '120fps Drama',
    icon: '⏳',
    structureBreakdown: [
      'Scene 1: Momen hening sebelum aksi dimulai dengan produk di tengah frame',
      'Scene 2: 120fps ultra slow-mo: Tetesan formula atau cairan memercik di atas produk',
      'Scene 3: Slow-mo kibasan kain atau rambut karakter saat mengenakan produk',
      'Scene 4: Pantulan cahaya menari di atas lekukan material produk dengan detail ajaib',
      'Scene 5: Gerakan kembali ke kecepatan normal dengan senyum puas karakter',
      'Scene 6: Tagline produk elegan dengan latar slow-motion hening'
    ],
    cameraStyle: 'High-speed camera 120-240fps, smooth floating slider',
    lightingStyle: 'Ultra high-intensity flicker-free studio lighting',
    voTone: 'Ritmis, pelan, menghipnotis dan penuh kekaguman',
  },
  {
    id: 'macro_product_shot',
    name: 'Macro Product Shot',
    category: 'cinematic',
    explanation: 'Pengambilan gambar jarak super dekat untuk menonjolkan pori material, jahitan benang, atau formula.',
    suitableFor: 'Arloji, perhiasan, kosmetik, gadget mikro, tas kulit',
    badge: 'Detail Mikro',
    icon: '🔬',
    structureBreakdown: [
      'Scene 1: Titik fokus bergeser dari latar belakang kabur menuju detail mikro produk',
      'Scene 2: Lensa mikro menelusuri kehalusan serat benang / tekstur kulit asli',
      'Scene 3: Close-up perputaran jarum jam / pantulan kilau diamond finishing',
      'Scene 4: Ukiran logo brand dengan ketajaman mikro yang memukau',
      'Scene 5: Kamera mundur mulus (zoom out) memperlihatkan produk secara utuh',
      'Scene 6: Logo brand dan pernyataan garansi keaslian material'
    ],
    cameraStyle: 'Macro probe lens, slow motorized pull-back, rack focus',
    lightingStyle: 'Precision fiber optic micro-lighting, crisp sparkle points',
    voTone: 'Fokus ke detail kualitas, presisi, keahlian tangan (craftsmanship)',
  },
  {
    id: 'emotional_cinematic',
    name: 'Emotional Cinematic',
    category: 'cinematic',
    explanation: 'Penggabungan teknik film layar lebar dengan alur cerita emosional yang menyentuh sanubari.',
    suitableFor: 'Brand campaign, filantropi, momen lebaran/natal, keluarga',
    badge: 'Layar Lebar',
    icon: '🎞️',
    structureBreakdown: [
      'Scene 1: Framing lanskap luas dengan scoring musik orkestra hening',
      'Scene 2: Karakter menatap ke kejauhan dengan sorot mata sarat makna',
      'Scene 3: Objek produk hadir sebagai pengingat mimpi atau janji berharga',
      'Scene 4: Interaksi hangat di bawah pencahayaan sore yang mengharukan',
      'Scene 5: Senyuman lega yang menandakan harapan baru telah tercapai',
      'Scene 6: Kata mutiara brand penutup yang menggugah inspirasi'
    ],
    cameraStyle: 'Wide anamorphic 2.39:1 letterbox, slow pan, atmospheric haze',
    lightingStyle: 'Natural sunset backlight, hazy atmospheric mood',
    voTone: 'Puitis, hangat, reflektif, menyatu dengan instrumen musik',
  },

  // ================= 6. EDUCATIONAL =================
  {
    id: 'tutorial',
    name: 'Tutorial',
    category: 'educational',
    explanation: 'Storyboard berbentuk panduan langkah demi langkah dengan produk sebagai bagian utama.',
    suitableFor: 'Beauty, aplikasi, software, tools, DIY',
    badge: 'Edukasi Praktis',
    icon: '📖',
    structureBreakdown: [
      'Scene 1: Hook hasil akhir — "Mau hasil seperti ini dalam 3 menit? Ini caranya!"',
      'Scene 2: Langkah 1 — Menyiapkan bahan dan memegang produk di posisi tepat',
      'Scene 3: Langkah 2 — Mengaplikasikan dengan teknik yang dianjurkan',
      'Scene 4: Langkah 3 — Kunci trik agar hasil tahan lama dan tidak gagal',
      'Scene 5: Hasil akhir tuntas dengan perbandingan nyata',
      'Scene 6: Simpan video ini + link produk resmi ada di bawah'
    ],
    cameraStyle: 'Clear overhead guide shot, on-screen number graphics (Step 1, Step 2)',
    lightingStyle: 'Clean bright instructional lighting, clear hands visibility',
    voTone: 'Ramah, sabar, membimbing langkah demi langkah dengan jelas',
  },
  {
    id: 'how_to_use',
    name: 'How To Use',
    category: 'educational',
    explanation: 'Menunjukkan instruksi cara pemakaian yang benar agar produk bekerja dengan hasil optimal.',
    suitableFor: 'Alat rumah tangga, kosmetik, gadget pintar, suplemen',
    badge: 'Panduan Jelas',
    icon: '📋',
    structureBreakdown: [
      'Scene 1: Menunjukkan produk dalam kemasan siap pakai',
      'Scene 2: Tahap 1: Membuka dan menakar dosis/jumlah yang pas',
      'Scene 3: Tahap 2: Menggunakan pada waktu atau tempat yang tepat',
      'Scene 4: Hal yang BOLEH vs TIDAK BOLEH dilakukan saat menggunakan',
      'Scene 5: Hasil maksimal tercapai dalam penggunaan rutin',
      'Scene 6: Informasi layanan bantuan pengguna + link pembelian'
    ],
    cameraStyle: 'Close-up demonstration, graphic do & don\'t checkmarks',
    lightingStyle: 'Even neutral white balance, sharp details on product labels',
    voTone: 'Jelas, bersahabat, teratur dan mudah dicerna pemula',
  },
  {
    id: 'myth_fact',
    name: 'Myth → Fact',
    category: 'educational',
    explanation: 'Membuka dengan anggapan umum yang salah kemudian menunjukkan fakta atau solusi melalui produk.',
    suitableFor: 'Edukasi skincare, kesehatan, makanan sehat, gadget',
    badge: 'Penghancur Mitos',
    icon: '💡',
    structureBreakdown: [
      'Scene 1: Hook mitos umum: "Katanya kalau pakai produk ini bikin repot? Salah besar!"',
      'Scene 2: Tunjukkan visual mitos lama yang bikin orang takut mencoba',
      'Scene 3: Fakta sebenarnya dibeberkan dengan data atau demo ilmiah produk',
      'Scene 4: Pembuktian langsung produk bekerja tanpa efek samping yang ditakuti',
      'Scene 5: Karakter tersenyum puas setelah tahu kebenaran sesungguhnya',
      'Scene 6: Teks penutup: "Jangan termakan mitos! Coba sendiri sekarang."'
    ],
    cameraStyle: 'Talking head directly to camera, X and Checkmark visual graphics',
    lightingStyle: 'Bright trustworthy daylight, clean background',
    voTone: 'Kritis di awal, lalu mencerahkan dan edukatif dengan senyuman',
  },
  {
    id: 'behind_the_scenes',
    name: 'Behind The Scenes',
    category: 'educational',
    explanation: 'Menunjukkan proses pembuatan, persiapan, atau bagaimana produk dibuat dan dikemas rapi.',
    suitableFor: 'Makanan, handmade, fashion lokal, bakery, produk artisan',
    badge: 'Autentik',
    icon: '🏭',
    structureBreakdown: [
      'Scene 1: Suasana dapur / workshop produksi yang higienis dan artistik',
      'Scene 2: Memilih bahan baku terbaik dengan seleksi ketat tanpa kompromi',
      'Scene 3: Proses pengolahan / penjahitan dengan ketelitian tinggi oleh pengrajin',
      'Scene 4: Quality check detail memastikan tidak ada cacat sedikitpun',
      'Scene 5: Mengemas produk ke dalam packaging ramah lingkungan dan cantik',
      'Scene 6: Dari tangan kami siap diantar ke rumahmu dengan penuh cinta'
    ],
    cameraStyle: 'Artisan workshop handheld, focus on skillful hands and craft tools',
    lightingStyle: 'Warm workshop natural light, aesthetic artisanal feel',
    voTone: 'Penuh kebanggaan karya, tulus, hangat dan membangkitkan apresiasi',
  },
  {
    id: 'expectation_reality',
    name: 'Expectation vs Reality',
    category: 'educational',
    explanation: 'Membandingkan ekspektasi sebelum belanja online dengan realita kepuasan setelah produk tiba.',
    suitableFor: 'E-commerce, pakaian, tas, barang dekorasi kamar',
    badge: 'Humor & Relatable',
    icon: '🎭',
    structureBreakdown: [
      'Scene 1: Ekspektasi di benak pembeli: "Beli online pasti zonk atau tipis..."',
      'Scene 2: Paket dibuka dengan rasa cemas sedikit ragu',
      'Scene 3: Realita reveal: Ternyata barangnya jauh lebih tebal dan bagus dari foto!',
      'Scene 4: Mencoba memakai langsung dengan rasa tidak percaya tapi senang',
      'Scene 5: Pamer ke cermin atau teman sambil senyum puas',
      'Scene 6: "Realita melebihi ekspektasi! Rating 100/10 wajib order lagi."'
    ],
    cameraStyle: 'Split frame / sequential cut dengan sound effect lucu dan menyenangkan',
    lightingStyle: 'Casual bedroom / living room natural lighting',
    voTone: 'Humoris, santai, relatable dan berakhir dengan kepuasan mutlak',
  },
];

export const STRUCTURE_FLOW_PRESETS = [
  {
    id: 'auto',
    name: 'Auto (Adaptif Sesuai Gaya)',
    description: 'AI menyesuaikan struktur adegan secara otomatis berdasarkan gaya storyboard yang Anda pilih.',
    steps: ['Hook Spesifik Gaya', 'Eksplorasi Karakter', 'Interaksi Produk', 'Detail & Pembuktian', 'Puncak Kepuasan', 'Call To Action']
  },
  {
    id: 'hook_problem_solution_cta',
    name: 'Hook → Masalah → Solusi → CTA',
    description: 'Struktur klasik direct response untuk produk yang memecahkan masalah mendesak.',
    steps: ['Pattern Interrupt Hook', 'Visual Masalah / Frustrasi', 'Produk Hadir Membantu', 'Demonstrasi Solusi', 'Hasil Nyata', 'Urgent Call to Action']
  },
  {
    id: 'hook_product_benefit_cta',
    name: 'Hook → Produk → Manfaat → CTA',
    description: 'Alur cepat untuk media sosial (TikTok & Reels Ads), mengutamakan nilai manfaat.',
    steps: ['Hook Tahan 3 Detik', 'Perkenalan Produk', 'Manfaat Utama #1', 'Manfaat Utama #2', 'Bukti Sosial', 'Ajakan Membeli']
  },
  {
    id: 'before_after_flow',
    name: 'Kondisi Before → Proses → Hasil After',
    description: 'Format transformasi dramatis untuk skincare, cleaning, renovasi, dan kebugaran.',
    steps: ['Kondisi Awal (Before)', 'Keluhan & Kesulitan', 'Aplikasi Produk Mudah', 'Proses Bekerja', 'Hasil Sempurna (After)', 'Rekomendasi & CTA']
  },
  {
    id: 'unboxing_review_flow',
    name: 'Paket Tiba → Unboxing → Detail → Review',
    description: 'Alur unboxing lengkap dari kardus pengiriman hingga impresi pemakaian pertama.',
    steps: ['Paket Baru Sampai', 'Buka Kardus & Segel', 'Keluarkan Produk Utama', 'Detail Kompartemen/Fitur', 'Uji Coba Langsung', 'Penilaian Rating & CTA']
  },
  {
    id: 'cinematic_story_flow',
    name: 'Sinematik → Emosi → Hero Shot → Brand Outro',
    description: 'Alur kelas TV Commercial yang menitikberatkan pada prestise dan kualitas sinematografi.',
    steps: ['Opening Sinematik Megah', 'Perjalanan Karakter', 'Macro Produk Bersinar', 'Koneksi Emosional', 'Hero Angle Produk', 'Tagline Brand Abadi']
  }
];

export function getStyleById(id: string): StoryboardStyleItem {
  if (id === 'demo_how_to') {
    const alias = ALL_STORYBOARD_STYLES.find((s) => s.id === 'product_demo');
    if (alias) return alias;
  }
  const found = ALL_STORYBOARD_STYLES.find((s) => s.id === id);
  if (found) return found;
  return ALL_STORYBOARD_STYLES[0]; // fallback to lifestyle
}

export function getStylesByCategory(cat: StoryboardCategory): StoryboardStyleItem[] {
  return ALL_STORYBOARD_STYLES.filter((s) => s.category === cat);
}
