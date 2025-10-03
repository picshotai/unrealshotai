// API Configuration types
export interface APIConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
  // Provider configuration: if set to 'gemini', use local GoogleGenAI
  provider?: "nanoBanana" | "gemini";
  googleApiKey?: string; // optional explicit key for GoogleGenAI
}

// Generation request/response types
export interface GenerationRequest {
  imageData: string; // base64 encoded image
  prompt?: string;
  strength?: number; // 0-1, how much to change the image
  guidance?: number; // 1-20, how closely to follow the prompt
  steps?: number; // number of inference steps
  seed?: number; // for reproducible results
}

export interface GenerationResponse {
  success: boolean;
  result?: {
    output: string; // URL or base64 of generated image
    requestId?: string;
    metadata?: {
      seed?: number;
      steps?: number;
      guidance?: number;
      processingTime?: number;
      model?: string; // Model identifier
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Polling types for async operations
export interface PollStatusRequest {
  requestId: string;
}

export interface PollStatusResponse {
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number; // 0-100
  result?: GenerationResponse["result"];
  error?: GenerationResponse["error"];
  estimatedTimeRemaining?: number; // in seconds
}

// Add Enhance (Upscale) request/response types
export interface EnhanceRequest {
  imageData: string; // base64 encoded image data URL
  fidelity?: number; // 0-1, default 0.5
  upscaling?: number; // 1, 2, 4, default 2
  face_upscale?: boolean; // default true
}

export interface EnhanceResponse {
  success: boolean;
  result?: {
    output: string; // URL of enhanced/upscaled image
    requestId?: string;
    metadata?: {
      fidelity?: number;
      upscaling?: number;
      face_upscale?: boolean;
      model?: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
