import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";

// Set dynamic route handling
export const dynamic = "force-dynamic";

// Environment Variables
const API_KEY = process.env.ASTRIA_API_KEY;
const QUERY_TYPE = process.env.PACK_QUERY_TYPE || "gallery"; // Default to 'gallery' for public packs
const DOMAIN = "https://api.astria.ai";

// Check if API Key is missing
if (!API_KEY) {
  throw new Error("MISSING API_KEY!");
}

export async function GET(request: Request) {
  try {
    // 1. First check if API key exists
    if (!API_KEY) {
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 }
      );
    }

    // 2. Verify user authentication
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Make API request with proper headers
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const endpoints = [];
    
    // Add user's own packs if requested
    if (QUERY_TYPE === "users" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/packs`);
    }
    
    // Add gallery packs (public packs) if requested
    if (QUERY_TYPE === "gallery" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/gallery/packs`);
    }

    const responses = await Promise.all(
      endpoints.map(async (url) => {
        try {
          const response = await axios.get(url, {
            headers,
            validateStatus: (status) => status < 500, // Handle 4xx errors gracefully
          });
          return response;
        } catch (error) {
          console.error(`Error fetching from ${url}:`, error);
          return { data: [] }; // Return empty array on error
        }
      })
    );

    // Combine all successful responses
    const combinedData = responses
      .filter(response => response.data && Array.isArray(response.data))
      .flatMap((response) => response.data);

    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching packs:", error);

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
    }

    return NextResponse.json(
      { message: "Failed to fetch packs from Astria API" },
      { status: 500 }
    );
  }
}