import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Profile Photo Maker | Create Professional Profile Pictures - UnrealShot AI",
  description:
    "Create stunning profile pictures with easy-to-use Profile Photo Maker powered by Unrealshot AI. Customize borders, backgrounds, and more for the perfect professional headshot.",
  openGraph: {
    title: "Free Profile Photo Maker | Create Professional Profile Pictures - UnrealShot AI",
    description:
      "Create stunning profile pictures with easy-to-use Profile Photo Maker powered by Unrealshot AI. Customize borders, backgrounds, and more for the perfect professional headshot.",
    images: [
      {
        url: "/images/og-img.png", // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "Profile Photo Maker Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Profile Photo Maker | Create Professional Profile Pictures - UnrealShot AI",
    description:
      "Create stunning profile photos with our easy-to-use Profile Photo Maker powered by Unrealshot AI. Customize borders, backgrounds, and more for the perfect professional headshot.",
    images: ["/images/og-img.png"], // Replace with your actual Twitter image path
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Profile Photo Maker",
            description:
              "Create stunning profile photos with our easy-to-use Profile Photo Maker powered by Unrealshot AI. Customize borders, backgrounds, and more for the perfect professional headshot.",
            applicationCategory: "PhotographyApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            provider: {
                "@type": "Organization",
                name: "UnrealShot AI",
                url: "https://www.unrealshot.com",
              },
              featureList: [
                "Professional headshot generation",
                "Custom background editing",
                "Border customization",
                "Multiple photo styles",
                "Instant download",
              ],
              screenshot: "https://www.unrealshot.com/images/og-img.ong", // Replace with actual screenshot
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
                bestRating: "5",
                worstRating: "1",
              },
          }),
        }}
      />
      {children}
    </>
  )
}

