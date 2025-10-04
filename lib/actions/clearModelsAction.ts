// lib/actions/clearModelsAction.ts
"use server"; // Mark this file as server-only

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function clearAllModels(_formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) {
    console.error("clearAllModels: No authenticated user found");
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("models")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting models:", error);
    throw new Error("Failed to delete models");
  }

  console.log("All models have been deleted for user:", user.id);
  // Ensure the models page reflects the latest DB state
  revalidatePath('/trained-models');
}