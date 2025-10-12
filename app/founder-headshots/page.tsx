import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/landing/founder-headshots/HeroSection'
import NewHowItWorks from '@/components/landing/NewHowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PremiumComparison from '@/components/landing/Comparison'
import StylePacks from '@/components/landing/StylePacks'
import PricingCards from '@/components/landing/pricing-cards'
import FAQSection from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { commonPageMetadata, generateLandingPageWebApplicationJsonLd } from '@/lib/seo'
import { pageSEO } from '@/config/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import Footer from '@/components/MainFooter'
import TestimonialSection from '@/components/landing/Testimonial'
import PrivacySection from '@/components/landing/PrivacySection'

const pageConfig = pageSEO.landingPages['founder-headshots'];

export const metadata: Metadata = commonPageMetadata.landingPage('founder-headshots')

export default function FounderHeadshotsPage() {
  const webAppSchema = generateLandingPageWebApplicationJsonLd('founder-headshots')

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <NewHowItWorks />
        <StylePacks />
        <PremiumComparison />
        <TestimonialSection />
        <PrivacySection />
        <FeaturesSection />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <StructuredData data={JSON.parse(webAppSchema)} />
    </div>
  )
}