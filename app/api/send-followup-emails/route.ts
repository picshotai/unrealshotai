import { createAdminClient } from "@/utils/supabase/admin"; // Updated import
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

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
        
        <p style="font-size: 16px; margin-top: 12px;">
          I noticed you signed up but haven't started your <strong>AI Personalization</strong> yet.
        </p>

        <p style="font-size: 16px; margin-top: 12px;">
          If you're hesitating, you're probably asking the biggest question: <strong>Will the photo actually look like me?</strong>
        </p>

        <div style="margin: 20px 0; text-align: center;">
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">Here is a real result from a recent user:</p>
            <img src="https://unrealshot.com/best-before-after.png" alt="Before and After AI Photoshoot Example" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
        </div>

        <div style="background:#f0faff; border:1px solid #cce8ff; padding:14px; border-radius:8px; margin:18px 0; color:#111;">
          <p style="font-size: 16px; margin:0 0 6px 0;">
            <strong style="color:#007bff;">Your Purchase is 100% Protected.</strong>
          </p>
          <p style="font-size: 16px; margin:0;">
            We back every pack with our <strong>Quality & Performance Guarantee</strong>. If the professional shots from our packs don't meet your expectations, we'll give you a full refund. <strong>Zero risk for you.</strong>
          </p>
        </div>

        <p style="font-size: 16px; margin-top: 18px;">
          To help you finalize that decision today, here is your limited-time welcome offer:
        </p>
        
        <div style="background:#fff7ed; border:1px solid #ffd3a6; padding:14px; border-radius:8px; margin:18px 0; color:#111;">
          <p style="font-size: 16px; margin:0 0 6px 0;">
            <strong>Limited-Time Offer:</strong>
          </p>
          <p style="font-size: 16px; margin:0;">
            Use code <strong style="color:#ff6a00;">WELCOME15</strong> for <strong15% OFF</strong> any pack. This code **expires in 48 hours.**
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.unrealshot.com/login" style="background-color: #ff6a00; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 6px; display:inline-block;">
            Unlock My Guaranteed Photoshoot
          </a>
        </div>
        
        <p style="font-size: 16px; margin-top: 24px;">
          Any questions about which pack to choose? Just reply to this email!
        </p>
        <p style="font-size: 16px;">
          Warm regards,<br>Harvansh<br>Founder, Unrealshot AI
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        <p>© ${new Date().getFullYear()} Unrealshot AI. All rights reserved. <a href="#" style="color:#ff6a00;">Unsubscribe</a></p>
      </td>
    </tr>
  </table>
</div>
  `;
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

    const { data: users, error } = await supabase.rpc("get_eligible_users");

    if (error) {
      console.error("Supabase RPC error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown Supabase error");
    }


    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No eligible users found" }, { status: 200 });
    }

    for (const user of users) {
      await resend.emails.send({
        from: "Harvansh from Unrealshot AI <support@noreply.unrealshot.com>",
        to: user.email,
        subject: "Your 15% OFF Welcome Code Expires in 48 Hours",
        html: generateEmailHtml(user.email),
      });


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