import { createClient } from '@/utils/supabase/server';
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const promptId = searchParams.get("promptId");
  const source = searchParams.get("source");


  if (!id || !source) {
    return NextResponse.json({ error: "ID and source are required" }, { status: 400 });
  }

  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid ID: must be a number" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;


  let error, count;

  if (source === "prompts") {
    if (!promptId) {
      return NextResponse.json({ error: "Prompt ID is required for prompts table" }, { status: 400 });
    }

    const promptIdNum = Number(promptId);
    if (isNaN(promptIdNum)) {
      return NextResponse.json({ error: "Invalid Prompt ID: must be a number" }, { status: 400 });
    }


    ({ error, count } = await supabase
      .from("prompts")
      .delete()
      .eq("id", idNum)
      .eq("promptId", promptIdNum)
      .eq("user_id", userId));
  } else if (source === "images") {
    ({ error, count } = await supabase
      .from("images")
      .delete()
      .eq("id", idNum));
  } else {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  if (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: "No matching image found to delete" }, { status: 404 });
  }


  return NextResponse.json({ message: "Image deleted successfully", deletedRows: count });
}