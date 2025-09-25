import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const imageUrl = searchParams.get("url")
  const isDownload = searchParams.get("download") === "true"

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse(null, { status: 404 })
      }
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      )
    }
    
    const blob = await response.blob()
    const headers: Record<string, string> = {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
    }

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="image.jpg"`
    }

    return new NextResponse(blob, { headers })
  } catch (error) {
    console.error("Error proxying image:", error)
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 })
  }
}