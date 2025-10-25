import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Use your utility
import { Database } from "@/types/supabase";


const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
const ASTRIA_API_URL = "https://api.astria.ai/tunes"

if (!ASTRIA_API_KEY) {
  throw new Error("MISSING ASTRIA_API_KEY!")
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const promptId = searchParams.get("promptId")
    const modelId = searchParams.get("modelId")
    const userId = searchParams.get("userId")

    if (!promptId || !modelId || !userId) {
      return NextResponse.json({ error: "Missing promptId, modelId, or userId" }, { status: 400 })
    }


    const promptResponse = await fetch(`${ASTRIA_API_URL}/${modelId}/prompts/${promptId}`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text()
      console.error("Astria API error:", {
        status: promptResponse.status,
        statusText: promptResponse.statusText,
        error: errorText,
      })
      return NextResponse.json(
        { error: "Error fetching prompt details from Astria" },
        { status: promptResponse.status },
      )
    }

    const promptData = await promptResponse.json()

    if (promptData.images?.length > 0) {
      const imageUrl = promptData.images[0]
      const supabase = await createClient(); // Use your server client

      // Update the prompts table
      const { error: promptError } = await supabase
        .from("prompts")
        .update({
          status: "succeeded",
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("promptId", promptId)
        .eq("user_id", userId)

      if (promptError) {
        console.error("Error updating prompt:", promptError)
      }


      return NextResponse.json({
        status: "succeeded",
        imageUrls: [imageUrl],
      })
    }

    // If we have the prompt data but no images yet
    return NextResponse.json({
      status: promptData.trained_at ? "succeeded" : "processing",
      message: promptData.trained_at ? "Generation complete but no images found" : "Image generation in progress",
    })
  } catch (error) {
    console.error("Error in check-image-status route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}