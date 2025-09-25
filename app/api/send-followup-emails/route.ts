import { createAdminClient } from "@/utils/supabase/admin"; // Updated import
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
        subject: "Discover a new way to bring your memories together",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <table align="center" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #ddd;">
              <tr>
                <td style="background-color: #3F51B5; padding: 15px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Unrealshot AI</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #333;">
                  <p style="font-size: 16px; margin: 0;">Hi ${user.email.split("@")[0]},</p>
                  <p style="font-size: 16px;">I'm Harvansh, the founder of Unrealshot AI. I hope you're doing well.</p>
                  <p style="font-size: 16px;">
                    I noticed you signed up a couple of days ago and I'm excited to share our new <strong>Multiperson Photo Generator</strong>—Now you can generate awesome AI photos with you and a friend, partner, or co-founder in one shot.
                  </p>
                  <p style="font-size: 16px;">
                    I built this feature to help you capture moments in a way that feels natural and fun.
                  </p>
                  <p style="font-size: 16px;">
                    To celebrate, we're excited to have you as part of the Unrealshot community.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.unrealshot.com/login" style="background-color: #3F51B5; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 4px;">
                      Get Your AI Photos
                    </a>
                  </div>
                  <p style="font-size: 16px;">
                    I can’t wait to hear what you think about the multi-person feature. If you have any questions or want to share your creations, mail me at <a href="mailto:support@unrealshot.com">support@unrealshot.com</a>.
                  </p>
                  <p style="font-size: 16px;">Your feedback helps us keep making Unrealshot AI even better.</p>
                  <p style="font-size: 16px;">Warm regards,<br>Harvansh</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #333;">
                  <p style="font-size: 14px; color: #777;">P.S. Our discount code is as friendly as your favorite barista – here to brighten your day (and your photos) with a wink!</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                  <p>© ${new Date().getFullYear()} Unrealshot AI. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>
        `,
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