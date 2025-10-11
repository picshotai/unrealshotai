import type React from "react"
import type { Metadata } from "next"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateWebApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Profile Photo Maker - UnrealShot AI",
  description: "Create and customize profile pictures with filters, borders, backgrounds, and text. Export your image with ease.",
}

export default function ProfilePhotoMakerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData id="webapp-schema" data={JSON.parse(generateWebApplicationJsonLd())} />
      {children}
    </>
  )
}