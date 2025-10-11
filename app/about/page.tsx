import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/MainFooter'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'
import Link from 'next/link'
import { Button } from "@/components/ui/button"



export const metadata: Metadata = generateMetadata({
  title: 'About Us',
  description:
    'Learn more about the journey and team behind Unrealshot AI, the AI headshot generator helping users create professional-grade headshots worldwide.',
  canonical: '/about',
})

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight font-[var(--font-inter-tight)]">About Unrealshot AI</h1>
            <p className="text-gray-600 mt-3">Our journey, mission, and the people behind the product.</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="space-y-8 bg-white border rounded-2xl p-5">
            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">Our Journey</h2>
              <p className="text-gray-700">
                We are a small team of passionate developers, self-learned, and driven by curiosity. Hailing from India,
                our journey into the tech world started in a rather unconventional way—through blogging. Back then, we were
                just eager to share our thoughts, tips, and insights with the world, covering everything from tech tutorials
                to life hacks. It was our way of staying connected to the ever-evolving world of technology.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">The Spark of AI</h2>
              <p className="text-gray-700">
                As with any journey, we soon found ourselves intrigued by something bigger: Artificial Intelligence. AI had
                this magical quality—it was reshaping industries, changing the way people interacted with technology, and making
                the impossible possible. We dove into it headfirst, testing AI tools, tinkering with algorithms, and experimenting
                with different use cases. The more we explored, the more fascinated we became.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">The Birth of Unrealshot AI</h2>
              <p className="text-gray-700">
                One evening, after weeks of brainstorming and countless cups of coffee, it hit us—what if AI could make something
                as personal as a headshot? What if you didn’t need an expensive photographer or a studio setup to get that
                professional, polished look? That’s when Unrealshot AI was born.
              </p>
              <p className="text-gray-700 mt-3">
                We wanted to build something that made it effortless for people to present themselves in the best light, whether
                for their LinkedIn profile, job applications, or business websites. So, we started developing an AI headshot
                generator that could do just that—deliver high-quality, professional-grade images in just a few clicks.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">Empowering People</h2>
              <p className="text-gray-700">
                This wasn’t just about the tech. It was about empowerment. We believe everyone deserves a professional-looking
                headshot, whether you're starting your career or running a business. Our goal has always been to make AI accessible,
                practical, and—most importantly—beneficial for people.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">Today and Tomorrow</h2>
              <p className="text-gray-700">
                Today, Unrealshot AI is serving users worldwide, helping them create stunning and professional AI headshots that
                look like they’ve been shot in a studio. From freelancers looking to stand out, to business owners crafting a
                professional brand, we’re proud to be a part of your journey.
              </p>
              <p className="text-gray-700 mt-3">
                Our story is far from over. We continue to innovate, improve, and grow with every bit of feedback we receive. But
                at the heart of everything we do is the same passion that started it all—an unshakable belief in the power of
                technology to make life a little easier, and a lot more creative.
              </p>
            </div>

            <div className="bg-[#F7F5F3] border rounded-2xl p-5">
              <p className="text-gray-800 font-medium">Thank you for trusting us with your image. We look forward to seeing where this adventure takes us next!</p>
              <p className="text-gray-700 mt-4">Warm regards,<br/>The Unrealshot AI Team</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-12 text-center">
          <h3 className="text-xl font-bold mb-3 font-[var(--font-inter-tight)]">Want to talk?</h3>
          <p className="text-gray-600 mb-6">We’re happy to answer any questions.</p>
         <Link href="mailto:support@unrealshot.com">
              <Button
                className="text-md sm:text-md font-semibold py-5 sm:py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12"
              >
                Contact us
                <div className="bg-white rounded-sm p-2 sm:p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Button>
            </Link>
        </section>
      </main>
      <Footer />

      {/* Structured Data */}
      <MultipleStructuredData
        schemas={[
          {
            id: 'breadcrumb',
            data: JSON.parse(
              generateBreadcrumbJsonLd([
                { name: 'Home', url: seoUtils.generateCanonicalUrl('/') },
                { name: 'About', url: seoUtils.generateCanonicalUrl('/about') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}
