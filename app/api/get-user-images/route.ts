import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  const supabase = createClient();


  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    // Fetch from prompts table
    let promptsQuery = (await supabase)
      .from("prompts")
      .select("id, user_id, promptId, image_url, created_at")
      .eq("user_id", user.id)
      .eq("status", "succeeded");

    if (since) {
      promptsQuery = promptsQuery.gt("created_at", since);
    }

    const { data: promptsData, error: promptsError } = await promptsQuery;

    if (promptsError) {
      return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
    }


    // Fetch from images table with join to models
    let imagesQuery = (await supabase)
      .from("images")
      .select("id, modelId, uri, created_at, models!modelId(id, user_id)") // Use !modelId to specify the foreign key relationship
      .eq("models.user_id", user.id); // Filter by user_id in models

    if (since) {
      imagesQuery = imagesQuery.gt("created_at", since);
    }

    const { data: imagesData, error: imagesError } = await imagesQuery;

    if (imagesError) {
      console.error("Images fetch error:", imagesError);
      return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }


    // Map prompts data
    const promptsImages = promptsData.map((prompt) => ({
      id: prompt.id,
      image_url: prompt.image_url,
      promptId: prompt.promptId,
      user_id: prompt.user_id,
      created_at: prompt.created_at,
      source: "prompts",
    }));


    // Map images data
    const imagesImages = imagesData.map((image) => ({
      id: image.id,
      image_url: image.uri,
      promptId: image.id.toString(),
      user_id: user.id,
      created_at: image.created_at,
      source: "images",
    }));

    // Combine and sort
    const combinedImages = [...promptsImages, ...imagesImages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ images: combinedImages });
  } catch (error) {
    console.error("Unexpected error in get-user-images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}