
import { PromptTemplate, AspectRatio, ModelId } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'studio',
    name: 'Professional Studio',
    category: 'Studio',
    prompt: 'Transform this casual product photo into professional e-commerce imagery: Replace mixed lighting with soft, even studio lighting (daylight 5500K-6500K). Pure white background (#FFFFFF), remove floral pattern completely. Position shorts on professional hanger, centered with natural draping. Remove all wrinkles. Sharp focus, straight-on angle, high resolution (2000x2000px minimum). Enhance heather grey fabric texture and drawstring details. Accurate color reproduction, balanced exposure, no color casts. Clean minimalist style matching Zara/H&M standards. Square 1:1 aspect ratio.',
    previewUrl: 'https://picsum.photos/seed/studio/200/200',
  },
  {
    id: 'in-use',
    name: 'Product In Use',
    category: 'In Use',
    prompt: 'being used in a real-world scenario, natural hand holding the product, lifestyle setting, soft focus background',
    previewUrl: 'https://picsum.photos/seed/inuse/200/200',
  },
  {
    id: 'flatlay',
    name: 'Elegant Flatlay',
    category: 'Flatlay',
    prompt: 'top-down flatlay composition on a textured linen surface, surrounded by minimalist props, soft side lighting',
    previewUrl: 'https://picsum.photos/seed/flatlay/200/200',
  },
  {
    id: 'floating',
    name: 'Zero Gravity',
    category: 'Floating',
    prompt: 'floating in mid-air against a dreamlike gradient background, ethereal lighting, particles in the air, surreal atmosphere',
    previewUrl: 'https://picsum.photos/seed/floating/200/200',
  },
  {
    id: 'ingredient',
    name: 'Ingredient Splash',
    category: 'Ingredient',
    prompt: 'surrounded by fresh raw ingredients, water splashes, dynamic composition, high-speed photography style',
    previewUrl: 'https://picsum.photos/seed/ingredient/200/200',
  },
  {
    id: 'contextual',
    name: 'Contextual Concept',
    category: 'Contextual',
    prompt: 'placed in a highly conceptual environment, abstract shapes, dramatic lighting, artistic and bold',
    previewUrl: 'https://picsum.photos/seed/context/200/200',
  }
];

export const ASPECT_RATIOS = [
  { id: AspectRatio.SQUARE, icon: 'square', label: '1:1' },
  { id: AspectRatio.LANDSCAPE, icon: 'rectangle', label: '16:9' },
  { id: AspectRatio.PORTRAIT, icon: 'stay_current_portrait', label: '9:16' },
];
