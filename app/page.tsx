
import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import NewHowItWorks from '@/components/landing/NewHowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PremiumComparison from "@/components/landing/Comparison";
import StylePacks from '@/components/landing/StylePacks';
import PricingCards from '@/components/landing/pricing-cards'
import FAQSection from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { commonPageMetadata, generateWebApplicationJsonLd } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import  Footer  from '@/components/MainFooter'
import TestimonialSection from "@/components/landing/Testimonial";


export const metadata: Metadata = commonPageMetadata.home()

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <NewHowItWorks />
        <StylePacks />
        <PremiumComparison />
        <TestimonialSection />
        <FeaturesSection />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      {/* WebApplication Schema - Home Page Only */}
      <StructuredData data={JSON.parse(generateWebApplicationJsonLd())} />
    </div>
  )
}