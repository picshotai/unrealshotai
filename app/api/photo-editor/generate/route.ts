import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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
    const { imageData, prompt, strength = 0.8, guidance = 7, steps = 20 } = body;

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Strip data URL header if present
    const base64Image = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    // Prepare content for Gemini
    const contents: any[] = [];
    
    if (prompt) {
      contents.push({ text: `Edit this image: ${prompt}` });
    } else {
      contents.push({ text: "Enhance and improve this image while maintaining its original content and style." });
    }

    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    });

    // Generate image using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents,
      config: {
        maxOutputTokens: 4096,
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
              model: "gemini-2.5-flash-image-preview",
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