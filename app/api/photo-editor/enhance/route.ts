import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@/utils/supabase/server";

// Configure Fal AI client once
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "Fal AI API key not configured" }, { status: 500 });
    }

    // Parse JSON body
    const body = await request.json();
    const { imageData, fidelity = 0.5, upscaling = 2, face_upscale = true } = body || {};

    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Convert data URL to Blob and upload to Fal storage to obtain a URL
    const base64 = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const binary = Buffer.from(base64, "base64");
    const mimeMatch = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mimeType = mimeMatch?.[1] || "image/png";
    const blob = new Blob([binary], { type: mimeType });

    const uploadedUrl = await fal.storage.upload(blob);

    // Call Fal AI Codeformer for enhancement/upscaling
    const result = await fal.subscribe("fal-ai/codeformer", {
      input: {
        image_url: uploadedUrl,
        fidelity,
        upscaling,
        face_upscale,
      },
      logs: true,
      onQueueUpdate: () => {
        // Optionally log or stream updates
      },
    });

    const data = result?.data as any;

    // Depending on Fal response shape, prefer images[0].url; fallback to data.image.url
    const outputUrl: string | undefined =
      (Array.isArray(data?.images) && data.images[0]?.url) || data?.image?.url || data?.output?.url;

    if (!outputUrl || typeof outputUrl !== "string") {
      return NextResponse.json({
        success: false,
        error: { code: "NO_OUTPUT", message: "No enhanced image URL returned" },
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: {
        output: outputUrl,
        requestId: result.requestId,
        metadata: { fidelity, upscaling, face_upscale, model: "fal-ai/codeformer" },
      },
    });
  } catch (error: any) {
    const message = error?.message || "Internal server error";
    const status = /401|authentication/i.test(message)
      ? 401
      : /429|rate limit/i.test(message)
      ? 429
      : /408|timeout/i.test(message)
      ? 408
      : 500;

    return NextResponse.json({
      success: false,
      error: { code: "ENHANCE_ERROR", message },
    }, { status });
  }
}