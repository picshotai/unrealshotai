import { createClient } from '@/utils/supabase/server';
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { apiRateLimit, checkRateLimit } from "@/utils/rate-limit";

// Configure Vercel Blob (#7 step in the README)
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

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
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string
        /* clientPayload?: string, */
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        if (!user) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            userId: user.id, // Including the user ID in the token payload
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
        console.log("blob upload completed", blob, tokenPayload);

        // Validate token payload consistency (non-blocking)
        try {
          const parsed = tokenPayload ? JSON.parse(tokenPayload as string) : null;
          const payloadUserId = parsed?.userId;
          if (payloadUserId && payloadUserId !== user.id) {
            console.warn("Token payload user mismatch on image-upload", {
              payloadUserId,
              userId: user.id,
              blobUrl: blob.url,
            });
          }
        } catch (err) {
          console.warn("Invalid tokenPayload JSON on image-upload", err);
        }

        // Validate content-type and size (non-blocking)
        const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
        const contentType = (blob as any)?.contentType || (blob as any)?.type || "";
        if (contentType && !allowedTypes.has(contentType)) {
          console.warn("Unexpected contentType on uploaded blob", {
            contentType,
            blobUrl: blob.url,
          });
        }
        const size = (blob as any)?.size;
        if (typeof size === "number") {
          const maxSizeBytes = 15 * 1024 * 1024; // 15MB
          if (size > maxSizeBytes) {
            console.warn("Uploaded blob exceeds recommended size", {
              size,
              maxSizeBytes,
              blobUrl: blob.url,
            });
          }
        }

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
