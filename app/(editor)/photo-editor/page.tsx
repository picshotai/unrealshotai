import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditorClient from "./EditorClient";

export const metadata: Metadata = {
  title: "Photo Editor | Unrealshot AI",
  description: "Edit photos with drawing, text, arrows, masking and AI generation.",
};

export default async function PhotoEditorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-[calc(100vh-6rem)] bg-white overflow-hidden">
      <EditorClient />
    </div>
  );
}