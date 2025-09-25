
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

type BioRequest = {
  name: string;
  currentRole: string;
  experience: string;
  skills: string;
  goals: string;
};

type PostRequest = {
  topic: string;
  keyPoints: string;
  tone: string;
  callToAction: string;
};

type HeadlineRequest = {
  currentRole: string;
  keySkills: string;
  industry: string;
  uniqueValue: string;
};

type InstagramBioRequest = {
  name: string;
  occupation: string;
  interests: string;
  personality: string;
  callToAction: string;
};

type InstagramCaptionRequest = {
  topic: string;
  mood: string;
  hashtags: string;
  callToAction: string;
};

type Request =
  | BioRequest
  | PostRequest
  | HeadlineRequest
  | InstagramBioRequest
  | InstagramCaptionRequest;

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Rate limiting settings (adjust as needed)
const REQUEST_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60000 * 5;
const requestCounts: { [ip: string]: number } = {};
const requestTimestamps: { [ip: string]: number[] } = {};

async function moderateContent(content: string): Promise<boolean> {
  const lowerCaseContent = content.toLowerCase();
  const bannedWords = [
    "suicide", "kill", "murder", "die", "death", "fuck", "deachild sex", "kid fuck", "fucking", "curvy lady", "nude girl",
    "abuse", "assault", "attack", "violent", "weapon", "kid", "molest", "dick", "suck my cock", "terrorist", 
    "explicit", "nude", "naked", "sex", "porn",
    "drug", "cocaine", "heroin", "meth",
    "terrorist", "bomb", "explosion",
  ];// Add more words as needed
  for (const word of bannedWords) {
    if (lowerCaseContent.includes(word)) {
      return false;
    }
  }

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config: {
        safetySettings: safetySettings,
      },
    });
    
    // Check both promptFeedback and candidate-level safety feedback
    const blockedByPrompt = result.promptFeedback?.blockReason === "SAFETY";
    const blockedByCandidate = result.candidates?.some(c => c.finishReason === "SAFETY");
    return !blockedByPrompt && !blockedByCandidate;
  } catch (error) {
    console.error("Error in content moderation:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const body: Request & { tool?: string } = await request.json();
  let { tool, ...data } = body;

  if (!tool) {
    tool = "linkedinBio";
  }

  // Moderate user input
  const userInputString = JSON.stringify(data);
  const isInputSafe = await moderateContent(userInputString);

  if (!isInputSafe) {
    return NextResponse.json(
      { error: "Your input contains inappropriate content. Please revise and try again." },
      { status: 400 },
    );
  }

  // Rate limiting check
  const now = Date.now();
  if (!requestCounts[ip]) {
    requestCounts[ip] = 0;
    requestTimestamps[ip] = [];
  }

  requestTimestamps[ip] = requestTimestamps[ip].filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  );

  if (requestTimestamps[ip].length >= REQUEST_LIMIT) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  requestCounts[ip]++;
  requestTimestamps[ip].push(now);

  let messages;

  switch (tool) {
    case "linkedinBio":
      messages = createLinkedInBioMessages(data as BioRequest);
      break;
    case "linkedinPost":
      messages = createLinkedInPostMessages(data as PostRequest);
      break;
    case "linkedinHeadline":
      messages = createLinkedInHeadlineMessages(data as HeadlineRequest);
      break;
    case "instagramBio":
      messages = createInstagramBioMessages(data as InstagramBioRequest);
      break;
    case "instagramCaption":
      messages = createInstagramCaptionMessages(data as InstagramCaptionRequest);
      break;
    default:
      return NextResponse.json({ error: "Invalid tool specified" }, { status: 400 });
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: messages.map(message => ({
        parts: [{ text: message.parts }],
        role: message.role,
      })),
      config: {
        maxOutputTokens: 1000,
      },
    });

    const content = result.text || "";

    const isOutputSafe = await moderateContent(content);

    if (!isOutputSafe) {
      return NextResponse.json(
        { error: "The generated content did not pass our moderation check. Please try again with different input." },
        { status: 400 },
      );
    }

    switch (tool) {
      case "linkedinBio":
        return NextResponse.json({ linkedinbio: content });
      case "instagramBio":
        return NextResponse.json({ bio: content });
      case "linkedinPost":
        return NextResponse.json({ post: content });
      case "linkedinHeadline":
        return NextResponse.json({ headline: content });
      case "instagramCaption":
        return NextResponse.json({ caption: content });
      default:
        return NextResponse.json({ content: content });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: `An error occurred while generating the ${tool}.` },
      { status: 500 },
    );
  }
}


function createLinkedInBioMessages(data: BioRequest) {
  const { name, currentRole, experience, skills, goals } = data;
  return [
    { role: "user", parts: `Generate a professional LinkedIn bio for ${name}. 
      Current role: ${currentRole}. 
      Experience: ${experience}. 
      Skills: ${skills}. 
      Career goals: ${goals}.
      The bio should be concise, engaging, and highlight the person's unique value proposition.` },
  ];
}

function createLinkedInPostMessages(data: PostRequest) {
  const { topic, keyPoints, tone, callToAction } = data;
  return [
    { role: "user", parts: `Generate a compelling LinkedIn post about ${topic}. 
      Key points to include: ${keyPoints}. 
      Desired tone: ${tone}. 
      Call to action: ${callToAction}.
      The post should be engaging, informative, and encourage interaction from the audience.` },
  ];
}

function createLinkedInHeadlineMessages(data: HeadlineRequest) {
  const { currentRole, keySkills, industry, uniqueValue } = data;
  return [
    { role: "user", parts: `Generate a compelling LinkedIn headline. 
      Current role: ${currentRole}. 
      Key skills: ${keySkills}. 
      Industry: ${industry}. 
      Unique value proposition: ${uniqueValue}.
      The headline should be concise, impactful, and highlight the person's professional identity and value.` },
  ];
}

function createInstagramBioMessages(data: InstagramBioRequest) {
  const { name, occupation, interests, personality, callToAction } = data;
  return [
    { role: "user", parts: `Generate an engaging Instagram bio for ${name}. 
      Occupation: ${occupation}. 
      Interests: ${interests}. 
      Personality: ${personality}. 
      Call to action: ${callToAction}.
      The bio should be concise, creative, and reflect the user's personality while adhering to Instagram's 150 character limit.` },
  ];
}

function createInstagramCaptionMessages(data: InstagramCaptionRequest) {
  const { topic, mood, hashtags, callToAction } = data;
  return [
    { role: "user", parts: `Generate an engaging Instagram caption about ${topic}. 
      Mood: ${mood}. 
      Hashtags to include: ${hashtags}. 
      Call to action: ${callToAction}.
      The caption should be catchy, relevant to the topic, and encourage engagement. Include emojis where appropriate.` },
  ];
}