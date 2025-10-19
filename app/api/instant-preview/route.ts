import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { fal } from "@fal-ai/client";

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
  throw new Error("MISSING FAL_KEY env variable for fal.ai integration");
}

fal.config({ credentials: FAL_KEY });

// Preset styles mapped to prompts
const STYLE_PROMPTS: Record<string, string> = {
  "professional": "Create a clean, well-lit studio-style professional headshot of me wearing professional outfit. Keep facial features realistic and flattering. Subtle depth-of-field, neutral backdrop, crisp lighting, natural skin tones.",
  "glamour": "Create a glamorous magazine-style portrait with soft studio lighting, a refined makeup look, and elegant styling. Emphasize glow and polished details while keeping identity realistic.",
  "creative": "Create an artistic and unique portrait with creative lighting and styling. Maintain realistic facial features while adding artistic flair and creative composition.",
  "natural": "Woman with voluminous layered hairstyle, slight smile, looking straight into camera. Background airbrushed pink-blue blend, glossy print reflection, film-style sharpness with analog color shift.",
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(user.id, apiRateLimit);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { imageUrls, imagesBase64, styleKey } = body;

    if ((!imageUrls || imageUrls.length === 0) && (!imagesBase64 || imagesBase64.length === 0)) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    if (!styleKey || !STYLE_PROMPTS[styleKey]) {
      return NextResponse.json({ error: "Invalid style key" }, { status: 400 });
    }

    // Check if user has already used their free trial
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('trial_preview_used')
      .eq('id', user.id)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ error: "Failed to verify user" }, { status: 500 });
    }

    if (userData?.trial_preview_used) {
      return NextResponse.json(
        { error: "Free trial already used. Please purchase credits to continue." },
        { status: 403 }
      );
    }

    let finalImageUrls = imageUrls || [];

    // If base64 images are provided, upload them to Fal storage
    if (imagesBase64 && imagesBase64.length > 0) {
      try {
        const uploadPromises = imagesBase64.map(async (base64: string) => {
          // Convert base64 to blob (handle both data URLs and raw base64)
          let cleanBase64 = base64;
          let mimeType = 'image/jpeg';
          
          // Check if it's a data URL and extract the base64 part and mime type
          if (base64.startsWith('data:')) {
            const mimeMatch = base64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
            mimeType = mimeMatch?.[1] || 'image/jpeg';
            cleanBase64 = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
          }
          
          // Convert to binary using Buffer (more reliable than atob)
          const binary = Buffer.from(cleanBase64, "base64");
          const blob = new Blob([binary], { type: mimeType });
          
          // Upload to Fal storage
          const uploadResult = await fal.storage.upload(blob);
          return uploadResult;
        });

        const uploadedResults = await Promise.all(uploadPromises);
        // fal.storage.upload returns the URL directly, not an object with .url property
        finalImageUrls = [...finalImageUrls, ...uploadedResults];
      } catch (uploadError) {
        console.error("Error uploading images to Fal storage:", uploadError);
        return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
      }
    }

    if (finalImageUrls.length === 0) {
      return NextResponse.json({ error: "No valid images provided" }, { status: 400 });
    }

    // Call Fal.ai Seedream v4 edit API
    const result = await fetch("https://fal.run/fal-ai/bytedance/seedream/v4/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_urls: finalImageUrls,
        prompt: STYLE_PROMPTS[styleKey],
        image_size: "portrait_4_3",
        enable_safety_checker: true,
        num_images: 1,
        max_images: 1,
        seed: Math.floor(Math.random() * 1000000),
      }),
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.error("Fal.ai API error:", errorText);
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    const falResponse = await result.json();

    // Mark trial as used
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ trial_preview_used: true })
      .eq('id', user.id);

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      image_url: falResponse.images?.[0]?.url || falResponse.image?.url,
      trial_used: true,
    });

  } catch (error) {
    console.error("Error in instant preview:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}