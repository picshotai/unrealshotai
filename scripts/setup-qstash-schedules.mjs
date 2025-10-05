/* Postbuild script: Upsert QStash schedules for production */

async function main() {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  if (env !== "production") {
    console.log("[QStash] Skipping schedule setup (env:", env, ")");
    return;
  }

  const token = process.env.QSTASH_TOKEN;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!token) throw new Error("Missing QSTASH_TOKEN");
  if (!base) throw new Error("Missing NEXT_PUBLIC_BASE_URL or NEXT_PUBLIC_APP_URL");
  if (!cronSecret) throw new Error("Missing CRON_SECRET");

  // IMPORTANT: base must be your deployed HTTPS domain (QStash cannot call localhost)
  const cleanupDestination = `${base}/api/cron/cleanup-models?key=${cronSecret}`;
  const followupDestination = `${base}/api/send-followup-emails?key=${cronSecret}`;

  async function upsertSchedule(destination, cron, scheduleId) {
    const url = `https://qstash.upstash.io/v2/schedules/${destination}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Upstash-Cron": cron,
        "Upstash-Schedule-Id": scheduleId,
      },
    });
    const bodyText = await res.text();
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = { raw: bodyText };
    }
    console.log(`[QStash] Upsert ${scheduleId}:`, res.status, body);
    if (!res.ok) {
      throw new Error(`[QStash] Failed to upsert ${scheduleId}: ${res.status} ${bodyText}`);
    }
  }

  // Schedule 1: Daily cleanup at 02:00 UTC
  await upsertSchedule(cleanupDestination, "0 2 * * *", "cleanup-models");

  // Schedule 2: Follow-up emails every 2 days at 00:00 UTC
  await upsertSchedule(followupDestination, "0 0 */2 * *", "send-followup-emails");

  console.log("[QStash] Schedules upserted successfully.");
}

main().catch((err) => {
  console.error("[QStash] Schedule setup error:", err);
  process.exit(1);
});