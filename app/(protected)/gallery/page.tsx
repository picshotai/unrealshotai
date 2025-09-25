import type { Metadata } from "next"
import ImageGallery from "@/components/ImageGallery"
import { createClient } from '@/utils/supabase/server'; // Updated import from utility
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Image Gallery | AI Headshot Generator",
  description: "View your generated AI headshots",
}

export default async function GalleryPage() {
  const supabase = await createClient(); // Use the new utility function with await
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ImageGallery />
    </div>
  )
}

