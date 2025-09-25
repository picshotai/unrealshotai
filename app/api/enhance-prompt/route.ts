import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Enhance this prompt for better AI image generation: ${prompt}`,
    });

    const enhancedPrompt = response.text;

    if (!enhancedPrompt) {
      throw new Error("No text generated from the model");
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Error:", error);
    let errorMessage = "Failed to enhance prompt";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
