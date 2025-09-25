import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/utils/supabase/admin"; // Updated import

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;
const resendSenderEmail = process.env.RESEND_SENDER_EMAIL;

if (!resendApiKey) {
  console.warn(
    "We detected that the RESEND_API_KEY is missing from your environment variables. The app should still work but email notifications will not be sent. Please add your RESEND_API_KEY to your environment variables if you want to enable email notifications."
  );
}

if (!supabaseUrl) {
  throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL!");
}

if (!supabaseServiceRoleKey) {
  throw new Error("MISSING SUPABASE_SERVICE_ROLE_KEY!");
}

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

if (!resendSenderEmail) {
  throw new Error("MISSING RESEND_SENDER_EMAIL!");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type TuneData = {
  id: number;
  title: string;
  name: string;
  steps: null;
  trained_at: null;
  started_training_at: null;
  created_at: string;
  updated_at: string;
  expires_at: null;
};

const getEmailTemplate = () => `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Model Ready</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        em {
            font-style: italic;
            font-weight:bold;
            color: #ff4500;
        }
        strong {
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3730a3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #e43f00;
        }
        .footer {
            padding: 5px;
            border-top: 1px solid #e5e5e5;
            margin-top: 30px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
  <div class="container">
    <h1>Model Training Success</h1>
    <p><em>Great news!</em> Your AI model has successfully completed training and is now ready for action!</p>  
    <a href="https://www.unrealshot.com/trained-models" class="cta-button">Launch Your Dashboard →</a>
    <div class="footer">
        <p><small>This is an automated message. Please do not reply directly.</small></p>
        <p>©${new Date().getFullYear()} Unrealshot AI</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: Request) {
  const supabase = createAdminClient(); // Updated client

  try {
    const incomingData = (await request.json()) as { tune: TuneData };
    const { tune } = incomingData;

    const urlObj = new URL(request.url);
    const user_id = urlObj.searchParams.get("user_id");
    const model_id = urlObj.searchParams.get("model_id");
    const webhook_secret = urlObj.searchParams.get("webhook_secret");

    if (!model_id) {
      return NextResponse.json(
        { message: "Malformed URL, no model_id detected!" },
        { status: 500 }
      );
    }

    if (!webhook_secret) {
      return NextResponse.json(
        { message: "Malformed URL, no webhook_secret detected!" },
        { status: 500 }
      );
    }

    if (webhook_secret.toLowerCase() !== appWebhookSecret?.toLowerCase()) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    if (!user_id) {
      return NextResponse.json(
        { message: "Malformed URL, no user_id detected!" },
        { status: 500 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(user_id);

    if (userError || !user) {
      return NextResponse.json(
        { message: userError?.message || "Unauthorized" },
        { status: 401 }
      );
    }

    if (resend && user.email) {
      await resend.emails.send({
        from: resendSenderEmail!,
        to: user.email,
        subject: "Your model was successfully trained!",
        html: getEmailTemplate(),
      });
    }

    const { error: modelUpdatedError } = await supabase
      .from("models")
      .update({
        modelId: String(tune.id),
        status: "finished",
      })
      .eq("id", Number(model_id))
      .select();

    if (modelUpdatedError) {
      console.error({ modelUpdatedError });
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "success" },
      { status: 200, statusText: "Success" }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}