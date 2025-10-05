import { createAdminClient } from "@/utils/supabase/admin"; // Updated import
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

// V2 launch email template
function generateEmailHtml(email: string) {
  const name = email.split("@")[0];
  return `
    <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 24px; color:#111;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #eee;">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <h1 style="color: #111; margin: 0; font-size: 24px;">Unrealshot AI</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; color: #111;">
            <p style="font-size: 16px; margin: 0;">Hi ${name},</p>
            <p style="font-size: 16px; margin-top: 12px;">We’re excited to announce Unrealshot AI V2 — our most improved version yet.</p>
            <p style="font-size: 16px; margin-top: 12px;">
              We’ve introduced many new <strong>pre‑made styled shoots</strong> (earlier there were fewer) to help you create the most <strong>realistic photoshoot</strong> results with less effort.
            </p>
            <p style="font-size: 16px; margin-top: 12px;">
              Pick a style, upload your photos, and get studio‑quality images in minutes.
            </p>
            <div style="background:#fff7ed; border:1px solid #ffd3a6; padding:14px; border-radius:8px; margin:18px 0; color:#111;">
              <p style="font-size: 16px; margin:0 0 6px 0;"><strong>V2 Launch Exclusive</strong></p>
              <p style="font-size: 16px; margin:0;">Use code <strong style="color:#ff6a00;">V2ULTIMATE</strong> for <strong>20% OFF</strong> on both plans — $9.99 and $17.99.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.unrealshot.com/login" style="background-color: #ff6a00; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 6px; display:inline-block;">
                Claim 20% Off — Use V2ULTIMATE
              </a>
            </div>
            <p style="font-size: 16px;">Have questions or want feedback on your shots? Reply anytime at <a href="mailto:support@unrealshot.com" style="color:#ff6a00;">support@unrealshot.com</a>.</p>
            <p style="font-size: 16px;">Welcome to Unrealshot V2 — the most realistic photoshoot generator.</p>
            <p style="font-size: 16px;">Warm regards,<br>Harvansh</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>© ${new Date().getFullYear()} Unrealshot AI. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function GET(request: Request) {
  const supabase = createAdminClient(); // Updated client

  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (key !== process.env.CRON_SECRET) {
    console.log("Authorization failed: Invalid or missing key:", key);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting email processing...");
    console.log("Fetching eligible users...");

    const { data: users, error } = await supabase
      .rpc("get_eligible_users");

    if (error) {
      console.error("Supabase RPC error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown Supabase error");
    }

    console.log("Users found:", users ? users.length : 0);

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No eligible users found" }, { status: 200 });
    }

    for (const user of users) {
      console.log("Sending email to:", user.email);
      await resend.emails.send({
        from: "Harvansh from Unrealshot AI <support@noreply.unrealshot.com>",
        to: user.email,
        subject: "Unrealshot AI V2 Launch: 20% off with code V2ULTIMATE",
        html: generateEmailHtml(user.email),
      });

      console.log("Logging email for user:", user.id);
      await supabase.from("one_day_followup_emails").insert({
        user_id: user.id,
      });
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Failed to process emails", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify Upstash signature (QStash POST calls will include this)
    const signature =
      request.headers.get("Upstash-Signature") ||
      request.headers.get("upstash-signature") ||
      "";

    const body = await request.text(); // QStash signs the raw body (may be empty string)

    if (!receiver.verify({ body, signature })) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Proceed with the same logic as GET, but skip CRON_SECRET check since signature is valid
    const supabase = createAdminClient();
    const resend = new Resend(process.env.RESEND_API_KEY!);

    console.log("Starting email processing (QStash verified)...");
    console.log("Fetching eligible users...");

    const { data: users, error } = await supabase.rpc("get_eligible_users");

    if (error) {
      console.error("Supabase RPC error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown Supabase error");
    }

    console.log("Users found:", users ? users.length : 0);

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No eligible users found" }, { status: 200 });
    }

    for (const user of users) {
      console.log("Sending email to:", user.email);
      await resend.emails.send({
        from: "Harvansh from Unrealshot AI <support@noreply.unrealshot.com>",
        to: user.email,
        subject: "Unrealshot AI V2 Launch: 20% off with code V2ULTIMATE",
        html: generateEmailHtml(user.email),
      });

      console.log("Logging email for user:", user.id);
      await supabase.from("one_day_followup_emails").insert({
        user_id: user.id,
      });
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Detailed error (POST):", error);
    return NextResponse.json(
      { error: "Failed to process emails", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}