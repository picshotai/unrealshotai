import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";
import { putR2Object } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Node runtime for Buffer handling

function sanitizeFilename(name: string) {
  const base = name?.split("/").pop() || "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Non-blocking rate-limit instrumentation: logs when exceeded
  const rl = await checkRateLimit(`image-upload:user:${user.id}`, apiRateLimit);
  if (!rl.success) {
    console.warn("Rate limit exceeded on image-upload", {
      userId: user.id,
      limit: rl.limit,
      remaining: rl.remaining,
      reset: rl.reset,
    });
  }

  // Origin/referrer instrumentation (allow-list without blocking)
  const origin = request.headers.get("origin") || "";
  const referrer = request.headers.get("referer") || "";
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, process.env.APP_URL].filter(Boolean) as string[];
  if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
    console.warn("Unexpected origin on image-upload", { origin, referrer, userId: user.id });
  }

  // Server-side credit snapshot (non-blocking)
  try {
    const { data: creditsRow, error: creditsError } = await supabase
      .from("credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();
    if (creditsError) {
      console.warn("Credit lookup failed during image-upload", creditsError);
    } else {
      console.log("Upload authorization snapshot", { userId: user.id, credits: creditsRow?.credits ?? null });
    }
  } catch (e) {
    console.warn("Credit lookup exception during image-upload", e);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const providedName = (formData.get("filename") as string) || file?.name || "image.jpg";

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
    const contentType = file.type || "application/octet-stream";
    if (!allowedTypes.has(contentType)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    const size = (file as any).size as number | undefined;
    if (typeof size === "number" && size > maxSizeBytes) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const sanitized = sanitizeFilename(providedName);
    const unique = `${Date.now()}-${typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2)}`;
    const key = `users/${user.id}/samples/${unique}-${sanitized}`;

    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    await putR2Object(key, body, contentType);

    // Return the R2 key for training usage
    return NextResponse.json({ key });
  } catch (error) {
    console.error("R2 upload failed", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }
}
