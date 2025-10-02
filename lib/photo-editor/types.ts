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
  maskData?: any[]; // mask strokes array (future use)
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