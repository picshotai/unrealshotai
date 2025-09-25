import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif, Inter_Tight } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import ErrorBoundary from "@/components/error-boundary"
import { generateMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/seo/StructuredData"
import { 
  generateOrganizationJsonLd, 
  generateWebsiteJsonLd
} from "@/lib/seo"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
})


export const metadata: Metadata = generateMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${interTight.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&display=swap" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional favicon sizes for better compatibility */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon.svg" />
        
        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DodoStarter" />
        
        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#000000" />
        
        {/* Organization Schema - Global */}
        <StructuredData 
          id="organization-schema"
          data={JSON.parse(generateOrganizationJsonLd())}
        />
        {/* Website Schema - Global */}
        <StructuredData 
          id="website-schema"
          data={JSON.parse(generateWebsiteJsonLd())}
        />
        {/* Note: WebApplication schema is page-specific and added only to home page */}
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
