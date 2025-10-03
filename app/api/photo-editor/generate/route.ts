import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageData, prompt, strength = 0.8, guidance = 7, steps = 20, model } = body;

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Strip data URL header if present
    const base64Image = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    // Prepare content for Gemini
    const contents: any[] = [];
    // System-style instruction: only modify the semi-transparent colored overlay regions; preserve everything else.
    contents.push({ text: "Only modify the object indicated by the semi-transparent colored overlay as per instructed by user prompt to make edits. Preserve all other regions exactly as the original image." });
    if (prompt) {
      contents.push({ text: prompt });
    } else {
      contents.push({ text: "Enhance and improve only the overlay region while maintaining original content and style elsewhere." });
    }

    // Provide the composited image (with overlay if present)
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    });

    const modelName = model || "gemini-2.5-flash-image";

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        responseModalities: [Modality.IMAGE],
        candidateCount: 1,
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    
    // Look for generated image in response
    for (const part of parts) {
      if (part.inlineData?.data) {
        const outputBase64 = part.inlineData.data;
        const outputDataUrl = `data:image/png;base64,${outputBase64}`;
        
        return NextResponse.json({
          success: true,
          result: {
            output: outputDataUrl,
            metadata: {
              model: modelName,
              processingTime: Date.now(),
              strength,
              guidance,
              steps,
            },
          },
        });
      }
    }

    // If no image was generated, return text response or error
    const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textResponse) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NO_IMAGE_GENERATED",
          message: "Gemini returned text instead of image",
          details: textResponse,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: {
        code: "GENERATION_FAILED",
        message: "Failed to generate image",
      },
    }, { status: 500 });

  } catch (error) {
    console.error("Photo editor generation error:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
    }, { status: 500 });
  }
}