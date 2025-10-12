import type React from "react"
import type { Metadata } from "next"
import { StructuredData } from "@/components/seo/StructuredData"
import { commonPageMetadata, generateWebApplicationJsonLd } from "@/lib/seo"

export const metadata: Metadata = commonPageMetadata.profilePhotoMaker()

export default function ProfilePhotoMakerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData id="webapp-schema" data={JSON.parse(generateWebApplicationJsonLd())} />
      {children}
    </>
  )
}