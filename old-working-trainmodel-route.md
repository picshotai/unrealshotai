import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;
const dodopaymentIsConfigured = true; // Always enabled for dodopayments

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const payload = await request.json();
  const { urls: images, name, type, pack, is_custom } = payload;

  const supabase = createClient(); // Using @supabase/ssr client

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!astriaApiKey) {
    return NextResponse.json(
      { message: "Missing API Key: Add your Astria API Key to generate headshots" },
      { status: 500 },
    );
  }

  if (images?.length < 4 || images?.length > 10) {
    return NextResponse.json(
      { message: "Please upload 4 - 10 sample images" },
      { status: 400 },
    );
  }

  let _credits = null;
  const requiredCredits = is_custom ? 20 : 30; // 20 credits for custom, 30 for pack-based

  console.log({ dodopaymentIsConfigured });
  if (dodopaymentIsConfigured) {
    const { error: creditError, data: credits } = await supabase
      .from("credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (creditError) {
      console.error({ creditError });
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 },
      );
    }

    if (!credits) {
      // create credits for user
      const { error: errorCreatingCredits } = await supabase.from("credits").insert({
        user_id: user.id,
        credits: 0,
      });

      if (errorCreatingCredits) {
        console.error({ errorCreatingCredits });
        return NextResponse.json(
          { message: "Something went wrong!" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: "Not enough credits, please purchase some credits and try again." },
        { status: 400 },
      );
    } else if (credits.credits < requiredCredits) {
      return NextResponse.json(
        { message: "Not enough credits, please purchase some credits and try again." },
        { status: 400 },
      );
    } else {
      _credits = credits;
    }
  }

  // create a model row in supabase
  const { error: modelError, data } = await supabase
    .from("models")
    .insert({
      user_id: user.id,
      name,
      type,
      is_custom,
    })
    .select("id")
    .single();

  if (modelError) {
    console.error("modelError: ", modelError);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 },
    );
  }

  // Get the modelId from the created model
  const modelId = data?.id;

  try {
    const trainWebhook = `https://${process.env.APP_URL}/astria/train-webhook`;
    const trainWebhookWithParams = `${trainWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_secret=${appWebhookSecret}`;

    const promptWebhook = `https://${process.env.APP_URL}/astria/prompt-webhook`;
    const promptWebhookWithParams = `${promptWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_secret=${appWebhookSecret}`;

    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    // Create a fine-tuned model using Astria API
    const tuneBody = {
      tune: {
        title: name,
        base_tune_id: 1504944, // Flux1.dev tune ID
        model_type: "lora",
        token: "ohwx",
        name: is_custom ? type : "custom", // Use 'type' for custom models
        preset: "flux-lora-fast",
        image_urls: images,
        callback: trainWebhookWithParams,
      },
    };

    // Create a fine tuned model using Astria packs API
    const packBody = {
      tune: {
        title: name,
        name: type,
        callback: trainWebhookWithParams,
        prompt_attributes: {
          callback: promptWebhookWithParams,
        },
        image_urls: images,
      },
    };

    // Insert into samples table before credit deduction and Astria API call
    const { error: samplesError } = await supabase.from("samples").insert(
      images.map((sample: string) => ({
        modelId: modelId,
        uri: sample,
      })),
    );

    if (samplesError) {
      console.error("samplesError: ", samplesError);
      // Rollback: Delete the created model if samples insertion fails
      if (modelId) {
        await supabase.from("models").delete().eq("id", modelId);
      }
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 },
      );
    }

    // Deduct credits before making the Astria API call
    if (dodopaymentIsConfigured && _credits) {
      const subtractedCredits = _credits.credits - requiredCredits;
      const { error: updateCreditError, data } = await supabase
        .from("credits")
        .update({ credits: subtractedCredits })
        .eq("user_id", user.id)
        .select("*");

      if (updateCreditError) {
        console.error({ updateCreditError });
        // Rollback: Delete the created model and samples if credit deduction fails
        if (modelId) {
          await supabase.from("samples").delete().eq("modelId", modelId);
          await supabase.from("models").delete().eq("id", modelId);
        }
        return NextResponse.json(
          { message: "Failed to deduct credits" },
          { status: 500 },
        );
      }
      console.log({ data });
      console.log({ subtractedCredits });
    }

    const response = await axios.post(
      `${DOMAIN}${packsIsEnabled && !is_custom ? `/p/${pack}/tunes` : "/tunes"}`,
      packsIsEnabled && !is_custom ? packBody : tuneBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    const { status } = response;

    if (status !== 201) {
      console.error({ status });
      // Rollback: Delete the created model and samples if something goes wrong
      if (modelId) {
        await supabase.from("samples").delete().eq("modelId", modelId);
        await supabase.from("models").delete().eq("id", modelId);
      }

      if (status === 400) {
        return NextResponse.json(
          { message: "webhookUrl must be a URL address" },
          { status },
        );
      }
      if (status === 402) {
        return NextResponse.json(
          { message: "Training models is only available on paid plans." },
          { status },
        );
      }
    }
  } catch (e) {
    console.error(e);
    // Rollback: Delete the created model and samples if something goes wrong
    if (modelId) {
      await supabase.from("samples").delete().eq("modelId", modelId);
      await supabase.from("models").delete().eq("id", modelId);
    }
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "success" },
    { status: 200 },
  );
}