
import PublicHeader from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PricingCards from '@/components/landing/pricing-cards'
import FAQSection from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'

export default function Home() {
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CVFolio',
    description: 'Create a professional resume website that stands out. No coding, no design skills needed. Just upload your PDF and watch the magic happen.',
    url: 'https://DodoStarter.com',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: 'DodoStarter.com',
      url: 'https://DodoStarter.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DodoStarter.com',
      url: 'https://DodoStarter.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://DodoStarter.com/logo.png',
      },
    },
    featureList: [
      'PDF to Website Conversion',
      'Professional Resume Templates',
      'No Coding Required',
      'Instant Website Generation',
      'Mobile Responsive Design',
      'SEO Optimized',
    ],
    screenshot: 'https://DodoStarter.com/og.png',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      <PublicHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PricingCards />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
