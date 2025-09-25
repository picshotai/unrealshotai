
import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PricingCards from '@/components/landing/pricing-cards'
import FAQSection from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { commonPageMetadata, generateWebApplicationJsonLd } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'

export const metadata: Metadata = commonPageMetadata.home()

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      
      {/* WebApplication Schema - Home Page Only */}
      <StructuredData data={JSON.parse(generateWebApplicationJsonLd())} />
    </div>
  )
}