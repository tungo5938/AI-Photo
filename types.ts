
export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  FOUR_THREE = '4:3',
  THREE_FOUR = '3:4',
}

export enum ModelId {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview',
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'Studio' | 'Lifestyle' | 'Nature' | 'Artistic';
  prompt: string;
  previewUrl: string;
}

export interface GenerationRecord {
  id: string;
  originalImage: string;
  generatedImage: string;
  prompt: string;
  timestamp: number;
  model: ModelId;
  aspectRatio: AspectRatio;
  tokensUsed: number;
}

export interface AppState {
  history: GenerationRecord[];
  isGenerating: boolean;
  uploadedImage: string | null;
  uploadedFile: File | null;
  config: {
    model: ModelId;
    aspectRatio: AspectRatio;
    resolution: string;
  };
  prompt: string;
  usage: {
    dailyTokens: number;
    totalTokens: number;
  };
}
