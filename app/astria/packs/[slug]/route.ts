import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";

// Set dynamic route handling
export const dynamic = "force-dynamic";

// Environment Variables
const API_KEY = process.env.ASTRIA_API_KEY;
const DOMAIN = "https://api.astria.ai";

// Check if API Key is missing
if (!API_KEY) {
  throw new Error("MISSING API_KEY!");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Get the pack slug from params (await required in Next.js 15)
    const { slug } = await params;

    // 2. First check if API key exists
    if (!API_KEY) {
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 }
      );
    }

    // 3. Verify user authentication
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Extract pack ID from slug (assuming slug is the pack ID)
    const packId = slug;

    // 5. Make API request to get specific pack details
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };


    const response = await axios.get(`${DOMAIN}/p/${packId}`, {
      headers,
      validateStatus: (status) => status < 500, // Handle 4xx errors gracefully
    });

    if (response.status === 404) {
      return NextResponse.json(
        { message: "Pack not found" },
        { status: 404 }
      );
    }

    if (response.status !== 200) {
      return NextResponse.json(
        { message: "Failed to fetch pack details" },
        { status: response.status }
      );
    }

    console.log("Pack details fetched successfully:", response.data);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching pack details:", error);

    // More detailed error handling
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { message: "Invalid API key or unauthorized access to Astria API" },
          { status: 401 }
        );
      }
      if (error.response?.status === 403) {
        return NextResponse.json(
          { message: "Access forbidden - check API key permissions" },
          { status: 403 }
        );
      }
      if (error.response?.status === 404) {
        return NextResponse.json(
          { message: "Pack not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to fetch pack details from Astria API" },
      { status: 500 }
    );
  }
}