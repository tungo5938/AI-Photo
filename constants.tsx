
import { PromptTemplate, AspectRatio, ModelId } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'studio-white',
    name: 'Pure White Studio',
    category: 'Studio',
    prompt: 'on a clean, pure white professional studio background with soft overhead lighting and subtle floor reflections',
    previewUrl: 'https://picsum.photos/seed/studio/200/200',
  },
  {
    id: 'marble-lux',
    name: 'Marble Luxury',
    category: 'Lifestyle',
    prompt: 'placed on a premium white marble pedestal, high-end bathroom background, soft morning sunlight, elegant atmosphere',
    previewUrl: 'https://picsum.photos/seed/marble/200/200',
  },
  {
    id: 'forest-vibe',
    name: 'Wild Forest',
    category: 'Nature',
    prompt: 'resting on a moss-covered damp rock in a misty pine forest, soft dappled sunlight through tree leaves, organic and natural',
    previewUrl: 'https://picsum.photos/seed/forest/200/200',
  },
  {
    id: 'beach-sand',
    name: 'Tropical Beach',
    category: 'Nature',
    prompt: 'on a pristine sandy beach with turquoise ocean waves in the background, bright sunny day, vacation vibes',
    previewUrl: 'https://picsum.photos/seed/beach/200/200',
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Interior',
    category: 'Lifestyle',
    prompt: 'on a light oak wooden table in a bright Scandinavian minimalist living room, soft linen textures, afternoon sun',
    previewUrl: 'https://picsum.photos/seed/nordic/200/200',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Artistic',
    prompt: 'on a wet asphalt surface at night, illuminated by vibrant blue and magenta neon lights, futuristic cityscape background',
    previewUrl: 'https://picsum.photos/seed/neon/200/200',
  }
];

export const MODEL_OPTIONS = [
  { id: ModelId.FLASH, name: 'Gemini 2.5 Flash', desc: 'Fast & Efficient' },
  { id: ModelId.PRO, name: 'Gemini 3 Pro (High Quality)', desc: 'Best Detail' },
];

export const ASPECT_RATIOS = [
  { id: AspectRatio.SQUARE, icon: 'square' },
  { id: AspectRatio.LANDSCAPE, icon: 'rectangle' },
  { id: AspectRatio.PORTRAIT, icon: 'stay_current_portrait' },
];
