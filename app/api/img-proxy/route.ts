import { NextResponse } from "next/server";
import { getR2ObjectStream } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // use Node runtime for streaming

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const download = url.searchParams.get("download") === "true";

    if (!key) {
      return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
    }

    const { body, contentType, contentLength, lastModified } = await getR2ObjectStream(key);

    // If object not found, getR2ObjectStream will throw; catch below

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400", // cache for 1 day
    };
    if (contentLength) headers["Content-Length"] = String(contentLength);
    if (lastModified) headers["Last-Modified"] = lastModified;
    if (download) headers["Content-Disposition"] = `attachment; filename=\"${key.split("/").pop()}\"`;

    // body may be a Node.js Readable stream; Next Response can take it via a Web ReadableStream
    // Convert Node stream to Web ReadableStream if needed
    let streamBody: any = body;
    if (body && typeof (body as any).pipe === "function") {
      const nodeStream = body as NodeJS.ReadableStream;
      const reader = nodeStream as any;
      // Minimal adapter: rely on Next.js handling Node streams; if issues occur, consider web-stream conversion
      streamBody = nodeStream as any;
    }

    return new Response(streamBody as any, { headers });
  } catch (err: any) {
    const code = err?.$metadata?.httpStatusCode || 500;
    const message = err?.name === "NoSuchKey" || code === 404 ? "Not found" : "Internal server error";
    const status = message === "Not found" ? 404 : 500;
    console.error("img-proxy error", { err });
    return NextResponse.json({ error: message }, { status });
  }
}