import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkle, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - UnrealShot AI",
  description: "Discover affordable pricing options for professional AI-generated headshots at UnrealShot AI.",
}

export default function PricingSection() {
  return (
    <div className="bg-gray-50 text-gray-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute  inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Pro-Level AI Photos
            <br />
            Without the High Costs
          </h2>

          <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-2 border border-indigo-200">
            <ShieldCheck className="w-5 h-5 text-indigo-700" />
            <span className="text-indigo-700 font-medium">100% Satisfaction Guarantee</span>
          </div>

          <p className="text-gray-600 text-lg max-w-xl">
            Not satisfied with your photos or headshots? We've got you covered. Simply request a refund, and we'll
            handle the rest—no questions asked!
          </p>
        </div>

        {/* Right Column - Pricing Card */}
        <div className="relative">
          {/* Floating Offer Badge */}
          <div className="absolute -top-4 right-4 z-10">
            <div className="bg-indigo-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              FLAT 70% OFF
            </div>
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-3xl blur-sm opacity-30" />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Sparkle className="w-5 h-5 text-indigo-700" />
              <h2 className="font-semibold text-lg sm:text-xl text-gray-900">Most Realistic AI Photo Generator</h2>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">No Hidden Fees, No Subscriptions</h3>

              <p className="text-gray-600">
                Why pay <strong>₹10,000+ for a traditional photoshoot</strong> when Unrealshot AI offers the same
                professional quality for lowest price in the market?
              </p>

              {/* Pricing - Redesigned for better responsiveness */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">$9.99</span>
                      <span className="text-xl text-gray-500">or</span>
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹880</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">/20 Photos</span>
                      <span className="text-sm text-gray-400 line-through">$23/₹1999</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">For anyone looking to improve their social media look</p>
                </div>
              </div>
              {/* CTA Button */}
              <Link
                href="/login"
                className="w-full bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 group transition-all duration-200"
              >
                <span className="font-semibold">Get Your AI Photos Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
          ))}
        </div>
        <p>
          Looking for <strong>Bulk Image Generation</strong>? If you need a large number of AI-generated images, we
          offer customized pricing and packages. <a href="/contact-us">Contact us</a> to discuss your requirements!
        </p>
      </div>
    </div>
  )
}

