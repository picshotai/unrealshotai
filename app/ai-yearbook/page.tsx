
import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/landing/ai-yearbook/HeroSection'
import NewHowItWorks from '@/components/landing/NewHowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PremiumComparison from "@/components/landing/Comparison";
import StylePacks from '@/components/landing/StylePacks';
import PricingCards from '@/components/landing/pricing-cards'
import FAQSection from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { generateMetadata, generateLandingPageWebApplicationJsonLd } from '@/lib/seo'
import { pageSEO } from '@/config/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import  Footer  from '@/components/MainFooter'
import TestimonialSection from "@/components/landing/Testimonial";
import PrivacySection from "@/components/landing/PrivacySection";

const pageConfig = pageSEO.landingPages['ai-yearbook'];

export const metadata: Metadata = generateMetadata({
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
  canonical: '/ai-yearbook',
});

export default function AIYearbookPage() {
  const webAppJsonLd = generateLandingPageWebApplicationJsonLd('ai-yearbook');

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
      <StructuredData data={JSON.parse(webAppJsonLd)} />
    </div>
  )
}