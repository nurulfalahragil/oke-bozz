export type StoryboardCategory =
  | 'storytelling'
  | 'product_shopping'
  | 'social_ugc'
  | 'direct_response'
  | 'cinematic'
  | 'educational';

export type StoryboardStructure =
  | 'auto'
  | 'hook_problem_solution_cta'
  | 'hook_product_benefit_cta'
  | 'before_after_flow'
  | 'unboxing_review_flow'
  | 'cinematic_story_flow'
  | (string & {});

export type StoryboardStyle =
  | 'lifestyle'
  | 'before_after'
  | 'unboxing'
  | 'unboxing_review'
  | 'problem_solution'
  | 'product_showcase'
  | 'ugc'
  | 'testimonial'
  | 'product_demo'
  | 'how_to_use'
  | 'demo_how_to'
  | 'tutorial'
  | 'hook_product_benefit_cta'
  | 'storytelling'
  | 'emotional_story'
  | 'day_in_my_life'
  | 'pov'
  | 'first_impression'
  | 'comparison'
  | 'feature_highlight'
  | 'benefit_focus'
  | 'social_proof'
  | 'reaction_surprise'
  | 'challenge'
  | 'transformation'
  | 'mini_commercial'
  | 'aesthetic_visual'
  | 'asmr_product'
  | 'asmr_detail'
  | 'satisfying'
  | 'behind_the_scenes'
  | 'gifting_story'
  | 'seasonal_moment'
  | 'limited_promo'
  | 'problem_discovery'
  | 'expectation_reality'
  | 'three_reasons_benefits'
  | 'top_features'
  | 'question_answer'
  | 'myth_fact'
  | 'story_product_reveal'
  | 'cinematic_product'
  | 'slow_motion'
  | 'macro_product_shot'
  | 'emotional_cinematic'
  | (string & {});

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
  category?: StoryboardCategory;
  structurePattern?: string;
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
  storyboardCategory?: StoryboardCategory;
  storyboardStructure?: StoryboardStructure;
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

export type SimpleAdFormat =
  | 'hook_viral'
  | 'racun_tiktok'
  | 'flash_sale'
  | 'satisfying_hero'
  | 'problem_solution'
  | 'top_3_reasons';

export interface SimpleAdScene {
  timeRange: string;
  title: string;
  visualAction: string;
  cameraDirection: string;
  voScript: string;
  onScreenText: string;
}

export interface SimpleAdData {
  productName: string;
  brandName?: string;
  format: SimpleAdFormat;
  formatName: string;
  duration: number;
  platform: string;
  hookHeadline: string;
  fullVoScript: string;
  scenes: SimpleAdScene[];
  ttiVisualPrompt: string;
  ttvVideoPrompt: string;
  captionCopy: string;
  hashtags: string[];
}

