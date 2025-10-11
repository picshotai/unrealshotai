import type React from "react"
import type { Metadata } from "next"
import { StructuredData } from "@/components/seo/StructuredData"

export const metadata: Metadata = {
  title: "Error - UnrealShot AI",
  description: "Oops! Something went wrong. Please try again or go home.",
}

const errorPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Error - UnrealShot AI",
  "description": "Oops! Something went wrong. Please try again or go home.",
  "url": "https://www.unrealshot.com/error",
}

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData id="error-schema" data={errorPageSchema} />
      {children}
    </>
  )
}