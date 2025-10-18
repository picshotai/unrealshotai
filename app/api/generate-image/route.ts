import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const ASTRIA_API_URL = "https://api.astria.ai/tunes";
const APP_URL = process.env.APP_URL
const APP_WEBHOOK_SECRET = process.env.APP_WEBHOOK_SECRET;

if (!APP_WEBHOOK_SECRET) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Non-blocking rate-limit instrumentation: logs when exceeded
    const rl = await checkRateLimit(`generate-image:user:${user.id}`, apiRateLimit);
    if (!rl.success) {
      console.warn("Rate limit exceeded on generate-image", {
        userId: user.id,
        limit: rl.limit,
        remaining: rl.remaining,
        reset: rl.reset,
      });
    }

    const body = await request.json();
    const { modelId, prompt, width, height } = body;

    if (!modelId || !prompt || !width || !height) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: model, error: modelError } = await supabase
      .from("models")
      .select("modelId, type")
      .eq("id", modelId)
      .single();

    if (modelError) {
      console.error("Error fetching model:", modelError);
      return NextResponse.json(
        { error: "Error fetching model" },
        { status: 500 }
      );
    }

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const { data: userCredits, error: creditsError } = await supabase
      .from("credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (creditsError) {
      console.error("Error fetching user credits:", creditsError);
      return NextResponse.json(
        { error: "Error fetching user credits" },
        { status: 500 }
      );
    }

    if (!userCredits || userCredits.credits < 0.5) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    const triggerWord = model.type === "woman" ? "ohwx woman" : "ohwx man";
    const fullPrompt = `${triggerWord}, <lora:${model.modelId}:1> ${prompt}`;


    const promptWebhookWithParams = `${APP_URL}/api/prompt-webhook?user_id=${user.id}&modelId=${modelId}&webhook_secret=${APP_WEBHOOK_SECRET}`;

    const response = await fetch(`${ASTRIA_API_URL}/${model.modelId}/prompts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: {
          text: fullPrompt,
          callback: promptWebhookWithParams,
          num_images: 1,
          inpaint_faces: false,
          scheduler: "dpm++2m_karras",
          super_resolution: false,
          face_correct: false,
          w: width,
          h: height,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Astria API error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Error from Astria API" },
        { status: response.status }
      );
    }

    const result = await response.json();

    const { data: insertedPrompt, error: insertError } = await supabase
      .from("prompts")
      .insert({
        user_id: user.id,
        modelId: Number(modelId),
        promptId: result.id.toString(),
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting prompt:", insertError);
      return NextResponse.json(
        { error: "Failed to save prompt", details: insertError },
        { status: 500 }
      );
    }

    const { error: updateCreditsError } = await supabase.rpc("deduct_credits", {
      user_id: user.id,
      amount: 0.5,
    });

    if (updateCreditsError) {
      console.error("Error updating user credits:", updateCreditsError);
      return NextResponse.json(
        { error: "Error updating user credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Image generation started",
      promptId: result.id,
    });
  } catch (error) {
    console.error("Error in generate-image route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}