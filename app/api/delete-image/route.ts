import { createClient } from '@/utils/supabase/server';
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const promptId = searchParams.get("promptId");
  const source = searchParams.get("source");

  console.log("Deletion request received:", { id, promptId, source });

  if (!id || !source) {
    console.log("Missing id or source");
    return NextResponse.json({ error: "ID and source are required" }, { status: 400 });
  }

  const idNum = Number(id);
  if (isNaN(idNum)) {
    console.log("Invalid id: must be a number");
    return NextResponse.json({ error: "Invalid ID: must be a number" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Unauthorized: No user found", authError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  console.log("Attempting to delete image for user:", userId, "with id:", idNum, "source:", source);

  let error, count;

  if (source === "prompts") {
    if (!promptId) {
      console.log("Missing promptId for prompts table");
      return NextResponse.json({ error: "Prompt ID is required for prompts table" }, { status: 400 });
    }

    const promptIdNum = Number(promptId);
    if (isNaN(promptIdNum)) {
      console.log("Invalid promptId: must be a number for prompts table");
      return NextResponse.json({ error: "Invalid Prompt ID: must be a number" }, { status: 400 });
    }

    console.log("Deleting from prompts table with id:", idNum, "promptId:", promptIdNum, "user_id:", userId);
    ({ error, count } = await supabase
      .from("prompts")
      .delete()
      .eq("id", idNum)
      .eq("promptId", promptIdNum)
      .eq("user_id", userId));
  } else if (source === "images") {
    console.log("Deleting from images table with id:", idNum);
    ({ error, count } = await supabase
      .from("images")
      .delete()
      .eq("id", idNum));
  } else {
    console.log("Invalid source value:", source);
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  if (error) {
    console.error("Error deleting image from Supabase:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }

  if (count === 0) {
    console.log("No rows deleted: No matching record found or unauthorized");
    return NextResponse.json({ error: "No matching image found to delete" }, { status: 404 });
  }

  console.log(`Image deleted successfully from Supabase, ${count} row(s) deleted`);
  return NextResponse.json({ message: "Image deleted successfully", deletedRows: count });
}