# Model Deletion from Supabase — Simple Reference

This document explains, in simple words, how and when trained models are deleted from Supabase, how many days they are kept, and what triggers the deletion.

## What gets deleted
- Rows in the `models` table that have expired and meet the cleanup conditions.
- Related rows in `samples` and `images` are automatically removed because of foreign key constraints with `ON DELETE CASCADE`.

## How long are models kept
- Default retention: 14 days.
- Custom models with `auto_extend = true`: the system sets `expires_at` to 30 days from creation.
- Important: The automatic cleanup only deletes models where `auto_extend = false`. If a model has `auto_extend = true`, it is excluded from the auto-deletion job and will be kept (until you disable `auto_extend` or delete it manually).

Where these are set:
- At creation (during training request), `expires_at` is set based on whether the model is custom and whether `auto_extend` is enabled:
  - 14 days default.
  - 30 days if custom and `auto_extend = true`.
- A migration backfilled `expires_at` for existing rows using the same logic and added an index for efficient cleanup queries.

## Conditions for deletion
A model is considered eligible for deletion when all of the following are true:
- `expires_at` is in the past (current time > `expires_at`).
- `status = 'finished'` (only completed models are deleted).
- `auto_extend = false` (models with auto-extend enabled are skipped by the cleanup job).

## What triggers deletion
There is no database-level timer. Deletion happens when one of these endpoints is called:

1) Automated cron endpoint
- Endpoint: `/api/cron/cleanup-models` (supports `GET` and `POST`).
- It calls the shared cleanup function (`cleanupExpiredModels`) which finds expired models matching the conditions above and deletes them.
- Security:
  - `GET` supports a bearer `Authorization: Bearer <CRON_SECRET>` header or a `?key=<CRON_SECRET>` query param.
  - `POST` verifies the Upstash QStash signature header.
- Usage: Schedule this endpoint via Vercel Cron or Upstash QStash to run daily (or at your preferred frequency).

2) Manual admin endpoint
- Endpoint: `/api/cleanup-models`.
- `GET`: returns a list/count of expired models that match the deletion conditions (without deleting).
- `POST`: performs the deletion of expired models.
- Useful for on-demand checks and manual cleanup.

3) User-triggered deletion (clear all models)
- Server action: `clearAllModels()` deletes all models belonging to the authenticated user (not just expired ones). Use with caution.

## Cascading deletes
- `samples` and `images` reference `models(id)` with `ON DELETE CASCADE`. When a model row is deleted, related samples and images are deleted automatically.

## Observability / responses
- Cleanup functions return a deleted count and a list of deleted model IDs/names/expires_at, so you can log or display what was removed.
- If there are no matches, the endpoints return a message indicating that nothing was deleted.

## Notes and safeguards
- Only completed models (`status = 'finished'`) are considered for deletion to avoid removing models that are still training or in an intermediate state.
- Do not expose secrets in client-side code. The cron endpoint supports secure verification via a server-side secret or Upstash signature.
- You can tune your cron frequency based on your storage and cost needs. Daily is a common, simple default.


## Upstash QStash integration 

QStash can be used to trigger the automated cleanup via a signed POST request to your cron endpoint. This adds an extra layer of request authenticity beyond a simple shared secret.

- Endpoint to call: `POST /api/cron/cleanup-models`
- Signature verification: The endpoint verifies the `Upstash-Signature` (or `upstash-signature`) header using the Upstash Receiver and your signing keys.
- Required server-side environment variables:
  - `QSTASH_CURRENT_SIGNING_KEY`
  - `QSTASH_NEXT_SIGNING_KEY` (optional, for key rotation)
- Request body: QStash signs the raw body. The cleanup endpoint reads the raw body (which can be an empty string) and verifies the signature before running the cleanup.

How it fits together:
- If you use QStash, schedule a POST to `https://<your-app>/api/cron/cleanup-models` and include the signature headers (QStash does this automatically).
- If you prefer not to use QStash, you can still use Vercel Cron or any scheduler to call the `GET /api/cron/cleanup-models?key=<CRON_SECRET>` variant.
- Both paths call the same shared cleanup function and produce the same result: expired, non-auto-extended, finished models are deleted with cascades.