
import { Metadata } from 'next'
import PublicHeader from '@/components/Header'

import PricingCards from '@/components/landing/pricing-cards'

import { commonPageMetadata, generateWebApplicationJsonLd } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import  Footer  from '@/components/MainFooter'

export const metadata: Metadata = commonPageMetadata.home()

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <PricingCards />
      
      </main>
      <Footer />
      {/* WebApplication Schema - Home Page Only */}
      <StructuredData data={JSON.parse(generateWebApplicationJsonLd())} />
    </div>
  )
}