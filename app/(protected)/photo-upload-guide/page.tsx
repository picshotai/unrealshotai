import type { Metadata } from "next"
import ImageUploadGuide from "@/components/image-upload-guide"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import FeedbackForm from "@/components/FeedbackForm"

export const metadata: Metadata = {
  title: "Image Upload Guide | Unrealshot AI",
  description: "View your generated AI headshots",
}

export default async function GalleryPage() {
 const supabase = await createClient(); // Use the new utility function with await
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="w-full">
      <ImageUploadGuide />
      <FeedbackForm userId={user.id} />
    </div>
  )
}

