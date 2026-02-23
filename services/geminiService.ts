
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelId, AspectRatio } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateProductImage = async (
  imageData: string,
  prompt: string,
  config: {
    model: ModelId;
    aspectRatio: AspectRatio;
  }
): Promise<{ imageUrl: string; tokens: number }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  // Handle Pro model key selection if needed
  if (config.model === ModelId.PRO) {
    // Check if the environment provides helper for Pro keys (as per instructions)
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Format the image for the API
  const base64Data = imageData.split(',')[1];
  const mimeType = imageData.split(';')[0].split(':')[1];

  const fullPrompt = `Transform this product photo by placing it in a new scene. Keep the product exactly as it is but change the background and lighting: ${prompt}. Ensure the lighting on the product matches the new environment perfectly.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: ModelId.PRO,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: fullPrompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        },
      },
    });

    let generatedImageUrl = "";
    // Search for the image part in candidates
    const candidate = response.candidates?.[0];
    if (candidate) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      throw new Error("No image data returned from Gemini API");
    }

    // Mock token calculation
    const tokens = 2500;

    return {
      imageUrl: generatedImageUrl,
      tokens,
    };
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("API key not found")) {
      // Reset key selection if Pro model fails
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
      }
    }
    throw error;
  }
};
