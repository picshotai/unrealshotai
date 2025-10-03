import type { APIConfig, GenerationRequest, GenerationResponse } from "./types";

/**
 * AI Image Client for Photo Editor
 *
 * This client generates images using the Next.js API route that integrates with Gemini.
 * It consumes a canvas image (base64 data URL) and an optional prompt,
 * returning a generated image data URL via backend API calls.
 */
export class APIClient {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  /**
   * Generate image using Next.js API route with Gemini
   *
   * Accepts a base64 canvas image and optional prompt, returns a generated
   * image (data URL) via the /api/photo-editor/generate endpoint.
   */
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response = await fetch('/api/photo-editor/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: request.imageData,
          prompt: request.prompt,
          strength: request.strength || 0.8,
          guidance: request.guidance || 7,
          steps: request.steps || 20,
          // Removed maskImage/maskData; overlay is baked into imageData
          model: (request as any).model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            code: "API_ERROR",
            message: errorData.error || `HTTP ${response.status}`,
          },
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          result: data.result,
        };
      } else {
        return {
          success: false,
          error: data.error,
        };
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error.message || "Failed to connect to API",
          details: error,
        },
      };
    }
  }
}

/**
 * Create Photo Editor Client
 *
 * Creates an APIClient instance for the photo editor that uses Next.js API routes.
 * The googleApiKey parameter is no longer needed since authentication is handled server-side.
 */
export const createGeminiClient = (googleApiKey?: string): APIClient => {
  return new APIClient({
    baseUrl: "/api/photo-editor", // Base URL for photo editor API routes
    provider: "gemini",
    googleApiKey: "", // Not needed for API route calls
    headers: {},
  });
};