export type StoryboardStyle =
  | 'lifestyle'
  | 'before_after'
  | 'unboxing'
  | 'testimonial'
  | 'problem_solution'
  | 'asmr_detail'
  | 'emotional_story';

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type TtiEngine = 'flow' | 'midjourney' | 'flux' | 'ideogram' | 'sdxl' | 'leonardo';
export type TtvEngine = 'kling' | 'runway' | 'luma' | 'sora' | 'minimax' | 'pika';

export interface InsetPhoto {
  id: string;
  title: string;
  callout: string;
  imageDescription: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  phaseTitle: string; // e.g., "Hook", "Detail & Kapasitas", "Lifestyle", "Closing / CTA"
  timeRange: string;  // e.g., "0 – 3 detik"
  shot: string;       // e.g., "Medium shot (kamera depan, sedikit tilt up)"
  angle: string;      // e.g., "Eye level"
  duration: string;   // e.g., "0 – 3 detik" or "3 detik"
  vo: string;         // Voiceover script
  subtitle: string;   // Subtitle text
  calloutText?: string; // Handwritten callout like "Tas kecil tapi muat banyak!"
  calloutArrowDirection?: 'left' | 'right' | 'down' | 'up';
  featureBadges?: string[]; // e.g. ["Desain Elegan", "Ringan dan Nyaman", "Banyak Kompartemen", "Cocok untuk Semua Aktivitas"]
  hasInsetCollage?: boolean;
  insetPhotos?: InsetPhoto[];
  visualDescription: string;
  scenePromptTti: string;
  scenePromptTtv: string;
  cameraMovement: string;
}

export interface StoryboardPart {
  partNumber: number;
  partTitle: string;
  scenes: StoryboardScene[];
}

export interface StoryboardData {
  brandName: string;
  productName: string;
  tagline: string;
  durationTotal: number; // in seconds, e.g. 15
  partsCount: number;
  scenesCount: number;
  aspectRatio: AspectRatio;
  musicRecommendation: string;
  overlayTextRule: string;
  targetAudience: string;
  style: StoryboardStyle;
  parts: StoryboardPart[];
  // Outputs
  masterTtiPrompt: string;
  masterTtiNegativePrompt: string;
  masterTtvPrompt: string;
  bgmSfxNotes: string;
  productVisualSummary: string;
  modelVisualSummary: string;
}

export interface GeneratorRequest {
  productImage: string; // Data URL or URL
  modelImage?: string;  // Data URL or URL
  modelPersonaPreset?: string;
  productName: string;
  brandName?: string;
  tagline?: string;
  productDescription: string;
  productFeatures: string[];
  storyboardStyle: StoryboardStyle;
  numParts: number;
  numPanels: number;
  duration: number;
  aspectRatio: AspectRatio;
  targetAudience: string;
  musicStyle: string;
  language: 'id' | 'en';
  targetTtiEngine: TtiEngine;
  targetTtvEngine: TtvEngine;
}
