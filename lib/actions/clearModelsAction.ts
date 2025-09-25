// lib/actions/clearModelsAction.ts
"use server"; // Mark this file as server-only

import { createClient } from '@/utils/supabase/server';

export async function clearAllModels() {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userID = user?.id ?? "";

    const { error } = await supabase
      .from("models")
      .delete()
      .eq("user_id", userID);

    if (error) {
      console.error("Error deleting models:", error);
      throw new Error("Failed to delete models");
    }

    console.log("All models have been deleted.");
    return { success: true };
  } catch (error) {
    console.error("We have an error:", error);
    throw error; // Let the caller handle it
  }
}