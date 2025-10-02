import type { APIConfig, GenerationRequest, GenerationResponse } from "./types";

/**
 * AI Image Client (Gemini-only)
 *
 * This client generates images locally using the Google GenAI SDK.
 * It consumes a canvas image (base64 data URL) and an optional prompt,
 * returning a generated image data URL without any backend calls.
 */
export class APIClient {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  /**
   * Generate image using local Gemini model
   *
   * Accepts a base64 canvas image and optional prompt, returns a generated
   * image (data URL) or text.
   */
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Always use local GoogleGenAI to generate content
      const { GoogleGenAI } = await import("@google/genai");

      const ai = new GoogleGenAI({ apiKey: this.config.googleApiKey });

      // request.imageData is a dataURL (base64). Strip header if present.
      const base64Image = request.imageData.replace(
        /^data:image\/[a-zA-Z]+;base64,/, ""
      );

      const contents: any[] = [];
      if (request.prompt) {
        contents.push({ text: request.prompt });
      }
      contents.push({
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      });

      const response: any = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents,
      });

      const parts = response?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const outputBase64: string = part.inlineData.data;
          const outputDataUrl = `data:image/png;base64,${outputBase64}`;
          return {
            success: true,
            result: {
              output: outputDataUrl,
              metadata: {
                model: "gemini-2.5-flash-image-preview",
              },
            },
          };
        }
      }

      const textPart = parts.find((p: any) => p.text);
      if (textPart?.text) {
        return {
          success: true,
          result: {
            output: textPart.text,
            metadata: {
              model: "gemini-2.5-flash-image-preview",
            },
          },
        };
      }

      throw new Error("No image or text returned from Gemini");
    } catch (error) {
      console.error("Generation failed:", error);
      return {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error,
        },
      };
    }
  }
}

/**
 * Create Nano Banana API Client
 *
 * Factory function to create a properly configured Nano Banana API client.
 *
 * @param baseUrl - The base URL of your Nano Banana backend server
 * @param apiKey - Your Firebase ID token or API key for authentication
 * @returns Configured APIClient instance
 */
// Removed Nano Banana client factory; using Gemini only

/**
 * Create Gemini Local Client
 *
 * Uses @google/genai directly from the frontend to generate images.
 * Requires GOOGLE_GENAI_API_KEY to be provided.
 */
export const createGeminiClient = (googleApiKey?: string): APIClient => {
  return new APIClient({
    baseUrl: "", // not used in gemini mode
    provider: "gemini",
    googleApiKey: googleApiKey || (import.meta.env.VITE_GOOGLE_GENAI_API_KEY as string),
    headers: {},
  });
};
