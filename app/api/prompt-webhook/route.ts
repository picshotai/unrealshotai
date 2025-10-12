import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin"; // Use admin client for API routes

const APP_WEBHOOK_SECRET = process.env.APP_WEBHOOK_SECRET;

if (!APP_WEBHOOK_SECRET) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

type AstriaPromptData = {
  id: string;
  text: string;
  images: { url: string }[];
  status: string;
  tune_id: string;
  created_at: string;
  updated_at: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient(); // Use admin client for API routes

    const incomingData = (await request.json()) as { prompt: AstriaPromptData };
    const { prompt } = incomingData;
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");
    const modelId = url.searchParams.get("modelId");
    const webhookSecret = url.searchParams.get("webhook_secret");

    if (!modelId || !userId || !webhookSecret) {
      console.error("Missing required URL parameters:", {
        userId,
        modelId,
        webhookSecret,
      });
      return NextResponse.json(
        { message: "Missing required URL parameters" },
        { status: 400 }
      );
    }

    if (webhookSecret !== APP_WEBHOOK_SECRET) {
      console.error("Webhook secret mismatch");
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    if (prompt.status === "succeeded" && prompt.images && prompt.images.length > 0) {
      const { error: updateError } = await supabase
        .from("prompts")
        .update({
          status: prompt.status,
          image_url: prompt.images[0].url,
        })
        .eq("promptId", prompt.id)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating prompt status and image URL:", updateError);
        return NextResponse.json(
          { error: "Error updating prompt status and image URL" },
          { status: 500 }
        );
      }

      const { error: insertError } = await supabase.from("images").insert({
        userId: userId,
        modelId: Number.parseInt(modelId),
        uri: prompt.images[0].url,
      });

      if (insertError) {
        console.error("Error inserting image:", insertError);
        return NextResponse.json(
          { error: "Error inserting image" },
          { status: 500 }
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from("prompts")
        .update({ status: prompt.status })
        .eq("promptId", prompt.id)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating prompt status:", updateError);
        return NextResponse.json(
          { error: "Error updating prompt status" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in prompt-webhook route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}