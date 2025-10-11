import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import Footer from '@/components/MainFooter'
import { generateBreadcrumbJsonLd, generateMetadata } from '@/lib/seo'
import { MultipleStructuredData } from '@/components/seo/StructuredData'
import { seoUtils } from '@/config/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service',
  description: 'Review the terms and conditions for using UnrealShot AI, our AI headshot generator service.',
  canonical: '/terms',
})

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight font-[var(--font-inter-tight)]">Terms of Service</h1>
            <p className="text-gray-600 mt-3">Review the terms and conditions for using UnrealShot AI.</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="space-y-8 bg-white border rounded-2xl p-5">
            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">1. Introduction</h2>
              <p>
                Welcome to <strong>Unrealshot AI</strong> ("we," "our," "us"). By accessing or using our website at
                <a href="https://www.unrealshot.com" className="text-indigo-600"> https://www.unrealshot.com</a>
                ("Site"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">2. Use of Our Service</h2>
              <p>
                <strong>Unrealshot AI</strong> is an AI-powered headshot generator that allows users to create professional images.
                Users must adhere to all applicable laws and agree not to misuse our services. Any violations of these rules can result in the termination of access to the platform.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">3. Account and User Responsibilities</h2>
              <p>
                To access certain features of the Site, you may need to create an account. You agree to provide accurate and complete information when registering and to keep this information updated.
                Users are responsible for maintaining the confidentiality of their account details and for all activities under their account.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">4. Payment and Credits</h2>
              <p>
                <strong>Unrealshot AI</strong> operates on a credit-based system for using our services. All purchases of credits are final and non-refundable, except as specified in our
                <a href="https://www.unrealshot.com/refund-policy" className="text-indigo-600"> Refund Policy</a>.
                We reserve the right to modify pricing and the terms of credits at any time.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">5. Data Retention and Deletion</h2>
              <p>
                We value your privacy. Data, including photos and generated headshots, is stored for a period of 14 days, after which it is permanently deleted. Users may request the deletion of their data at any time by contacting us at
                <a href="mailto:support@unrealshot.com" className="text-indigo-600"> support@unrealshot.com</a>.
                For more information, please review our
                <a href="https://www.unrealshot.com/privacy-policy" className="text-indigo-600"> Privacy Policy</a>.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">6. Third-Party Services</h2>
              <p>
                <strong>Unrealshot AI</strong> uses third-party services, including the <strong>Astria API</strong> for image generation. By using our service, you agree to be bound by the terms and policies of these third parties.
                Please review <strong>Astria API's</strong> terms at
                <a href="https://www.astria.ai/terms" className="text-indigo-600"> https://www.astria.ai/terms</a>.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, <strong>Unrealshot AI</strong> and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">8. Changes to the Terms</h2>
              <p>
                We reserve the right to update these Terms at any time. Any changes will be posted on this page, with the updated date. Continued use of the Site after any changes constitutes acceptance of those changes.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at
                <a href="mailto:support@unrealshot.com" className="text-indigo-600"> support@unrealshot.com</a>.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">10. Shipping Policy</h2>
              <p>
                UnrealShot AI provides a fully digital service. No physical products are shipped as part of our offerings. All generated images and digital assets are delivered directly to the user's dashboard on our platform. Once a photoshoot is complete, users can download their generated images from the dashboard at any time. Since all products are digital, there are no shipping fees, and delivery is instant upon generation completion.
              </p>
            </div>

            <div className="">
              <h2 className="text-2xl font-bold mb-2 font-[var(--font-inter-tight)]">11. Affiliate Program Disclosure</h2>
              <p>
                We offer an affiliate program that allows users to earn rewards by referring others to <strong>UnrealShot AI</strong>. By participating in the affiliate program, you agree to the following terms:
              </p>
              <ul className="list-disc list-inside pl-5">
                <li>
                  <strong>Referral Tracking:</strong> We may use affiliate tracking cookies to monitor referrals. When someone clicks your referral link and signs up, we track the referral to attribute the reward.
                </li>
                <li>
                  <strong>Earnings & Payouts:</strong> Affiliate earnings will be credited to your account according to our program's rules. You can view your earnings and program details in your affiliate dashboard. Payment terms, minimum payout thresholds, and related conditions may apply.
                </li>
                <li>
                  <strong>Prohibited Practices:</strong> You agree not to engage in deceptive, fraudulent, or unethical practices (e.g., spamming, misleading claims) to generate referrals. Any violation may result in suspension or termination of your affiliate privileges and forfeiture of any unpaid earnings.
                </li>
                <li>
                  <strong>Taxes:</strong> You are responsible for complying with applicable tax laws and regulations on any income earned through the affiliate program.
                </li>
              </ul>
              <p>
                We reserve the right to modify or terminate the affiliate program at any time. Please contact us at
                <a href="mailto:support@unrealshot.com" className="text-indigo-600"> support@unrealshot.com</a> if you have any questions about the affiliate program.
              </p>
            </div>
          </div>
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
                { name: 'Terms', url: seoUtils.generateCanonicalUrl('/terms') },
              ])
            ),
          },
        ]}
      />
    </div>
  )
}
