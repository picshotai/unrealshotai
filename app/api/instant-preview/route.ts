import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { fal } from "@fal-ai/client";

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
  throw new Error("MISSING FAL_KEY env variable for fal.ai integration");
}

fal.config({ credentials: FAL_KEY });

// Preset styles mapped to prompts by gender
const STYLE_PROMPTS: Record<string, Record<string, string>> = {
  "man": {
    "professional": "professional portrait headshot of me, smiling, direct gaze, hands in suit pockets, dark navy blue two-button suit, white dress shirt, dark blue necktie, textured dark grey background, studio lighting, sharp focus, high resolution, corporate headshot, photorealistic. Subtle depth-of-field, neutral backdrop, crisp lighting, natural skin tones.",
    "glamour": "striking casual pose of me, with rolled-up sleeves and suspenders, leans against a graffiti wall, in a vintage photography aesthetic. The backdrop features a faded advertisement, with the natural light illuminating his face and the textures of the brick, with a slight tilt-shift effect used to isolate the man and the wall.",
    "creative": "A handsome man(me from the attache photo) is the subject of a black swan photoshoot, dressed in a sleek, minimalist black suit. The setting is a minimalist studio, with the photograph being in a high-contrast black and white style, showcasing the sharp lines and textures of the attire. He leans against a dark, textured wall, his expression serious and focused, captured in a waist-up shot emphasizing his posture and the quality of light.",
    "natural": "Handsome man with natural hairstyle, confident smile, looking straight into camera. Background airbrushed neutral blend, natural lighting, film-style sharpness with analog color shift."
  },
  "woman": {
    "professional": "Create a clean, well-lit studio-style professional headshot of a beautiful woman wearing professional business attire. Keep facial features realistic and flattering. Subtle depth-of-field, neutral backdrop, crisp lighting, natural skin tones.",
    "glamour": "Create a glamorous magazine-style portrait of a beautiful woman with soft studio lighting, refined makeup look, and elegant styling. Emphasize feminine features and polished details while keeping identity realistic.",
    "creative": "Create an artistic and unique portrait of a woman with creative lighting and styling. Maintain realistic facial features while adding artistic flair and creative composition.",
    "natural": "Beautiful woman with voluminous layered hairstyle, slight smile, looking straight into camera. Background airbrushed pink-blue blend, glossy print reflection, film-style sharpness with analog color shift."
  }
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
    const { imageUrls, imagesBase64, styleKey, gender = 'man' } = body;

    if ((!imageUrls || imageUrls.length === 0) && (!imagesBase64 || imagesBase64.length === 0)) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    if (!styleKey || !STYLE_PROMPTS[gender]?.[styleKey]) {
      return NextResponse.json({ error: "Invalid style key or gender" }, { status: 400 });
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
    const result = await fetch("https://fal.run/fal-ai/nano-banana/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_urls: finalImageUrls,
        prompt: STYLE_PROMPTS[gender][styleKey],
        aspect_ratio: "3:4",
        num_images: 1,
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