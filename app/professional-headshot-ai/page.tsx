import { Metadata } from 'next'
import Script from 'next/script';
import FirstSection from "@/components/FirstSection";
import PremiumComparison from '@/components/PremiumComparison';
import FourthSection from "@/components/fourth-section";
import PricingSection from "@/components/LandingPricing";
import FifthSection from "@/components/fifth-section";
import ProfessionalPageContent from "@/components/Content/ProfessionalHeadshotContent";
import HeadshotPage from "@/components/Content/HeadshotContent";
import HowItWorks from "@/components/NewHowItWorks";
import FinalCTA from "@/components/final-cta";



export const metadata: Metadata = {
  title: "#1 AI Headshot Generator | Create Most Realistic Headshots with Unrealshot AI",
  description: "Create professional, high-quality AI-generated headshots in minutes with UnrealShot AI, our easy-to-use AI headshot generator. Perfect for businesses and individuals looking to elevate their profile with stunning, custom portraits.",
  openGraph: {
    title: "#1 AI Headshot Generator | Create Most Realistic Headshots with Unrealshot AI",
    description: "Create professional, high-quality AI-generated headshots in minutes with UnrealShot AI, our easy-to-use AI headshot generator.",
    url: "https://www.unrealshot.com",
    siteName: "UnrealShot AI",
    images: [
      {
        url: "https://www.unrealshot.com/content/screenshot.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
}

export default function Page() {
  return (
    <>
      <Script id="schema-combined" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": "https://www.unrealshot.com/professional-headshot-ai#webpage",
              "url": "https://www.unrealshot.com/professional-headshot-ai",
              "name": "#1 AI Headshot Generator | Create Most Realistic Headshots with Unrealshot AI",
              "description": "Create professional, high-quality AI-generated headshots in minutes with UnrealShot AI, our easy-to-use AI headshot generator. Perfect for businesses and individuals looking to elevate their profile with stunning, custom portraits.",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://www.unrealshot.com/#website",
                "name": "UnrealShot AI",
                "url": "https://www.unrealshot.com/professional-headshot-ai",
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://www.unrealshot.com/content/screenshot.png"
              },
              "inLanguage": "en-US"
            },
            {
              "@type": "SoftwareApplication",
              "name": "#1 AI Headshot Generator | Create Most Realistic Headshots with Unrealshot AI",
              "url": "https://www.unrealshot.com/professional-headshot-ai",
              "applicationCategory": "PhotographyApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available, paid plans start at $20"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.6",
                "reviewCount": "992"
              },
              "author": {
                "@type": "Organization",
                "name": "UnrealShot AI",
                "url": "https://www.unrealshot.com"
              }
            }
          ]
        })}
      </Script>

      <div>
        <FirstSection />
       <HowItWorks />
       <PremiumComparison />
        <HeadshotPage />
        <FourthSection />
        <PricingSection />
        <ProfessionalPageContent />
        <FifthSection />
        <FinalCTA />
      </div>
    </>
  )
}

