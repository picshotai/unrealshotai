// lib/actions/clearModelsAction.ts
"use server"; // Mark this file as server-only

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clearAllModels(_formData: FormData): Promise<void> {
  console.log("[clearAllModels] invoked");
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("[clearAllModels] auth error:", authError);
  }
  console.log("[clearAllModels] current user:", user?.id);
  if (!user?.id) {
    console.error("clearAllModels: No authenticated user found");
    throw new Error("Not authenticated");
  }

  // Pre-check count of models for this user
  const { count: preCount, error: preCountError } = await supabase
    .from("models")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (preCountError) {
    console.error("[clearAllModels] pre-count error:", preCountError);
  }
  console.log("[clearAllModels] models to delete (pre-count):", preCount ?? null);

  const { data: deletedRows, error: deleteError } = await supabase
    .from("models")
    .delete()
    .eq("user_id", user.id)
    .select("id");

  if (deleteError) {
    console.error("Error deleting models:", deleteError);
    throw new Error("Failed to delete models");
  }

  const deletedCount = deletedRows?.length ?? 0;
  console.log("[clearAllModels] deleted rows count:", deletedCount, "; deleted IDs:", deletedRows?.map((r: any) => r.id));

  if (deletedCount === 0) {
    console.warn("[clearAllModels] No models were deleted for user:", user.id, "; This likely means no matching rows found.");
    throw new Error("No models found to delete for your account.");
  }

  console.log("All models have been deleted for user:", user.id);
  // Ensure the models page reflects the latest DB state
  revalidatePath('/dashboard');
}